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

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center space-y-4 font-sans max-w-md mx-auto my-16 bg-white rounded-2xl border border-slate-200 shadow-md text-slate-900">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            ⚠️
          </div>
          <h2 className="text-lg font-bold">Recuperación de Vista</h2>
          <p className="text-xs text-slate-500">
            Se ha restaurado la sesión para mantener la plataforma 100% operativa.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-[#0061FF] hover:bg-[#0052D4] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Reiniciar Vista
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
