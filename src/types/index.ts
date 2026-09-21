export type TripStatus =
  | 'PLANNED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'LOADING'
  | 'UNLOADING'
  | 'COMPLETED'
  | 'CANCELLED';

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'WAITING' | 'MAINTENANCE' | 'INACTIVE';

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'RESTING' | 'OFF_DUTY';

export type DriverPayModel = 'FIXED_TRIP' | 'PER_KM' | 'PERCENTAGE' | 'DAILY_RATE' | 'CUSTOM';

export interface Vehicle {
  id: string;
  unitNumber: string;
  type: string; // Tractor Camión, Trailer 53ft, Rabón 10t, etc.
  brand: string;
  model: string;
  year: number;
  plate: string;
  trailerNumber?: string;
  capacityKg: number;
  lengthMeters?: number;
  widthMeters?: number;
  heightMeters?: number;
  grossWeightKg?: number;
  fuelType: 'DIESEL' | 'GASOLINE';
  expectedFuelEfficiencyKmL: number;
  actualFuelEfficiencyKmL: number;
  currentOdometerKm: number;
  currentLocationName: string;
  coordinates: { lat: number; lng: number };
  gpsProvider: string; // e.g. 'Wialon', 'SAMSARA', 'Demo GPS'
  status: VehicleStatus;
  maintenanceStatus: 'OPTIMAL' | 'DUE_SOON' | 'URGENT';
  activeTripId?: string;
  driverId?: string;
  driverName?: string;
  // Vehicle Economics
  revenueGeneratedMXN: number;
  operatingCostMXN: number;
  netMarginMXN: number;
  costPerKmMXN: number;
  revenuePerKmMXN: number;
  totalKmDriven: number;
  emptyKmDriven: number;
  utilizationPercent: number;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  assignedVehicleUnit?: string;
  hoursDrivenToday: number;
  safetyScore: number;
  payModel: DriverPayModel;
  payRateAmount: number;
  phone: string;
  // Driver Financial Scorecard
  scorecardScore: number; // e.g. 94/100
  fuelEfficiencyKmL: number;
  fuelEfficiencyVsBaselinePercent: number; // e.g. +4.2%
  evidenceUploadRatePercent: number; // e.g. 98%
  onTimeDeliveryRatePercent: number; // e.g. 96%
  estimatedProductivityBonusMXN: number; // e.g. 1240
}

export interface Customer {
  id: string;
  name: string;
  taxId: string; // RFC
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  totalTrips: number;
  totalRevenueMXN: number;
  totalCostMXN: number;
  netMarginMXN: number;
  marginPercent: number;
  totalWaitingHours: number;
  potentialRecoveryMXN: number;
  allowedWaitingMinutes: number;
  detentionRatePerHourMXN: number;
  status: 'PROFITABLE' | 'LOW_MARGIN' | 'NEEDS_REVIEW';
}

export interface Route {
  id: string;
  name: string;
  originName: string;
  destinationName: string;
  distanceKm: number;
  avgDurationMinutes: number;
  plannedTollsMXN: number;
  totalTripsCount: number;
  avgRevenueMXN: number;
  avgCostMXN: number;
  avgMarginMXN: number;
  avgEmptyKmPercent: number;
  avgWaitingMinutes: number;
  status: 'PROFITABLE' | 'LOW_MARGIN';
}

export type EventCategory =
  | 'ARRIVAL'
  | 'DEPARTURE'
  | 'WAITING'
  | 'LOADING'
  | 'UNLOADING'
  | 'DELIVERY'
  | 'DELAY'
  | 'BREAKDOWN'
  | 'TRAFFIC'
  | 'ACCIDENT'
  | 'DOCUMENT_ISSUE'
  | 'CUSTOMER_UNAVAILABLE'
  | 'REPORT_ISSUE'
  | 'WHATSAPP_NOTIFICATION'
  | 'OTHER';

export interface OperationalEvent {
  id: string;
  tripId: string;
  timestamp: string;
  locationName: string;
  category: EventCategory;
  durationMinutes?: number;
  description: string;
  evidenceUrl?: string;
  createdBy: 'DRIVER' | 'SYSTEM' | 'DISPATCHER';
  reportedIssueType?: string;
}

export interface CostItem {
  id: string;
  tripId: string;
  category:
    | 'Fuel'
    | 'Tolls'
    | 'Driver pay'
    | 'Overtime'
    | 'Maintenance allocation'
    | 'Insurance allocation'
    | 'Permits'
    | 'Parking'
    | 'Meals'
    | 'Lodging'
    | 'External carrier cost'
    | 'Unexpected expenses'
    | 'Other expenses';
  amountMXN: number;
  isEstimated: boolean;
  date: string;
  source: 'MANUAL' | 'FUEL_CARD' | 'GPS' | 'SYSTEM_ESTIMATE';
  status: 'PENDING' | 'APPROVED' | 'PAID';
  notes?: string;
}

export interface FuelTransaction {
  id: string;
  tripId: string;
  vehicleId: string;
  vehicleUnit: string;
  liters: number;
  pricePerLiterMXN: number;
  totalMXN: number;
  locationName: string;
  date: string;
  odometerKm: number;
  actualKmL: number;
  expectedKmL: number;
  excessCostMXN: number;
}

export type RecoveryStatus =
  | 'Detected'
  | 'Needs review'
  | 'Approved'
  | 'Submitted'
  | 'Recovered'
  | 'Rejected'
  | 'Closed';

export type RecoveryReason =
  | 'Detention'
  | 'Additional mileage'
  | 'Extra stop'
  | 'Waiting'
  | 'Customer-caused delay'
  | 'Approved additional expenses'
  | 'Rate discrepancy'
  | 'Unbilled service';

export interface RecoveryCase {
  id: string;
  caseCode: string;
  tripId: string;
  tripNumber: string;
  customerId: string;
  customerName: string;
  reason: RecoveryReason;
  amountMXN: number;
  evidenceDescription: string;
  evidenceUrl?: string;
  status: RecoveryStatus;
  createdAt: string;
  owner: string;
  resolutionNotes?: string;
}

export interface TripEconomics {
  revenueMXN: number;
  // Estimated
  estimatedFuelMXN: number;
  estimatedTollsMXN: number;
  estimatedDriverPayMXN: number;
  estimatedOtherMXN: number;
  totalEstimatedCostMXN: number;
  expectedMarginMXN: number;
  expectedMarginPercent: number;
  expectedDistanceKm: number;
  expectedFuelLiters: number;
  expectedTollsMXN: number;
  
  // Actual
  actualFuelMXN: number;
  actualTollsMXN: number;
  actualDriverPayMXN: number;
  actualOtherMXN: number;
  totalActualCostMXN: number;
  actualMarginMXN: number;
  actualMarginPercent: number;

  // Variances & Metrics
  costVarianceMXN: number; // positive = over budget
  marginVarianceMXN: number;
  breakEvenRevenueMXN: number;
  marginBufferMXN: number;
}

export interface Trip {
  id: string;
  tripNumber: string;
  customerId: string;
  customerName: string;
  originName: string;
  destinationName: string;
  cargoDescription: string;
  cargoWeightKg: number;
  vehicleId: string;
  vehicleUnitNumber: string;
  trailerNumber?: string;
  driverId: string;
  driverName: string;
  
  scheduledDeparture: string;
  actualDeparture?: string;
  scheduledArrival: string;
  actualArrival?: string;
  deliveryAppointment: string;
  
  // SAT Carta Porte Compliance (Requirement 1)
  cartaPorteFolio?: string;
  cartaPorteMercanciaSatCode?: string;
  cartaPorteSeguroPoliza?: string;
  cartaPorteStatus: 'CUMPLE' | 'PENDIENTE' | 'ERROR';

  // Distance
  plannedDistanceKm: number;
  actualDistanceKm: number;
  loadedKm: number;
  emptyKm: number;
  emptyKmPercent: number;
  emptyKmCostMXN: number;

  // Economics
  economics: TripEconomics;
  
  status: TripStatus;
  
  // Route Deviation
  routeDeviationKm: number;
  routeDeviationCostMXN: number;
  routeDeviationStatus: 'NO_DEVIATION' | 'VALID_DEVIATION' | 'NEEDS_REVIEW';

  // Events & Waiting
  waitingMinutes: number;
  allowedWaitingMinutes: number;
  excessWaitingMinutes: number;
  potentialDetentionMXN: number;
  detentionBillableStatus: 'Potentially billable' | 'Billable' | 'Not billable' | 'Unknown';

  events: OperationalEvent[];
  fuelTransactions: FuelTransaction[];
  costs: CostItem[];

  // POD & Documents
  podUploaded: boolean;
  podUrl?: string;
  invoiceUploaded: boolean;
  hasRecoveryCase: boolean;
  recoveryCaseId?: string;

  // ETA & Delay
  currentLocationName: string;
  currentCoordinates: { lat: number; lng: number };
  eta: string;
  delayMinutes: number;
  financialExposureMXN: number;
}

export interface ExceptionItem {
  id: string;
  tripId?: string;
  tripNumber?: string;
  customerName?: string;
  vehicleUnit?: string;
  type:
    | 'TRIP_DELAYED'
    | 'EXCESSIVE_WAITING'
    | 'UNEXPECTED_FUEL'
    | 'FUEL_THEFT_ALERT'
    | 'UNEXPECTED_EXPENSE'
    | 'ROUTE_DEVIATION'
    | 'DELIVERY_RISK'
    | 'UNBILLED_DETENTION'
    | 'UNPROFITABLE_TRIP'
    | 'MISSING_POD'
    | 'MISSING_EXPENSE'
    | 'CARTA_PORTE_MISSING'
    | 'NO_GPS_SIGNAL';
  title: string;
  description: string;
  financialImpactMXN: number;
  createdAt: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  actionRecommended: string;
}

export type RoutingProviderType = 'GOOGLE_ROUTES' | 'DEMO_ROUTING';
