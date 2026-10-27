/**
 * AgriTechno Precision Soil & Crop Advisory Engine
 * Calculates nutrient deficits, optimal fertilizer dosages, and crop suitability matrices
 */

export const analyzeSoilSample = ({ nitrogen, phosphorus, potassium, phLevel, organicCarbon = 0.5, soilType = 'Alluvial' }) => {
  const n = Number(nitrogen) || 0;
  const p = Number(phosphorus) || 0;
  const k = Number(potassium) || 0;
  const ph = Number(phLevel) || 7.0;
  const oc = Number(organicCarbon) || 0.5;

  // 1. Soil Health Status
  let overallHealth = 'Optimal';
  let phCategory = 'Neutral';

  if (ph < 5.5) {
    phCategory = 'Strongly Acidic';
    overallHealth = 'Acidic';
  } else if (ph < 6.5) {
    phCategory = 'Slightly Acidic';
  } else if (ph <= 7.5) {
    phCategory = 'Neutral & Ideal';
  } else if (ph <= 8.5) {
    phCategory = 'Moderately Alkaline';
  } else {
    phCategory = 'Strongly Alkaline / Saline';
    overallHealth = 'Slightly Alkaline';
  }

  if (n < 200 || p < 15 || k < 120) {
    overallHealth = 'Deficient';
  }

  // 2. Fertilizer Dosage Calculation (kg/acre)
  // Standard agronomic targets: N: 280 kg/ha, P: 25 kg/ha, K: 150 kg/ha
  // 1 Hectare = 2.47 Acres
  const targetN = 280;
  const targetP = 24;
  const targetK = 140;

  const deficitN_ha = Math.max(0, targetN - n);
  const deficitP_ha = Math.max(0, targetP - p);
  const deficitK_ha = Math.max(0, targetK - k);

  // Urea contains ~46% Nitrogen (1 kg N = 2.17 kg Urea)
  // DAP contains 18% N and 46% P2O5
  // MOP contains 60% K2O
  // Converted to kg per acre
  const dapNeeded = Math.round((deficitP_ha * 2.17) / 2.47);
  // Nitrogen supplied by DAP = DAP * 0.18
  const remainingN_acre = Math.max(0, (deficitN_ha / 2.47) - (dapNeeded * 0.18));
  const ureaNeeded = Math.round(remainingN_acre * 2.17);
  const mopNeeded = Math.round((deficitK_ha * 1.67) / 2.47);

  // Soil amendments based on pH
  let gypsumNeeded = 0;
  let limeNeeded = 0;
  let phRecommendation = 'Soil pH is well balanced for optimal nutrient uptake.';

  if (ph > 8.0) {
    gypsumNeeded = Math.round((ph - 8.0) * 120); // kg/acre agricultural gypsum
    phRecommendation = `Alkaline soil detected (pH ${ph}). Apply ${gypsumNeeded} kg/acre Agricultural Gypsum before next tilling to reduce sodium saturation.`;
  } else if (ph < 6.2) {
    limeNeeded = Math.round((6.5 - ph) * 150); // kg/acre calcitic lime
    phRecommendation = `Acidic soil detected (pH ${ph}). Apply ${limeNeeded} kg/acre Agricultural Lime / Dolomite to normalize soil reaction.`;
  }

  // 3. Crop Suitability Matrix
  const candidateCrops = [
    {
      name: 'Wheat (गेहूं)',
      idealPh: [6.0, 7.5],
      minN: 200,
      minP: 15,
      minK: 110,
      season: 'Rabi',
      baseScore: 92,
      reason: 'Excellent nitrogen and potassium response for grain development.',
    },
    {
      name: 'Mustard / Rapeseed (सरसों)',
      idealPh: [6.0, 7.5],
      minN: 180,
      minP: 18,
      minK: 90,
      season: 'Rabi',
      baseScore: 90,
      reason: 'Ideal soil moisture and phosphorus levels promote strong root branching.',
    },
    {
      name: 'Paddy / Basmati Rice (धान)',
      idealPh: [5.5, 7.2],
      minN: 220,
      minP: 20,
      minK: 130,
      season: 'Kharif',
      baseScore: 88,
      reason: 'Clay/Alluvial loam supports excellent standing water retention.',
    },
    {
      name: 'Cotton (कपास)',
      idealPh: [6.5, 8.2],
      minN: 210,
      minP: 16,
      minK: 120,
      season: 'Kharif',
      baseScore: 85,
      reason: 'Deep root penetration with moderate alkaline tolerance.',
    },
    {
      name: 'Maize / Corn (मक्का)',
      idealPh: [5.8, 7.2],
      minN: 240,
      minP: 22,
      minK: 130,
      season: 'Kharif / Zaid',
      baseScore: 89,
      reason: 'High feeder crop; responds vigorously to current micronutrient profiles.',
    },
    {
      name: 'Chickpea / Gram (चना)',
      idealPh: [6.2, 7.8],
      minN: 140, // Legume fixes N
      minP: 18,
      minK: 100,
      season: 'Rabi',
      baseScore: 94,
      reason: 'Symbiotic nitrogen fixation enriches your soil while yielding top market grade.',
    },
    {
      name: 'Sugarcane (गन्ना)',
      idealPh: [6.0, 7.8],
      minN: 260,
      minP: 24,
      minK: 160,
      season: 'Perennial',
      baseScore: 82,
      reason: 'High potassium requirement satisfied; good organic matter foundation.',
    },
    {
      name: 'Potato (आलू)',
      idealPh: [5.2, 6.8],
      minN: 220,
      minP: 25,
      minK: 180,
      season: 'Rabi',
      baseScore: 87,
      reason: 'Requires loose friable soil with high available potash for tuber swelling.',
    },
  ];

  const recommendedCrops = candidateCrops
    .map((crop) => {
      let score = crop.baseScore;
      // Penalize if pH out of range
      if (ph < crop.idealPh[0] || ph > crop.idealPh[1]) {
        const phDiff = Math.min(Math.abs(ph - crop.idealPh[0]), Math.abs(ph - crop.idealPh[1]));
        score -= Math.min(30, Math.round(phDiff * 15));
      }
      // Nutrient adjustments
      if (n < crop.minN) score -= 4;
      if (p < crop.minP) score -= 4;
      if (k < crop.minK) score -= 4;
      if (oc > 0.6) score += 5; // Organic carbon bonus

      score = Math.max(45, Math.min(98, score));

      return {
        crop: crop.name,
        season: crop.season,
        suitabilityScore: score,
        reason: crop.reason,
      };
    })
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const advisoryNotes = `${phRecommendation} Soil organic carbon is ${oc}%. ${
    oc < 0.5
      ? 'Incorporate 2-3 tonnes/acre of well-rotted Farmyard Manure (FYM) or vermicompost to bolster biological microbial activity.'
      : 'Healthy organic carbon content ensures high fertilizer use efficiency.'
  }`;

  return {
    overallHealth,
    phCategory,
    fertilizerDeficit: {
      ureaNeeded,
      dapNeeded,
      mopNeeded,
      gypsumNeeded,
      limeNeeded,
    },
    recommendedCrops,
    advisoryNotes,
  };
};
