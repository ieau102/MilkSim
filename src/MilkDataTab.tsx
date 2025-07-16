import type { Element, Char, Race, Job } from "./Source";
import { loadElements, loadChars, loadRaceElements, loadJobElements } from "./Source";
import { calcMergedElementMap, bestAttribute, bestSkill, milkDifference } from "./SimulateFunc";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useRef } from "react";

export function MilkDataTab() {
  const isSmall = window.innerWidth < 500;
  const isMiddle = window.innerWidth >= 500 && window.innerWidth < 800;
  const isLarge = window.innerWidth >= 800 && window.innerWidth < 1600;

  const charsRef = useRef<Char[]>([]);
  const elementsRef = useRef<Element[]>([]);
  const racesRef = useRef<Race[]>([]);
  const jobsRef = useRef<Job[]>([]);

  useEffect(() => {
    loadChars().then((data) => (charsRef.current = data));
  }, []);
  useEffect(() => {
    loadElements().then((data) => (elementsRef.current = data));
  }, []);
  useEffect(() => {
    loadRaceElements().then((data) => (racesRef.current = data));
  }, []);
  useEffect(() => {
    loadJobElements().then((data) => (jobsRef.current = data));
  }, []);

  const allCharNameMap = charsRef.current.reduce(
    (acc, char) => {
      if (char.charNameMap) {
        Object.entries(char.charNameMap).forEach(([key, value]) => {
          if (!acc[key]) acc[key] = value;
        });
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const mergedChildMap = new Map<string, number[]>();
  elementsRef.current.forEach((e) => {
    if (e.tag === "primary") {
      mergedChildMap.set(e.alias, [1, 0]);
    } else if (e.category === "skill") {
      mergedChildMap.set(e.alias, [1, 0]);
    }
  });

  const data = Object.entries(allCharNameMap).map(([key, value]) => {
    const mergedParentMap = calcMergedElementMap(
      charsRef.current.find((c) => c.id === key) ?? null,
      null,
      null,
      100,
      23,
      elementsRef.current,
      racesRef.current,
      jobsRef.current,
      false,
      true
    );
    const bestAttr = bestAttribute(mergedParentMap, elementsRef.current);
    const bestSkillMap = bestSkill(mergedParentMap, elementsRef.current);
    const milkDiff = milkDifference(bestAttr, bestSkillMap, mergedChildMap, null, null);

    return {
      charName: value,
      milkDiff: Object.fromEntries(milkDiff), // Map→オブジェクト
    };
  });

  // 能力一覧をid順で取得（tag: "primary" または category: "skill" のみ）
  const statusElements = elementsRef.current
    .filter((e) => (e.tag === "primary" || e.category === "skill") && !e.tag.includes("unused"))
    .sort((a, b) => a.id - b.id);

  // ステータスのalias一覧
  // const statusKeys = statusElements.map((e) => e.alias);

  // columns定義
  const columns = [
    {
      accessorKey: "charName",
      header: "親モンスター名",
    },
    ...statusElements.map((e) => ({
      accessorKey: undefined, // accessorKeyは使わない
      header: e.name_JP,
      id: `milkDiff.${e.alias}`,
      accessorFn: (row: { milkDiff: Record<string, number> }) => row.milkDiff?.[e.alias] ?? 0, // ここでデフォルト値
    })),
  ];

  // MaterialReactTableで表示
  return (
    <div
      style={{
        maxWidth: "95%",
        maxHeight: "80vh",
        margin: "auto",
        zoom:
          isSmall ? 0.6
          : isMiddle ? 0.7
          : isLarge ? 0.8
          : 1,
      }}
    >
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{
          density: "compact",
          pagination: { pageIndex: 0, pageSize: 20 }, // ← pageIndexを追加
        }}
      />
    </div>
  );
}
