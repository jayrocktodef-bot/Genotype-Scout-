import unittest
import tempfile
from ega_latin_america.supplementary_parser import OpenAccessSupplementaryParser


class TestSupplementaryParser(unittest.TestCase):
    def test_fallback_metadata_generation(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            parser = OpenAccessSupplementaryParser(data_dir=tmp_dir)
            meta = parser.load_samples_metadata()

            self.assertEqual(len(meta), 128)
            sample_1 = meta.get("EGAS1664_IND_001")
            self.assertIsNotNone(sample_1)
            self.assertIn("population", sample_1)
            self.assertIn("regional_cluster", sample_1)
            self.assertIn("linguistic_family", sample_1)
            self.assertEqual(sample_1["coverage"], "44x")

    def test_published_aims_loading(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            parser = OpenAccessSupplementaryParser(data_dir=tmp_dir)
            aims = parser.load_published_aims()

            self.assertIn("rs3827072", aims)
            self.assertEqual(aims["rs3827072"]["gene"], "EDAR")


if __name__ == "__main__":
    unittest.main()
