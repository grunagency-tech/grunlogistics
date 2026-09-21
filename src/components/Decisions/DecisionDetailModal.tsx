import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Check, X, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const DecisionDetailModal: React.FC = () => {
  const {
    activeSelectedDecision,
    setCurrentView,
    approveDecision,
    rejectDecision,
    trips
  } = useApp();

  const [selectedAltId, setSelectedAltId] = useState<string>('ALT-B');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!activeSelectedDecision) {
    return (
      <div className="p-8 text-center text-slate-400 font-sans">
        No decision selected.
        <button onClick={() => setCurrentView('CONTROL_TOWER')} className="mt-4 block mx-auto text-blue-600 font-medium">
          Back to Overview
        </button>
      </div>
    );
  }

  const dec = activeSelectedDecision;
  const isApproved = dec.status === 'APPROVED';

  const handleApprove = () => {
    approveDecision(dec.id, selectedAltId);
    setSuccessMsg('Decision approved. Operations updated: Trip reassigned to Vehicle 201.');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const handleReject = () => {
    rejectDecision(dec.id);
    setSuccessMsg('Decision rejected. Risk status preserved.');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      {/* Top Back Nav */}
      <button
        onClick={() => setCurrentView('CONTROL_TOWER')}
        className="flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Overview</span>
      </button>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center space-x-3 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header (Exact Prompt Directive) */}
      <div className="border-b border-slate-200/80 pb-6 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Trip #{dec.tripNumber}
            </h1>
            <p className="text-sm font-medium text-rose-600 mt-1">
              Late delivery risk · {dec.riskPercent}% severity
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">At risk exposure</span>
            <span className="text-xl font-bold text-slate-900">
              ${dec.potentialFinancialImpactMXN.toLocaleString('es-MX')} MXN
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          {dec.situation}
        </p>
      </div>

      {/* SECTION 1: WHY IS THIS HAPPENING? (Only 3 top factors) */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Why is this happening?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200/80 p-4 rounded-xl space-y-1 shadow-sm">
            <span className="text-xs text-slate-400 block">Traffic congestion</span>
            <span className="text-sm font-semibold text-slate-900">32% above normal</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-xl space-y-1 shadow-sm">
            <span className="text-xs text-slate-400 block">CEDIS loading time</span>
            <span className="text-sm font-semibold text-slate-900">21 min above normal</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-xl space-y-1 shadow-sm">
            <span className="text-xs text-slate-400 block">Current delay</span>
            <span className="text-sm font-semibold text-slate-900">14 min accumulated</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: WHAT CAN WE DO? (Clean alternatives list) */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          What can we do?
        </h2>

        <div className="space-y-3">
          {/* Option 1: Reassign Vehicle 201 */}
          <div
            onClick={() => setSelectedAltId('ALT-B')}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              selectedAltId === 'ALT-B'
                ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-slate-900">1. Reassign vehicle 201</span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded">
                  Best option
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Intercept at Tepoztlán Junction with idle standby vehicle.
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs sm:justify-end">
              <div>
                <span className="text-slate-400 block text-[11px]">Risk reduction</span>
                <span className="font-semibold text-emerald-600">87% → 19%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated savings</span>
                <span className="font-semibold text-slate-900">$4,230 MXN</span>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                selectedAltId === 'ALT-B' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {selectedAltId === 'ALT-B' ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>

          {/* Option 2: Reassign Vehicle 203 */}
          <div
            onClick={() => setSelectedAltId('ALT-C')}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              selectedAltId === 'ALT-C'
                ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1">
              <span className="font-semibold text-sm text-slate-900">2. Reassign vehicle 203</span>
              <p className="text-xs text-slate-500">
                Reroute standby vehicle from bypass road (18km away).
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs sm:justify-end">
              <div>
                <span className="text-slate-400 block text-[11px]">Risk reduction</span>
                <span className="font-semibold text-emerald-600">87% → 31%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated savings</span>
                <span className="font-semibold text-slate-900">$3,670 MXN</span>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                selectedAltId === 'ALT-C' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {selectedAltId === 'ALT-C' ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>

          {/* Option 3: Keep current plan */}
          <div
            onClick={() => setSelectedAltId('ALT-A')}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              selectedAltId === 'ALT-A'
                ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1">
              <span className="font-semibold text-sm text-slate-900">3. Keep current plan</span>
              <p className="text-xs text-slate-500">
                Maintain current route with vehicle 184. High penalty exposure.
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs sm:justify-end">
              <div>
                <span className="text-slate-400 block text-[11px]">Risk status</span>
                <span className="font-semibold text-rose-600">Remains 87%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated savings</span>
                <span className="font-semibold text-slate-900">$0 MXN</span>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                selectedAltId === 'ALT-A' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {selectedAltId === 'ALT-A' ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: RECOMMENDATION (Subtle Apple-like Callout) */}
      <div className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Recommendation
            </span>
            <div className="font-semibold text-slate-900 text-sm">
              Reassign vehicle 201
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            91% confidence
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Why: Best expected operational outcome with maximum financial recovery.
        </p>

        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
        >
          {showTechnicalDetails ? 'Hide reasoning' : 'View reasoning'}
        </button>

        {showTechnicalDetails && (
          <div className="pt-2 text-xs font-mono text-slate-600 border-t border-slate-200/60 space-y-1 animate-fadeIn">
            <div>Provider: {dec.jevResult.provider}</div>
            <div>Latency: {dec.jevResult.latencyMs} ms</div>
            <div>Decisions evaluated: CHOICE (reassign_vehicle 0.91), SCORE (82), NOUL (0.87)</div>
          </div>
        )}
      </div>

      {/* PRIMARY ACTIONS */}
      <div className="flex items-center space-x-3 pt-2">
        {isApproved ? (
          <div className="w-full bg-emerald-100 border border-emerald-300 text-emerald-800 py-3 rounded-xl text-center font-medium text-xs">
            Decision Approved &amp; Executed
          </div>
        ) : (
          <>
            <button
              onClick={handleApprove}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-3 rounded-xl transition-all shadow-sm"
            >
              Approve Recommendation
            </button>
            <button
              onClick={handleReject}
              className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-3 rounded-xl transition-all"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};
