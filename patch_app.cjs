const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { ChromosomePainterView } from './components/ChromosomePainterView';",
  "import { ChromosomePainterView } from './components/ChromosomePainterView';\nimport EurogenesOracle from './components/EurogenesOracle';"
);

code = code.replace(
  "const [mdlpK16Results, setMdlpK16Results] = useState<any[]>([]);",
  "const [mdlpK16Results, setMdlpK16Results] = useState<any[]>([]);\n  const [eurogenesK13Results, setEurogenesK13Results] = useState<any[]>([]);"
);

code = code.replace(
  "if (newDataset.analysis?.mdlpResults_raw) {\n      setMdlpK16Results(newDataset.analysis.mdlpResults_raw);\n    }",
  "if (newDataset.analysis?.mdlpResults_raw) {\n      setMdlpK16Results(newDataset.analysis.mdlpResults_raw);\n    }\n    if (newDataset.analysis?.eurogenesResults_raw) {\n      setEurogenesK13Results(newDataset.analysis.eurogenesResults_raw);\n    }"
);

code = code.replace(
  "if (datasets[activeDatasetIndex]?.analysis?.mdlpResults_raw) {\n      setMdlpK16Results(datasets[activeDatasetIndex].analysis.mdlpResults_raw);\n    }",
  "if (datasets[activeDatasetIndex]?.analysis?.mdlpResults_raw) {\n      setMdlpK16Results(datasets[activeDatasetIndex].analysis.mdlpResults_raw);\n    }\n    if (datasets[activeDatasetIndex]?.analysis?.eurogenesResults_raw) {\n      setEurogenesK13Results(datasets[activeDatasetIndex].analysis.eurogenesResults_raw);\n    }"
);

code = code.replace(
  "<ModernAncestryOracle results={oracleResults} dataset={datasets[activeDatasetIndex]} onOpenMethodology={() => setIsMethodologyOpen(true)} mode=\"analyst\" />",
  "{eurogenesK13Results && eurogenesK13Results.length > 0 && (\n                           <EurogenesOracle results={eurogenesK13Results} />\n                         )}\n                         <ModernAncestryOracle results={oracleResults} dataset={datasets[activeDatasetIndex]} onOpenMethodology={() => setIsMethodologyOpen(true)} mode=\"analyst\" />"
);

fs.writeFileSync('src/App.tsx', code);
