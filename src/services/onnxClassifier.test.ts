import { describe, it, expect } from 'vitest';
import {
  initializeOnnxModel,
  getClassifierMetadata,
  extractOnnxFeatureMatrix,
  runOnnxClassifier
} from './ancestryEngine';

describe('ONNX Ancestry Classifier Service', () => {
  it('loads metadata sidecar with 1,197 features and 7 calibrated classes', async () => {
    const metadata = await getClassifierMetadata();
    expect(metadata).toBeDefined();
    expect(metadata.n_features).toBeGreaterThan(20);
    expect(metadata.features.length).toBe(metadata.n_features);
    expect(metadata.featureAlleles.length).toBe(metadata.n_features);
    expect(metadata.n_classes).toBeGreaterThanOrEqual(4);
    expect(metadata.classes).toContain('European');
    expect(metadata.classes).toContain('African');
  });

  it('extracts exactly 1197 features from user genotype map', async () => {
    const metadata = await getClassifierMetadata();
    const fakeGenotype: Record<string, string> = {};
    
    // Populate 5 known features from the metadata
    for (let i = 0; i < 5; i++) {
      const rsid = metadata.features[i];
      const alt = metadata.featureAlleles[i];
      fakeGenotype[rsid] = `${alt}${alt}`; // homozygous alternate
    }

    const featureVector = extractOnnxFeatureMatrix(
      fakeGenotype,
      metadata
    );

    expect(featureVector).toBeInstanceOf(Float32Array);
    expect(featureVector.length).toBe(metadata.n_features);
    expect(featureVector[0]).toBe(2.0);
    expect(featureVector[1]).toBe(2.0);
    expect(featureVector[2]).toBe(2.0);
    expect(featureVector[10]).toBe(metadata.imputeMeans?.[10] ?? 0.0); // missing marker defaults to mean
  });

  it('initializes ONNX session and runs inference returning probabilities, topK, entropy', async () => {
    const session = await initializeOnnxModel();
    expect(session).toBeDefined();

    const metadata = await getClassifierMetadata();
    const dummyFeatures = new Float32Array(metadata.n_features);
    const result = await runOnnxClassifier(dummyFeatures);

    expect(result).toBeDefined();
    expect(typeof result.population).toBe('string');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.probabilities).toBeDefined();
    expect(result.topK).toBeDefined();
    expect(result.topK?.length).toBeGreaterThanOrEqual(4);
    expect(typeof result.entropy).toBe('number');
    expect(typeof result.ambiguous).toBe('boolean');
  });
});
