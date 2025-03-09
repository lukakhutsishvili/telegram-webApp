import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../hooks/useLanguage"; // Import your hook

interface LangButton {
  lang: string;
  flag: string;
}

interface LanguageSelectorProps {
  langButtons: LangButton[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ langButtons }) => {
  const { t } = useTranslation();
  const { selectedLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLang = langButtons.find((btn) => btn.lang === selectedLanguage) || langButtons[0];

  return (
    <div className="relative inline-block w-20">
      <button
        className="flex items-center justify-between p-1 border rounded w-full bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={selectedLang.flag} alt={selectedLang.lang} className="w-10 h-10" />
        <span>{t(selectedLang.lang.toUpperCase())}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow-lg z-10">
          {langButtons.map((button) => (
            <div
              key={button.lang}
              className="flex items-center justify-between p-1 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                changeLanguage(button.lang);
                setIsOpen(false);
              }}
            >
              <img src={button.flag} alt={button.lang} className="w-10 h-10" />
              {t(button.lang.toUpperCase())}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
