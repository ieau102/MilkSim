import type { Lang } from "./LanguageContext";

// 翻訳オブジェクトの定義
export const translations = {
  ja: {
    // アプリタイトル
    appTitle: "乳シミュレーター",

    // タブ名
    tabDescription: "説明",
    tabSimulator: "シミュレーター",
    tabData: "乳データ",

    // ボタン
    buttonOk: "OK",
    buttonClear: "クリア",

    // ラベル（シミュレータータブ）
    labelParentChar: "乳親キャラ名",
    labelChildChar: "授乳キャラ名",
    labelEncValue: "乳の+値",
    labelLevel: "調教",
    labelRace: "種族",
    labelJob: "職業",
    labelSkill1: "スキル1",
    labelSkill2: "スキル2",

    // プレースホルダー
    placeholderSelectParent: "乳親キャラを選択",
    placeholderSelectChild: "授乳キャラを選択",
    placeholderSelectRace: "種族を選択",
    placeholderSelectJob: "職業を選択",
    placeholderSelectSkill: "スキルを選択",

    // チェックボックス
    checkboxRandomAdventurer: "授乳キャラをランダム冒険者にする",
    checkboxAddSkill: "授乳キャラにスキルを追加する",

    // メッセージ
    messageInputAll: "すべての項目を入力してください。",
    messageLoading: "読み込み中...",

    // 説明タブ
    aboutTitle: "乳シミュレーターについて",
    aboutDescription: "Elinでキャラクターに授乳した際の能力値上昇の計算を再現するツールです。",
    aboutVersion:
      "現在EA 23.282 安定版の仕様に基づいています。選択肢にそのバージョンまでのキャラなどが表示されない場合は、スーパーリロード（Ctrl + Shift + R）を試してみてください。",
    aboutSimulatorTab:
      "「シミュレーター」タブでは乳親キャラ・授乳対象のキャラなどを選択し、授乳時に上昇する能力値のシミュレーションができます。",
    aboutAddSkill:
      "また「授乳キャラにスキルを追加する」にチェックを入れて追加スキルを選択することで、授乳前に授乳キャラに後天的なスキルを追加した場合の上昇能力値も計算できます。",
    aboutRandomAdventurer:
      "授乳対象のキャラをランダム冒険者にする場合は、「授乳キャラをランダム冒険者にする」にチェックを入れて種族・職業を選択してください。",
    aboutUsageItem1: "各項目を入力後、「OK」ボタンで結果が表示されます。",
    aboutUsageItem2: "「クリア」ボタンですべての入力をリセットできます。",
    aboutDataTab: "「乳データ」タブでは各親モンスターごとの上昇能力値データを一覧で確認できます。",
    aboutDataExplanation:
      "「乳データ」は乳の+値が23(調教レベル100相当)での上昇値傾向を示しています。",
    aboutDataUsageItem1:
      "表の右上にあるボタン群からフィルターや検索、必要ない能力の非表示などができます。",
    aboutDataUsageItem2:
      "標準では1ページ20キャラのみ表示しており、右下のボタン群からページ送りや表示キャラ数を変更できます。",
    aboutWarningTitle: "注意事項",
    aboutWarning:
      "このシミュレーターは実際のゲームの仕様を限りなく近く再現していますが、実際のゲームの挙動を完全に保証するものではありません。",
    aboutWarningDetail:
      "シミュレーターの結果と実際のゲーム内での結果が異なる場合があることをご了承ください。",
    aboutNotesTitle: "備考",
    aboutNotes:
      "EA23.282安定版Patch3に対応しました。(2026/3/5)\n試験的に英語に対応しました。(2026/2/12) 説明文はAIにより翻訳しているため、正確でない場合があります。",
    aboutContact:
      "ご意見・ご要望・不具合の報告については、Elin公式Discordサーバーではsil(ieau512)にメンションまたはDMで、Twitterでは@morute00にメンションまたはDMでご連絡ください。",

    // データタブ
    dataTableParentCharacter: "親モンスター名",

    // シミュレータータブ - テーブル
    tableHeaderAbility: "能力名",
    tableHeaderIncrease: "上昇値",
    tableHeaderDifference: "上限との差",
    messageTamingRequired: "上限には調教レベルが{0}必要です",
  },
  en: {
    // アプリタイトル
    appTitle: "Milk Simulator",

    // タブ名
    tabDescription: "Description",
    tabSimulator: "Simulator",
    tabData: "Milk Data",

    // ボタン
    buttonOk: "OK",
    buttonClear: "Clear",

    // ラベル（シミュレータータブ）
    labelParentChar: "Parent Character",
    labelChildChar: "Child Character",
    labelEncValue: "Milk Enhancement",
    labelLevel: "Taming",
    labelRace: "Race",
    labelJob: "Job",
    labelSkill1: "Skill 1",
    labelSkill2: "Skill 2",

    // プレースホルダー
    placeholderSelectParent: "Select parent character",
    placeholderSelectChild: "Select child character",
    placeholderSelectRace: "Select race",
    placeholderSelectJob: "Select job",
    placeholderSelectSkill: "Select skill",

    // チェックボックス
    checkboxRandomAdventurer: "Set child character as random adventurer",
    checkboxAddSkill: "Add skills to child character",

    // メッセージ
    messageInputAll: "Please fill in all fields.",
    messageLoading: "Loading...",

    // 説明タブ
    aboutTitle: "About Milk Simulator",
    aboutDescription:
      "This app simulates the ability value calculations when characters are fed in Elin.",
    aboutVersion:
      "Currently based on EA 23.282 stable version specifications. If characters up to that version are not displayed in the options, try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R).",
    aboutSimulatorTab:
      'In the "Simulator" tab, you can select the parent character, feed target character, etc., and simulate the ability value increases during feeding.',
    aboutAddSkill:
      'By checking "Add skills to child character" and selecting additional skills, you can also calculate the increased ability values when acquired skills are added to the character before feeding.',
    aboutRandomAdventurer:
      'To set the feed target character as a random adventurer, check "Set child character as random adventurer" and select race and job.',
    aboutUsageItem1: 'After entering each item, click the "OK" button to display the results.',
    aboutUsageItem2: 'The "Clear" button resets all inputs.',
    aboutDataTab:
      'In the "Milk Data" tab, you can view a list of increased ability value data for each parent monster.',
    aboutDataExplanation:
      '"Milk Data" shows the trend of increased values when the Milk Enhancement is 23 (equivalent to taming level 100).',
    aboutDataUsageItem1:
      "You can filter, search, and hide unnecessary abilities using the buttons in the upper right corner of the table.",
    aboutDataUsageItem2:
      "By default, only 20 entries are displayed per page. You can change pages and the number of displayed entries using the buttons in the lower right corner.",
    aboutWarningTitle: "Disclaimer",
    aboutWarning:
      "While this simulator closely replicates the actual game specifications, it does not guarantee complete accuracy with the actual game behavior.",
    aboutWarningDetail:
      "Please understand that the simulator results may differ from the actual in-game results.",
    aboutNotesTitle: "Notes",
    aboutNotes:
      "Updated for EA23.282 stable version Patch3 (March 5, 2026).\nEnglish support is now available on an experimental basis (February 12, 2026). Translations may not be fully accurate as they are AI-generated.",
    aboutContact:
      "For feedback, requests, or bug reports, please mention or DM sil(ieau512) on the official Elin Discord server, or mention or DM @morute00 on X (formerly Twitter).",

    // データタブ
    dataTableParentCharacter: "Parent Monster Name",

    // シミュレータータブ - テーブル
    tableHeaderAbility: "Ability",
    tableHeaderIncrease: "Increase",
    tableHeaderDifference: "Difference from Limit",
    messageTamingRequired: "Taming level {0} is required to reach the limit",
  },
} as const;

// 型定義（TypeScriptの補完用）
export type TranslationKey = keyof typeof translations.ja;
export type Translations = typeof translations.ja;

// 翻訳を取得するヘルパー関数
export function getTranslations(lang: Lang): Translations {
  return translations[lang] as Translations;
}
