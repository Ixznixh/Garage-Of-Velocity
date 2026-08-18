export interface RiderAids {
  tractionControl: number; // 0-8
  wheelieControl: number; // 0-4
  engineBrake: number; // 0-3
  corneringAbs: number; // 1-3
  quickshifter: boolean;
  launchControl: boolean;
  slideControl: number; // 0-3
  pitLaneLimiter: boolean;
}

export interface TelemetryMetrics {
  topSpeedKmh: number;
  acceleration0to100: number; // seconds
  quarterMileSec: number;
  powerHp: number;
  powerWithRaceKitHp?: number;
  torqueNm: number;
  rpmRedline: number;
  dryWeightKg: number;
  wetWeightKg: number;
  powerToWeight: number; // hp/kg
  downforceAt300KmhKg: number;
  maxLeanAngleDeg: number;
}

export interface Superbike {
  id: string;
  name: string;
  shortName: string;
  manufacturer: string;
  originCountry: string;
  year: number;
  tagline: string;
  category: string;
  heroImage: string;
  badgeImage?: string;
  engineSoundFreq: number; // base synth frequency
  engineCylinders: string;
  displacementCc: number;
  metrics: TelemetryMetrics;
  chassis: {
    frame: string;
    frontSuspension: string;
    rearSuspension: string;
    frontBrakes: string;
    rearBrakes: string;
    swingarm: string;
    wheels: string;
  };
  aero: {
    wingletsType: string;
    downforceKg: number;
    dragCoefficient: number;
    description: string;
  };
  electronics: {
    imu: string;
    modes: string[];
    defaultAids: RiderAids;
    telemetryLogger: string;
  };
  accentColor: string; // hex
  glowColor: string; // rgba or class
  priceUsd: number;
  priceInrLakh?: number; // Price in Lakhs INR (Ex-Showroom India)
  overview: string;
  keyFeatures: string[];
  aliases?: string[];
}

export interface HeritageMilestone {
  year: number;
  title: string;
  description: string;
  category: 'MotoGP' | 'WorldSBK' | 'Engineering' | 'Flagship Release';
}

export interface PredecessorBike {
  name: string;
  year: number;
  powerHp: number;
  displacementCc: number;
  description: string;
  image: string;
}

export interface BrandHeritage {
  manufacturer: string;
  badgeColor: string;
  country: string;
  founded: number;
  racingPedigree: {
    motogpChampionships: number;
    wsbkChampionships: number;
    isleOfManTtWins: number;
  };
  philosophy: string;
  milestones: HeritageMilestone[];
  predecessors: PredecessorBike[];
}

export interface CustomBuild {
  id: string;
  baseBikeId: string;
  buildName: string;
  livery: string; // 'Carbon Stealth' | 'Factory Racing' | 'Cyber Neon' | 'Tricolore'
  exhaust: {
    name: string;
    hpGain: number;
    weightSavingKg: number;
  };
  wheels: {
    name: string;
    weightSavingKg: number;
  };
  brakes: {
    name: string;
    stoppingPowerGainPct: number;
  };
  ecuTune: {
    name: string;
    hpGain: number;
    revLimitIncrease: number;
  };
  createdAt: string;
}

export interface UserProfile {
  callSign: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  googleId?: string;
  authProvider: 'google' | 'guest';
  isGuest: boolean;
  racingTier: 'Track Day Novice' | 'Superstock Racer' | 'Factory Test Pilot' | 'Apex Legend';
  favoriteBikeIds: string[];
  customBuilds: CustomBuild[];
  lapRecords: {
    track: string;
    bikeName: string;
    lapTime: string;
    topSpeed: number;
    date: string;
  }[];
  syncedAt?: string;
}

export interface GoogleAuthPayload {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}
