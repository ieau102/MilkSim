import { ApplyElementMap } from "./CalcStat";
import { FormulaCalc } from "./csharp/Calc";
import type { Env } from "./csharp/Calc";
import type { Element, Char, Race, Job } from "./Source";

export function calcMergedElementMap(
  selectedChar: Char | null,
  selectedRace: Race | null,
  selectedJob: Job | null,
  inputLv: number,
  inputEnc: number,
  elements: Element[],
  races: Race[],
  jobs: Job[],
  useRaceJob: boolean,
  useActualLv: boolean
): Map<string, number[]> {
  const actualLv =
    useActualLv ? Math.max(1, Math.min(20 + inputLv, 5 + inputEnc * 5)) : 5 + inputEnc * 5;
  const RaceValue = ApplyElementMap(
    useRaceJob ?
      (selectedRace?.elementMap ?? {})
    : (races.find((r) => r.id === selectedChar?.race)?.elementMap ?? {}),
    actualLv,
    elements,
    "Char"
  );
  const JobValue = ApplyElementMap(
    useRaceJob ?
      (selectedJob?.elementMap ?? {})
    : (jobs.find((j) => j.id === selectedChar?.job)?.elementMap ?? {}),
    actualLv,
    elements,
    "Char"
  );
  const CharValue = ApplyElementMap(selectedChar?.elementMap ?? {}, actualLv, elements, "Fixed");
  const merged = new Map<string, number[]>();
  const allKeys = new Set([...RaceValue.keys(), ...JobValue.keys(), ...CharValue.keys()]);
  for (const key of allKeys) {
    const raceArr = RaceValue.get(key) ?? [0, 0];
    const jobArr = JobValue.get(key) ?? [0, 0];
    const charArr = CharValue.get(key) ?? [0, 0];
    merged.set(key, [raceArr[0] + jobArr[0] + charArr[0], raceArr[1] + jobArr[1] + charArr[1]]);
  }
  return merged;
}

export function bestAttribute(
  map: Map<string, number[]>,
  elements: Element[]
): Map<string, number> {
  const keys = elements.filter((e) => e.tag === "primary").map((e) => e.alias);
  const filteredSorted = Array.from(map.entries())
    .filter(([key]) => keys.includes(key))
    .sort(
      (a, b) =>
        (b[1][0] - a[1][0]) * 100000 +
        elements.find((e) => e.alias === a[0])!.id -
        elements.find((e) => e.alias === b[0])!.id
    );
  return new Map(filteredSorted.map(([key, value]) => [key, value[0]]));
}

export function bestSkill(map: Map<string, number[]>, elements: Element[]): Map<string, number> {
  const keys = elements.filter((e) => e.category === "skill").map((e) => e.alias);
  const filteredSorted = Array.from(map.entries())
    .filter(([key]) => keys.includes(key))
    .sort(
      (a, b) =>
        (b[1][0] - a[1][0]) * 100000 +
        elements.find((e) => e.alias === a[0])!.id -
        elements.find((e) => e.alias === b[0])!.id
    );
  return new Map(filteredSorted.map(([key, value]) => [key, value[0]]));
}

export function milkDifference(
  bestAttributeMap: Map<string, number>,
  bestSkillMap: Map<string, number>,
  mergedChild: Map<string, number[]>,
  selectAddSkill1: Element | null,
  selectAddSkill2: Element | null
): Map<string, number> {
  const milkAttributeDifference = new Map<string, number>();
  let milkRate = 100;
  for (const [key, value] of bestAttributeMap.entries()) {
    const milkAttribute = FormulaCalc.evaluate("v * (110 + potential) / num / 2", {
      v: value,
      potential: mergedChild.get(key)![1],
      num: milkRate,
    } as Env);
    if (milkAttribute > 0) {
      milkAttributeDifference.set(key, milkAttribute);
    }
    milkRate += 50;
  }
  const milkSkillDifference = new Map<string, number>();
  milkRate = 100;
  for (const [key, value] of bestSkillMap.entries()) {
    if (mergedChild.has(key)) {
      const milkSkill = FormulaCalc.evaluate("v * (130 + potential) / num / 2", {
        v: value,
        potential: mergedChild.get(key)![1],
        num: milkRate,
      } as Env);
      if (milkSkill > 0) {
        milkSkillDifference.set(key, milkSkill);
      }
      milkRate += 50;
    }
    if (
      ((selectAddSkill1 && selectAddSkill1.alias === key) ||
        (selectAddSkill2 && selectAddSkill2.alias === key)) &&
      !mergedChild.has(key)
    ) {
      const addSkillValue = FormulaCalc.evaluate("v * 100 / num / 2", {
        v: value,
        num: milkRate,
      } as Env);
      milkSkillDifference.set(key, addSkillValue);
      milkRate += 50;
    }
  }
  const milkDifference = new Map<string, number>([
    ...milkAttributeDifference,
    ...milkSkillDifference,
  ]);
  return milkDifference;
}
