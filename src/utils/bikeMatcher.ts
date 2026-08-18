import { Superbike } from '../types';
import { SUPERBIKES } from '../data/superbikes';

// Comprehensive dictionary mapping common slang, abbreviations, acronyms & short forms to exact superbike IDs
export const SHORT_FORM_DICTIONARY: Record<string, string> = {
  // Suzuki
  'busa': 'suzuki-hayabusa-gen3',
  'hayabusa': 'suzuki-hayabusa-gen3',
  'gsx1300r': 'suzuki-hayabusa-gen3',
  'gsx 1300r': 'suzuki-hayabusa-gen3',
  'gen 3': 'suzuki-hayabusa-gen3',
  'gen3': 'suzuki-hayabusa-gen3',
  'gixxer': 'suzuki-gsx-r1000r',
  'gsxr': 'suzuki-gsx-r1000r',
  'gsx-r': 'suzuki-gsx-r1000r',
  'gsxr1000': 'suzuki-gsx-r1000r',
  'gsxr 1000': 'suzuki-gsx-r1000r',
  'gsx-r1000': 'suzuki-gsx-r1000r',
  'gsxr1000r': 'suzuki-gsx-r1000r',
  'gsx-r1000r': 'suzuki-gsx-r1000r',
  'katana': 'suzuki-katana',
  'gsx-s': 'suzuki-gsx-s1000gx',
  'gsxs1000': 'suzuki-gsx-s1000gx',
  'gsx8r': 'suzuki-gsx-8r',
  '8r': 'suzuki-gsx-8r',
  'vstrom': 'suzuki-vstrom-1050de',

  // BMW
  's1k': 'bmw-s1000rr-m-pack',
  's1000': 'bmw-s1000rr-m-pack',
  's1000rr': 'bmw-s1000rr-m-pack',
  's1000 rr': 'bmw-s1000rr-m-pack',
  's 1000 rr': 'bmw-s1000rr-m-pack',
  's1kr': 'bmw-s1000rr-m-pack',
  'm1k': 'bmw-m1000rr-2024',
  'm1000': 'bmw-m1000rr-2024',
  'm1000rr': 'bmw-m1000rr-2024',
  'm 1000 rr': 'bmw-m1000rr-2024',
  'm1kr': 'bmw-m1000rr-2024',
  'm1000r': 'bmw-m1000r',
  'm 1000 r': 'bmw-m1000r',
  'm1000xr': 'bmw-m1000xr',
  'm 1000 xr': 'bmw-m1000xr',
  's1000r': 'bmw-s1000r',
  's1000xr': 'bmw-s1000xr',
  'r1250': 'bmw-r1250gs-adv',
  'r1300': 'bmw-r1300gs',
  'gs': 'bmw-r1300gs',
  '1300gs': 'bmw-r1300gs',

  // Kawasaki
  'h2': 'kawasaki-ninja-h2r',
  'h2r': 'kawasaki-ninja-h2r',
  'h2 r': 'kawasaki-ninja-h2r',
  'ninja h2': 'kawasaki-ninja-h2r',
  'ninja h2r': 'kawasaki-ninja-h2r',
  'h2 carbon': 'kawasaki-ninja-h2-carbon',
  'h2 sx': 'kawasaki-ninja-h2-sx-se',
  'zh2': 'kawasaki-zh2-se',
  'z h2': 'kawasaki-zh2-se',
  '10r': 'kawasaki-ninja-zx10r-2024',
  'zx10': 'kawasaki-ninja-zx10r-2024',
  'zx10r': 'kawasaki-ninja-zx10r-2024',
  'zx-10r': 'kawasaki-ninja-zx10r-2024',
  'zx 10r': 'kawasaki-ninja-zx10r-2024',
  'zx10rr': 'kawasaki-ninja-zx10rr',
  'zx-10rr': 'kawasaki-ninja-zx10rr',
  '6r': 'kawasaki-ninja-zx6r',
  'zx6': 'kawasaki-ninja-zx6r',
  'zx6r': 'kawasaki-ninja-zx6r',
  'zx-6r': 'kawasaki-ninja-zx6r',
  'zx 6r': 'kawasaki-ninja-zx6r',
  '4rr': 'kawasaki-ninja-zx4rr',
  'zx4': 'kawasaki-ninja-zx4rr',
  'zx4r': 'kawasaki-ninja-zx4rr',
  'zx4rr': 'kawasaki-ninja-zx4rr',
  'zx-4rr': 'kawasaki-ninja-zx4rr',
  'z900': 'kawasaki-z900',
  'z 900': 'kawasaki-z900',
  'z1000': 'kawasaki-z1000',
  'ninja 1000': 'kawasaki-ninja-1000sx',
  '1000sx': 'kawasaki-ninja-1000sx',
  'versys 1000': 'kawasaki-versys-1000',

  // Ducati
  'v4r': 'ducati-panigale-v4r-2024',
  'v4 r': 'ducati-panigale-v4r-2024',
  'panigale v4 r': 'ducati-panigale-v4r-2024',
  'pani v4r': 'ducati-panigale-v4r-2024',
  'pani v4': 'ducati-panigale-v4s-2025',
  'panigale': 'ducati-panigale-v4r-2024',
  'v4s': 'ducati-panigale-v4s-2025',
  'v4 s': 'ducati-panigale-v4s-2025',
  'panigale v4s': 'ducati-panigale-v4s-2025',
  'panigale v4 s': 'ducati-panigale-v4s-2025',
  'panigale v4': 'ducati-panigale-v4s-2025',
  'v4': 'ducati-panigale-v4r-2024',
  'v2': 'ducati-panigale-v2-bayliss',
  'panigale v2': 'ducati-panigale-v2-bayliss',
  'pani v2': 'ducati-panigale-v2-bayliss',
  'superleggera': 'ducati-superleggera-v4',
  'superleggera v4': 'ducati-superleggera-v4',
  'streetfighter': 'ducati-streetfighter-v4-sp2',
  'sfv4': 'ducati-streetfighter-v4-sp2',
  'sf v4': 'ducati-streetfighter-v4-sp2',
  'sfv4 sp2': 'ducati-streetfighter-v4-sp2',
  'sfv2': 'ducati-streetfighter-v2',
  'sf v2': 'ducati-streetfighter-v2',
  'diavel': 'ducati-diavel-v4',
  'diavel v4': 'ducati-diavel-v4',
  'xdiavel': 'ducati-xdiavel-s',
  'monster': 'ducati-monster-sp',
  'monster sp': 'ducati-monster-sp',
  'hypermotard': 'ducati-hypermotard-698-mono',
  'hyper 698': 'ducati-hypermotard-698-mono',
  'mono': 'ducati-hypermotard-698-mono',
  'desertx': 'ducati-desertx-rally',
  'multistrada': 'ducati-multistrada-v4-pikes-peak',
  'pikes peak': 'ducati-multistrada-v4-pikes-peak',

  // Yamaha
  'r1': 'yamaha-r1m-2024',
  'r1m': 'yamaha-r1m-2024',
  'r1 m': 'yamaha-r1m-2024',
  'yzf r1': 'yamaha-r1m-2024',
  'yzf-r1': 'yamaha-r1m-2024',
  'yzf-r1m': 'yamaha-r1m-2024',
  'crossplane': 'yamaha-r1m-2024',
  'cp4': 'yamaha-r1m-2024',
  'r6': 'yamaha-r6-race',
  'r6 race': 'yamaha-r6-race',
  'yzf r6': 'yamaha-r6-race',
  'yzf-r6': 'yamaha-r6-race',
  'r7': 'yamaha-r7',
  'yzf r7': 'yamaha-r7',
  'r3': 'yamaha-r3',
  'yzf r3': 'yamaha-r3',
  'r15': 'yamaha-r15m',
  'r15m': 'yamaha-r15m',
  'mt09': 'yamaha-mt09-sp',
  'mt-09': 'yamaha-mt09-sp',
  'mt09 sp': 'yamaha-mt09-sp',
  'mt10': 'yamaha-mt10-sp',
  'mt-10': 'yamaha-mt10-sp',
  'mt10 sp': 'yamaha-mt10-sp',

  // Honda
  'blade': 'honda-cbr1000rr-r-sp',
  'fireblade': 'honda-cbr1000rr-r-sp',
  'cbr': 'honda-cbr1000rr-r-sp',
  'cbr1k': 'honda-cbr1000rr-r-sp',
  'cbr1000': 'honda-cbr1000rr-r-sp',
  'cbr1000rr': 'honda-cbr1000rr-r-sp',
  'cbr1000rr-r': 'honda-cbr1000rr-r-sp',
  'cbr1000rrr': 'honda-cbr1000rr-r-sp',
  'cbr 1000 rr-r': 'honda-cbr1000rr-r-sp',
  'triple r': 'honda-cbr1000rr-r-sp',
  'fireblade sp': 'honda-cbr1000rr-r-sp',
  'cbr650': 'honda-cbr650r',
  'cbr650r': 'honda-cbr650r',
  'cbr 650': 'honda-cbr650r',
  'cbr650r e-clutch': 'honda-cbr650r',
  'africatwin': 'honda-crf1100l-africa-twin-es',
  'africa twin': 'honda-crf1100l-africa-twin-es',

  // Aprilia
  'rsv4': 'aprilia-rsv4-factory-1100',
  'rsv 4': 'aprilia-rsv4-factory-1100',
  'rsv4 factory': 'aprilia-rsv4-factory-1100',
  'rsv4 1100': 'aprilia-rsv4-factory-1100',
  'tuono': 'aprilia-tuono-v4-factory',
  'tuono v4': 'aprilia-tuono-v4-factory',
  'tuono factory': 'aprilia-tuono-v4-factory',
  'rs660': 'aprilia-rs-660-extrema',
  'rs 660': 'aprilia-rs-660-extrema',
  'extrema': 'aprilia-rs-660-extrema',
  'tuono 660': 'aprilia-tuono-660-factory',
  'rs457': 'aprilia-rs-457',
  'rs 457': 'aprilia-rs-457',

  // KTM
  'super duke': 'ktm-1390-super-duke-r-evo',
  'superduke': 'ktm-1390-super-duke-r-evo',
  '1390': 'ktm-1390-super-duke-r-evo',
  '1390 r': 'ktm-1390-super-duke-r-evo',
  '1390 super duke': 'ktm-1390-super-duke-r-evo',
  'the beast': 'ktm-1390-super-duke-r-evo',
  'sdr': 'ktm-1390-super-duke-r-evo',
  '1290': 'ktm-1290-super-duke-r',
  '1290 super duke': 'ktm-1290-super-duke-r',
  '890': 'ktm-890-duke-r',
  '890 duke': 'ktm-890-duke-r',
  '990': 'ktm-990-duke',
  '990 duke': 'ktm-990-duke',
  'rc8c': 'ktm-rc-8c',
  'rc 8c': 'ktm-rc-8c',
  'rc390': 'ktm-rc-390-gp',
  'rc 390': 'ktm-rc-390-gp',
  'duke 390': 'ktm-390-duke-gen3',
  '390 duke': 'ktm-390-duke-gen3',

  // MV Agusta
  'f4': 'mv-agusta-f4-1000-rr',
  'f4rr': 'mv-agusta-f4-1000-rr',
  'f4 rr': 'mv-agusta-f4-1000-rr',
  'f4 1000': 'mv-agusta-f4-1000-rr',
  'f4 rc': 'mv-agusta-f4-rc',
  'superveloce': 'mv-agusta-superveloce-1000',
  'superveloce 1000': 'mv-agusta-superveloce-1000',
  'superveloce 800': 'mv-agusta-superveloce-800',
  'brutale': 'mv-agusta-brutale-1000-rr',
  'brutale 1000': 'mv-agusta-brutale-1000-rr',
  'rush': 'mv-agusta-rush-1000',
  'rush 1000': 'mv-agusta-rush-1000',
  'dragster': 'mv-agusta-dragster-rr',

  // Triumph
  'rocket': 'triumph-rocket-3-r',
  'rocket 3': 'triumph-rocket-3-r',
  'rocket 3 r': 'triumph-rocket-3-r',
  'rocket 3 gt': 'triumph-rocket-3-gt',
  'speed triple': 'triumph-speed-triple-1200-rr',
  'speed 1200': 'triumph-speed-triple-1200-rr',
  'speed 1200 rs': 'triumph-speed-triple-1200-rs',
  'speed 1200 rr': 'triumph-speed-triple-1200-rr',
  'street triple': 'triumph-street-triple-765-rs',
  'striple': 'triumph-street-triple-765-rs',
  '765': 'triumph-street-triple-765-rs',
  '765 rs': 'triumph-street-triple-765-rs',
  'moto2': 'triumph-street-triple-765-moto2',
  'daytona': 'triumph-daytona-660',
  'daytona 660': 'triumph-daytona-660',
  'tiger': 'triumph-tiger-1200-rally-pro',
  'tiger 1200': 'triumph-tiger-1200-rally-pro',
  'tiger 900': 'triumph-tiger-900-rally-pro',
};

// Normalize string: lowercases, removes excessive punctuation and spaces
export function normalizeBikeSearch(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Ultra-accurate superbike resolver
export function findBestSuperbike(query: string, bikes: Superbike[] = SUPERBIKES): Superbike | null {
  if (!query || query.trim().length === 0) return null;
  const rawQuery = query.toLowerCase().trim();
  const normalizedQuery = normalizeBikeSearch(query);

  // 1. Direct ID match
  const directId = bikes.find(
    (b) => b.id.toLowerCase() === rawQuery || b.id.toLowerCase() === normalizedQuery
  );
  if (directId) return directId;

  // 2. Direct Short Form Dictionary Match (e.g. "busa", "s1k", "v4r", "h2r", "blade", "10r")
  if (SHORT_FORM_DICTIONARY[rawQuery]) {
    const matched = bikes.find((b) => b.id === SHORT_FORM_DICTIONARY[rawQuery]);
    if (matched) return matched;
  }
  if (SHORT_FORM_DICTIONARY[normalizedQuery]) {
    const matched = bikes.find((b) => b.id === SHORT_FORM_DICTIONARY[normalizedQuery]);
    if (matched) return matched;
  }

  // Check multi-word phrase matching against dictionary
  for (const [alias, targetId] of Object.entries(SHORT_FORM_DICTIONARY)) {
    // Exact word boundary match in prompt
    const regex = new RegExp(`\\b${alias.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(rawQuery) || regex.test(normalizedQuery)) {
      const matched = bikes.find((b) => b.id === targetId);
      if (matched) return matched;
    }
  }

  // 3. Exact Name or shortName match
  const exactName = bikes.find(
    (b) =>
      b.name.toLowerCase() === rawQuery ||
      b.shortName.toLowerCase() === rawQuery ||
      normalizeBikeSearch(b.name) === normalizedQuery ||
      normalizeBikeSearch(b.shortName) === normalizedQuery
  );
  if (exactName) return exactName;

  // 4. Check bike-defined aliases
  for (const bike of bikes) {
    if (bike.aliases && bike.aliases.length > 0) {
      for (const a of bike.aliases) {
        if (rawQuery === a.toLowerCase() || normalizedQuery === normalizeBikeSearch(a)) {
          return bike;
        }
      }
    }
  }

  // 5. High-confidence Substring Matching (Longest matching names prioritized)
  const sortedBikes = [...bikes].sort((a, b) => b.name.length - a.name.length);
  for (const bike of sortedBikes) {
    const nameNorm = normalizeBikeSearch(bike.name);
    const shortNorm = normalizeBikeSearch(bike.shortName);

    if (rawQuery.includes(bike.name.toLowerCase()) || normalizedQuery.includes(nameNorm)) {
      return bike;
    }
    if (shortNorm.length >= 3 && (rawQuery.includes(bike.shortName.toLowerCase()) || normalizedQuery.includes(shortNorm))) {
      return bike;
    }
  }

  // 6. Token Overlap & Fuzzy Scoring
  let bestScore = 0;
  let bestMatch: Superbike | null = null;

  const queryTokens = normalizedQuery.split(' ').filter((t) => t.length > 1);
  if (queryTokens.length === 0) return null;

  for (const bike of sortedBikes) {
    let score = 0;
    const bikeTokens = `${bike.name} ${bike.shortName} ${bike.manufacturer} ${bike.category}`
      .toLowerCase()
      .split(' ');

    for (const qToken of queryTokens) {
      if (bikeTokens.includes(qToken)) {
        score += 3;
      } else if (bikeTokens.some((bt) => bt.includes(qToken) || qToken.includes(bt))) {
        score += 1.5;
      }
    }

    // Boost if manufacturer matches
    if (rawQuery.includes(bike.manufacturer.toLowerCase())) {
      score += 2;
    }

    if (score > bestScore && score >= 3) {
      bestScore = score;
      bestMatch = bike;
    }
  }

  return bestMatch;
}

// Filter multiple bikes with ranking (for search grids and picker lists)
export function filterSuperbikes(query: string, bikes: Superbike[] = SUPERBIKES): Superbike[] {
  if (!query || !query.trim()) return bikes;
  const q = query.trim().toLowerCase();
  const normQ = normalizeBikeSearch(query);

  // Check if dictionary has direct alias
  const dictionaryTargetId = SHORT_FORM_DICTIONARY[q] || SHORT_FORM_DICTIONARY[normQ];
  if (dictionaryTargetId) {
    const targetBike = bikes.find((b) => b.id === dictionaryTargetId);
    if (targetBike) {
      const rest = bikes.filter((b) => b.id !== dictionaryTargetId);
      return [targetBike, ...rest.filter((b) => b.manufacturer === targetBike.manufacturer)];
    }
  }

  return bikes
    .map((bike) => {
      let score = 0;
      const name = bike.name.toLowerCase();
      const short = bike.shortName.toLowerCase();
      const mfg = bike.manufacturer.toLowerCase();
      const cat = bike.category.toLowerCase();
      const normName = normalizeBikeSearch(bike.name);

      if (bike.id === q || name === q || short === q) score += 100;
      else if (name.startsWith(q) || short.startsWith(q)) score += 50;
      else if (name.includes(q) || normName.includes(normQ)) score += 30;
      else if (short.includes(q)) score += 25;
      else if (mfg.includes(q)) score += 15;
      else if (cat.includes(q)) score += 10;
      else if (bike.tagline.toLowerCase().includes(q)) score += 5;

      return { bike, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.bike);
}
