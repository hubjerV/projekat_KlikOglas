import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "bs",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      bs: {
        translation: require("../locales/bs/translation.json"),
      },
      sr: {
        translation: require("../locales/sr/translation.json"),
      },
      en: {
        translation: require("../locales/en/translation.json"),
      },
    },
  });

export default i18n;
