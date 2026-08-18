import { Superbike, BrandHeritage, UserProfile } from '../types';
import { KAWASAKI_BIKES } from './bikes_kawasaki';
import { DUCATI_BIKES } from './bikes_ducati';
import { BMW_SUZUKI_BIKES } from './bikes_bmw_suzuki';
import { YAMAHA_APRILIA_BIKES } from './bikes_yamaha_aprilia';
import { HONDA_TRIUMPH_BIKES } from './bikes_honda_triumph';
import { KTM_MV_OTHERS_BIKES } from './bikes_ktm_mv_others';

// Comprehensive collection of 60+ popular superbikes in India & globally
export const SUPERBIKES: Superbike[] = [
  ...DUCATI_BIKES,
  ...KAWASAKI_BIKES,
  ...BMW_SUZUKI_BIKES,
  ...YAMAHA_APRILIA_BIKES,
  ...HONDA_TRIUMPH_BIKES,
  ...KTM_MV_OTHERS_BIKES,
];

export const BRAND_HERITAGES: Record<string, BrandHeritage> = {
  Ducati: {
    manufacturer: 'Ducati',
    badgeColor: '#FF0055',
    country: 'Italy (Borgo Panigale, Bologna)',
    founded: 1926,
    racingPedigree: {
      motogpChampionships: 4, // Stoner, Bagnaia, Martin
      wsbkChampionships: 16, // Fogarty, Bayliss, Corser, Bautista
      isleOfManTtWins: 8,
    },
    philosophy: 'Desmodromic valve actuation, Italian styling, and MotoGP aerodynamic engineering honed on world circuits.',
    milestones: [
      {
        year: 1972,
        title: 'Imola 200 Victory',
        description: 'Paul Smart and Bruno Spaggiari take 1-2 finish on the 750 Desmo, cementing Ducati as a road-racing powerhouse.',
        category: 'Flagship Release'
      },
      {
        year: 1994,
        title: 'Birth of the Iconic Ducati 916',
        description: 'Massimo Tamburini designs the 916 with underseat exhausts and single-sided swingarm, transforming modern superbike design.',
        category: 'Engineering'
      },
      {
        year: 2007,
        title: 'Casey Stoner & Desmosedici GP7 Championship',
        description: 'Ducati wins its first MotoGP World Championship with the legendary 800cc Desmosedici GP7.',
        category: 'MotoGP'
      },
      {
        year: 2018,
        title: 'Desmosedici Stradale V4 Era',
        description: 'Ducati transitions from its legendary V-twin to the 90° V4 counter-rotating engine layout.',
        category: 'Engineering'
      },
      {
        year: 2024,
        title: 'Consecutive MotoGP & WSBK Dominance',
        description: 'Ducati Lenovo and Aruba.it Racing continue historic dominance across premier global motorsport championships.',
        category: 'WorldSBK'
      }
    ],
    predecessors: [
      {
        name: 'Ducati 916 SP',
        year: 1994,
        powerHp: 114,
        displacementCc: 916,
        description: 'The golden standard of superbike aesthetics with underseat pipes and dual projector headlamps.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Ducati Desmosedici RR',
        year: 2006,
        powerHp: 200,
        displacementCc: 989,
        description: 'The world’s first true MotoGP replica street bike, limited to 1,500 units globally.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Ducati 1199 Panigale R',
        year: 2013,
        powerHp: 195,
        displacementCc: 1198,
        description: 'The pinnacle of the Superquadro V-Twin engine with monocoque aluminum frame.',
        image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  Kawasaki: {
    manufacturer: 'Kawasaki',
    badgeColor: '#00FF88',
    country: 'Japan (Kobe / Akashi)',
    founded: 1896,
    racingPedigree: {
      motogpChampionships: 1,
      wsbkChampionships: 8, // Jonathan Rea 6-consecutive titles
      isleOfManTtWins: 41,
    },
    philosophy: 'Industrial-grade engineering power from Kawasaki Heavy Industries, pioneering forced induction and raw top-end dominance.',
    milestones: [
      {
        year: 1972,
        title: 'Kawasaki Z1 900 Launch',
        description: 'The "King of Motorcycles" creates the modern inline-four superbike template with 82 HP and double overhead cams.',
        category: 'Flagship Release'
      },
      {
        year: 1984,
        title: 'GPZ900R Ninja Born',
        description: 'The original Ninja capable of over 243 km/h, immortalized in modern pop culture and motorcycle racing history.',
        category: 'Engineering'
      },
      {
        year: 2015,
        title: 'Ninja H2 & H2R Supercharged Revolution',
        description: 'The first factory supercharged production superbike with 310+ horsepower and carbon aerodynamic wings.',
        category: 'Engineering'
      },
      {
        year: 2015,
        title: 'Jonathan Rea 6x WorldSBK Era',
        description: 'Unprecedented streak of six consecutive World Superbike championships aboard the Ninja ZX-10RR.',
        category: 'WorldSBK'
      }
    ],
    predecessors: [
      {
        name: 'Kawasaki Z1 900 Super Four',
        year: 1972,
        powerHp: 82,
        displacementCc: 903,
        description: 'The machine that shattered every top speed record and defined 4-cylinder motorcycling.',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Kawasaki Ninja ZX-7RR',
        year: 1996,
        powerHp: 122,
        displacementCc: 749,
        description: 'The legendary green WSBK homologation warrior ridden by Scott Russell and Doug Chandler.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  BMW: {
    manufacturer: 'BMW',
    badgeColor: '#00F0FF',
    country: 'Germany (Munich / Berlin)',
    founded: 1916,
    racingPedigree: {
      motogpChampionships: 0,
      wsbkChampionships: 1, // Toprak Razgatlioglu 2024
      isleOfManTtWins: 34 // Peter Hickman & Michael Dunlop records
    },
    philosophy: 'Precision Bavarian engineering, ShiftCam variable valve timing, and M Motorsport lightweight telemetry architecture.',
    milestones: [
      {
        year: 2009,
        title: 'S 1000 RR Shocks the World',
        description: 'BMW enters the superbike category with 193 HP, asymmetric headlights, and dynamic traction control, resetting expectations.',
        category: 'Flagship Release'
      },
      {
        year: 2019,
        title: 'ShiftCam Valve Technology',
        description: 'Introduces dual intake cam lobes that switch at 9,000 RPM for devastating midrange torque and extreme redline.',
        category: 'Engineering'
      },
      {
        year: 2021,
        title: 'First-Ever M Motorcycle (M 1000 RR)',
        description: 'The prestigious BMW M brand enters two wheels with full carbon downforce wings and Pankl titanium rods.',
        category: 'Engineering'
      },
      {
        year: 2024,
        title: 'Toprak Razgatlioglu WorldSBK Championship',
        description: 'Unprecedented 13 consecutive race wins to capture the 2024 World Superbike title for BMW Motorrad.',
        category: 'WorldSBK'
      }
    ],
    predecessors: [
      {
        name: 'BMW S 1000 RR (Gen 1)',
        year: 2009,
        powerHp: 193,
        displacementCc: 999,
        description: 'The benchmark superbike that revolutionized electronic rider aids and class power figures.',
        image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'BMW HP4 Race',
        year: 2017,
        powerHp: 215,
        displacementCc: 999,
        description: 'Track-only engineering marvel with full carbon fiber main frame weighing just 7.8 kg.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  Suzuki: {
    manufacturer: 'Suzuki',
    badgeColor: '#0066FF',
    country: 'Japan (Hamamatsu, Shizuoka)',
    founded: 1909,
    racingPedigree: {
      motogpChampionships: 7, // Sheene, Lucchinelli, Uncini, Schwantz, Roberts Jr, Mir
      wsbkChampionships: 1, // Troy Corser 2005
      isleOfManTtWins: 94,
    },
    philosophy: 'Pure mechanical durability, SRAD ram-air technology, and unmatched hyper-speed aerodynamic stability.',
    milestones: [
      {
        year: 1985,
        title: 'GSX-R750 Defines the Modern Superbike',
        description: 'Introduces the oil-cooled light-weight alloy chassis, shedding 30kg over rivals and creating the race replica genre.',
        category: 'Flagship Release'
      },
      {
        year: 1999,
        title: 'Hayabusa GSX1300R Tops 312 km/h',
        description: 'Captures the title of undisputed fastest production motorcycle on earth and creates the hyperbike legend.',
        category: 'Engineering'
      },
      {
        year: 2005,
        title: 'GSX-R1000 K5 Legend',
        description: 'Regarded as one of the finest liter-class engines ever made, dominating WorldSBK and AMA superbike racing.',
        category: 'WorldSBK'
      },
      {
        year: 2020,
        title: 'Joan Mir Wins MotoGP World Championship',
        description: 'Suzuki celebrates its 100th anniversary by taking the premier class MotoGP title with the GSX-RR.',
        category: 'MotoGP'
      }
    ],
    predecessors: [
      {
        name: 'Suzuki GSX-R750 "Slabside"',
        year: 1985,
        powerHp: 100,
        displacementCc: 749,
        description: 'The machine that started the supersport revolution with light aluminum frame and oil cooling.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Suzuki Hayabusa Gen 1 (Unrestricted)',
        year: 1999,
        powerHp: 175,
        displacementCc: 1299,
        description: 'Pre-gentlemen’s agreement unrestricted 312 km/h hyperbike.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  Yamaha: {
    manufacturer: 'Yamaha',
    badgeColor: '#3B82F6',
    country: 'Japan (Iwata, Shizuoka)',
    founded: 1955,
    racingPedigree: {
      motogpChampionships: 18, // Agostini, Roberts, Lawson, Rainey, Rossi, Lorenzo, Quartararo
      wsbkChampionships: 2, // Spies, Razgatlioglu
      isleOfManTtWins: 242,
    },
    philosophy: 'Human-machine connection "Jin-Ki Kanno", Crossplane CP4 linear torque delivery, and Grand Prix chassis balance.',
    milestones: [
      {
        year: 1998,
        title: 'YZF-R1 Redefines 1000cc Class',
        description: 'Vertically stacked gearbox creates an ultra-compact chassis, providing 600cc handling with 150 HP liter-bike punch.',
        category: 'Flagship Release'
      },
      {
        year: 2004,
        title: 'Valentino Rossi & Yamaha MotoGP Glory',
        description: 'Rossi joins Yamaha and wins the MotoGP title in his debut race on the YZR-M1.',
        category: 'MotoGP'
      },
      {
        year: 2009,
        title: 'Crossplane Crankshaft CP4 Debut',
        description: 'Yamaha brings the uneven 270°-180°-90°-180° firing interval from MotoGP to the production R1.',
        category: 'Engineering'
      },
      {
        year: 2015,
        title: 'YZF-R1M with 6-Axis IMU & Electronic Suspension',
        description: 'First production motorcycle with 3D gyroscopic IMU and semi-active Öhlins ERS racing suspension.',
        category: 'Engineering'
      }
    ],
    predecessors: [
      {
        name: 'Yamaha OW-01 (FZR750R)',
        year: 1989,
        powerHp: 121,
        displacementCc: 749,
        description: 'Homologation special with titanium rods, flat-slide carbs, and Deltabox aluminum frame.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Yamaha YZF-R7 (OW-02)',
        year: 1999,
        powerHp: 160,
        displacementCc: 749,
        description: 'Strictly limited to 500 units for WorldSBK racing, featuring twin fuel injectors per cylinder.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  Aprilia: {
    manufacturer: 'Aprilia',
    badgeColor: '#EF4444',
    country: 'Italy (Noale, Venice)',
    founded: 1945,
    racingPedigree: {
      motogpChampionships: 0, // 54 World Titles total across 125/250cc classes
      wsbkChampionships: 7, // Max Biaggi, Sylvain Guintoli
      isleOfManTtWins: 3,
    },
    philosophy: 'Noale racing chassis perfection with compact 65° V4 engine packaging and championship APRC electronics.',
    milestones: [
      {
        year: 1998,
        title: 'RSV Mille V-Twin Debut',
        description: 'Aprilia enters the big-bore superbike class with an aggressive 60° V-Twin and benchmark chassis.',
        category: 'Flagship Release'
      },
      {
        year: 2009,
        title: 'The 65° V4 Masterpiece (RSV4)',
        description: 'Max Biaggi leads Aprilia to WorldSBK glory on the compact 65° V4 engine layout.',
        category: 'WorldSBK'
      },
      {
        year: 2021,
        title: 'RSV4 1100 Factory with Inverted Underslung Swingarm',
        description: 'Brings genuine RS-GP MotoGP swingarm geometry and 217 HP to production.',
        category: 'Engineering'
      },
      {
        year: 2024,
        title: 'Aprilia RS 457 Made in India Global Launch',
        description: 'Brings pure Italian racing chassis and twin-cylinder performance to enthusiasts in India and worldwide.',
        category: 'Flagship Release'
      }
    ],
    predecessors: [
      {
        name: 'Aprilia RSV Mille R',
        year: 2000,
        powerHp: 130,
        displacementCc: 998,
        description: 'Equipped with Öhlins suspension and OZ forged wheels, dominating superstock racing.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  Honda: {
    manufacturer: 'Honda',
    badgeColor: '#DC2626',
    country: 'Japan (Tokyo / Kumamoto)',
    founded: 1948,
    racingPedigree: {
      motogpChampionships: 25, // Hailwood, Spencer, Lawson, Doohan, Rossi, Hayden, Stoner, Marquez
      wsbkChampionships: 6, // Merkel, Kocinski, Edwards, Toseland
      isleOfManTtWins: 260, // Most successful manufacturer in TT history
    },
    philosophy: 'Total Control philosophy with championship-winning RC-series V4 and inline-four racing pedigree.',
    milestones: [
      {
        year: 1987,
        title: 'VFR750R (RC30) Homologation Icon',
        description: 'Hand-assembled HRC racing machine that won the first two World Superbike championships in 1988 and 1989.',
        category: 'WorldSBK'
      },
      {
        year: 1992,
        title: 'Tadao Baba Creates the Original CBR900RR Fireblade',
        description: 'Introduces the "Total Control" philosophy, weighing 35 kg lighter than rival liter bikes.',
        category: 'Flagship Release'
      },
      {
        year: 2002,
        title: 'VTR1000 SP-2 (RC51) Colin Edwards WSBK Triumph',
        description: 'V-Twin superbike engineered to defeat Ducati, winning the 2000 and 2002 World Superbike crowns.',
        category: 'WorldSBK'
      },
      {
        year: 2020,
        title: 'CBR1000RR-R Fireblade SP with MotoGP Bore/Stroke',
        description: 'Complete redesign utilizing Marc Márquez’s RC213V engine dimensions and aero package.',
        category: 'Engineering'
      }
    ],
    predecessors: [
      {
        name: 'Honda VFR750R (RC30)',
        year: 1987,
        powerHp: 118,
        displacementCc: 748,
        description: 'The legendary HRC V4 with titanium connecting rods and single-sided Pro-Arm swingarm.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Honda RVF750R (RC45)',
        year: 1994,
        powerHp: 120,
        displacementCc: 749,
        description: 'Programmed Fuel Injection (PGM-FI) endurance racer that won the Isle of Man TT and Suzuka 8 Hours.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  Triumph: {
    manufacturer: 'Triumph',
    badgeColor: '#FFB800',
    country: 'United Kingdom (Hinckley, Leicestershire)',
    founded: 1902,
    racingPedigree: {
      motogpChampionships: 0, // Exclusive Moto2 Engine Supplier since 2019
      wsbkChampionships: 0, // WorldSSP race winners
      isleOfManTtWins: 23,
    },
    philosophy: 'Iconic British inline triple-cylinder engines delivering visceral torque, distinctive howl, and benchmark handling balance.',
    milestones: [
      {
        year: 1994,
        title: 'Speed Triple T509 Unveiled',
        description: 'Defines the factory streetfighter movement with raw twin bug-eye headlights and tubular alloy frame.',
        category: 'Flagship Release'
      },
      {
        year: 2006,
        title: 'Daytona 675 Shatters the Supersport Class',
        description: 'The 3-cylinder supersport outclasses Japanese inline-fours, winning multiple Supersport titles.',
        category: 'Engineering'
      },
      {
        year: 2019,
        title: 'Official Engine Supplier to Moto2 World Championship',
        description: 'Triumph 765cc triple engine becomes the exclusive powerplant for Grand Prix Moto2, breaking track records worldwide.',
        category: 'MotoGP'
      },
      {
        year: 2024,
        title: 'Rocket 3 Storm 2,500cc Hyper-Cruiser',
        description: 'Generates 221 Nm of torque, reigning as the highest displacement mass-production motorcycle in existence.',
        category: 'Engineering'
      }
    ],
    predecessors: [
      {
        name: 'Triumph Daytona 675R',
        year: 2011,
        powerHp: 126,
        displacementCc: 675,
        description: 'Equipped with Öhlins NIX30 forks, TTX36 rear shock, and Brembo monobloc calipers.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Triumph Speed Triple 1050',
        year: 2005,
        powerHp: 130,
        displacementCc: 1050,
        description: 'The quintessential streetfighter with dual high-mount under-seat exhaust pipes.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  KTM: {
    manufacturer: 'KTM',
    badgeColor: '#FF6600',
    country: 'Austria (Mattighofen)',
    founded: 1934,
    racingPedigree: {
      motogpChampionships: 0, // Red Bull KTM Factory MotoGP multiple GP wins
      wsbkChampionships: 0,
      isleOfManTtWins: 19, // 19 consecutive Dakar Rally victories
    },
    philosophy: 'READY TO RACE: Uncompromised LC8/LC8c power, lightweight CrMo trellis engineering, and aggressive WP suspension.',
    milestones: [
      {
        year: 2005,
        title: '990 Super Duke "The Original Beast"',
        description: 'KTM launches its first dedicated big-bore street supernaked with an aggressive 999cc LC8 V-Twin.',
        category: 'Flagship Release'
      },
      {
        year: 2014,
        title: '1290 Super Duke R Unleashed',
        description: '180 HP and 144 Nm torque reset the hypernaked category, earning the global moniker "The Beast".',
        category: 'Engineering'
      },
      {
        year: 2020,
        title: 'Brad Binder Takes KTM’s First MotoGP Victory',
        description: 'KTM RC16 takes victory in only its fourth season in premier class MotoGP at Brno.',
        category: 'MotoGP'
      },
      {
        year: 2024,
        title: '1390 Super Duke R Evo with Cam-Shift',
        description: '190 HP and 145 Nm with WP Semi-Active Gen 3 technology and automated launch height device.',
        category: 'Engineering'
      }
    ],
    predecessors: [
      {
        name: 'KTM 1190 RC8 R',
        year: 2010,
        powerHp: 175,
        displacementCc: 1195,
        description: 'Angular Austrian superbike with 75° V-Twin engine and fully adjustable chassis geometry.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  'MV Agusta': {
    manufacturer: 'MV Agusta',
    badgeColor: '#FFB800',
    country: 'Italy (Schiranna, Varese)',
    founded: 1945,
    racingPedigree: {
      motogpChampionships: 38, // Giacomo Agostini 15 World Titles, John Surtees, Mike Hailwood, Phil Read
      wsbkChampionships: 0,
      isleOfManTtWins: 34,
    },
    philosophy: 'Motorcycle Art: Uncompromised sculptural beauty paired with screaming high-RPM radial-valve 4-cylinder engines.',
    milestones: [
      {
        year: 1966,
        title: 'Giacomo Agostini Golden Era',
        description: 'Agostini wins 7 consecutive 500cc Grand Prix championships aboard the 3-cylinder and 4-cylinder MV Agusta.',
        category: 'MotoGP'
      },
      {
        year: 1997,
        title: 'Massimo Tamburini Unveils F4 750 Serie Oro',
        description: 'Voted the most beautiful motorcycle in the world, inaugurating the under-seat organ pipe exhaust.',
        category: 'Flagship Release'
      },
      {
        year: 2013,
        title: 'Corsa Corta 14,000+ RPM Engine',
        description: 'Short stroke 998cc engine with radial valves produces 201+ HP without forced induction.',
        category: 'Engineering'
      }
    ],
    predecessors: [
      {
        name: 'MV Agusta F4 750 Serie Oro',
        year: 1999,
        powerHp: 126,
        displacementCc: 749,
        description: 'Sculpted masterpiece with magnesium swingarm and hand-poured carbon bodywork.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'MV Agusta F4 CC (Claudio Castiglioni)',
        year: 2006,
        powerHp: 200,
        displacementCc: 1078,
        description: '$120,000 bespoke collector hyperbike with titanium exhaust and mechanical slipper clutch.',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  'Harley-Davidson': {
    manufacturer: 'Harley-Davidson',
    badgeColor: '#FF6600',
    country: 'USA (Milwaukee, Wisconsin)',
    founded: 1903,
    racingPedigree: {
      motogpChampionships: 0,
      wsbkChampionships: 0,
      isleOfManTtWins: 0, // MotoAmerica King of the Baggers Champions
    },
    philosophy: 'Iconic American muscular V-Twin heritage fused with next-generation liquid-cooled Revolution Max performance.',
    milestones: [
      {
        year: 1970,
        title: 'XR750 Flat Track Dominator',
        description: 'Becomes the most winning motorcycle in AMA Grand National Championship flat track history.',
        category: 'Flagship Release'
      },
      {
        year: 2001,
        title: 'V-Rod with Porsche Engineering',
        description: 'First liquid-cooled Harley-Davidson developed in collaboration with Porsche engineering.',
        category: 'Engineering'
      },
      {
        year: 2021,
        title: 'Revolution Max 1250 Debut',
        description: '150 HP DOHC liquid-cooled V-Twin powers the Pan America and Sportster S into modern performance benchmarks.',
        category: 'Engineering'
      }
    ],
    predecessors: [
      {
        name: 'Harley-Davidson XR1200X',
        year: 2010,
        powerHp: 91,
        displacementCc: 1202,
        description: 'Sport-tuned flat-track roadster with Showa Big Piston inverted forks and Nissin 4-piston calipers.',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  'Royal Enfield': {
    manufacturer: 'Royal Enfield',
    badgeColor: '#3B82F6',
    country: 'India (Chennai) / UK (Bruntingthorpe)',
    founded: 1901,
    racingPedigree: {
      motogpChampionships: 0,
      wsbkChampionships: 0,
      isleOfManTtWins: 0, // Continental GT Cup One-Make Championship
    },
    philosophy: 'Pure motorcycling: accessible, charismatic, British-engineered air/oil-cooled twin-cylinder machines with Harris Performance chassis.',
    milestones: [
      {
        year: 1964,
        title: 'Continental GT 250 Ton-Up Icon',
        description: 'Britain’s fastest 250cc machine with fiberglass race tank and clip-on handlebars.',
        category: 'Flagship Release'
      },
      {
        year: 2018,
        title: '650 Twin Engine Platform Unveiled',
        description: 'All-new 648cc 270° crank parallel-twin developed at UK Technology Centre revives multi-cylinder Royal Enfield pedigree.',
        category: 'Engineering'
      },
      {
        year: 2023,
        title: 'Himalayan 450 with Sherpa Liquid-Cooled Motor',
        description: 'First-ever DOHC liquid-cooled engine from Royal Enfield engineered for high-altitude Himalayan passes.',
        category: 'Engineering'
      }
    ],
    predecessors: [
      {
        name: 'Royal Enfield Continental GT 535',
        year: 2013,
        powerHp: 29.1,
        displacementCc: 535,
        description: 'Single-cylinder café racer with Harris Performance double-cradle frame and Paioli shocks.',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop'
      }
    ]
  }
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  callSign: 'NIXH',
  email: 'telemetry@apexshowcase.io',
  fullName: 'Nixh',
  authProvider: 'guest',
  isGuest: true,
  racingTier: 'Factory Test Pilot',
  favoriteBikeIds: ['ducati-panigale-v4r', 'kawasaki-ninja-h2r', 'bmw-m1000rr', 'suzuki-hayabusa-gen3'],
  customBuilds: [
    {
      id: 'build-demo-1',
      baseBikeId: 'ducati-panigale-v4r',
      buildName: 'Panigale V4 R Superleggera Spec',
      livery: 'Carbon Stealth Matte',
      exhaust: {
        name: 'Akrapovič Full Titanium WSBK Race Exhaust',
        hpGain: 14,
        weightSavingKg: 6.8,
      },
      wheels: {
        name: 'BST Carbon Fiber Ultra-Light High-Modulus',
        weightSavingKg: 3.8,
      },
      brakes: {
        name: 'Brembo GP4-RR Monobloc Billet Titanium Pistons',
        stoppingPowerGainPct: 18,
      },
      ecuTune: {
        name: 'Stage 2 WorldSBK Telemetry Custom Map',
        hpGain: 15,
        revLimitIncrease: 600,
      },
      createdAt: '2025-01-15',
    },
  ],
  lapRecords: [
    {
      track: 'Mugello Circuit (Autodromo Internazionale del Mugello)',
      bikeName: 'Ducati Panigale V4 R',
      lapTime: '1:47.821',
      date: '2024-10-12',
      topSpeed: 342,
    },
    {
      track: 'Buddh International Circuit (Greater Noida, India)',
      bikeName: 'Kawasaki Ninja ZX-10RR',
      lapTime: '1:54.210',
      date: '2024-11-20',
      topSpeed: 304,
    },
    {
      track: 'Circuit de Barcelona-Catalunya',
      bikeName: 'BMW M 1000 RR',
      lapTime: '1:39.914',
      date: '2024-11-04',
      topSpeed: 331,
    },
  ],
};
