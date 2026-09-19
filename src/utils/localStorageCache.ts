/**
 * Système de gestion de cache local (localStorage) pour OrientaAfrik & Certification
 * Permet de sauvegarder la progression dans les tests psychométriques, les calculs de moyenne,
 * et le profil étudiant sans besoin de compte ou de reconnexion.
 */

const KEYS = {
  COMPLETED_TESTS: "orienta_afrik_completed_tests_cache",
  ONGOING_TEST: "orienta_afrik_ongoing_test_cache",
  CALCULATOR_GRADES: "orienta_afrik_calculator_grades_cache",
  GRADES_SUMMARY: "orienta_afrik_grades_summary_cache",
  CALC_TARGET_PROGRAM: "orienta_afrik_calc_target_program_cache",
  STUDENT_PROFILE: "orienta_afrik_student_profile_cache",
  TEST_HISTORY: "orienta_afrik_test_history_cache",
} as const;

export interface TestHistoryItem {
  id: string;
  testId: string;
  testTitle: string;
  category: string;
  score: number;
  dateStr: string;
  timestamp: number;
}

export interface OngoingTestProgress {
  testId: string;
  testTitle: string;
  currentQuestionIndex: number;
  answers: Record<number, any>;
  updatedAt: string;
}

export interface CalculatorCacheData {
  grades: Record<string, number>;
  selectedProgramId: string;
  updatedAt: string;
}

export interface StudentProfileCache {
  fullName: string;
  email: string;
  phone: string;
  currentLevel: string;
  targetCountry: string;
}

// Helper safe reading/writing
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`[LocalStorage] Impossible de lire la clé "${key}":`, error);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[LocalStorage] Impossible d'écrire la clé "${key}":`, error);
    return false;
  }
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[LocalStorage] Impossible de supprimer la clé "${key}":`, error);
  }
}

// 1. Tests Complétés (Résultats)
export function getCompletedTestsCache(): Record<string, any> {
  return getItem<Record<string, any>>(KEYS.COMPLETED_TESTS, {});
}

export function saveCompletedTestsCache(tests: Record<string, any>): void {
  setItem(KEYS.COMPLETED_TESTS, tests);
}

// 2. Test en cours (Ongoing Test Progress)
export function getOngoingTestProgressCache(): OngoingTestProgress | null {
  return getItem<OngoingTestProgress | null>(KEYS.ONGOING_TEST, null);
}

export function saveOngoingTestProgressCache(progress: OngoingTestProgress): void {
  setItem(KEYS.ONGOING_TEST, progress);
}

export function clearOngoingTestProgressCache(): void {
  removeItem(KEYS.ONGOING_TEST);
}

// 3. Calculateur de Moyenne (Notes et Filière choisie)
export function getCalculatorGradesCache(): CalculatorCacheData | null {
  return getItem<CalculatorCacheData | null>(KEYS.CALCULATOR_GRADES, null);
}

export function saveCalculatorGradesCache(data: CalculatorCacheData): void {
  setItem(KEYS.CALCULATOR_GRADES, data);
}

export function clearCalculatorGradesCache(): void {
  removeItem(KEYS.CALCULATOR_GRADES);
}

// 4. Synthèse des Notes Calculées (Grades Summary)
export function getGradesSummaryCache(): any | null {
  return getItem<any | null>(KEYS.GRADES_SUMMARY, null);
}

export function saveGradesSummaryCache(summary: any): void {
  setItem(KEYS.GRADES_SUMMARY, summary);
}

// 5. Programme Cible Sélectionné depuis le Catalogue
export function getCalcTargetProgramCache(): { name: string; inst?: string } | null {
  return getItem<{ name: string; inst?: string } | null>(KEYS.CALC_TARGET_PROGRAM, null);
}

export function saveCalcTargetProgramCache(program: { name: string; inst?: string } | null): void {
  if (!program) {
    removeItem(KEYS.CALC_TARGET_PROGRAM);
  } else {
    setItem(KEYS.CALC_TARGET_PROGRAM, program);
  }
}

// 6. Profil Étudiant / Candidat
export function getStudentProfileCache(): StudentProfileCache | null {
  return getItem<StudentProfileCache | null>(KEYS.STUDENT_PROFILE, null);
}

export function saveStudentProfileCache(profile: StudentProfileCache): void {
  setItem(KEYS.STUDENT_PROFILE, profile);
}

// 7. Historique des résultats de tests psychométriques dans le temps
export function getTestHistoryCache(): TestHistoryItem[] {
  return getItem<TestHistoryItem[]>(KEYS.TEST_HISTORY, []);
}

export function saveTestHistoryCache(history: TestHistoryItem[]): void {
  setItem(KEYS.TEST_HISTORY, history);
}

export function addTestHistoryPoint(item: Omit<TestHistoryItem, "id">): void {
  const current = getTestHistoryCache();
  const newItem: TestHistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  };
  saveTestHistoryCache([...current, newItem]);
}

// 8. Effacer l'ensemble du cache utilisateur
export function clearAllOrientaCache(): void {
  Object.values(KEYS).forEach((k) => removeItem(k));
}
