# 📚 EDF Quality Control Game - Guide de Déploiement Complet

## ✨ Qu'avons-nous créé?

Un jeu pédagogique complet et fonctionnel avec:

✅ **Fichiers de langue séparés** (french.json + english.json)  
✅ **Système de popup + fadeout non-bloquant** pour les décisions  
✅ **Structure professionnelle** prête pour GitHub  
✅ **100% fonctionnel en HTML5/CSS3/JavaScript pur**  
✅ **Aucune dépendance externe** (pas besoin de npm install)  

---

## 📂 Structure du Projet

```
EDF-QualityWeekGame2025/
│
├── 📄 index.html                    # Point d'entrée principal
├── 📄 README.md                     # Documentation
├── 📄 package.json                  # Metadata du projet
├── 📄 .gitignore                    # Fichiers à ignorer dans git
│
├── 📁 css/
│   ├── main.css                     # Styles principaux
│   └── animations.css               # Animations + popup fadeout
│
├── 📁 js/
│   ├── i18n.js                      # ⭐ Système de traductions
│   ├── game.js                      # ⭐ Logique du jeu
│   ├── ui.js                        # ⭐ Gestion interface
│   └── app.js                       # Point d'entrée JS
│
└── 📁 lang/
    ├── french.json                  # ⭐ Traductions français
    └── english.json                 # ⭐ Traductions anglais
```

---

## 🚀 Déploiement Étape par Étape

### 1️⃣ **Sur votre machine locale**

```bash
# Option A: Ouvrir directement (Windows/Mac)
1. Double-cliquer sur index.html

# Option B: Serveur local (recommandé)
cd EDF-QualityWeekGame2025
python -m http.server 8000
# Ouvrir http://localhost:8000
```

### 2️⃣ **Sur GitHub Pages**

```bash
# 1. Créer un repo vide sur GitHub
# Nom: EDF-QualityWeekGame2025 (déjà en place ✓)

# 2. Initialiser git localement
cd EDF-QualityWeekGame2025
git init
git add .
git commit -m "Initial commit: Quality Control Game v1.0"

# 3. Ajouter le remote
git remote add origin https://github.com/soaresden/EDF-QualityWeekGame2025.git
git branch -M main
git push -u origin main

# 4. Activer GitHub Pages
# Paramètres du repo → Pages → Source: main branch
# Votre jeu sera en ligne sous: https://soaresden.github.io/EDF-QualityWeekGame2025

```

### 3️⃣ **Déploiement sur d'autres serveurs**

**Option Netlify (gratuit):**
```bash
npm install -g netlify-cli
netlify deploy --dir=.
```

**Option Vercel (gratuit):**
```bash
npm install -g vercel
vercel
```

---

## 🌐 Système de Traductions

### Comment ça marche?

**Fichiers séparés:**
```
lang/
├── french.json    → Tous les textes en français
└── english.json   → Tous les textes en anglais
```

**Utilisation en JavaScript:**
```javascript
// Récupérer une traduction
i18n.get('game.title')  // "Contrôle Qualité" (FR) ou "Quality Control" (EN)

// Définir la langue
i18n.setLanguage('en')  // Passer à l'anglais

// Ajouter une nouvelle clé
"screen.game.product.cable": "Câble marin"  (French)
"screen.game.product.cable": "Marine Cable" (English)
```

### Ajouter une traduction

1. Ouvrir `lang/french.json` et `lang/english.json`
2. Ajouter une nouvelle clé:
```json
"my.new.key": "Valeur en français"  // french.json
"my.new.key": "Value in English"    // english.json
```
3. Utiliser en JavaScript:
```javascript
const text = i18n.get('my.new.key');
```

---

## 🎨 Système de Popup Feedback (Non-Bloquant)

### Le problème résolu ✅

Avant: Les modales bloquaient l'inspection pendant l'animation  
Après: Les popups s'affichent et disparaissent automatiquement **sans bloquer le jeu**

### Comment c'est fait?

**Code HTML:**
```html
<div id="popupFeedback" class="popup-feedback"></div>
```

**Code JavaScript:**
```javascript
showFeedback(message, isCorrect) {
  const feedbackEl = document.getElementById('popupFeedback');
  feedbackEl.textContent = message;
  feedbackEl.className = `popup-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedbackEl.style.display = 'block';

  // Fadeout AUTOMATIQUE après 1.5s - pas de blocage!
  setTimeout(() => {
    feedbackEl.classList.add('fadeout');
    setTimeout(() => {
      feedbackEl.style.display = 'none';
      feedbackEl.classList.remove('fadeout');
    }, 500);
  }, 1500);
}
```

**Code CSS (animations.css):**
```css
.popup-feedback {
  animation: fadeInScale 0.3s ease-out forwards;
}

.popup-feedback.fadeout {
  animation: fadeOutScale 0.5s ease-in forwards;  /* s'efface tout seul! */
}

@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes fadeOutScale {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.8); }
}
```

**Avantages:**
- ✅ Non-bloquant (inspection continue)
- ✅ Smooth animations (CSS)
- ✅ Feedback immédiat pour le joueur
- ✅ Disparition automatique

---

## 📝 Fichiers Clés à Modifier

### Pour changer les règles du jeu
Éditez `js/game.js`:
```javascript
this.constants = {
  DAILY_SALARY: 150,      // Changer le salaire
  DAILY_CHARGES: 400,     // Changer les charges
  MIN_QUOTA: 2000,        // Changer le quota
  INSPECTION_BASE_TIME: 3000,  // Temps d'inspection
  MAX_DAYS: 5             // Nombre de jours
};
```

### Pour ajouter un nouveau produit
Éditez `js/game.js` dans la méthode `generateProducts()`:
```javascript
{
  id: 'myProduct',
  name: i18n.get('screen.game.product.myProduct'),
  inspectionTime: 3000,
  value: 50,
  defectCount: 3
}
```

### Pour changer les couleurs
Éditez `css/main.css`:
```css
:root {
  --color-primary: #09367A;      /* Bleu EDF foncé */
  --color-secondary: #00A8E9;    /* Bleu EDF clair */
}
```

---

## 🎯 Checklist de Déploiement

- [ ] Clone local fonctionne (`python -m http.server 8000`)
- [ ] Les deux langues fonctionnent (FR/EN)
- [ ] Les popups s'affichent et disparaissent (fadeout)
- [ ] Les fichiers JSON de langue se chargent correctement
- [ ] Aucune erreur en console (F12)
- [ ] Le jeu progresse d'un jour à l'autre
- [ ] Les upgrades fonctionnent
- [ ] Le score se sauvegarde dans localStorage
- [ ] GitHub repo créé et initialisé
- [ ] GitHub Pages activé (Settings → Pages)
- [ ] Lien GitHub Pages fonctionne

---

## 🐛 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Écran blanc | F12 → Console, vérifier erreurs | Fichiers JSON? |
| Pas de texte | Vérifier que i18n.js se charge | Vérifier lang/*.json |
| Popup bloque le jeu | Vérifier `pointer-events: none` dans CSS |
| Pas de son | C'est normal, les sons sont optionnels |
| 404 sur GitHub Pages | Attendre 1-2 min après activation |

---

## 💡 Améliorations Futures Possibles

1. **Bruitages et musique** (assets/sounds/)
2. **Leaderboard serveur** (Firebase/Supabase)
3. **Mode multijoueur local**
4. **Thèmes supplémentaires**
5. **Intégration données réelles EDF**
6. **Mobile app version**
7. **Analytics des scores**
8. **Achievements/Badges**

---

## 📊 Architecture du Jeu

```
┌─────────────────┐
│   index.html    │  ← Point d'entrée
└────────┬────────┘
         │
    ┌────┴─────────────────────────────┐
    │                                  │
┌───▼────┐      ┌─────────┐      ┌────▼──┐
│ app.js │      │ i18n.js │      │ ui.js │
└────────┘      └────┬────┘      └───┬───┘
    │                │               │
    └────────────────┼───────────────┘
                     │
            ┌────────▼────────┐
            │   game.js       │
            │  (logique jeu)  │
            └─────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌────▼────┐    ┌──────▼──┐
│main.css│    │  langs/ │    │ HTML    │
│        │    │  JSON   │    │elements │
└────────┘    └─────────┘    └─────────┘
```

---

## 📞 Support

Pour des questions ou bugs:
1. Vérifier la console (F12 → Console)
2. Vérifier que tous les fichiers existent
3. Ouvrir une issue sur GitHub
4. Vérifier les fichiers JSON de langue

---

## 🎉 Résumé

Vous avez maintenant:

✅ **Jeu complet et fonctionnel**  
✅ **Système multilingue professionnel** (français + anglais)  
✅ **Popup feedback non-bloquant** avec fadeout CSS  
✅ **Structure GitHub ready**  
✅ **Documentation complète**  

Le jeu est **100% fonctionnel** et prêt à être déployé!

**Bon jeu! 🚀**
