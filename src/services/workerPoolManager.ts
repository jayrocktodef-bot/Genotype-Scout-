/**
 * @license
 * Written In The Genome
 * WorkerPoolManager: Centralized Thread Pool Supervisor
 * Enforces hard concurrency limits, task queuing with priorities, heartbeat tracking,
 * timeout guards, and worker recycling to prevent browser lockup and mobile OOM.
 */

export type TaskPriority = 'HIGH' | 'NORMAL' | 'LOW';

export interface PoolTaskOptions {
  priority?: TaskPriority;
  timeoutMs?: number;
  transfer?: Transferable[];
}

export interface PoolTask<Req = any, Res = any> {
  id: string;
  req: Req;
  priority: TaskPriority;
  timeoutMs: number;
  transfer?: Transferable[];
  resolve: (res: Res) => void;
  reject: (err: Error) => void;
  timer?: ReturnType<typeof setTimeout>;
  startedAt?: number;
}

export interface WorkerHandle {
  id: string;
  worker: Worker;
  busy: boolean;
  activeTaskId: string | null;
  startedAt: number;
  lastHeartbeat: number;
  tasksCompleted: number;
}

export interface WorkerPoolMetrics {
  totalWorkers: number;
  idleWorkers: number;
  busyWorkers: number;
  pendingTasks: number;
  completedTasks: number;
  timedOutTasks: number;
  recycledWorkers: number;
  maxConcurrency: number;
}

export class WorkerPoolManager<Req = any, Res = any> {
  private workers: WorkerHandle[] = [];
  private taskQueue: PoolTask<Req, Res>[] = [];
  private inFlightTasks = new Map<string, PoolTask<Req, Res>>();
  
  private nextTaskId = 1;
  private readonly maxConcurrency: number;
  private readonly maxTasksPerWorker: number;
  private readonly defaultTimeoutMs: number;
  private isDisposed = false;

  // Telemetry metrics
  private totalCompleted = 0;
  private totalTimedOut = 0;
  private totalRecycled = 0;

  constructor(
    private readonly workerFactory: () => Worker,
    options?: {
      maxConcurrency?: number;
      maxTasksPerWorker?: number;
      defaultTimeoutMs?: number;
    }
  ) {
    // Detect hardware & memory limits safely
    const hwConcurrency = typeof navigator !== 'undefined' && (navigator as any).hardwareConcurrency 
      ? Number((navigator as any).hardwareConcurrency) 
      : 4;
    const deviceMem = typeof navigator !== 'undefined' && (navigator as any).deviceMemory 
      ? Number((navigator as any).deviceMemory) 
      : 8;

    // Mobile / low-memory guard: cap at 2 workers if <= 4GB RAM, otherwise max 4
    const memoryCap = deviceMem <= 4 ? 2 : 4;
    this.maxConcurrency = options?.maxConcurrency ?? Math.max(1, Math.min(hwConcurrency, 4, memoryCap));
    this.maxTasksPerWorker = options?.maxTasksPerWorker ?? 100;
    this.defaultTimeoutMs = options?.defaultTimeoutMs ?? 30_000;

    // Automatically idle on background visibility on mobile
    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.inFlightTasks.size === 0) {
          this.scaleDownIdleWorkers();
        }
      }, { passive: true });
    }
  }

  /**
   * Submit a task to the worker pool
   */
  public submit(req: Req, options?: PoolTaskOptions): Promise<Res> {
    if (this.isDisposed) {
      return Promise.reject(new Error('[WorkerPoolManager] Pool has been disposed.'));
    }

    return new Promise<Res>((resolve, reject) => {
      const taskId = `task_${this.nextTaskId++}_${Date.now().toString(36)}`;
      const task: PoolTask<Req, Res> = {
        id: taskId,
        req,
        priority: options?.priority || 'NORMAL',
        timeoutMs: options?.timeoutMs || this.defaultTimeoutMs,
        transfer: options?.transfer,
        resolve,
        reject,
      };

      this.enqueueTask(task);
      this.dispatchNext();
    });
  }

  /**
   * Enqueue task respecting priority (HIGH -> NORMAL -> LOW)
   */
  private enqueueTask(task: PoolTask<Req, Res>): void {
    if (task.priority === 'HIGH') {
      const firstNonHigh = this.taskQueue.findIndex(t => t.priority !== 'HIGH');
      if (firstNonHigh === -1) {
        this.taskQueue.push(task);
      } else {
        this.taskQueue.splice(firstNonHigh, 0, task);
      }
    } else if (task.priority === 'NORMAL') {
      const firstLow = this.taskQueue.findIndex(t => t.priority === 'LOW');
      if (firstLow === -1) {
        this.taskQueue.push(task);
      } else {
        this.taskQueue.splice(firstLow, 0, task);
      }
    } else {
      this.taskQueue.push(task);
    }
  }

  /**
   * Dispatch pending tasks to available or newly spawned workers
   */
  private dispatchNext(): void {
    if (this.isDisposed || this.taskQueue.length === 0) return;

    let handle = this.workers.find(w => !w.busy);
    if (!handle) {
      if (this.workers.length < this.maxConcurrency) {
        handle = this.spawnWorker();
      } else {
        return; // All slots busy; waiting for a worker to finish
      }
    }

    const task = this.taskQueue.shift();
    if (!task) return;

    this.assignTask(handle, task);
  }

  /**
   * Assign a task to an idle worker
   */
  private assignTask(handle: WorkerHandle, task: PoolTask<Req, Res>): void {
    handle.busy = true;
    handle.activeTaskId = task.id;
    handle.startedAt = Date.now();
    handle.lastHeartbeat = Date.now();

    this.inFlightTasks.set(task.id, task);

    // Timeout watchdog
    task.timer = setTimeout(() => {
      this.handleTaskTimeout(handle, task);
    }, task.timeoutMs);

    try {
      handle.worker.postMessage({ id: task.id, ...task.req }, task.transfer || []);
    } catch (err: unknown) {
      this.handleTaskFailure(handle, task, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Spawns a new worker wrapper
   */
  private spawnWorker(): WorkerHandle {
    const worker = this.workerFactory();
    const handleId = `worker_${this.workers.length + 1}_${Math.random().toString(36).substring(2, 6)}`;
    
    const handle: WorkerHandle = {
      id: handleId,
      worker,
      busy: false,
      activeTaskId: null,
      startedAt: 0,
      lastHeartbeat: Date.now(),
      tasksCompleted: 0,
    };

    worker.onmessage = (event: MessageEvent) => {
      this.handleWorkerMessage(handle, event);
    };

    worker.onerror = (event: ErrorEvent) => {
      const errMsg = event.message || 'Unknown Web Worker internal error';
      if (handle.activeTaskId) {
        const task = this.inFlightTasks.get(handle.activeTaskId);
        if (task) {
          this.handleTaskFailure(handle, task, new Error(errMsg));
          return;
        }
      }
      this.recycleWorker(handle);
    };

    this.workers.push(handle);
    return handle;
  }

  /**
   * Handle incoming message from worker
   */
  private handleWorkerMessage(handle: WorkerHandle, event: MessageEvent): void {
    const data = event.data || {};
    
    // Heartbeat handling
    if (data.type === 'HEARTBEAT' || data.type === 'heartbeat') {
      handle.lastHeartbeat = Date.now();
      return;
    }

    const taskId = data.id || data.requestId || handle.activeTaskId;
    if (!taskId) return;

    const task = this.inFlightTasks.get(taskId);
    if (!task) return;

    // Check for error payload
    if (data.type === 'ERROR' || data.error) {
      const err = new Error(data.payload?.message || data.error || 'Worker task failed.');
      this.handleTaskFailure(handle, task, err);
      return;
    }

    // Success response
    if (task.timer) clearTimeout(task.timer);
    this.inFlightTasks.delete(taskId);
    this.totalCompleted++;

    task.resolve(data.payload !== undefined ? data.payload : data.res !== undefined ? data.res : data);

    handle.busy = false;
    handle.activeTaskId = null;
    handle.tasksCompleted++;

    // Recycle worker if completed threshold reached
    if (handle.tasksCompleted >= this.maxTasksPerWorker) {
      this.recycleWorker(handle);
    }

    this.dispatchNext();
  }

  /**
   * Handle task timeout
   */
  private handleTaskTimeout(handle: WorkerHandle, task: PoolTask<Req, Res>): void {
    this.totalTimedOut++;
    const err = new Error(`[WorkerPoolManager] Task ${task.id} timed out after ${task.timeoutMs}ms`);
    this.handleTaskFailure(handle, task, err);
  }

  /**
   * Handle task failure & terminate worker to clean up corrupted state
   */
  private handleTaskFailure(handle: WorkerHandle, task: PoolTask<Req, Res>, error: Error): void {
    if (task.timer) clearTimeout(task.timer);
    this.inFlightTasks.delete(task.id);

    task.reject(error);

    this.recycleWorker(handle);
    this.dispatchNext();
  }

  /**
   * Recycle worker: terminate, remove from pool, and spawn replacement on demand
   */
  private recycleWorker(handle: WorkerHandle): void {
    this.totalRecycled++;
    try {
      handle.worker.terminate();
    } catch (e) {
      console.warn('[WorkerPoolManager] Error terminating worker during recycle:', e);
    }

    this.workers = this.workers.filter(w => w.id !== handle.id);
  }

  /**
   * Scales down idle workers to conserve device memory when app is backgrounded
   */
  private scaleDownIdleWorkers(): void {
    const idle = this.workers.filter(w => !w.busy);
    for (const h of idle) {
      try {
        h.worker.terminate();
      } catch (e) {
        // ignore
      }
    }
    this.workers = this.workers.filter(w => w.busy);
  }

  /**
   * Current telemetry metrics
   */
  public getMetrics(): WorkerPoolMetrics {
    const busyCount = this.workers.filter(w => w.busy).length;
    return {
      totalWorkers: this.workers.length,
      idleWorkers: this.workers.length - busyCount,
      busyWorkers: busyCount,
      pendingTasks: this.taskQueue.length,
      completedTasks: this.totalCompleted,
      timedOutTasks: this.totalTimedOut,
      recycledWorkers: this.totalRecycled,
      maxConcurrency: this.maxConcurrency,
    };
  }

  /**
   * Terminate all workers and reject pending tasks
   */
  public dispose(): void {
    this.isDisposed = true;

    for (const [_, task] of this.inFlightTasks) {
      if (task.timer) clearTimeout(task.timer);
      task.reject(new Error('[WorkerPoolManager] Pool disposed.'));
    }
    this.inFlightTasks.clear();

    for (const task of this.taskQueue) {
      task.reject(new Error('[WorkerPoolManager] Pool disposed before execution.'));
    }
    this.taskQueue = [];

    for (const handle of this.workers) {
      try {
        handle.worker.terminate();
      } catch (e) {
        // ignore
      }
    }
    this.workers = [];
  }
}
