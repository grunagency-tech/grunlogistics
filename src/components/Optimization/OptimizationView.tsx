import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';

export const OptimizationView: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none">
      <div className="border-b border-[#1E293B] pb-4">
        <h1 className="text-xl font-bold font-mono text-white tracking-wide uppercase flex items-center space-x-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span>MATHEMATICAL OPTIMIZATION ENGINE</span>
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Algoritmos heurísticos y VRP/VRPTW independientes que generan candidatos óptimos evaluados por JEV.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="bg-[#0F1523] border border-[#1E293B] p-5 rounded-lg space-y-3">
          <div className="text-cyan-400 font-bold uppercase text-xs">VRP / VRPTW SOLVER</div>
          <p className="text-slate-300 font-sans text-xs">
            Optimización de ruteo con ventanas de tiempo estrictas.
          </p>
          <div className="bg-[#070A11] p-3 rounded text-slate-400 text-[11px] space-y-1">
            <div>Algoritmo: Variable Neighborhood Search</div>
            <div>Candidatos evaluados: 1,420 / sec</div>
            <div>Estado: <strong className="text-emerald-400">ACTIVO</strong></div>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-[#1E293B] p-5 rounded-lg space-y-3">
          <div className="text-cyan-400 font-bold uppercase text-xs">ASSIGNMENT SOLVER</div>
          <p className="text-slate-300 font-sans text-xs">
            Asignación de unidades Standby por proximidad euclidiana en carretera.
          </p>
          <div className="bg-[#070A11] p-3 rounded text-slate-400 text-[11px] space-y-1">
            <div>Algoritmo: Hungarian / Munkres Method</div>
            <div>Tiempo de resolución: 12 ms</div>
            <div>Estado: <strong className="text-emerald-400">ACTIVO</strong></div>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-[#1E293B] p-5 rounded-lg space-y-3">
          <div className="text-cyan-400 font-bold uppercase text-xs">JEV SELECTION BRIDGE</div>
          <p className="text-slate-300 font-sans text-xs">
            JEV evalúa y clasifica los candidatos matemáticos óptimos.
          </p>
          <div className="bg-[#070A11] p-3 rounded text-slate-400 text-[11px] space-y-1">
            <div>Entrada JEV: Top 4 Alternativas</div>
            <div>Salida JEV: Choice primitivo + Probability</div>
            <div>Estado: <strong className="text-cyan-400">CONECTADO</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
