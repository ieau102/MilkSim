import type { Element } from "./Source";
import { Random } from "./csharp/Random";
import { FormulaCalc } from "./csharp/Calc";
import type { Env } from "./csharp/Calc";

export function GetSourceValue(v: number, lv: number, lvFactor: number, type: string): number {
  const rnd1 = Random.rnd(FormulaCalc.evaluate("lv / 2 + 1", { lv }));
  const calcTemp = FormulaCalc.evaluate("lv / 3", { lv });
  const env: Env = { lvFactor, rnd2: Random.rnd(calcTemp) };
  switch (type) {
    case "Char":
      return Number(
        (BigInt(v) * (100n + ((BigInt(lv) - 1n + BigInt(rnd1)) * BigInt(lvFactor)) / 10n)) / 100n +
          BigInt(FormulaCalc.evaluate("rnd2 * lvFactor / 100", env)),
      );
    case "Fixed":
      return v;
    default:
      return 0;
  }
}

export function GetSourcePotential(v: number): number {
  if (v > 1) {
    return v * 10;
  }
  return 0;
}

export function ApplyElementMap(
  obj: Record<string, number>,
  lv: number,
  ele: Element[],
  type: string,
): Map<string, number[]> {
  Random.SetSeed(2);
  const result = new Map<string, number[]>();
  for (const [key, value] of Object.entries(obj)) {
    if (value != 0) {
      let potential = 0;
      if (ele.find((e) => e.alias === key)?.category === "skill") {
        potential += GetSourcePotential(value);
      }
      if (lv > 10000000) {
        lv = 10000000;
      }
      let vSource = GetSourceValue(
        value,
        lv,
        ele.find((e) => e.alias === key)?.lvFactor ?? 0,
        type,
      );
      if (vSource > 99999999) {
        vSource = 99999999;
      }
      result.set(key, [vSource, potential]);
    }
  }
  Random.SetSeed();
  return result;
}
