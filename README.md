# OrientaAfrik - Plateforme d'Orientation Scolaire, Professionnelle et Certification

OrientaAfrik est une plateforme web d'information, d'orientation scolaire et professionnelle, et de certification VAE conçue par le **Docteur BALOGAH Dibaataba** (Lomé, Togo).

## 🚀 Fonctionnalités Principales

- **Tests d'Orientation & Psychométrie** :
  - Test d'orientation BAC & BEPC
  - Test des Intelligences Multiples (Modèle Howard Gardner)
  - Test de Personnalité et Intérêts Professionnels (Typologie RIASEC de Holland)
  - Test de Quotient Intellectuel (QI) & logique
- **Observatoire des 2 000 Métiers Porteurs** :
  - Fiches détaillées, salaires moyens, compétences requises et débouchés en Afrique et à l'international.
- **Annuaire des Universités & Bourses** :
  - Répertoire des universités et grandes écoles (Togo, Sénégal, Bénin, Côte d'Ivoire, Maroc, France, Canada...).
  - Guide des bourses d'études et simulateur de budget de vie étudiante.
- **Simulateurs de Moyennes & Bilan d'Aptitudes** :
  - Calculs des coefficients et critères d'admission pour facultés et filières sélectives.
- **Génération de Bilans Certifiés PDF & QR Code** :
  - Téléchargement instantané des bilans d'aptitudes certifiés au format PDF.
- **Espace Entreprise & Recrutement** :
  - Matching candidats et tests de présélection.

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React, Recharts, D3.js, jsPDF, html2canvas, QRCode
- **Backend & Serveur** : Node.js, Express, Vite en mode middleware
- **Base de Données & Auth** : Firebase Authentication & Cloud Firestore
- **Intelligence Artificielle** : Google Gemini API (`@google/genai`)

## 📦 Installation et Démarrage

### Prérequis
- Node.js version 18 ou supérieure
- Gestionnaire de paquets `npm`

### 1. Cloner ou décompresser le projet
```bash
unzip orientaafrik-source-code.zip
cd react-example
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Copiez `.env.example` vers `.env` et renseignez vos clés si nécessaire :
```bash
cp .env.example .env
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`.

### 5. Compiler pour la production
```bash
npm run build
npm start
```

---
© Cabinet Docteur BALOGAH Dibaataba - OrientaAfrik. Tous droits réservés.
