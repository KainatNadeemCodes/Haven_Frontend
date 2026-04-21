export type PrepMode = "prepare" | "practice" | "understand" | "plan";

export interface PrepareResult {
  title: string;
  summary: string;
  steps: {
    step: number;
    title: string;
    description: string;
    sensory: string;
    coping: string;
    reassurance: string;
  }[];
}

export interface PracticeResult {
  title: string;
  context: string;
  exchanges: {
    turn: number;
    speaker: string;
    dialogue: string;
    note: string;
  }[];
  tips: string[];
}

export interface UnderstandResult {
  title: string;
  whatItIs: string;
  whyItHappens: string;
  whatToExpect: {
    aspect: string;
    explanation: string;
  }[];
  socialRules: string[];
  commonQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface PlanResult {
  title: string;
  sensoryExpectations: {
    sense: string;
    expectation: string;
    intensity: "low" | "medium" | "high";
    strategy: string;
  }[];
  copingStrategies: {
    strategy: string;
    when: string;
    how: string;
  }[];
  exitPlan: {
    signal: string;
    safeSpace: string;
    recovery: string;
  };
}

export type PrepResult = PrepareResult | PracticeResult | UnderstandResult | PlanResult;
