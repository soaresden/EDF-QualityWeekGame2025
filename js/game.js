/**
 * game.js
 * Logique principale du jeu Quality Control
 */

class QualityControlGame {
  constructor() {
    this.state = {
      day: 1,
      money: 2500,
      timeLeft: 28800000, // 8 heures en ms
      gameRunning: false,
      currentProduct: null,
      products: [],
      upgrades: {
        magnifier: 0,
        speedDetection: 0,
        caliper: 0,
        multimeter: 0,
        ultrasound: 0
      },
      stats: {
        inspected: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0
      }
    };

    this.constants = {
      DAILY_SALARY: 150,
      DAILY_CHARGES: 400,
      MIN_QUOTA: 2000,
      INSPECTION_BASE_TIME: 3000, // ms
      DEFECT_REVEAL_TIME: 3000, // ms avant révélation
      MAX_DAYS: 5
    };

    this.timeInterval = null;
    this.gameStartTime = null;
  }

  /**
   * Initialiser le jeu
   */
  async init() {
    try {
      console.log('🎮 Initializing Quality Control Game...');
      
      // Charger le système i18n
      if (!window.i18n) {
        console.error('✗ i18n not loaded');
        return false;
      }

      await i18n.init();
      
      // Charger l'état sauvegardé
      this.loadSavedState();
      
      console.log('✓ Game initialized successfully');
      return true;
    } catch (error) {
      console.error('✗ Error initializing game:', error);
      return false;
    }
  }

  /**
   * Démarrer une nouvelle journée
   */
  startDay() {
    this.state.gameRunning = true;
    this.state.timeLeft = 28800000; // 8 heures
    this.gameStartTime = Date.now();
    
    this.generateProducts();
    this.updateUI();
    
    // Démarrer la boucle de temps
    this.startTimeLoop();
    
    console.log(`▶️ Day ${this.state.day} started`);
  }

  /**
   * Générer les produits du jour
   */
  generateProducts() {
    const productTypes = [
      {
        id: 'cable',
        name: i18n.get('screen.game.product.cable'),
        inspectionTime: 4000,
        value: 80,
        defectCount: 2 + this.state.day
      },
      {
        id: 'blade',
        name: i18n.get('screen.game.product.blade'),
        inspectionTime: 3500,
        value: 100,
        defectCount: 3 + this.state.day
      },
      {
        id: 'connector',
        name: i18n.get('screen.game.product.connector'),
        inspectionTime: 2500,
        value: 60,
        defectCount: 1 + this.state.day
      },
      {
        id: 'transformer',
        name: i18n.get('screen.game.product.transformer'),
        inspectionTime: 5000,
        value: 120,
        defectCount: 4 + this.state.day
      }
    ];

    // Nombre de produits augmente chaque jour
    const productCount = 5 + (this.state.day * 2);
    this.state.products = [];

    for (let i = 0; i < productCount; i++) {
      const type = productTypes[Math.floor(Math.random() * productTypes.length)];
      const product = {
        id: `product-${i}`,
        type: type.id,
        name: type.name,
        value: type.value,
        inspectionTime: this.getAdjustedInspectionTime(type.inspectionTime),
        defects: this.generateDefects(type.defectCount),
        inspected: false,
        accepted: null
      };
      this.state.products.push(product);
    }

    console.log(`📦 Generated ${productCount} products for day ${this.state.day}`);
  }

  /**
   * Générer les défauts d'un produit
   */
  generateDefects(count) {
    const defectTypes = [
      { key: 'defect.scratch', severity: 'low', value: 10 },
      { key: 'defect.wear', severity: 'low', value: 15 },
      { key: 'defect.crack', severity: 'medium', value: 50 },
      { key: 'defect.misalignment', severity: 'medium', value: 45 },
      { key: 'defect.corrosion', severity: 'high', value: 100 },
      { key: 'defect.leak', severity: 'high', value: 120 }
    ];

    const defects = [];
    for (let i = 0; i < count; i++) {
      const type = defectTypes[Math.floor(Math.random() * defectTypes.length)];
      defects.push({
        name: i18n.get(type.key),
        severity: type.severity,
        hidden: true,
        revealed: false,
        detectionTime: 0
      });
    }

    return defects;
  }

  /**
   * Ajuster le temps d'inspection selon les upgrades
   */
  getAdjustedInspectionTime(baseTime) {
    let time = baseTime;
    
    // Upgrade détection rapide: -50% par niveau
    time *= Math.pow(0.5, this.state.upgrades.speedDetection);
    
    // Upgrade ultrasound: -30% par niveau
    time *= Math.pow(0.7, this.state.upgrades.ultrasound);
    
    return Math.max(time, 1500); // Minimum 1.5s
  }

  /**
   * Inspecter un produit
   */
  inspectProduct(productId, hoverTime) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;

    // Révéler les défauts selon le temps de survol
    let revealedDefects = 0;
    const adjustedInspectionTime = this.getAdjustedInspectionTime(3000);

    product.defects.forEach(defect => {
      if (!defect.revealed && hoverTime >= adjustedInspectionTime) {
        defect.revealed = true;
        revealedDefects++;
      }
    });

    if (revealedDefects > 0) {
      console.log(`🔍 Revealed ${revealedDefects} defects in ${product.name}`);
    }

    return revealedDefects;
  }

  /**
   * Valider une décision (bon/mauvais/douteux)
   */
  validateDecision(productId, decision) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;

    const hasHiddenDefects = product.defects.some(d => d.hidden && !d.revealed);
    const hasRevealedDefects = product.defects.some(d => d.revealed);

    let isCorrect = false;
    let feedback = '';

    if (decision === 'good') {
      isCorrect = !hasHiddenDefects && !hasRevealedDefects;
      feedback = isCorrect 
        ? i18n.get('feedback.correct')
        : (hasHiddenDefects ? i18n.get('feedback.missed') : i18n.get('feedback.falseAlarm'));
    } else if (decision === 'reject') {
      isCorrect = hasHiddenDefects || hasRevealedDefects;
      feedback = isCorrect 
        ? i18n.get('feedback.correct')
        : i18n.get('feedback.falseAlarm');
    } else if (decision === 'doubt') {
      // Douteux: ni bon ni mauvais
      isCorrect = hasRevealedDefects && hasHiddenDefects;
      feedback = i18n.get('feedback.correct');
    }

    // Mettre à jour les stats
    this.state.stats.inspected++;
    if (isCorrect) {
      this.state.stats.correct++;
    } else {
      this.state.stats.incorrect++;
    }
    this.state.stats.accuracy = Math.round((this.state.stats.correct / this.state.stats.inspected) * 100);

    // Calculer le revenu
    let revenue = 0;
    if (decision === 'good' && isCorrect) {
      revenue = product.value;
    } else if (decision === 'reject' && isCorrect) {
      revenue = product.value * 0.8; // Crédit de 80% pour rejet bon
    } else if (isCorrect) {
      revenue = product.value * 0.5; // Crédit partiel pour douteux
    }

    this.state.money += revenue;
    product.inspected = true;
    product.accepted = (decision === 'good');

    // Afficher le feedback popup
    this.showFeedback(feedback, isCorrect);

    console.log(`📊 Decision: ${decision} → ${isCorrect ? '✓' : '✗'} Revenue: +${revenue}€`);
    
    return { isCorrect, feedback, revenue };
  }

  /**
   * Afficher un popup feedback
   */
  showFeedback(message, isCorrect) {
    const feedbackEl = document.getElementById('popupFeedback');
    if (!feedbackEl) return;

    feedbackEl.textContent = message;
    feedbackEl.className = `popup-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackEl.style.display = 'block';

    // Fadeout automatique après 1.5s
    setTimeout(() => {
      feedbackEl.classList.add('fadeout');
      setTimeout(() => {
        feedbackEl.style.display = 'none';
        feedbackEl.classList.remove('fadeout');
      }, 500);
    }, 1500);
  }

  /**
   * Boucle de temps
   */
  startTimeLoop() {
    const startTime = Date.now();
    const dayDuration = 28800000; // 8 heures en ms

    this.timeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      this.state.timeLeft = Math.max(0, dayDuration - elapsed);

      // Jour terminé
      if (this.state.timeLeft === 0) {
        this.endDay();
      }

      this.updateUI();
    }, 100);
  }

  /**
   * Terminer la journée
   */
  endDay() {
    clearInterval(this.timeInterval);
    this.state.gameRunning = false;

    // Calculer le bilan de la journée
    const dayBalance = this.state.money - this.constants.DAILY_CHARGES;
    this.state.money = dayBalance;

    console.log(`📊 Day ${this.state.day} ended. Balance: ${dayBalance}€`);

    // Vérifier la faillite
    if (this.state.money <= 0) {
      this.gameOver(false);
      return;
    }

    // Vérifier la victoire
    if (this.state.day >= this.constants.MAX_DAYS) {
      this.gameOver(true);
      return;
    }

    // Passer au jour suivant
    this.state.day++;
    this.state.stats = {
      inspected: 0,
      correct: 0,
      incorrect: 0,
      accuracy: 0
    };
  }

  /**
   * Fin du jeu
   */
  gameOver(victory) {
    this.state.gameRunning = false;
    console.log(victory ? '🏆 VICTORY!' : '💸 BANKRUPT!');
    
    // Sauvegarder le score
    this.saveScore(victory);
    
    // Déclencher l'événement
    window.dispatchEvent(new CustomEvent('gameOver', {
      detail: { victory, finalBalance: this.state.money }
    }));
  }

  /**
   * Acheter un upgrade
   */
  buyUpgrade(upgradeId) {
    const upgradeCosts = {
      magnifier: 200,
      speedDetection: 150,
      caliper: 100,
      multimeter: 120,
      ultrasound: 180
    };

    const cost = upgradeCosts[upgradeId];
    if (!cost) return false;

    if (this.state.money < cost) {
      console.warn(`❌ Not enough money for ${upgradeId}`);
      return false;
    }

    this.state.money -= cost;
    this.state.upgrades[upgradeId]++;
    
    console.log(`🛠️ Purchased ${upgradeId} (level ${this.state.upgrades[upgradeId]})`);
    
    return true;
  }

  /**
   * Mettre à jour l'interface
   */
  updateUI() {
    // Sera appelé par ui.js
    window.dispatchEvent(new Event('gameStateChanged'));
  }

  /**
   * Sauvegarder l'état du jeu
   */
  saveState() {
    localStorage.setItem('gameState', JSON.stringify(this.state));
  }

  /**
   * Charger l'état sauvegardé
   */
  loadSavedState() {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        console.log('✓ Loaded saved game state');
      } catch (error) {
        console.warn('⚠️ Could not load saved state:', error);
      }
    }
  }

  /**
   * Sauvegarder le score
   */
  saveScore(victory) {
    const score = {
      date: new Date().toISOString(),
      day: this.state.day,
      finalBalance: this.state.money,
      accuracy: this.state.stats.accuracy,
      victory
    };

    let scores = JSON.parse(localStorage.getItem('scores') || '[]');
    scores.unshift(score);
    scores = scores.slice(0, 10); // Garder les 10 meilleurs
    localStorage.setItem('scores', JSON.stringify(scores));

    console.log('💾 Score saved');
  }

  /**
   * Obtenir les scores sauvegardés
   */
  getScores() {
    return JSON.parse(localStorage.getItem('scores') || '[]');
  }

  /**
   * Réinitialiser le jeu
   */
  reset() {
    clearInterval(this.timeInterval);
    localStorage.removeItem('gameState');
    this.state = {
      day: 1,
      money: 2500,
      timeLeft: 28800000,
      gameRunning: false,
      currentProduct: null,
      products: [],
      upgrades: {
        magnifier: 0,
        speedDetection: 0,
        caliper: 0,
        multimeter: 0,
        ultrasound: 0
      },
      stats: {
        inspected: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0
      }
    };
    console.log('🔄 Game reset');
  }
}

// Instance globale
const game = new QualityControlGame();
window.game = game;
