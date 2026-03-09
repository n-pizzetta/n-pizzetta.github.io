# Nathan Pizzetta — Portfolio

Portfolio personnel bilingue (FR/EN) construit avec Jekyll, déployé sur [nathan.directory](https://nathan.directory).

## Prérequis

- **Ruby** (2.7+)
- **Bundler** (`gem install bundler`)

## Lancer en local

```bash
# Installer les dépendances
bundle install

# Lancer le serveur de développement avec rechargement automatique
bundle exec jekyll serve --livereload
```

Le site est accessible sur **http://localhost:4000**.

## Build de production

```bash
bundle exec jekyll build
```

Les fichiers générés se trouvent dans le dossier `_site/`.

## Déploiement

- **GitHub Pages** : push sur `main`, GitHub build automatiquement
- **Cloudflare Pages** : build command `bundle exec jekyll build`, output `_site`

## Structure du projet

```
.
├── _config.yml          # Configuration Jekyll (meta, liens, analytics)
├── _layouts/v2.html     # Template principal (HTML + JS)
├── _includes/           # Fragments réutilisables (analytics)
├── _plugins/            # Plugin i18n (traductions)
├── _data/
│   ├── portfolio.yml    # Projets (FR/EN)
│   ├── experiences.yml  # Expériences pro (FR/EN)
│   └── studies.yml      # Formation (FR/EN)
├── css/v2.css           # Feuille de style unique
├── assets/images/       # Images et favicons
├── index.html           # Détection de langue + redirection
├── fr.md                # Page française
└── en.md                # Page anglaise
```

## Technologies

- **Jekyll 4.4** — Générateur de site statique
- **Bootstrap 5.1** — Grille et utilitaires (CDN)
- **Font Awesome 5.15** — Icônes (CDN)
- **Google Fonts** — Open Sans
- **Google Analytics 4** + **Plausible.io** — Analytics
