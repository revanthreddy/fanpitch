import { ChatMessage } from '../types';
import { useState } from 'react';
import { IoLanguage } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { HiFlag } from 'react-icons/hi2';

type Language = {
  code: string;
  name: string;
  icon: JSX.Element;
};

const LANGUAGES: Language[] = [
  {
    code: 'japanese',
    name: 'Japanese',
    icon: <HiFlag className="text-red-600" />,
  },
  {
    code: 'spanish',
    name: 'Spanish',
    icon: <HiFlag className="text-yellow-600" />,
  },
];

const AIBanner = ({ text, sender }: ChatMessage) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTranslate = async (language: string) => {
    setIsTranslating(true);
    setIsDropdownOpen(false);
    try {
      const response = await fetch(
        'https://us-central1-ethereal-temple-448819-n0.cloudfunctions.net/playgist_function/translate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            translate_to: language,
          }),
        },
      );

      const data = await response.json();
      setTranslatedText(data.translated_text || data.text);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleResetTranslation = () => {
    setTranslatedText(null);
  };

  return (
    <div className="w-full flex justify-center my-8 relative">
      <div className="max-w-ai-banner bg-gradient-to-r from-chat-ai-border-from via-chat-ai-border-via to-chat-ai-border-to rounded-lg p-[2px] shadow-lg hover:shadow-xl transition-all">
        <div className="bg-white rounded-lg p-banner-padding relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chat-ai-accent rounded-full animate-bounce" />
              <span className="text-sm font-bold text-chat-ai-text uppercase tracking-wider">
                MLB AI Assistant
              </span>
            </div>
            <div className="text-xs text-gray-500">{sender?.name}</div>
          </div>

          <div className="text-chat-ai-text whitespace-pre-wrap font-medium">
            {translatedText || text}
          </div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2">
            {!translatedText ? (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}>
                <button
                  disabled={isTranslating}
                  className="w-8 h-8 text-lg bg-primary text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex items-center justify-center">
                  {isTranslating ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                  ) : (
                    <IoLanguage />
                  )}
                </button>
                {isDropdownOpen && !isTranslating && (
                  <div className="absolute top-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleTranslate(lang.name)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2 cursor-pointer">
                        {lang.icon}
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleResetTranslation}
                className="w-8 h-8 text-lg bg-primary text-white rounded-full hover:bg-blue-600 cursor-pointer flex items-center justify-center">
                <IoMdArrowRoundBack />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBanner;
