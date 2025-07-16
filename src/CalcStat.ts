import type { Element } from "./Source";
import { Random } from "./csharp/Random";
import { FormulaCalc } from "./csharp/Calc";
import type { Env } from "./csharp/Calc";

export function GetSourceValue(v: number, lv: number, lvFactor: number, type: string): number {
  const calcTemp1 = FormulaCalc.evaluate("lv / 2 + 1", { lv }),
    calcTemp2 = FormulaCalc.evaluate("lv / 3", { lv });
  const env: Env = { v, lv, lvFactor, rnd1: Random.rnd(calcTemp1), rnd2: Random.rnd(calcTemp2) };
  switch (type) {
    case "Char":
      return FormulaCalc.evaluate(
        "v * (100 + (lv - 1 + rnd1) * lvFactor / 10) / 100 + rnd2 * lvFactor / 100",
        env
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
  type: string
): Map<string, number[]> {
  Random.SetSeed(2);
  const result = new Map<string, number[]>();
  for (const [key, value] of Object.entries(obj)) {
    if (value != 0) {
      let potential = 0;
      if (ele.find((e) => e.alias === key)?.category === "skill") {
        potential += GetSourcePotential(value);
      }
      const vSource = GetSourceValue(
        value,
        lv,
        ele.find((e) => e.alias === key)?.lvFactor ?? 0,
        type
      );
      result.set(key, [vSource, potential]);
    }
  }
  Random.SetSeed();
  return result;
}
