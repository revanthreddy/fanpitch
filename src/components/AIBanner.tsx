import { ChatMessage } from '../types';
import { useState } from 'react';
import { IoLanguage } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { HiFlag } from 'react-icons/hi2';
import { RiGeminiLine } from 'react-icons/ri';
import { PiBaseballDuotone } from 'react-icons/pi';

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

const AIBanner = ({ text, videoUrls = [] }: ChatMessage) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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
      const translatedContent = data.translated_text || data.text;
      // Only flip if we got a different translation
      if (translatedContent !== text) {
        setTranslatedText(translatedContent);
        setIsFlipped(true);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleResetTranslation = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setTranslatedText(null);
    }, 500); // Match the duration of the flip animation
  };

  return (
    <div className="w-full flex justify-center py-4 relative">
      <div className="relative [perspective:1000px] max-w-ai-banner animate-float-in">
        <div
          className={`relative transition-all duration-500 [transform-style:preserve-3d] ${
            isFlipped
              ? '[transform:rotateX(-180deg)]'
              : '[transform:rotateX(0deg)]'
          }`}>
          {/* Front face */}
          <div className="bg-gradient-to-r from-chat-ai-border-from via-chat-ai-border-via to-chat-ai-border-to rounded-xl p-[4px] shadow-lg hover:shadow-xl [backface-visibility:hidden]">
            <div className="bg-white rounded-lg p-banner-padding">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce">
                    <PiBaseballDuotone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-chat-ai-text uppercase tracking-wider">
                    FanPitch
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <RiGeminiLine className="inline-block mr-1" />
                  powered by Google Cloud
                </div>
              </div>
              <div className="text-chat-ai-text whitespace-pre-wrap font-medium">
                {text}
              </div>
              {videoUrls.map((url) => (
                <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video">
                  <video controls className="w-full h-full" playsInline>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>

          {/* Back face */}
          <div className="h-max bg-gradient-to-r from-chat-ai-border-from via-chat-ai-border-via to-chat-ai-border-to rounded-xl p-[4px] shadow-lg hover:shadow-xl absolute inset-0 [transform:rotateX(180deg)] [backface-visibility:hidden]">
            <div className="bg-white rounded-lg p-banner-padding">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce">
                    <PiBaseballDuotone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-chat-ai-text uppercase tracking-wider">
                    FanPitch
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <RiGeminiLine className="inline-block mr-1" />
                  powered by Google Cloud
                </div>
              </div>
              <div className="text-chat-ai-text whitespace-pre-wrap font-medium">
                {translatedText}
              </div>
              {videoUrls.map((url) => (
                <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video">
                  <video controls className="w-full h-full" playsInline>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -right-12 top-1/2 -translate-y-1/2">
          {!translatedText ? (
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}>
              <button
                disabled={isTranslating}
                className="w-8 h-8 text-lg bg-secondary text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex items-center justify-center transition-colors duration-200">
                {isTranslating ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                ) : (
                  <IoLanguage />
                )}
              </button>
              {isDropdownOpen && !isTranslating && (
                <div className="absolute top-0 right-0 sm:right-auto bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 transform transition-all duration-200 origin-left">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleTranslate(lang.name)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2 cursor-pointer transition-colors duration-200">
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
              className="w-8 h-8 text-lg bg-primary text-white rounded-full hover:bg-blue-600 cursor-pointer flex items-center justify-center transition-colors duration-200">
              <IoMdArrowRoundBack />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBanner;
