/**
 * @license
 * Written In The Genome
 * Unit tests for WorkerPoolManager
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WorkerPoolManager } from './workerPoolManager';

// Mock Worker implementation for node/vitest environment
class MockWorker {
  public onmessage: ((e: MessageEvent) => void) | null = null;
  public onerror: ((e: ErrorEvent) => void) | null = null;
  public terminated = false;
  public messagesReceived: any[] = [];

  constructor(private behavior?: (worker: MockWorker, data: any) => void) {}

  postMessage(data: any) {
    this.messagesReceived.push(data);
    if (this.behavior) {
      this.behavior(this, data);
    } else {
      // Default: echo back after a tick
      setTimeout(() => {
        if (!this.terminated && this.onmessage) {
          this.onmessage(new MessageEvent('message', {
            data: { id: data.id, payload: { result: 'echo', input: data } }
          }));
        }
      }, 5);
    }
  }

  terminate() {
    this.terminated = true;
  }
}

describe('WorkerPoolManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('respects hard concurrency limit and completes all queued tasks', async () => {
    let activeWorkers = 0;
    let maxObservedWorkers = 0;

    const manager = new WorkerPoolManager(
      () => {
        return new MockWorker((worker, data) => {
          activeWorkers++;
          if (activeWorkers > maxObservedWorkers) {
            maxObservedWorkers = activeWorkers;
          }
          setTimeout(() => {
            activeWorkers--;
            if (worker.onmessage) {
              worker.onmessage(new MessageEvent('message', {
                data: { id: data.id, payload: { done: true, taskId: data.id } }
              }));
            }
          }, 10);
        }) as any;
      },
      { maxConcurrency: 2 }
    );

    const taskPromises = [
      manager.submit({ test: 1 }),
      manager.submit({ test: 2 }),
      manager.submit({ test: 3 }),
      manager.submit({ test: 4 }),
    ];

    expect(manager.getMetrics().maxConcurrency).toBe(2);

    // Fast-forward fake timers through task executions
    await vi.advanceTimersByTimeAsync(50);

    const results = await Promise.all(taskPromises);
    expect(results).toHaveLength(4);
    expect(maxObservedWorkers).toBeLessThanOrEqual(2);
    expect(manager.getMetrics().completedTasks).toBe(4);

    manager.dispose();
  });

  it('dispatches HIGH priority tasks before NORMAL and LOW priority tasks', async () => {
    const executedOrder: string[] = [];

    const manager = new WorkerPoolManager(
      () => {
        return new MockWorker((worker, data) => {
          setTimeout(() => {
            executedOrder.push(data.tag);
            if (worker.onmessage) {
              worker.onmessage(new MessageEvent('message', {
                data: { id: data.id, payload: data.tag }
              }));
            }
          }, 10);
        }) as any;
      },
      { maxConcurrency: 1 } // Serial execution to strictly observe queue order
    );

    // First task starts immediately and ties up the single worker
    const p1 = manager.submit({ tag: 'first' }, { priority: 'NORMAL' });

    // Submit remaining while worker is busy
    const pLow = manager.submit({ tag: 'low' }, { priority: 'LOW' });
    const pNormal = manager.submit({ tag: 'normal' }, { priority: 'NORMAL' });
    const pHigh = manager.submit({ tag: 'high' }, { priority: 'HIGH' });

    await vi.advanceTimersByTimeAsync(100);
    await Promise.all([p1, pLow, pNormal, pHigh]);

    // Order should be: 'first' (already running), then 'high', then 'normal', then 'low'
    expect(executedOrder).toEqual(['first', 'high', 'normal', 'low']);

    manager.dispose();
  });

  it('handles task timeouts and recycles the deadlocked worker', async () => {
    let workerSpawnCount = 0;

    const manager = new WorkerPoolManager(
      () => {
        workerSpawnCount++;
        return new MockWorker((_worker, data) => {
          if (data.stall) {
            // Intentionally never respond
            return;
          }
          setTimeout(() => {
            _worker.onmessage?.(new MessageEvent('message', {
              data: { id: data.id, payload: 'ok' }
            }));
          }, 5);
        }) as any;
      },
      { maxConcurrency: 1, defaultTimeoutMs: 500 }
    );

    // Submit stalled task
    const stalledPromise = manager.submit({ stall: true }, { timeoutMs: 200 });

    // Advance past timeout
    const advancePromise = vi.advanceTimersByTimeAsync(300);
    await expect(stalledPromise).rejects.toThrow('timed out after 200ms');
    await advancePromise;

    expect(manager.getMetrics().timedOutTasks).toBe(1);
    expect(manager.getMetrics().recycledWorkers).toBe(1);

    // Submit next task to verify pool recovers with new spawned worker
    const nextPromise = manager.submit({ stall: false });
    await vi.advanceTimersByTimeAsync(20);
    const nextResult = await nextPromise;

    expect(nextResult).toBe('ok');
    expect(workerSpawnCount).toBe(2);

    manager.dispose();
  });

  it('recycles workers after reaching maxTasksPerWorker limit', async () => {
    let terminatedWorkers = 0;

    const manager = new WorkerPoolManager(
      () => {
        const w = new MockWorker((worker, data) => {
          setTimeout(() => {
            worker.onmessage?.(new MessageEvent('message', {
              data: { id: data.id, payload: 'done' }
            }));
          }, 5);
        });
        const origTerm = w.terminate.bind(w);
        w.terminate = () => {
          terminatedWorkers++;
          origTerm();
        };
        return w as any;
      },
      { maxConcurrency: 1, maxTasksPerWorker: 2 }
    );

    // Run 3 tasks (should trigger 1 worker recycle after task 2)
    const p1 = manager.submit({ task: 1 });
    await vi.advanceTimersByTimeAsync(10);
    await p1;

    const p2 = manager.submit({ task: 2 });
    await vi.advanceTimersByTimeAsync(10);
    await p2;

    expect(manager.getMetrics().recycledWorkers).toBe(1);
    expect(terminatedWorkers).toBe(1);

    const p3 = manager.submit({ task: 3 });
    await vi.advanceTimersByTimeAsync(10);
    await p3;

    expect(manager.getMetrics().completedTasks).toBe(3);

    manager.dispose();
  });
});
