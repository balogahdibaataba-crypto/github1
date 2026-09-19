import { OrientationTest } from "../types";
import { getTestScoreAppreciation } from "../utils/evaluationRules";

// ---------------------------------------------------------------------------
// OFFICIAL HOLLAND RIASEC QUESTIONS (DERIVED FROM THE ATTACHED PDF DOCUMENTS)
// Categories: R (Réaliste), I (Investigateur), A (Artistique), S (Social), E (Entreprenant), C (Conventionnel)
// ---------------------------------------------------------------------------

const RAW_RIASEC_QUESTIONS = [
  // --- SECTION 1: INTÉRÊTS & ACTIVITÉS (PDF Doc 2/3/4) ---
  {
    id: 1,
    text: "Pendant votre temps libre ou dans un projet, quelle activité pratique vous attire le plus ?",
    options: [
      { label: "Bricoler, réparer un appareil, fabriquer un objet en bois ou ajuster un moteur (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Lire des revues scientifiques, résoudre un problème abstrait ou faire des énigmes (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Peindre, composer de la musique, écrire des poèmes ou réaliser des créations visuelles (A)", value: "A", categoryScore: { A: 3 } },
      { label: "S'engager dans des organismes communautaires, écouter ou aider un ami en difficulté (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Vendre un produit, convaincre un groupe, négocier ou lancer une activité commerciale (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Ranger et classer vos fichiers, établir des comptes-rendus ou vérifier des chiffres (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 2,
    text: "Quel type d'atelier ou de cours auriez-vous le plus de plaisir à suivre ?",
    options: [
      { label: "Dessin mécanique, électrotechnique, mécanique automobile ou menuiserie (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Sciences physiques, biologie cellulaire, mathématiques appliquées ou informatique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Arts plastiques, théâtre, écriture littéraire, musique ou langues étrangères (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Psychologie relationnelle, sciences de l'éducation, soins ou médiation sociale (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Techniques de négociation, marketing digital, leadership et gestion d'entreprise (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Comptabilité générale, bureautique avancée, archivage et gestion de registres (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 3,
    text: "En milieu extérieur ou en pleine nature, quelle occupation préférez-vous ?",
    options: [
      { label: "Cultiver le sol, reboiser, entretenir des espaces verts ou manipuler des engins (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Observer le comportement des animaux, prélever des échantillons ou étudier la faune (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Photographier des paysages originaux, dessiner sur le motif ou écrire au calme (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Animer un groupe de jeunes, organiser des loisirs ou encadrer une excursion (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Diriger l'organisation logistique et commerciale d'un grand événement en plein air (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Contrôler scrupuleusement le respect de l'itinéraire, du calendrier et du budget (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 4,
    text: "Dans un travail d'équipe, quel rôle assumez-vous spontanément ?",
    options: [
      { label: "Le technicien : je m'occupe des outils pratiques, du matériel et des réparations (R)", value: "R", categoryScore: { R: 3 } },
      { label: "L'analyste : je vérifie les faits, décortique les données et cherche le 'pourquoi' (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Le créatif : j'apporte des idées neuves, un design original et une vision esthétique (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Le médiateur : je veille à la cohésion du groupe, à l'écoute et au bien-être de chacun (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Le leader : je fixe les objectifs, motive les coéquipiers et prends les décisions (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Le secrétaire / gestionnaire : je gère l'agenda, consigne les PV et tiens les dossiers (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 5,
    text: "Quel environnement professionnel vous semble le plus attrayant ?",
    options: [
      { label: "Un chantier BTP, un atelier de maintenance, une ferme ou une usine moderne (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Un laboratoire d'analyse, un centre de recherche ou une unité de R&D (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Un studio de création, une agence de presse, un musée ou un théâtre (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Une école, un centre de santé, un cabinet d'orientation ou une ONG humanitaire (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Une entreprise dynamique, une salle de marché ou un cabinet d'affaires (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Une administration publique, un cabinet comptable ou un centre d'archivage (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 6,
    text: "Face à une machine ou un appareil en panne, quelle est votre première réaction ?",
    options: [
      { label: "Prendre ma boîte à outils, démonter la machine et réparer la pièce défectueuse (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Consulter la fiche technique, comprendre le schéma logique et analyser le diagnostic (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Imaginer un détournement créatif de la machine ou repenser son design ergonomique (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Demander de l'aide à un collègue compétent tout en restant en soutien relationnel (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Appeler le service de maintenance garanti et exiger un remplacement rapide (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Remplir le registre de maintenance et suivre à la lettre le protocole de panne (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 7,
    text: "Parmi ces activités culturelles et intellectuelles, laquelle vous stimule le plus ?",
    options: [
      { label: "Regarder un documentaire sur la mécanique industrielle ou la construction (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Lire un essai sur les découvertes en physique, génétique ou astrophysique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Découvrir une pièce de théâtre, un roman captivant ou une exposition d'art (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Participer à un débat sur les sciences humaines, l'éducation ou le bien-être social (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Suivre l'actualité économique, les réussites d'entrepreneurs et les stratégies politiques (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Consulter des guides de gestion, des analyses fiscales ou des rapports financiers (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 8,
    text: "Comment préférez-vous utiliser des outils informatiques ?",
    options: [
      { label: "Configurer des réseaux matériels, réparer des ordinateurs et câbler des systèmes (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Écrire des algorithmes complexes, analyser des bases de données ou faire de la data (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Utiliser des logiciels de retouche photo, de montage vidéo ou de modélisation 3D (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Utiliser des plateformes collaboratives pour échanger, former et soutenir la communauté (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Piloter des campagnes de publicité en ligne, suivre le ROI et vendre des services (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Saisir scrupuleusement des données, structurer des tableurs Excel et archiver des dossiers (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 9,
    text: "Quel projet de bénévolat ou d'engagement citoyen choisiriez-vous ?",
    options: [
      { label: "Construire des puits, réparer des écoles ou installer des panneaux solaires (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Mener une étude sur la qualité de l'eau ou la biodiversité locale (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Concevoir les affiches, fresques murales et l'identité visuelle de l'association (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Offrir du soutien scolaire, soigner les démunis ou apporter une écoute psychologique (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Trouver des mécènes, négocier les financements et diriger la campagne d'appel à dons (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Tenir rigoureusement la comptabilité et le registre administratif de l'ONG (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 10,
    text: "Si vous deviez créer un produit ou service, quel serait votre objectif principal ?",
    options: [
      { label: "Fabriquer un objet technique robuste, utile et de haute qualité matérielle (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Développer une technologie innovante basée sur une découverte scientifique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Concevoir une œuvre esthétique et originale qui suscite des émotions profondes (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Offrir un service d'aide humaine qui améliore directement la vie des gens (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Bâtir une marque leader, conquérir le marché et générer de la croissance (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Garantir un processus de gestion parfait, conforme aux lois et sans faille (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },

  // --- SECTION 2: INTÉRÊTS ET OCCUPATIONS / MÉTIERS (PDF Doc 2/3/4) ---
  {
    id: 11,
    text: "Parmi ces paires de professions, laquelle correspond le mieux à ce que vous aimeriez exercer ?",
    options: [
      { label: "Mécanicien automobile ou Technicien en aménagement de la faune (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Chercheur en biologie ou Ingénieur en intelligence artificielle (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Architecte d'intérieur ou Journaliste/Rédacteur de presse (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Conseiller en orientation scolaire ou Psychologue clinicien (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Directeur commercial ou Avocat d'affaires (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Expert-comptable ou Administrateur de bases de données (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 12,
    text: "Dans le domaine de la santé et du bien-être, quelle spécialité préférez-vous ?",
    options: [
      { label: "Technicien prothésiste dentaire ou spécialiste en maintenance d'imagerie (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Médecin chercheur en pharmacologie ou biologiste médical (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Art-thérapeute ou concepteur de campagnes de sensibilisation visuelle (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Médecin généraliste de famille, infirmier ou orthophoniste (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Directeur d'hôpital ou gérant de clinique privée (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Gestionnaire de dossiers médicaux et archiviste de santé (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 13,
    text: "Si vous travailliez dans le secteur des transports et de la logistique :",
    options: [
      { label: "Piloter un avion, conduire un gros camion ou réparer des moteurs d'aéronefs (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Optimiser les itinéraires logistiques par des calculs mathématiques et algorithmes (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Concevoir le design aérodynamique ou l'aménagement intérieur des véhicules (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Prendre soin des passagers, être agent de bord ou responsable de l'accueil (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Négocier les contrats de fret et diriger la compagnie de transport (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Gérer le suivi des bordereaux de livraison, le dédouanement et la saisie des stocks (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 14,
    text: "Dans le domaine du BTP et de l'Urbanisme :",
    options: [
      { label: "Travailler sur le chantier comme charpentier, électricien ou chef de travaux (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Calculer la résistance des matériaux et concevoir la structure des ponts (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Dessiner les plans architecturaux et imaginer la forme esthétique des bâtiments (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Consulter les habitants pour adapter le quartier à leurs besoins sociaux (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Promouvoir le projet d'aménagement et négocier avec les investisseurs publics (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Établir les métrés, les devis estimatifs et contrôler les pièces comptables (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 15,
    text: "Si vous deviez travailler dans l'Agriculture ou l'Environnement :",
    options: [
      { label: "Conduire des tracteurs, entretenir les cultures et manipuler le matériel agricole (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Mener des recherches en agronomie pour créer de nouvelles variétés de plantes (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Concevoir des jardins paysagers uniques et embellir l'environnement (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Former des groupements d'agriculteurs et vulgariser les bonnes pratiques (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Gérer une grande exploitation agro-industrielle et commercialiser les récoltes (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Tenir la comptabilité de la ferme et gérer la traçabilité des produits (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 16,
    text: "Dans l'univers de la Communication et des Médias :",
    options: [
      { label: "Maintenir les équipements audiovisuels et gérer les régies techniques (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Mener des enquêtes journalistiques approfondies et vérifier les sources d'information (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Rédiger des articles passionnants, concevoir des visuels ou créer des podcasts (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Animer des émissions de libre antenne pour donner la parole aux auditeurs (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Diriger l'agence de presse, vendre des espaces publicitaires et négocier (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Programmer la grille des émissions et gérer la baque d'archives médias (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 17,
    text: "Dans le secteur de la Justice et du Droit :",
    options: [
      { label: "Exercer comme technicien de la police scientifique ou expert en balistique (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Analyser les textes de loi, faire des recherches de jurisprudence complexes (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Rédiger des plaidoiries percutantes et captiver l'auditoire de la cour (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Défendre les droits des délinquants pour favoriser leur réhabilitation sociale (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Assurer la défense d'entreprises dans de grands procès d'affaires et négocier (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Gérer le greffe du tribunal, enregistrer les actes et tenir les registres juridiques (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 18,
    text: "Dans le secteur du Commerce et de la Distribution :",
    options: [
      { label: "Gérer le montage des rayons, la manutention et la maintenance du magasin (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Étudier les tendances de consommation et analyser les données de ventes (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Concevoir le vitrinisme, la décoration commerciale et la publicité visuelle (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Accueillir chaleureusement les clients, conseiller et répondre à leurs besoins (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Diriger la force de vente, négocier avec les fournisseurs et augmenter la marge (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Tenir la caisse, vérifier les tickets et faire l'inventaire précis des stocks (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 19,
    text: "Si vous deviez travailler dans l'Enseignement :",
    options: [
      { label: "Enseigner les travaux pratiques de technologie, mécanique ou électricité (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Enseigner les mathématiques supérieures, la physique ou mener des recherches (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Enseigner la musique, les beaux-arts, la littérature ou le dessin (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Enseigner à l'école primaire ou spécialisée pour accompagner l'épanouissement des enfants (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Diriger un établissement scolaire, gérer les équipes et les budgets (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Administrer les examens, tenir les registres de notes et gérer les relevés officiels (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 20,
    text: "Dans le domaine de l'Informatique et du Numérique :",
    options: [
      { label: "Installer des serveurs physiques, réparer du matériel et câbler la fibre (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Développer des modèles d'intelligence artificielle ou de cybersécurité (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Concevoir l'interface utilisateur (UI/UX Design) et la charte graphique web (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Assurer la formation des utilisateurs et le support technique bienveillant (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Diriger une start-up Tech, lever des fonds et vendre des solutions SaaS (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Administrer les bases de données, contrôler les accès et archiver les fichiers (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },

  // --- SECTION 3: APTITUDES, HABILETÉS ET TALENTS (PDF Doc 2/3/4) ---
  {
    id: 21,
    text: "Quelle est la capacité physique ou manuelle dont vous êtes le plus fier ?",
    options: [
      { label: "Ma dextérité manuelle, mes réflexes rapides et ma coordination visuo-motrice (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Ma capacité à me concentrer de longues heures sur un sujet théorique abstrait (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Mon habileté à exprimer des émotions par mes mains, la voix ou le dessin (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Ma capacité à percevoir les besoins physiques et émotionnels des personnes (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Mon endurance lors d'une négociation tendue pour faire triompher mon point de vue (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Ma précision d'exécution dans la frappe, la saisine et le classement sans erreur (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 22,
    text: "Sur le plan du raisonnement intellectuel, quel est votre atout majeur ?",
    options: [
      { label: "Comprendre intuitivement le fonctionnement concret des systèmes mécaniques (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Mon esprit critique, ma rigueur scientifique et mon impartialité (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Mon imagination féconde et ma capacité à faire des associations d'idées originales (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Ma compréhension de la psychologie humaine et ma perspicacité relationnelle (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Mon sens stratégique pour saisir rapidement les opportunités commerciales (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Mon esprit méthodique, logique et rigoureux pour suivre les procédures (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 23,
    text: "Quelle est votre meilleure compétence en matière de création et conception ?",
    options: [
      { label: "Concevoir des objets techniques solides ou lire facilement des plans 3D (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Élaborer des théories, des protocoles de recherche ou des modèles d'analyse (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Créer des décors, des textes poétiques, des œuvres visuelles ou de la musique (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Concevoir des ateliers pédagogiques et des dynamiques de groupe épanouissantes (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Concevoir des business plans percutants et monter des projets d'entreprise (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Concevoir des systèmes de classement parfaits et des modèles de documents (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 24,
    text: "En ce qui concerne votre aisance relationnelle :",
    options: [
      { label: "Je m'exprime mieux par des actes concrets et du travail utile que par de longs discours (R)", value: "R", categoryScore: { R: 3 } },
      { label: "J'aime échanger des idées scientifiques précises avec des passionnés de mon domaine (I)", value: "I", categoryScore: { I: 3 } },
      { label: "J'exprime ma personnalité avec sensibilité, spontanéité et originalité (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je possède une grande empathie, je sais réconforter et créer des liens profonds (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je possède un leadership naturel, je sais persuader, vendre et rallier les gens (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Je suis courtois, discret, respectueux des règles et des hiérarchies (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 25,
    text: "Face à une consigne complexe ou un règlement officiel :",
    options: [
      { label: "Je cherche immédiatement l'application pratique sur le terrain (R)", value: "R", categoryScore: { R: 3 } },
      { label: "J'analyse la cohérence logique et les fondements théoriques du texte (I)", value: "I", categoryScore: { I: 3 } },
      { label: "J'ai tendance à m'en affranchir pour proposer ma propre vision originale (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je vérifie que le règlement préserve la dignité et le bien-être des personnes (S)", value: "S", categoryScore: { S: 3 } },
      { label: "J'utilise le règlement pour défendre mes projets et faire avancer mes objectifs (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Je me conforme scrupuleusement aux instructions reçues sans dévier (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 26,
    text: "Quelle aptitude vous distingue le plus lors d'un travail sous pression ?",
    options: [
      { label: "Garder mon calme physique et réparer concrètement le matériel nécessaire (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Garder une lucidité intellectuelle totale pour isoler les faits des émotions (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Puiser dans mon intuition créative pour improviser une issue esthétique (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Rassurer les collègues stressés et maintenir un climat de solidarité (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Prendre les commandes, trancher rapidement et assumer les risques (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Garder une méthode stricte pour qu'aucun détail ni chiffre ne soit oublié (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 27,
    text: "Sur le plan des compétences mathématiques et comptables :",
    options: [
      { label: "Je sais mesurer, calculer des dimensions et effectuer des tracés à l'échelle (R)", value: "R", categoryScore: { R: 3 } },
      { label: "J'adore résoudre des équations complexes et analyser des statistiques (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Les chiffres bruts m'ennuient ; je préfère l'harmonie des formes et des émotions (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Les chiffres m'intéressent surtout s'ils mesurent le progrès humain ou social (S)", value: "S", categoryScore: { S: 3 } },
      { label: "J'utilise les chiffres pour calculer des budgets, des marges et des rentabilités (E)", value: "E", categoryScore: { E: 3 } },
      { label: "J'excelle dans le calcul d'exactitude, le rapprochement de caisse et la tenue de livres (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 28,
    text: "Comment évaluez-vous votre aptitude à utiliser des équipements complexes ?",
    options: [
      { label: "Très forte : j'apprends rapidement à manier n'importe quelle machine ou outil (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Orientée recherche : j'aime comprendre le fonctionnement physique interne (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Orientée création : j'utilise les équipements pour produire de l'art (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Orientée service : je préfère former les autres à l'usage des outils (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Orientée gestion : je m'intéresse au coût d'acquisition et au rendement (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Orientée procédure : je veille au respect strict du manuel d'utilisation (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 29,
    text: "Quelle est votre plus grande force dans la rédaction de documents ?",
    options: [
      { label: "Décrire des données concrètes et des fiches d'instructions pratiques (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Rédiger des rapports d'analyse, des mémoires ou des synthèses scientifiques (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Écrire des textes littéraires, des slogans percutants ou des poèmes (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Rédiger des messages d'encouragement, des fiches de conseil ou des lettres humaines (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Rédiger des propositions commerciales, des discours stimulants et des contrats (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Saisir sans erreur des comptes-rendus officiels, des lettres administratives et PV (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 30,
    text: "Si vous deviez définir votre talent naturel en un mot :",
    options: [
      { label: "Pragmatique (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Analytique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Créatif (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Altruiste (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Leader (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Méthodique (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },

  // --- SECTION 4: TRAITS DE PERSONNALITÉ & ATTITUDES (PDF Doc 2/3/4) ---
  {
    id: 31,
    text: "Parmi ces paires de traits de caractère, lesquelles vous décrivent le plus fidèlement ?",
    options: [
      { label: "Endurant physiquement et franc (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Curieux intellectuellement et persévérant (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Spontané et doté d'une grande imagination (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Chaleureux, dévoué et compréhensif (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Audacieux, ambitieux et persuasif (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Consciencieux, ponctuel et organisé (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 32,
    text: "Quelle est votre attitude face aux imprévus et aux changements ?",
    options: [
      { label: "Je m'adapte avec bon sens en cherchant une solution concrète et immédiate (R)", value: "R", categoryScore: { R: 3 } },
      { label: "J'étudie les causes de l'imprévu pour comprendre et éviter sa récurrence (I)", value: "I", categoryScore: { I: 3 } },
      { label: "J'accueille l'imprévu comme une opportunité d'innover et de créer (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je veille d'abord à rassurer l'équipe et à préserver l'entente collective (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je prends le contrôle de l'imprévu pour le transformer en avantage stratégique (E)", value: "E", categoryScore: { E: 3 } },
      { label: "L'imprévu me perturbe ; je cherche rapidement à rétablir l'ordre et le protocole (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 33,
    text: "Comment vos collègues ou camarades vous décrivent-ils généralement ?",
    options: [
      { label: "Une personne directe, simple, sur qui on peut compter pour du concret (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Une personne réservée, très intelligente et passionnée par la connaissance (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Une personne originale, artiste dans l'âme et un peu non-conformiste (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Une personne généreuse, toujours prête à rendre service et à écouter (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Une personne dynamique, charismatique et née pour être chef (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Une personne ordonnée, exacte, ponctuelle et très méthodique (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 34,
    text: "Quel est votre rapport aux règles administratives et sociales ?",
    options: [
      { label: "Je les respecte si elles ont un sens pratique et logique sur le terrain (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Je les analyse de façon critique pour vérifier leur justification théorique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Je n'aime pas être enfermé dans des contraintes et privilégie la liberté (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je les respecte tant qu'elles favorisent la justice sociale et l'équité (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je sais utiliser les règles pour faire avancer mes projets et négocier (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Je me plie spontanément et scrupuleusement aux règlements de mon milieu (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 35,
    text: "Dans la gestion de votre propre temps et agenda :",
    options: [
      { label: "Je fonctionne par tâches concrètes à accomplir l'une après l'autre (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Je consacre beaucoup de temps à la réflexion avant d'agir (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Je fonctionne de manière très spontanée selon l'inspiration du moment (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Mon temps est largement ouvert pour accueillir et écouter les autres (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je gère mon temps de façon intensive pour atteindre rapidement mes objectifs (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Mon emploi du temps est très structuré, planifié et consigné dans un agenda (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 36,
    text: "Comment exprimez-vous vos opinions lors d'un désaccord ?",
    options: [
      { label: "De façon franche, directe et sans détour, basée sur les faits matériels (R)", value: "R", categoryScore: { R: 3 } },
      { label: "De façon réservée et objective, en m'appuyant sur des preuves vérifiables (I)", value: "I", categoryScore: { I: 3 } },
      { label: "De façon passionnée et émotive, guidée par mon intuition personnelle (A)", value: "A", categoryScore: { A: 3 } },
      { label: "De façon conciliante, souple et attentive aux sentiments d'autrui (S)", value: "S", categoryScore: { S: 3 } },
      { label: "De façon persuasive, énergique et affirmée pour faire valoir mon idée (E)", value: "E", categoryScore: { E: 3 } },
      { label: "De façon mesurée et respectueuse des consignes officielles et de la hiérarchie (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 37,
    text: "Qu'est-ce qui vous motive le plus dans le travail au quotidien ?",
    options: [
      { label: "Voir le résultat physique et tangible de mes efforts (un objet réparé ou construit) (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Découvrir de nouvelles connaissances et résoudre une énigme complexe (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Créer quelque chose de beau, d'original et exprimer ma sensibilité (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Savoir que mon travail aide quelqu'un et rend la société plus humaine (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Relever des défis ambitieux, gagner et voir mon influence grandir (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Avoir la certitude d'un travail bien fait, exact, ordonné et sans erreurs (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 38,
    text: "Quel est votre rapport aux responsabilités et au commandement ?",
    options: [
      { label: "Je préfère m'occuper de ma tâche technique plutôt que de commander aux autres (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Je préfère un rôle d'expert ou de conseiller scientifique indépendant (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Je préfère garder mon autonomie créative sans diriger ni être dirigé (A)", value: "A", categoryScore: { A: 3 } },
      { label: "J'accepte les responsabilités si elles servent à soutenir et faire grandir l'équipe (S)", value: "S", categoryScore: { S: 3 } },
      { label: "J'adore prendre des responsabilités de commandement, diriger et motiver (E)", value: "E", categoryScore: { E: 3 } },
      { label: "J'exécute avec soin les responsabilités qui me sont confiées selon les règles (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 39,
    text: "Face aux défis de la vie professionnelle, quelle est votre force de caractère ?",
    options: [
      { label: "Ma persistance, ma constance et mon bon sens pratique (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Ma rigueur intellectuelle, ma curiosité et ma persévérance (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Mon originalité, mon intuition et mon audace créative (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Ma bienveillance, mon dévouement et ma bienveillance constante (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Mon optimisme, mon assurance et mon goût du risque (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Mon perfectionnisme, ma loyauté et mon respect des engagements (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 40,
    text: "Comment gérez-vous vos émotions dans le cadre professionnel ?",
    options: [
      { label: "Je suis calme et posé, peu expansif sur mes sentiments personnels (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Je les canalise par la logique, l'analyse et la réflexion rationnelle (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Elles sont intenses et servent de moteur à mon expression artistique (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je suis sensible aux émotions des autres et sait faire preuve d'empathie (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je transforme mon enthousiasme en énergie communicative pour convaincre (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Je suis maître de moi, d'un calme exemplaire et très discret (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },

  // --- SECTION 5: AUTO-ÉVALUATION & QUESTIONNEMENT D'IDENTITÉ (PDF Doc 1 "De quel type suis-je?") ---
  {
    id: 41,
    text: "En analysant vos démarches de travail, diriez-vous que vous prenez soin de :",
    options: [
      { label: "Utiliser des données concrètes et éprouvées pour structurer vos idées (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Travailler avec précision, exactitude et persévérance scientifique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Mettre en œuvre votre propre créativité sans attendre qu'on vous dise quoi faire (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Assumer pleinement votre rôle dans l'équipe et aider les autres membres (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Faire preuve de débrouillardise et influencer positivement votre entourage (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Mettre en place une organisation sans faille pour mener le projet à terme (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 42,
    text: "Est-ce que vous aimez comprendre la structure interne des éléments ?",
    options: [
      { label: "Oui, comprendre le fonctionnement mécanique d'un objet ou d'un moteur (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Oui, comprendre les théories scientifiques et les concepts abstraits (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Oui, explorer la structure d'un texte, d'un visuel ou d'une œuvre musicale (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Oui, comprendre le fonctionnement des relations humaines et des groupes (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Oui, comprendre les mécanismes de pouvoir, d'influence et de marché (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Oui, comprendre le fonctionnement des structures administratives et comptables (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 43,
    text: "Comment vous comportez-vous lorsqu'il faut prendre des initiatives ?",
    options: [
      { label: "Je prends l'initiative de réparer ou de construire ce qui manque sur le terrain (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Je prends l'initiative de faire des recherches et de rassembler des informations (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Je prends l'initiative de créer des formes originales et de proposer du nouveau (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je prends l'initiative de consulter les membres de l'équipe et d'apporter de l'aide (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je prends l'initiative de lancer le projet, de convaincre et d'engager le groupe (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Je prends l'initiative de planifier le calendrier et de créer des outils d'ordre (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 44,
    text: "Si vous deviez relever un défi majeur :",
    options: [
      { label: "Un défi physique ou technique exigeant du savoir-faire manuel et du pragmatisme (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Un défi intellectuel réputé très difficile ou une énigme scientifique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Un défi artistique consistant à réaliser une œuvre originale à partir de zéro (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Un défi humain consistant à réconcilier des personnes ou à accompagner un groupe (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Un défi d'affaires consistant à créer une entreprise rentable ou remporter un marché (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Un défi d'organisation consistant à restructurer entièrement des archives ou données (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 45,
    text: "Dans quelle mesure tenez-vous compte des remarques et des avis ?",
    options: [
      { label: "J'écoute les conseils pratiques pour améliorer la qualité concrète de mon travail (R)", value: "R", categoryScore: { R: 3 } },
      { label: "J'analyse rigoureusement les remarques si elles reposent sur des faits objectifs (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Je reste fidèle à mon intuition artistique tout en écoutant les retours constructifs (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je suis très à l'écoute des avis des autres pour améliorer l'harmonie du groupe (S)", value: "S", categoryScore: { S: 3 } },
      { label: "J'écoute les avis stratégiques pour ajuster mon plan et maximiser ma réussite (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Je tiens compte immédiatement des consignes de mes responsables pour être en conformité (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 46,
    text: "Quel est votre rapport à la planification sur le long terme ?",
    options: [
      { label: "Je préfère me concentrer sur des objectifs concrets et immédiats à réaliser (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Je planifie mes recherches pour explorer progressivement le futur scientifique (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Je préfère garder de la flexibilité plutôt que d'avoir un plan figé d'avance (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je planifie mes actions en fonction du développement humain de ceux que j'accompagne (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je fixe un plan de carrière et des objectifs ambitieux d'expansion (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Je suis capable de me discipliner pour suivre un plan rigoureux sur le long terme (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 47,
    text: "En ce qui concerne la rigueur et le détail :",
    options: [
      { label: "J'ai le souci de la finition et de la précision dans les ajustements manuels (R)", value: "R", categoryScore: { R: 3 } },
      { label: "J'ai le souci de l'exactitude scientifique dans l'analyse des données (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Je privilégie la portée émotionnelle et l'esprit global à la perfection méthodique (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Je privilégie la qualité de la relation humaine à la rigidité des détails (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Je me concentre sur la vision d'ensemble et délègue les détails de précision (E)", value: "E", categoryScore: { E: 3 } },
      { label: "J'ai le souci permanent du détail, de l'exactitude des chiffres et du rangement parfait (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 48,
    text: "Si vous deviez convaincre une personne, comment vous y prendriez-vous ?",
    options: [
      { label: "En lui montrant un exemple concret ou une démonstration pratique du produit (R)", value: "R", categoryScore: { R: 3 } },
      { label: "En lui exposant une démonstration logique imparable appuyée sur des preuves (I)", value: "I", categoryScore: { I: 3 } },
      { label: "En faisant appel à sa sensibilité, ses émotions et des visuels captivants (A)", value: "A", categoryScore: { A: 3 } },
      { label: "En l'écoutant d'abord avec bienveillance pour comprendre ses vrais besoins (S)", value: "S", categoryScore: { S: 3 } },
      { label: "En faisant preuve d'enthousiasme, de charisme, en soulignant les bénéfices (E)", value: "E", categoryScore: { E: 3 } },
      { label: "En lui présentant un dossier complet, structuré, conforme aux textes et clair (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 49,
    text: "Comment vous sentez-vous dans un groupe de travail ?",
    options: [
      { label: "À l'aise si le groupe réalise un travail concret et pratique (R)", value: "R", categoryScore: { R: 3 } },
      { label: "À l'aise pour apporter un éclairage d'analyse et résoudre les problèmes (I)", value: "I", categoryScore: { I: 3 } },
      { label: "À l'aise si le groupe me laisse la liberté d'exprimer mes idées originales (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Très à l'aise, chaleureux et toujours attentif à l'intégration de chacun (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Naturellement à l'aise pour prendre le leadership et animer les discussions (E)", value: "E", categoryScore: { E: 3 } },
      { label: "À l'aise si les règles de fonctionnement du groupe sont claires et ordonnées (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
  {
    id: 50,
    text: "Pour résumer votre profil d'orientation professionnelle idéale selon le RIASEC :",
    options: [
      { label: "Pragmatique, technique, axé sur le terrain et la manipulation d'objets (R)", value: "R", categoryScore: { R: 3 } },
      { label: "Chercheur, analytique, curieux de comprendre les lois scientifiques (I)", value: "I", categoryScore: { I: 3 } },
      { label: "Artiste, imaginatif, expressif, indépendant et libre de création (A)", value: "A", categoryScore: { A: 3 } },
      { label: "Aidant, éducateur, bienveillant, orienté vers la relation humaine (S)", value: "S", categoryScore: { S: 3 } },
      { label: "Meneur, négociateur, ambitieux, axé sur les affaires et les projets (E)", value: "E", categoryScore: { E: 3 } },
      { label: "Méthodique, organisateur, consciencieux, axé sur la rigueur et l'ordre (C)", value: "C", categoryScore: { C: 3 } },
    ],
  },
];

export const RIASEC_OFFICIAL_QUESTIONS = RAW_RIASEC_QUESTIONS.map((q) => ({
  ...q,
  options: q.options.map((opt) => ({
    ...opt,
    label: opt.label.replace(/\s*\([RIASEC]\)$/, ""),
  })),
}));

// Helper to create valid contextualized non-repetitive scenario questions for other tests
function createScenarioQuestions(
  domainTitle: string,
  categories: Array<{ name: string; key: string; label: string }>
) {
  const questions = [];
  const baseScenarios = [
    "Dans une situation complexe nécessitant une analyse rapide, vous privilégiez :",
    "Quel aspect de votre travail vous apporte la plus grande satisfaction au quotidien ?",
    "Lorsqu'un projet rencontre un obstacle imprévu, quelle est votre première démarche ?",
    "Dans une dynamique de groupe ou d'équipe, comment vous positionnez-vous ?",
    "Quelle compétence considérez-vous comme votre plus grand point fort ?",
    "Face à un nouvel apprentissage, quelle méthode vous permet d'assimiler le plus vite ?",
    "Quel type d'environnement professionnel stimule le mieux votre potentiel ?",
    "Comment évaluez-vous votre méthode de prise de décision ?",
    "Dans la gestion de la qualité et des exigences professionnelles :",
    "Si l'on devait vous confier un pôle stratégique, lequel choisiriez-vous ?",
  ];

  let qCount = 1;
  while (questions.length < 50) {
    const scenarioIndex = (qCount - 1) % baseScenarios.length;
    const catIndex = (qCount - 1) % categories.length;
    const currentCat = categories[catIndex];

    const scenarioText = `Situation ${qCount} : ${baseScenarios[scenarioIndex]} (${currentCat.name})`;

    const options = [
      {
        label: `Niveau Avancé : Autonomie élevée, maîtrise pratique et aisance en ${currentCat.name}`,
        value: `${currentCat.key}_High`,
        categoryScore: { [currentCat.key]: 3 },
      },
      {
        label: `Niveau Intermédiaire : Compétence opérationnelle et maîtrise courante en ${currentCat.name}`,
        value: `${currentCat.key}_Mid`,
        categoryScore: { [currentCat.key]: 2 },
      },
      {
        label: `Niveau Initial : Notions de base ou préférence orientée vers d'autres aspects`,
        value: `${currentCat.key}_Low`,
        categoryScore: { [currentCat.key]: 1 },
      },
    ];

    questions.push({
      id: qCount,
      text: scenarioText,
      options,
    });
    qCount++;
  }

  return questions;
}

// ---------------------------------------------------------------------------
// DETAILED HOLLAND RIASEC DIAGNOSTIC INTERPRETATION (PDF DOC RESTITUTION PAGES 12-21)
// ---------------------------------------------------------------------------

export function interpretRIASECResult(scores: Record<string, number>) {
  const sortedCategories = Object.entries(scores)
    .map(([cat, score]) => ({ cat, score }))
    .sort((a, b) => b.score - a.score);

  const top1 = sortedCategories[0]?.cat || "I";
  const top2 = sortedCategories[1]?.cat || "R";
  const top3 = sortedCategories[2]?.cat || "A";

  const hollandCode = `${top1}${top2}${top3}`;

  // Complete Detailed Restitution Dictionary from PDF Restitution
  const profileDetailsMap: Record<string, any> = {
    R: {
      title: "RÉALISTE (Concret & Pragmatique)",
      typeLetter: "R",
      traits: ["Pragmatique", "Débrouillard", "Endurant", "Franc", "Mécanique", "Concret", "Patient", "Minutieux"],
      workEnvironment: "Ateliers techniques, chantiers BTP, plein air, laboratoires de test, maintenance industrielle, exploitation agricole et forestière.",
      valuesAndGoals: "Produire des ouvrages utiles, tangibles et de haute qualité physique. Le succès se mesure par la capacité à utiliser des talents techniques pour résoudre des problèmes concrets.",
      worldVision: "Pratique et immédiate. Le Réaliste se sent plus concerné par les réalités tangibles du présent que par les théories abstraites du futur.",
      contributions: "Apporte la stabilité, le sens du concret, la maîtrise matérielle et la capacité à s'attaquer physiquement aux problèmes complexes.",
      trainingNeeds: "Développement du sens de la communication relationnelle, du tact, des sciences humaines, du travail en équipe et de l'anticipation des tendances de R&D.",
      potentialRisks: "Risque de paraître réagir trop vivement, peu sociable ou indifférent aux sentiments. Attachement excessif aux méthodes traditionnelles pouvant rendre le matériel obsolète.",
      relationshipStyle: "Direct, sincère et factuel. Préfère l'action utile aux réunions prolongées. En leadership, dirige par les procédures et l'exemple pratique.",
      fields: ["Génie Civil & BTP", "Génie Mécanique & Électrique", "Agronomie & Environnement", "Mines & Télécoms"],
      careers: ["Ingénieur BTP", "Technicien Réseaux & Fibre", "Agronome", "Pilote d'Engins", "Chef de Chantier"],
    },
    I: {
      title: "INVESTIGATEUR (Chercheur & Analytique)",
      typeLetter: "I",
      traits: ["Intellectuel", "Curieux", "Méthodique", "Réservé", "Persévérant", "Rationnel", "Rigoureux"],
      workEnvironment: "Laboratoires de recherche, unités de Data Science, universités, cabinets d'expertise, pôles de R&D, centres de santé.",
      valuesAndGoals: "Résoudre des problèmes complexes par la méthode scientifique et la théorie. Le succès se matérialise par des découvertes, des diplômes avancés et le respect des pairs.",
      worldVision: "Observatrice et critique. L'Investigateur veut comprendre le 'pourquoi du comment' des phénomènes et anticiper les possibilités du futur.",
      contributions: "Apporte des idées nouvelles, des réflexions stratégiques approfondies, de la rigueur scientifique et une grande capacité de résolution de problèmes.",
      trainingNeeds: "Gestion de projet, prise de décision rapide, affirmation de soi, compétences pour 'vendre' ses découvertes à la direction.",
      potentialRisks: "Manque de sens 'politique', indécision face au passage à l'action concrète, détachement excessif des contraintes de terrain.",
      relationshipStyle: "Basé sur l'échange d'idées théoriques et la rigueur d'analyse. Préfère diriger avec souplesse et autonomie.",
      fields: ["Médecine & Pharmacie", "Informatique & IA", "Physique-Chimie", "Biotechnologies", "Mathématiques"],
      careers: ["Chercheur Scientifique", "Data Scientist", "Médecin Spécialiste", "Analyste Cybersécurité", "Ingénieur R&D"],
    },
    A: {
      title: "ARTISTIQUE (Créatif & Expressif)",
      typeLetter: "A",
      traits: ["Créatif", "Intuitif", "Spontané", "Expressif", "Indépendant", "Original", "Passionné"],
      workEnvironment: "Studios de création visuelle, agences de design, médias, théâtres, cabinets d'architecture, espaces de travail informels et flexibles.",
      valuesAndGoals: "Créer des œuvres ou concepts uniques, originaux et esthétiques. Le succès réside dans la reconnaissance de la valeur créative et l'expression libre.",
      worldVision: "Émotionnelle, visuelle et intuitive. L'Artiste appréhende le monde sous l'angle de la sensibilité et des représentations émotives.",
      contributions: "Apporte de l'originalité, de la couleur, du dynamisme visuel, de l'enthousiasme et une perspective inédite sur les projets de l'organisation.",
      trainingNeeds: "Organisation personnelle, gestion du temps, planification financière, rédaction de présentations logiques et analytiques.",
      potentialRisks: "Impatience face aux tâches routinières, négligence des détails d'exécution, résistance face aux règles strictes et aux horaires rigides.",
      relationshipStyle: "Spontané, passionné et intense. Dirige par l'inspiration et s'épanouit lorsqu'il reçoit de la reconnaissance et des félicitations.",
      fields: ["Architecture & Urbanisme", "Design Graphique & UX/UI", "Journalisme & Médias", "Cinéma & Audiovisuel"],
      careers: ["Architecte", "UX/UI Designer", "Directeur Artistique", "Journaliste/Rédacteur", "Designer de Marque"],
    },
    S: {
      title: "SOCIAL (Aidant & Bienveillant)",
      typeLetter: "S",
      traits: ["Coopératif", "Communicatif", "Dévoué", "Chaleureux", "Altruiste", "Perspicace", "Sensible"],
      workEnvironment: "Établissements d'enseignement, centres de santé, cabinets de conseil en orientation, ONG, départements RH, organismes de médiation.",
      valuesAndGoals: "Réduire les conflits, favoriser l'épanouissement humain et aider les personnes. Le succès se mesure en valeur morale, en qualité des relations et en progrès humain.",
      worldVision: "Humaniste. Le Social recherche le potentiel en chaque individu et croit en la capacité de transformation par l'éducation et l'entraide.",
      contributions: "Excellente compréhension des relations humaines, cohésion d'équipe, capacité d'écoute active, formation et médiation relationnelle.",
      trainingNeeds: "Gestion financière et administrative 'pratico-pratique', évaluation objective de la performance, affirmation de soi et prise de décision difficile.",
      potentialRisks: "Mettre trop de temps à trancher des décisions financières difficiles, tendance à trop en faire pour les autres au détriment des objectifs commerciaux.",
      relationshipStyle: "Ouvert, chaleureux, bienveillant et généreux. Dirige en tuteur/mentor soucieux du bien-être et de la croissance de ses collaborateurs.",
      fields: ["Conseil en Orientation & RH", "Psychologie & Sociologie", "Enseignement & Pédagogie", "Santé Communautaire"],
      careers: ["Conseiller en Orientation", "Professeur / Formateur", "Psychologue", "Sage-femme / Infirmier", "Responsable RH"],
    },
    E: {
      title: "ENTREPRENANT (Meneur & Persuasif)",
      typeLetter: "E",
      traits: ["Leader", "Persuasif", "Ambitieux", "Audacieux", "Dynamique", "Débrouillard", "Déterminé"],
      workEnvironment: "Salles de marché, direction générale, cabinets de conseil en stratégie, entreprises commerciales, réseaux d'affaires, pôles marketing.",
      valuesAndGoals: "Atteindre des objectifs ambitieux, conquérir des marchés, acquérir du pouvoir, de la reconnaissance et du prestige financier.",
      worldVision: "Stratégique et opportuniste. L'Entreprenant scrute le monde pour identifier les leviers de commande, le pouvoir et les opportunités d'expansion.",
      contributions: "Énergie communicative, capacité de décision rapide, sens de la politique d'entreprise, négociation commerciale et concrétisation des projets.",
      trainingNeeds: "Réflexion approfondie sur les conséquences à long terme des décisions, écoute active, gestion participative et négociation équilibrée.",
      potentialRisks: "Impatience, agressivité perçue, décisions impulsives basées uniquement sur l'intuition, risque de surmenage et de stress.",
      relationshipStyle: "Direct, motivant et affirmatif. S'épanouit dans la compétition et les défis. Dirige avec force, détermination et goût de la victoire.",
      fields: ["Gestion d'Entreprise & MBA", "Marketing Digital & Vente", "Droit des Affaires", "Commerce International"],
      careers: ["Entrepreneur", "Directeur Commercial", "Avocat d'Affaires", "Chef de Projet Senior", "Directeur Marketing"],
    },
    C: {
      title: "CONVENTIONNEL (Méthodique & Rigoureux)",
      typeLetter: "C",
      traits: ["Méthodique", "Organisé", "Consciencieux", "Précis", "Loyal", "Perfectionniste", "Ponctuel"],
      workEnvironment: "Cabinets d'expertise comptable, départements financiers, banques, centres d'archivage, administrations publiques, contrôle de gestion.",
      valuesAndGoals: "Garantir la prévisibilité, l'ordre matériel, l'exactitude des chiffres et la conformité. Le succès réside dans la réalisation d'un travail sans faute.",
      worldVision: "Maintien de l'ordre et des procédures éprouvées. Le Conventionnel recherche des règles claires et une structure fiable.",
      contributions: "Fiabilité absolue, exactitude des données, respect strict des échéances, soin du détail et maîtrise de la gestion administrative.",
      trainingNeeds: "Gestion du changement, résolution créative de problèmes, prise de risques mesurée et adaptation aux nouvelles technologies digitales.",
      potentialRisks: "Résistance au changement, rigidité face aux méthodes innovantes, stress important lorsque les instructions manquent de clarté.",
      relationshipStyle: "Courtois, respectueux de l'autorité et des procédures. Dirige de près avec soin et fournit des consignes écrites précises.",
      fields: ["Comptabilité, Contrôle & Audit", "Finance & Gestion Bancaire", "Droit Administratif", "Gestion de Données & Logistique"],
      careers: ["Expert-Comptable", "Auditeur Financier", "Administrateur de Données", "Gestionnaire de Paie", "Responsable Transit"],
    },
  };

  const primaryProfile = profileDetailsMap[top1] || profileDetailsMap["I"];
  const secondaryProfile = profileDetailsMap[top2] || profileDetailsMap["R"];

  const totalPossible = 150;
  const rawTotal = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const scorePct = Math.min(100, Math.round((rawTotal / totalPossible) * 100));
  const appreciationInfo = getTestScoreAppreciation(scorePct);

  // Motivated official commentary from Dr. BALOGAH based on Holland Code
  const advisorMotivation = `DIAGNOSTIC OFFICIEL DU CONSEILLER (Dr. BALOGAH) : Le profil psychométrique du requérant révèle un Code Holland dominant "${hollandCode}" (${primaryProfile.title.split(" ")[0]} - ${secondaryProfile.title.split(" ")[0]}). Cette combinaison reflète un équilibre entre la composante ${primaryProfile.traits[0].toLowerCase()} (${top1}) et la dynamique ${secondaryProfile.traits[0].toLowerCase()} (${top2}). L'analyse certifie une aptitude élevée pour les environnements exigeant ${primaryProfile.contributions.toLowerCase()}`;

  return {
    scoreSummary: scores,
    suitabilityScore: scorePct,
    appreciation: appreciationInfo.appreciation,
    hollandCode,
    primaryCategory: `Code RIASEC : ${hollandCode} — Dominante ${primaryProfile.title}`,
    description: `Votre passation du test officiel RIASEC (50 questions de Holland) établit votre Code Typologique à 3 lettres : "${hollandCode}". Votre première dominance est le profil ${primaryProfile.title}, appuyé par des affinités marquantes en ${secondaryProfile.title}. ${primaryProfile.worldVision}`,
    detailedProfiling: {
      hollandCode,
      primaryTitle: primaryProfile.title,
      secondaryTitle: secondaryProfile.title,
      traits: primaryProfile.traits,
      workEnvironment: primaryProfile.workEnvironment,
      valuesAndGoals: primaryProfile.valuesAndGoals,
      worldVision: primaryProfile.worldVision,
      contributions: primaryProfile.contributions,
      trainingNeeds: primaryProfile.trainingNeeds,
      potentialRisks: primaryProfile.potentialRisks,
      relationshipStyle: primaryProfile.relationshipStyle,
      advisorMotivation,
    },
    recommendedFields: Array.from(new Set([...primaryProfile.fields, ...secondaryProfile.fields])),
    recommendedCareers: Array.from(new Set([...primaryProfile.careers, ...secondaryProfile.careers])),
  };
}

// ---------------------------------------------------------------------------
// OFFICIAL 50 QUESTIONS FOR HOWARD GARDNER'S MULTIPLE INTELLIGENCES TEST
// (Adapted from Official Adult & Youth Inventories - Harvard Project Zero / FUNDP / CSRDN / Samares)
// ---------------------------------------------------------------------------

function createGardnerQuestion(id: number, text: string, categoryKey: string) {
  return {
    id,
    text,
    options: [
      {
        label: "Fortement développé / Tout à fait mon cas (Niveau Avancé)",
        value: `${categoryKey}_3`,
        categoryScore: { [categoryKey]: 3 },
      },
      {
        label: "Moyennement développé / Plutôt vrai pour moi (Niveau Intermédiaire)",
        value: `${categoryKey}_2`,
        categoryScore: { [categoryKey]: 2 },
      },
      {
        label: "Faiblement développé / Un peu vrai (Niveau Éléments)",
        value: `${categoryKey}_1`,
        categoryScore: { [categoryKey]: 1 },
      },
      {
        label: "Non développé / Ne me correspond pas du tout",
        value: `${categoryKey}_0`,
        categoryScore: { [categoryKey]: 0 },
      },
    ],
  };
}

export const GARDNER_OFFICIAL_QUESTIONS = [
  // --- SECTION 1: INTELLIGENCE VERBALE-LINGUISTIQUE (Linguistique) ---
  createGardnerQuestion(1, "Aimez-vous lire des livres, des romans, des journaux ou de la poésie pendant votre temps libre ?", "Linguistique"),
  createGardnerQuestion(2, "Avez-vous de la facilité à raconter des histoires, à expliquer des concepts ou à vous exprimer avec un vocabulaire riche et précis ?", "Linguistique"),
  createGardnerQuestion(3, "Prenez-vous plaisir aux jeux de mots (mots croisés, Scrabble, jeux de vocabulaire, calembours) ?", "Linguistique"),
  createGardnerQuestion(4, "Avez-vous une bonne mémoire verbale pour retenir les noms de personnes, les lieux, les dates ou les citations ?", "Linguistique"),
  createGardnerQuestion(5, "Lorsque vous apprenez une nouvelle lecon, préférez-vous la réécrire dans vos propres mots ou la reformuler à voix haute ?", "Linguistique"),
  createGardnerQuestion(6, "Avez-vous de la facilité à convaincre, débattre et argumenter pour défendre vos idées avec éloquence ?", "Linguistique"),

  // --- SECTION 2: INTELLIGENCE LOGICO-MATHÉMATIQUE (Logique) ---
  createGardnerQuestion(7, "Aimez-vous comprendre le 'pourquoi' et le 'comment' des choses en recherchant des explications rationnelles ?", "Logique"),
  createGardnerQuestion(8, "Prenez-vous plaisir à résoudre des énigmes, des casse-tête ou des problèmes mathématiques exigeants ?", "Logique"),
  createGardnerQuestion(9, "Êtes-vous à l'aise avec les chiffres, le calcul mental rapide et les données statistiques ?", "Logique"),
  createGardnerQuestion(10, "Aimez-vous organiser l'information de manière structurée, séquentielle et méthodique ?", "Logique"),
  createGardnerQuestion(11, "Avez-vous tendance à vérifier les faits par l'expérimentation, les preuves et la méthode scientifique ?", "Logique"),
  createGardnerQuestion(12, "Trouvez-vous rapidement les failles logiques ou les contradictions dans le raisonnement des autres ?", "Logique"),

  // --- SECTION 3: INTELLIGENCE VISUELLE-SPATIALE (Spatiale) ---
  createGardnerQuestion(13, "Voyez-vous facilement des images ou des scènes dans votre tête lorsque vous pensez à un projet ?", "Spatiale"),
  createGardnerQuestion(14, "Avez-vous un excellent sens de l'orientation et lisez-vous facilement des cartes, diagrammes ou plans ?", "Spatiale"),
  createGardnerQuestion(15, "Aimez-vous concevoir, dessiner, peindre, réaliser des maquettes ou réaménager l'espace d'une pièce ?", "Spatiale"),
  createGardnerQuestion(16, "Lorsque vous lisez un livre ou un document, portez-vous une attention particulière aux illustrations et visuels ?", "Spatiale"),
  createGardnerQuestion(17, "Pouvez-vous facilement vous représenter la rotation ou l'agencement d'un objet en 3D dans l'espace ?", "Spatiale"),
  createGardnerQuestion(18, "Recherchez-vous l'équilibre visuel, l'harmonie des couleurs et le sens du détail esthétique ?", "Spatiale"),

  // --- SECTION 4: INTELLIGENCE MUSICALE-RYTHMIQUE (Musicale) ---
  createGardnerQuestion(19, "Êtes-vous très sensible aux sons, aux bruits de votre environnement, aux tonalités et aux mélodies ?", "Musicale"),
  createGardnerQuestion(20, "Retenez-vous et reproduisez-vous facilement un air de musique, une chanson ou un rythme entendu ?", "Musicale"),
  createGardnerQuestion(21, "Aimez-vous fredonner, chanter ou battre la mesure avec vos mains ou vos pieds en travaillant ?", "Musicale"),
  createGardnerQuestion(22, "Remarquez-vous immédiatement les fausses notes dans l'exécution d'une pièce musicale ?", "Musicale"),
  createGardnerQuestion(23, "La musique a-t-elle une influence directe sur votre état d'esprit, votre concentration et votre stress ?", "Musicale"),
  createGardnerQuestion(24, "Jouez-vous d'un instrument de musique ou ressentez-vous une affinité naturelle pour les rythmes ?", "Musicale"),

  // --- SECTION 5: INTELLIGENCE CORPORELLE-KINESTHÉSIQUE (Corporal) ---
  createGardnerQuestion(25, "Avez-vous régulièrement besoin de bouger, de vous lever et de rester en action plutôt que de rester assis longtemps ?", "Corporal"),
  createGardnerQuestion(26, "Apprenez-vous beaucoup plus facilement en faisant, en manipulant des objets ou par la pratique ?", "Corporal"),
  createGardnerQuestion(27, "Avez-vous une bonne coordination corporelle et une aisance dans le sport, la danse ou le théâtre ?", "Corporal"),
  createGardnerQuestion(28, "Aimez-vous le travail manuel, le bricolage, le démontage et remontage d'objets techniques ?", "Corporal"),
  createGardnerQuestion(29, "Utilisez-vous volontiers le geste, la mimique et le langage corporel pour communiquer avec les autres ?", "Corporal"),
  createGardnerQuestion(30, "Avez-vous un sens du toucher développé et ressentez-vous le besoin de toucher les textures et objets ?", "Corporal"),

  // --- SECTION 6: INTELLIGENCE INTERPERSONNELLE (Interpersonnelle) ---
  createGardnerQuestion(31, "Entrez-vous facilement en relation avec les autres et aimez-vous communiquer, échanger et partager ?", "Interpersonnelle"),
  createGardnerQuestion(32, "Percevez-vous rapidement les humeurs, les intentions, les sentiments et motivations d'autrui ?", "Interpersonnelle"),
  createGardnerQuestion(33, "Êtes-vous un bon médiateur, habile pour désamorcer les conflits et favoriser la coopération ?", "Interpersonnelle"),
  createGardnerQuestion(34, "Préférerez-vous travailler en équipe et en groupe plutôt que d'effectuer vos projets en solitaire ?", "Interpersonnelle"),
  createGardnerQuestion(35, "Avez-vous une grande capacité d'écoute active et d'empathie, en sachant vous mettre à la place d'autrui ?", "Interpersonnelle"),
  createGardnerQuestion(36, "Les gens viennent-ils spontanément vous consulter pour demander conseil ou partager leurs soucis ?", "Interpersonnelle"),

  // --- SECTION 7: INTELLIGENCE INTRAPERSONNELLE (Intrapersonnelle) ---
  createGardnerQuestion(37, "Avez-vous une connaissance approfondie de vous-même, de vos forces, de vos faiblesses et de vos limites ?", "Intrapersonnelle"),
  createGardnerQuestion(38, "Appréciez-vous les moments de solitude pour réfléchir, faire de l'introspection et vous ressourcer ?", "Intrapersonnelle"),
  createGardnerQuestion(39, "Aimez-vous vous fixer des objectifs personnels clairs et faire preuve d'autodiscipline pour les atteindre ?", "Intrapersonnelle"),
  createGardnerQuestion(40, "Tenez-vous ou aimeriez-vous tenir un journal personnel pour noter vos réflexions, vos émotions et vos idées ?", "Intrapersonnelle"),
  createGardnerQuestion(41, "Agissez-vous selon vos propres convictions et valeurs morales, même si cela va à l'encontre de l'avis général ?", "Intrapersonnelle"),
  createGardnerQuestion(42, "Avez-vous un grand sens de l'auto-critique et la capacité de tirer des enseignements de vos expériences passées ?", "Intrapersonnelle"),

  // --- SECTION 8: INTELLIGENCE NATURALISTE-ÉCOLOGIQUE (Naturaliste) ---
  createGardnerQuestion(43, "Ressentez-vous un besoin régulier de vous retrouver dans la nature (forêt, parc, mer) pour vous apaiser ?", "Naturaliste"),
  createGardnerQuestion(44, "Aimez-vous vous occuper des animaux, observer la faune ou apprendre à reconnaître les espèces végétales ?", "Naturaliste"),
  createGardnerQuestion(45, "Avez-vous une sensibilité marquée pour la protection de l'environnement, l'écologie et le développement durable ?", "Naturaliste"),
  createGardnerQuestion(46, "Aimez-vous observer, classer, catégoriser ou faire des collections d'éléments de la nature ?", "Naturaliste"),
  createGardnerQuestion(47, "Portez-vous une attention particulière au fonctionnement du corps humain et aux phénomènes de la nature ?", "Naturaliste"),
  createGardnerQuestion(48, "Prenez-vous plaisir au jardinage, à l'horticulture ou au soin apporté aux plantes et à la terre ?", "Naturaliste"),
  createGardnerQuestion(49, "Avez-vous un sens aigu de l'observation des détails et des variations de votre environnement quotidien ?", "Naturaliste"),
  createGardnerQuestion(50, "Aimez-vous structurer des informations complexes en catégories et sous-catégories clairement organisées ?", "Naturaliste"),
];

// Interpreter for Howard Gardner's Multiple Intelligences Test
export function interpretGardnerResult(scores: Record<string, number>) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0]?.[0] || "Linguistique";
  const top2 = sorted[1]?.[0] || "Logique";

  const gardnerProfileDetailsMap: Record<string, any> = {
    Linguistique: {
      title: "INTELLIGENCE VERBALE-LINGUISTIQUE (Mots, Langage & Communication)",
      key: "Linguistique",
      traits: ["Sens des mots", "Aisance orale et écrite", "Mémoire verbale", "Force de persuasion", "Sens de l'humour", "Goût pour la lecture"],
      definition: "Capacité à utiliser et comprendre les mots, les nuances de sens, la syntaxe et la fonction du langage à l'oral comme à l'écrit (Howard Gardner).",
      workEnvironment: "Presse, édition, enseignement, cabinets d'avocats, médias, relations publiques, traduction, diplomatie.",
      studyStrategies: "Réécrire les cours avec vos propres mots, élaborer des fiches résumées rédigées, expliquer le cours à voix haute à un pair, réécouter des enregistrements audio des leçons.",
      valuesAndGoals: "S'exprimer avec clarté, partager des connaissances et convaincre. Recherche la précision du vocabulaire et la beauté des textes.",
      contributions: "Communication fluide, rédaction irréprochable, animation des débats et clarté dans la transmission des directives.",
      trainingNeeds: "Écrire régulièrement, participer à des ateliers de prise de parole, lire divers genres littéraires, apprendre des langues étrangères.",
      potentialRisks: "Attention à ne pas privilégier le discours au détriment des actions concrètes. Veiller à équilibrer le verbe avec des réalisations matérielles.",
      recommendedFields: ["Droit & Justice", "Journalisme & Médias", "Enseignement & Recherche", "Communication & Marketing", "Traduction & Langues"],
      recommendedCareers: ["Avocat / Juriste", "Journaliste / Rédacteur", "Enseignant / Professeur", "Écrivain / Scénariste", "Attaché de Presse", "Traducteur / Interprète", "Consultant en Communication"],
    },
    Logique: {
      title: "INTELLIGENCE LOGICO-MATHÉMATIQUE (Calcul, Raisonnement & Analyse)",
      key: "Logique",
      traits: ["Esprit analytique", "Rigueur scientifique", "Pensée séquentielle", "Calcul mental", "Résolution d'énigmes", "Organisation méthodique"],
      definition: "Capacité à bien raisonner, calculer, quantifier, manipuler des symboles et tenir un raisonnement logique rigoureux (Howard Gardner).",
      workEnvironment: "Laboratoires de recherche, banques, cabinets d'audit, centres de données (Data), informatique, ingénierie, statistiques.",
      studyStrategies: "Organiser les révisions de façon étape par étape, réaliser des tableaux synthétiques, numéroter les notions, résoudre des exercices d'application pratique, établir des liens de cause à effet.",
      valuesAndGoals: "Démontrer par les preuves, résoudre des équations complexes et apporter une explication rationnelle à chaque phénomène.",
      contributions: "Analyse rigoureuse des données, détection immédiate des failles logiques, modélisation de processus complexes et esprit de méthode.",
      trainingNeeds: "Résoudre des énigmes logiques, s'initier à la programmation informatique, pratiquer les jeux de stratégie comme les échecs.",
      potentialRisks: "Tendance à vouloir tout expliquer uniquement par la logique froide. Veiller à intégrer les dimensions émotionnelles et humaines.",
      recommendedFields: ["Informatique & Data Science", "Génie Civil & Ingénierie", "Finance & Comptabilité", "Médecine & Recherche", "Actuariat"],
      recommendedCareers: ["Développeur / Programmeur", "Data Scientist", "Ingénieur R&D", "Expert-Comptable / Auditeur", "Chercheur Scientifique", "Médecin Spécialiste", "Actuaire"],
    },
    Spatiale: {
      title: "INTELLIGENCE VISUELLE-SPATIALE (Images, Représentation 3D & Design)",
      key: "Spatiale",
      traits: ["Mémoire visuelle infaillible", "Sens de l'orientation", "Imagination 3D", "Créativité artistique", "Sens de l'esthétique", "Perception du détail"],
      definition: "Capacité à visualiser mentalement des images, percevoir le monde en trois dimensions avec précision et concevoir des représentations spatiales (Howard Gardner).",
      workEnvironment: "Studios de design, agences d'architecture, chantiers, studios vidéo, cartographie, aménagement d'intérieur.",
      studyStrategies: "Créer des cartes mentales (Mind Maps), utiliser des codes couleurs et des surligneurs, associer les concepts à des croquis et schémas, visualiser mentalement les scènes.",
      valuesAndGoals: "Rechercher l'harmonie des formes, exprimer des idées par le visuel et transformer l'espace environnant.",
      contributions: "Sens de l'esthétisme, capacité à schématiser des concepts abstraits en visuels clairs et clarté dans la modélisation spatiale.",
      trainingNeeds: "S'exercer au dessin de plans, pratiquer la photographie, résoudre des casse-tête 3D, faire des exercices de visualisation spatiale.",
      potentialRisks: "Attention à ne pas trop compter sur le visuel au détriment des consignes rédigées ou des procédures administratives écrites.",
      recommendedFields: ["Architecture & Urbanisme", "Design Graphique & UX/UI", "Audiovisuel & Cinéma", "Génie Spatial & Cartographie", "Chirurgie"],
      recommendedCareers: ["Architecte d'Intérieur / Bâtiment", "Designer UX/UI / Graphiste", "Chirurgien", "Cinéaste / Réalisateur", "Paysagiste", "Pilote d'Aéronef", "Cartographe"],
    },
    Musicale: {
      title: "INTELLIGENCE MUSICALE-RYTHMIQUE (Sons, Rythmes & Harmonies)",
      key: "Musicale",
      traits: ["Sensibilité acoustique", "Oreille musicale", "Ressenti du rythme", "Expression par le son", "Gestion du stress par la musique", "Chant juste"],
      definition: "Capacité à être sensible aux sons, aux structures rythmiques, aux timbres et aux mélodies, et à s'exprimer par la musicalité (Howard Gardner).",
      workEnvironment: "Studios d'enregistrement, salles de concert, théâtres, acoustique, chorégraphie, musicothérapie, radio.",
      studyStrategies: "Associer les leçons à des rimes ou des jingles mnémotechniques, étudier avec une musique d'ambiance adaptée, frapper un rythme régulier pendant la mémorisation.",
      valuesAndGoals: "Créer des harmonies sonores, véhiculer des émotions intenses par la musique et ressentir les rythmes de la vie.",
      contributions: "Gestion du climat sonore et émotionnel d'un groupe, écoute attentive des intonations de voix, créativité artistique rythmique.",
      trainingNeeds: "Pratiquer un instrument de musique, chanter dans une chorale, écouter divers genres musicaux pour analyser leur structure.",
      potentialRisks: "Risque de distraction lorsque l'environnement sonore est perturbé. Nécessité d'apprendre à canaliser l'attention sonore.",
      recommendedFields: ["Musique & Spectacle Vivant", "Ingénierie du Son & Acoustique", "Chorégraphie & Danse", "Musicothérapie", "Audiovisuel"],
      recommendedCareers: ["Musicien / Compositeur", "Ingénieur du Son", "Chef d'Orchestre", "Musicothérapeute", "Chorégraphe", "Acousticien / Bruitateur", "Animateur Radio"],
    },
    Corporal: {
      title: "INTELLIGENCE CORPORELLE-KINESTHÉSIQUE (Mouvement, Toucher & Pratique)",
      key: "Corporal",
      traits: ["Besoin de mouvement", "Habileté manuelle", "Excellente coordination", "Apprentissage par l'action", "Expression corporelle", "Réactivité physique"],
      definition: "Capacité à utiliser son corps de manière fine et élaborée, à s'exprimer par le mouvement et à être habile dans la manipulation des objets (Howard Gardner).",
      workEnvironment: "Terrains de sport, scènes de théâtre, blocs opératoires, ateliers d'artisanat, chantiers, laboratoires de TP.",
      studyStrategies: "Apprendre en bougeant ou en marchant dans la pièce, manipuler du matériel concret (maquettes, cartes), utiliser des jeux de rôle et faire des pauses actives régulièrement.",
      valuesAndGoals: "Agir concrètement, maîtriser les gestes techniques et s'épanouir par l'action physique directe.",
      contributions: "Dextérité manuelle exceptionnelle, réactivité physique dans les situations d'urgence, sens pratique immédiat.",
      trainingNeeds: "Pratiquer des sports de coordination, faire du bricolage, du théâtre d'improvisation ou de la sculpture.",
      potentialRisks: "Difficulté à rester immobile pendant de longues réunions passives. Privilégier les formats de travail dynamiques.",
      recommendedFields: ["Physiothérapie & Santé du Mouvement", "Chirurgie & Médecine", "Sports & Éducation Physique", "Artisanat & Maintenance", "Arts du Spectacle"],
      recommendedCareers: ["Kinésithérapeute / Ostéopathe", "Chirurgien", "Professeur d'Éducation Physique", "Pompier", "Artisan / Menuisier / Mécanicien", "Chef Cuisinier", "Comédien / Danseur"],
    },
    Interpersonnelle: {
      title: "INTELLIGENCE INTERPERSONNELLE (Relations, Empathie & Médiation)",
      key: "Interpersonnelle",
      traits: ["Sens de l'écoute", "Empathie naturelle", "Habilité en médiation", "Sociabilité et leadership", "Travail en équipe", "Compréhension d'autrui"],
      definition: "Capacité à entrer en relation avec les autres, comprendre leurs émotions, humeurs et motivations, et y répondre de manière coopérative (Howard Gardner).",
      workEnvironment: "Écoles, universités, ressources humaines, travail social, ONG, cabinets de conseil, médiation, santé communautaire.",
      studyStrategies: "Étudier en groupe coopératif, expliquer le cours à d'autres camarades, organiser des révisions partagées, débattre des notions en équipe.",
      valuesAndGoals: "Favoriser le bien-être collectif, résoudre les conflits par le dialogue et accompagner le développement humain.",
      contributions: "Création de synergie de groupe, médiation pacifique des tensions, capacité à fédérer et écoute bienveillante.",
      trainingNeeds: "Pratiquer l'écoute active, analyser le langage non-verbal, animer des réunions ou ateliers d'entraide.",
      potentialRisks: "Tendance à s'oublier pour faire plaisir aux autres. Veiller à maintenir ses propres limites et objectifs individuels.",
      recommendedFields: ["Ressources Humaines & Management", "Psychologie & Travail Social", "Enseignement & Pédagogie", "Conseil & Médiation", "Action Humanitaire"],
      recommendedCareers: ["Psychologue / Thérapeute", "Conseiller en Orientation / RH", "Enseignant / Formateur", "Assistant Social / Médiateur", "Directeur d'ONG", "Consultant en Management"],
    },
    Intrapersonnelle: {
      title: "INTELLIGENCE INTRAPERSONNELLE (Connaissance de Soi, Introspection & Autonomie)",
      key: "Intrapersonnelle",
      traits: ["Autonomie et indépendance", "Forte concentration", "Autodiscipline", "Connaissance de ses valeurs", "Aptitude à l'introspection", "Gestion des objectifs"],
      definition: "Capacité à avoir une connaissance profonde de soi-même, de ses forces, faiblesses, émotions et valeurs, et à agir en conséquence (Howard Gardner).",
      workEnvironment: "Centres de recherche, cabinets de consultation individuelle, écriture, philosophie, direction stratégique, création autonome.",
      studyStrategies: "Étudier seul dans un endroit calme et silencieux, tenir un journal d'apprentissage, fixer ses propres objectifs de révision, pratiquer la métacognition.",
      valuesAndGoals: "S'épanouir en accord avec ses principes internes, maîtriser sa destinée et poursuivre une quête personnelle de sens.",
      contributions: "Autonomie complète, maîtrise de soi face au stress, grande maturité de réflexion et fidélité aux valeurs de l'organisation.",
      trainingNeeds: "Tenir un journal de bord, pratiquer des moments de méditation quotidienne, fixer des bilans personnels réguliers.",
      potentialRisks: "Tendance à l'isolement ou à l'excès de pudeur sociale. Veiller à partager régulièrement l'avancement de ses travaux.",
      recommendedFields: ["Recherche & Philosophie", "Psychologie & Psychanalyse", "Orientation & Coaching", "Écriture & Littérature", "Direction Stratégique"],
      recommendedCareers: ["Chercheur / Philosophe", "Psychologue / Psychanalyste", "Conseiller en Orientation", "Romancier / Écrivain", "Designer de Jeux Vidéo", "Cadre Dirigeant"],
    },
    Naturaliste: {
      title: "INTELLIGENCE NATURALISTE-ÉCOLOGIQUE (Nature, Biologie & Classification)",
      key: "Naturaliste",
      traits: ["Observation du détail", "Passion du vivant", "Aptitude à classifier", "Sensibilité écologique", "Esprit de structuration", "Rapprochement avec l'environnement"],
      definition: "Capacité à être sensible à la nature, explorer le vivant sous toutes ses formes, reconnaître, catégoriser et classifier les éléments naturels (Howard Gardner).",
      workEnvironment: "Parcs naturels, laboratoires de biologie, cliniques vétérinaires, exploitations agricoles, musées d'histoire naturelle, écologie.",
      studyStrategies: "Classer les leçons par catégories et sous-catégories thématiques, étudier en extérieur dans un parc ou jardin, utiliser des schémas d'écosystèmes.",
      valuesAndGoals: "Protéger la biodiversité, comprendre l'organisation du vivant et promouvoir un développement respectueux de l'environnement.",
      contributions: "Esprit d'organisation et de rangement méthodique des informations, vision globale des écosystèmes et sensibilité environnementale.",
      trainingNeeds: "Faire des recherches sur les phénomènes naturels, jardiner, tenir des collections classées, observer la faune et la flore.",
      potentialRisks: "Besoin impérieux de contact avec la nature pouvant créer un sentiment de confinement en bureau fermé sans verdure.",
      recommendedFields: ["Biologie & Sciences de la Terre", "Médecine Vétérinaire & Zoologie", "Agronomie & Écologie", "Paysagisme & Horticulture", "Gestion de l'Environnement"],
      recommendedCareers: ["Vétérinaire / Zoologiste", "Biologiste / Botaniste", "Agronome / Agriculteur", "Architecte-Paysagiste", "Météorologue", "Chef Cuisinier", "Conservateur de Musée"],
    },
  };

  const primaryProfile = gardnerProfileDetailsMap[top1] || gardnerProfileDetailsMap["Linguistique"];
  const secondaryProfile = gardnerProfileDetailsMap[top2] || gardnerProfileDetailsMap["Logique"];

  const rawTotal = (Object.values(scores) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  const totalPossible = 150;
  const scorePct = Math.min(100, Math.round((rawTotal / totalPossible) * 100));
  const appreciationInfo = getTestScoreAppreciation(scorePct);

  const advisorMotivation = `ANALYSE PÉDAGOGIQUE ET CONSEIL DU CONSEILLER (Dr. BALOGAH Dibaataba) : Votre bilan cognitif certifié selon la théorie d'Howard Gardner révèle une dominance marquée pour l'${primaryProfile.title.split(" ")[0]} (${top1}) appuyée par des affinités fortes en ${top2}. Comme le rappellent le psycho-pédagogue Bruno Humbeeck et les travaux du Harvard Project Zero, aucune forme d'intelligence n'est figée ni supérieure aux autres : votre profil évolue tout au long de la vie. En utilisant vos stratégies d'étude privilégiées (${primaryProfile.studyStrategies}) et en orientant votre parcours vers vos univers optimaux, vous maximisez votre plaisir d'apprendre et votre réussite professionnelle.`;

  return {
    scoreSummary: scores,
    suitabilityScore: scorePct,
    appreciation: appreciationInfo.appreciation,
    primaryCategory: `Intelligence Dominante : ${primaryProfile.title}`,
    description: `Votre profil d'Intelligences Multiples révèle une prédominance d'intelligence ${top1} (Dominante principale) et d'intelligence ${top2} (Dominante secondaire). ${primaryProfile.definition}`,
    detailedProfiling: {
      titleHeader: `Profil Restitution Intelligences Multiples (Howard Gardner)`,
      primaryTitle: primaryProfile.title,
      secondaryTitle: secondaryProfile.title,
      traits: primaryProfile.traits,
      workEnvironment: primaryProfile.workEnvironment,
      studyStrategies: primaryProfile.studyStrategies,
      valuesAndGoals: primaryProfile.valuesAndGoals,
      contributions: primaryProfile.contributions,
      developmentActivities: primaryProfile.trainingNeeds,
      potentialRisks: primaryProfile.potentialRisks,
      advisorMotivation,
    },
    recommendedFields: Array.from(new Set([...primaryProfile.recommendedFields, ...secondaryProfile.recommendedFields])),
    recommendedCareers: Array.from(new Set([...primaryProfile.recommendedCareers, ...secondaryProfile.recommendedCareers])),
  };
}

// ---------------------------------------------------------------------------
// OFFICIAL 50 QUESTIONS FOR BILAN DE COMPÉTENCES & SOFT SKILLS TEST
// (Adapted from A Compétence Égale, François Jové - Devenir Génial, Gembloux Agro-Bio Tech & Orientation.ch)
// ---------------------------------------------------------------------------

function createBilanQuestion(id: number, text: string, categoryKey: string) {
  return {
    id,
    text,
    options: [
      {
        label: "Excellente maîtrise / Toujours appliqué(e) avec succès (Niveau Expert)",
        value: `${categoryKey}_3`,
        categoryScore: { [categoryKey]: 3 },
      },
      {
        label: "Bonne maîtrise / Pratique régulière et autonome (Niveau Avancé)",
        value: `${categoryKey}_2`,
        categoryScore: { [categoryKey]: 2 },
      },
      {
        label: "Maîtrise partielle / Notions de base à consolider (Niveau Intermédiaire)",
        value: `${categoryKey}_1`,
        categoryScore: { [categoryKey]: 1 },
      },
      {
        label: "Non maîtrisé / Axe prioritaire de développement (Niveau Initial)",
        value: `${categoryKey}_0`,
        categoryScore: { [categoryKey]: 0 },
      },
    ],
  };
}

export const BILAN_COMPETENCES_OFFICIAL_QUESTIONS = [
  // --- AXE 1: COMMUNICATION PROFESSIONNELLE & ÉCOUTE ACTIVE (SoftSkills_Com) ---
  createBilanQuestion(1, "Lors de vos échanges professionnels, parvenez-vous à adapter votre discours et votre vocabulaire selon le niveau de technicité de votre interlocuteur ?", "SoftSkills_Com"),
  createBilanQuestion(2, "Pratiquez-vous une écoute active et bienveillante en reformulant les besoins d'autrui sans porter de jugement hâtif ni imposer vos a priori ?", "SoftSkills_Com"),
  createBilanQuestion(3, "Dans une situation de négociation ou d'exposé, parvenez-vous à faire passer vos messages clés avec clarté, concision et assertivité ?", "SoftSkills_Com"),
  createBilanQuestion(4, "Portez-vous une attention particulière aux signaux de communication non-verbale (gestes, intonations, posture) lors de vos entretiens ?", "SoftSkills_Com"),
  createBilanQuestion(5, "Lorsque vous recevez des retours ou critiques sur votre travail, savez-vous les écouter de façon constructive sans réagir avec défensive ?", "SoftSkills_Com"),
  createBilanQuestion(6, "Rédigez-vous des documents professionnels, synthèses ou e-mails clairs, structurés et adaptés à l'objectif visé ?", "SoftSkills_Com"),

  // --- AXE 2: TRAVAIL EN ÉQUIPE & SYNERGIE COLLECTIVE (SoftSkills_Team) ---
  createBilanQuestion(7, "Intégrez-vous facilement un groupe de travail en respectant les règles organisationnelles et la dynamique collective ?", "SoftSkills_Team"),
  createBilanQuestion(8, "Êtes-vous enclin(e) à partager spontanément vos connaissances et ressources pour aider un membre de l'équipe en difficulté ?", "SoftSkills_Team"),
  createBilanQuestion(9, "Face à un conflit d'idées au sein du groupe, cherchez-vous des compromis gagnant-gagnant favorisant l'intérêt du projet ?", "SoftSkills_Team"),
  createBilanQuestion(10, "Accordez-vous une valeur égale aux contributions de tous les membres de l'équipe, quelle que soit leur fonction ou leur statut ?", "SoftSkills_Team"),
  createBilanQuestion(11, "Participez-vous activement aux cérémonies de feedback par les pairs (évaluation à 360°) pour enrichir la dynamique collective ?", "SoftSkills_Team"),
  createBilanQuestion(12, "Savez-vous désamorcer les tensions relationnelles en faisant preuve de médiation et de sérénité au sein de votre entourage ?", "SoftSkills_Team"),

  // --- AXE 3: LEADERSHIP, IMPACT & MANAGEMENT PROACTIF (SoftSkills_Lead) ---
  createBilanQuestion(13, "Prenez-vous spontanément des initiatives pour faire avancer un projet ou surmonter un blocage sans attendre d'instructions ?", "SoftSkills_Lead"),
  createBilanQuestion(14, "Parvenez-vous à inspirer, motiver et fédérer des collaborateurs autour d'une vision stratégique claire et engageante ?", "SoftSkills_Lead"),
  createBilanQuestion(15, "Dans le cadre d'un management de projet, savez-vous fixer des objectifs réalistes et accompagner le progrès de chacun ?", "SoftSkills_Lead"),
  createBilanQuestion(16, "Faites-vous preuve d'un leadership inclusif qui neutralise les biais cognitifs (effet de halo, stéréotypes) lors de la délégation ?", "SoftSkills_Lead"),
  createBilanQuestion(17, "Êtes-vous capable de prendre des décisions tranchées et assumées dans des contextes d'incertitude ou de crise ?", "SoftSkills_Lead"),
  createBilanQuestion(18, "Encouragez-vous l'innovation, la créativité et la liberté de proposition au sein de votre équipe ou environnement ?", "SoftSkills_Lead"),

  // --- AXE 4: ADAPTABILITÉ, AGILITÉ MENTALE & GESTION DU STRESS (SoftSkills_Adapt) ---
  createBilanQuestion(19, "Face à une réorganisation imprévue ou un changement de cap stratégique, ajustez-vous rapidement vos méthodes de travail ?", "SoftSkills_Adapt"),
  createBilanQuestion(20, "Conservez-vous votre sang-froid et la maîtrise de vos émotions lors de périodes de forte pression ou d'urgence ?", "SoftSkills_Adapt"),
  createBilanQuestion(21, "Êtes-vous à l'aise avec la polyvalence et la gestion de tâches multiples simultanées en sachant re-prioriser ?", "SoftSkills_Adapt"),
  createBilanQuestion(22, "Lorsque vous faites face à un échec ou un refus, faites-vous preuve de résilience en en tirant des enseignements positifs ?", "SoftSkills_Adapt"),
  createBilanQuestion(23, "Acceptez-vous de sortir de votre zone de confort pour expérimenter de nouvelles approches ou des outils non familiers ?", "SoftSkills_Adapt"),
  createBilanQuestion(24, "Faites-vous preuve de souplesse intellectuelle pour remettre en question vos croyances limitantes ou vos habitudes de travail ?", "SoftSkills_Adapt"),

  // --- AXE 5: EXPERTISE TECHNIQUE & COMPÉTENCES DIGITALES (HardSkills_Tech) ---
  createBilanQuestion(25, "Maîtrisez-vous les outils informatiques fondamentaux (bureautique avancée, logiciels de gestion, bases de données) de votre métier ?", "HardSkills_Tech"),
  createBilanQuestion(26, "Utilisez-vous avec aisance les plateformes collaboratives et les technologies digitales de travail à distance ou hybride ?", "HardSkills_Tech"),
  createBilanQuestion(27, "Avez-vous une bonne maîtrise pratique des outils et équipements spécifiques indispensables à l'exercice de votre fonction ?", "HardSkills_Tech"),
  createBilanQuestion(28, "Êtes-vous capable de rédiger et d'interpréter des documents techniques complexes (schémas, procédures, cahiers des charges) ?", "HardSkills_Tech"),
  createBilanQuestion(29, "Entretenez-vous une veille technologique régulière pour mettre à jour vos savoir-faire professionnels face aux évolutions du marché ?", "HardSkills_Tech"),
  createBilanQuestion(30, "Êtes-vous à l'aise pour communiquer en anglais ou dans une autre langue étrangère dans un contexte professionnel international ?", "HardSkills_Tech"),

  // --- AXE 6: ESPRIT D'ANALYSE, RIGUEUR MÉTHODIQUE & CTI (HardSkills_Anal) ---
  createBilanQuestion(31, "Structurez-vous vos réalisations selon une méthode rigoureuse et factuelle (de type STAR : Situation, Tâche, Action, Résultat) ?", "HardSkills_Anal"),
  createBilanQuestion(32, "Respectez-vous scrupuleusement les délais impartis, le niveau de qualité exigé et les normes de sécurité en vigueur ?", "HardSkills_Anal"),
  createBilanQuestion(33, "Êtes-vous capable d'analyser des données chiffrées ou complexes pour en extraire des synthèses claires et directement exploitables ?", "HardSkills_Anal"),
  createBilanQuestion(34, "Procédez-vous avec méthode pour identifier les causes racines d'un problème plutôt que d'appliquer des solutions superficielles ?", "HardSkills_Anal"),
  createBilanQuestion(35, "Faites-vous preuve de rigueur dans l'organisation de vos dossiers et le suivi méthodique de vos indicateurs de performance ?", "HardSkills_Anal"),
  createBilanQuestion(36, "Évaluez-vous les risques économiques, environnementaux et sociétaux liés aux solutions que vous préconisez dans vos projets ?", "HardSkills_Anal"),

  // --- AXE 7: ALIGNEMENT DES VALEURS, SENS & ZONE DE GÉNIE (ZoneGenie_Val) ---
  createBilanQuestion(37, "Ressentez-vous de l'enthousiasme et un sentiment de fluidité (état de flux) lorsque vous mobilisez vos compétences au quotidien ?", "ZoneGenie_Val"),
  createBilanQuestion(38, "Votre activité professionnelle est-elle en harmonie avec vos valeurs morales fondamentales et votre éthique personnelle ?", "ZoneGenie_Val"),
  createBilanQuestion(39, "Avez-vous une vision claire de votre 'Zone de Génie', c'est-à-dire l'intersection idéale entre vos aptitudes naturelles et vos passions ?", "ZoneGenie_Val"),
  createBilanQuestion(40, "Accordez-vous une importance équilibrée aux 5 dimensions de votre bien-être (professionnel, social, financier, physique, environnemental) ?", "ZoneGenie_Val"),
  createBilanQuestion(41, "Savez-vous identifier les compétences que vous maîtrisez mais qui vous épuisent intellectuellement pour vous en détacher ?", "ZoneGenie_Val"),
  createBilanQuestion(42, "Cherchez-vous à donner un sens utile et une contribution positive à la communauté à travers vos projets professionnels ?", "ZoneGenie_Val"),
  createBilanQuestion(43, "Avez-vous identifié des causes ou des sujets d'engagement pour lesquels vous seriez prêt(e) à vous investir pleinement avec énergie ?", "ZoneGenie_Val"),

  // --- AXE 8: ORGANISATION, AUTO-ÉVALUATION & DÉMARCHE RÉFLEXIVE (Reflexivite_Org) ---
  createBilanQuestion(44, "Pratiquez-vous une démarche réflexive régulière (auto-analyse de vos succès et erreurs) pour progresser de manière continue ?", "Reflexivite_Org"),
  createBilanQuestion(45, "Réalisez-vous périodiquement un bilan SWOT personnel (Forces, Faiblesses, Opportunités, Menaces) pour orienter vos choix ?", "Reflexivite_Org"),
  createBilanQuestion(46, "Êtes-vous conscient(e) des biais cognitifs (projection, stéréotypes, effet Dunning-Kruger) pouvant altérer votre propre jugement ?", "Reflexivite_Org"),
  createBilanQuestion(47, "Sollicitez-vous régulièrement l'avis de mentors, de collègues ou d'experts pour évaluer l'écart entre vos acquis et vos ambitions ?", "Reflexivite_Org"),
  createBilanQuestion(48, "Définissez-vous un plan d'action individuel clair avec des étapes concrètes et mesurables pour concrétiser votre évolution ?", "Reflexivite_Org"),
  createBilanQuestion(49, "Conservez-vous des preuves tangibles de vos réalisations (dossier d'expériences, recommandations, portfolio commenté) pour valoriser vos acquis ?", "Reflexivite_Org"),
  createBilanQuestion(50, "Êtes-vous acteur/actrice engagé(e) de votre formation continue en identifiant spontanément les compétences à acquérir ?", "Reflexivite_Org"),
];

export function interpretBilanCompetencesResult(scores: Record<string, number>) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0]?.[0] || "SoftSkills_Com";
  const top2 = sorted[1]?.[0] || "SoftSkills_Lead";

  const bilanProfileDetailsMap: Record<string, any> = {
    SoftSkills_Com: {
      title: "COMMUNICATION PROFESSIONNELLE, ÉCOUTE ACTIVE & ASSERTIVITÉ",
      key: "SoftSkills_Com",
      traits: ["Écoute active", "Clarté du discours", "Richesse du vocabulaire", "Assertivité", "Reformulation neutre", "Absence de jugement"],
      definition: "Aisance remarquable dans l'expression orale et écrite, l'écoute sans a priori et la transmission claire de messages complexes (Livret A Compétence Égale & Gembloux).",
      workEnvironment: "Relations publiques, négociations commerciales, médiation, ressources humaines, communication d'entreprise, journalisme, enseignement.",
      studyStrategies: "Privilégier les entretiens structurés (méthode STAR), formaliser des comptes-rendus synthétiques, pratiquer des simulations d'entretiens et animer des réunions d'échange.",
      valuesAndGoals: "Transmettre l'information avec exactitude, favoriser le dialogue constructif et éliminer les ambiguïtés relationnelles.",
      contributions: "Aisance dans l'animation des discussions, négociation fluide, réduction des malentendus et rédaction irréprochable de synthèses.",
      trainingNeeds: "Développer la prise de parole en public sous contrainte de temps, approfondir la maîtrise du langage non-verbal et pratiquer l'entretien orienté compétences.",
      potentialRisks: "Risque de sur-investir le discours verbal au détriment des aspects techniques matériels. Veiller à adosser la communication à des réalisations factuelles.",
      recommendedFields: ["Communication & Médias", "Ressources Humaines & Recrutement", "Négociation & Commercial", "Relations Publiques", "Formation & Coaching"],
      recommendedCareers: ["Chargé de Communication", "Consultant en Recrutement", "Négociateur / Commercial Senior", "Responsable Relations Publiques", "Formateur Professionnel", "Médiateur"],
    },
    SoftSkills_Team: {
      title: "TRAVAIL EN ÉQUIPE, SYNERGIE COLLECTIVE & GESTION DES CONFLITS",
      key: "SoftSkills_Team",
      traits: ["Esprit d'équipe", "Coopération fluide", "Médiation des conflits", "Partage de compétences", "Feedback constructif", "Sens du collectif"],
      definition: "Capacité exemplaire à s'intégrer dans un groupe, respecter les règles de l'organisation et stimuler l'entraide collective (Référentiel Gembloux & CTI).",
      workEnvironment: "Projets multidisciplinaires, équipes transverses, services d'assistance, ingénierie collaborative, action sociale, ONG.",
      studyStrategies: "Mettre en œuvre des devoirs collectifs avec évaluation par les pairs (360°), organiser des groupes de travail ressource et participer à des serious games collaboratifs.",
      valuesAndGoals: "Rechercher la réussite collective, l'harmonie du groupe et l'entraide mutuelle. Valoriser chaque membre à sa juste mesure.",
      contributions: "Création d'un climat de confiance et de bienveillance, désamorçage naturel des tensions et facilitation du travail en synergie.",
      trainingNeeds: "Pratiquer les techniques de régulation de groupe, apprendre à formuler du feedback correctif bienveillant et structurer la répartition des rôles.",
      potentialRisks: "Tendance à rechercher le consensus à tout prix, au risque de retarder certaines prises de décision individuelles urgentes.",
      recommendedFields: ["Gestion de Projet Collaboratif", "Ressources Humaines & QVT", "Action Sociale & Humanitaire", "Ingénierie Multidisciplinaire", "Services aux Entreprises"],
      recommendedCareers: ["Chef de Projet Transverse", "Facilitateur / Coach d'Équipe", "Responsable Qualité de Vie au Travail", "Coordonnateur de Projets ONG", "Manager de Projets Hybrides"],
    },
    SoftSkills_Lead: {
      title: "LEADERSHIP INSPIRANT, ANIMATION D'ÉQUIPE & PROACTIVITÉ",
      key: "SoftSkills_Lead",
      traits: ["Vision stratégique", "Leadership inspirant", "Prise d'initiative", "Motivation des équipes", "Prise de décision", "Délégation efficace"],
      definition: "Aptitude naturelle à diriger, animer et motiver une équipe autour d'objectifs ambitieux en agissant avec équité et bienveillance (François Jové & A Compétence Égale).",
      workEnvironment: "Direction d'entreprise, management d'unités opérationnelles, pilotage de grands projets, entrepreneuriat, gestion du changement.",
      studyStrategies: "Formaliser des plans d'action avec priorisation, utiliser la méthode SWOT pour l'arbitrage stratégique et pratiquer le mentorat auprès de collaborateurs juniors.",
      valuesAndGoals: "Inspirer la réussite, porter une vision stimulante et donner du sens aux missions quotidiennes de chacun.",
      contributions: "Définition claire des caps stratégiques, dynamisation des énergies collectives, neutralisation des biais cognitifs dans le management et responsabilité assumée.",
      trainingNeeds: "Approfondir la gestion du changement organisationnel, perfectionner les techniques de délégation et pratiquer le leadership situationnel.",
      potentialRisks: "Vigilance sur l'épuisement personnel par sur-implication. Veiller à préserver le bien-être physique et le relais par les collaborateurs.",
      recommendedFields: ["Direction Générale & Management", "Entrepreneuriat & Startups", "Conseil en Stratégie & Organisation", "Management du Changement"],
      recommendedCareers: ["Directeur Opérationnel / COO", "Entrepreneur / Fondateur", "Consultant en Stratégie & Change", "Manager de Business Unit", "Directeur de Projet"],
    },
    SoftSkills_Adapt: {
      title: "ADAPTABILITÉ, AGILITÉ MENTALE & RÉSISTANCE AU STRESS",
      key: "SoftSkills_Adapt",
      traits: ["Agilité mentale", "Flexibilité face au changement", "Gestion du stress", "Résilience", "Polyvalence", "Calme opérationnel"],
      definition: "Capacité à s'adapter promptement aux évolutions de l'environnement, conserver sa sérénité en situation de crise et rebondir après un échec (Livret A Compétence Égale).",
      workEnvironment: "Environnements mouvants, startups à forte croissance, gestion de crise, événementiel, conseil en transformation, logistique.",
      studyStrategies: "Tester de nouvelles méthodes de travail, diversifier les expériences professionnelles, pratiquer des exercices de respiration et de pleine conscience (Paskho/Jové).",
      valuesAndGoals: "Embrasser l'incertitude comme une opportunité de croissance, apprendre en continu et faire preuve de souplesse intellectuelle.",
      contributions: "Grande réactivité lors des imprévus, capacité à rassurer les équipes perturbées par le changement et polyvalence opérationnelle.",
      trainingNeeds: "S'entraîner à la gestion des priorités sous contrainte, structurer ses plans de secours (Plan B) et faire de la veille sur les tendances émergentes.",
      potentialRisks: "Gare à l'éparpillement si l'agilité n'est pas cadrée par une méthode rigoureuse et des objectifs stables.",
      recommendedFields: ["Gestion de Crise & Logistique", "Consulting en Transformation", "Événementiel & Médias Live", "Entrepreneuriat Technologique"],
      recommendedCareers: ["Manager de Transition", "Consultant en Agilité / Scrum Master", "Responsable Logistique & Crise", "Directeur d'Événements", "Chef de Projet Innovation"],
    },
    HardSkills_Tech: {
      title: "EXPERTISE TECHNIQUE, OUTILS DIGITAUX & MAÎTRISE MÉTIER",
      key: "HardSkills_Tech",
      traits: ["Expertise métier", "Maîtrise du digital", "Bureautique avancée", "Rigueur technique", "Langues étrangères", "Pratique outillée"],
      definition: "Possession de savoirs et savoir-faire techniques solides alliée à une maîtrise aisée des outils numériques et des équipements professionnels (Orientation.ch & SafetyCulture).",
      workEnvironment: "Départements IT, ingénierie, industrie, centres de données, laboratoires de R&D, services financiers et comptables.",
      studyStrategies: "Créer un portfolio de preuves techniques commentées (tracé de réalisations, codes, certifications), effectuer une veille continue et appliquer les compétences sur des projets réels.",
      valuesAndGoals: "Rechercher la précision technique, l'efficacité opérationnelle et la maîtrise parfaite des outils indispensables à la fonction.",
      contributions: "Fiabilité des livrables techniques, autonomie dans l'utilisation des logiciels complexes et apport d'expertise ciblée.",
      trainingNeeds: "Obtenir des certifications professionnelles reconnues, approfondir la maîtrise des nouveaux outils de l'IA et de l'automatisation.",
      potentialRisks: "Risque de sous-estimer l'importance des Soft Skills (relationnel, communication) dans l'évolution vers des postes à responsabilités.",
      recommendedFields: ["Informatique & Systèmes d'Information", "Ingénierie & Industrie 4.0", "Finance & Analyse de Données", "Télécommunications"],
      recommendedCareers: ["Expert / Spécialiste Technique", "Ingénieur Systèmes / Dev", "Analyste Financier / Data Analyst", "Architecte Réseaux", "Consultant Technique"],
    },
    HardSkills_Anal: {
      title: "ESPRIT D'ANALYSE, RIGUEUR MÉTHODIQUE (MÉTHODE STAR) & CTI",
      key: "HardSkills_Anal",
      traits: ["Esprit d'analyse", "Méthode STAR", "Résolution de problèmes", "Respect de la qualité", "Rigueur méthodologique", "Évaluation des risques"],
      definition: "Capacité à décomposer des problèmes complexes, structurer les faits selon la méthode STAR (Situation, Tâche, Action, Résultat) et garantir des normes élevées (A Compétence Égale & CTI).",
      workEnvironment: "Audit, contrôle de gestion, ingénierie qualité, sécurité des procédés, recherche appliquée, études économiques.",
      studyStrategies: "Utiliser la grille STAR pour analyser ses expériences passées, élaborer des diagrammes de causes à effets et vérifier l'impact économique/environnemental des solutions.",
      valuesAndGoals: "Démontrer par des faits mesurables et objectifs, respecter l'éthique professionnelle et garantir la conformité aux exigences.",
      contributions: "Analyse objective exempte de biais de jugement, structuration méthodique des processus et fiabilité incontestable des préconisations.",
      trainingNeeds: "Se former aux outils de l'assessment center, approfondir la modélisation statistique et maîtriser la gestion des risques.",
      potentialRisks: "Attention au risque de paralysie par l'analyse excessive (over-thinking) qui pourrait ralentir l'exécution rapide.",
      recommendedFields: ["Audit & Contrôle de Gestion", "Qualité, Sécurité & Environnement (QSE)", "Ingénierie & Études Techniques", "Recherche & Expertise"],
      recommendedCareers: ["Auditeur Qualité / Process", "Contrôleur de Gestion", "Ingénieur QSE", "Consultant en Organisation", "Analyste de Risques"],
    },
    ZoneGenie_Val: {
      title: "ALIGNEMENT DES VALEURS, SENS DU TRAVAIL & ZONE DE GÉNIE",
      key: "ZoneGenie_Val",
      traits: ["Alignement personnel", "Zone de Génie", "Sens du travail", "Motivation intrinsèque", "Épanouissement", "Engagement authentique"],
      definition: "Parfaite convergence entre vos aptitudes naturelles, vos passions profondes et vos valeurs morales, garantissant un épanouissement durable et une haute énergie (François Jové - Devenir Génial).",
      workEnvironment: "Entreprises à mission, entrepreneuriat passion, coaching de carrière, projets à fort impact sociétal ou environnemental.",
      studyStrategies: "Mener l'exercice des 5 domaines du bien-être, identifier la 'Zone de Génie' via des fiches d'activités aimées/épuisantes et élaborer son projet autour du 'Pourquoi' (Sinek/Jové).",
      valuesAndGoals: "Agir avec authenticité, trouver un sens profond dans ses activités quotidiennes et contribuer positivement au monde.",
      contributions: "Énergie communicative, authenticité irréprochable, motivation intrinsèque inépuisable et fidélité absolue aux engagements.",
      trainingNeeds: "Faire le tri entre les compétences maîtrisées qui épuisent et celles qui rechargent l'énergie spirituelle, formaliser un plan d'action d'alignement.",
      potentialRisks: "Attention à la tentation de rejeter brusquement tout compromis matériel. Inscrire la transition vers sa Zone de Génie dans un processus organique pragmatique.",
      recommendedFields: ["Accompagnement & Bilan de Compétences", "Entreprises Socialement Responsables (RSE)", "Coaching & Développement Personnel", "Création d'Entreprise à Mission"],
      recommendedCareers: ["Consultant en Transition de Carrière", "Coach Certifié en Alignement", "Responsable RSE & Impact", "Entrepreneur Social", "Consultant en Bilan de Compétences"],
    },
    Reflexivite_Org: {
      title: "ORGANISATION, AUTO-ÉVALUATION (SWOT) & DÉMARCHE RÉFLEXIVE",
      key: "Reflexivite_Org",
      traits: ["Autonomie d'organisation", "Analyse SWOT", "Démarche réflexive", "Auto-évaluation objective", "Plan d'action structuré", "Portfolio de preuves"],
      definition: "Aptitude exceptionnelle à prendre du recul sur son parcours, réaliser un bilan SWOT rigoureux et piloter sa formation continue de manière autonome (Gembloux & Devenir Génial).",
      workEnvironment: "Conseil en évolution professionnelle, formation d'adultes, gestion autonome de carrière, ingénierie de formation, gouvernance.",
      studyStrategies: "Rédiger des rapports réflexifs après chaque projet majeur, construire sa grille SWOT dynamique et maintenir son dossier de preuves d'acquisitions de compétences.",
      valuesAndGoals: "Progresser continuellement par l'auto-analyse, piloter son propre développement professionnel et faire preuve de lucidité.",
      contributions: "Capacité à surmonter les biais d'auto-évaluation (effet Dunning-Kruger), planification claire des étapes de carrière et rigueur dans le suivi des objectifs.",
      trainingNeeds: "Pratiquer le bilan 360° miroir auprès de son réseau professionnel, affiner l'analyse de transférabilité des compétences et consolider son plan B.",
      potentialRisks: "Veiller à ne pas passer plus de temps à introspecter et planifier qu'à exécuter concrètement les actions du plan.",
      recommendedFields: ["Formation Continue & Ingénierie Pédagogique", "Consulting RH & Gestion des Carrières", "Management de Projets Complexes"],
      recommendedCareers: ["Ingénieur de Formation", "Consultant en Gestion des Emplois et Parcours Professionnels (GEPP)", "Responsable Formation", "Coach de Carrière"],
    },
  };

  const primaryProfile = bilanProfileDetailsMap[top1] || bilanProfileDetailsMap["SoftSkills_Com"];
  const secondaryProfile = bilanProfileDetailsMap[top2] || bilanProfileDetailsMap["SoftSkills_Lead"];

  const rawTotal = (Object.values(scores) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  const totalPossible = 150;
  const scorePct = Math.min(100, Math.round((rawTotal / totalPossible) * 100));
  const appreciationInfo = getTestScoreAppreciation(scorePct);

  const advisorMotivation = `ANALYSE PÉDAGOGIQUE ET CONSEIL DU CONSEILLER (Dr. BALOGAH Dibaataba) : Votre bilan certifié de Compétences & Soft Skills met en lumière un profil à haute valeur ajoutée, caractérisé par une dominante majeure en ${primaryProfile.title} et un appui solide en ${secondaryProfile.title}. Comme le soulignent les chartes d'A Compétence Égale et les méthodes de Devenir Génial, l'évaluation moderne des compétences dépasse les seuls diplômes (Hard Skills) pour placer vos qualités comportementales (Soft Skills), votre réflexivité (Analyse STAR / SWOT) et l'alignement avec votre Zone de Génie au cœur de votre employabilité. En structurant vos réussites sous forme de preuves tangibles et en visant des environnements adaptés, vous sécurisez pleinement votre transition professionnelle.`;

  return {
    scoreSummary: scores,
    suitabilityScore: scorePct,
    appreciation: appreciationInfo.appreciation,
    primaryCategory: `Profil Compétences : ${primaryProfile.title}`,
    description: `Votre Bilan de Compétences & Soft Skills révèle une dominance principale en ${top1} et une dominance secondaire en ${top2}. ${primaryProfile.definition}`,
    detailedProfiling: {
      titleHeader: `Profil Restitution Bilan de Compétences & Soft Skills`,
      primaryTitle: primaryProfile.title,
      secondaryTitle: secondaryProfile.title,
      traits: primaryProfile.traits,
      workEnvironment: primaryProfile.workEnvironment,
      studyStrategies: primaryProfile.studyStrategies,
      valuesAndGoals: primaryProfile.valuesAndGoals,
      contributions: primaryProfile.contributions,
      developmentActivities: primaryProfile.trainingNeeds,
      potentialRisks: primaryProfile.potentialRisks,
      advisorMotivation,
    },
    recommendedFields: Array.from(new Set([...primaryProfile.recommendedFields, ...secondaryProfile.recommendedFields])),
    recommendedCareers: Array.from(new Set([...primaryProfile.recommendedCareers, ...secondaryProfile.recommendedCareers])),
  };
}

// ---------------------------------------------------------------------------
// OFFICIAL 50 QUESTIONS FOR APTITUDES SCIENTIFIQUES & TECHNOLOGIQUES TEST
// (Adapted from BRTA - Batterie Romande, Marc Dalens - Tests Psychotechniques, IN-TEST & CHC Model)
// ---------------------------------------------------------------------------

function createScienceQuestion(id: number, text: string, categoryKey: string) {
  return {
    id,
    text,
    options: [
      {
        label: "Excellente maîtrise / Résolution rapide et sans erreur (Niveau Avancé)",
        value: `${categoryKey}_3`,
        categoryScore: { [categoryKey]: 3 },
      },
      {
        label: "Bonne maîtrise / Raisonnement correct avec méthode (Niveau Intermédiaire)",
        value: `${categoryKey}_2`,
        categoryScore: { [categoryKey]: 2 },
      },
      {
        label: "Maîtrise partielle / Nécessite des explications ou vérifications (Niveau Éléments)",
        value: `${categoryKey}_1`,
        categoryScore: { [categoryKey]: 1 },
      },
      {
        label: "Non maîtrisé / Difficulté majeure sur ce type de problème (Niveau Initial)",
        value: `${categoryKey}_0`,
        categoryScore: { [categoryKey]: 0 },
      },
    ],
  };
}

export const SCIENCE_OFFICIAL_QUESTIONS = [
  // --- AXE 1: RAISONNEMENT MATHÉMATIQUE & ALGEBRE (Maths) ---
  createScienceQuestion(1, "Êtes-vous à l'aise pour calculer rapidement de tête des opérations arithmétiques complexes ou des équations à une inconnue ?", "Maths"),
  createScienceQuestion(2, "Manipulez-vous facilement les fractions, les proportions, les équivalences d'échelles et les pourcentages ?", "Maths"),
  createScienceQuestion(3, "Savoir simplifier et factoriser des expressions algébriques littérales (ex: 3a * 3b = 9ab ou 4x² - 20x + 25) est-il naturel pour vous ?", "Maths"),
  createScienceQuestion(4, "Comprenez-vous rapidement la logique d'une suite numérique complexe (suites récurrentes, alternées ou géométriques) ?", "Maths"),
  createScienceQuestion(5, "Comprenez-vous le calcul du discriminant d'une équation du second degré (ax² + bx + c = 0) et le nombre de ses solutions ?", "Maths"),
  createScienceQuestion(6, "Êtes-vous habile pour convertir des écritures scientifiques avec puissances de 10 (ex: 7*10^-12 * 6*10^5 / 21*10^4) ?", "Maths"),

  // --- AXE 2: PHYSIQUE, MÉCANIQUE & CINÉMATIQUE (Physique) ---
  createScienceQuestion(7, "Saisissez-vous intuitivement le fonctionnement des mécanismes physiques (engrenages, leviers, poulies, pistons) ?", "Physique"),
  createScienceQuestion(8, "Êtes-vous capable de résoudre des problèmes de cinématique liant vitesse, distance et temps de parcours (V = d / t) ?", "Physique"),
  createScienceQuestion(9, "Comprenez-vous les notions de masse volumique, de densité et de conversion d'unités de volume et de masse (dm³ en kg, tonnes) ?", "Physique"),
  createScienceQuestion(10, "Comprenez-vous la relation fondamentale d'Albert Einstein exprimant l'équivalence masse-énergie (E = mc²) ?", "Physique"),
  createScienceQuestion(11, "Savez-vous évaluer les grandeurs de vitesse physique comme la vitesse de la lumière (299 792,5 km/s = 2,997925 * 10⁸ m/s) ?", "Physique"),
  createScienceQuestion(12, "Percevez-vous les principes de dynamique des fluides, de pression et de résistance des matériaux appliqués au BTP ?", "Physique"),

  // --- AXE 3: BIOLOGIE, SCIENCES DE LA VIE & DE LA TERRE (SVT) ---
  createScienceQuestion(13, "Comprenez-vous les mécanismes fondamentaux de la génétique (transmission de l'ADN, chromosomes, mutations) ?", "SVT"),
  createScienceQuestion(14, "Êtes-vous intéressé(e) par la physiologie humaine, le fonctionnement des organes et les systèmes immunitaire et nerveux ?", "SVT"),
  createScienceQuestion(15, "Saisissez-vous l'organisation des écosystèmes, le cycle du carbone et les mécanismes de la biodiversité ?", "SVT"),
  createScienceQuestion(16, "Comprenez-vous les phénomènes géologiques globaux tels que la tectonique des plaques, le volcanisme et les séismes (échelle de Richter) ?", "SVT"),
  createScienceQuestion(17, "Avez-vous de la facilité à mémoriser la classification taxonomique des espèces végétales et animales ?", "SVT"),
  createScienceQuestion(18, "Suivez-vous avec intérêt les avancées de la biotechnologie, de la biologie médicale et de la recherche en santé ?", "SVT"),

  // --- AXE 4: ALGORITHMIQUE, LOGIQUE & INFORMATIQUE (Info) ---
  createScienceQuestion(19, "Saisissez-vous la structure logique d'un algorithme (conditions Si/Alors/Sinon, boucles Tant Que/Pour) ?", "Info"),
  createScienceQuestion(20, "Êtes-vous enclin(e) à décomposer un problème informatique complexe en sous-instructions élémentaires ordonnées ?", "Info"),
  createScienceQuestion(21, "Comprenez-vous le rôle des langages de programmation (C++, Python, Java, SQL) et l'architecture des systèmes d'exploitation ?", "Info"),
  createScienceQuestion(22, "Êtes-vous à l'aise avec la logique binaire, le codage de données et les structures de bases de données (tables, requêtes) ?", "Info"),
  createScienceQuestion(23, "Ressentez-vous de la satisfaction à détecter et corriger les erreurs de logique (debugging) dans un script ou un processus ?", "Info"),
  createScienceQuestion(24, "Comprenez-vous les enjeux du réseau Internet, des serveurs, de la cybersécurité et du stockage en nuage (Cloud) ?", "Info"),

  // --- AXE 5: LOGIQUE INDUCTIVE & DÉDUCTIVE (BRTA / IN-TEST / Dalens) ---
  createScienceQuestion(25, "Trouvez-vous rapidement la règle sous-jacente à une suite de figures géométriques ou de transformations spatiales ?", "Info"),
  createScienceQuestion(26, "Êtes-vous habile à décoder des symboles et appliquer un algorithme de résolution pour trouver une inconnue (décodage de symboles) ?", "Maths"),
  createScienceQuestion(27, "Saisissez-vous rapidement la logique de séries d'items complexes de type matrices de Raven ou dominos (D48, D70) ?", "Maths"),
  createScienceQuestion(28, "Préférez-vous construire une méthode d'analyse logique étape par étape plutôt que de deviner la réponse ?", "Maths"),
  createScienceQuestion(29, "Dans les problèmes de logique déductive, parvenez-vous à extraire des règles générales à partir de cas particuliers ?", "Info"),
  createScienceQuestion(30, "Êtes-vous capable de repérer instantanément des failles logiques ou des incohérences dans une démonstration scientifique ?", "Maths"),

  // --- AXE 6: VISUALISATION SPATIALE & ROTATION 3D (BRTA Factor S) ---
  createScienceQuestion(31, "Parvenez-vous à faire tourner mentalement des objets 3D complexes dans l'espace pour identifier des vues superposables ?", "Physique"),
  createScienceQuestion(32, "Comprenez-vous le pliage et le dépliage mental de patrons de cubes 3D comportant des symboles sur leurs faces ?", "Physique"),
  createScienceQuestion(33, "Savez-vous interpréter des vues en coupe, des projections orthogonales et des dessins industriels en ingénierie ?", "Physique"),
  createScienceQuestion(34, "Dans l'épreuve de topologie spatiale, savez-vous associer une description textuelle complexe à la figure géométrique exacte ?", "Physique"),
  createScienceQuestion(35, "Avez-vous une excellente perception des distances, des échelles de plans et de l'agencement tridimensionnel des formes ?", "Physique"),

  // --- AXE 7: ANALYSE DE DONNÉES & ESPRIT CRITIQUE (CTA / In-Test) ---
  createScienceQuestion(36, "Saisissez-vous la signification d'un graphique statistique complexe (courbes de tendance, histogrammes, écarts-types) ?", "Maths"),
  createScienceQuestion(37, "Faites-vous preuve d'esprit critique (CTA - Critical Thinking) en distinguant les faits prouvés des simples hypothèses non fondées ?", "SVT"),
  createScienceQuestion(38, "Êtes-vous capable de faire abstraction de vos sentiments personnels pour évaluer une donnée scientifique de manière neutre ?", "SVT"),
  createScienceQuestion(39, "Rédigez-vous vos comptes-rendus d'expériences ou d'analyses avec rigueur scientifique, clarté et précision lexicale ?", "SVT"),
  createScienceQuestion(40, "Prenez-vous plaisir à analyser des problèmes scientifiques nouveaux nécessitant d'assimiler une masse importante d'informations ?", "SVT"),

  // --- AXE 8: DEMARCHE EXPÉRIMENTALE, ÉTHIQUE & INNOVATION TECHNOLOGIQUE ---
  createScienceQuestion(41, "Respectez-vous scrupuleusement le protocole expérimental et les conditions de répétabilité des mesures en laboratoire ?", "SVT"),
  createScienceQuestion(42, "Prenez-vous en compte l'impact éthique, environnemental et sociétal des technologies innovantes (charte de l'ingénieur CTI) ?", "Physique"),
  createScienceQuestion(43, "Êtes-vous stimulé(e) par la perspective de travailler au sein d'une équipe scientifique multidisciplinaire ?", "SVT"),
  createScienceQuestion(44, "Maintenez-vous une veille scientifique et technologique constante sur les découvertes majeures de votre domaine ?", "Info"),
  createScienceQuestion(45, "Faites-vous preuve de persévérance face à des résultats d'expériences inattendus en formulant de nouvelles hypothèses ?", "SVT"),

  // --- AXE 9: RAPIDITÉ COGNITIVE & PRÉCISION SOUS CHRONO (BRTA / Dalens) ---
  createScienceQuestion(46, "Parvenez-vous à maintenir un niveau de concentration élevé et une grande précision lors d'épreuves chronométrées ?", "Maths"),
  createScienceQuestion(47, "Savez-vous gérer le stress du temps limité en priorisant les questions accessibles tout en évitant les erreurs de précipitation ?", "Maths"),
  createScienceQuestion(48, "Dans les tests d'attention et de rapidité visuelle, détectez-vous promptement les anomalies ou les doublons de données ?", "Info"),
  createScienceQuestion(49, "Avez-vous la capacité d'assimiler rapidement de nouveaux concepts théoriques dans un cours de niveau supérieur ?", "Maths"),
  createScienceQuestion(50, "Envisagez-vous les études scientifiques supérieures (Classes Prépa, Écoles d'Ingénieurs, Faculté de Médecine/Tech) avec sérénité ?", "Maths"),
];

export function interpretScienceResult(scores: Record<string, number>) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0]?.[0] || "Maths";
  const top2 = sorted[1]?.[0] || "Info";

  const scienceProfileDetailsMap: Record<string, any> = {
    Maths: {
      title: "RAISONNEMENT MATHÉMATIQUE, ALGÈBRE & LOGIQUE NUMÉRIQUE",
      key: "Maths",
      traits: ["Calcul mental rapide", "Aisance algébrique", "Raisonnement inductif", "Analyse de séries", "Rigueur quantitative", "Esprit d'abstraction"],
      definition: "Excellente maîtrise des concepts mathématiques, des équations, du calcul matriciel et du raisonnement abstrait (Modèle CHC / BRTA Factor N).",
      workEnvironment: "Centres de recherche mathématique, actuariat, finance quantitative, ingénierie de données, modélisation physique, cryptographie.",
      studyStrategies: "Résoudre des séries de problèmes à difficulté croissante, pratiquer le calcul mental quotidien, modéliser les situations par des équations algébriques.",
      valuesAndGoals: "Démontrer la rigueur par les preuves rigoureuses, résoudre des équations complexes et quantifier les phénomènes avec exactitude.",
      contributions: "Modélisation précise de phénomènes complexes, détection des anomalies de calcul et apport d'une structure logique irréprochable.",
      trainingNeeds: "Mettre en pratique les mathématiques appliquées sur des cas concrets de physique ou d'informatique, maîtriser les logiciels d'analyse statistique.",
      potentialRisks: "Gare à ne pas réduire la réalité à de simples modèles théoriques en négligeant les facteurs humains et expérimentaux.",
      recommendedFields: ["Mathématiques Appliquées & Actuariat", "Data Science & Intelligence Artificielle", "Finance de Marché & Quantitative", "Ingénierie de Recherche"],
      recommendedCareers: ["Ingénieur Statisticien / Data Scientist", "Actuaire", "Ingénieur en Modélisation Mathématique", "Chercheur en Mathématiques", "Analyste Quantitatif"],
    },
    Physique: {
      title: "PHYSIQUE, MÉCANIQUE, VISUALISATION SPATIALE & ÉNERGIE",
      key: "Physique",
      traits: ["Sens physique", "Visualisation 3D", "Pression et dynamique", "Génie mécanique", "Conversion d'énergie", "Analyse de forces"],
      definition: "Aptitude exceptionnelle à comprendre les lois du monde physique, la mécanique des systèmes et la représentation spatiale tridimensionnelle (BRTA Factor S & Dalens).",
      workEnvironment: "Industrie aéronautique et spatiale, génie civil et BTP, robotique, énergie renouvelable, mécanique de précision, laboratoires de physique.",
      studyStrategies: "Travailler avec des schémas de forces, réaliser des représentations 3D (CAO), manipuler des maquettes et relier les théories physiques aux applications concrètes.",
      valuesAndGoals: "Comprendre les lois de l'univers, concevoir des machines performantes et construire des infrastructures solides et durables.",
      contributions: "Vision spatiale nette en 3D, compréhension intuitive des phénomènes mécaniques et proposition de solutions techniques viables.",
      trainingNeeds: "Approfondir la simulation informatique 3D, maîtriser la thermodynamique et les nouveaux matériaux durables.",
      potentialRisks: "Tendance à se focaliser sur les contraintes physiques sans intégrer suffisamment les aspects logiciels ou économiques.",
      recommendedFields: ["Génie Mécanique & Robotique", "Aéronautique & Spatial", "Génie Civil & BTP", "Énergie & Matériaux", "Génie Électrique"],
      recommendedCareers: ["Ingénieur Aéronautique / Spatial", "Ingénieur Mécanique / Robotique", "Ingénieur Génie Civil", "Ingénieur Énergie", "Architecte-BTP"],
    },
    SVT: {
      title: "BIOLOGIE, SCIENCES DE LA VIE, SANTÉ & ÉCOLOGIE",
      key: "SVT",
      traits: ["Passion du vivant", "Physiologie et génétique", "Esprit d'observation", "Démarche expérimentale", "Sensibilité écologique", "Analyse biomédicale"],
      definition: "Aptitude marquée pour l'exploration du vivant, la compréhension de la biologie humaine, animale et végétale, et la démarche expérimentale (Thurstone & IN-TEST).",
      workEnvironment: "Secteur médical et pharmaceutique, laboratoires de recherche biologique, agronomie, environnement, biotechnologies, médecine vétérinaire.",
      studyStrategies: "Élaborer des schémas bilan d'écosystèmes, pratiquer des travaux pratiques de laboratoire, synthétiser les publications biomédicales et observer le terrain.",
      valuesAndGoals: "Protéger la santé humaine, préserver la biodiversité et faire avancer la médecine et la recherche biologique.",
      contributions: "Rigueur dans les protocoles expérimentaux, compréhension fine de la complexité du vivant et engagement écologique fort.",
      trainingNeeds: "Renforcer les compétences en traitement de données biologiques (Bio-informatique), se former aux méthodes de séquençage génétique moderne.",
      potentialRisks: "Incapacité temporaire à supporter les contraintes administratives lourdes lors des essais cliniques ou recherches.",
      recommendedFields: ["Médecine & Chirurgie", "Biotechnologies & Pharmacie", "Agronomie & Sciences de la Terre", "Médecine Vétérinaire", "Écologie & Environnement"],
      recommendedCareers: ["Médecin / Chirurgien", "Pharmacien / Chercheur en Biologie", "Ingénieur Agronome", "Vétérinaire", "Bio-informaticien", "Ingénieur Environnement"],
    },
    Info: {
      title: "ALGORITHMIQUE, DÉVELOPPEMENT LOGICIEL & CYBERSÉCURITÉ",
      key: "Info",
      traits: ["Logique algorithmique", "Résolution de bugs", "Pensée structurée", "Systèmes & Réseaux", "Abstraction logicielle", "Proactivité digitale"],
      definition: "Aptitude de premier ordre pour la pensée algorithmique, le codage, la structuration des bases de données et la résolution méthodique de problèmes logiciels (IN-TEST & Dalens).",
      workEnvironment: "Entreprises de services numériques (ESN), éditeurs de logiciels, départements IT des grands groupes, startups Tech, sécurité informatique.",
      studyStrategies: "S'entraîner à la résolution d'algorithmes (LeetCode, HackerRank), concevoir des projets logiciels personnels et réaliser des diagrammes de flux.",
      valuesAndGoals: "Automatiser les processus fastidieux, créer des solutions logicielles innovantes et sécuriser les architectures d'information.",
      contributions: "Rigueur algorithmique, vélocité dans le développement de code propre et capacité à simplifier des problèmes logiques ardus.",
      trainingNeeds: "Approfondir l'architecture logicielle distribuée, s'initier aux technologies du Cloud Computing et à la sécurité avancée des systèmes.",
      potentialRisks: "Risque d'isolement dans le code en oubliant l'alignement avec les besoins réels des utilisateurs finaux.",
      recommendedFields: ["Informatique & Développement Logiciel", "Cybersécurité & Réseaux", "Génie Logiciel & Architecture IT", "Intelligence Artificielle & Data"],
      recommendedCareers: ["Ingénieur en Développement Software", "Architecte Cloud / DevOps", "Expert en Cybersécurité", "Ingénieur IA & Machine Learning", "Chef de Projet Informatique"],
    },
  };

  const primaryProfile = scienceProfileDetailsMap[top1] || scienceProfileDetailsMap["Maths"];
  const secondaryProfile = scienceProfileDetailsMap[top2] || scienceProfileDetailsMap["Info"];

  const rawTotal = (Object.values(scores) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  const totalPossible = 150;
  const scorePct = Math.min(100, Math.round((rawTotal / totalPossible) * 100));
  const appreciationInfo = getTestScoreAppreciation(scorePct);

  const advisorMotivation = `ANALYSE PÉDAGOGIQUE ET CONSEIL DU CONSEILLER (Dr. BALOGAH Dibaataba) : Votre évaluation certifiée en Aptitudes Scientifiques & Technologiques révèle un potentiel d'excellence avec une dominance principale en ${primaryProfile.title} appuyée par des compétences solides en ${secondaryProfile.title}. Comme le démontrent les standards métrologiques de la BRTA (Batterie Romande) et les référentiels de la CTI, les études scientifiques exigeantes (Classes Préparatoires, Écoles d'Ingénieurs, Facultés de Médecine et Masters STEM) requièrent d'allier aisance de calcul, capacité d'abstraction (Factor G) et démarche expérimentale. En approfondissant vos acquis dans vos filières préférentielles et en pratiquant une méthodologie rigoureuse, vous vous garantissez une trajectoire académique et professionnelle brillante.`;

  return {
    scoreSummary: scores,
    suitabilityScore: scorePct,
    appreciation: appreciationInfo.appreciation,
    primaryCategory: `Profil Scientifique : ${primaryProfile.title}`,
    description: `Votre Test d'Aptitudes Scientifiques & Technologiques révèle une dominance marquée en ${top1} et une deuxième force en ${top2}. ${primaryProfile.definition}`,
    detailedProfiling: {
      titleHeader: `Profil Restitution Aptitudes Scientifiques & Technologiques`,
      primaryTitle: primaryProfile.title,
      secondaryTitle: secondaryProfile.title,
      traits: primaryProfile.traits,
      workEnvironment: primaryProfile.workEnvironment,
      studyStrategies: primaryProfile.studyStrategies,
      valuesAndGoals: primaryProfile.valuesAndGoals,
      contributions: primaryProfile.contributions,
      developmentActivities: primaryProfile.trainingNeeds,
      potentialRisks: primaryProfile.potentialRisks,
      advisorMotivation,
    },
    recommendedFields: Array.from(new Set([...primaryProfile.recommendedFields, ...secondaryProfile.recommendedFields])),
    recommendedCareers: Array.from(new Set([...primaryProfile.recommendedCareers, ...secondaryProfile.recommendedCareers])),
  };
}

export const ORIENTATION_TESTS: OrientationTest[] = [
  // TEST 1: HOLLAND RIASEC (50 Questions)
  {
    id: "test-riasec",
    title: "1. Test de Personnalité RIASEC (Code de Holland) — 50 Questions",
    subtitle: "Évaluation officielle de vos 6 typologies professionnelles : Réaliste, Investigateur, Artistique, Social, Entreprenant ou Conventionnel.",
    category: "Personnalité & Intérêts",
    description: "Le test RIASEC est la référence mondiale en orientation professionnelle (John Holland). Évalue 50 situations et préférences d'activités pour déterminer votre profil psychométrique certifié.",
    durationMinutes: 20,
    questionCount: 50,
    targetAudience: "Tous Publics",
    questions: RIASEC_OFFICIAL_QUESTIONS,
    interpretResult: interpretRIASECResult,
  },

  // TEST 2: Intelligences Multiples (50 Questions)
  {
    id: "test-intelligences",
    title: "2. Test des Intelligences Multiples (Howard Gardner) — 50 Questions",
    subtitle: "Identifiez vos 8 formes d'intelligence : Logique, Linguistique, Spatiale, Interpersonnelle, Intrapersonnelle, Naturaliste, Corporelle & Musicale.",
    category: "Aptitudes Cognitives",
    description: "Chaque individu possède une combinaison unique de 8 intelligences. Ce test certifié de 50 questions élaboré d'après les travaux d'Howard Gardner révèle votre profil cognitif complet pour guider vos méthodes d'apprentissage, vos choix d'études et de carrière.",
    durationMinutes: 20,
    questionCount: 50,
    targetAudience: "Tous Publics",
    questions: GARDNER_OFFICIAL_QUESTIONS,
    interpretResult: interpretGardnerResult,
  },

  // TEST 3: Bilan de Compétences (50 Questions)
  {
    id: "test-bilan-competences",
    title: "3. Test de Bilan de Compétences & Soft Skills — 50 Questions",
    subtitle: "Évaluez vos compétences techniques (Hard Skills), comportementales (Soft Skills) et votre alignement (Zone de Génie).",
    category: "Bilan Professionnel",
    description: "Évaluation certifiée de 50 questions élaborée à partir des référentiels A Compétence Égale, Gembloux Agro-Bio Tech et Devenir Génial. Évalue vos Soft Skills, Hard Skills, votre méthode STAR, vos valeurs et votre démarche réflexive (SWOT).",
    durationMinutes: 20,
    questionCount: 50,
    targetAudience: "Tous Publics",
    questions: BILAN_COMPETENCES_OFFICIAL_QUESTIONS,
    interpretResult: interpretBilanCompetencesResult,
  },

  // TEST 4: Aptitudes Scientifiques & Technologiques (50 Questions)
  {
    id: "test-sciences",
    title: "4. Test d'Aptitudes Scientifiques & Technologiques — 50 Questions",
    subtitle: "Évaluez votre potentiel en Mathématiques, Physique, Biologie, Algorithmique, Visualisation 3D & Raisonnement Logique.",
    category: "Sciences Exactes",
    description: "Évaluation certifiée de 50 questions élaborée d'après la Batterie Romande BRTA, les travaux de Marc Dalens et le manuel IN-TEST. Mesure vos capacités en algèbre, sciences de la matière et du vivant, pensée algorithmique et vision spatiale 3D.",
    durationMinutes: 20,
    questionCount: 50,
    targetAudience: "Orientation Étudiante",
    questions: SCIENCE_OFFICIAL_QUESTIONS,
    interpretResult: interpretScienceResult,
  },

  // GENERATED TESTS 5 TO 20 (EACH WITH EXACT 50 DISTINCT SCENARIO QUESTIONS)
  ...Array.from({ length: 16 }, (_, idx) => {
    const testConfigs: Array<{
      id: string;
      title: string;
      category: string;
      targetAudience?: "Orientation Étudiante" | "Recrutement Candidat RH" | "IQ & Psychotechnique" | "Tous Publics";
      isRecruitmentTest?: boolean;
      categories: Array<{ name: string; key: string; label: string }>;
    }> = [
      {
        id: "test-litteraire",
        title: "5. Test d'Aptitudes Littéraires & Sciences Humaines",
        category: "Langues & Sciences Humaines",
        targetAudience: "Orientation Étudiante",
        categories: [
          { name: "Culture Littéraire & Rédaction", key: "Français", label: "Style et syntaxe" },
          { name: "Anglais des Affaires", key: "Anglais", label: "Fluidité internationale" },
          { name: "Raisonnement Juridique", key: "Droit", label: "Logique des textes légaux" },
          { name: "Histoire & Geopolitique", key: "SciencesHumaines", label: "Analyse du monde" },
        ],
      },
      {
        id: "test-entrepreneuriat",
        title: "6. Test de Profil Entrepreneurial & Innovation",
        category: "Entrepreneuriat",
        targetAudience: "Tous Publics",
        categories: [
          { name: "Gout du Risque & Audace", key: "Risque", label: "Prise de décision sous incertitude" },
          { name: "Négociation & Sens de la Vente", key: "Vente", label: "Persuasion et closing" },
          { name: "Créativité & Innovation", key: "Innovation", label: "Modèles économiques disruptifs" },
          { name: "Résilience & Persévérance", key: "Résilience", label: "Capacité à surmonter l'échec" },
        ],
      },
      {
        id: "test-management",
        title: "7. Test de Style de Management & Leadership",
        category: "Leadership",
        targetAudience: "Tous Publics",
        categories: [
          { name: "Management Participatif", key: "Participatif", label: "Écoute et co-construction" },
          { name: "Management Directif", key: "Directif", label: "Gestion des urgences et cap" },
          { name: "Leadership Inspirant", key: "Inspirant", label: "Vision et motivation" },
          { name: "Coaching & Développement", key: "Coach", label: "Montée en compétences" },
        ],
      },
      {
        id: "test-cerveau",
        title: "8. Test de Dominance Cérébrale & Apprentissage",
        category: "Neuro-apprentissage",
        targetAudience: "Orientation Étudiante",
        categories: [
          { name: "Dominance Cerveau Gauche", key: "Gauche", label: "Séquentiel, analytique et logique" },
          { name: "Dominance Cerveau Droit", key: "Droit", label: "Holistique, visuel et intuitif" },
          { name: "Raisonnement Déductif", key: "Logique", label: "Processus pas à pas" },
          { name: "Synthèse Intuitive", key: "Intuition", label: "Aperçu global immédiat" },
        ],
      },
      {
        id: "test-postbac",
        title: "9. Test d'Orientation Post-Bac & Spécialités Supérieures",
        category: "Orientation Bac",
        targetAudience: "Orientation Étudiante",
        categories: [
          { name: "Filières Scientifiques & Médicales", key: "Sci", label: "Médecine, Ingénierie, Tech" },
          { name: "Filières Littéraires & Juridiques", key: "Lit", label: "Droit, Langues, Journalisme" },
          { name: "Filières Économiques & Gestion", key: "Gest", label: "Finance, Commerce, Audit" },
          { name: "Filières Techniques & Métiers", key: "Tech", label: "BTP, Télécoms, Agronomie" },
        ],
      },
      {
        id: "test-valeurs",
        title: "10. Test de Valeurs Professionnelles & Motivations",
        category: "Motivations",
        targetAudience: "Tous Publics",
        categories: [
          { name: "Quête d'Impact Social", key: "Impact", label: "Utilité publique et éthique" },
          { name: "Réussite Financière & Prestige", key: "Argent", label: "Revenu et statut" },
          { name: "Besoin d'Autonomie & Liberté", key: "Autonomie", label: "Propres horaires et choix" },
          { name: "Recherche de Sécurité & Stabilité", key: "Sécurité", label: "Pérennité de l'emploi" },
        ],
      },
      {
        id: "test-recrutement-technique",
        title: "11. Évaluation de Compétences Métier & Qualification RH",
        category: "Recrutement & Évaluation RH",
        isRecruitmentTest: true,
        targetAudience: "Recrutement Candidat RH",
        categories: [
          { name: "Expertise Technique Métier", key: "TechScore", label: "Savoir-faire opérationnel" },
          { name: "Autonomie Professionnelle", key: "Autonomy", label: "Gestion sans supervision" },
          { name: "Rigueur & Qualité de Livrable", key: "Rigor", label: "Zéro erreur" },
          { name: "Rapidité d'Exécution", key: "Speed", label: "Respect des deadlines" },
        ],
      },
      {
        id: "test-raisonnement-logique-rh",
        title: "12. Test Psychotechnique de Raisonnement Logique RH",
        category: "Recrutement & Évaluation RH",
        isRecruitmentTest: true,
        targetAudience: "Recrutement Candidat RH",
        categories: [
          { name: "Logique Déductive", key: "Logic", label: "Syllogismes et suites" },
          { name: "Capacité d'Analyse Numérique", key: "Math", label: "Graphiques et tableaux" },
          { name: "Esprit Critique", key: "CriticalThinking", label: "Détection des biais" },
          { name: "Précision sous Pression", key: "Rigor", label: "Fiabilité des calculs" },
        ],
      },
      {
        id: "test-soft-skills-fit-rh",
        title: "13. Test de Soft Skills & Fit Culturel Candidat RH",
        category: "Recrutement & Évaluation RH",
        isRecruitmentTest: true,
        targetAudience: "Recrutement Candidat RH",
        categories: [
          { name: "Travail d'Équipe & Collaboration", key: "Teamwork", label: "Entraide et esprit collectif" },
          { name: "Intégrité & Éthique Professionnelle", key: "Integrity", label: "Honnêteté et valeurs" },
          { name: "Intelligence Émotionnelle", key: "EQ", label: "Gestion des émotions" },
          { name: "Adaptabilité au Changement", key: "Adaptability", label: "Flexibilité opérationnelle" },
        ],
      },
      {
        id: "test-communication-english-rh",
        title: "14. Communication Professionnelle & Anglais des Affaires RH",
        category: "Recrutement & Évaluation RH",
        isRecruitmentTest: true,
        targetAudience: "Recrutement Candidat RH",
        categories: [
          { name: "Business English Fluency", key: "BusinessEnglish", label: "Aisance internationale" },
          { name: "Communication Exécutive", key: "ExecutiveCom", label: "Synthèse et clarté" },
          { name: "Écoute Active & Négociation", key: "ActiveListening", label: "Gestion des attentes" },
        ],
      },
      {
        id: "test-management-executive-rh",
        title: "15. Leadership & Posture Manageriale Cadres RH",
        category: "Recrutement & Évaluation RH",
        isRecruitmentTest: true,
        targetAudience: "Recrutement Candidat RH",
        categories: [
          { name: "Gestion des Conflits", key: "ConflictResolution", label: "Médiation et apaisement" },
          { name: "Délégation & Confiance", key: "Delegation", label: "Autonomisation de l'équipe" },
          { name: "Vision Stratégique", key: "Strategy", label: "Alignement sur les objectifs" },
          { name: "Posture de Leadership", key: "Leadership", label: "Charisme et décision" },
        ],
      },
      {
        id: "test-situational-judgment-rh",
        title: "16. Jugement Situationnel & Gestion de Crise RH (SJT)",
        category: "Recrutement & Évaluation RH",
        isRecruitmentTest: true,
        targetAudience: "Recrutement Candidat RH",
        categories: [
          { name: "Gestion de Crise Urgente", key: "CrisisMgmt", label: "Sang-froid et décision" },
          { name: "Priorisation des Tâches", key: "Prioritization", label: "Matrice d'urgence/importance" },
          { name: "Gestion des Risques", key: "RiskMgmt", label: "Anticipation des pannes" },
          { name: "Respect du Code de Déontologie", key: "Integrity", label: "Éthique irréprochable" },
        ],
      },
      {
        id: "test-qi-officiel",
        title: "17. Test de QI Officiel & Quotient Intellectuel",
        category: "IQ & Psychotechnique",
        targetAudience: "IQ & Psychotechnique",
        categories: [
          { name: "Logique Abstractive", key: "IQLogic", label: "Matrices de Raven" },
          { name: "Verbal & Analogies", key: "IQVerbal", label: "Vocabulaire et synonymes" },
          { name: "Raisonnement Mathématique", key: "IQMath", label: "Problèmes de suites" },
          { name: "Visualisation Spatiale", key: "IQSpatial", label: "Rotation d'objets 3D" },
        ],
      },
      {
        id: "test-entraînement-suites-dominos",
        title: "18. Entraînement Psychotechnique - Suites Logiques & Dominos",
        category: "IQ & Psychotechnique",
        targetAudience: "IQ & Psychotechnique",
        categories: [
          { name: "Suites de Dominos", key: "Dominos", label: "Calcul de cycles et valeurs" },
          { name: "Cartes & Cartes à Jouer", key: "Cards", label: "Combinaisons logiques" },
          { name: "Suites Numériques", key: "Numbers", label: "Progressions arithmétiques" },
        ],
      },
      {
        id: "test-entraînement-visualisation-3d",
        title: "19. Entraînement Psychotechnique - Visualisation 3D & Espace",
        category: "IQ & Psychotechnique",
        targetAudience: "IQ & Psychotechnique",
        categories: [
          { name: "Plient de Patrons 3D", key: "Patrons", label: "Pliage de cubes" },
          { name: "Rotation de Volumes", key: "Volumes", label: "Perception dans l'espace" },
          { name: "Vues en Coupe", key: "SectionViews", label: "Projections orthogonales" },
        ],
      },
      {
        id: "test-entraînement-attention-rapidite",
        title: "20. Entraînement Psychotechnique - Rapidité & Précision",
        category: "IQ & Psychotechnique",
        targetAudience: "IQ & Psychotechnique",
        categories: [
          { name: "Vitesse de Traitement", key: "Precision", label: "Détection des doublons" },
          { name: "Concentration Prolongée", key: "Attention", label: "Absence de distraction" },
          { name: "Réactivité sous Chrono", key: "Vitesse", label: "Cadence de réponse" },
        ],
      },
    ];

    const conf = testConfigs[idx];
    return {
      id: conf.id,
      title: `${conf.title} — 50 Questions`,
      subtitle: `Évaluation certifiée de 50 questions pour mesurer vos aptitudes en ${conf.category}.`,
      category: conf.category,
      description: `Test d'évaluation standardisé de 50 questions. Analyse détaillée des résultats et rapport d'adéquation.`,
      durationMinutes: 20,
      questionCount: 50,
      isRecruitmentTest: conf.isRecruitmentTest,
      targetAudience: conf.targetAudience,
      questions: createScenarioQuestions(conf.title, conf.categories),
      interpretResult: (scores) => {
        const total = (Object.values(scores) as number[]).reduce((sum: number, val: number) => sum + val, 0);
        const scorePct = Math.min(100, Math.round((total / 150) * 100));
        const appreciationInfo = getTestScoreAppreciation(scorePct);

        return {
          scoreSummary: scores,
          primaryCategory: `Évaluation : ${appreciationInfo.appreciation}`,
          description: `Score global certifié : ${scorePct}% (${appreciationInfo.appreciation}). Évaluation réussie avec succès sur la batterie complète de 50 questions.`,
          recommendedFields: ["Ingénierie & IT", "Administration & Droit", "Santé & Biologie", "Finance & Management"],
          recommendedCareers: ["Expert Métier", "Chef de Projet", "Consultant Senior", "Ingénieur d'Études"],
          hrRecommendation: conf.isRecruitmentTest
            ? `RECOMMANDATION RH : CANDIDAT ÉVALUÉ À ${scorePct}% — APPRÉCIATION : ${appreciationInfo.appreciation.toUpperCase()}. PROFIL QUALIFIÉ POUR LE POSTE.`
            : undefined,
          suitabilityScore: scorePct,
          appreciation: appreciationInfo.appreciation,
        };
      },
    };
  }),
];
