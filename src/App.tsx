import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { TripsView } from './components/TripsView';
import { TripDetailView } from './components/TripDetailView';
import { FleetView } from './components/FleetView';
import { ProfitabilityView } from './components/ProfitabilityView';
import { MoneyRecoveryView } from './components/MoneyRecoveryView';
import { ExceptionsView } from './components/ExceptionsView';
import { CustomersView } from './components/CustomersView';
import { RoutesView } from './components/RoutesView';
import { DataView } from './components/DataView';
import { SettingsView } from './components/SettingsView';
import { DocumentsVaultView } from './components/DocumentsVaultView';
import { DriverMobileView } from './components/DriverMobileView';

export const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // Special full screen layout for Driver Mobile mode
  if (currentView === 'DRIVER_MOBILE') {
    return <DriverMobileView />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'OVERVIEW':
        return <OverviewView />;
      case 'TRIPS':
        return <TripsView />;
      case 'TRIP_DETAIL':
        return <TripDetailView />;
      case 'FLEET':
        return <FleetView />;
      case 'PROFITABILITY':
        return <ProfitabilityView />;
      case 'MONEY_RECOVERY':
        return <MoneyRecoveryView />;
      case 'EXCEPTIONS':
        return <ExceptionsView />;
      case 'CUSTOMERS':
        return <CustomersView />;
      case 'ROUTES':
        return <RoutesView />;
      case 'DATA':
        return <DataView />;
      case 'DOCUMENTS':
        return <DocumentsVaultView />;
      case 'SETTINGS':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] min-h-[calc(100vh-3.5rem)] pb-12">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
