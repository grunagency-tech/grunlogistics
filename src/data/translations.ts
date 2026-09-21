export interface TranslationDict {
  goodMorning: string;
  decisionsNeedAttention: (count: number) => string;
  operationsStable: (count: number) => string;
  todaysDecisions: string;
  prioritizedByImpact: string;
  activeTrips: string;
  clickTripDetails: string;
  expectedImpact: string;
  recommended: string;
  review: string;
  allTrips: string;
  critical: string;
  attention: string;
  normal: string;
  howItWorks: string;
  demoMode: string;
  overview: string;
  decisions: string;
  fleet: string;
  trips: string;
  simulator: string;
  analytics: string;
  anomalies: string;
  data: string;
  history: string;
  settings: string;
  whyHappening: string;
  whatCanWeDo: string;
  recommendation: string;
  approve: string;
  reject: string;
  atRiskExposure: string;
  potentialSavings: string;
  riskReduction: string;
}

export const translations: Record<'ES' | 'EN', TranslationDict> = {
  ES: {
    goodMorning: 'Buenos días, Carlos.',
    decisionsNeedAttention: (count: number) => `${count} decisiones requieren tu atención.`,
    operationsStable: (count: number) => `Operación estable en ${count} viajes activos.`,
    todaysDecisions: "DECISIONES DE HOY",
    prioritizedByImpact: 'Priorizado por exposición financiera ($ MXN)',
    activeTrips: 'VIAJES ACTIVOS',
    clickTripDetails: 'Haz clic en un viaje para detalles operativos',
    expectedImpact: 'Impacto estimado',
    recommended: 'Recomendado',
    review: 'Revisar',
    allTrips: 'Todos los viajes',
    critical: 'Crítico',
    attention: 'Atención',
    normal: 'Normal',
    howItWorks: 'Cómo funciona',
    demoMode: 'Modo demo',
    overview: 'Resumen',
    decisions: 'Decisiones',
    fleet: 'Flota',
    trips: 'Viajes',
    simulator: 'Simulador',
    analytics: 'Analítica',
    anomalies: 'Anomalías',
    data: 'Datos',
    history: 'Historial',
    settings: 'Ajustes',
    whyHappening: '¿Por qué está pasando esto?',
    whatCanWeDo: '¿Qué podemos hacer?',
    recommendation: 'Recomendación',
    approve: 'Aprobar recomendación',
    reject: 'Rechazar',
    atRiskExposure: 'Dinero en riesgo',
    potentialSavings: 'Ahorro potencial',
    riskReduction: 'Reducción de riesgo'
  },
  EN: {
    goodMorning: 'Good morning, Carlos.',
    decisionsNeedAttention: (count: number) => `${count} decisions need your attention.`,
    operationsStable: (count: number) => `Operations are stable across ${count} active trips.`,
    todaysDecisions: "TODAY'S DECISIONS",
    prioritizedByImpact: 'Prioritized by financial exposure ($ MXN)',
    activeTrips: 'ACTIVE TRIPS',
    clickTripDetails: 'Click trip for operational details',
    expectedImpact: 'Expected impact',
    recommended: 'Recommended',
    review: 'Review',
    allTrips: 'All trips',
    critical: 'Critical',
    attention: 'Attention',
    normal: 'Normal',
    howItWorks: 'How it works',
    demoMode: 'Demo mode',
    overview: 'Overview',
    decisions: 'Decisions',
    fleet: 'Fleet',
    trips: 'Trips',
    simulator: 'Simulator',
    analytics: 'Analytics',
    anomalies: 'Anomalies',
    data: 'Data',
    history: 'History',
    settings: 'Settings',
    whyHappening: 'Why is this happening?',
    whatCanWeDo: 'What can we do?',
    recommendation: 'Recommendation',
    approve: 'Approve Recommendation',
    reject: 'Reject',
    atRiskExposure: 'At risk exposure',
    potentialSavings: 'Potential savings',
    riskReduction: 'Risk reduction'
  }
};
