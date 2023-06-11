import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        supportedLngs: ['en', 'fr'],
        fallbackLng: 'fr',
        detection: {
            order: ['cookie', 'localStorage', 'path', 'htmlTag'],
            caches: ['cookie'],
        },
        backend: {
            loadPath: '/assets/locals/{{lng}}/translation.json'
        },
        react: { useSuspense: false },
        warn: false,
});
