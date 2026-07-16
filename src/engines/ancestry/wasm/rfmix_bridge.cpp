#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <stdexcept>
#include <algorithm>
#include <numeric>
#include <cmath>

using namespace emscripten;

class RFMixEngine {
public:
    RFMixEngine() {}

    /**
     * HMM forward-backward smoothing logic.
     * Exposes smooth() directly on the RFMixEngine instance.
     */
    val smooth(
        val rawProbsVal,
        int nWindows,
        int nPopulations,
        val transitionProbParam
    ) {
        if (nPopulations < 1) {
            throw std::invalid_argument("nPopulations must be positive");
        }

        std::vector<float> probs = vecFromJSArray<float>(rawProbsVal);
        if (probs.size() != static_cast<size_t>(nWindows) * nPopulations) {
            throw std::invalid_argument("rawProbs length does not match nWindows * nPopulations");
        }

        // Interpret transition probability parameters
        const float DEFAULT_TP = 0.99f;
        bool useArray = false;
        std::vector<float> tpArray;
        float tpSingle = DEFAULT_TP;

        if (transitionProbParam.isUndefined() || transitionProbParam.isNull()) {
            // keep default
        } else if (transitionProbParam.isArray() || transitionProbParam.instanceof(val::global("Float32Array")) || transitionProbParam.instanceof(val::global("Array"))) {
            useArray = true;
            tpArray = vecFromJSArray<float>(transitionProbParam);
        } else {
            tpSingle = transitionProbParam.as<float>();
        }

        std::vector<float> alpha(nWindows * nPopulations, 0.0f);
        std::vector<float> beta(nWindows * nPopulations, 0.0f);
        std::vector<float> smoothed(nWindows * nPopulations, 0.0f);

        // 1. Forward pass
        float sumAlpha0 = 0.0f;
        float initProb = 1.0f / nPopulations;
        for (int p = 0; p < nPopulations; ++p) {
            alpha[p] = probs[p] * initProb;
            sumAlpha0 += alpha[p];
        }
        if (sumAlpha0 > 0.0f) {
            for (int p = 0; p < nPopulations; ++p) alpha[p] /= sumAlpha0;
        }

        for (int i = 1; i < nWindows; ++i) {
            float tp = useArray ? (i - 1 < static_cast<int>(tpArray.size()) ? tpArray[i - 1] : DEFAULT_TP) : tpSingle;
            float sp = (nPopulations > 1) ? (1.0f - tp) / (nPopulations - 1) : 0.0f;

            float sumAlpha = 0.0f;
            const int iOff = i * nPopulations;
            const int prevOff = (i - 1) * nPopulations;

            for (int p = 0; p < nPopulations; ++p) {
                float transitionSum = 0.0f;
                for (int prevP = 0; prevP < nPopulations; ++prevP) {
                    float t = (p == prevP) ? tp : sp;
                    transitionSum += alpha[prevOff + prevP] * t;
                }
                alpha[iOff + p] = probs[iOff + p] * transitionSum;
                sumAlpha += alpha[iOff + p];
            }
            if (sumAlpha > 0.0f) {
                for (int p = 0; p < nPopulations; ++p) alpha[iOff + p] /= sumAlpha;
            }
        }

        // 2. Backward pass
        const int lastOff = (nWindows - 1) * nPopulations;
        for (int p = 0; p < nPopulations; ++p) {
            beta[lastOff + p] = initProb;
        }

        for (int i = nWindows - 2; i >= 0; --i) {
            float tp = useArray ? (i < static_cast<int>(tpArray.size()) ? tpArray[i] : DEFAULT_TP) : tpSingle;
            float sp = (nPopulations > 1) ? (1.0f - tp) / (nPopulations - 1) : 0.0f;

            float sumBeta = 0.0f;
            const int iOff = i * nPopulations;
            const int nextOff = (i + 1) * nPopulations;

            for (int p = 0; p < nPopulations; ++p) {
                float transitionSum = 0.0f;
                for (int nextP = 0; nextP < nPopulations; ++nextP) {
                    float t = (p == nextP) ? tp : sp;
                    transitionSum += beta[nextOff + nextP] * probs[nextOff + nextP] * t;
                }
                beta[iOff + p] = transitionSum;
                sumBeta += beta[iOff + p];
            }
            if (sumBeta > 0.0f) {
                for (int p = 0; p < nPopulations; ++p) beta[iOff + p] /= sumBeta;
            }
        }

        // 3. Combine
        for (int i = 0; i < nWindows; ++i) {
            float windowSum = 0.0f;
            const int off = i * nPopulations;
            for (int p = 0; p < nPopulations; ++p) {
                smoothed[off + p] = alpha[off + p] * beta[off + p];
                windowSum += smoothed[off + p];
            }
            if (windowSum > 0.0f) {
                for (int p = 0; p < nPopulations; ++p) smoothed[off + p] /= windowSum;
            }
        }

        // Return copy-free views as Float32Array to Javascript (copies elements safely on JS side construction)
        return val::global("Float32Array").new_(
            typed_memory_view(smoothed.size(), smoothed.data())
        );
    }

    /**
     * Backward-compatible processChromosome method.
     * Maps to smooth() with a default/fallback transition probability parameter.
     */
    val processChromosome(
        val js_snps, 
        val js_refs, 
        int num_snps, 
        int num_populations
    ) {
        // Fallback smooth wrapper
        // If js_refs is passed, we can extract its first element as a base transition parameter
        // or just default to 0.99f.
        val defaultTP = val(0.99f);
        return smooth(js_snps, num_snps, num_populations, defaultTP);
    }
};

EMSCRIPTEN_BINDINGS(rfmix_module) {
    class_<RFMixEngine>("RFMixEngine")
        .constructor<>()
        .function("smooth", &RFMixEngine::smooth)
        .function("processChromosome", &RFMixEngine::processChromosome);
}
