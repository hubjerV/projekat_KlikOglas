"use client";

import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex justify-end gap-2 p-4">
      <button
        onClick={() => changeLanguage("bs")}
        className={`px-3 py-1 rounded ${
          i18n.language === "bs"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        Bosanski
      </button>
      <button
        onClick={() => changeLanguage("sr")}
        className={`px-3 py-1 rounded ${
          i18n.language === "sr"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        Srpski
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded ${
          i18n.language === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
