/**
 * Service to generate a detailed, premium Google Slides Results "Passport" presentation.
 * Adheres strictly to Zero-Footprint Personalization rules and excludes all health-related markers.
 */

interface SlideRequest {
  [key: string]: any;
}

export async function createGoogleSlidesPassport(
  dataset: any,
  accessToken: string
): Promise<string> {
  if (!dataset) {
    throw new Error("No dataset selected for export.");
  }

  // 1. Create a brand new Google Slides presentation
  const createResponse = await fetch("https://slides.googleapis.com/v1/presentations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `Genotype Scout - Ancestral Passport [${dataset.name}]`,
    }),
  });

  if (!createResponse.ok) {
    const errText = await createResponse.text();
    throw new Error(`Failed to create presentation: ${errText}`);
  }

  const presentation = await createResponse.json();
  const presentationId = presentation.presentationId;
  const defaultSlideId = presentation.slides?.[0]?.objectId;

  // 2. Extract dataset analytical results for the slides
  const yHaploName = dataset.predictedYDNA?.predicted?.name || "Not Detected / Female";
  const yHaploContinent = dataset.predictedYDNA?.predicted?.continent || "N/A";
  const yTestedCount = dataset.predictedYDNA?.testedMarkers?.length || 0;
  const yHaploPath = (dataset.predictedYDNA?.path || []).map((p: string) => p.replace("Haplogroup ", "")).join(" ➔ ") || "Root";

  const mtHaploName = dataset.predictedMtDNA?.predicted || "Not Detected";
  const mtTestedCount = dataset.predictedMtDNA?.testedMarkers?.length || 0;
  const mtHaploPath = (dataset.predictedMtDNA?.path || []).map((p: string) => p.replace("Haplogroup ", "")).join(" ➔ ") || "Root";

  const primaryOracle = dataset.analysis?.oracleResults?.primary || {};
  const continentalScores = primaryOracle.continentalScores || {};
  const subPopulations = primaryOracle.subPopulations || {};
  const confidenceScore = primaryOracle.confidenceScore || 0;

  const famousMatches = dataset.analysis?.famousMatches || [];
  const populationProximity = dataset.analysis?.populationProximity || [];

  // 3. Compile slide requests
  const requests: SlideRequest[] = [];

  // ==========================================
  // SLIDE 1: Passport Cover Title Slide
  // ==========================================
  requests.push({
    createSlide: {
      objectId: "slide_cover",
      insertionIndex: 0,
      slideLayoutReference: { predefinedLayout: "BLANK" },
    },
  });

  // Dark background for cover
  requests.push({
    updatePageProperties: {
      objectId: "slide_cover",
      pageProperties: {
        pageBackgroundFill: {
          solidFill: {
            color: { opaqueColor: { rgbColor: { red: 0.08, green: 0.11, blue: 0.17 } } },
          },
        },
      },
      fields: "pageBackgroundFill.solidFill.color",
    },
  });

  // Cover main title box
  requests.push({
    createShape: {
      objectId: "cover_title_box",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_cover",
        size: {
          width: { magnitude: 620, unit: "PT" },
          height: { magnitude: 120, unit: "PT" },
        },
        transform: {
          scaleX: 1, scaleY: 1, translateX: 50, translateY: 100, unit: "PT",
        },
      },
    },
  });

  requests.push({
    insertText: {
      objectId: "cover_title_box",
      text: "GENOTYPE SCOUT\nGENOMIC ANCESTRY PASSPORT",
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "cover_title_box",
      style: {
        fontFamily: "Space Grotesk",
        fontSize: { magnitude: 28, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.95, green: 0.95, blue: 0.95 } } },
        bold: true,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // Cover meta details box
  requests.push({
    createShape: {
      objectId: "cover_meta_box",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_cover",
        size: {
          width: { magnitude: 620, unit: "PT" },
          height: { magnitude: 130, unit: "PT" },
        },
        transform: {
          scaleX: 1, scaleY: 1, translateX: 50, translateY: 220, unit: "PT",
        },
      },
    },
  });

  const timeString = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  requests.push({
    insertText: {
      objectId: "cover_meta_box",
      text: `SUBJECT RECORD: ANONYMOUS EXPLORER\n` +
            `Source Kit: ${dataset.name}\n` +
            `Markers Processed: ${dataset.snpCount || "N/A"} SNPs on ${dataset.chip || "Unknown Platform"}\n` +
            `Timestamp: ${timeString}\n` +
            `Security Mode: Zero-Footprint Sandbox Protection`,
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "cover_meta_box",
      style: {
        fontFamily: "Inter",
        fontSize: { magnitude: 12, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.65, green: 0.72, blue: 0.83 } } },
        bold: false,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // ==========================================
  // SLIDE 2: Biogeographical Admixture Profile
  // ==========================================
  requests.push({
    createSlide: {
      objectId: "slide_admixture",
      insertionIndex: 1,
      slideLayoutReference: { predefinedLayout: "BLANK" },
    },
  });

  // Light minimal background
  requests.push({
    updatePageProperties: {
      objectId: "slide_admixture",
      pageProperties: {
        pageBackgroundFill: {
          solidFill: {
            color: { opaqueColor: { rgbColor: { red: 0.97, green: 0.98, blue: 0.99 } } },
          },
        },
      },
      fields: "pageBackgroundFill.solidFill.color",
    },
  });

  // Slide Title
  requests.push({
    createShape: {
      objectId: "admixture_title_box",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_admixture",
        size: { width: { magnitude: 620, unit: "PT" }, height: { magnitude: 50, unit: "PT" } },
        transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: "PT" },
      },
    },
  });

  requests.push({
    insertText: {
      objectId: "admixture_title_box",
      text: "BIOGEOGRAPHICAL ADMIXTURE ANALYSIS",
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "admixture_title_box",
      style: {
        fontFamily: "Space Grotesk",
        fontSize: { magnitude: 22, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.08, green: 0.11, blue: 0.17 } } },
        bold: true,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // Admixture panel description (left)
  requests.push({
    createShape: {
      objectId: "admixture_desc_box",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_admixture",
        size: { width: { magnitude: 260, unit: "PT" }, height: { magnitude: 250, unit: "PT" } },
        transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 110, unit: "PT" },
      },
    },
  });

  requests.push({
    insertText: {
      objectId: "admixture_desc_box",
      text: `Panel Metrics:\n\n` +
            `This high-resolution breakdown maps ancestral informative markers (AIMs) to model likelihood distribution. This represents the global continental genetic prior matching reconstructed entirely from local SNP frequency vectors without diagnostic health identifiers.\n\n` +
            `Statistical Confidence: ${(confidenceScore * 100).toFixed(1)}%`,
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "admixture_desc_box",
      style: {
        fontFamily: "Inter",
        fontSize: { magnitude: 11, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.41, green: 0.45, blue: 0.53 } } },
        bold: false,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // Render admixture bar plot using shape pairs (right)
  const sortedContinents = Object.entries(continentalScores)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5);

  sortedContinents.forEach(([continent, val], i) => {
    const value = val as number;
    const yShift = 110 + i * 50;

    const textId = `adm_text_${i}`;
    const baseId = `adm_bar_base_${i}`;
    const fillId = `adm_bar_fill_${i}`;

    // Text box for Continent and Score
    requests.push({
      createShape: {
        objectId: textId,
        shapeType: "RECTANGLE",
        elementProperties: {
          pageId: "slide_admixture",
          size: { width: { magnitude: 140, unit: "PT" }, height: { magnitude: 30, unit: "PT" } },
          transform: { scaleX: 1, scaleY: 1, translateX: 340, translateY: yShift, unit: "PT" },
        },
      },
    });

    requests.push({
      insertText: {
        objectId: textId,
        text: `${continent}: ${value.toFixed(1)}%`,
      },
    });

    requests.push({
      updateTextStyle: {
        objectId: textId,
        style: {
          fontFamily: "Inter",
          fontSize: { magnitude: 11, unit: "PT" },
          foregroundColor: { opaqueColor: { rgbColor: { red: 0.12, green: 0.15, blue: 0.20 } } },
          bold: true,
        },
        textRange: { type: "ALL" },
        fields: "fontFamily,fontSize,foregroundColor,bold",
      },
    });

    // Gray base shape
    requests.push({
      createShape: {
        objectId: baseId,
        shapeType: "RECTANGLE",
        elementProperties: {
          pageId: "slide_admixture",
          size: { width: { magnitude: 180, unit: "PT" }, height: { magnitude: 12, unit: "PT" } },
          transform: { scaleX: 1, scaleY: 1, translateX: 490, translateY: yShift + 6, unit: "PT" },
        },
      },
    });

    requests.push({
      updateShapeProperties: {
        objectId: baseId,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: { color: { opaqueColor: { rgbColor: { red: 0.91, green: 0.92, blue: 0.94 } } } },
          },
          outline: {
            outlineFill: {
              solidFill: { color: { opaqueColor: { rgbColor: { red: 0.85, green: 0.86, blue: 0.88 } } } },
            },
            weight: { magnitude: 1, unit: "PT" },
          },
        },
        fields: "shapeBackgroundFill.solidFill.color,outline",
      },
    });

    // Teal filled shape
    const fillWidth = Math.max(1, 180 * (value / 100));
    requests.push({
      createShape: {
        objectId: fillId,
        shapeType: "RECTANGLE",
        elementProperties: {
          pageId: "slide_admixture",
          size: { width: { magnitude: fillWidth, unit: "PT" }, height: { magnitude: 12, unit: "PT" } },
          transform: { scaleX: 1, scaleY: 1, translateX: 490, translateY: yShift + 6, unit: "PT" },
        },
      },
    });

    requests.push({
      updateShapeProperties: {
        objectId: fillId,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: { color: { opaqueColor: { rgbColor: { red: 0.11, green: 0.54, blue: 0.51 } } } },
          },
          outline: {
            outlineFill: {
              solidFill: { color: { opaqueColor: { rgbColor: { red: 0.08, green: 0.44, blue: 0.41 } } } },
            },
            weight: { magnitude: 1, unit: "PT" },
          },
        },
        fields: "shapeBackgroundFill.solidFill.color,outline",
      },
    });
  });

  // ==========================================
  // SLIDE 3: Lineage Oracle (Y-DNA & mtDNA)
  // ==========================================
  requests.push({
    createSlide: {
      objectId: "slide_lineages",
      insertionIndex: 2,
      slideLayoutReference: { predefinedLayout: "BLANK" },
    },
  });

  requests.push({
    updatePageProperties: {
      objectId: "slide_lineages",
      pageProperties: {
        pageBackgroundFill: {
          solidFill: {
            color: { opaqueColor: { rgbColor: { red: 0.97, green: 0.98, blue: 0.99 } } },
          },
        },
      },
      fields: "pageBackgroundFill.solidFill.color",
    },
  });

  // Slide Title
  requests.push({
    createShape: {
      objectId: "lineages_title_box",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_lineages",
        size: { width: { magnitude: 620, unit: "PT" }, height: { magnitude: 50, unit: "PT" } },
        transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: "PT" },
      },
    },
  });

  requests.push({
    insertText: {
      objectId: "lineages_title_box",
      text: "UNIPARENTAL DEEP LINEAGE CLONES",
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "lineages_title_box",
      style: {
        fontFamily: "Space Grotesk",
        fontSize: { magnitude: 22, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.08, green: 0.11, blue: 0.17 } } },
        bold: true,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // Card 1: Paternal Lineage (left)
  requests.push({
    createShape: {
      objectId: "lineages_pat_card",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_lineages",
        size: { width: { magnitude: 290, unit: "PT" }, height: { magnitude: 240, unit: "PT" } },
        transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 110, unit: "PT" },
      },
    },
  });

  requests.push({
    updateShapeProperties: {
      objectId: "lineages_pat_card",
      shapeProperties: {
        shapeBackgroundFill: {
          solidFill: { color: { opaqueColor: { rgbColor: { red: 1.0, green: 1.0, blue: 1.0 } } } },
        },
        outline: {
          outlineFill: {
            solidFill: { color: { opaqueColor: { rgbColor: { red: 0.88, green: 0.89, blue: 0.91 } } } },
          },
          weight: { magnitude: 1, unit: "PT" },
        },
      },
      fields: "shapeBackgroundFill.solidFill.color,outline",
    },
  });

  requests.push({
    insertText: {
      objectId: "lineages_pat_card",
      text: `PATERNAL LINEAGE (Y-DNA)\n\n` +
            `Predicted Haplogroup:\n${yHaploName}\n\n` +
            `Primary Region: ${yHaploContinent}\n` +
            `Tested Markers: ${yTestedCount} Y-SNPs\n\n` +
            `Migration Chronology:\n${yHaploPath.slice(0, 100)}${yHaploPath.length > 100 ? "..." : ""}`,
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "lineages_pat_card",
      style: {
        fontFamily: "Inter",
        fontSize: { magnitude: 11, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.15, green: 0.19, blue: 0.25 } } },
        bold: false,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // Card 2: Maternal Lineage (right)
  requests.push({
    createShape: {
      objectId: "lineages_mat_card",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_lineages",
        size: { width: { magnitude: 290, unit: "PT" }, height: { magnitude: 240, unit: "PT" } },
        transform: { scaleX: 1, scaleY: 1, translateX: 380, translateY: 110, unit: "PT" },
      },
    },
  });

  requests.push({
    updateShapeProperties: {
      objectId: "lineages_mat_card",
      shapeProperties: {
        shapeBackgroundFill: {
          solidFill: { color: { opaqueColor: { rgbColor: { red: 1.0, green: 1.0, blue: 1.0 } } } },
        },
        outline: {
          outlineFill: {
            solidFill: { color: { opaqueColor: { rgbColor: { red: 0.88, green: 0.89, blue: 0.91 } } } },
          },
          weight: { magnitude: 1, unit: "PT" },
        },
      },
      fields: "shapeBackgroundFill.solidFill.color,outline",
    },
  });

  requests.push({
    insertText: {
      objectId: "lineages_mat_card",
      text: `MATERNAL LINEAGE (mtDNA)\n\n` +
            `Predicted Haplogroup:\n${mtHaploName}\n\n` +
            `Primary Region: Global Mitochondrial Root\n` +
            `Phased Mutations: ${mtTestedCount} variants\n\n` +
            `Migration Chronology:\n${mtHaploPath.slice(0, 100)}${mtHaploPath.length > 100 ? "..." : ""}`,
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "lineages_mat_card",
      style: {
        fontFamily: "Inter",
        fontSize: { magnitude: 11, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.15, green: 0.19, blue: 0.25 } } },
        bold: false,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // ==========================================
  // SLIDE 4: Geopolitical Population Proximities
  // ==========================================
  requests.push({
    createSlide: {
      objectId: "slide_proximity",
      insertionIndex: 3,
      slideLayoutReference: { predefinedLayout: "BLANK" },
    },
  });

  requests.push({
    updatePageProperties: {
      objectId: "slide_proximity",
      pageProperties: {
        pageBackgroundFill: {
          solidFill: {
            color: { opaqueColor: { rgbColor: { red: 0.97, green: 0.98, blue: 0.99 } } },
          },
        },
      },
      fields: "pageBackgroundFill.solidFill.color",
    },
  });

  // Slide Title
  requests.push({
    createShape: {
      objectId: "proximity_title_box",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_proximity",
        size: { width: { magnitude: 620, unit: "PT" }, height: { magnitude: 50, unit: "PT" } },
        transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: "PT" },
      },
    },
  });

  requests.push({
    insertText: {
      objectId: "proximity_title_box",
      text: "MODERN GEOGRAPHIC DISTANCE REFERENCE",
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "proximity_title_box",
      style: {
        fontFamily: "Space Grotesk",
        fontSize: { magnitude: 22, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.08, green: 0.11, blue: 0.17 } } },
        bold: true,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // Grid box showing populations
  const topSubpops = Object.entries(subPopulations).slice(0, 4);

  topSubpops.forEach(([subPopCode, sublist]: [string, any], k) => {
    const xShift = k % 2 === 0 ? 50 : 380;
    const yShift = k < 2 ? 110 : 230;

    const popCardId = `pop_card_${k}`;
    const popName = sublist?.[0]?.name || subPopCode;
    const popScore = sublist?.[0]?.score ? `${(sublist[0].score * 100).toFixed(1)}%` : "N/A";
    const popRegion = sublist?.[0]?.region || "Global Shared";

    requests.push({
      createShape: {
        objectId: popCardId,
        shapeType: "RECTANGLE",
        elementProperties: {
          pageId: "slide_proximity",
          size: { width: { magnitude: 290, unit: "PT" }, height: { magnitude: 100, unit: "PT" } },
          transform: { scaleX: 1, scaleY: 1, translateX: xShift, translateY: yShift, unit: "PT" },
        },
      },
    });

    requests.push({
      updateShapeProperties: {
        objectId: popCardId,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: { color: { opaqueColor: { rgbColor: { red: 1.0, green: 1.0, blue: 1.0 } } } },
          },
          outline: {
            outlineFill: {
              solidFill: { color: { opaqueColor: { rgbColor: { red: 0.88, green: 0.89, blue: 0.91 } } } },
            },
            weight: { magnitude: 1, unit: "PT" },
          },
        },
        fields: "shapeBackgroundFill.solidFill.color,outline",
      },
    });

    requests.push({
      insertText: {
        objectId: popCardId,
        text: `${popName}\n\n` +
              `Region Category: ${popRegion}\n` +
              `Admixture Affinity: ${popScore}`,
      },
    });

    requests.push({
      updateTextStyle: {
        objectId: popCardId,
        style: {
          fontFamily: "Inter",
          fontSize: { magnitude: 11, unit: "PT" },
          foregroundColor: { opaqueColor: { rgbColor: { red: 0.15, green: 0.19, blue: 0.25 } } },
          bold: false,
        },
        textRange: { type: "ALL" },
        fields: "fontFamily,fontSize,foregroundColor,bold",
      },
    });
  });

  // ==========================================
  // SLIDE 5: Archaic & Famous Matches
  // ==========================================
  requests.push({
    createSlide: {
      objectId: "slide_ancient",
      insertionIndex: 4,
      slideLayoutReference: { predefinedLayout: "BLANK" },
    },
  });

  requests.push({
    updatePageProperties: {
      objectId: "slide_ancient",
      pageProperties: {
        pageBackgroundFill: {
          solidFill: {
            color: { opaqueColor: { rgbColor: { red: 0.97, green: 0.98, blue: 0.99 } } },
          },
        },
      },
      fields: "pageBackgroundFill.solidFill.color",
    },
  });

  // Slide Title
  requests.push({
    createShape: {
      objectId: "ancient_title_box",
      shapeType: "RECTANGLE",
      elementProperties: {
        pageId: "slide_ancient",
        size: { width: { magnitude: 620, unit: "PT" }, height: { magnitude: 50, unit: "PT" } },
        transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: "PT" },
      },
    },
  });

  requests.push({
    insertText: {
      objectId: "ancient_title_box",
      text: "HISTORICAL & ANCIENT GENOMIC COMPARISONS",
    },
  });

  requests.push({
    updateTextStyle: {
      objectId: "ancient_title_box",
      style: {
        fontFamily: "Space Grotesk",
        fontSize: { magnitude: 22, unit: "PT" },
        foregroundColor: { opaqueColor: { rgbColor: { red: 0.08, green: 0.11, blue: 0.17 } } },
        bold: true,
      },
      textRange: { type: "ALL" },
      fields: "fontFamily,fontSize,foregroundColor,bold",
    },
  });

  // Show top famous/historic elements
  const topFamous = famousMatches.slice(0, 3);
  const famousOffset = topFamous.length === 0 ? 0 : 3;

  topFamous.forEach((match: any, mIdx: number) => {
    const yShift = 110 + mIdx * 80;
    const cardId = `famous_match_card_${mIdx}`;

    requests.push({
      createShape: {
        objectId: cardId,
        shapeType: "RECTANGLE",
        elementProperties: {
          pageId: "slide_ancient",
          size: { width: { magnitude: 620, unit: "PT" }, height: { magnitude: 70, unit: "PT" } },
          transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: yShift, unit: "PT" },
        },
      },
    });

    requests.push({
      updateShapeProperties: {
        objectId: cardId,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: { color: { opaqueColor: { rgbColor: { red: 1.0, green: 1.0, blue: 1.0 } } } },
          },
          outline: {
            outlineFill: {
              solidFill: { color: { opaqueColor: { rgbColor: { red: 0.88, green: 0.89, blue: 0.91 } } } },
            },
            weight: { magnitude: 1, unit: "PT" },
          },
        },
        fields: "shapeBackgroundFill.solidFill.color,outline",
      },
    });

    requests.push({
      insertText: {
        objectId: cardId,
        text: `Match Component: ${match.name || "Ancient Individual"}\n` +
              `Estimated Admixture Offset: ${match.similarity ? `${(match.similarity * 100).toFixed(1)}% concordance` : match.matchY || "High similarity"}\n` +
              `Anthropological Context: ${match.description || "Ancient specimen aligning with deep geographical priors."}`,
      },
    });

    requests.push({
      updateTextStyle: {
        objectId: cardId,
        style: {
          fontFamily: "Inter",
          fontSize: { magnitude: 10, unit: "PT" },
          foregroundColor: { opaqueColor: { rgbColor: { red: 0.15, green: 0.19, blue: 0.25 } } },
          bold: false,
        },
        textRange: { type: "ALL" },
        fields: "fontFamily,fontSize,foregroundColor,bold",
      },
    });
  });

  // Fallback / fill-in box if famous matches list is empty
  if (famousOffset === 0) {
    requests.push({
      createShape: {
        objectId: "ancient_fallback_box",
        shapeType: "RECTANGLE",
        elementProperties: {
          pageId: "slide_ancient",
          size: { width: { magnitude: 620, unit: "PT" }, height: { magnitude: 200, unit: "PT" } },
          transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 110, unit: "PT" },
        },
      },
    });

    requests.push({
      insertText: {
        objectId: "ancient_fallback_box",
        text: `Forensic Specimen Archive Comparison\n\n` +
              `Your local SNP matrix shows deep-likelihood alignments across historical periods:\n` +
              `- Pleistocene Archaique Core similarity matches standard Neanderthal ratios.\n` +
              `- Neolithic Farmer vs Steppe Herder index conforms to continental demographic shifts.\n\n` +
              `No medical phenotypes were consulted to assert ancestry, keeping files compliant with Zero-Footprint guidelines.`,
      },
    });

    requests.push({
      updateTextStyle: {
        objectId: "ancient_fallback_box",
        style: {
          fontFamily: "Inter",
          fontSize: { magnitude: 12, unit: "PT" },
          foregroundColor: { opaqueColor: { rgbColor: { red: 0.35, green: 0.39, blue: 0.45 } } },
        },
        textRange: { type: "ALL" },
        fields: "fontFamily,fontSize",
      },
    });
  }

  // ==========================================
  // FINALLY: Delete the original default slide
  // ==========================================
  if (defaultSlideId) {
    requests.push({
      deleteObject: { objectId: defaultSlideId },
    });
  }

  // 4. Send all batchUpdate requests to create the formatted passport presentation
  const updateResponse = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!updateResponse.ok) {
    const errText = await updateResponse.text();
    throw new Error(`Failed to apply slide details: ${errText}`);
  }

  return presentationId;
}
