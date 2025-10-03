// ============================================
// Localization System
// ============================================

class LocalizationManager {
    constructor() {
        this.currentLang = 'ko';
        this.translations = {};
        this.translationCache = {}; // 번역 캐시 추가
        this.supportedLanguages = ['ko', 'en', 'ja'];
        this.languageNames = {
            'ko': '한국어',
            'en': 'English',
            'ja': '日本語'
        };
    }

    // Initialize localization
    async init() {
        // Detect browser language
        const browserLang = this.detectBrowserLanguage();
        
        // Check if language was previously selected
        const savedLang = localStorage.getItem('preferredLanguage');
        
        // Set current language
        this.currentLang = savedLang || browserLang;
        
        // Load translation file
        await this.loadTranslations(this.currentLang);
        
        // Apply translations
        this.applyTranslations();
        
        // Update language selector
        this.updateLanguageSelector();
    }

    // Detect browser language
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get 'ko' from 'ko-KR'
        
        // Return supported language or default to Korean
        return this.supportedLanguages.includes(langCode) ? langCode : 'ko';
    }

    // Load translation file (캐싱 적용)
    async loadTranslations(lang) {
        // 캐시에 이미 있으면 바로 사용
        if (this.translationCache[lang]) {
            this.translations = this.translationCache[lang];
            return true;
        }

        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) throw new Error('Translation file not found');
            const data = await response.json();
            
            // 캐시에 저장
            this.translationCache[lang] = data;
            this.translations = data;
            return true;
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            // Fallback to Korean if loading fails
            if (lang !== 'ko') {
                const response = await fetch('locales/ko.json');
                const data = await response.json();
                this.translationCache['ko'] = data;
                this.translations = data;
            }
            return false;
        }
    }

    // Get translation by key path (e.g., 'nav.home')
    t(keyPath) {
        const keys = keyPath.split('.');
        let value = this.translations;
        
        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                return keyPath; // Return key if translation not found
            }
        }
        
        return value || keyPath;
    }

    // Apply translations to the page
    applyTranslations() {
        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // <br> 태그나 HTML이 포함된 번역은 innerHTML 사용
            if (element.hasAttribute('data-i18n-html') || translation.includes('<br>')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update arrays (like tags)
        this.updateArrayTranslations();
        
        // Update document title
        document.title = `Doobu Games - Indie Game Studio`;
        
        // 디버그 로그
        console.log(`[i18n] Translations applied: ${this.currentLang}`);
    }

    // Update array translations (tags, etc.)
    updateArrayTranslations() {
        // Update 3D Audio tags
        const tags3daudio = this.t('projects.game3daudio.tags');
        if (Array.isArray(tags3daudio)) {
            const tagsContainer = document.querySelector('[data-project="3daudio"] .project-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = tags3daudio.map(tag => 
                    `<span class="tag">${tag}</span>`
                ).join('');
            }
        }
    }

    // Change language
    async changeLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`[i18n] Language ${lang} is not supported`);
            return;
        }

        console.log(`[i18n] Changing language to: ${lang}`);

        // Save preference
        localStorage.setItem('preferredLanguage', lang);
        this.currentLang = lang;

        // 즉시 적용을 위해 애니메이션 시작
        document.body.style.transition = 'opacity 0.15s ease';
        document.body.style.opacity = '0.95';

        try {
            // Load and apply new translations
            await this.loadTranslations(lang);
            console.log(`[i18n] Translations loaded for: ${lang}`);
            
            this.applyTranslations();
            this.updateLanguageSelector();

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: lang } 
            }));

            console.log(`[i18n] Language changed successfully to: ${lang}`);
        } catch (error) {
            console.error(`[i18n] Error changing language:`, error);
        }

        // 부드럽게 복원
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 50);
    }

    // Update language selector UI
    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLang;
        }

        // Update active state in dropdown
        document.querySelectorAll('.lang-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Get language name
    getLanguageName(lang) {
        return this.languageNames[lang] || lang;
    }
}

// Create global instance
const i18n = new LocalizationManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Export for use in other scripts
window.i18n = i18n;
