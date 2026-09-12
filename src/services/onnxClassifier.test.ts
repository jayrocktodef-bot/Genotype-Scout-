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
    expect(metadata.n_features).toBe(1197);
    expect(metadata.features.length).toBe(1197);
    expect(metadata.altAlleles.length).toBe(1197);
    expect(metadata.n_classes).toBe(7);
    expect(metadata.classes).toContain('European');
    expect(metadata.classes).toContain('African');
    expect(metadata.classes).toContain('Indigenous_American');
  });

  it('extracts exactly 1197 features from user genotype map', async () => {
    const metadata = await getClassifierMetadata();
    const fakeGenotype: Record<string, string> = {};
    
    // Populate 5 known features from the metadata
    for (let i = 0; i < 5; i++) {
      const rsid = metadata.features[i];
      const alt = metadata.altAlleles[i];
      fakeGenotype[rsid] = `${alt}${alt}`; // homozygous alternate
    }

    const featureVector = extractOnnxFeatureMatrix(
      fakeGenotype,
      metadata.features,
      metadata.altAlleles
    );

    expect(featureVector).toBeInstanceOf(Float32Array);
    expect(featureVector.length).toBe(1197);
    expect(featureVector[0]).toBe(2.0);
    expect(featureVector[1]).toBe(2.0);
    expect(featureVector[2]).toBe(2.0);
    expect(featureVector[10]).toBe(0.0); // missing marker defaults to 0.0
  });

  it('initializes ONNX session and runs inference returning probabilities, topK, entropy', async () => {
    const session = await initializeOnnxModel();
    expect(session).toBeDefined();

    const dummyFeatures = new Float32Array(1197);
    const result = await runOnnxClassifier(dummyFeatures);

    expect(result).toBeDefined();
    expect(typeof result.population).toBe('string');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.probabilities).toBeDefined();
    expect(result.topK).toBeDefined();
    expect(result.topK?.length).toBe(7);
    expect(typeof result.entropy).toBe('number');
    expect(typeof result.ambiguous).toBe('boolean');
  });
});
