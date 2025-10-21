/**
 * app.js
 * Point d'entrée - Initialisation du jeu
 */

console.log('%c🎮 Quality Control Game - Initializing...', 'color: #00A8E9; font-size: 14px; font-weight: bold;');

/**
 * Initialiser toute l'application
 */
async function initializeApp() {
  try {
    console.log('📋 Step 1: Initializing i18n...');
    const i18nReady = await i18n.init();
    if (!i18nReady) {
      throw new Error('Failed to initialize i18n');
    }

    console.log('📋 Step 2: Initializing game engine...');
    const gameReady = await game.init();
    if (!gameReady) {
      throw new Error('Failed to initialize game');
    }

    console.log('📋 Step 3: Initializing UI...');
    ui.init();

    console.log('%c✓ Application initialized successfully!', 'color: #10B981; font-size: 12px; font-weight: bold;');
    console.log('%cVersion: 1.0.0 | Language: ' + i18n.getLanguage().toUpperCase(), 'color: #666; font-size: 11px;');

  } catch (error) {
    console.error('%c✗ Critical error during initialization:', 'color: #EF4444; font-size: 12px; font-weight: bold;');
    console.error(error);

    // Afficher un message d'erreur
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #09367A 0%, #00A8E9 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: white;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 500px;
        ">
          <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
          <h1 style="color: #09367A; margin-bottom: 16px;">Error Loading Game</h1>
          <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
            ${error.message}
          </p>
          <p style="color: #999; font-size: 0.9rem; margin-bottom: 20px;">
            Please check the browser console (F12) for more details.
          </p>
          <button onclick="location.reload()" style="
            background: linear-gradient(135deg, #09367A 0%, #00A8E9 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1rem;
          ">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', initializeApp);

// Gestion des erreurs non capturées
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
