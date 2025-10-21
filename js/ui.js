/**
 * ui.js
 * Gestion de l'interface utilisateur - Système TETRIS simplifié
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
    this.currentProductIndex = 0;
    this.inspectionProgress = 0;
    this.inspectionInterval = null;
  }

  /**
   * Initialiser l'UI
   */
  init() {
    console.log('🎨 Initializing UI...');
    
    const savedLang = localStorage.getItem('gameLanguage');
    if (savedLang) {
      this.setLanguage(savedLang);
    }
    
    window.addEventListener('gameStateChanged', () => this.updateGameScreen());
    window.addEventListener('gameOver', (e) => this.showGameOverScreen(e.detail));
    
    this.updateTexts();
  }

  showScreen(screenName) {
    Object.values(this.screens).forEach(screen => {
      const el = document.getElementById(screen);
      if (el) el.classList.add('hidden');
    });

    const screenEl = document.getElementById(this.screens[screenName]);
    if (screenEl) {
      screenEl.classList.remove('hidden');
      this.currentScreen = screenName;
      console.log(`📺 Screen: ${screenName}`);
    }
  }

  setLanguage(lang) {
    i18n.setLanguage(lang);
    this.updateTexts();
    console.log(`🌍 Language changed to ${lang}`);
  }

  updateTexts() {
    if (document.getElementById('langTitle')) 
      document.getElementById('langTitle').textContent = i18n.get('screen.language.title');
    if (document.getElementById('langSubtitle'))
      document.getElementById('langSubtitle').textContent = i18n.get('screen.language.select');

    if (document.getElementById('nameTitle'))
      document.getElementById('nameTitle').textContent = i18n.get('screen.playerName.title');
    if (document.getElementById('nameSubtitle'))
      document.getElementById('nameSubtitle').textContent = i18n.get('screen.playerName.subtitle');
    if (document.getElementById('playerNameInput'))
      document.getElementById('playerNameInput').placeholder = i18n.get('screen.playerName.placeholder');
    
    if (document.getElementById('introTitle'))
      document.getElementById('introTitle').textContent = i18n.get('screen.intro.title');
    if (document.getElementById('introSubtitle'))
      document.getElementById('introSubtitle').textContent = i18n.get('game.subtitle');
    if (document.getElementById('introObjective'))
      document.getElementById('introObjective').textContent = i18n.get('screen.intro.objective');
    if (document.getElementById('rule1'))
      document.getElementById('rule1').textContent = i18n.get('screen.intro.rule1');
    if (document.getElementById('rule2'))
      document.getElementById('rule2').textContent = i18n.get('screen.intro.rule2');
    if (document.getElementById('rule3'))
      document.getElementById('rule3').textContent = i18n.get('screen.intro.rule3');
    if (document.getElementById('rule4'))
      document.getElementById('rule4').textContent = i18n.get('screen.intro.rule4');
    if (document.getElementById('rule5'))
      document.getElementById('rule5').textContent = i18n.get('screen.intro.rule5');

    const decisionBtns = document.querySelectorAll('.decision-btn');
    if (decisionBtns[0]) decisionBtns[0].textContent = i18n.get('decision.good');
    if (decisionBtns[1]) decisionBtns[1].textContent = i18n.get('decision.reject');
    if (decisionBtns[2]) decisionBtns[2].textContent = i18n.get('decision.doubt');

    if (document.getElementById('dayEndTitle'))
      document.getElementById('dayEndTitle').textContent = i18n.get('screen.dayEnd.title');
  }

  showCurrentProduct() {
    const product = game.state.products[this.currentProductIndex];
    
    if (!product) {
      console.log('🏁 Tous les produits inspectés');
      game.endDay();
      return;
    }

    document.getElementById('currentProductName').textContent = product.name;
    document.getElementById('currentProductValue').textContent = `€${product.value}`;
    
    const revealedCount = product.defects.filter(d => d.revealed).length;
    const totalDefects = product.defects.length;
    document.getElementById('defectStatus').textContent = `Scanning... (${revealedCount}/${totalDefects})`;

    this.updateReserve();
    
    this.inspectionProgress = 0;
    this.updateScanningBar();
    
    this.startScanning();
  }

  updateReserve() {
    const container = document.getElementById('reserveProducts');
    container.innerHTML = '';

    for (let i = 1; i <= 3; i++) {
      const product = game.state.products[this.currentProductIndex + i];
      if (!product) break;

      const el = document.createElement('div');
      el.style.cssText = `
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        font-size: 0.8rem;
      `;
      el.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 4px;">📦</div>
        <div style="font-weight: bold; margin-bottom: 4px; line-height: 1.2; min-height: 30px;">${product.name}</div>
        <div style="color: #666; font-size: 0.75rem;">€${product.value}</div>
      `;
      container.appendChild(el);
    }
  }

  startScanning() {
    if (this.inspectionInterval) clearInterval(this.inspectionInterval);

    const product = game.state.products[this.currentProductIndex];
    if (!product) return;

    this.inspectionInterval = setInterval(() => {
      this.inspectionProgress += 2;
      this.updateScanningBar();

      if (this.inspectionProgress >= 100) {
        this.inspectionProgress = 100;
        clearInterval(this.inspectionInterval);
        
        game.inspectProduct(product.id, 10000);
        this.showCurrentProduct();
      }
    }, 50);
  }

  updateScanningBar() {
    const bar = document.getElementById('scanningBar');
    if (bar) {
      bar.style.width = this.inspectionProgress + '%';
    }
  }

  makeDecision(decision) {
    const product = game.state.products[this.currentProductIndex];
    if (!product) return;

    if (this.inspectionInterval) clearInterval(this.inspectionInterval);

    const result = game.validateDecision(product.id, decision);
    
    this.updateStats();

    this.currentProductIndex++;
    
    setTimeout(() => {
      if (this.currentProductIndex < game.state.products.length) {
        this.showCurrentProduct();
      } else {
        game.endDay();
      }
    }, 500);
  }

  updateGameScreen() {
    const hours = Math.floor(game.state.timeLeft / 3600000);
    const minutes = Math.floor((game.state.timeLeft % 3600000) / 60000);
    
    document.getElementById('dayDisplay').textContent = game.state.day;
    document.getElementById('timeDisplay').textContent = `${hours}h ${minutes}m`;
    document.getElementById('moneyDisplay').textContent = `${Math.round(game.state.money)}€`;

    this.updateStats();
  }

  updateStats() {
    const accepted = game.state.products.filter(p => p.inspected && p.accepted).length;
    const rejected = game.state.products.filter(p => p.inspected && !p.accepted).length;
    const accuracy = game.state.stats.accuracy || 0;

    document.getElementById('acceptedCount').textContent = accepted;
    document.getElementById('rejectedCount').textContent = rejected;
    document.getElementById('accuracyCount').textContent = accuracy + '%';
  }

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

  renderUpgrades() {
    const container = document.getElementById('upgradesContainer');
    container.innerHTML = '';

    const upgrades = [
      { id: 'magnifier', name: i18n.get('upgrade.magnifier.name'), description: i18n.get('upgrade.magnifier.description'), cost: 200 },
      { id: 'speedDetection', name: i18n.get('upgrade.speedDetection.name'), description: i18n.get('upgrade.speedDetection.description'), cost: 150 },
      { id: 'caliper', name: i18n.get('upgrade.caliper.name'), description: i18n.get('upgrade.caliper.description'), cost: 100 },
      { id: 'ultrasound', name: i18n.get('upgrade.ultrasound.name'), description: i18n.get('upgrade.ultrasound.description'), cost: 180 }
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

  showGameOverScreen(detail) {
    const { victory, finalBalance } = detail;

    document.getElementById('gameOverTitle').textContent = victory 
      ? i18n.get('screen.victory.title')
      : i18n.get('screen.gameOver.title');
    
    document.getElementById('gameOverSubtitle').textContent = victory
      ? i18n.get('screen.victory.subtitle')
      : i18n.get('screen.gameOver.subtitle');

    document.getElementById('finalBalance').textContent = `${Math.round(finalBalance)}€`;

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

const ui = new UI();
window.ui = ui;

function setLanguage(lang) {
  ui.setLanguage(lang);
  ui.updateTexts();
  setTimeout(() => {
    ui.showScreen('playerName');
  }, 100);
}

function confirmPlayerName() {
  const nameInput = document.getElementById('playerNameInput');
  const name = nameInput.value.trim();
  if (!name) { alert('Please enter a name'); return; }
  ui.playerName = name;
  localStorage.setItem('playerName', name);
  ui.showScreen('intro');
}

function startGameplay() {
  ui.showScreen('game');
  ui.currentProductIndex = 0;
  game.startDay();
  ui.showCurrentProduct();
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
  ui.currentProductIndex = 0;
  game.startDay();
  ui.showCurrentProduct();
  ui.updateGameScreen();
}

window.addEventListener('gameStateChanged', () => {
  if (!game.state.gameRunning && game.state.day <= 5) {
    setTimeout(() => ui.showDayEndScreen(), 500);
  }
});