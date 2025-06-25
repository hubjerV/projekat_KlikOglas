import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // pokušava automatski detektovati jezik browsera
  .use(initReactI18next) // povezivanje sa Reactom
  .init({
    fallbackLng: "bs", // ako ne može detektovati jezik
    debug: true, // ispiši info u konzolu (samo za razvoj)
    interpolation: {
      escapeValue: false, // React već escapuje podatke
    },
    resources: {
      bs: {
        translation: require("./locales/bs/translation.json"),
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
