import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  studyDesk: string;
  curriculumJourney: string;
  summativeTests: string;
  commandDossier: string;
  scholarLedger: string;
  diagnosticAnalytics: string;
  interventions: string;
  currentMastery: string;
  modulesMastered: string;
  overallMastery: string;
  submitAnswer: string;
  submitting: string;
  nextQuestion: string;
  needHint: string;
  availableCredit: string;
  stepByStep: string;
  readConceptLesson: string;
  exitAssessment: string;
  takeYourTime: string;
  correct: string;
  incorrect: string;
  diagnosticTitle: string;
  startDiagnostic: string;
  languageName: string;
  // Mathematical terminology
  fractionTerm: string;
  numeratorTerm: string;
  denominatorTerm: string;
  equivalentTerm: string;
  simplestFormTerm: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'GĀTIPATH',
    tagline: 'Learning that moves at your pace',
    studyDesk: 'Study Desk',
    curriculumJourney: 'Curriculum Journey',
    summativeTests: 'Summative Tests',
    commandDossier: 'Command Dossier',
    scholarLedger: 'Scholar Ledger',
    diagnosticAnalytics: 'Diagnostic Analytics',
    interventions: 'Interventions',
    currentMastery: 'Mastery',
    modulesMastered: 'Modules Mastered',
    overallMastery: 'Overall Mastery',
    submitAnswer: 'Submit Answer',
    submitting: 'Verifying...',
    nextQuestion: 'Next Adaptive Question',
    needHint: 'Need a hint?',
    availableCredit: 'Available Credit',
    stepByStep: 'Progressive Guidance',
    readConceptLesson: 'Read Concept Lesson',
    exitAssessment: 'Exit Assessment',
    takeYourTime: 'Take your time to reason carefully',
    correct: 'Correct!',
    incorrect: 'Incorrect Result',
    diagnosticTitle: 'Smart Knowledge Placement Diagnostic',
    startDiagnostic: 'Start Diagnostic',
    languageName: 'English',
    fractionTerm: 'Fraction',
    numeratorTerm: 'Numerator',
    denominatorTerm: 'Denominator',
    equivalentTerm: 'Equivalent Fraction',
    simplestFormTerm: 'Simplest Form'
  },
  hi: {
    appName: 'गतिपथ (GātiPath)',
    tagline: 'सीखें अपनी गति से',
    studyDesk: 'अध्ययन कक्ष',
    curriculumJourney: 'पाठ्यक्रम यात्रा',
    summativeTests: 'मूल्यांकन परीक्षा',
    commandDossier: 'शिक्षक डैशबोर्ड',
    scholarLedger: 'विद्यार्थी विवरण',
    diagnosticAnalytics: 'नैदानिक विश्लेषण',
    interventions: 'हस्तक्षेप व सहायता',
    currentMastery: 'दक्षता',
    modulesMastered: 'पूर्ण किए गए अध्याय',
    overallMastery: 'कुल दक्षता',
    submitAnswer: 'उत्तर जमा करें',
    submitting: 'जाँच जारी है...',
    nextQuestion: 'अगला अनुकूल प्रश्न',
    needHint: 'संकेत चाहिए?',
    availableCredit: 'उपलब्ध अंक',
    stepByStep: 'चरणबद्ध मार्गदर्शन',
    readConceptLesson: 'अवधारणा पाठ पढ़ें',
    exitAssessment: 'परीक्षा से बाहर निकलें',
    takeYourTime: 'ध्यानपूर्वक सोच-समझकर उत्तर दें',
    correct: 'सही उत्तर!',
    incorrect: 'अशुद्ध उत्तर',
    diagnosticTitle: 'स्मार्ट स्तर निर्धारण निदान',
    startDiagnostic: 'निदान प्रारंभ करें',
    languageName: 'हिंदी',
    fractionTerm: 'भिन्न',
    numeratorTerm: 'अंश',
    denominatorTerm: 'हर',
    equivalentTerm: 'तुल्य भिन्न',
    simplestFormTerm: 'सरलतम रूप'
  },
  mr: {
    appName: 'गतिपथ (GātiPath)',
    tagline: 'शिका तुमच्या स्वतःच्या वेगाने',
    studyDesk: 'अभ्यास कक्ष',
    curriculumJourney: 'अभ्यासक्रम प्रवास',
    summativeTests: 'मूल्यमापन चाचणी',
    commandDossier: 'शिक्षक नियंत्रण फलक',
    scholarLedger: 'विद्यार्थी नोंदवही',
    diagnosticAnalytics: 'नैदानिक विश्लेषण',
    interventions: 'अध्यापन साहाय्य',
    currentMastery: 'प्रावीण्य',
    modulesMastered: 'पूर्ण झालेले घटक',
    overallMastery: 'एकूण प्रावीण्य',
    submitAnswer: 'उत्तर सबमिट करा',
    submitting: 'तपासत आहे...',
    nextQuestion: 'पुढचा अनुकूल प्रश्न',
    needHint: 'संकेत हवा आहे?',
    availableCredit: 'मिळणारे गुण',
    stepByStep: 'टप्प्याटप्प्याने मार्गदर्शन',
    readConceptLesson: 'संकल्पना पाठ वाचा',
    exitAssessment: 'चाचणीतून बाहेर पडा',
    takeYourTime: 'काळजीपूर्वक विचार करून सोडवा',
    correct: 'अचूक उत्तर!',
    incorrect: 'चुकीचे उत्तर',
    diagnosticTitle: 'स्मार्ट ज्ञान पातळी चाचणी',
    startDiagnostic: 'चाचणी सुरू करा',
    languageName: 'मराठी',
    fractionTerm: 'अपूर्णांक',
    numeratorTerm: 'अंश',
    denominatorTerm: 'छेद',
    equivalentTerm: 'सममूल्य अपूर्णांक',
    simplestFormTerm: 'संक्षिप्त रूप'
  }
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = 'gatipath_preferred_language';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
      if (stored && (stored === 'en' || stored === 'hi' || stored === 'mr')) {
        setLanguageState(stored);
      }
    } catch {
      // Default to English
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof TranslationDictionary): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || String(key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
