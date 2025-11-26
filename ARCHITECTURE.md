# 📚 Architecture et Fonctionnement de votre Portfolio V2

## 🎯 Vue d'ensemble

Votre site est un **site statique généré** avec **Jekyll**, un générateur de sites statiques écrit en Ruby. C'est comme un "compilateur" qui transforme vos fichiers de configuration et templates en HTML/CSS/JS prêts à être servis.

---

## 🛠️ Technologies utilisées

### **1. Jekyll (Générateur de site statique)**
- **Langage** : Ruby
- **Rôle** : Transforme vos fichiers `.md`, `.yml`, `.html` en site web statique
- **Avantage** : Rapide, sécurisé, pas de base de données, gratuit sur GitHub Pages

### **2. Liquid (Moteur de templates)**
- **Rôle** : Langage de template utilisé par Jekyll
- **Syntaxe** : `{{ variable }}` pour afficher, `{% if %}...{% endif %}` pour la logique
- **Exemple** : `{{ site.name }}` affiche "Nathan Pizzetta"

### **3. YAML (Format de données)**
- **Fichiers** : `_data/*.yml`, `_config.yml`
- **Rôle** : Stocke vos données (projets, expériences, traductions)
- **Avantage** : Facile à modifier, lisible, structuré

### **4. CSS/JavaScript**
- **CSS** : `css/v2.css` (styles personnalisés)
- **JavaScript** : Inline dans `_layouts/v2.html` (interactivité)

---

## 📁 Structure du Projet

```
nathan.directory/
│
├── _config.yml          # ⚙️ Configuration globale (titre, analytics, etc.)
├── Gemfile              # 📦 Dépendances Ruby (Jekyll, webrick)
│
├── _layouts/            # 🎨 Templates HTML
│   └── v2.html          # Template principal de votre V2
│
├── _data/               # 📊 Données structurées (YAML)
│   ├── portfolio.yml    # Projets, traductions EN/FR
│   ├── experiences.yml  # Expériences professionnelles
│   └── studies.yml      # Parcours académique
│
├── _plugins/            # 🔌 Extensions Jekyll
│   └── i18n_filter.rb  # Plugin de traduction personnalisé
│
├── _includes/           # 🧩 Composants réutilisables
│   └── analytics.html   # Code Google Analytics
│
├── css/                 # 🎨 Styles
│   └── v2.css           # Tous vos styles personnalisés
│
├── assets/              # 🖼️ Ressources statiques
│   ├── images/          # Images, GIFs, photos
│   └── CV_nathan_pizzetta.pdf
│
├── en.md                # 📄 Page anglaise (permalink: /en/)
├── fr.md                # 📄 Page française (permalink: /fr/)
├── index.html           # 🏠 Page d'accueil (redirection automatique)
│
└── _site/               # 📦 Site généré (créé automatiquement)
    └── [HTML/CSS/JS compilés]
```

---

## 🔄 Flux de Fonctionnement

### **1. Développement Local**

```bash
bundle exec jekyll serve --livereload
```

**Ce qui se passe :**
1. Jekyll lit `_config.yml` pour la configuration
2. Lit tous les fichiers dans `_data/` (portfolio, experiences, studies)
3. Charge le plugin `i18n_filter.rb` pour les traductions
4. Pour chaque page (en.md, fr.md) :
   - Utilise le layout `v2.html`
   - Injecte les données depuis `_data/`
   - Applique les traductions avec le filtre `| t: page.lang`
   - Génère le HTML final
5. Copie les assets (CSS, images) dans `_site/`
6. Le site est accessible sur `http://localhost:4000`

### **2. Build de Production**

```bash
bundle exec jekyll build
```

**Ce qui se passe :**
1. Même processus que le serveur local
2. Génère tous les fichiers HTML statiques dans `_site/`
3. Le dossier `_site/` contient votre site complet, prêt à être déployé

### **3. Déploiement**

**Sur GitHub Pages ou Cloudflare Pages :**
1. Le service exécute `bundle exec jekyll build`
2. Récupère le contenu de `_site/`
3. Le sert comme site web statique

---

## 🧩 Composants Clés

### **1. _config.yml (Configuration Globale)**

```yaml
name: Nathan Pizzetta
url: https://nathan.directory
ga:
  account: 'G-5S13RSPXSY'  # Google Analytics
```

**Rôle** : Configuration accessible partout via `{{ site.name }}`, `{{ site.url }}`, etc.

### **2. _data/portfolio.yml (Traductions et Projets)**

```yaml
en:
  project1:
    title: "Airport Traffic Analysis"
fr:
  project1:
    title: "Analyse du trafic aérien"
```

**Rôle** : Stocke toutes les traductions et données des projets. Accessible via `site.data.portfolio`

### **3. _plugins/i18n_filter.rb (Plugin de Traduction)**

```ruby
def t(key, lang = nil)
  # Récupère la traduction depuis portfolio.yml
  # Exemple: "project1.title" | t: "en" → "Airport Traffic Analysis"
end
```

**Rôle** : Permet d'utiliser `{{ "project1.title" | t: page.lang }}` dans les templates

### **4. _layouts/v2.html (Template Principal)**

**Structure :**
- `<head>` : Analytics, CSS, meta tags
- Sidebar drawer (bannière gauche) : Profil, liens sociaux
- Contenu principal : Tabs (Portfolio, Studies, Experiences)
- JavaScript : Gestion des tabs, drawer, navigation

**Liquid utilisé :**
- `{% for project in site.data.portfolio.projects %}` : Boucle sur les projets
- `{{ "project1.title" | t: page.lang }}` : Traduction dynamique
- `{% if experience.featured %}` : Conditions

### **5. en.md et fr.md (Pages d'Entrée)**

```yaml
---
layout: v2
permalink: /en/
lang: en
---
```

**Rôle** : 
- Définit quelle langue utiliser (`lang: en` ou `lang: fr`)
- Spécifie le layout à utiliser (`layout: v2`)
- Définit l'URL finale (`permalink: /en/`)

### **6. index.html (Page d'Accueil)**

**Rôle** : Redirige automatiquement vers `/en/` ou `/fr/` selon la langue du navigateur

---

## 🌐 Système d'Internationalisation (i18n)

### **Comment ça marche :**

1. **Deux pages séparées** : `en.md` et `fr.md`
2. **Données traduites** : Dans `_data/portfolio.yml` avec clés `en:` et `fr:`
3. **Filtre de traduction** : `{{ "key" | t: page.lang }}`
4. **Détection automatique** : `index.html` détecte la langue du navigateur

### **Exemple concret :**

```liquid
<!-- Dans v2.html -->
<h3>{{ "project1.title" | t: page.lang }}</h3>

<!-- Si page.lang = "en" -->
<h3>Airport Traffic Analysis</h3>

<!-- Si page.lang = "fr" -->
<h3>Analyse du trafic aérien</h3>
```

---

## 🎨 Système de Design

### **Glassmorphism**
- Fond transparent : `rgba(0, 0, 0, 0.6)`
- Effet de flou : `backdrop-filter: blur(10px)`
- Utilisé pour : Sidebar, cartes de projets, timeline

### **Responsive Design**
- Desktop : 3 colonnes pour les projets
- Tablet : 2 colonnes
- Mobile : 1 colonne, sidebar en overlay

### **Animations**
- Transitions CSS : `transition: all 0.4s cubic-bezier(...)`
- Hover effects : Transform, scale, shadow
- Flip card : Pour l'expérience hackathon Google

---

## 🔌 Fonctionnalités JavaScript

### **1. Gestion du Drawer (Sidebar)**
```javascript
function toggleDrawer() {
    // Ouvre/ferme la bannière gauche
    // Adapte le contenu principal
}
```

### **2. Système de Tabs**
```javascript
function switchTab(tabName) {
    // Change entre Portfolio, Studies, Experiences
    // Sauvegarde dans sessionStorage
}
```

### **3. Navigation depuis Studies vers Experiences**
```javascript
function navigateToExperience(experienceId) {
    // Change de tab
    // Scroll vers l'expérience
    // Ajoute un effet de highlight
}
```

### **4. Détection de Langue**
```javascript
// Dans index.html
const lang = navigator.language;
// Redirige vers /en/ ou /fr/
```

---

## 📊 Flux de Données

```
_config.yml
    ↓
[Configuration globale]
    ↓
_data/portfolio.yml ──┐
_data/experiences.yml ─┼──→ Jekyll ──→ _layouts/v2.html ──→ HTML final
_data/studies.yml ─────┘
    ↓
[Liquid templates]
    ↓
[Traductions via i18n_filter.rb]
    ↓
_site/index.html
_site/en/index.html
_site/fr/index.html
```

---

## 🚀 Déploiement

### **GitHub Pages**
1. Push sur la branche `main`
2. GitHub exécute Jekyll automatiquement
3. Site accessible sur `https://nathan.directory`

### **Cloudflare Pages**
1. Build command : `bundle exec jekyll build`
2. Output directory : `_site`
3. Cloudflare sert le contenu de `_site/`

---

## 🎯 Points Clés à Retenir

1. **Jekyll = Compilateur** : Transforme vos fichiers en site web
2. **YAML = Base de données** : Toutes vos données sont dans `_data/`
3. **Liquid = Templates** : Permet d'injecter les données dans le HTML
4. **Site statique** : Pas de serveur, pas de base de données, juste des fichiers HTML/CSS/JS
5. **i18n intégré** : Deux langues gérées automatiquement
6. **Développement local** : `bundle exec jekyll serve` pour tester
7. **Build** : `bundle exec jekyll build` pour générer `_site/`

---

## 🔧 Modifier le Contenu

### **Ajouter un projet :**
→ Modifier `_data/portfolio.yml` (section `project8`)

### **Ajouter une expérience :**
→ Modifier `_data/experiences.yml` (nouvelle entrée en haut)

### **Changer les styles :**
→ Modifier `css/v2.css`

### **Modifier le layout :**
→ Modifier `_layouts/v2.html`

### **Changer la configuration :**
→ Modifier `_config.yml`

---

## 📝 Résumé en une phrase

**Jekyll lit vos fichiers YAML de données, les injecte dans le template HTML via Liquid, génère des fichiers HTML statiques dans `_site/`, et ces fichiers sont servis comme un site web normal.**

