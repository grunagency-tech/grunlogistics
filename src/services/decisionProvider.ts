import { JevQuestion, JevEvaluationResult } from '../types';
import { jevAdapter, OperationalStatePayload } from './jevAdapter';

export interface IDecisionProvider {
  name: string;
  isLive: boolean;
  evaluateDecision(state: OperationalStatePayload, questions: JevQuestion[]): Promise<JevEvaluationResult>;
}

export class MockDecisionProvider implements IDecisionProvider {
  public name = 'MockDecisionProvider';
  public isLive = false;

  public async evaluateDecision(
    state: OperationalStatePayload,
    questions: JevQuestion[]
  ): Promise<JevEvaluationResult> {
    jevAdapter.setMode('MOCK');
    return jevAdapter.evaluateOperationalState(state, questions);
  }
}

export class JevDecisionProvider implements IDecisionProvider {
  public name = 'JevDecisionProvider';
  public isLive = true;

  public async evaluateDecision(
    state: OperationalStatePayload,
    questions: JevQuestion[]
  ): Promise<JevEvaluationResult> {
    jevAdapter.setMode('JEV_LIVE');
    return jevAdapter.evaluateOperationalState(state, questions);
  }
}

export const mockDecisionProvider = new MockDecisionProvider();
export const jevDecisionProvider = new JevDecisionProvider();

// Active provider factory
export function getActiveDecisionProvider(isLive: boolean): IDecisionProvider {
  return isLive ? jevDecisionProvider : mockDecisionProvider;
}
