import gzip
import json
import unittest
import tempfile
from pathlib import Path
from ega_latin_america.schema_formatter import GenotypeScoutSchemaFormatter


class TestSchemaFormatter(unittest.TestCase):
    def test_schema_formatting_and_compression(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            config = {
                "dataset_info": {
                    "dataset_accession": "EGAD50000002396",
                    "study_accession": "EGAS50000001664",
                    "sample_count": 128,
                    "population_count": 45,
                    "linguistic_families": 28
                },
                "regional_clusters": ["Mesoamerica", "Andes"]
            }

            formatter = GenotypeScoutSchemaFormatter(dataset_config=config, output_dir=tmp_dir)

            mock_snps = {
                "rs3827072": {
                    "chr": "2",
                    "pos_grch38": 108883025,
                    "ref": "A",
                    "alt": "G",
                    "fst_global": 0.6,
                    "regionalFrequencies": {"Mesoamerica": 0.95},
                    "subFrequencies": {"Maya": 0.98},
                    "llr_weights": {"Mesoamerica": 3.2}
                }
            }

            out_json = formatter.export_reference_matrix(mock_snps, output_filename="test_ref.json")

            self.assertTrue(out_json.exists())
            with open(out_json, "r") as f:
                data = json.load(f)

            self.assertIn("_metadata", data)
            self.assertEqual(data["_metadata"]["dataset_accession"], "EGAD50000002396")
            self.assertEqual(data["_metadata"]["total_snps"], 1)
            self.assertIn("rs3827072", data["snps"])

            out_bin = Path(tmp_dir) / "test_ref.bin.gz"
            self.assertTrue(out_bin.exists())

            with gzip.open(out_bin, "rb") as gz:
                decompressed = json.loads(gz.read().decode("utf-8"))
            self.assertEqual(decompressed["_metadata"]["dataset_accession"], "EGAD50000002396")


if __name__ == "__main__":
    unittest.main()
