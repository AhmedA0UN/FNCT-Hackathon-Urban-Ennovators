// Mock data for SmartWaste application

export type BinStatus = 'collected' | 'full' | 'waiting' | 'anomaly';
export type TruckStatus = 'active' | 'returning' | 'at-depot';
export type SensorStatus = 'ok' | 'defective';

export interface Bin {
  id: string;
  zone: string;
  type: '240L' | '660L' | '1100L';
  fillLevel: number; // 0-100
  volume: number; // in m³
  lastReading: string;
  sensorStatus: SensorStatus;
  status: BinStatus;
  lat: number;
  lng: number;
  address: string;
}

export interface Stop {
  id: string;
  binId: string;
  address: string;
  volume: number;
  status: 'completed' | 'in-progress' | 'pending';
  time?: string;
  fillLevel: number;
}

export interface Truck {
  id: string;
  driver: string;
  capacity: number; // 0-100
  binsCollected: number;
  binsTotal: number;
  kmTraveled: number;
  eta: string;
  status: TruckStatus;
  route: Stop[];
  color: string;
  lat: number;
  lng: number;
}

export const ZONES = [
  'Ariana Centre',
  'Ettadhamen',
  'Raoued',
  'La Soukra',
  'Mnihla',
  'Kalâat el-Andalous',
  'Borj Louzir',
  'Sidi Thabet'
];

export const mockBins: Bin[] = [
  { id: 'PB-042', zone: 'Ariana Centre', type: '240L', fillLevel: 24, volume: 0.24, lastReading: '09:12', sensorStatus: 'ok', status: 'collected', lat: 36.8665, lng: 10.1955, address: 'Rue de la République' },
  { id: 'PB-105', zone: 'Ariana Centre', type: '660L', fillLevel: 66, volume: 0.66, lastReading: '09:18', sensorStatus: 'ok', status: 'collected', lat: 36.8645, lng: 10.1935, address: 'Avenue Habib Bourguiba' },
  { id: 'PB-067', zone: 'Ettadhamen', type: '240L', fillLevel: 78, volume: 0.24, lastReading: '09:25', sensorStatus: 'ok', status: 'waiting', lat: 36.8735, lng: 10.1785, address: 'Rue 14, Ettadhamen' },
  { id: 'PB-089', zone: 'Ettadhamen', type: '240L', fillLevel: 85, volume: 0.24, lastReading: '09:30', sensorStatus: 'ok', status: 'full', lat: 36.8755, lng: 10.1805, address: 'Avenue Principal' },
  { id: 'PB-012', zone: 'Raoued', type: '660L', fillLevel: 92, volume: 0.66, lastReading: '08:45', sensorStatus: 'ok', status: 'full', lat: 36.9015, lng: 10.1825, address: 'Route de Bizerte' },
  { id: 'PB-156', zone: 'La Soukra', type: '1100L', fillLevel: 45, volume: 1.10, lastReading: '08:30', sensorStatus: 'ok', status: 'waiting', lat: 36.8525, lng: 10.2115, address: 'Rue des Jasmins' },
  { id: 'PB-178', zone: 'Mnihla', type: '660L', fillLevel: 67, volume: 0.66, lastReading: '08:15', sensorStatus: 'ok', status: 'waiting', lat: 36.8385, lng: 10.1465, address: 'Avenue de la Liberté' },
  { id: 'PB-203', zone: 'Kalâat el-Andalous', type: '240L', fillLevel: 34, volume: 0.24, lastReading: '07:50', sensorStatus: 'defective', status: 'anomaly', lat: 36.9385, lng: 10.2095, address: 'Route Touristique' },
  { id: 'PB-221', zone: 'Borj Louzir', type: '660L', fillLevel: 88, volume: 0.66, lastReading: '07:30', sensorStatus: 'ok', status: 'full', lat: 36.8785, lng: 10.2235, address: 'Cité Commerciale' },
  { id: 'PB-245', zone: 'Sidi Thabet', type: '1100L', fillLevel: 56, volume: 1.10, lastReading: '07:15', sensorStatus: 'ok', status: 'waiting', lat: 36.9165, lng: 10.0655, address: 'Zone Industrielle' }
];

export const mockTrucks: Truck[] = [
  {
    id: 'CAM-01',
    driver: 'Mohamed Ben Ali',
    capacity: 78,
    binsCollected: 28,
    binsTotal: 38,
    kmTraveled: 34.2,
    eta: '15:45',
    status: 'active',
    color: '#00E5A0',
    lat: 36.8735,
    lng: 10.1785,
    route: [
      { id: 's1', binId: 'PB-042', address: 'Ariana Centre', volume: 0.24, status: 'completed', time: '09:12', fillLevel: 24 },
      { id: 's2', binId: 'PB-105', address: 'Ariana Centre', volume: 0.66, status: 'completed', time: '09:18', fillLevel: 66 },
      { id: 's3', binId: 'PB-067', address: 'Ettadhamen', volume: 0.24, status: 'in-progress', fillLevel: 78 },
      { id: 's4', binId: 'PB-089', address: 'Ettadhamen', volume: 0.24, status: 'pending', fillLevel: 85 },
      { id: 's5', binId: 'PB-012', address: 'Raoued', volume: 0.66, status: 'pending', fillLevel: 92 }
    ]
  },
  {
    id: 'CAM-02',
    driver: 'Fatma Trabelsi',
    capacity: 65,
    binsCollected: 24,
    binsTotal: 31,
    kmTraveled: 28.7,
    eta: '16:15',
    status: 'active',
    color: '#4D9EFF',
    lat: 36.8525,
    lng: 10.2115,
    route: [
      { id: 's6', binId: 'PB-156', address: 'La Soukra', volume: 1.10, status: 'in-progress', fillLevel: 45 }
    ]
  },
  {
    id: 'CAM-03',
    driver: 'Ahmed Mansouri',
    capacity: 82,
    binsCollected: 32,
    binsTotal: 36,
    kmTraveled: 41.3,
    eta: '15:20',
    status: 'active',
    color: '#9D4EDD',
    lat: 36.8385,
    lng: 10.1465,
    route: [
      { id: 's7', binId: 'PB-178', address: 'Mnihla', volume: 0.66, status: 'in-progress', fillLevel: 67 }
    ]
  },
  {
    id: 'CAM-04',
    driver: 'Salma Gharbi',
    capacity: 55,
    binsCollected: 19,
    binsTotal: 42,
    kmTraveled: 22.5,
    eta: '17:30',
    status: 'active',
    color: '#FFD60A',
    lat: 36.9385,
    lng: 10.2095,
    route: [
      { id: 's8', binId: 'PB-203', address: 'Kalâat el-Andalous', volume: 0.24, status: 'in-progress', fillLevel: 34 }
    ]
  },
  {
    id: 'CAM-05',
    driver: 'Karim Jlassi',
    capacity: 45,
    binsCollected: 21,
    binsTotal: 33,
    kmTraveled: 25.8,
    eta: '16:45',
    status: 'active',
    color: '#06FFA5',
    lat: 36.9165,
    lng: 10.0655,
    route: [
      { id: 's9', binId: 'PB-245', address: 'Sidi Thabet', volume: 1.10, status: 'in-progress', fillLevel: 56 }
    ]
  }
];

export const mockAnalytics = {
  kmOptimized: [
    { day: '1', optimized: 245, standard: 310 },
    { day: '2', optimized: 252, standard: 318 },
    { day: '3', optimized: 238, standard: 305 },
    { day: '4', optimized: 261, standard: 325 },
    { day: '5', optimized: 249, standard: 312 },
    { day: '6', optimized: 255, standard: 320 },
    { day: '7', optimized: 242, standard: 308 }
  ],
  binsByZone: [
    { zone: 'Ariana Centre', count: 32 },
    { zone: 'Ettadhamen', count: 28 },
    { zone: 'Raoued', count: 24 },
    { zone: 'La Soukra', count: 26 },
    { zone: 'Mnihla', count: 22 },
    { zone: 'Kalâat el-Andalous', count: 18 },
    { zone: 'Borj Louzir', count: 16 },
    { zone: 'Sidi Thabet', count: 14 }
  ],
  binsByType: [
    { type: '240L', value: 95, fill: '#00E5A0' },
    { type: '660L', value: 62, fill: '#4D9EFF' },
    { type: '1100L', value: 23, fill: '#9D4EDD' }
  ],
  kpiRecap: {
    kmSaved: 1240,
    fuelSaved: 272,
    costSaved: 847,
    co2Avoided: 0.68
  }
};
