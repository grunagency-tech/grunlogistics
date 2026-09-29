import { SamsaraTelemetryData } from '../types';

export const mockSamsaraTelemetry: Record<string, SamsaraTelemetryData> = {
  'VEH-184': {
    vehicleId: 'VEH-184',
    vehicleUnit: '184',
    lastUpdated: 'Hace 2 min (Samsara IoT Gateway)',
    engineDiagnosticsStatus: 'HEALTHY',
    dtcCodes: [],
    fuelTankLevelPercent: 74,
    batteryVoltageVolts: 24.4,
    engineOilPressurePsi: 42.5,
    coolantTempCelsius: 88,
    speedKmh: 78,
    engineRpm: 1420,
    nom087DrivingHoursToday: 5.4,
    nom087RemainingDrivingHours: 4.6,
    nom087RestBreakRequiredInMinutes: 30,
    nom087Status: 'COMPLIANT'
  },
  'VEH-201': {
    vehicleId: 'VEH-201',
    vehicleUnit: '201',
    lastUpdated: 'Hace 1 min (Samsara IoT Gateway)',
    engineDiagnosticsStatus: 'HEALTHY',
    dtcCodes: [],
    fuelTankLevelPercent: 92,
    batteryVoltageVolts: 24.6,
    engineOilPressurePsi: 44.0,
    coolantTempCelsius: 85,
    speedKmh: 0,
    engineRpm: 0,
    nom087DrivingHoursToday: 1.5,
    nom087RemainingDrivingHours: 8.5,
    nom087RestBreakRequiredInMinutes: 0,
    nom087Status: 'COMPLIANT'
  },
  'VEH-104': {
    vehicleId: 'VEH-104',
    vehicleUnit: '104',
    lastUpdated: 'Hace 4 min (Samsara Cloud API)',
    engineDiagnosticsStatus: 'WARNING',
    dtcCodes: ['P0101 (Mass Air Flow Circuit)'],
    fuelTankLevelPercent: 61,
    batteryVoltageVolts: 23.8,
    engineOilPressurePsi: 38.0,
    coolantTempCelsius: 92,
    speedKmh: 64,
    engineRpm: 1550,
    nom087DrivingHoursToday: 7.2,
    nom087RemainingDrivingHours: 2.8,
    nom087RestBreakRequiredInMinutes: 30,
    nom087Status: 'BREAK_DUE_SOON'
  }
};

export function getSamsaraTelemetry(vehicleUnitNumber: string): SamsaraTelemetryData {
  const matchKey = Object.keys(mockSamsaraTelemetry).find(
    (k) => mockSamsaraTelemetry[k].vehicleUnit === vehicleUnitNumber || k.includes(vehicleUnitNumber)
  );

  if (matchKey) {
    return mockSamsaraTelemetry[matchKey];
  }

  return {
    vehicleId: `VEH-${vehicleUnitNumber}`,
    vehicleUnit: vehicleUnitNumber,
    lastUpdated: 'Hace 3 min (Samsara API)',
    engineDiagnosticsStatus: 'HEALTHY',
    dtcCodes: [],
    fuelTankLevelPercent: 80,
    batteryVoltageVolts: 24.2,
    engineOilPressurePsi: 41.0,
    coolantTempCelsius: 86,
    speedKmh: 72,
    engineRpm: 1400,
    nom087DrivingHoursToday: 4.0,
    nom087RemainingDrivingHours: 6.0,
    nom087RestBreakRequiredInMinutes: 0,
    nom087Status: 'COMPLIANT'
  };
}
