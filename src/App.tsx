import { useState } from "react";
import { SimulatorTab } from "./SimulatorTab";
import { MilkDataTab } from "./MilkDataTab";
import { useLanguage } from "./LanguageContext";
import { getTranslations } from "./translations";

function MainLayout() {
  const { lang, setLang } = useLanguage();
  const t = getTranslations(lang);
  const [activeTab, setActiveTab] = useState(0);
  const isSmallScreen = window.innerWidth < 900;

  const tabList = [
    {
      label: t.tabDescription,
      content: (
        <div
          style={{
            padding: "2em",
            fontSize: "1.1em",
            lineHeight: 1.7,
            color: "#222",
            background: "#fff",
          }}
        >
          <h2>{t.aboutTitle}</h2>
          {t.aboutDescription}
          <br />
          {t.aboutVersion}
          <br />
          <br />
          {t.aboutSimulatorTab}
          <br />
          {t.aboutAddSkill}
          <br />
          {t.aboutRandomAdventurer}
          <ul>
            <li>{t.aboutUsageItem1}</li>
            <li>{t.aboutUsageItem2}</li>
          </ul>
          <br />
          {t.aboutDataTab}
          <br />
          {t.aboutDataExplanation}
          <ul>
            <li>{t.aboutDataUsageItem1}</li>
            <li>{t.aboutDataUsageItem2}</li>
          </ul>
          <br />
          <h2 style={{ color: "red" }}>{t.aboutWarningTitle}</h2>
          {t.aboutWarning}
          <br />
          {t.aboutWarningDetail}
          <h2>{t.aboutNotesTitle}</h2>
          <div style={{ whiteSpace: "pre-line" }}>{t.aboutNotes}</div>
          <br />
          {t.aboutContact}
        </div>
      ),
    },
    { label: t.tabSimulator, content: <SimulatorTab /> },
    { label: t.tabData, content: <MilkDataTab /> },
  ];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        background: "#fff",
        overflowX: "hidden", // ←追加
      }}
    >
      {/* タイトル */}
      <div
        style={{
          padding: "16px 24px 8px 24px",
          fontFamily: "Yu Gothic",
          fontSize: isSmallScreen ? "1.4rem" : "1.8rem",
          color: "#222",
          letterSpacing: "0.08em",
          background: "#f9f9eac5",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: isSmallScreen ? "center" : "space-between",
          alignItems: "center",
          position: "relative",
          gap: isSmallScreen ? "12px" : "0",
        }}
      >
        {!isSmallScreen && <div style={{ flex: 1 }}></div>}
        <div
          style={
            isSmallScreen ?
              { textAlign: "center" }
            : { position: "absolute", left: "50%", transform: "translateX(-50%)" }
          }
        >
          {t.appTitle}
        </div>
        <div
          style={{
            flex: isSmallScreen ? "none" : 1,
            display: "flex",
            justifyContent: isSmallScreen ? "center" : "flex-end",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: isSmallScreen ? "0.85rem" : "1rem", color: "#555" }}>
            {isSmallScreen ? "Language" : "言語 / Language:"}
          </span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "ja" | "en")}
            style={{
              padding: isSmallScreen ? "6px 10px" : "8px 12px",
              fontSize: isSmallScreen ? "0.9rem" : "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#333",
              outline: "none",
            }}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      {/* タブボタン枠 */}
      <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
        {tabList.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              outline: "none",

              borderRight: idx < tabList.length - 1 ? "1px solid #eee" : "none",
              borderBottom: activeTab === idx ? "3px solid #0078d4" : "3px solid #fff",
              background: activeTab === idx ? "#F5FDFF" : "none",
              fontWeight: activeTab === idx ? "bold" : "normal",
              color: activeTab === idx ? "#0078d4" : "#333",
              cursor: "pointer",
              borderRadius: 0,
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* タブ内容枠 */}
      <div style={{ padding: "0px", maxWidth: "100%", minHeight: "100%" }}>
        {tabList[activeTab].content}
      </div>
    </div>
  );
}

export default MainLayout;
