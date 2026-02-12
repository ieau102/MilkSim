import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// サポートする言語
export type Lang = "ja" | "en";

// コンテキストの型定義
interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

// コンテキストの作成
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ブラウザの言語を検出
function detectBrowserLanguage(): Lang {
  const browserLang = navigator.language.toLowerCase();
  // 日本語ブラウザなら 'ja'、それ以外は 'en'
  return browserLang.startsWith("ja") ? "ja" : "en";
}

// localStorageのキー
const STORAGE_KEY = "milksim_language";

// プロバイダーコンポーネント
export function LanguageProvider({ children }: { children: ReactNode }) {
  // 初期言語の決定: localStorage → ブラウザ検出 → デフォルト('ja')
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ja" || stored === "en") {
      return stored;
    }
    return detectBrowserLanguage();
  });

  // 言語を変更する関数
  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  // 初回マウント時にlocalStorageに保存（初回訪問時）
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

// カスタムフック（コンポーネントで使用）
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
