import { pipeline, env, Pipeline } from '@xenova/transformers';

// Configure transformers.js to load from our local public/models directory
env.localModelPath = '/models/';
env.allowLocalModels = true;
env.useBrowserCache = false; // Disable cache for debugging
env.allowRemoteModels = false;
env.backends.onnx.wasm.numThreads = 1;
// Explicitly specify CDN for wasm binaries to prevent 404s
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/';

let classifier: Pipeline | null = null;

// Handle messages from the main thread
self.addEventListener('message', async (event) => {
    const { action, text } = event.data;

    try {
        if (action === 'initialize') {
            self.postMessage({ status: 'progress', progress: 10, message: 'Loading model engine...' });
            
            classifier = (await pipeline('token-classification', 'nlp', {
                local_files_only: true,
                quantized: false, // Forces model.onnx instead of model_quantized.onnx
                progress_callback: (x: any) => {
                    self.postMessage({ 
                        status: 'progress', 
                        progress: Math.round((x.loaded / x.total) * 100) || 50,
                        message: `Downloading ${x.file || 'model files'}...` 
                    });
                }
            })) as any;
            
            self.postMessage({ status: 'ready', message: 'Model Initialized' });
        }

        if (action === 'scan' && classifier) {
            // Run inference
            self.postMessage({ status: 'analyzing', message: 'Scanning literature...' });
            
            const results = await classifier(text);
            
            // results is an array of objects: { entity_group, score, word, start, end }
            self.postMessage({ status: 'complete', results });
        }
        
    } catch (error: any) {
        self.postMessage({ status: 'error', error: error.message || String(error) });
    }
});
