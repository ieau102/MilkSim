import { useState } from "react";
import { SimulatorTab } from "./SimulatorTab";
import { MilkDataTab } from "./MilkDataTab";

function MainLayout() {
  const [activeTab, setActiveTab] = useState(0);

  const tabList = [
    {
      label: "説明",
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
          <h2>乳シミュレーターについて</h2>
          このアプリはモンスター育成シミュレーションのためのツールです。
          <br />
          現在EA 23.187 安定版
          の仕様に基づいています。選択肢にそのバージョンまでのキャラなどが表示されない場合は、スーパーリロード（Ctrl
          + Shift + R）を試してみてください。
          <br />
          <br />
          「シミュレーター」タブでは乳親キャラ・授乳対象のキャラなどを選択し、授乳時に上昇する能力値のシミュレーションができます。
          <br />
          また「授乳キャラにスキルを追加する」にチェックを入れて追加スキルを選択することで、後から授乳キャラにスキルを追加した場合の上昇能力値も計算できます。
          <br />
          授乳対象のキャラをランダム冒険者にする場合は、「授乳キャラをランダム冒険者にする」にチェックを入れて種族・職業を選択してください。
          <ul>
            <li>各項目を入力後、「OK」ボタンで結果が表示されます。</li>
            <li>「クリア」ボタンですべての入力をリセットできます。</li>
          </ul>
          <br />
          「乳データ」タブでは各親モンスターごとの上昇能力値データを一覧で確認できます。
          <br />
          「乳データ」は乳の+値が23(調教レベル100相当)での上昇値傾向を示しています。
          <ul>
            <li>
              表の右上にあるボタン群からフィルターや検索、必要ない能力の非表示などができます。
            </li>
            <li>
              標準では1ページ20キャラのみ表示しており、右下のボタン群からページ送りや表示キャラ数を変更できます。
            </li>
          </ul>
          <br />
          <h2 style={{ color: "red" }}>注意事項</h2>
          このシミュレーターは実際のゲームの仕様を限りなく近く再現していますが、乳の+値が+4000など極端に高い場合には、ゲーム内の仕様と異なる場合があります。
        </div>
      ),
    },
    { label: "シミュレーター", content: <SimulatorTab /> },
    { label: "乳データ", content: <MilkDataTab /> },
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
          padding: "16px 0 8px 24px",
          fontFamily: "Yu Gothic",
          fontSize: "1.8rem",
          color: "#222",
          letterSpacing: "0.08em",
          textAlign: "center",
          background: "#f9f9eac5",
        }}
      >
        乳シミュレーター
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
