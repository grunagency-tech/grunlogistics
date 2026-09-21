import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Play } from 'lucide-react';

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { runDemoScenario } = useApp();
  const [currentCard, setCurrentCard] = useState<number>(0);

  if (!isOpen) return null;

  const cards = [
    {
      step: '01 / 05',
      tag: 'WELCOME TO UNLOGISTICS',
      title: 'Turn logistics data into operational decisions.',
      description: 'UNLogistics is an Operational Decision Intelligence platform for logistics SMBs in Mexico. Instead of cluttering your screen with raw charts, it converts real-time fleet observations directly into clear, actionable decisions.',
      keyTakeaway: 'Focus on action and financial recovery rather than staring at passive metrics.'
    },
    {
      step: '02 / 05',
      tag: 'CONTROL TOWER',
      title: 'What needs your attention right now?',
      description: 'When you log in, your primary view highlights the top critical operational decisions (e.g. Trip #5831 at 87% late risk). Everything is prioritized by financial exposure ($ MXN at risk).',
      keyTakeaway: 'Address the 5 most urgent trips before delays turn into expensive customer penalties.'
    },
    {
      step: '03 / 05',
      tag: 'WHY ENGINE & MONEY LAYER',
      title: 'Understand the root cause & money at risk.',
      description: 'Clicking "Review" on any decision reveals why the delay is happening (traffic surge, loading bottleneck, route deviation) and quantifies the exact financial loss avoided.',
      keyTakeaway: 'Every decision translates delay minutes directly into Mexican Pesos ($ MXN).'
    },
    {
      step: '04 / 05',
      tag: 'JEV DECISION LAYER',
      title: 'Structured probabilistic recommendation.',
      description: 'JEV evaluates predefined operational alternatives (Reassign vehicle, Change route, Reschedule) using structured decision primitives (CHOICE, SCORE, NOUL) and returns a high-confidence recommendation.',
      keyTakeaway: 'Complex mathematical optimization is translated into 1 clear recommended choice.'
    },
    {
      step: '05 / 05',
      tag: 'HUMAN-IN-THE-LOOP',
      title: 'You maintain 100% operational authority.',
      description: 'The platform never auto-executes high-risk decisions without your green light. With one click on "Approve Recommendation", the digital twin updates fleet states in real time.',
      keyTakeaway: 'Simulate solutions BEFORE approving to verify net savings ($4,230 MXN).'
    }
  ];

  const card = cards[currentCard];

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard((prev) => prev + 1);
    } else {
      onClose();
      runDemoScenario();
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn select-none">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6 relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-slate-400 font-mono tracking-wider">
              {card.step}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-blue-600 font-sans tracking-wide">
              {card.tag}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flashcard Body */}
        <div className="space-y-3 py-2">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 font-sans">
            {card.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {card.description}
          </p>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs font-medium text-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Key Takeaway</span>
            <span>{card.keyTakeaway}</span>
          </div>
        </div>

        {/* Progress & Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {cards.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentCard ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-200'
                }`}
              ></span>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {currentCard > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-1"
            >
              <span>{currentCard === cards.length - 1 ? 'Start Interactive Demo' : 'Next'}</span>
              {currentCard === cards.length - 1 ? (
                <Play className="w-3 h-3 fill-white" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
