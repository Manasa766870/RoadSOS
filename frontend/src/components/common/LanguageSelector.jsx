import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

const LanguageSelector = ({ className = '' }) => {
  const { language, setLanguage, languages } = useTranslation();

  return (
    <select
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
      className={`lang-switcher ${className}`}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.native}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
