export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
};

/** Short friendly quizzes for healthy family competition. */
export const QUIZZES: { id: string; title: string; questions: QuizQuestion[] }[] = [
  {
    id: "basics",
    title: "Quran basics",
    questions: [
      {
        id: "q1",
        prompt: "How many Surahs are in the Quran?",
        choices: ["99", "114", "120", "30"],
        answer: 1,
      },
      {
        id: "q2",
        prompt: "What is the first Surah of the Quran?",
        choices: ["Al-Baqarah", "An-Nas", "Al-Fatihah", "Al-Ikhlas"],
        answer: 2,
      },
      {
        id: "q3",
        prompt: "How many Juz (parts) is the Quran divided into?",
        choices: ["10", "20", "30", "40"],
        answer: 2,
      },
      {
        id: "q4",
        prompt: "Which angel brought revelation to Prophet Muhammad ﷺ?",
        choices: ["Mikail", "Israfil", "Jibril", "Malik"],
        answer: 2,
      },
      {
        id: "q5",
        prompt: "What does “Hifz” mean?",
        choices: ["Translation", "Memorization", "Recitation only", "Tafseer"],
        answer: 1,
      },
    ],
  },
  {
    id: "manners",
    title: "Learning manners",
    questions: [
      {
        id: "m1",
        prompt: "Before reciting Quran, we often say:",
        choices: ["Alhamdulillah", "Bismillah", "InshaAllah", "MashaAllah"],
        answer: 1,
      },
      {
        id: "m2",
        prompt: "A healthy competition should be about:",
        choices: ["Pride", "Showing off", "Motivation & learning together", "Winning only"],
        answer: 2,
      },
      {
        id: "m3",
        prompt: "Parents and children learning together is:",
        choices: ["Not recommended", "A beautiful Sunnah of care", "Only for adults", "Only online"],
        answer: 1,
      },
      {
        id: "m4",
        prompt: "When we make a mistake in recitation we should:",
        choices: ["Give up", "Keep practicing kindly", "Blame others", "Stop forever"],
        answer: 1,
      },
    ],
  },
];
