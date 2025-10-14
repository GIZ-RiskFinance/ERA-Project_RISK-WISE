import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationAR from "./locales/ar.json";
import translationTH from "./locales/th.json";

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
  th: {
    translation: translationTH,
  },
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

// Register the custom post-processor
i18n.use(fallbackWhitespacePostProcessor);

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  keySeparator: false, // Do not use nested keys with dots

  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
  returnEmptyString: true, // Ensure empty strings are handled in the post-processor
  postProcess: ["fallbackWhitespace"], // Use the custom post-processor
});

export default i18n;
