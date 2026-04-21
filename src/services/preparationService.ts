/**
 * Preparation Service — standalone frontend shell.
 *
 * This module replaces the previous edge-function-backed assistant with a
 * pure client-side mock so Haven runs without any backend dependency.
 *
 * To re-introduce a live backend later, swap the body of `generatePreparation`
 * with a real `fetch(...)` call. The function signature and return types are
 * intentionally stable so consumers do not need to change.
 */

import type {
  PrepMode,
  PrepResult,
  PrepareResult,
  PracticeResult,
  UnderstandResult,
  PlanResult,
} from "@/components/prepare/types";

export interface PreparationRequest {
  mode: PrepMode;
  situation: string;
  details?: string;
  age?: string;
}

// Simulated network latency so the loading state behaves realistically.
const MOCK_DELAY_MS = 900;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const titleFor = (situation: string) =>
  situation.trim().replace(/^./, (c) => c.toUpperCase());

// ---- Mock builders (literal, neurodivergent-friendly tone) ----

const buildPrepare = (situation: string): PrepareResult => ({
  title: titleFor(situation),
  summary: `A step-by-step plan for ${situation}. You can read it as many times as you want.`,
  steps: [
    {
      step: 1,
      title: "Before you go",
      description: `You will get ready at home for ${situation}. You have time to prepare.`,
      sensory: "You may notice the usual sounds and lights in your home.",
      coping: "Take three slow breaths. Wear clothes that feel comfortable.",
      reassurance: "It is okay to take your time.",
    },
    {
      step: 2,
      title: "On the way",
      description: "You will travel to where this is happening.",
      sensory: "You may hear traffic, see other people, and feel movement.",
      coping: "You can use headphones or look at something familiar.",
      reassurance: "You can pause if you need to.",
    },
    {
      step: 3,
      title: "Arriving",
      description: "When you arrive, you may need to wait or check in.",
      sensory: "There may be new lights, sounds, and smells.",
      coping: "Find a quiet spot to stand. Hold a comfort item if you brought one.",
      reassurance: "Waiting is a normal part of this. You are doing well.",
    },
    {
      step: 4,
      title: "During the activity",
      description: `This is the main part of ${situation}. It will follow a clear pattern.`,
      sensory: "You may be asked questions or asked to do small tasks.",
      coping: "If you need a break, you can ask for one. Saying 'one moment' is okay.",
      reassurance: "You do not have to do everything at once.",
    },
    {
      step: 5,
      title: "Finishing",
      description: "When the activity is done, you can leave.",
      sensory: "You may feel tired. That is normal.",
      coping: "Go somewhere quiet. Drink water. Rest if you need to.",
      reassurance: "You finished. You can be proud of yourself.",
    },
  ],
});

const buildPractice = (situation: string): PracticeResult => ({
  title: titleFor(situation),
  context: `A short, predictable practice conversation for ${situation}.`,
  exchanges: [
    { turn: 1, speaker: "You", dialogue: "Hello.", note: "A simple greeting works well." },
    { turn: 2, speaker: "Other Person", dialogue: "Hi, how can I help you?", note: "They are asking what you need." },
    { turn: 3, speaker: "You", dialogue: "I would like to ask about something.", note: "It is okay to be direct." },
    { turn: 4, speaker: "Other Person", dialogue: "Of course, go ahead.", note: "They are giving you space to speak." },
    { turn: 5, speaker: "You", dialogue: "Could you say that again, please?", note: "Asking to repeat is always okay." },
    { turn: 6, speaker: "Other Person", dialogue: "Yes, no problem.", note: "Most people are happy to repeat." },
    { turn: 7, speaker: "You", dialogue: "Thank you. That helps.", note: "Ending politely is enough." },
  ],
  tips: [
    "You can pause before answering. A short silence is fine.",
    "If you do not understand, you can ask one more time.",
    "You can write down what you want to say before you start.",
  ],
});

const buildUnderstand = (situation: string): UnderstandResult => ({
  title: titleFor(situation),
  whatItIs: `${titleFor(situation)} is a planned event with clear steps.`,
  whyItHappens: "It happens so people can do something together in a safe, organized way.",
  whatToExpect: [
    { aspect: "Time", explanation: "It will start and end at known times." },
    { aspect: "People", explanation: "There will be other people. Some you may know, some you may not." },
    { aspect: "Sounds", explanation: "There may be talking, footsteps, or background noise." },
    { aspect: "Lights", explanation: "Lights may be bright or dim depending on the place." },
  ],
  socialRules: [
    "Greet people when you arrive if you feel comfortable. A nod is enough.",
    "Wait for your turn to speak.",
    "It is okay to say you need a moment.",
  ],
  commonQuestions: [
    {
      question: "What if I need a break?",
      answer: "You can step aside. Say 'I need a moment' if you can.",
    },
    {
      question: "What if I do not know what to do?",
      answer: "You can ask one person for help. They will tell you the next step.",
    },
  ],
});

const buildPlan = (situation: string): PlanResult => ({
  title: titleFor(situation),
  sensoryExpectations: [
    { sense: "Sight", expectation: "Bright overhead lights are likely.", intensity: "medium", strategy: "Wear a cap or tinted glasses if it helps." },
    { sense: "Sound", expectation: "Background talking and movement.", intensity: "medium", strategy: "Use earplugs or headphones." },
    { sense: "Touch", expectation: "You may need to sit on hard surfaces.", intensity: "low", strategy: "Bring a soft item to hold or sit on." },
    { sense: "Smell", expectation: "There may be cleaning or food smells.", intensity: "low", strategy: "Carry something with a familiar scent." },
  ],
  copingStrategies: [
    { strategy: "Slow breathing", when: "If you start to feel overwhelmed.", how: "Breathe in for 4 seconds, hold for 2, breathe out for 6. Repeat 3 times." },
    { strategy: "Grounding", when: "If sounds feel too much.", how: "Press your feet into the floor. Name 3 things you can see." },
    { strategy: "Quiet pause", when: "Between steps.", how: "Step aside for 1 minute. No talking required." },
  ],
  exitPlan: {
    signal: "Say 'I need a moment' or show a written card if speaking is hard.",
    safeSpace: "A quiet corner, hallway, or bathroom is fine.",
    recovery: "Sit down. Drink water. Wait until you feel ready to return or leave.",
  },
});

/**
 * Generate a preparation result. Returns mock data only — no network calls.
 *
 * Replace the body of this function with a real `fetch` if you want to
 * connect a backend later.
 */
export async function generatePreparation(
  req: PreparationRequest
): Promise<PrepResult> {
  await wait(MOCK_DELAY_MS);

  const situation = req.situation?.trim() || "this activity";

  switch (req.mode) {
    case "prepare":
      return buildPrepare(situation);
    case "practice":
      return buildPractice(situation);
    case "understand":
      return buildUnderstand(situation);
    case "plan":
      return buildPlan(situation);
  }
}
