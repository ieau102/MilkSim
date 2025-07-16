import { useState, useEffect } from "react";
import Select from "react-select";
import type { Element, Char, Race, Job } from "./Source";
import { loadElements, loadChars, loadRaceElements, loadJobElements } from "./Source";
import { calcMergedElementMap, bestAttribute, bestSkill, milkDifference } from "./SimulateFunc";

function Button({
  onClick,
  children,
  style,
}: {
  onClick: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#cac8c8ff",
        color: "#222222",
        fontWeight: "bold",
        fontSize: "1em",
        padding: "0.5em 1.5em",
        border: "none",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.1s",
        margin: "0 0.5em",
        ...style, // ここで上書き
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onFocus={(e) => (e.currentTarget.style.outline = "2px solid #6b6b6bff")}
    >
      {children ?? "OK"}
    </button>
  );
}

export function SimulatorTab() {
  const isSmall = window.innerWidth < 500;
  const isMiddle = window.innerWidth >= 500 && window.innerWidth < 800;
  const isLarge = window.innerWidth >= 800 && window.innerWidth < 1600;
  const [elements, setElements] = useState<Element[]>([]);
  const [chars, setChars] = useState<Char[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedParent, setSelectedParent] = useState<Char | null>(null);
  const [selectedChild, setSelectedChild] = useState<Char | null>(null);
  const [inputEnc, setInputEnc] = useState<number | "">("");
  const [inputLv, setInputLv] = useState<number | "">("");
  const [useRaceJob, setUseRaceJob] = useState(false);
  const [useAddSkill, setUseAddSkill] = useState(false);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectAddSkill1, setSelectAddSkill1] = useState<Element | null>(null);
  const [selectAddSkill2, setSelectAddSkill2] = useState<Element | null>(null);
  const [result, setResult] = useState<string | null | Map<string, number>>(null);
  const [fictitiousDifference, setFictitiousDifference] = useState<null | Map<string, number>>(
    null
  );

  useEffect(() => {
    loadElements().then((data) => {
      setElements(data);
    });
    loadChars().then((data) => {
      setChars(data);
    });
    loadRaceElements().then((data) => {
      setRaces(data);
    });
    loadJobElements().then((data) => {
      setJobs(data);
    });
  }, []);

  const allCharNameMap = chars.reduce(
    (acc, char) => {
      if (char.charNameMap) {
        Object.entries(char.charNameMap).forEach(([key, value]) => {
          acc[key] = value;
        });
      }
      return acc;
    },
    {} as Record<string, string>
  );
  const allRaceNameMap = races.reduce(
    (acc, race) => {
      if (race.raceNameMap) {
        Object.entries(race.raceNameMap).forEach(([key, value]) => {
          acc[key] = value;
        });
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const allJobNameMap = jobs.reduce(
    (acc, job) => {
      if (job.jobNameMap) {
        Object.entries(job.jobNameMap).forEach(([key, value]) => {
          acc[key] = value;
        });
      }
      return acc;
    },
    {} as Record<string, string>
  );
  const allElementNameMap = elements.reduce(
    (acc, element) => {
      if (element.alias && element.category === "skill" && !element.tag.includes("unused")) {
        acc[element.alias] = element.name_JP;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  function handleCalc() {
    // 入力値の検証
    if (
      !selectedParent ||
      (useRaceJob ? !selectedRace || !selectedJob : !selectedChild) ||
      inputEnc === "" ||
      inputLv === ""
    ) {
      setResult("すべての項目を入力してください。");
      return;
    }
    // 入力値からシミュレーションを実行
    const mergedActualParent = calcMergedElementMap(
      selectedParent,
      null,
      null,
      Number(inputLv),
      Number(inputEnc),
      elements,
      races,
      jobs,
      false,
      true
    );
    const mergedFictitiousParent = calcMergedElementMap(
      selectedParent,
      null,
      null,
      Number(inputLv),
      Number(inputEnc),
      elements,
      races,
      jobs,
      false,
      false
    );
    const mergedChild = calcMergedElementMap(
      selectedChild,
      selectedRace,
      selectedJob,
      Number(inputLv),
      Number(inputEnc),
      elements,
      races,
      jobs,
      useRaceJob,
      true
    );
    const bestAttributeMap = bestAttribute(mergedActualParent, elements);
    const bestSkillMap = bestSkill(mergedActualParent, elements);
    const bestFictitiousAttributeMap = bestAttribute(mergedFictitiousParent, elements);
    const bestFictitiousSkillMap = bestSkill(mergedFictitiousParent, elements);
    const Difference = milkDifference(
      bestAttributeMap,
      bestSkillMap,
      mergedChild,
      selectAddSkill1,
      selectAddSkill2
    );
    const fictitiousDifference = milkDifference(
      bestFictitiousAttributeMap,
      bestFictitiousSkillMap,
      mergedChild,
      selectAddSkill1,
      selectAddSkill2
    );
    setResult(Difference);
    setFictitiousDifference(fictitiousDifference);
  }

  function handleClear() {
    setSelectedParent(null);
    setSelectedChild(null);
    setInputEnc("");
    setInputLv("");
    setUseRaceJob(false);
    setSelectedRace(null);
    setSelectedJob(null);
    setUseAddSkill(false);
    setSelectAddSkill1(null);
    setSelectAddSkill2(null);
    setResult(null);
    setFictitiousDifference(null);
  }

  return (
    <div
      style={{
        color: "#222222",
        zoom:
          isSmall ? "0.65"
          : isMiddle ? "1.1"
          : isLarge ? "1.25"
          : "1.4",
      }}
    >
      <div style={{ display: "flex", gap: "1em", alignItems: "center", justifyContent: "center" }}>
        {/* 乳親キャラ選択 */}
        <span>乳親キャラ名</span>
        <Select
          options={Object.entries(allCharNameMap).map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          isClearable
          onChange={(option) => {
            const char = chars.find((c) => c.id === option?.value);
            setSelectedParent(char || null);
          }}
          placeholder="乳親キャラを選択"
          styles={{
            container: (base) => ({ ...base, width: "300px", margin: "10px", top: "5px" }),
          }}
          value={
            selectedParent ?
              {
                value: selectedParent.id,
                label: Object.values(selectedParent.charNameMap ?? {})[0],
              }
            : null
          }
        />
      </div>
      <div style={{ display: "flex", gap: "1em", alignItems: "center", justifyContent: "center" }}>
        {/* 授乳キャラ選択 */}
        <span>授乳キャラ名</span>
        <Select
          options={Object.entries(allCharNameMap).map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          isClearable
          onChange={(option) => {
            const char = chars.find((c) => c.id === option?.value);
            setSelectedChild(char || null);
          }}
          placeholder="授乳キャラを選択"
          styles={{ container: (base) => ({ ...base, width: "300px", margin: "10px" }) }}
          isDisabled={useRaceJob} // チェック時は選択不可
          value={
            useRaceJob ? null
            : selectedChild ?
              { value: selectedChild.id, label: Object.values(selectedChild.charNameMap ?? {})[0] }
            : null
          }
        />
      </div>
      {/* 冒険者チェックボックス */}
      <div style={{ textAlign: "center", marginBottom: "1em" }}>
        <label>
          <input
            type="checkbox"
            checked={useRaceJob}
            onChange={(e) => {
              setUseRaceJob(e.target.checked);
              if (e.target.checked) setSelectedChild(null); // チェック時にクリア
            }}
            style={{
              marginRight: "0.5em",
              marginTop: "1.2em",
              width: "15px",
              height: "15px",
              background: "#fff",
              accentColor: "#0078d4",
            }}
          />
          授乳キャラをランダム冒険者にする
        </label>
      </div>
      {/* スキル追加チェックボックス */}
      <div style={{ textAlign: "center", marginBottom: "1em" }}>
        <label>
          <input
            type="checkbox"
            checked={useAddSkill}
            onChange={(e) => {
              setUseAddSkill(e.target.checked);
            }}
            style={{
              marginRight: "0.5em",
              marginTop: "1.2em",
              width: "15px",
              height: "15px",
              background: "#fff",
              accentColor: "#0078d4",
            }}
          />
          授乳キャラにスキルを追加する
        </label>
      </div>
      {/* 種族・職業選択（チェック時のみ表示） */}
      {useRaceJob && (
        <div
          style={{
            display: "flex",
            gap: "1em",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isSmall ? "1em" : "1em",
          }}
        >
          <span>種族</span>
          <Select
            options={Object.entries(allRaceNameMap).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            isClearable
            onChange={(option) => {
              const race = races.find((r) => r.id === option?.value);
              setSelectedRace(race || null);
            }}
            placeholder="種族を選択"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuPlacement="auto"
            styles={{
              container: (base) => ({ ...base, width: "160px", margin: "10px", top: "5px" }),
              control: (base) => ({ ...base, width: "160px", minWidth: "160px" }),
              menu: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                zIndex: 9999,
              }),
              menuList: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                boxSizing: "border-box",
                paddingRight: 0,
              }),
              option: (base) => ({
                ...base,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "160px",
              }),
            }}
          />
          <span>職業</span>
          <Select
            options={Object.entries(allJobNameMap).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            isClearable
            onChange={(option) => {
              const job = jobs.find((j) => j.id === option?.value);
              setSelectedJob(job || null);
            }}
            placeholder="職業を選択"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuPlacement="auto"
            styles={{
              container: (base) => ({ ...base, width: "160px", margin: "10px", top: "5px" }),
              control: (base) => ({ ...base, width: "160px", minWidth: "160px" }),
              menu: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                zIndex: 9999,
              }),
              menuList: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                boxSizing: "border-box",
                paddingRight: 0,
              }),
              option: (base) => ({
                ...base,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "160px",
              }),
            }}
          />
        </div>
      )}
      {/* スキル追加選択（チェック時のみ表示） */}
      {useAddSkill && (
        <div
          style={{
            display: "flex",
            gap: "1em",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isSmall ? "0.9em" : "1em",
          }}
        >
          <span>スキル1</span>
          <Select
            options={Object.entries(allElementNameMap).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            isClearable
            onChange={(option) => {
              const skill1 = elements.find((e) => e.alias === option?.value);
              setSelectAddSkill1(skill1 || null);
            }}
            placeholder="スキルを選択"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuPlacement="auto"
            styles={{
              container: (base) => ({ ...base, width: "160px", margin: "10px", top: "5px" }),
              control: (base) => ({ ...base, width: "160px", minWidth: "160px" }),
              menu: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                zIndex: 9999,
              }),
              menuList: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                boxSizing: "border-box",
                paddingRight: 0,
              }),
              option: (base) => ({
                ...base,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "160px",
              }),
            }}
          />
          <span>スキル2</span>
          <Select
            options={Object.entries(allElementNameMap).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            isClearable
            onChange={(option) => {
              const skill2 = elements.find((j) => j.alias === option?.value);
              setSelectAddSkill2(skill2 || null);
            }}
            placeholder="スキルを選択"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuPlacement="auto"
            styles={{
              container: (base) => ({ ...base, width: "160px", margin: "10px", top: "5px" }),
              control: (base) => ({ ...base, width: "160px", minWidth: "160px" }),
              menu: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                zIndex: 9999,
              }),
              menuList: (base) => ({
                ...base,
                width: "160px",
                maxWidth: "160px",
                overflowX: "hidden",
                boxSizing: "border-box",
                paddingRight: 0,
              }),
              option: (base) => ({
                ...base,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "160px",
              }),
            }}
          />
        </div>
      )}

      {/* 数値入力欄 */}
      <div style={{ textAlign: "center" }}>
        <span>乳プラス値</span>
        <input
          type="number"
          value={inputEnc}
          min={0}
          onChange={(e) => setInputEnc(e.target.value === "" ? "" : Number(e.target.value))}
          style={{
            margin: "1em",
            width: "100px",
            background: "#fff",
            color: "#222",
            border: "1px solid #ccc",
          }}
        />
        {/* 数値入力欄 */}
        <span>調教レベル</span>
        <input
          type="number"
          value={inputLv}
          min={0}
          onChange={(e) => setInputLv(e.target.value === "" ? "" : Number(e.target.value))}
          style={{
            margin: "1em",
            width: "100px",
            background: "#fff",
            color: "#222",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1em",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0.5em",
        }}
      ></div>
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={handleClear}
          style={{
            background: "red",
            color: "white",
            fontWeight: "bold",
            fontSize: "1em",
            padding: "0.4em 0.9em",
            border: "none",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "background 0.2s, transform 0.1s",
            margin: "0 0.7em",
          }}
        >
          クリア
        </Button>
        <Button onClick={handleCalc}>OK</Button>
      </div>
      {/* 選択されたキャラクターの情報表示 */}
      <div style={{ textAlign: "center", marginTop: "1em" }}>
        {result === "すべての項目を入力してください。" && (
          <div style={{ color: "red", fontWeight: "bold" }}>{result}</div>
        )}
      </div>
      {result instanceof Map && 20 + Number(inputLv) - (Number(inputEnc) * 5 + 5) < 0 && (
        <div style={{ textAlign: "center", marginTop: "1em" }}>
          <span style={{ fontWeight: "bold", color: "#333" }}>
            上限には調教レベルが{5 + Number(inputEnc) * 5 - 20}必要です
          </span>
        </div>
      )}
      {/* 結果のテーブル表示 */}
      {result instanceof Map && (
        <table style={{ margin: "1em auto", borderCollapse: "collapse", minWidth: "300px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "0.5em" }}>能力名</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5em" }}>上昇値</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5em" }}>上限との差</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(result.entries()).map(([key, value]) => (
              <tr key={key}>
                <td style={{ border: "1px solid #ccc", padding: "0.5em", textAlign: "center" }}>
                  {elements.find((e) => e.alias === key)?.name_JP}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5em", textAlign: "center" }}>
                  {value}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5em", textAlign: "center" }}>
                  {value - fictitiousDifference!.get(key)!}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
