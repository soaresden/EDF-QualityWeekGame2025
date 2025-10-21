/**
 * i18n.js - Système de gestion des traductions
 * Charge les traductions depuis des fichiers JSON séparés
 */

class I18n {
  constructor() {
    this.currentLanguage = 'fr';
    this.translations = {};
    this.supportedLanguages = ['fr', 'en'];
  }

  /**
   * Initialiser le système i18n
   */
  async init() {
    try {
      // Charger les traductions pour chaque langue
      for (const lang of this.supportedLanguages) {
        const response = await fetch(`./lang/${lang === 'fr' ? 'french' : 'english'}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${lang} translations`);
        }
        this.translations[lang] = await response.json();
      }
      
      // Déterminer la langue par défaut du navigateur
      const browserLang = navigator.language.split('-')[0];
      if (this.supportedLanguages.includes(browserLang)) {
        this.currentLanguage = browserLang;
      }
      
      console.log('✓ i18n initialized with language:', this.currentLanguage);
      return true;
    } catch (error) {
      console.error('✗ Error initializing i18n:', error);
      return false;
    }
  }

  /**
   * Récupérer une traduction
   * @param {string} key - Clé de traduction (ex: "game.title")
   * @param {object} params - Paramètres pour remplacer les variables
   * @returns {string} Texte traduit
   */
  get(key, params = {}) {
    let text = this.translations[this.currentLanguage]?.[key] 
      || this.translations['fr']?.[key] 
      || key; // Fallback: retourner la clé si non trouvée

    // Remplacer les paramètres {{variable}}
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
    }

    return text;
  }

  /**
   * Définir la langue courante
   * @param {string} lang - Code de langue ('fr' ou 'en')
   */
  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
      localStorage.setItem('gameLanguage', lang);
      console.log('✓ Language changed to:', lang);
      return true;
    }
    console.warn('✗ Unsupported language:', lang);
    return false;
  }

  /**
   * Récupérer la langue courante
   * @returns {string} Code de langue actuel
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Récupérer toutes les traductions de la langue courante
   * @returns {object} Objet de traductions
   */
  getAll() {
    return this.translations[this.currentLanguage] || {};
  }

  /**
   * Vérifier si une clé de traduction existe
   * @param {string} key - Clé de traduction
   * @returns {boolean}
   */
  has(key) {
    return key in (this.translations[this.currentLanguage] || {});
  }

  /**
   * Charger une langue spécifique
   * @param {string} lang - Code de langue
   */
  async loadLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.warn('✗ Unsupported language:', lang);
      return false;
    }

    try {
      const fileName = lang === 'fr' ? 'french' : 'english';
      const response = await fetch(`./lang/${fileName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      this.translations[lang] = await response.json();
      this.setLanguage(lang);
      return true;
    } catch (error) {
      console.error(`✗ Error loading language ${lang}:`, error);
      return false;
    }
  }

  /**
   * Ajouter des traductions personnalisées
   * @param {string} lang - Code de langue
   * @param {object} translations - Objet de traductions à fusionner
   */
  extend(lang, translations) {
    if (!this.translations[lang]) {
      this.translations[lang] = {};
    }
    this.translations[lang] = {
      ...this.translations[lang],
      ...translations
    };
  }
}

// Instance globale
const i18n = new I18n();

// Exporter pour utilisation
window.i18n = i18n;
