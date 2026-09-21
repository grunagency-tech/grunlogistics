import React, { createContext, useContext, useState } from 'react';
import {
  Trip,
  Vehicle,
  Driver,
  Customer,
  Route,
  RecoveryCase,
  ExceptionItem,
  OperationalEvent,
  RoutingProviderType,
  RecoveryStatus,
  TripStatus,
  CostItem,
  FuelTransaction
} from '../types';
import {
  companyProfile,
  initialTrips,
  initialVehicles,
  initialDrivers,
  initialCustomers,
  initialRoutes,
  initialRecoveryCases,
  initialExceptions
} from '../data/mockData';

export type ViewType =
  | 'OVERVIEW'
  | 'TRIPS'
  | 'TRIP_DETAIL'
  | 'FLEET'
  | 'PROFITABILITY'
  | 'MONEY_RECOVERY'
  | 'EXCEPTIONS'
  | 'CUSTOMERS'
  | 'ROUTES'
  | 'DATA'
  | 'SETTINGS'
  | 'DRIVER_MOBILE';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedTripId: string;
  setSelectedTripId: (id: string) => void;
  openTripDetail: (id: string) => void;

  // Mobile Menu Drawer
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (f: string) => void;

  // Core Data
  company: typeof companyProfile;
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  customers: Customer[];
  routes: Route[];
  recoveryCases: RecoveryCase[];
  exceptions: ExceptionItem[];

  // Routing Configuration
  routingProviderType: RoutingProviderType;
  setRoutingProviderType: (type: RoutingProviderType) => void;
  googleApiKey: string;
  setGoogleApiKey: (key: string) => void;

  // Actions
  addTrip: (newTrip: Trip) => void;
  addRecoveryCase: (newCase: Partial<RecoveryCase>) => void;
  updateRecoveryStatus: (caseId: string, status: RecoveryStatus) => void;
  addOperationalEvent: (tripId: string, event: Partial<OperationalEvent>) => void;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  uploadExpenseTicket: (
    tripId: string,
    category: CostItem['category'],
    amountMXN: number,
    notes: string,
    evidenceUrl?: string
  ) => void;
  uploadPodDocument: (tripId: string, evidenceUrl: string) => void;
  run2MinDemo: () => void;
  activeSelectedTrip: Trip;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('OVERVIEW');
  const [selectedTripId, setSelectedTripId] = useState<string>('TRIP-5831');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [recoveryCases, setRecoveryCases] = useState<RecoveryCase[]>(initialRecoveryCases);
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(initialExceptions);

  const [routingProviderType, setRoutingProviderType] = useState<RoutingProviderType>('DEMO_ROUTING');
  const [googleApiKey, setGoogleApiKey] = useState('');

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const openTripDetail = (id: string) => {
    setSelectedTripId(id);
    setCurrentView('TRIP_DETAIL');
    setIsMobileMenuOpen(false);
  };

  const handleSetCurrentView = (view: ViewType) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const activeSelectedTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const addTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const addRecoveryCase = (caseData: Partial<RecoveryCase>) => {
    const id = `CASE-${Date.now().toString().slice(-4)}`;
    const fullCase: RecoveryCase = {
      id,
      caseCode: `REC-${caseData.tripNumber || '0000'}-02`,
      tripId: caseData.tripId || 'TRIP-5831',
      tripNumber: caseData.tripNumber || '5831',
      customerId: caseData.customerId || 'CUST-001',
      customerName: caseData.customerName || 'TechLogistics Corp',
      reason: caseData.reason || 'Detention',
      amountMXN: caseData.amountMXN || 1500,
      evidenceDescription: caseData.evidenceDescription || 'Evidencia cargada desde plataforma',
      status: 'Needs review',
      createdAt: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
      owner: 'Usuario Operaciones'
    };
    setRecoveryCases((prev) => [fullCase, ...prev]);
    if (caseData.tripId) {
      setTrips((prev) =>
        prev.map((t) =>
          t.id === caseData.tripId ? { ...t, hasRecoveryCase: true, recoveryCaseId: id } : t
        )
      );
    }
  };

  const updateRecoveryStatus = (caseId: string, status: RecoveryStatus) => {
    setRecoveryCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status } : c))
    );
  };

  const addOperationalEvent = (tripId: string, eventData: Partial<OperationalEvent>) => {
    const newEvt: OperationalEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      tripId,
      timestamp: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
      locationName: eventData.locationName || 'Ubicación Actual',
      category: eventData.category || 'OTHER',
      description: eventData.description || 'Evento registrado por operador',
      createdBy: eventData.createdBy || 'DRIVER',
      evidenceUrl: eventData.evidenceUrl,
      reportedIssueType: eventData.reportedIssueType
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const updatedEvents = [...(t.events || []), newEvt];
          return { ...t, events: updatedEvents };
        }
        return t;
      })
    );
  };

  const updateTripStatus = (tripId: string, status: TripStatus) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status } : t))
    );
  };

  const uploadExpenseTicket = (
    tripId: string,
    category: CostItem['category'],
    amountMXN: number,
    notes: string,
    evidenceUrl?: string
  ) => {
    const costId = `CST-${Date.now().toString().slice(-4)}`;
    const newCost: CostItem = {
      id: costId,
      tripId,
      category,
      amountMXN,
      isEstimated: false,
      date: new Date().toISOString().split('T')[0],
      source: 'MANUAL',
      status: 'APPROVED',
      notes
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const updatedCosts = [...t.costs, newCost];
          const actualFuel = category === 'Fuel' ? t.economics.actualFuelMXN + amountMXN : t.economics.actualFuelMXN;
          const actualTolls = category === 'Tolls' ? t.economics.actualTollsMXN + amountMXN : t.economics.actualTollsMXN;
          const actualOther = category !== 'Fuel' && category !== 'Tolls' && category !== 'Driver pay'
            ? t.economics.actualOtherMXN + amountMXN
            : t.economics.actualOtherMXN;

          const totalActualCost = actualFuel + actualTolls + t.economics.actualDriverPayMXN + actualOther;
          const actualMargin = t.economics.revenueMXN - totalActualCost;
          const actualMarginPct = Math.round((actualMargin / t.economics.revenueMXN) * 1000) / 10;
          const costVar = totalActualCost - t.economics.totalEstimatedCostMXN;

          return {
            ...t,
            costs: updatedCosts,
            economics: {
              ...t.economics,
              actualFuelMXN: actualFuel,
              actualTollsMXN: actualTolls,
              actualOtherMXN: actualOther,
              totalActualCostMXN: totalActualCost,
              actualMarginMXN: actualMargin,
              actualMarginPercent: actualMarginPct,
              costVarianceMXN: costVar,
              marginVarianceMXN: actualMargin - t.economics.expectedMarginMXN,
              breakEvenRevenueMXN: totalActualCost,
              marginBufferMXN: actualMargin
            }
          };
        }
        return t;
      })
    );

    // Add operational event log
    addOperationalEvent(tripId, {
      category: 'OTHER',
      description: `[TICKET SUBIDO POR OPERADOR - ${category.toUpperCase()}]: $${amountMXN} MXN (${notes})`,
      evidenceUrl: evidenceUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      createdBy: 'DRIVER'
    });
  };

  const uploadPodDocument = (tripId: string, evidenceUrl: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            podUploaded: true,
            podUrl: evidenceUrl || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80'
          };
        }
        return t;
      })
    );

    // Resolve any MISSING_POD exception for this trip
    setExceptions((prev) =>
      prev.map((e) =>
        e.tripId === tripId && e.type === 'MISSING_POD' ? { ...e, status: 'RESOLVED' } : e
      )
    );

    addOperationalEvent(tripId, {
      category: 'DOCUMENT_ISSUE',
      description: `[POD CARGADO POR OPERADOR]: Documento de entrega subido exitosamente.`,
      evidenceUrl: evidenceUrl || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80',
      createdBy: 'DRIVER'
    });
  };

  const run2MinDemo = () => {
    setCurrentView('OVERVIEW');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      openTripDetail('TRIP-5831');
    }, 1200);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: handleSetCurrentView,
        selectedTripId,
        setSelectedTripId,
        openTripDetail,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        company: companyProfile,
        trips,
        vehicles,
        drivers,
        customers,
        routes,
        recoveryCases,
        exceptions,
        routingProviderType,
        setRoutingProviderType,
        googleApiKey,
        setGoogleApiKey,
        addTrip,
        addRecoveryCase,
        updateRecoveryStatus,
        addOperationalEvent,
        updateTripStatus,
        uploadExpenseTicket,
        uploadPodDocument,
        run2MinDemo,
        activeSelectedTrip
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
