import unittest
from ega_latin_america.vcf_matrix_converter import VCFReferenceMatrixConverter


class TestVCFMatrixConverter(unittest.TestCase):
    def test_fst_and_llr_calculation(self):
        metadata = {
            "IND1": {"population": "Maya", "regional_cluster": "Mesoamerica"},
            "IND2": {"population": "Maya", "regional_cluster": "Mesoamerica"},
            "IND3": {"population": "Quechua", "regional_cluster": "Andes"},
            "IND4": {"population": "Quechua", "regional_cluster": "Andes"}
        }
        config = {
            "filtering_parameters": {"pseudo_count_epsilon": 1e-4}
        }

        converter = VCFReferenceMatrixConverter(samples_metadata=metadata, dataset_config=config)

        records = [
            {
                "rsid": "rs3827072",
                "chr": "2",
                "pos_grch38": 108883025,
                "ref": "A",
                "alt": "G",
                "global_baseline_freq": 0.05,
                "genotypes": {
                    "IND1": "1/1",
                    "IND2": "1/1",
                    "IND3": "0/0",
                    "IND4": "0/0"
                }
            }
        ]

        result = converter.process_vcf_records(records)
        self.assertIn("rs3827072", result)

        snp = result["rs3827072"]
        self.assertEqual(snp["subFrequencies"]["Maya"], 1.0)
        self.assertEqual(snp["subFrequencies"]["Quechua"], 0.0)
        self.assertEqual(snp["regionalFrequencies"]["Mesoamerica"], 1.0)
        self.assertEqual(snp["regionalFrequencies"]["Andes"], 0.0)
        self.assertGreater(snp["fst_global"], 0.5)
        self.assertGreater(snp["llr_weights"]["Mesoamerica"], 0.0)
        self.assertLess(snp["llr_weights"]["Andes"], 0.0)


if __name__ == "__main__":
    unittest.main()
