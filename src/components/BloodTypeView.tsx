import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import rhData from '../data/blood_markers.json';
import { calculateBloodType } from '../engines/bloodTypeCalculator';

const BLOOD_TYPE_SYSTEMS: Record<string, string[]> = {
  ABO: [
    "rs8176719", "rs8176746", "rs8176747", "rs8176750", "rs8176745", "rs8176741", "rs505922", "rs507666",
    "rs8176743", "rs8176742", "rs8176744", "rs8176751", "rs1051268", "rs512768", "rs2519093", "rs635634", "rs651007"
  ],
  Rh: [
    "rs590787", "rs676785", "rs28362459", "rs609320", "rs6762788", "rs118204008", "rs606429", 
    "rs11124803", "rs118204007", "rs676185", "rs6784865", "rs17525388", "rs28362463", "rs1053313", 
    "rs1053315", "rs606428", "rs676839", "rs667500", "rs10456285", "i4001527", "rs121912707",
    "rs139410370", "rs61750042", "rs121912708", "rs586178", "rs1053348"
  ],
  Duffy: ["rs2814778", "rs12075", "rs34599049"],
  Kidd: ["rs1058396", "rs10755968"],
  MNS: ["rs7683365", "rs11273308", "rs2250101"],
  Kell: ["rs8176058", "rs12046423"],
  Secretor: ["rs601338", "rs602662", "rs1047781"],
  Lewis: ["rs3894326", "rs3745635", "rs28362491"],
  Diego: ["rs2285644", "rs61756431", "rs2285603"],
  Colton: ["rs17154394", "rs2836269"],
  Dombrock: ["rs11273308", "rs11276"],
  Lutheran: ["rs28399653", "rs2298661"],
  Cartwright: ["rs28933390", "rs11551124"],
  Knops: ["rs3737002", "rs1145322"],
  Gerbich: ["rs7689609", "rs2075592"],
  Scianna: ["rs56019829", "rs1018780"],
  Vel: ["rs76975238"],
  Lan: ["rs149202834"],
  Jr: ["rs72552713"],
  Kx: ["rs137852525"],
  "Landsteiner-Wiener": ["rs2306884", "rs11545624"],
  Sid: ["rs7224888"],
  "Chido/Rodgers": ["rs1051328", "rs1051329"],
  Cromer: ["rs121917822", "rs121917827"],
  Indian: ["rs201267121", "rs17844216"],
  Ok: ["rs138957743"],
  RAPH: ["rs199473687"],
  JMH: ["rs199763124"],
  Gill: ["rs121908961", "rs121908962"],
  FORS: ["rs199763128", "rs75850172"],
  MAM: ["rs387906624", "rs200051785"],
  KAN: ["rs79094901", "rs76256445"],
  Pel: ["rs768039401", "rs77568825"],
  CD59: ["rs121908627"]
};

const MARKER_METADATA: Record<string, any> = {
  "rs8176719": { effect: "c.261delG frameshift (O allele deletion)", antigen: "O" },
  "rs8176746": { effect: "p.Leu266Met (A1 vs A2 subgroup)", antigen: "A1/A2" },
  "rs8176747": { effect: "p.Gly268Ala (B-antigen specific)", antigen: "B" },
  "rs8176750": { effect: "p.Pro234Ser (A/B glycosyltransferase variation)", antigen: "A/B" },
  "rs8176745": { effect: "p.Arg176Gly", antigen: "A/B" },
  "rs8176741": { effect: "p.Met266Leu", antigen: "A" },
  "rs505922": { effect: "Associated with ABO group plasma levels", antigen: "ABO" },
  "rs507666": { effect: "Regulatory variant for ABO antigen expression", antigen: "ABO" },
  "rs8176743": { effect: "Cis-AB glycosyltransferase mutation", antigen: "Cis-AB" },
  "rs8176742": { effect: "A3 subgroup weak expression variant", antigen: "A3" },
  "rs8176744": { effect: "Ax subgroup weak expression variant", antigen: "Ax" },
  "rs8176751": { effect: "B3 subgroup glycosyltransferase variant", antigen: "B3" },
  "rs1051268": { effect: "ABO 3' UTR expression modifier", antigen: "ABO" },
  "rs512768": { effect: "ABO promoter region variant", antigen: "ABO" },
  "rs2519093": { effect: "ABO intron regulatory SNP", antigen: "ABO" },
  "rs635634": { effect: "ABO soluble antigen regulator", antigen: "ABO" },
  "rs651007": { effect: "ABO level tag variant", antigen: "ABO" },
  "rs590787": { effect: "RHCE intron 2 surrogate for RHD deletion", antigen: "D / Rh" },
  "rs676785": { effect: "C/c antigen polymorphism (Ala103Pro)", antigen: "C/c" },
  "rs28362459": { effect: "E/e antigen polymorphism (Pro226Ala)", antigen: "E/e" },
  "rs609320": { effect: "Rh blood group system regulator", antigen: "Rh" },
  "rs6762788": { effect: "RHD 3' UTR region variant", antigen: "D" },
  "rs118204008": { effect: "RHCE exon variation", antigen: "C/c E/e" },
  "rs606429": { effect: "RHCE variation (associated with E antigen)", antigen: "E/e" },
  "rs11124803": { effect: "RHD/RHCE intergenic region variant", antigen: "Rh" },
  "rs118204007": { effect: "RHCE 48C>T variant", antigen: "Rh" },
  "rs676185": { effect: "Rh C/c variation", antigen: "C/c" },
  "rs6784865": { effect: "RHD intron 3 proxy marker", antigen: "D" },
  "rs17525388": { effect: "RHCE C-antigen tag variant", antigen: "C/c" },
  "rs28362463": { effect: "RHCE E-antigen tag variant", antigen: "E/e" },
  "rs1053313": { effect: "RHCE D-antigen surrogate marker", antigen: "D" },
  "rs1053315": { effect: "RHCE/RHD intergenic marker", antigen: "Rh" },
  "rs606428": { effect: "RHCE exon tag marker", antigen: "Rh" },
  "rs676839": { effect: "RHD promoter region tag", antigen: "D" },
  "rs667500": { effect: "RHCE 3' region tag", antigen: "Rh" },
  "rs10456285": { effect: "RHD structural deletion tag", antigen: "D" },
  "i4001527": { effect: "RHD gene structural deletion (major determinant of RhD negative status)", antigen: "D" },
  "rs121912707": { effect: "RHD DIIIa partial D phenotype", antigen: "Partial D" },
  "rs139410370": { effect: "RHD DVa partial D phenotype", antigen: "Partial D" },
  "rs61750042": { effect: "RHD DAU partial D phenotype", antigen: "Partial D" },
  "rs121912708": { effect: "Weak D type 5 variant", antigen: "Weak D" },
  "rs586178": { effect: "RHCE c antigen expression variant", antigen: "c" },
  "rs1053348": { effect: "RHCE VS antigen expression (Leu245Val)", antigen: "VS" },
  "rs2814778": { effect: "FY*0 — Duffy-null (Vivax Malaria resistance)", antigen: "Fy(null)" },
  "rs12075": { effect: "p.Gly42Asp (Fya vs Fyb antigen)", antigen: "Fya/Fyb" },
  "rs34599049": { effect: "FY*X weak antigen allele", antigen: "Fyx" },
  "rs1058396": { effect: "p.Asp280Asn (Jka vs Jkb antigen)", antigen: "Jka/Jkb" },
  "rs10755968": { effect: "Kidd system regulator", antigen: "Kidd" },
  "rs7683365": { effect: "M vs N antigen (GYPA)", antigen: "M/N" },
  "rs11273308": { effect: "S vs s antigen (GYPB)", antigen: "S/s" },
  "rs2250101": { effect: "U antigen variation", antigen: "U" },
  "rs8176058": { effect: "p.Met193Ile (K vs k antigen)", antigen: "K/k" },
  "rs12046423": { effect: "Kell system regulator", antigen: "Kell" },
  "rs601338": { effect: "FUT2 non-secretor mutation (se/se / Norovirus resistance)", antigen: "Se" },
  "rs602662": { effect: "FUT2 promoter regulator", antigen: "Se" },
  "rs3894326": { effect: "FUT3 mutation (Le/le)", antigen: "Le" },
  "rs3745635": { effect: "FUT3 variation", antigen: "Le" },
  "rs28362491": { effect: "Lewis group variation", antigen: "Le" },
  "rs1047781": { effect: "FUT1 (H-antigen) variation", antigen: "H" },
  "rs2285644": { effect: "SLC4A1 p.Pro854Leu (Dia vs Dib antigen)", antigen: "Di(a/b)" },
  "rs61756431": { effect: "SLC4A1 p.Glu658Lys (Wra vs Wrb antigen)", antigen: "Wr(a/b)" },
  "rs2285603": { effect: "p.Pro854Leu (Dia vs Dib antigen)", antigen: "Di" },
  "rs17154394": { effect: "AQP1 p.Ala45Val (Coa vs Cob antigen)", antigen: "Co(a/b)" },
  "rs2836269": { effect: "p.Ala45Thr (Coa vs Cob antigen)", antigen: "Co" },
  "rs11276": { effect: "ART4 p.Tyr126His (Doa vs Dob antigen)", antigen: "Do" },
  "rs28399653": { effect: "BCAM p.Arg77His (Lua vs Lub antigen)", antigen: "Lu" },
  "rs2298661": { effect: "Lutheran blood group polymorphism", antigen: "Lu" },
  "rs28933390": { effect: "BCHE p.His567Asn (Yta vs Ytb antigen)", antigen: "Yt" },
  "rs11551124": { effect: "Cartwright blood group polymorphism", antigen: "Yt" },
  "rs3737002": { effect: "CR1 p.Lys1561Glu (Kna vs Knb antigen)", antigen: "Kn" },
  "rs1145322": { effect: "Knops blood group polymorphism", antigen: "Kn" },
  "rs7689609": { effect: "GYPC p.Gln81Ter (Gerbich null / Ge:-2,3,4)", antigen: "Ge" },
  "rs2075592": { effect: "GYPC intron variant associated with Gerbich system", antigen: "Ge" },
  "rs56019829": { effect: "ERMAP p.Gly57Arg (Sc1 vs Sc2 antigen)", antigen: "Sc" },
  "rs1018780": { effect: "p.Gly244Arg (Sc1 vs Sc2 antigen)", antigen: "Sc" },
  "rs76975238": { effect: "SMIM1 c.64_80del (17bp deletion causing Vel-negative null)", antigen: "Vel(null)" },
  "rs149202834": { effect: "ABCB6 p.Arg192Trp (Lan-negative null)", antigen: "Lan(null)" },
  "rs72552713": { effect: "ABCG2 p.Arg246Ter (Jr(a-) null)", antigen: "Jr(null)" },
  "rs137852525": { effect: "XK p.Arg334Ter (McLeod syndrome / Kx-null)", antigen: "Kx(null)" },
  "rs2306884": { effect: "ICAM4 p.Thr100Ile (LWa vs LWb antigen)", antigen: "LW" },
  "rs11545624": { effect: "p.Gln70Arg (LWa vs LWb antigen)", antigen: "LW" },
  "rs7224888": { effect: "B4GALNT2 p.Arg463Ter (Sd(a-) null)", antigen: "Sd(a)" },
  "rs1051328": { effect: "C4A Rodgers (Rg1) antigen marker", antigen: "Ch/Rg" },
  "rs1051329": { effect: "C4A Chido/Rodgers epitope modifier", antigen: "Ch/Rg" },
  "rs121917822": { effect: "CD55 Cra-negative Cromer antigen mutation", antigen: "Cra" },
  "rs121917827": { effect: "CD55 Dra-negative Cromer antigen mutation", antigen: "Dra" },
  "rs201267121": { effect: "CD44 In(b-) Indian blood group variant", antigen: "Inb" },
  "rs17844216": { effect: "CD44 Ina Indian blood group variant", antigen: "Ina" },
  "rs138957743": { effect: "BSG Ok(a-) null blood group phenotype", antigen: "Oka" },
  "rs199473687": { effect: "CD151 MER2-negative RAPH blood group variant", antigen: "MER2" },
  "rs199763124": { effect: "SEMA7A JMH-negative blood group variant", antigen: "JMH" },
  "rs121908961": { effect: "AQP3 GIL-negative Gill blood group variant", antigen: "GIL" },
  "rs121908962": { effect: "AQP3 GIL-negative secondary variant", antigen: "GIL" },
  "rs199763128": { effect: "GBGT1 FORS1-negative Forssman blood group variant", antigen: "FORS1" },
  "rs75850172": { effect: "GBGT1 FORS1 expression modifier", antigen: "FORS1" },
  "rs387906624": { effect: "EMP3 MAM-negative blood group variant", antigen: "MAM" },
  "rs200051785": { effect: "EMP3 MAM variant", antigen: "MAM" },
  "rs79094901": { effect: "GCNT2 KANNO-negative null variant", antigen: "KANNO" },
  "rs76256445": { effect: "GCNT2 KANNO variant", antigen: "KANNO" },
  "rs768039401": { effect: "ATP11C PEL-negative blood group variant", antigen: "PEL" },
  "rs77568825": { effect: "ATP11C PEL variant", antigen: "PEL" },
  "rs121908627": { effect: "CD59 deficiency / CD59-negative blood group mutation", antigen: "CD59" }
};

// Blood Compatibility Rules
const TRANSFUSION_COMPATIBILITY: Record<string, { giveTo: string[]; receiveFrom: string[]; notes: string }> = {
  "O-": {
    giveTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    receiveFrom: ["O-"],
    notes: "Universal Red Cell Donor. Can donate to all blood types."
  },
  "O+": {
    giveTo: ["O+", "A+", "B+", "AB+"],
    receiveFrom: ["O-", "O+"],
    notes: "Most common blood group. High demand for red cell transfusions."
  },
  "A-": {
    giveTo: ["A-", "A+", "AB-", "AB+"],
    receiveFrom: ["O-", "A-"],
    notes: "Can donate to A and AB positive/negative recipients."
  },
  "A+": {
    giveTo: ["A+", "AB+"],
    receiveFrom: ["O-", "O+", "A-", "A+"],
    notes: "Second most common blood type."
  },
  "B-": {
    giveTo: ["B-", "B+", "AB-", "AB+"],
    receiveFrom: ["O-", "B-"],
    notes: "Rare blood group. Highly valued donor type."
  },
  "B+": {
    giveTo: ["B+", "AB+"],
    receiveFrom: ["O-", "O+", "B-", "B+"],
    notes: "Common in Asian, South Asian, and African populations."
  },
  "AB-": {
    giveTo: ["AB-", "AB+"],
    receiveFrom: ["O-", "A-", "B-", "AB-"],
    notes: "Universal Plasma Donor. Rare red blood cell group."
  },
  "AB+": {
    giveTo: ["AB+"],
    receiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    notes: "Universal Red Cell Recipient. Can receive red cells from any group."
  }
};

function getIsbtPhenotype(rsid: string, genotype: string, getGenotype: (rsid: string) => string): string {
  if (!genotype || genotype === "--" || genotype === "No Call" || genotype === "00") return "Not tested";
  
  const g = genotype.toUpperCase().replace(/[\s\/_]/g, '');
  if (g.length < 2) return "Uncertain";

  switch (rsid) {
    case 'rs12075': {
      const promoter = getGenotype('rs2814778').toUpperCase().replace(/[\s\/_]/g, '');
      if (promoter === 'CC') return "Fy(a-b-) [Duffy Null - Vivax Malaria Resistant]";
      if (g === 'AA' || g === 'TT') return "Fy(a+b-) [Fya Antigen Only]";
      if (g === 'GG' || g === 'CC') return "Fy(a-b+) [Fyb Antigen Only]";
      if (['AG', 'GA', 'AT', 'TA', 'CG', 'GC', 'CT', 'TC'].includes(g)) return "Fy(a+b+) [Fya & Fyb Antigens Present]";
      return "Fy (Variable)";
    }
    case 'rs2814778': {
      if (g === 'CC') return "Fy(a-b-) [Erythroid Duffy Silent / Vivax Resistant]";
      if (g === 'TT') return "Fy(a/b)+ [Normal Duffy Expression]";
      return "Fy(a/b)+ [Heterozygous Duffy Null Carrier]";
    }
    case 'rs1058396': {
      if (g === 'AA' || g === 'TT') return "Jk(a+b-) [Jka Antigen Only]";
      if (g === 'GG' || g === 'CC') return "Jk(a-b+) [Jkb Antigen Only]";
      if (['AG', 'GA', 'AT', 'TA', 'CG', 'GC', 'CT', 'TC'].includes(g)) return "Jk(a+b+) [Jka & Jkb Antigens Present]";
      return "Jk (Variable)";
    }
    case 'rs8176058': {
      if (g === 'CC' || g === 'GG') return "K+k- [Kell Antigen Present / Cellano Absent]";
      if (g === 'TT' || g === 'AA') return "K-k+ [Kell Absent / Cellano Present]";
      return "K+k+ [Kell & Cellano Antigens Present]";
    }
    case 'rs7683365': {
      if (g === 'CC' || g === 'GG') return "M+N- [M Antigen Only]";
      if (g === 'TT' || g === 'AA') return "M-N+ [N Antigen Only]";
      return "M+N+ [M & N Antigens Present]";
    }
    case 'rs11273308': {
      if (g === 'TT' || g === 'AA') return "S+s- [S Antigen Only]";
      if (g === 'CC' || g === 'GG') return "S-s+ [s Antigen Only]";
      return "S+s+ [S & s Antigens Present]";
    }
    case 'rs2285644':
    case 'rs2285603': {
      if (g === 'TT' || g === 'AA') return "Di(a+b-) [Dia Antigen Only (Indigenous/East Asian)]";
      if (g === 'CC' || g === 'GG') return "Di(a-b+) [Dib Antigen Only]";
      return "Di(a+b+) [Dia & Dib Antigens Present]";
    }
    case 'rs17154394':
    case 'rs2836269': {
      if (g === 'TT' || g === 'AA') return "Co(a-b+) [Cob Antigen Only]";
      if (g === 'CC' || g === 'GG') return "Co(a+b-) [Coa Antigen Only]";
      return "Co(a+b+) [Coa & Cob Antigens Present]";
    }
    case 'rs601338': {
      if (g === 'AA' || g === 'TT') return "Non-secretor [se/se / Norovirus Resistant]";
      return "Secretor [Se/Se or Se/se]";
    }
    case 'rs76975238': {
      if (g.includes('DEL') || g === 'DD') return "Vel-negative [Vel Null / Rare Transfusion Recipient]";
      return "Vel-positive [Normal Vel Expression]";
    }
    case 'rs149202834': {
      if (g === 'TT') return "Lan-negative [Lan Null / Rare]";
      return "Lan-positive [Normal Lan Expression]";
    }
    case 'rs72552713': {
      if (g === 'TT') return "Jr(a-) [Jr Null / Rare]";
      return "Jr(a+) [Normal Jr Expression]";
    }
    default:
      return "Antigen Expressed (ISBT Standard)";
  }
}

export const BloodTypeView = ({ dataset }: { dataset: any }) => {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [activeSystemFilter, setActiveSystemFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { predictedABO, predictedRh, rhPhenotype, rhConfidence, rawBloodTypeStr, markerResults, coverage } = useMemo(() => {
    const rawResults = dataset?.results || [];
    const getGenotype = (rsid: string): string => {
      const val = overrides[rsid] || rawResults.find((r: any) => r.rsid === rsid)?.genotype;
      return val || "--";
    };

    const userSnpsForCalc: Record<string, string> = {};
    if (Array.isArray(rawResults)) {
      rawResults.forEach((r: any) => {
        if (r && r.rsid && r.genotype && r.genotype !== '--') {
          userSnpsForCalc[r.rsid] = overrides[r.rsid] || r.genotype;
        }
      });
    }
    const allKnownRsids = Object.values(BLOOD_TYPE_SYSTEMS).flat();
    allKnownRsids.forEach(rsid => {
      const g = getGenotype(rsid);
      if (g && g !== "--") {
        userSnpsForCalc[rsid] = g;
      }
    });

    const bloodCalc = calculateBloodType(userSnpsForCalc);
    const predicted = bloodCalc.details.abo !== "Unknown" ? `Type ${bloodCalc.details.abo}` : "Uncertain";

    let dType = "Unknown";
    let rawRhSymbol = "?";
    if (bloodCalc.details.rhPhenotype !== "Unknown") {
      const isPositive = bloodCalc.details.rhPhenotype === "Positive";
      rawRhSymbol = isPositive ? "+" : "-";
      const conf = bloodCalc.details.rhConfidence || 0;
      if (conf >= 0.8) {
        dType = isPositive ? "Rh+ (High Confidence)" : "Rh- (High Confidence)";
      } else if (conf >= 0.5) {
        dType = isPositive ? "Likely Rh+ (Moderate)" : "Likely Rh- (Moderate)";
      } else {
        dType = "Unknown (Low)";
      }
    }

    const rawTypeKey = `${bloodCalc.details.abo}${rawRhSymbol}`;

    const r676 = getGenotype("rs676785") || "--";
    const r6761 = getGenotype("rs676185") || "--";
    const r283 = getGenotype("rs28362459") || "--";
    const r606 = getGenotype("rs606429") || "--";

    let ccType = "";
    if (r676 !== "--") {
      if (r676 === "GG") ccType = "CC";
      else if (r676 === "GA" || r676 === "AG") ccType = "Cc";
      else if (r676 === "AA") ccType = "cc";
    } else if (r6761 !== "--") {
      if (r6761 === "CC") ccType = "CC";
      else if (r6761 === "CT" || r6761 === "TC") ccType = "Cc";
      else if (r6761 === "TT") ccType = "cc";
    }

    let eeType = "";
    if (r283 !== "--") {
      if (r283 === "CC") eeType = "EE";
      else if (r283 === "CT" || r283 === "TC") eeType = "Ee";
      else if (r283 === "TT") eeType = "ee";
    } else if (r606 !== "--") {
      if (r606 === "CC") eeType = "EE";
      else if (r606 === "CT" || r606 === "TC") eeType = "Ee";
      else if (r606 === "TT") eeType = "ee";
    }

    const rh = `${dType}${ccType || eeType ? ' (' + ccType + eeType + ')' : ''}`;

    const allMarkers = Object.entries(BLOOD_TYPE_SYSTEMS).flatMap(([system, rsids]) => 
      rsids.map(rsid => {
        const genotype = getGenotype(rsid);
        const rawGenotype = rawResults.find((r: any) => r.rsid === rsid)?.genotype || "--";
        let meta = { ...(MARKER_METADATA[rsid] || { effect: "Biochemical Antigen Marker", antigen: "Unknown" }) };
        
        const rhConfig = (rhData.rhSystem as any)[rsid];
        if (rhConfig && genotype !== "--") {
          const alleleInfo = rhConfig.alleles[genotype];
          if (alleleInfo) {
            meta = {
              ...meta,
              effect: `${alleleInfo.traitPhenotype} (Confidence: ${(alleleInfo.confidence * 100).toFixed(0)}%) — RHD/RHCE surrogate`
            };
          }
        }
        
        const isbtPhenotype = getIsbtPhenotype(rsid, genotype, getGenotype);

        return {
          system,
          rsid,
          genotype,
          rawGenotype,
          isbtPhenotype,
          ...meta
        };
      })
    ).filter(m => m.genotype !== "--");

    const identifiedCount = allMarkers.filter(m => m.genotype !== "--").length;

    return { 
      predictedABO: predicted, 
      predictedRh: rh,
      rhPhenotype: bloodCalc.details.rhPhenotype,
      rhConfidence: bloodCalc.details.rhConfidence || 0,
      rawBloodTypeStr: rawTypeKey,
      markerResults: allMarkers, 
      coverage: { identified: identifiedCount, total: allMarkers.length } 
    };
  }, [dataset, overrides]);

  const handleOverride = (rsid: string, value: string) => {
    setOverrides(prev => ({ ...prev, [rsid]: value.toUpperCase() }));
  };

  const filteredMarkers = useMemo(() => {
    return markerResults.filter(m => {
      const matchSystem = activeSystemFilter === "All" || m.system === activeSystemFilter;
      const matchQuery = searchQuery === "" || 
        m.rsid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.effect.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.isbtPhenotype.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSystem && matchQuery;
    });
  }, [markerResults, activeSystemFilter, searchQuery]);

  const compatibility = TRANSFUSION_COMPATIBILITY[rawBloodTypeStr] || {
    giveTo: ["Matches Needed"],
    receiveFrom: ["Matches Needed"],
    notes: "Full Rh and ABO typing required for crossmatching."
  };

  const systemList = ["All", ...Object.keys(BLOOD_TYPE_SYSTEMS)];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Hero Blood Predictor Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-red-950 to-slate-900 border border-rose-800/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black uppercase tracking-widest">
              <span>🩸</span> High-Precision Molecular Blood Predictor
            </div>
            <div>
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
                {predictedABO} <span className="text-rose-400">{rawBloodTypeStr.includes('+') ? '+' : rawBloodTypeStr.includes('-') ? '-' : ''}</span>
              </h2>
              <p className="text-sm sm:text-base text-rose-100/80 font-medium mt-3 max-w-xl leading-relaxed">
                Inferred from multi-locus ISBT antigen surrogates across <span className="text-white font-bold">ABO</span>, <span className="text-white font-bold">RHD</span>, and <span className="text-white font-bold">RHCE</span> gene clusters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-bold">
                Rhesus Status: <span className={rhPhenotype === 'Positive' ? 'text-emerald-400' : 'text-rose-400'}>{predictedRh}</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-bold">
                Rh Confidence: <span className="text-amber-300">{(rhConfidence * 100).toFixed(0)}%</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-bold">
                Tested Variants: <span className="text-sky-300">{coverage.identified} Hydrated Markers</span>
              </span>
            </div>
          </div>

          {/* Transfusion Compatibility Quick Card */}
          <div className="lg:col-span-5 rounded-2xl bg-black/40 border border-rose-500/30 p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-200">Clinical Transfusion Compatibility</h4>
              <span className="text-[10px] font-mono text-rose-300/70">ISBT Standard</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1.5">Can Donate Red Cells To:</p>
                <div className="flex flex-wrap gap-1.5">
                  {compatibility.giveTo.map((type, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-100 font-black text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1.5">Can Receive Red Cells From:</p>
                <div className="flex flex-wrap gap-1.5">
                  {compatibility.receiveFrom.map((type, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 font-black text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-300 italic pt-1 border-t border-white/5">
                {compatibility.notes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rhesus Factor Hydrated Markers Overview */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🧬</span> Hydrated Rhesus System Panel (26 Markers)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive RHD deletion tags, RHCE intron proxies, Weak D, Partial D, and C/c / E/e antigen polymorphisms.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Confidence Score:</span>
            <div className="w-32 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(10, rhConfidence * 100))}%` }} 
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{(rhConfidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {BLOOD_TYPE_SYSTEMS.Rh.slice(0, 8).map(rsid => {
            const match = markerResults.find(m => m.rsid === rsid);
            const genotype = match?.genotype || "--";
            const isTested = genotype !== "--";
            return (
              <div key={rsid} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400">{rsid}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isTested ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {isTested ? genotype : 'Not Tested'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-2 font-medium truncate">
                  {MARKER_METADATA[rsid]?.effect || 'RHD/RHCE Marker'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive System Filter Tabs & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {systemList.map(sys => (
              <button
                key={sys}
                onClick={() => setActiveSystemFilter(sys)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSystemFilter === sys
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {sys}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search RSID, gene, or antigen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500 transition-all"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
          </div>
        </div>

        {/* Molecular Breakdown Table */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Molecular Blood Group Sequence Breakdown ({filteredMarkers.length} Markers Displayed)
            </h4>
            <span className="text-[10px] font-mono text-slate-400 uppercase">ISBT Standard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                  <th className="px-5 py-3.5">Blood System</th>
                  <th className="px-5 py-3.5">Genomic RSID</th>
                  <th className="px-5 py-3.5 text-center">User Genotype</th>
                  <th className="px-5 py-3.5">Simulation Override</th>
                  <th className="px-5 py-3.5">ISBT Antigen Expression</th>
                  <th className="px-5 py-3.5">Biochemical Variant & Phenotype Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px] font-medium text-slate-300">
                <AnimatePresence>
                  {filteredMarkers.map((m, i) => (
                    <motion.tr 
                      key={m.rsid + i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-black text-white">{m.system}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-sky-400 font-bold">{m.rsid}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-rose-300">
                          {m.genotype}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <input 
                          type="text" 
                          placeholder={m.rawGenotype} 
                          className="w-16 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-white outline-none focus:border-rose-500 transition-all uppercase" 
                          value={overrides[m.rsid] || ''} 
                          onChange={(e) => handleOverride(m.rsid, e.target.value)} 
                        />
                      </td>
                      <td className="px-5 py-3.5 font-bold text-emerald-400">{m.isbtPhenotype}</td>
                      <td className="px-5 py-3.5 text-slate-300">{m.effect}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
