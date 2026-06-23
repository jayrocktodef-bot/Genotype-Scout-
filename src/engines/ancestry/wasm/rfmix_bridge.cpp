#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <iostream>

using namespace emscripten;

class RFMixEngine {
public:
    RFMixEngine() {}

    // Accepts a JS Float32Array of phased SNPs and a Float32Array of reference frequencies
    val processChromosome(val js_snps, val js_refs, int num_snps, int num_populations) {
        
        // 1. Convert JavaScript Float32Arrays to C++ std::vectors safely
        std::vector<float> snps = vecFromJSArray<float>(js_snps);
        std::vector<float> refs = vecFromJSArray<float>(js_refs);
        std::vector<float> results(num_snps * num_populations, 0.0f);

        // 2. THE CORE ALGORITHM (Placeholder for RFMIX CRF Math)
        // This is executed at native speed.
        for (int i = 0; i < num_snps; i++) {
            for (int p = 0; p < num_populations; p++) {
                // Placeholder: In a full port, the CRF smoothing/forward-backward logic happens here
                int index = (i * num_populations) + p;
                results[index] = snps[i] * 0.5f + refs[p] * 0.5f; 
            }
        }

        // 3. Return the result as a JavaScript typed array view of the C++ memory
        return val(typed_memory_view(results.size(), results.data()));
    }

private:
    // Helper to extract JS typed arrays into C++ vectors
    template<typename T>
    std::vector<T> vecFromJSArray(val v) {
        std::vector<T> rv;
        const auto l = v["length"].as<unsigned>();
        rv.resize(l);
        
        // Map the JS memory to the C++ vector
        val memory = val::module_property("HEAPF32"); 
        val memoryView = v["constructor"].new_(memory["buffer"], v["byteOffset"], l);
        val::global("Float32Array").new_(memory["buffer"]).call<void>("set", memoryView, val(rv.data()));
        
        return rv;
    }
};

// Bind the class to JavaScript
EMSCRIPTEN_BINDINGS(rfmix_module) {
    class_<RFMixEngine>("RFMixEngine")
        .constructor<>()
        .function("processChromosome", &RFMixEngine::processChromosome);
}
