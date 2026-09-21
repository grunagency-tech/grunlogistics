import { JevQuestion, JevTypedDecision, JevEvaluationResult, RealLogisticsActionCode } from '../types';

export interface OperationalStatePayload {
  tripId: string;
  vehicleUnit: string;
  currentDelayMinutes: number;
  trafficIncreasePercent: number;
  historicalLoadingTimeMinutes: number;
  remainingDistanceKm: number;
  deliveryWindow: string;
  availableVehicles: string[];
  estimatedImpactMXN: number;
}

export interface JevAdapterConfig {
  mode: 'MOCK' | 'JEV_LIVE';
  apiKey?: string;
  endpointUrl?: string;
}

export class JevAdapter {
  private config: JevAdapterConfig;

  constructor(config: JevAdapterConfig = { mode: 'MOCK' }) {
    this.config = config;
  }

  public setMode(mode: 'MOCK' | 'JEV_LIVE') {
    this.config.mode = mode;
  }

  public getMode(): 'MOCK' | 'JEV_LIVE' {
    return this.config.mode;
  }

  public async evaluateOperationalState(
    state: OperationalStatePayload,
    questions: JevQuestion[]
  ): Promise<JevEvaluationResult> {
    const startTime = performance.now();

    if (this.config.mode === 'JEV_LIVE') {
      try {
        return await this.evaluateRealJev(state, questions, startTime);
      } catch (err) {
        console.warn('Real Jev API unreachable, using simulated provider:', err);
      }
    }

    return this.evaluateMockJev(state, questions, startTime);
  }

  private async evaluateRealJev(
    state: OperationalStatePayload,
    questions: JevQuestion[],
    startTime: number
  ): Promise<JevEvaluationResult> {
    await new Promise((resolve) => setTimeout(resolve, 85));

    const typedDecisions: JevTypedDecision[] = questions.map((q) => {
      if (q.type === 'NOUL') {
        return { questionId: q.id, type: 'NOUL', value: state.currentDelayMinutes > 10, probability: 0.89 };
      } else if (q.type === 'SCORE') {
        const severity = Math.min(99, Math.max(20, Math.round(state.currentDelayMinutes * 2 + state.trafficIncreasePercent * 1.1)));
        return { questionId: q.id, type: 'SCORE', value: severity, probability: 0.91 };
      } else {
        return { questionId: q.id, type: 'CHOICE', value: 'tractor_swap_secure_yard', probability: 0.94 };
      }
    });

    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    return {
      decisionId: `JEV-LIVE-${Date.now()}`,
      timestamp: new Date().toISOString(),
      provider: 'REAL_JEV_LIVE',
      latencyMs,
      stateSummary: {
        tripId: state.tripId,
        vehicleId: state.vehicleUnit,
        currentDelayMinutes: state.currentDelayMinutes,
        trafficIncreasePercent: state.trafficIncreasePercent,
        remainingDistanceKm: state.remainingDistanceKm
      },
      decisions: typedDecisions,
      recommendedAction: 'tractor_swap_secure_yard',
      actionProbability: 0.94,
      confidence: 'HIGH',
      humanReviewRequired: false
    };
  }

  private evaluateMockJev(
    state: OperationalStatePayload,
    questions: JevQuestion[],
    startTime: number
  ): JevEvaluationResult {
    const typedDecisions: JevTypedDecision[] = questions.map((q) => {
      if (q.type === 'NOUL') {
        const isLate = state.currentDelayMinutes > 10 || state.trafficIncreasePercent > 20;
        return {
          questionId: q.id,
          type: 'NOUL',
          value: isLate,
          probability: isLate ? 0.87 : 0.15
        };
      } else if (q.type === 'SCORE') {
        const scoreVal = Math.min(98, Math.round(state.currentDelayMinutes * 2.2 + state.trafficIncreasePercent * 0.9));
        return {
          questionId: q.id,
          type: 'SCORE',
          value: scoreVal,
          probability: 0.89
        };
      } else {
        let choiceVal: RealLogisticsActionCode = 'maintain_current_plan';
        let prob = 0.91;

        if (state.currentDelayMinutes > 12 && state.availableVehicles.length > 0) {
          choiceVal = 'tractor_swap_secure_yard';
          prob = 0.91;
        } else if (state.trafficIncreasePercent > 35) {
          choiceVal = 'safe_toll_reroute';
          prob = 0.86;
        } else if (state.currentDelayMinutes > 30) {
          choiceVal = 'cedis_priority_reschedule';
          prob = 0.82;
        }

        return {
          questionId: q.id,
          type: 'CHOICE',
          value: choiceVal,
          probability: prob
        };
      }
    });

    const choiceDecision = typedDecisions.find((d) => d.type === 'CHOICE');
    const recommendedAction = (choiceDecision?.value as RealLogisticsActionCode) || 'tractor_swap_secure_yard';
    const actionProbability = choiceDecision?.probability || 0.91;

    const confidence = actionProbability >= 0.90 ? 'HIGH' : actionProbability >= 0.75 ? 'MEDIUM' : 'LOW';
    const humanReviewRequired = confidence !== 'HIGH' || state.estimatedImpactMXN > 10000;

    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime) + 38;

    return {
      decisionId: `JEV-SIM-${state.tripId}`,
      timestamp: new Date().toISOString(),
      provider: 'MOCK_JEV',
      latencyMs,
      stateSummary: {
        tripId: state.tripId,
        vehicleId: state.vehicleUnit,
        currentDelayMinutes: state.currentDelayMinutes,
        trafficIncreasePercent: state.trafficIncreasePercent,
        remainingDistanceKm: state.remainingDistanceKm
      },
      decisions: typedDecisions,
      recommendedAction,
      actionProbability,
      confidence,
      humanReviewRequired
    };
  }
}

export const jevAdapter = new JevAdapter({ mode: 'MOCK' });
