import json
import os
import hashlib
import subprocess
import logging
from typing import Dict, List, Optional, Any
from pathlib import Path

logger = logging.getLogger("ega_client")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")


class EGAClientWrapper:
    """
    Automated client for European Genome-phenome Archive (EGA) downloads using pyEGA3.
    Manages authorized access for dataset EGAD50000002396 under study EGAS50000001664.
    """

    def __init__(
        self,
        credentials_file: str,
        dataset_id: str = "EGAD50000002396",
        output_dir: str = "./data/raw_vcf",
        max_connections: int = 4
    ):
        self.credentials_file = Path(credentials_file)
        self.dataset_id = dataset_id
        self.output_dir = Path(output_dir)
        self.max_connections = max_connections
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.manifest_file = self.output_dir / "download_manifest.json"
        self.manifest = self._load_manifest()

    def _load_manifest(self) -> Dict[str, Any]:
        if self.manifest_file.exists():
            try:
                with open(self.manifest_file, "r") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning(f"Failed to load download manifest: {e}. Starting fresh manifest.")
        return {"dataset_id": self.dataset_id, "files": {}}

    def _save_manifest(self):
        with open(self.manifest_file, "w") as f:
            json.dump(self.manifest, f, indent=2)

    def validate_credentials(self) -> bool:
        """Verify that credentials file exists and contains required keys."""
        if not self.credentials_file.exists():
            logger.error(f"Credentials file not found at: {self.credentials_file}")
            return False
        try:
            with open(self.credentials_file, "r") as f:
                creds = json.load(f)
            required_keys = ["ega_user", "ega_password"]
            for key in required_keys:
                if key not in creds or not creds[key] or creds[key].startswith("YOUR_"):
                    logger.error(f"Missing or placeholder value for key '{key}' in credentials.")
                    return False
            return True
        except Exception as e:
            logger.error(f"Error reading credentials file: {e}")
            return False

    def list_dataset_files(self) -> List[Dict[str, str]]:
        """
        Use pyega3 CLI to list files in dataset EGAD50000002396.
        Returns a list of dicts with file_id, file_name, file_size, and md5.
        """
        if not self.validate_credentials():
            logger.warning("Credentials invalid or not configured. Returning empty file list or mock list if testing.")
            return []

        cmd = [
            "pyega3",
            "-cf", str(self.credentials_file),
            "files",
            self.dataset_id
        ]
        logger.info(f"Querying EGA for dataset files: {' '.join(cmd)}")
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            files = self._parse_pyega3_files_output(res.stdout)
            logger.info(f"Retrieved {len(files)} files for dataset {self.dataset_id}")
            return files
        except subprocess.CalledProcessError as e:
            logger.error(f"pyega3 failed with error: {e.stderr}")
            return []
        except FileNotFoundError:
            logger.error("pyega3 executable not found on PATH. Please install pyega3 (`pip install pyega3`).")
            return []

    def _parse_pyega3_files_output(self, output_text: str) -> List[Dict[str, str]]:
        """Parse text output of `pyega3 files <dataset_id>`."""
        files = []
        lines = output_text.strip().split("\n")
        for line in lines:
            parts = line.strip().split()
            if len(parts) >= 3 and parts[0].startswith("EGAF"):
                file_id = parts[0]
                file_name = parts[1]
                file_size = parts[2] if len(parts) > 2 else "0"
                md5 = parts[3] if len(parts) > 3 else ""
                files.append({
                    "file_id": file_id,
                    "file_name": file_name,
                    "file_size": file_size,
                    "md5": md5
                })
        return files

    def verify_md5(self, file_path: Path, expected_md5: str) -> bool:
        """Calculates MD5 hash of a local file and compares against expected checksum."""
        if not file_path.exists() or not expected_md5:
            return False
        logger.info(f"Verifying MD5 checksum for {file_path.name}...")
        md5_hash = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                md5_hash.update(chunk)
        calc_md5 = md5_hash.hexdigest()
        is_match = calc_md5.lower() == expected_md5.lower()
        if is_match:
            logger.info(f"✅ MD5 match for {file_path.name} ({calc_md5})")
        else:
            logger.error(f"❌ MD5 mismatch for {file_path.name}: computed {calc_md5}, expected {expected_md5}")
        return is_match

    def fetch_file(self, file_id: str, file_name: str, expected_md5: str = "", max_retries: int = 3) -> bool:
        """
        Download a single file from EGA using pyega3 with auto-retry and MD5 validation.
        """
        dest_path = self.output_dir / file_name

        # Check if already completed in manifest
        if file_id in self.manifest["files"] and self.manifest["files"][file_id].get("status") == "completed":
            if dest_path.exists():
                logger.info(f"File {file_name} already completed in manifest. Skipping.")
                return True

        cmd = [
            "pyega3",
            "-cf", str(self.credentials_file),
            "fetch",
            file_id,
            "--out", str(self.output_dir),
            "-connections", str(self.max_connections)
        ]

        for attempt in range(1, max_retries + 1):
            logger.info(f"Attempt {attempt}/{max_retries}: Downloading file {file_id} ({file_name})...")
            try:
                subprocess.run(cmd, check=True)
                if dest_path.exists():
                    if expected_md5 and not self.verify_md5(dest_path, expected_md5):
                        logger.warning(f"MD5 mismatch on attempt {attempt}. Retrying...")
                        continue

                    self.manifest["files"][file_id] = {
                        "file_name": file_name,
                        "status": "completed",
                        "path": str(dest_path),
                        "md5": expected_md5
                    }
                    self._save_manifest()
                    logger.info(f"Successfully fetched {file_name}")
                    return True
            except Exception as e:
                logger.error(f"Error fetching {file_id} on attempt {attempt}: {e}")

        self.manifest["files"][file_id] = {
            "file_name": file_name,
            "status": "failed",
            "path": str(dest_path)
        }
        self._save_manifest()
        return False

    def batch_download(self, file_pattern: Optional[str] = ".vcf") -> Dict[str, bool]:
        """Fetch all files matching pattern for dataset EGAD50000002396."""
        files = self.list_dataset_files()
        results = {}
        if not files:
            logger.warning("No files returned or pyega3 not configured.")
            return results

        target_files = [f for f in files if not file_pattern or file_pattern in f["file_name"]]
        logger.info(f"Starting batch download for {len(target_files)} target files matching '{file_pattern}'")

        for f in target_files:
            file_id = f["file_id"]
            file_name = f["file_name"]
            md5 = f.get("md5", "")
            success = self.fetch_file(file_id, file_name, expected_md5=md5)
            results[file_id] = success

        return results
