import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import Manufacturer from '@/models/Manufacturer';
import Machine from '@/models/Machine';
import Startup from '@/models/Startup';
import Gig from '@/models/Gig';

// Sample data for manufacturers (Companies with seasonal machines)
const manufacturersData = [
  {
    companyName: 'Harvest Tech Industries',
    companyEmail: 'machines@harvesttech.in',
    password: 'password123',
    workSector: 'Agricultural Equipment',
    location: 'Ludhiana, Punjab',
  },
  {
    companyName: 'Winter Sports Equipment Co.',
    companyEmail: 'equipment@wintersports.in',
    password: 'password123',
    workSector: 'Seasonal Sports Equipment',
    location: 'Manali, Himachal Pradesh',
  },
  {
    companyName: 'Monsoon Construction Ltd',
    companyEmail: 'machinery@monsoonbuild.com',
    password: 'password123',
    workSector: 'Construction Equipment',
    location: 'Mumbai, Maharashtra',
  },
  {
    companyName: 'Festival Fireworks Manufacturing',
    companyEmail: 'production@festivalfireworks.in',
    password: 'password123',
    workSector: 'Fireworks Manufacturing',
    location: 'Sivakasi, Tamil Nadu',
  },
  {
    companyName: 'Textile Seasonal Works',
    companyEmail: 'factory@textileworks.co.in',
    password: 'password123',
    workSector: 'Textile Manufacturing',
    location: 'Tirupur, Tamil Nadu',
  },
];

// Sample data for seasonal machines (Currently inactive/available for rent)
const machinesData = [
  // Harvest Tech Industries - Agricultural machines (Post-harvest season)
  {
    name: 'Combine Harvester XL-2000',
    type: 'Agricultural Equipment',
    description:
      'Heavy-duty combine harvester ideal for wheat, rice, and corn harvesting. Currently inactive post-harvest season (Nov-March), available for rental to startups working on agricultural processing projects.',
    location: 'Ludhiana, Punjab',
    specifications: {
      harvestingWidth: '6.5 meters',
      grainTankCapacity: '8000 liters',
      enginePower: '350 HP',
      workingSpeed: '8-12 km/h',
      seasonalUse: 'April-October (Harvest Season)',
      fuelConsumption: '25 liters/hour',
      weight: '15 tons',
      manufacturer: 'John Deere',
      modelYear: '2020',
      inactiveMonths: ['November', 'December', 'January', 'February', 'March'],
      peakUsage: 'April-October',
      reasonForAvailability:
        'Post-harvest season - machine idle until next crop cycle',
    },
    pricePerHour: 3500,
    available: true,
    status: 'active',
  },
  {
    name: 'Rice Threshing Machine',
    type: 'Agricultural Processing',
    description:
      'Industrial rice threshing and cleaning machine. Idle during off-season, perfect for food processing startups or research projects requiring grain processing capabilities.',
    location: 'Ludhiana, Punjab',
    specifications: {
      capacity: '2000 kg/hour',
      power: '75 HP',
      grainLoss: '<1%',
      cleaningEfficiency: '99%',
      dimensions: '8m x 3m x 4m',
      weight: '5 tons',
      powerSource: 'Electric/Diesel',
      grainTypes: 'Rice, Wheat, Barley',
      inactiveMonths: ['December', 'January', 'February', 'March'],
      peakUsage: 'October-November',
      reasonForAvailability:
        'Off-season availability for alternative processing needs',
    },
    pricePerHour: 1800,
    available: true,
    status: 'active',
  },

  // Winter Sports Equipment Co. - Snow processing machines (Summer availability)
  {
    name: 'Industrial Snow Making Machine',
    type: 'Snow Processing Equipment',
    description:
      'High-capacity snow making machine used for winter sports venues. Available during summer months for ice processing, cold storage testing, or cooling system projects.',
    location: 'Manali, Himachal Pradesh',
    specifications: {
      snowOutput: '500 cubic meters/hour',
      waterConsumption: '15 liters/minute',
      airPressure: '100 PSI',
      operatingTemp: '-10°C to 2°C',
      powerRequirement: '75 kW',
      weight: '8 tons',
      dimensions: '6m x 3m x 4m',
      manufacturer: 'SnowTech Pro',
      modelYear: '2019',
      inactiveMonths: ['April', 'May', 'June', 'July', 'August', 'September'],
      peakUsage: 'December-February',
      reasonForAvailability: 'Summer months - no snow sports demand',
    },
    pricePerHour: 4200,
    available: true,
    status: 'active',
  },
  {
    name: 'Ice Crushing and Processing Unit',
    type: 'Ice Processing',
    description:
      'Industrial ice crushing and shaping equipment for winter sports. Perfect for beverage industry startups or cold storage businesses during off-season.',
    location: 'Manali, Himachal Pradesh',
    specifications: {
      crushingCapacity: '1000 kg/hour',
      iceTypes: 'Cubes, Flakes, Blocks',
      power: '50 HP',
      outputSize: 'Adjustable 2-50mm',
      hopper: '500 kg capacity',
      weight: '3 tons',
      dimensions: '4m x 2m x 3m',
      manufacturer: 'IceCraft Industries',
      modelYear: '2021',
      foodGradeCompliant: true,
      temperatureRange: '-20°C to 0°C',
      inactiveMonths: ['May', 'June', 'July', 'August', 'September'],
      peakUsage: 'November-March',
      reasonForAvailability:
        'Non-winter months availability for commercial ice production',
    },
    pricePerHour: 2500,
    available: true,
    status: 'active',
  },

  // Monsoon Construction Ltd - Construction equipment (Dry season availability)
  {
    name: 'Heavy Duty Excavator CAT-350',
    type: 'Construction Equipment',
    description:
      'Large excavator typically used for monsoon drainage projects. Available during dry season for construction startups, mining projects, or land development.',
    location: 'Mumbai, Maharashtra',
    specifications: {
      operatingWeight: '35 tons',
      bucketCapacity: '1.8 cubic meters',
      maxDigDepth: '7.5 meters',
      enginePower: '280 HP',
      maxReach: '10.5 meters',
      fuelCapacity: '500 liters',
      manufacturer: 'Caterpillar',
      modelYear: '2018',
      hydraulicFlow: '450 liters/min',
      trackWidth: '600mm',
      inactiveMonths: ['November', 'December', 'January', 'February'],
      peakUsage: 'June-October (Monsoon Season)',
      reasonForAvailability:
        'Dry season - ideal for alternative construction projects',
    },
    pricePerHour: 5500,
    available: true,
    status: 'active',
  },
  {
    name: 'Water Pumping System Industrial',
    type: 'Water Management',
    description:
      'High-capacity water pumping system for flood management. Available off-season for irrigation projects, water treatment startups, or industrial cleaning.',
    location: 'Mumbai, Maharashtra',
    specifications: {
      flowRate: '5000 liters/minute',
      headLift: '150 meters',
      power: '200 HP',
      pumpType: 'Centrifugal',
      suctionSize: '300mm',
      dischargeSize: '250mm',
      inactiveMonths: ['December', 'January', 'February', 'March', 'April'],
      peakUsage: 'June-November',
      reasonForAvailability:
        'Non-monsoon months - available for water infrastructure projects',
    },
    pricePerHour: 3000,
    available: true,
    status: 'active',
  },

  // Festival Fireworks Manufacturing - Pyrotechnics equipment (Post-festival season)
  {
    name: 'Pyrotechnic Mixing Machine',
    type: 'Chemical Processing',
    description:
      'Specialized mixing equipment for pyrotechnic compounds. Available post-festival season for chemical research, pharmaceutical mixing, or specialty material production.',
    location: 'Sivakasi, Tamil Nadu',
    specifications: {
      mixingCapacity: '500 kg/batch',
      mixingTypes: 'Powder, Granular, Chemical',
      safety: 'Explosion-proof design',
      precision: '±0.1% mixing accuracy',
      inactiveMonths: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
      ],
      peakUsage: 'September-December (Festival Season)',
      reasonForAvailability:
        'Post-festival period - equipment idle until next season',
    },
    pricePerHour: 2800,
    available: true,
    status: 'active',
  },
  {
    name: 'Precision Cutting and Shaping Machine',
    type: 'Precision Manufacturing',
    description:
      'High-precision cutting machine for fireworks components. Ideal for startups in precision parts manufacturing, jewelry making, or small component production.',
    location: 'Sivakasi, Tamil Nadu',
    specifications: {
      cuttingPrecision: '±0.05mm',
      materialTypes: 'Paper, Cardboard, Thin Metals',
      cuttingSpeed: '100 cuts/minute',
      maxThickness: '5mm',
      inactiveMonths: ['February', 'March', 'April', 'May', 'June', 'July'],
      peakUsage: 'August-January',
      reasonForAvailability:
        'Off-season availability for precision manufacturing needs',
    },
    pricePerHour: 1500,
    available: true,
    status: 'active',
  },

  // Textile Seasonal Works - Garment production (Off-season availability)
  {
    name: 'Industrial Sewing Machine Array',
    type: 'Textile Manufacturing',
    description:
      'Bank of 20 industrial sewing machines typically used for seasonal garment production. Available during fashion off-season for prototype development or small-batch production.',
    location: 'Tirupur, Tamil Nadu',
    specifications: {
      machineCount: '20 units',
      stitchTypes: 'Lock, Chain, Overlock, Buttonhole',
      maxSpeed: '5000 stitches/minute',
      fabricTypes: 'Cotton, Polyester, Blend',
      inactiveMonths: ['April', 'May', 'June', 'July'],
      peakUsage: 'August-March (Fashion Season)',
      reasonForAvailability:
        'Fashion off-season - perfect for startup apparel testing',
    },
    pricePerHour: 2000,
    available: true,
    status: 'active',
  },
  {
    name: 'Fabric Dyeing and Processing Unit',
    type: 'Textile Processing',
    description:
      'Complete fabric dyeing and finishing setup. Available off-season for experimental fabric treatments, sustainable dyeing research, or small-scale custom orders.',
    location: 'Tirupur, Tamil Nadu',
    specifications: {
      capacity: '1000 meters/day',
      dyeTypes: 'Reactive, Acid, Direct, Vat',
      fabricWidth: 'Up to 180cm',
      waterRecycling: 'Yes - 80% recovery',
      inactiveMonths: ['May', 'June', 'July'],
      peakUsage: 'August-April',
      reasonForAvailability:
        'Summer break - available for R&D and custom projects',
    },
    pricePerHour: 4000,
    available: true,
    status: 'active',
  },
];

// Sample data for startups (Companies needing seasonal machines and blue-collar workers)
const startupsData = [
  {
    companyName: 'AgriTech Innovations',
    companyEmail: 'team@agritech.in',
    password: 'password123',
    workSector: 'Agricultural Technology',
    location: 'Bangalore, Karnataka',
    foundedYear: 2022,
  },
  {
    companyName: 'ColdChain Solutions',
    companyEmail: 'contact@coldchain.co.in',
    password: 'password123',
    workSector: 'Cold Storage & Logistics',
    location: 'Delhi, NCR',
    foundedYear: 2021,
  },
  {
    companyName: 'EcoConstruct Pvt Ltd',
    companyEmail: 'info@ecoconstruct.in',
    password: 'password123',
    workSector: 'Sustainable Construction',
    location: 'Pune, Maharashtra',
    foundedYear: 2023,
  },
  {
    companyName: 'FestivalTech Solutions',
    companyEmail: 'hello@festivaltech.in',
    password: 'password123',
    workSector: 'Event Technology',
    location: 'Chennai, Tamil Nadu',
    foundedYear: 2022,
  },
  {
    companyName: 'FashionForward Labs',
    companyEmail: 'team@fashionforward.in',
    password: 'password123',
    workSector: 'Fashion Technology',
    location: 'Mumbai, Maharashtra',
    foundedYear: 2020,
  },
];

// Sample data for gigs (Blue-collar jobs for operating seasonal machines)
const gigsData = [
  // AgriTech Innovations - Need skilled agricultural workers
  {
    title: 'Combine Harvester Operator',
    description:
      'We are seeking experienced combine harvester operators for our agricultural technology testing project. Must have 3+ years experience operating heavy agricultural machinery. Work involves testing new IoT sensors on harvesting equipment during our prototype development phase. Knowledge of GPS-guided systems preferred.',
    skillsRequired: [
      'Heavy Machinery Operation',
      'Agricultural Equipment',
      'GPS Systems',
      'Safety Protocols',
      'Equipment Maintenance',
    ],
    location: 'Ludhiana, Punjab',
    salary: 45000,
    duration: 'Contract',
    isActive: true,
    status: 'active',
  },
  {
    title: 'Agricultural Equipment Technician',
    description:
      'Looking for skilled technicians to operate and maintain rice threshing equipment for our grain processing automation project. Responsibilities include machine setup, operation monitoring, quality control, and basic maintenance. Experience with grain processing machinery essential.',
    skillsRequired: [
      'Agricultural Machinery',
      'Equipment Maintenance',
      'Quality Control',
      'Technical Skills',
      'Safety Management',
    ],
    location: 'Ludhiana, Punjab',
    salary: 38000,
    duration: 'Part-time',
    isActive: true,
    status: 'active',
  },

  // ColdChain Solutions - Need refrigeration and ice processing workers
  {
    title: 'Ice Processing Machine Operator',
    description:
      'Seeking skilled operators for industrial ice processing equipment. Role involves operating snow making and ice crushing machines for our cold chain research project. Must understand refrigeration systems and have experience with industrial cooling equipment. Safety certification required.',
    skillsRequired: [
      'Refrigeration Systems',
      'Industrial Equipment',
      'Safety Protocols',
      'Machine Operation',
      'Quality Control',
    ],
    location: 'Manali, Himachal Pradesh',
    salary: 42000,
    duration: 'Full-time',
    isActive: true,
    status: 'active',
  },
  {
    title: 'Cold Storage Equipment Technician',
    description:
      'We need experienced technicians to operate ice crushing and processing units for our logistics optimization project. Work includes equipment setup, process monitoring, troubleshooting, and maintenance. Knowledge of industrial refrigeration systems and food safety standards required.',
    skillsRequired: [
      'Cold Storage Systems',
      'Equipment Maintenance',
      'Food Safety',
      'Technical Troubleshooting',
      'Process Control',
    ],
    location: 'Manali, Himachal Pradesh',
    salary: 40000,
    duration: 'Contract',
    isActive: true,
    status: 'active',
  },

  // EcoConstruct - Need construction equipment operators
  {
    title: 'Heavy Equipment Operator - Excavator',
    description:
      'Experienced excavator operators needed for sustainable construction pilot projects. Must have valid operator license and 5+ years experience with CAT excavators. Work involves precision digging for eco-friendly foundation systems and sustainable building techniques. Environmental awareness preferred.',
    skillsRequired: [
      'Heavy Equipment Operation',
      'Excavator License',
      'Construction Safety',
      'Precision Work',
      'Environmental Compliance',
    ],
    location: 'Mumbai, Maharashtra',
    salary: 55000,
    duration: 'Full-time',
    isActive: true,
    status: 'active',
  },
  {
    title: 'Water Systems Operator',
    description:
      'Skilled operators needed for industrial water pumping systems in our green building projects. Responsibilities include pump operation, water flow management, system maintenance, and quality monitoring. Experience with large-scale water management systems required.',
    skillsRequired: [
      'Water Systems',
      'Pump Operation',
      'System Maintenance',
      'Flow Control',
      'Quality Testing',
    ],
    location: 'Mumbai, Maharashtra',
    salary: 35000,
    duration: 'Part-time',
    isActive: true,
    status: 'active',
  },

  // FestivalTech Solutions - Need precision equipment operators
  {
    title: 'Precision Equipment Operator',
    description:
      'We need skilled operators for precision cutting and shaping equipment for our festival tech hardware production. Must have experience with high-precision manufacturing equipment. Work involves creating custom electronic enclosures and precision components for event technology systems.',
    skillsRequired: [
      'Precision Manufacturing',
      'CNC Operation',
      'Quality Control',
      'Blueprint Reading',
      'Technical Skills',
    ],
    location: 'Sivakasi, Tamil Nadu',
    salary: 32000,
    duration: 'Contract',
    isActive: true,
    status: 'active',
  },
  {
    title: 'Chemical Processing Technician',
    description:
      'Experienced technician needed to operate specialized mixing equipment for our LED and electronics manufacturing. Background in chemical processing or similar mixing operations required. Safety training and handling of electronic materials experience preferred.',
    skillsRequired: [
      'Chemical Processing',
      'Mixing Operations',
      'Safety Protocols',
      'Quality Control',
      'Electronics Materials',
    ],
    location: 'Sivakasi, Tamil Nadu',
    salary: 40000,
    duration: 'Full-time',
    isActive: true,
    status: 'active',
  },

  // FashionForward Labs - Need textile workers
  {
    title: 'Industrial Sewing Machine Operator',
    description:
      'Skilled sewing machine operators needed for sustainable fashion prototype development. Must have 2+ years experience with industrial sewing equipment. Work involves creating prototype garments, testing new sustainable materials, and quality control for our eco-fashion line.',
    skillsRequired: [
      'Industrial Sewing',
      'Garment Construction',
      'Quality Control',
      'Pattern Following',
      'Sustainable Materials',
    ],
    location: 'Tirupur, Tamil Nadu',
    salary: 28000,
    duration: 'Part-time',
    isActive: true,
    status: 'active',
  },
  {
    title: 'Fabric Processing Specialist',
    description:
      'Experienced fabric dyeing and processing specialist for our sustainable textile research. Must understand various dyeing techniques and fabric treatments. Work involves testing eco-friendly dyeing processes and developing sustainable fabric treatment methods for our fashion innovation lab.',
    skillsRequired: [
      'Fabric Dyeing',
      'Textile Processing',
      'Color Matching',
      'Chemical Handling',
      'Sustainable Processes',
    ],
    location: 'Tirupur, Tamil Nadu',
    salary: 35000,
    duration: 'Contract',
    isActive: true,
    status: 'active',
  },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting WorkLink database seeding...');
    console.log(
      '🔗 Creating seasonal machine sharing and blue-collar job platform data...'
    );

    // Connect to database
    await dbConnect();
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Manufacturer.deleteMany({}),
      Machine.deleteMany({}),
      Startup.deleteMany({}),
      Gig.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared');

    // Hash passwords
    const saltRounds = 10;
    console.log('🔐 Hashing passwords...');

    // Create manufacturers
    console.log('🏭 Creating manufacturers with seasonal machines...');
    const createdManufacturers = [];
    for (const manufacturerData of manufacturersData) {
      const hashedPassword = await bcrypt.hash(
        manufacturerData.password,
        saltRounds
      );
      const manufacturer = new Manufacturer({
        ...manufacturerData,
        password: hashedPassword,
      });
      const savedManufacturer = await manufacturer.save();
      createdManufacturers.push(savedManufacturer);
      console.log(`  ✓ Created manufacturer: ${manufacturerData.companyName}`);
    }

    // Create machines for each manufacturer
    console.log(
      '⚙️ Creating seasonal machines (currently idle and available for rent)...'
    );
    let machineIndex = 0;
    for (let i = 0; i < createdManufacturers.length; i++) {
      const manufacturer = createdManufacturers[i];

      // Each manufacturer gets 2 machines
      for (let j = 0; j < 2; j++) {
        if (machineIndex < machinesData.length) {
          const machineData = machinesData[machineIndex];
          const machine = new Machine({
            ...machineData,
            manufacturerId: manufacturer._id,
          });
          await machine.save();
          console.log(
            `    ✓ Listed seasonal machine: ${machineData.name} (${machineData.type})`
          );
          machineIndex++;
        }
      }
    }

    // Create startups
    console.log('🚀 Creating startups looking for machines and workers...');
    const createdStartups = [];
    for (const startupData of startupsData) {
      const hashedPassword = await bcrypt.hash(
        startupData.password,
        saltRounds
      );
      const startup = new Startup({
        ...startupData,
        password: hashedPassword,
      });
      const savedStartup = await startup.save();
      createdStartups.push(savedStartup);
      console.log(
        `  ✓ Created startup: ${startupData.companyName} (${startupData.workSector})`
      );
    }

    // Create gigs for each startup
    console.log('💼 Creating blue-collar job opportunities...');
    let gigIndex = 0;
    for (let i = 0; i < createdStartups.length; i++) {
      const startup = createdStartups[i];

      // Each startup gets 2 gigs
      for (let j = 0; j < 2; j++) {
        if (gigIndex < gigsData.length) {
          const gigData = gigsData[gigIndex];
          const gig = new Gig({
            ...gigData,
            startupId: startup._id,
          });
          await gig.save();
          console.log(
            `    ✓ Posted job: ${gigData.title} for ${startup.companyName}`
          );
          gigIndex++;
        }
      }
    }

    console.log('\n🎉 WorkLink database seeding completed successfully!');
    console.log(`📊 Platform Summary:`);
    console.log(
      `   🏭 ${createdManufacturers.length} Manufacturers with seasonal machines`
    );
    console.log(`   ⚙️ ${machineIndex} Seasonal machines available for rent`);
    console.log(
      `   🚀 ${createdStartups.length} Startups needing machines & workers`
    );
    console.log(`   💼 ${gigIndex} Blue-collar job opportunities created`);
    console.log(
      `\n🔗 WorkLink: Connecting seasonal machines with startups and blue-collar workers!`
    );

    return {
      success: true,
      data: {
        manufacturers: createdManufacturers.length,
        machines: machineIndex,
        startups: createdStartups.length,
        gigs: gigIndex,
      },
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Function to check if database needs seeding
export async function checkDatabaseStatus() {
  try {
    await dbConnect();

    const counts = await Promise.all([
      Manufacturer.countDocuments(),
      Machine.countDocuments(),
      Startup.countDocuments(),
      Gig.countDocuments(),
    ]);

    return {
      manufacturers: counts[0],
      machines: counts[1],
      startups: counts[2],
      gigs: counts[3],
      isEmpty: counts.every((count) => count === 0),
    };
  } catch (error) {
    console.error('Error checking database status:', error);
    return null;
  }
}
