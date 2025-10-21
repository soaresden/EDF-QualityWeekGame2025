# 🌊 Quality Control - Offshore Wind Game

Un jeu pédagogique interactif pour sensibiliser à l'importance de la qualité en production éolienne marine. Incarnez un technicien qualité face au dilemme productivité vs qualité.

## 🎮 Concept

Vous êtes technicien qualité chez EDF. Chaque jour, inspectez des produits éoliens marins tout en respectant un quota financier. Mais attention: plus vous inspectez, plus vous perdez du temps... et donc de l'argent!

**L'enjeu pédagogique:** Montrer que couper les coins sur la qualité peut générer des pertes bien plus importantes que prévu.

## ✨ Fonctionnalités

- 🔍 **Système d'inspection avancé** avec loupe interactive (zoom au survol)
- ⏰ **Progression temporelle** avec barre de décompte fluide
- 💰 **Système financier complet** (salaire, charges, revenus produits)
- 📈 **Difficulté progressive** (jours 1-5, impossibilité croissante)
- 🛠️ **Système d'upgrades** (meilleure loupe, détection rapide, outils)
- 🌐 **Support multilingue** (Français/Anglais) avec fichiers séparés
- 📱 **Responsive design** (desktop, tablet, mobile)
- 🎨 **Flat design** avec couleurs EDF (#09367A, #00A8E9)

## 📂 Structure du projet

```
EDF-QualityWeekGame2025/
├── index.html                 # Point d'entrée principal
├── README.md                  # Ce fichier
├── package.json               # Dépendances (optionnel)
├── css/
│   ├── main.css              # Styles principaux
│   ├── animations.css        # Animations (fadeout, popup, zoom)
│   └── responsive.css        # Media queries
├── js/
│   ├── app.js                # Point d'entrée JavaScript
│   ├── game.js               # Logique de jeu
│   ├── ui.js                 # Gestion de l'interface
│   ├── i18n.js               # Système de traduction
│   ├── upgrades.js           # Système d'upgrades
│   └── utils.js              # Fonctions utilitaires
├── lang/
│   ├── french.json           # Traductions français
│   └── english.json          # Traductions anglais
├── assets/
│   ├── icons/                # Icônes et symboles
│   ├── sounds/               # Bruitages (optionnel)
│   └── images/               # Images de produits
└── .gitignore
```

## 🚀 Installation

### Développement local

```bash
# Cloner le repo
git clone https://github.com/soaresden/EDF-QualityWeekGame2025.git
cd EDF-QualityWeekGame2025

# Ouvrir dans un navigateur (aucune dépendance backend requise)
# Option 1: Double-cliquer sur index.html
# Option 2: Serveur local (Python)
python -m http.server 8000
# puis visitez http://localhost:8000
```

### Déploiement

Le jeu est un **pur HTML5/CSS3/JavaScript**, déployable sur:
- **GitHub Pages** (gratuit)
- **Netlify** (gratuit)
- **Vercel** (gratuit)
- Tout serveur HTTP classique

## 🎯 Règles du jeu

### Mécanique principale
1. Vous avez **8 heures par jour** (barre de temps)
2. Des produits éoliens marins arrivent
3. **Inspectez-les** en passant la loupe dessus
4. Trouvez les défauts (mineur/moyen/majeur)
5. Validez votre décision (bon/mauvais)

### Finances
- **Revenu journalier:** 150€ (salaire)
- **Charges journalières:** 400€ (fixes)
- **Revenu par produit:** 20-100€ selon type/qualité
- **Objectif:** Atteindre 2000€/jour

### Progression
- **Jour 1-2:** Facile (peu de défauts, temps abondant)
- **Jour 3-4:** Moyen (défauts cachés, pression temps)
- **Jour 5:** Difficile (presque impossible!)

### Défauts à détecter
- **Mineurs** (⚠️): Rayures, usure légère
- **Moyens** (⚠️): Fissures, désalignement
- **Majeurs** (❌): Corrosion, fuites

## 🎮 Contrôles

- **Souris:** Déplacer la loupe, survoler les produits
- **Clic gauche:** Valider une décision
- **Espace:** Accélérer (optionnel)
- **Tactile:** Glisser le doigt sur les zones

## 🛠️ Système d'upgrades

Entre chaque jour, achetez des améliorations:

| Upgrade | Coût | Effet |
|---------|------|-------|
| 🔍 Meilleure loupe | 200€ | Zoom +30%, détection +25% |
| ⚡ Détection rapide | 150€ | Temps d'inspection -50% |
| 📏 Pied à coulisse | 100€ | Mesure précision +40% |
| 📊 Multimètre | 120€ | Détection électrique +60% |
| 🔬 Ultra-son | 180€ | Défauts cachés visibles |

## 🌐 Système multilingue

Le jeu supporte Français et Anglais via des fichiers JSON séparés.

### Fichier: `lang/french.json`
```json
{
  "game.title": "Contrôle Qualité",
  "game.objective": "Objectif: 2000€/jour",
  ...
}
```

### Utilisation en JavaScript
```javascript
i18n.setLanguage('fr');
const text = i18n.get('game.title'); // "Contrôle Qualité"
```

## 🎨 Design & Couleurs

- **Couleur primaire (EDF):** #09367A (bleu foncé)
- **Couleur secondaire:** #00A8E9 (bleu clair)
- **Vert succès:** #10B981
- **Rouge erreur:** #EF4444
- **Jaune warning:** #F59E0B

### Typographie
- **Titres:** System fonts (Segoe UI, Roboto)
- **Corps:** -apple-system, BlinkMacSystemFont
- **Monospace:** JetBrains Mono (nombre/montants)

## 🎬 Animations & UX

### Système de Popup + Fadeout
- **Bonne décision:** ✅ Popup vert + fadeout 1.5s
- **Mauvaise décision:** ❌ Popup rouge + fadeout 1.5s
- **L'inspection continue** pendant l'animation (non-bloquant)
- **CSS @keyframes** pour smooth animation

### Transitions
- Loupe: zoom fluide 200ms
- Barre temps: transition linéaire
- Produits: apparition fade-in 300ms

## 🔧 Développement

### Modification des textes
Éditez les fichiers dans `/lang/`:
```bash
lang/
├── french.json  # Textes en français
└── english.json # Textes en anglais
```

### Ajout d'un nouveau produit
Modifiez `js/game.js`:
```javascript
const PRODUCTS = [
  {
    id: 'cable',
    name: i18n.get('product.cable'),
    type: 'cable',
    inspectionTime: 4000,
    value: 50,
    defects: [ /* ... */ ]
  }
];
```

### Ajout d'une langue
1. Créez `lang/new-lang.json`
2. Copiez la structure de `french.json`
3. Traduisez les textes
4. Dans `index.html`, ajoutez l'option de langue

## 📊 Architecture

### Flux de données
```
UI (index.html)
  ↓
app.js (initialisation)
  ↓
game.js (boucle de jeu)
  ├→ inspection système
  ├→ calculs financiers
  └→ progression
  ↓
ui.js (rendu)
  ├→ i18n.js (traductions)
  └→ animations.css
```

### État du jeu (localStorage)
```javascript
{
  language: 'fr',
  day: 1,
  money: 2000,
  timeLeft: 28800000, // ms
  upgrades: {
    magnifier: 1,
    speedDetection: 0,
    ...
  }
}
```

## 🐛 Dépannage

### L'écran est blanc
- Vérifiez la console (F12 → Console)
- Vérifiez que les fichiers JSON de langue sont présents
- Testez avec un serveur local (pas de `file://`)

### Les animations ne se font pas
- Vérifiez `css/animations.css`
- Testez sur un navigateur récent (Chrome 90+, Firefox 88+, Safari 14+)

### Pas de son
- Les sons sont optionnels
- Vérifiez les fichiers audio dans `assets/sounds/`

## 📈 Optimisations possibles

- [ ] Ajout de bruitages (sons d'inspection)
- [ ] Système de sauvegarde du score
- [ ] Leaderboard (backend nécessaire)
- [ ] Mode multijoueur local
- [ ] Thèmes supplémentaires
- [ ] Intégration API pour données réelles EDF

## 📝 Licence

MIT - Libre d'utilisation pour la formation et éducation

## 👥 Contributeurs

- **Créateur:** [Vous]
- **Concept:** Sensibilisation qualité EDF

## 💬 Support

Pour des questions ou bugs, ouvrez une issue sur GitHub:
https://github.com/soaresden/EDF-QualityWeekGame2025/issues

---

**Bon jeu! 🚀** Montrez à vos collaborateurs qu'une bonne qualité, c'est rentable!
