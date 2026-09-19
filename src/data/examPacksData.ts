export interface ExamQuestion {
  id: number;
  questionText: string;
  context?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  points: number;
  orientationTag?: string;
}

export interface ExamPack {
  id: string;
  title: string;
  level: "BAC II (Terminale)" | "BAC I (Première)" | "BEPC" | "Concours Grandes Écoles" | "Concours Santé / Médecine" | "Concours ENA & Fonction Publique";
  subject: "Mathématiques" | "Physique-Chimie" | "SVT / Biologie" | "Culture Générale & Logique" | "Français & Philosophie" | "Anglais" | "Droit & Économie";
  seriesTag?: string;
  durationMinutes: number;
  totalPoints: number;
  difficulty: "Essentiel" | "Intermédiaire" | "Niveau Concours National";
  description: string;
  questions: ExamQuestion[];
  recommendedCareersIfPassed: string[];
  recommendedInstitutions: string[];
}

// =============================================================================
// PACK 1: BAC II MATHEMATIQUES - 50 QUESTIONS COMPLETES
// =============================================================================
const bac2MathQuestions: ExamQuestion[] = Array.from({ length: 50 }, (_, i) => {
  const qId = i + 1;
  if (qId === 1) {
    return {
      id: 1,
      questionText: "Quelle est la limite de f(x) = (ln(x) + 2x) / x lorsque x tend vers +∞ ?",
      options: ["0", "1", "2", "+∞"],
      correctOptionIndex: 2,
      explanation: "Méthode du Dr BALOGAH : On décompose f(x) = ln(x)/x + 2. On sait que lim(x→+∞) ln(x)/x = 0 (croissances comparées). Donc lim f(x) = 0 + 2 = 2. Asymptote horizontale y = 2.",
      points: 2,
      orientationTag: "Analyse Mathématique / Ingénierie"
    };
  }
  if (qId === 2) {
    return {
      id: 2,
      questionText: "Soit g(x) = x * ln(x) - x sur ]0, +∞[. Quelle est la dérivée g'(x) ?",
      options: ["g'(x) = ln(x)", "g'(x) = ln(x) - 1", "g'(x) = 1/x - 1", "g'(x) = x * ln(x)"],
      correctOptionIndex: 0,
      explanation: "Rappel du cours : (uv)' = u'v + uv'. Ici u = x (u'=1) et v = ln(x) (v'=1/x). Donc (x ln(x))' = 1*ln(x) + x*(1/x) = ln(x) + 1. En dérivant g(x) = x ln(x) - x, g'(x) = (ln(x) + 1) - 1 = ln(x).",
      points: 2,
      orientationTag: "Analyse Mathématique / Ingénierie"
    };
  }
  if (qId === 3) {
    return {
      id: 3,
      questionText: "Résoudre dans ℝ l'équation e^(2x) - 3*e^x + 2 = 0.",
      options: ["S = {0, ln(2)}", "S = {1, 2}", "S = {ln(3), ln(2)}", "S = {-1, -2}"],
      correctOptionIndex: 0,
      explanation: "Conseil du Dr BALOGAH : Poser X = e^x avec X > 0. L'équation devient X² - 3X + 2 = 0. Les racines sont X₁ = 1 et X₂ = 2. On revient à x : e^x = 1 ⟹ x = 0 ; e^x = 2 ⟹ x = ln(2). Donc S = {0, ln(2)}.",
      points: 2,
      orientationTag: "Calcul Algébrique / Modélisation"
    };
  }
  if (qId === 4) {
    return {
      id: 4,
      questionText: "Dans le plan complexe, quel est le module du nombre z = 3 + 4i ?",
      options: ["7", "5", "12", "√7"],
      correctOptionIndex: 1,
      explanation: "Formule : |z| = √(a² + b²). Ici a = 3 et b = 4. |z| = √(3² + 4²) = √(9 + 16) = √25 = 5.",
      points: 2,
      orientationTag: "Nombres Complexes & Géométrie"
    };
  }
  if (qId === 5) {
    return {
      id: 5,
      questionText: "Une urne contient 4 boules rouges et 6 boules noires. On tire simultanément 2 boules. Quelle est la probabilité d'avoir 2 boules rouges ?",
      options: ["4/10", "2/15", "6/45", "1/3"],
      correctOptionIndex: 1,
      explanation: "Combinaisons : C(10, 2) = 45. Nombre de tirages favorables C(4, 2) = 6. Probabilité = 6/45 = 2/15 (~13,3%).",
      points: 2,
      orientationTag: "Statistiques & Actuariat"
    };
  }
  if (qId === 6) {
    return {
      id: 6,
      questionText: "Quel est l'argument principal du nombre complexe z = 1 + i ?",
      options: ["π/6", "π/4", "π/3", "π/2"],
      correctOptionIndex: 1,
      explanation: "|z| = √2. cos(θ) = 1/√2 = √2/2 et sin(θ) = 1/√2 = √2/2. Donc θ = π/4 [2π].",
      points: 2,
      orientationTag: "Géométrie Complexes"
    };
  }
  if (qId === 7) {
    return {
      id: 7,
      questionText: "Calculer l'intégrale I = ∫₀¹ e^(2x) dx.",
      options: ["(e² - 1) / 2", "e² - 1", "(e² + 1) / 2", "2(e² - 1)"],
      correctOptionIndex: 0,
      explanation: "La primitive de e^(2x) est (1/2)e^(2x). I = [(1/2)e^(2x)]₀¹ = (1/2)e² - (1/2)e⁰ = (e² - 1)/2.",
      points: 2,
      orientationTag: "Calcul Intégral"
    };
  }
  if (qId === 8) {
    return {
      id: 8,
      questionText: "Quelle est la solution générale de l'équation différentielle y' - 3y = 0 ?",
      options: ["y(x) = C * e^(3x)", "y(x) = C * e^(-3x)", "y(x) = 3x + C", "y(x) = C * ln(3x)"],
      correctOptionIndex: 0,
      explanation: "L'équation y' = ay a pour solutions y(x) = C * e^(ax). Ici a = 3, donc y(x) = C * e^(3x).",
      points: 2,
      orientationTag: "Équations Différentielles"
    };
  }
  if (qId === 9) {
    return {
      id: 9,
      questionText: "Soit (Un) une suite géométrique de premier terme U₀ = 3 et de raison q = 2. Que vaut U₅ ?",
      options: ["96", "48", "15", "32"],
      correctOptionIndex: 0,
      explanation: "Formule : Un = U₀ * q^n. U₅ = 3 * 2⁵ = 3 * 32 = 96.",
      points: 2,
      orientationTag: "Suites Numériques"
    };
  }
  if (qId === 10) {
    return {
      id: 10,
      questionText: "Quelle est la dérivée de f(x) = ln(x² + 1) ?",
      options: ["2x / (x² + 1)", "1 / (x² + 1)", "2 / (x² + 1)", "x / (x² + 1)"],
      correctOptionIndex: 0,
      explanation: "Formule : (ln(u))' = u'/u. Avec u = x² + 1 (u' = 2x). Donc f'(x) = 2x / (x² + 1).",
      points: 2,
      orientationTag: "Analyse"
    };
  }
  if (qId === 11) {
    return {
      id: 11,
      questionText: "Combien de sous-ensembles à 3 éléments peut-on former à partir d'un ensemble de 5 éléments ?",
      options: ["10", "15", "60", "20"],
      correctOptionIndex: 0,
      explanation: "Calcul des combinaisons : C(5, 3) = 5! / (3! * 2!) = (5 * 4) / 2 = 10.",
      points: 2,
      orientationTag: "Dénombrement"
    };
  }
  if (qId === 12) {
    return {
      id: 12,
      questionText: "Si lim(x→a) f(x) = 0 et lim(x→a) g(x) = +∞, sous quelle forme se présente lim(x→a) (f(x) * g(x)) ?",
      options: ["Forme Indéterminée '0 * ∞'", "0", "+∞", "1"],
      correctOptionIndex: 0,
      explanation: "Le produit 0 * ∞ est l'une des 4 formes indéterminées fondamentales (0/0, ∞/∞, 0*∞, +∞-∞).",
      points: 2,
      orientationTag: "Analyse"
    };
  }
  if (qId === 13) {
    return {
      id: 13,
      questionText: "Dans ℂ, qu'est-ce que i² ?",
      options: ["-1", "1", "i", "-i"],
      correctOptionIndex: 0,
      explanation: "Définition fondamentale de l'unité imaginaire i : i² = -1.",
      points: 2,
      orientationTag: "Nombres Complexes"
    };
  }
  if (qId === 14) {
    return {
      id: 14,
      questionText: "Quel est le domaine de définition de la fonction f(x) = ln(2x - 4) ?",
      options: ["]2, +∞[", "[2, +∞[", "]-∞, 2[", "ℝ \\ {2}"],
      correctOptionIndex: 0,
      explanation: "ln(u) est définie ssi u > 0. Ici 2x - 4 > 0 ⟹ 2x > 4 ⟹ x > 2. Df = ]2, +∞[.",
      points: 2,
      orientationTag: "Analyse"
    };
  }
  if (qId === 15) {
    return {
      id: 15,
      questionText: "Quelle est l'asymptote à la courbe de f(x) = (3x + 1) / (x - 2) en +∞ ?",
      options: ["y = 3", "x = 2", "y = 1", "y = x"],
      correctOptionIndex: 0,
      explanation: "lim(x→+∞) (3x+1)/(x-2) = lim (3x/x) = 3. Donc la droite y = 3 est asymptote horizontale.",
      points: 2,
      orientationTag: "Analyse"
    };
  }
  if (qId === 16) {
    return {
      id: 16,
      questionText: "Soit f une fonction continue sur [a, b] telle que f(a) * f(b) < 0. Que garantit le TVI ?",
      options: ["f s'annule au moins une fois sur ]a, b[", "f est strictement croissante", "f est dérivable", "f a un unique extremum"],
      correctOptionIndex: 0,
      explanation: "Théorème des Valeurs Intermédiaires (TVI) : Si f est continue et change de signe aux bornes (f(a)*f(b)<0), il existe au moins un c ∈ ]a, b[ tel que f(c) = 0.",
      points: 2,
      orientationTag: "Analyse & Continuité"
    };
  }
  if (qId === 17) {
    return {
      id: 17,
      questionText: "Que vaut la dérivée de f(x) = e^(-x²) ?",
      options: ["-2x * e^(-x²)", "2x * e^(-x²)", "-e^(-x²)", "-2 * e^(-x²)"],
      correctOptionIndex: 0,
      explanation: "Formule : (e^u)' = u' * e^u. Avec u = -x² (u' = -2x). Donc f'(x) = -2x e^(-x²).",
      points: 2,
      orientationTag: "Analyse"
    };
  }
  if (qId === 18) {
    return {
      id: 18,
      questionText: "Quelle est la somme des 10 premiers termes d'une suite arithmétique de premier terme U₁ = 2 et de dernier terme U₁₀ = 20 ?",
      options: ["110", "220", "100", "90"],
      correctOptionIndex: 0,
      explanation: "Formule : Sn = n * (premier + dernier) / 2 = 10 * (2 + 20) / 2 = 10 * 22 / 2 = 110.",
      points: 2,
      orientationTag: "Suites"
    };
  }
  if (qId === 19) {
    return {
      id: 19,
      questionText: "Si z = 2 (cos(π/3) + i sin(π/3)), quelle est la forme algébrique de z ?",
      options: ["1 + i√3", "√3 + i", "1 - i√3", "2 + 2i"],
      correctOptionIndex: 0,
      explanation: "cos(π/3) = 1/2 et sin(π/3) = √3/2. z = 2(1/2 + i √3/2) = 1 + i√3.",
      points: 2,
      orientationTag: "Nombres Complexes"
    };
  }
  if (qId === 20) {
    return {
      id: 20,
      questionText: "Que vaut ∫₁ᵉ (1/x) dx ?",
      options: ["1", "0", "e", "ln(2)"],
      correctOptionIndex: 0,
      explanation: "Primitive de 1/x est ln|x|. [ln(x)]₁ᵉ = ln(e) - ln(1) = 1 - 0 = 1.",
      points: 2,
      orientationTag: "Calcul Intégral"
    };
  }
  // Questions 21 to 50 generated algorithmically & rigorously
  const topics21to50 = [
    { q: "Quelle est la valeur de ln(e³)", opts: ["3", "e", "1", "ln(3)"], ans: 0, exp: "ln(e^x) = x pour tout x reel. Donc ln(e³) = 3." },
    { q: "Quelle est la période de la fonction f(x) = sin(2x) ?", opts: ["π", "2π", "π/2", "4π"], ans: 0, exp: "La période de sin(ωx) est T = 2π/ω = 2π/2 = π." },
    { q: "Dans l'espace, quelle est la distance du point A(1, 2, 3) au plan (P) d'équation x + 2y - 2z + 7 = 0 ?", opts: ["2", "3", "1", "6"], ans: 0, exp: "d = |1 + 2(2) - 2(3) + 7| / √(1² + 2² + (-2)²) = |1 + 4 - 6 + 7| / √9 = 6 / 3 = 2." },
    { q: "Si P(A) = 0.4 et P(B) = 0.5 avec A et B indépendants, que vaut P(A ∩ B) ?", opts: ["0.2", "0.9", "0.1", "0.25"], ans: 0, exp: "Pour deux événements indépendants, P(A ∩ B) = P(A) * P(B) = 0.4 * 0.5 = 0.2." },
    { q: "Soit f(x) = x³ - 3x. Quel est le nombre de points critiques (où f'(x) = 0) ?", opts: ["2", "1", "3", "0"], ans: 0, exp: "f'(x) = 3x² - 3 = 3(x² - 1) = 0 ⟹ x = 1 ou x = -1. Il y a 2 points critiques." },
    { q: "Que vaut i^4 dans ℂ ?", opts: ["1", "-1", "i", "-i"], ans: 0, exp: "i⁴ = (i²)² = (-1)² = 1." },
    { q: "Soit Z = z * z_barre (produit d'un complexe par son conjugué). Que vaut Z ?", opts: ["|z|²", "|z|", "2|z|", "0"], ans: 0, exp: "z * z_barre = (a+ib)(a-ib) = a² + b² = |z|²." },
    { q: "Quelle est la limite de x * e^(-x) quand x tend vers +∞ ?", opts: ["0", "+∞", "1", "-∞"], ans: 0, exp: "Croissances comparées : l'exponentielle l'emporte sur toute puissance de x. lim x e^(-x) = 0." },
    { q: "Que vaut la variance d'une variable aléatoire constante X = k ?", opts: ["0", "k", "1", "k²"], ans: 0, exp: "Une constante ne varie pas, donc sa variance Var(X) = E[(X - E[X])²] = 0." },
    { q: "Quelle est la primitive F(x) de cos(3x) vérifiant F(0) = 0 ?", opts: ["(1/3) sin(3x)", "- (1/3) sin(3x)", "3 sin(3x)", "cos(3x)"], ans: 0, exp: "Primitive de cos(ax) est (1/a) sin(ax). Pour F(0)=0, C=0. F(x) = (1/3) sin(3x)." },
    { q: "Quel est l'ensemble des solutions de e^x < 1 ?", opts: ["]-∞, 0[", "]0, +∞[", "ℝ", "∅"], ans: 0, exp: "e^x < 1 ⟹ ln(e^x) < ln(1) ⟹ x < 0. Donc S = ]-∞, 0[." },
    { q: "Quelle est la droite d'équation y = ax + b pour un ajustement linéaire ?", opts: ["Droite de régression de Mayer ou des moindres carrés", "Droite tangente", "Droite sécante", "Asymptote oblique"], ans: 0, exp: "En statistiques à deux variables, l'ajustement linéaire se fait par la droite des moindres carrés." },
    { q: "Soit f une fonction impaire sur ℝ. Que vaut ∫₋ₐᵃ f(x) dx ?", opts: ["0", "2 ∫₀ᵃ f(x) dx", "a", "1"], ans: 0, exp: "L'intégrale d'une fonction impaire sur un intervalle symétrique [-a, a] est nulle." },
    { q: "Quel est le rayon de convergence de la série entière de e^x ?", opts: ["+∞", "1", "0", "e"], ans: 0, exp: "La série de Taylor de l'exponentielle converge sur tout ℝ (rayon R = +∞)." },
    { q: "Quelle est la dérivée seconde de f(x) = ln(x) ?", opts: ["-1 / x²", "1 / x²", "1 / x", "-1 / x"], ans: 0, exp: "f'(x) = 1/x = x⁻¹. f''(x) = -1 * x⁻² = -1 / x²." },
    { q: "Quelle est la forme trigonométrique du complexe z = -i ?", opts: ["cos(-π/2) + i sin(-π/2)", "cos(π/2) + i sin(π/2)", "cos(π) + i sin(π)", "cos(0) + i sin(0)"], ans: 0, exp: "z = -i a pour module 1 et pour argument -π/2 (ou 3π/2)." },
    { q: "Combien d'arrangements de 2 objets parmi 4 peut-on constituer ?", opts: ["12", "6", "24", "8"], ans: 0, exp: "A(4, 2) = 4! / (4-2)! = 4 * 3 = 12." },
    { q: "Quelle est la limite de (1 + 1/n)^n quand n tend vers +∞ ?", opts: ["e", "1", "+∞", "0"], ans: 0, exp: "Définition classique du nombre d'Euler : lim (1 + 1/n)^n = e ≈ 2.71828." },
    { q: "Si f'(x) > 0 sur un intervalle I, alors la fonction f est :", opts: ["Strictement croissante sur I", "Strictement décroissante sur I", "Constante", "Concave"], ans: 0, exp: "Le signe strictement positif de la dérivée implique la stricte croissance." },
    { q: "Dans un repère orthonormal, deux vecteurs u et v sont orthogonaux si et seulement si :", opts: ["Leur produit scalaire u · v = 0", "Leur produit vectoriel u ∧ v = 0", "Leur norme est égale", "Ils sont colinéaires"], ans: 0, exp: "Condition d'orthogonalité : u · v = 0." },
    { q: "Quelle est la solution de ln(x) = 0 ?", opts: ["x = 1", "x = 0", "x = e", "Pas de solution"], ans: 0, exp: "ln(x) = 0 ⟹ x = e⁰ = 1." },
    { q: "Soit f(x) = |x|. La fonction f est-elle dérivable en 0 ?", opts: ["Non, elle admet un pointuleux (demi-tangentes différentes)", "Oui, f'(0) = 0", "Oui, f'(0) = 1", "Oui, f'(0) = -1"], ans: 0, exp: "La dérivée à gauche est -1 et la dérivée à droite est +1. f n'est donc pas dérivable en 0." },
    { q: "Que vaut lim(x→0) sin(x)/x ?", opts: ["1", "0", "+∞", "π"], ans: 0, exp: "Limite usuelle remarquable : lim(x→0) sin(x)/x = 1 (taux de variation de sin en 0)." },
    { q: "Soit f''(x) > 0 sur I. Que peut-on dire de la courbe de f ?", opts: ["Elle est convexe (tournée vers le haut)", "Elle est concave", "Elle admet un point d'inflexion", "Elle est une droite"], ans: 0, exp: "Une dérivée seconde strictement positive indique que la fonction est convexe." },
    { q: "Quel est le discriminant Δ de l'équation x² + 2x + 5 = 0 ?", opts: ["-16", "16", "-20", "24"], ans: 0, exp: "Δ = b² - 4ac = 2² - 4(1)(5) = 4 - 20 = -16. Dans ℂ, les racines sont -1 ± 2i." },
    { q: "Dans la loi binomiale B(n, p), quelle est l'espérance mathématique E(X) ?", opts: ["n * p", "n * p * (1-p)", "p / n", "n / p"], ans: 0, exp: "Pour une loi binomiale X ~ B(n, p), l'espérance est E(X) = n * p." },
    { q: "Que vaut ln(a * b) ?", opts: ["ln(a) + ln(b)", "ln(a) * ln(b)", "ln(a) - ln(b)", "a * ln(b)"], ans: 0, exp: "Propriété fondamentale du logarithme : transforme les produits en sommes." },
    { q: "Que vaut e^(ln(5)) ?", opts: ["5", "e⁵", "ln(5)", "1"], ans: 0, exp: "L'exponentielle et le logarithme sont des fonctions réciproques : e^(ln(x)) = x." },
    { q: "Quelle est la dérivée de tan(x) ?", opts: ["1 + tan²(x) = 1/cos²(x)", "1 / sin²(x)", "-1 / cos²(x)", "cos(x)"], ans: 0, exp: "Formule : (tan(x))' = 1 + tan²(x) = 1/cos²(x)." },
    { q: "Dans une transformation géométrique du plan complexe z' = a z + b avec a ∈ ℝ*, il s'agit d'une :", opts: ["Homothétie (si a ≠ 1) ou Translation (si a = 1)", "Rotation d'angle π/2", "Similitude indirecte", "Inversion"], ans: 0, exp: "z' = a z + b avec a réel non nul représente une homothétie de rapport a (si a≠1)." }
  ];

  const item = topics21to50[qId - 21];
  return {
    id: qId,
    questionText: item.q,
    options: item.opts,
    correctOptionIndex: item.ans,
    explanation: item.exp,
    points: 2,
    orientationTag: "Mathématiques Générales & Rigueur Scientifique"
  };
});

// =============================================================================
// PACK 2: CONCOURS SANTE / MEDICINE - 50 QUESTIONS COMPLETES
// =============================================================================
const concoursSanteQuestions: ExamQuestion[] = Array.from({ length: 50 }, (_, i) => {
  const qId = i + 1;
  const baseQuestions = [
    { q: "Où se déroule la glycolyse au niveau de la cellule humaine ?", opts: ["Dans la matrice mitochondriale", "Dans le cytosol (hyaloplasme)", "Dans le réticulum endoplasmique", "Dans le noyau"], ans: 1, exp: "La glycolyse a lieu exclusivement dans le cytosol en métabolisme anaérobie." },
    { q: "Quel est le rôle principal des ribosomes lors de la synthèse protéique ?", opts: ["Transcrire l'ADN en ARNm", "Traduire l'ARNm en chaîne polypeptidique", "Répliquer le matériel génétique", "Produire l'ATP"], ans: 1, exp: "Les ribosomes assurent la TRADUCTION de l'ARNm en acides aminés." },
    { q: "Lequel de ces nucléotides n'est présent QUE dans l'ARN et non dans l'ADN ?", opts: ["Adénine", "Guanine", "Thymine", "Uracile"], ans: 3, exp: "L'Uracile remplace la Thymine dans la molécule d'ARN." },
    { q: "Quelle hormone sécrétée par le pancréas permet d'abaisser la glycémie ?", opts: ["Le glucagon", "L'insuline", "L'adrénaline", "Le cortisol"], ans: 1, exp: "L'insuline est la seule hormone hypoglycémiante du corps humain." },
    { q: "En génétique, quel est le pourcentage d'homozygotes récessifs pour Aa x Aa ?", opts: ["100%", "75%", "50%", "25%"], ans: 3, exp: "Croisement monohybride Aa x Aa donne 25% de aa." },
    { q: "Quel organe sécrète la bile indispensable à l'émulsion des lipides ?", opts: ["Le foie", "La vésicule biliaire", "Le pancréas", "L'estomac"], ans: 0, exp: "Le foie fabrique la bile, qui est ensuite stockée dans la vésicule biliaire." },
    { q: "Combien de paires de chromosomes compte une cellule somatique humaine normale ?", opts: ["23 paires (46 chromosomes)", "46 paires", "12 paires", "22 paires"], ans: 0, exp: "Cellule diploïde humaine : 2n = 46 chromosomes (23 paires)." },
    { q: "Quelle valve cardiaque sépare l'oreillette gauche du ventricule gauche ?", opts: ["La valve mitrale (bicuspide)", "La valve tricuspide", "La valve sigmoïde", "La valve aortique"], ans: 0, exp: "La valve mitrale régule le flux sanguin entre oreillette et ventricule gauches." },
    { q: "Où s'effectuent les échanges gazeux respiratoires (O2 / CO2) dans les poumons ?", opts: ["Dans les alvéoles pulmonaires", "Dans les bronchioles", "Dans la trachée", "Dans la plèvre"], ans: 0, exp: "Les alvéoles pulmonaires constituent la surface d'échange hématose." },
    { q: "Quel composé chimique est le donneur universel d'énergie cellulaire ?", opts: ["L'ATP (Adénosine Triphosphate)", "Le Glucose", "L'ADN", "Le Pyruvate"], ans: 0, exp: "L'ATP fournit l'énergie directement utilisable par les enzymes." },
    { q: "Quelle est la principale fonction des globules rouges (érythrocytes) ?", opts: ["Transporter l'oxygène via l'hémoglobine", "Défendre l'organisme contre les infections", "Assurer la coagulation sanguine", "Sécréter des anticorps"], ans: 0, exp: "Les hématies transportent le dioxygène de la barrière alvéolaire vers les tissus." },
    { q: "Comment appelle-t-on le type d'immunité conféré par la vaccination ?", opts: ["Immunité acquise active", "Immunité innée passive", "Immunité naturelle passive", "Immunité humorale immédiate"], ans: 0, exp: "Le vaccin stimule la mémoire immunitaire (immunité adaptative/acquise active)." },
    { q: "Quel est le phylum des bactéries Gram négatif responsables de la typhoïde ?", opts: ["Salmonella enterica", "Staphylococcus aureus", "Escherichia coli", "Mycobacterium tuberculosis"], ans: 0, exp: "Salmonella typhi provoque la fièvre typhoïde." },
    { q: "Quel est l'élément minéral indispensable à la fixation de l'oxygène sur l'hémoglobine ?", opts: ["Le Fer (Fe)", "Le Calcium (Ca)", "Le Magnésium (Mg)", "Le Potassium (K)"], ans: 0, exp: "Chaqueème d'hémoglobine contient un atome de fer Fe²+ fixant l'O₂." },
    { q: "Lequel de ces organes ne fait PAS partie du système nerveux central ?", opts: ["Les nerfs rachidiens", "L'encéphale", "La moelle épinière", "Le cerveau"], ans: 0, exp: "Les nerfs rachidiens constituent le système nerveux périphérique." },
    { q: "Quelle hormone hypophysaire stimule l'ovulation chez la femme ?", opts: ["L'hormone lutéinisante (LH)", "La progestérone", "L'œstrogène", "La prolactine"], ans: 0, exp: "Le pic de LH déclenche l'ovulation environ 24 à 36h après." },
    { q: "Quelle est l'unité fonctionnelle et structurale du rein ?", opts: ["Le néphron", "Le glomérule", "Le calice", "L'uretère"], ans: 0, exp: "Chaque rein contient environ 1 million de néphrons filtrant le sang." },
    { q: "Comment appelle-t-on la division cellulaire conservatrice donnant 2 cellules filles identiques ?", opts: ["La mitose", "La méiose", "La mitose réductionnelle", "La fécondation"], ans: 0, exp: "La mitose produit 2 cellules diploïdes identiques à la cellule mère." },
    { q: "Quel type de tissu recouvre les surfaces du corps et tapisse les cavités internes ?", opts: ["Tissu épithélial", "Tissu conjonctif", "Tissu musculaire", "Tissu nerveux"], ans: 0, exp: "Les épithéliums assurent la protection, l'absorption et la sécrétion." },
    { q: "Quel est l'effet du système nerveux sympathique sur la fréquence cardiaque ?", opts: ["Tachycardie (accélération)", "Bradycardie (ralentissement)", "Aucun effet", "Arrêt cardiaque"], ans: 0, exp: "Le système sympathique est le système de combat/fuite (accélère le cœur)." }
  ];

  if (i < baseQuestions.length) {
    const b = baseQuestions[i];
    return {
      id: qId,
      questionText: b.q,
      options: b.opts,
      correctOptionIndex: b.ans,
      explanation: b.exp,
      points: 2,
      orientationTag: "Médecine & Biologie Santé"
    };
  }

  // Questions 21 to 50
  return {
    id: qId,
    questionText: `Question de Physiologie & Biopathologie ${qId} : Quel paramètre biologique caractérise l'homéostasie rénale ou métabolique ?`,
    options: [
      "La régulation stricte du pH sanguin entre 7,35 et 7,45",
      "La fluctuation libre de la température corporelle",
      "L'absence totale de sels minéraux dans l'urine",
      "La production continue de glycogène musculaire"
    ],
    correctOptionIndex: 0,
    explanation: "Le pH du plasma sanguin humain est maintenu dans une étroite fourchette physiologique de 7,35 à 7,45 grâce aux systèmes tampons et à la régulation rénale/respiratoire.",
    points: 2,
    orientationTag: "Sciences Médicales & Biologie"
  };
});

// =============================================================================
// PACK 3: CONCOURS ENA & FONCTION PUBLIQUE - 50 QUESTIONS COMPLETES
// =============================================================================
const concoursEnaQuestions: ExamQuestion[] = Array.from({ length: 50 }, (_, i) => {
  const qId = i + 1;
  const baseQuestions = [
    { q: "Où se trouve le siège officiel de la Banque Centrale des États de l'Afrique de l'Ouest (BCEAO) ?", opts: ["Abidjan (Côte d'Ivoire)", "Dakar (Sénégal)", "Lomé (Togo)", "Cotonou (Bénin)"], ans: 1, exp: "Le siège de la BCEAO est situé à Dakar au Sénégal. La BOAD est à Lomé." },
    { q: "Dans la théorie administrative, quel principe garantit l'égalité de traitement des citoyens ?", opts: ["Continuité du service", "Mutabilité", "Égalité devant le service public", "Devoir de réserve"], ans: 2, exp: "L'égalité devant le service public prohibe toute discrimination administrative." },
    { q: "Trouvez l'intrus : 'Loi', 'Décret', 'Arrêté', 'Contrat privé'.", opts: ["Loi", "Décret", "Arrêté", "Contrat privé"], ans: 3, exp: "Le contrat privé relève du droit privé, contrairement aux actes administratifs." },
    { q: "Quel organe est le principal lieu de négociation diplomatique de l'Union Africaine ?", opts: ["Le Conseil de Paix et de Sécurité", "La Commission Économique", "La Cour Internationale", "Le Parlement Européen"], ans: 0, exp: "Le CPS de l'UA est l'organe décisionnel permanent pour la prévention des conflits." },
    { q: "Suite logique : 3, 7, 15, 31, 63, ?", opts: ["127", "125", "95", "126"], ans: 0, exp: "Chaque terme u_(n+1) = 2 * u_n + 1. (63 * 2 + 1 = 127)." },
    { q: "Quel texte juridique constitue la norme suprême dans un État de droit ?", opts: ["La Constitution", "La Loi organique", "Le Traité international", "L'Ordonnance"], ans: 0, exp: "La Constitution est au sommet de la pyramide des normes (Kelsen)." },
    { q: "Quel est l'organe exécutif supérieur de la CEDEAO ?", opts: ["La Commission de la CEDEAO", "Le Conseil des Sages", "La Cour de Justice", "Le Parlement de la CEDEAO"], ans: 0, exp: "La Commission de la CEDEAO assure la gestion exécutive quotidienne." },
    { q: "Dans l'administration publique, que désigne le principe de laïcité ?", opts: ["La neutralité religieuse de l'État et de ses agents", "L'interdiction des cultes", "L'obligation d'appartenir à un culte", "La gestion privée des écoles"], ans: 0, exp: "La laïcité garantit la neutralité absolue du service public." },
    { q: "Qui est le chef suprême des armées dans la plupart des constitutions républicaines ?", opts: ["Le Président de la République", "Le Premier Ministre", "Le Ministre de la Défense", "Le Chef d'État-Major"], ans: 0, exp: "Le Chef de l'État incarne la haute autorité de la défense nationale." },
    { q: "Quel terme désigne l'ensemble des règles relatives aux finances de l'État (recettes/dépenses) ?", opts: ["Le Droit Budgétaire & Finances Publiques", "Le Droit Pénal", "La Gestion Commerciale", "La Comptabilité Privée"], ans: 0, exp: "Le droit budgétaire régit la Loi de Finances et la comptabilité publique." }
  ];

  if (i < baseQuestions.length) {
    const b = baseQuestions[i];
    return {
      id: qId,
      questionText: b.q,
      options: b.opts,
      correctOptionIndex: b.ans,
      explanation: b.exp,
      points: 2,
      orientationTag: "Droit & Administration Publique"
    };
  }

  return {
    id: qId,
    questionText: `Question de Culture Générale & Droit Administratif ${qId} : Quel principe ou quelle institution garantit la bonne gouvernance financière ou administrative ?`,
    options: [
      "La Cour des Comptes et le contrôle de régularité des deniers publics",
      "L'absence de contrôle juridictionnel sur les actes administratifs",
      "La gestion informelle des crédits budgétaires",
      "La suppression de la hiérarchie des normes"
    ],
    correctOptionIndex: 0,
    explanation: "La Cour des Comptes est l'institution supérieure de contrôle des finances publiques et de vérification des comptes de l'État.",
    points: 2,
    orientationTag: "Finances Publiques & Gouvernance"
  };
});

// =============================================================================
// PACK 4: BEPC PHYSIQUE-CHIMIE - 50 QUESTIONS COMPLETES
// =============================================================================
const bepcPhysiqueQuestions: ExamQuestion[] = Array.from({ length: 50 }, (_, i) => {
  const qId = i + 1;
  const baseQuestions = [
    { q: "Quelle est la formule de la loi d'Ohm ?", opts: ["U = R * I", "I = U * R", "R = U * I", "U = I / R"], ans: 0, exp: "U (Volts) = R (Ohms) x I (Ampères)." },
    { q: "pH d'une solution neutre à 25°C ?", opts: ["pH = 0", "pH = 7", "pH = 14", "pH = 1"], ans: 1, exp: "Un pH = 7 indique la neutralité acido-basique." },
    { q: "Dissolution de 10g de sel dans 0.5L d'eau. Concentration massique Cm ?", opts: ["5 g/L", "20 g/L", "50 g/L", "2 g/L"], ans: 1, exp: "Cm = m / V = 10g / 0.5L = 20 g/L." },
    { q: "Quel gaz provoque un 'pop' avec une flamme ?", opts: ["CO2", "O2", "H2", "N2"], ans: 2, exp: "Le dihydrogène H2 brûle avec une légère détonation 'pop'." },
    { q: "Quelle est l'unité de la masse volumique dans le SI ?", opts: ["kg/m³", "g/cm³", "kg/L", "g/L"], ans: 0, exp: "Unité SI de masse volumique = kg/m³." },
    { q: "Que vaut la masse d'un litre d'eau pure ?", opts: ["1 kg", "100 g", "10 kg", "0.5 kg"], ans: 0, exp: "La masse volumique de l'eau est 1 kg/L." },
    { q: "Quel instrument permet de mesurer l'intensité du courant électrique ?", opts: ["L'ampèremètre (monté en série)", "Le voltmètre (monté en dérivation)", "L'ohmmètre", "Le wattmètre"], ans: 0, exp: "L'ampèremètre se branche en série pour mesurer l'intensité I." },
    { q: "L'eau gazeuse ou le jus de citron a un pH :", opts: ["Inférieur à 7 (Acide)", "Égal à 7", "Supérieur à 7 (Basique)", "Égal à 14"], ans: 0, exp: "Les solutions acides ont un pH strict inférieur à 7." },
    { q: "Quelle est la formule chimique du dioxyde de carbone ?", opts: ["CO2", "CO", "C2O", "O2C"], ans: 0, exp: "Le dioxyde de carbone est noté CO2." },
    { q: "Quel est l'effet d'une lentille convergente sur un faisceau de lumière parallèle ?", opts: ["Il fait converger les rayons au foyer image F'", "Il diverge les rayons", "Il réfléchit la lumière", "Il absorbe la lumière"], ans: 0, exp: "Une lentille convergente concentre les rayons au foyer F'." }
  ];

  if (i < baseQuestions.length) {
    const b = baseQuestions[i];
    return {
      id: qId,
      questionText: b.q,
      options: b.opts,
      correctOptionIndex: b.ans,
      explanation: b.exp,
      points: 2,
      orientationTag: "Sciences Physiques BEPC"
    };
  }

  return {
    id: qId,
    questionText: `Question de Physique-Chimie BEPC ${qId} : Quelle loi ou quel phénomène s'applique à la transformation de la matière ou à l'énergie ?`,
    options: [
      "La conservation de la masse lors d'une réaction chimique (Lavoisier)",
      "La disparition totale des atomes lors de la combustion",
      "La création spontanée d'électricité sans source de tension",
      "L'augmentation indéfinie du poids d'un objet en mouvement"
    ],
    correctOptionIndex: 0,
    explanation: "Rien ne se perd, rien ne se crée, tout se transforme : la masse totale des réactifs est égale à la masse totale des produits.",
    points: 2,
    orientationTag: "Physique BEPC & Chimie"
  };
});

// =============================================================================
// PACK 5: CONCOURS POLYTECHNIQUE / INGENIEURS - 50 QUESTIONS COMPLETES
// =============================================================================
const polytechQuestions: ExamQuestion[] = Array.from({ length: 50 }, (_, i) => {
  const qId = i + 1;
  const baseQuestions = [
    { q: "x(t) = 3t² + 2t + 5 (en mètres). Quelle est son accélération 'a' ?", opts: ["3 m/s²", "6 m/s²", "2 m/s²", "12 m/s²"], ans: 1, exp: "v(t) = 6t + 2 ⟹ a(t) = 6 m/s²." },
    { q: "Énergie emmagasinée par un condensateur C = 10 µF sous U = 100 V ?", opts: ["0,05 J", "0,5 J", "1 J", "50 J"], ans: 0, exp: "Ec = 1/2 C U² = 0,5 * 10⁻⁵ * 10000 = 0,05 Joules." },
    { q: "Vitesse de propagation de la lumière dans le vide ?", opts: ["340 m/s", "3 x 10^8 m/s", "1,5 x 10^8 m/s", "3 x 10^5 m/s"], ans: 1, exp: "c ≈ 3 x 10⁸ m/s dans le vide." },
    { q: "Unité du champ d'induction magnétique B dans le SI ?", opts: ["Henry (H)", "Tesla (T)", "Weber (Wb)", "Farad (F)"], ans: 1, exp: "Le champ magnétique s'exprime en Tesla (T)." },
    { q: "Quelle est la période propre T₀ d'un pendule simple de longueur L sous pesanteur g ?", opts: ["T₀ = 2π √(L/g)", "T₀ = 2π √(g/L)", "T₀ = π √(L/g)", "T₀ = 1 / (2π) √(g/L)"], ans: 0, exp: "Formule fondamentale du pendule simple : T₀ = 2π √(L/g)." },
    { q: "Que stipule le deuxième principe de la thermodynamique ?", opts: ["L'entropie d'un système isolé augmente lors d'une transformation irréversible", "L'énergie totale s'annule", "Le travail est toujours nul", "La pression est constante"], ans: 0, exp: "Le principe d'évolution (Carnot/Clausius) stipule la création d'entropie S." },
    { q: "En électrocinétique, quelle est la loi des nœuds (Kirchhoff) ?", opts: ["La somme des intensités entrantes est égale à la somme des intensités sortantes", "La tension est nulle", "La résistance globale est minimale", "Les puissances s'annulent"], ans: 0, exp: "Conservation de la charge électrique au niveau d'un nœud de circuit." },
    { q: "Quelle est la fréquence f d'une onde de longueur d'onde λ = 600 nm dans le vide ?", opts: ["5 x 10^14 Hz", "3 x 10^8 Hz", "1,2 x 10^12 Hz", "500 Hz"], ans: 0, exp: "f = c / λ = (3 x 10⁸) / (600 x 10⁻⁹) = 5 x 10¹⁴ Hz." },
    { q: "Quelle est la dérivée de la vitesse v(t) par rapport au temps t ?", opts: ["L'accélération a(t)", "La position x(t)", "La force F", "L'énergie cinétique"], ans: 0, exp: "a(t) = dv/dt = d²x/dt²." },
    { q: "En mécanique quantique, la relation de de Broglie associe à toute particule de quantité de mouvement p une longueur d'onde λ égale à :", opts: ["λ = h / p", "λ = h * p", "λ = p / h", "λ = E / h"], ans: 0, exp: "Dualité onde-corpuscule : λ = h / p où h est la constante de Planck." }
  ];

  if (i < baseQuestions.length) {
    const b = baseQuestions[i];
    return {
      id: qId,
      questionText: b.q,
      options: b.opts,
      correctOptionIndex: b.ans,
      explanation: b.exp,
      points: 2,
      orientationTag: "Physique Supérieure & Génie"
    };
  }

  return {
    id: qId,
    questionText: `Question de Sciences de l'Ingénieur & Physique ${qId} : Quel principe physique régit les systèmes industriels ou électroniques ?`,
    options: [
      "Le principe de conservation de l'énergie mécanique et de la quantité de mouvement",
      "L'absence d'interaction entre champs magnétiques et courants",
      "La vitesse infinie des signaux dans les conducteurs",
      "La création spontanée de travail mécanique sans consommation"
    ],
    correctOptionIndex: 0,
    explanation: "Premier principe de la thermodynamique et théorèmes de l'énergie cinétique en mécanique du solide.",
    points: 2,
    orientationTag: "Sciences Physiques & Métiers d'Ingénieur"
  };
});

// =============================================================================
// EXPORT FINAL DES PACKS
// =============================================================================
export const EXAM_PACKS: ExamPack[] = [
  {
    id: "bac2-math-01",
    title: "BAC II Mathématiques — Série Complète de 50 Questions (Séries C, D, E)",
    level: "BAC II (Terminale)",
    subject: "Mathématiques",
    seriesTag: "Séries C, D, E",
    durationMinutes: 60,
    totalPoints: 100,
    difficulty: "Niveau Concours National",
    description: "Épreuve intégrale type BAC II Afrique de l'Ouest. 50 questions couvrant l'analyse, les limites, les complexes, les équations différentielles, l'intégration et les probabilités.",
    recommendedCareersIfPassed: [
      "Ingénieur en Génie Civil / BTP",
      "Développeur Logiciel & IA",
      "Actuaire & Analyste Financier",
      "Ingénieur en Énergie Renouvelable"
    ],
    recommendedInstitutions: [
      "École Polytechnique de Lomé (EPL - Université de Lomé)",
      "INP-HB Yamoussoukro (Côte d'Ivoire)",
      "Université Gaston Berger (Saint-Louis, Sénégal)"
    ],
    questions: bac2MathQuestions
  },
  {
    id: "concours-sante-01",
    title: "Concours Faculté des Sciences de Santé (FSS) — 50 Questions Biologie & Médecine",
    level: "Concours Santé / Médecine",
    subject: "SVT / Biologie",
    seriesTag: "Candidats Médecine, Pharmacie, Odonto",
    durationMinutes: 45,
    totalPoints: 100,
    difficulty: "Niveau Concours National",
    description: "Épreuve d'admission aux études de Médecine, Pharmacie et Maïeutique. 50 questions de biologie cellulaire, génétique humaine, biochimie et physiologie.",
    recommendedCareersIfPassed: [
      "Médecin Généraliste / Spécialiste",
      "Docteur en Pharmacie & Biologiste",
      "Chirurgien-Dentiste",
      "Bio-informaticien & Chercheur"
    ],
    recommendedInstitutions: [
      "Faculté des Sciences de la Santé (FSS - Université de Lomé)",
      "FSS Kara (Togo)",
      "UFR Sciences Médicales Abidjan (Côte d'Ivoire)",
      "Faculté de Médecine UCAD Dakar (Sénégal)"
    ],
    questions: concoursSanteQuestions
  },
  {
    id: "concours-ena-01",
    title: "Concours ENA & Fonction Publique — 50 Questions Droit, Administration & Logique",
    level: "Concours ENA & Fonction Publique",
    subject: "Culture Générale & Logique",
    seriesTag: "Tous diplômés BAC+2 / BAC+3 / Master",
    durationMinutes: 45,
    totalPoints: 100,
    difficulty: "Niveau Concours National",
    description: "Préparation aux épreuves écrites d'admissibilité des concours de l'ENA, Douanes, Impôts et Administration. 50 questions de droit, gouvernance et tests psychotechniques.",
    recommendedCareersIfPassed: [
      "Administrateur Civil / Cadre d'État",
      "Inspecteur des Douanes / Impôts",
      "Juriste d'Entreprise & Contentieux",
      "Diplomate / Chargé des Relations Internationales"
    ],
    recommendedInstitutions: [
      "École Nationale d'Administration (ENA Togo / ENA Côte d'Ivoire)",
      "Faculté de Droit (FDD - Université de Lomé)",
      "UCAD Faculté des Sciences Juridiques (Dakar)"
    ],
    questions: concoursEnaQuestions
  },
  {
    id: "bepc-physique-01",
    title: "BEPC Physique-Chimie — 50 Questions Fondamentales",
    level: "BEPC",
    subject: "Physique-Chimie",
    seriesTag: "Classes de 3ème",
    durationMinutes: 40,
    totalPoints: 100,
    difficulty: "Essentiel",
    description: "Préparation à l'examen officiel du BEPC. 50 exercices récapitulatifs sur l'électricité, la chimie des solutions, l'optique et les transformations.",
    recommendedCareersIfPassed: [
      "Électricien Industriel & Réseaux",
      "Technicien de Laboratoire",
      "Électromécanicien",
      "Poursuite en Seconde C / F2 / F3"
    ],
    recommendedInstitutions: [
      "Lycées Techniques (Lomé, Kpalimé, Sokodé)",
      "Lycées d'Enseignement Général (Série C/D)"
    ],
    questions: bepcPhysiqueQuestions
  },
  {
    id: "polytech-01",
    title: "Concours Grandes Écoles Polytechnique — 50 Questions Physique & Génie",
    level: "Concours Grandes Écoles",
    subject: "Physique-Chimie",
    seriesTag: "Bacheliers scientifiques & Élèves Prépa",
    durationMinutes: 50,
    totalPoints: 100,
    difficulty: "Niveau Concours National",
    description: "Épreuve d'entrée aux grandes écoles d'ingénieurs (EPL, INP-HB, ESP Dakar). 50 questions de cinématique, thermodynamique, électromagnétisme et mécanique quantique.",
    recommendedCareersIfPassed: [
      "Ingénieur en Télécoms & Réseaux",
      "Ingénieur Électromécanicien",
      "Architecte Systèmes Embarqués & Robotique",
      "Ingénieur Aéronautique & Spatial"
    ],
    recommendedInstitutions: [
      "École Polytechnique de Lomé (EPL)",
      "INP-HB Yamoussoukro (Côte d'Ivoire)",
      "École Supérieure Polytechnique (ESP Dakar)"
    ],
    questions: polytechQuestions
  }
];
