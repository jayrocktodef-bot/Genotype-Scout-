# EGAD50000002396 Indigenous Latin American WGS Reference Data Pipeline

End-to-end Python pipeline for ingesting, filtering, and converting **EGAD50000002396** (128 high-coverage ~44x whole genomes across 45 Indigenous Latin American populations and 28 linguistic families, study **EGAS50000001664**) into Genotype Scout's population reference format.

## Overview & Scientific Focus

The study encompasses:
- **Mesoamerica (3rd wave)**: Maya, Zapotec, Mixtec, Nahua, Triqui, Purepecha, Totonac, Otomi, Pima, etc.
- **Andes**: Quechua, Aymara, Uros, Chachapoyas, Cañari, Yanesha, etc.
- **Amazonia / Tupi**: Karitiana, Surui, Ticuna, Guarani, Kaingang, Xavante, Jamamadi, Arara, etc.
- **Southern Cone**: Mapuche, Huilliche, Qom, Wichi, Mocovi, Tehuelche, Yaghan, etc.
- **Ypykuéra / Archaic Signal**: Deep lineage proxy sharing Australasian genetic affinity elements.

---

## Directory Structure

```
pipelines/ega_latin_america/
├── README.md                                 # Pipeline documentation
├── requirements.txt                           # Python dependencies
├── run_pipeline.py                            # Master CLI executable
├── config/
│   ├── credentials.json.template             # EGA user credentials template
│   └── dataset_config.json                   # Dataset & panel parameters
├── metadata/
│   └── population_clusters.json              # Mappings for 45 populations & 5 regions
├── ega_latin_america/
│   ├── __init__.py
│   ├── cli.py                                # Subcommands CLI interface
│   ├── ega_client.py                         # pyEGA3 automation & batch downloader
│   ├── supplementary_parser.py               # Ingests open-access tables, AIMs & Q-matrices
│   ├── vcf_matrix_converter.py               # Fst & LLR weight reference matrix converter
│   └── schema_formatter.py                   # Formats JSON & gzipped binary output
├── data/
│   ├── raw_vcf/
│   └── supplementary/
├── dist/
│   ├── latin_america_wgs_reference.json
│   └── latin_america_wgs_reference.bin.gz
└── tests/
    ├── test_ega_client.py
    ├── test_supplementary_parser.py
    ├── test_vcf_matrix_converter.py
    └── test_schema_formatter.py
```

---

## Quickstart & Usage

### 1. Installation

Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configure Credentials

Copy `config/credentials.json.template` to `config/credentials.json` and fill in your authorized EGA credentials:
```json
{
  "ega_user": "your_ega_username@domain.com",
  "ega_password": "your_ega_password"
}
```

### 3. CLI Commands

- **List dataset files**:
  ```bash
  python run_pipeline.py list-files
  ```

- **Batch download VCFs**:
  ```bash
  python run_pipeline.py download --outdir ./data/raw_vcf
  ```

- **Parse open-access supplementary data**:
  ```bash
  python run_pipeline.py parse-meta
  ```

- **Convert VCF to reference matrix & export Genotype Scout schema**:
  ```bash
  python run_pipeline.py convert-vcf
  ```

- **Run full pipeline end-to-end**:
  ```bash
  python run_pipeline.py all
  ```

---

## Reference Matrix Output Schema

Outputs are generated at `dist/latin_america_wgs_reference.json` and compressed as `dist/latin_america_wgs_reference.bin.gz`:

```json
{
  "_metadata": {
    "dataset_accession": "EGAD50000002396",
    "study_accession": "EGAS50000001664",
    "dac_accession": "EGAC50000000368",
    "sample_count": 128,
    "subpopulation_count": 45,
    "regional_clusters": ["Mesoamerica", "Andes", "Amazonia_Tupi", "Southern_Cone", "Ypykuera_Proxy"]
  },
  "snps": {
    "rs3827072": {
      "chr": "2",
      "pos_grch38": 108883025,
      "pos_grch37": 109513601,
      "ref": "A",
      "alt": "G",
      "fst_global": 0.4521,
      "regionalFrequencies": {
        "Mesoamerica": 0.8521,
        "Andes": 0.7812,
        "Amazonia_Tupi": 0.6543
      },
      "llr_weights": {
        "Mesoamerica": 3.7505,
        "Andes": 3.6639
      }
    }
  }
}
```
