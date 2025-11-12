import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationAR from "./locales/ar.json";
import translationTH from "./locales/th.json";

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
  th: { translation: translationTH },
};

// Custom post-processor to handle empty or whitespace-only translations
const fallbackWhitespacePostProcessor = {
  type: "postProcessor",
  name: "fallbackWhitespace",
  process(value, key, options) {
    const lng = options.lng || i18n.language; // Get current language
    // Check if the value is null, undefined, empty, or whitespace-only
    if (value === undefined || value === null || /^\s*$/.test(value)) {
      // If current language is not English, fallback to English
      if (lng !== "en") {
        const fallbackValue = i18n.t(key, { ...options, lng: "en", postProcess: [] });
        // If English fallback is also empty or whitespace-only, return nothing
        return /^\s*$/.test(fallbackValue) ? "" : fallbackValue;
      }
      // If current language is English and the value is empty, return nothing
      return "";
    }
    // If value is valid (non-empty), return it
    return value;
  },
};

// BiDi isolate processor – affects only translated text
const bidiIsolatePostProcessor = {
  type: "postProcessor",
  name: "bidiIsolate",
  process(value, key, options) {
    if (value == null || typeof value !== "string") return value;
    const lng = (options.lng || i18n.language || "en").toLowerCase();
    const dir = i18n.dir
      ? i18n.dir(lng)
      : ["ar", "he", "fa", "ur"].some((l) => lng.startsWith(l))
      ? "rtl"
      : "ltr";

    if (dir === "rtl") {
      // Wrap LTR (ASCII) segments inside RTL text
      return value.replace(/[\p{ASCII}]+/gu, (m) => (m.trim() ? `\u2066${m}\u2069` : m));
    }
    // Optional protection for embedded Arabic/Hebrew in LTR
    return value.replace(/[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, (m) =>
      m.trim() ? `\u2067${m}\u2069` : m
    );
  },
};

// Register processors (run only for i18next strings)
i18n.use(bidiIsolatePostProcessor).use(fallbackWhitespacePostProcessor);

// Initialize
i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  keySeparator: false,
  interpolation: { escapeValue: false },
  returnEmptyString: true,
  postProcess: ["bidiIsolate", "fallbackWhitespace"],
});

export default i18n;
