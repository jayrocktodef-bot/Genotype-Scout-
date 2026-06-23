#!/bin/bash

# RFMix Wasm Build Script
# This script compiles the C++ bridge into a Wasm module.
# Requires Emscripten (emcc).

echo "🏗️  Compiling RFMix Engine to WebAssembly..."

emcc rfmix_bridge.cpp -O3 \
    -lembind \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s EXPORT_ES6=1 \
    -s MODULARIZE=1 \
    -s ENVIRONMENT="'web,worker'" \
    -o rfmix_engine.js

echo "✅ Build Complete!"
