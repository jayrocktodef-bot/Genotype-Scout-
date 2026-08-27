import json
import unittest
import tempfile
from pathlib import Path
from ega_latin_america.ega_client import EGAClientWrapper


class TestEGAClientWrapper(unittest.TestCase):
    def test_credentials_validation(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            creds_file = Path(tmp_dir) / "credentials.json"
            client = EGAClientWrapper(credentials_file=str(creds_file))
            self.assertFalse(client.validate_credentials())

            creds_data = {"ega_user": "test_user", "ega_password": "test_password"}
            with open(creds_file, "w") as f:
                json.dump(creds_data, f)

            self.assertTrue(client.validate_credentials())

    def test_parse_pyega3_files_output(self):
        client = EGAClientWrapper(credentials_file="dummy.json")
        mock_output = "EGAF000001 sample1.vcf.gz 1048576 abcdef1234567890abcdef1234567890\n"
        files = client._parse_pyega3_files_output(mock_output)
        self.assertEqual(len(files), 1)
        self.assertEqual(files[0]["file_id"], "EGAF000001")
        self.assertEqual(files[0]["file_name"], "sample1.vcf.gz")
        self.assertEqual(files[0]["md5"], "abcdef1234567890abcdef1234567890")


if __name__ == "__main__":
    unittest.main()
