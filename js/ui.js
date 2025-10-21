/**
 * ui.js
 * Gestion de l'interface utilisateur
 */

class UI {
  constructor() {
    this.screens = {
      language: 'languageScreen',
      playerName: 'playerNameScreen',
      intro: 'introScreen',
      game: 'gameScreen',
      dayEnd: 'dayEndScreen',
      gameOver: 'gameOverScreen'
    };
    
    this.currentScreen = 'language';
    this.playerName = '';
    this.hoveredProductId = null;
    this.hoverStartTime = null;
  }

  /**
   * Initialiser l'UI
   */
  init() {
    console.log('🎨 Initializing UI...');
    
    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('gameLanguage');
    if (savedLang) {
      this.setLanguage(savedLang);
    }
    
    // Écouter les changements d'état du jeu
    window.addEventListener('gameStateChanged', () => this.updateGameScreen());
    window.addEventListener('gameOver', (e) => this.showGameOverScreen(e.detail));
    
    this.updateTexts();
  }

  /**
   * Afficher un écran
   */
  showScreen(screenName) {
    // Masquer tous les écrans
    Object.values(this.screens).forEach(screen => {
      const el = document.getElementById(screen);
      if (el) el.classList.add('hidden');
    });

    // Afficher l'écran sélectionné
    const screenEl = document.getElementById(this.screens[screenName]);
    if (screenEl) {
      screenEl.classList.remove('hidden');
      this.currentScreen = screenName;
      console.log(`📺 Screen: ${screenName}`);
    }
  }

  /**
   * Définir la langue
   */
  setLanguage(lang) {
    i18n.setLanguage(lang);
    this.updateTexts();
    console.log(`🌍 Language changed to ${lang}`);
  }

  /**
   * Mettre à jour tous les textes selon la langue
   */
  updateTexts() {
    // Écran langue
    document.getElementById('langTitle').textContent = i18n.get('screen.language.title');
    document.getElementById('langSubtitle').textContent = i18n.get('screen.language.select');

    // Écran nom du joueur
    document.getElementById('nameTitle').textContent = i18n.get('screen.playerName.title');
    document.getElementById('nameSubtitle').textContent = i18n.get('screen.playerName.subtitle');
    document.getElementById('playerNameInput').placeholder = i18n.get('screen.playerName.placeholder');
    
    // Écran intro
    document.getElementById('introTitle').textContent = i18n.get('screen.intro.title');
    document.getElementById('introSubtitle').textContent = i18n.get('game.subtitle');
    document.getElementById('introObjective').textContent = i18n.get('screen.intro.objective');
    document.getElementById('rule1').textContent = i18n.get('screen.intro.rule1');
    document.getElementById('rule2').textContent = i18n.get('screen.intro.rule2');
    document.getElementById('rule3').textContent = i18n.get('screen.intro.rule3');
    document.getElementById('rule4').textContent = i18n.get('screen.intro.rule4');
    document.getElementById('rule5').textContent = i18n.get('screen.intro.rule5');

    // Écran jeu
    document.getElementById('dayDisplay').textContent = game.state.day;
    document.getElementById('dayEndTitle').textContent = i18n.get('screen.dayEnd.title');

    // Boutons décision
    const decisionBtns = document.querySelectorAll('.decision-btn');
    if (decisionBtns[0]) decisionBtns[0].textContent = i18n.get('decision.good');
    if (decisionBtns[1]) decisionBtns[1].textContent = i18n.get('decision.reject');
    if (decisionBtns[2]) decisionBtns[2].textContent = i18n.get('decision.doubt');
  }

  /**
   * Afficher le prochain produit à inspecter
   */
  showNextProduct() {
    const uninspestedProduct = game.state.products.find(p => !p.inspected);
    
    if (!uninspestedProduct) {
      game.endDay();
      return;
    }

    const panel = document.getElementById('inspectionPanel');
    panel.style.display = 'block';
    
    document.getElementById('currentProductName').textContent = uninspestedProduct.name;
    
    const revealedDefectsCount = uninspestedProduct.defects.filter(d => d.revealed).length;
    const totalDefectsCount = uninspestedProduct.defects.length;
    
    document.getElementById('defectStatus').textContent = 
      `${i18n.get('inspection.scanning')} (${revealedDefectsCount}/${totalDefectsCount})`;

    game.state.currentProduct = uninspestedProduct;
  }

  /**
   * Mettre à jour l'écran de jeu
   */
  updateGameScreen() {
    // Mettre à jour les statistiques
    const hours = Math.floor(game.state.timeLeft / 3600000);
    const minutes = Math.floor((game.state.timeLeft % 3600000) / 60000);
    
    document.getElementById('dayDisplay').textContent = game.state.day;
    document.getElementById('timeDisplay').textContent = `${hours}h ${minutes}m`;
    document.getElementById('moneyDisplay').textContent = `${Math.round(game.state.money)}€`;

    // Afficher les produits
    this.renderProducts();
  }

  /**
   * Afficher les produits
   */
  renderProducts() {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';

    game.state.products.forEach(product => {
      const productEl = document.createElement('div');
      productEl.className = 'card product';
      
      const statusIcon = product.inspected 
        ? (product.accepted ? '✓' : '✗')
        : '?';
      
      const statusColor = product.inspected
        ? (product.accepted ? '#10B981' : '#EF4444')
        : '#F59E0B';

      const revealedCount = product.defects.filter(d => d.revealed).length;
      
      productEl.innerHTML = `
        <div style="text-align: center; cursor: pointer; padding: 16px; background: linear-gradient(135deg, rgba(9,54,122,0.1) 0%, rgba(0,168,233,0.1) 100%); border-radius: 8px; position: relative;">
          <div style="font-size: 2rem; margin-bottom: 8px;">📦</div>
          <div style="font-weight: bold; font-size: 0.9rem; margin-bottom: 4px;">${product.name}</div>
          <div style="font-size: 0.8rem; color: #666; margin-bottom: 8px;">€${product.value}</div>
          <div style="font-size: 1.5rem; color: ${statusColor}; font-weight: bold;">${statusIcon}</div>
          ${revealedCount > 0 ? `<div style="font-size: 0.75rem; color: #EF4444; margin-top: 8px;">⚠️ ${revealedCount} defects</div>` : ''}
        </div>
      `;
      
      productEl.addEventListener('mouseenter', () => this.onProductHover(product.id));
      productEl.addEventListener('mouseleave', () => this.onProductLeave(product.id));
      productEl.addEventListener('click', () => this.selectProduct(product.id));
      
      container.appendChild(productEl);
    });
  }

  /**
   * Gérer le survol d'un produit
   */
  onProductHover(productId) {
    this.hoveredProductId = productId;
    this.hoverStartTime = Date.now();

    // Simuler l'inspection progressive
    const checkInterval = setInterval(() => {
      if (this.hoveredProductId !== productId) {
        clearInterval(checkInterval);
        return;
      }

      const hoverTime = Date.now() - this.hoverStartTime;
      game.inspectProduct(productId, hoverTime);
      this.renderProducts();

      // Afficher un indicateur de scanning
      const product = game.state.products.find(p => p.id === productId);
      if (product) {
        const revealedCount = product.defects.filter(d => d.revealed).length;
        if (revealedCount > 0) {
          console.log(`🔍 ${revealedCount} defects revealed in ${product.name}`);
        }
      }
    }, 200);
  }

  /**
   * Gérer la fin du survol
   */
  onProductLeave(productId) {
    if (this.hoveredProductId === productId) {
      this.hoveredProductId = null;
      this.hoverStartTime = null;
    }
  }

  /**
   * Sélectionner un produit pour l'inspecter
   */
  selectProduct(productId) {
    const product = game.state.products.find(p => p.id === productId);
    if (!product || product.inspected) return;

    game.state.currentProduct = product;
    this.showNextProduct();
  }

  /**
   * Rendre une décision
   */
  makeDecision(decision) {
    const product = game.state.currentProduct;
    if (!product) return;

    const result = game.validateDecision(product.id, decision);
    
    // Le feedback est montré via le popup (déjà dans game.validateDecision)
    // L'inspection continue donc on continue sans blocage
    
    setTimeout(() => {
      this.renderProducts();
      
      // Vérifier s'il y a d'autres produits
      const uninspestedProduct = game.state.products.find(p => !p.inspected);
      if (!uninspestedProduct) {
        // Fin du jour
        game.endDay();
      } else {
        this.showNextProduct();
      }
    }, 100);
  }

  /**
   * Afficher l'écran de fin de journée
   */
  showDayEndScreen() {
    const revenue = game.state.products
      .filter(p => p.inspected && p.accepted)
      .reduce((sum, p) => sum + p.value, 0);

    const dayBalance = revenue + game.constants.DAILY_SALARY - game.constants.DAILY_CHARGES;

    document.getElementById('dayRevenue').textContent = `${revenue}€`;
    document.getElementById('dayBalance').textContent = `${Math.round(dayBalance)}€`;
    document.getElementById('accuracyDisplay').textContent = `${game.state.stats.accuracy}%`;
    
    const acceptedCount = game.state.products.filter(p => p.inspected && p.accepted).length;
    const rejectedCount = game.state.products.filter(p => p.inspected && !p.accepted).length;
    
    document.getElementById('acceptedDisplay').textContent = acceptedCount;
    document.getElementById('rejectedDisplay').textContent = rejectedCount;
    document.getElementById('totalBalance').textContent = `${Math.round(game.state.money)}€`;

    this.renderUpgrades();
    this.showScreen('dayEnd');
  }

  /**
   * Afficher les upgrades disponibles
   */
  renderUpgrades() {
    const container = document.getElementById('upgradesContainer');
    container.innerHTML = '';

    const upgrades = [
      {
        id: 'magnifier',
        name: i18n.get('upgrade.magnifier.name'),
        description: i18n.get('upgrade.magnifier.description'),
        cost: 200
      },
      {
        id: 'speedDetection',
        name: i18n.get('upgrade.speedDetection.name'),
        description: i18n.get('upgrade.speedDetection.description'),
        cost: 150
      },
      {
        id: 'caliper',
        name: i18n.get('upgrade.caliper.name'),
        description: i18n.get('upgrade.caliper.description'),
        cost: 100
      },
      {
        id: 'ultrasound',
        name: i18n.get('upgrade.ultrasound.name'),
        description: i18n.get('upgrade.ultrasound.description'),
        cost: 180
      }
    ];

    upgrades.forEach(upgrade => {
      const upgradeEl = document.createElement('div');
      upgradeEl.className = 'card';
      
      const owned = game.state.upgrades[upgrade.id] || 0;
      const canAfford = game.state.money >= upgrade.cost;
      const buttonText = canAfford ? i18n.get('upgrade.buy') : i18n.get('upgrade.tooExpensive');

      upgradeEl.innerHTML = `
        <div style="margin-bottom: 8px;">
          <strong>${upgrade.name}</strong>
          <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">${upgrade.description}</div>
          <div style="font-size: 0.8rem; color: #999; margin-top: 4px;">Lvl ${owned}</div>
        </div>
        <button class="button" style="width: 100%; margin-top: 8px; ${canAfford ? '' : 'opacity: 0.5; cursor: not-allowed;'}"
                onclick="buyUpgrade('${upgrade.id}')" ${!canAfford ? 'disabled' : ''}>
          ${upgrade.cost}€
        </button>
      `;
      
      container.appendChild(upgradeEl);
    });
  }

  /**
   * Afficher l'écran de fin du jeu
   */
  showGameOverScreen(detail) {
    const { victory, finalBalance } = detail;

    document.getElementById('gameOverTitle').textContent = victory 
      ? i18n.get('screen.victory.title')
      : i18n.get('screen.gameOver.title');
    
    document.getElementById('gameOverSubtitle').textContent = victory
      ? i18n.get('screen.victory.subtitle')
      : i18n.get('screen.gameOver.subtitle');

    document.getElementById('finalBalance').textContent = `${Math.round(finalBalance)}€`;

    // Afficher le classement
    const scores = game.getScores();
    const leaderboardEl = document.getElementById('leaderboardDisplay');
    
    if (scores.length > 0) {
      let html = `<h3>${i18n.get('screen.victory.ranking')}</h3>`;
      html += '<div style="text-align: left;">';
      scores.slice(0, 5).forEach((score, index) => {
        html += `
          <div style="padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong>${index + 1}.</strong> Day ${score.day} - ${Math.round(score.finalBalance)}€ (${score.accuracy}%)
          </div>
        `;
      });
      html += '</div>';
      leaderboardEl.innerHTML = html;
    }

    this.showScreen('gameOver');
  }
}

// Instance globale
const ui = new UI();
window.ui = ui;

// ============================================
// FONCTIONS GLOBALES POUR HTML
// ============================================

function setLanguage(lang) {
  ui.setLanguage(lang);
  ui.showScreen('playerName');
}

function confirmPlayerName() {
  const nameInput = document.getElementById('playerNameInput');
  const name = nameInput.value.trim();

  if (!name) {
    alert('Please enter a name');
    return;
  }

  ui.playerName = name;
  localStorage.setItem('playerName', name);
  ui.showScreen('intro');
}

function startGameplay() {
  ui.showScreen('game');
  game.startDay();
  ui.showNextProduct();
  ui.updateGameScreen();
}

function makeDecision(decision) {
  ui.makeDecision(decision);
}

function buyUpgrade(upgradeId) {
  if (game.buyUpgrade(upgradeId)) {
    ui.renderUpgrades();
  }
}

function nextDay() {
  ui.showScreen('game');
  game.startDay();
  ui.showNextProduct();
  ui.updateGameScreen();
}

// Écouter la fin du jour
window.addEventListener('gameStateChanged', () => {
  if (!game.state.gameRunning && game.state.day <= 5) {
    // Afficher l'écran de fin de journée
    setTimeout(() => ui.showDayEndScreen(), 500);
  }
});
