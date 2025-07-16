import Papa from "papaparse";

export type Element = {
  id: number;
  alias: string;
  name_JP: string;
  name: string;
  altname_JP: string;
  altname: string;
  aliasParent: string;
  aliasRef: string;
  aliasMtp: string;
  parentFactor: number;
  lvFactor: number;
  encFactor: number;
  encSlot: string;
  mtp: number;
  LV: number;
  chance: number;
  value: number;
  cost: string;
  geneSlot: number;
  sort: number;
  target: string;
  proc: string;
  type: string;
  group: string;
  category: string;
  categorySub: string;
  abilityType: string;
  tag: string;
  thing: string;
  eleP: number;
  cooldown: number;
  charge: number;
  radius: number;
  max: number;
  req: string;
  idTrainer: string;
  partySkill: number;
  tagTrainer: string;
  levelBonus_JP: string;
  levelBonus: string;
  foodEffect: string;
  "***": string;
  langAct: string;
  detail_JP: string;
  detail: string;
  textPhase_JP: string;
  textPhase: string;
  textExtra_JP: string;
  charMap?: Record<string, string>;
  textInc_JP: string;
  textInc: string;
  textDec_JP: string;
  textDec: string;
  textAlt_JP: string;
  textAlt: string;
  adjective_JP: string;
  adjective: string;
};

export type Char = {
  id: string;
  _id: number;
  name_JP: string;
  name: string;
  aka_JP: string;
  aka: string;
  idActor: string;
  sort: number;
  size: string;
  _idRenderData: string;
  tiles: string;
  tiles_snow: string;
  colorMod: number;
  components: string;
  defMat: string;
  LV: number;
  chance: number;
  quality: number;
  hostility: string;
  biome: string;
  tag: string;
  trait: string;
  race: string;
  job: string;
  tactics: string;
  aiIdle: string;
  aiParam: string;
  actCombat: string;
  mainElement: string;
  elements: string;
  equip: string;
  loot: string;
  category: string;
  filter: string;
  gachaFilter: string;
  tone: string;
  actIdle: string;
  lightData: string;
  idExtra: string;
  bio: string;
  faith: string;
  works: string;
  hobbies: string;
  idText: string;
  moveAnime: string;
  factory: string;
  detail_JP: string;
  detail: string;
  elementMap?: Record<string, number>;
  charNameMap?: Record<string, string>;
};

export type Race = {
  id: string;
  name_JP: string;
  name: string;
  playable: number;
  tag: string;
  life: number;
  mana: number;
  vigor: number;
  DV: number;
  PV: number;
  PDR: number;
  EDR: number;
  EP: number;
  STR: number;
  END: number;
  DEX: number;
  PER: number;
  LER: number;
  WIL: number;
  MAG: number;
  CHA: number;
  SPD: number;
  INT: number;
  martial: number;
  pen: number;
  elements: string;
  skill: string;
  figure: string;
  geneCap: number;
  material: string;
  corpse: string;
  loot: string;
  blood: number;
  meleeStyle: string;
  castStyle: string;
  EQ: string;
  sex: number;
  age: string;
  height: number;
  breeder: number;
  food: string;
  fur: string;
  detail_JP: string;
  detail: string;
  elementMap?: Record<string, number>;
  raceNameMap?: Record<string, string>;
};

export type Job = {
  id: string;
  name_JP: string;
  name: string;
  playable: number;
  STR: number;
  END: number;
  DEX: number;
  PER: number;
  LER: number;
  WIL: number;
  MAG: number;
  CHA: number;
  SPD: number;
  elements: string;
  weapon: string;
  equip: string;
  domain: string;
  detail_JP: string;
  detail: string;
  elementMap?: Record<string, number>;
  jobNameMap?: Record<string, string>;
};

function autoConvertRow(row: Record<string, unknown>) {
  const converted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    // 数値として変換できる場合は数値型に
    if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
      converted[key] = Number(value);
    } else {
      converted[key] = value;
    }
  }
  return converted;
}

function getElementMap(
  elements: string,
  baseMap: Record<string, number> = {}
): Record<string, number> {
  if (elements) {
    elements.split(",").forEach((pair) => {
      const [key, value] = pair.split("/").map((v) => v.trim());
      if (key && value && !isNaN(Number(value))) {
        baseMap[key] = Number(value);
      }
    });
  }
  return baseMap;
}

function getNameMap(
  id: string,
  name: string,
  aka: string,
  baseMap: Record<string, string>
): Record<string, string> {
  let fullname = "";
  if (aka !== "" && aka !== "*r") {
    fullname += aka;
  }
  if (name !== "*r") {
    fullname += name;
  }
  fullname = fullname
    .replace("#ele5", "")
    .replace("#ele4", "")
    .replace("#ele3", "")
    .replace("#ele2", "")
    .replace("#ele", "");
  switch (id) {
    case "child":
      fullname += "(ノーランド)";
      break;
    case "child_elea":
      fullname += "(エレア)";
      break;
    case "child_fairy":
      fullname += "(妖精)";
      break;
    case "citizen_exile":
      fullname += "(市民)";
      break;
    case "citizen":
      fullname += "(ノーランド)";
      break;
    case "citizen_fairy":
      fullname += "(妖精)";
      break;
    case "citizen_elea":
      fullname += "(エレア)";
      break;
    case "citizen_mifu":
      fullname += "(ミフ)";
      break;
    case "citizen_nefu":
      fullname += "(ネフ)";
      break;
    case "citizen_steam":
      fullname += "(イエルス)";
      break;
    case "fox_mifu":
      fullname += "(ミフ)";
      break;
    case "fox_nefu":
      fullname += "(ネフ)";
      break;
    case "senior":
      fullname += "(ノーランド)";
      break;
    case "senior_fox":
      fullname += "(ミフ)";
      break;
    case "secretary":
      fullname += "(ノーランド)";
      break;
    case "secretary_fox":
      fullname += "(ネフ)";
      break;
    case "merchant_mifu":
      fullname += "(ミフ)";
      break;
    case "merchant_nefu":
      fullname += "(ネフ)";
      break;
    case "merchant_inn":
      fullname += "(ノーランド)";
      break;
    case "merchant_inn_fox":
      fullname += "(ミフ)";
      break;
    case "guard":
      fullname += "(ノーランド)";
      break;
    case "guard_fox":
      fullname += "(ネフ)";
      break;
    case "putty_snow_gold":
      fullname += "(金)";
      break;
    case "dragon":
      fullname += "(炎/氷/雷/闇)";
      break;
    case "dragon2":
      fullname += "(死/混沌)";
      break;
    default:
      break;
  }
  if (fullname !== "") {
    baseMap[id] = fullname;
  }
  return baseMap;
}

function getRaceNameMap(
  id: string,
  name_JP: string,
  playable: number,
  baseMap: Record<string, string>
): Record<string, string> {
  if (playable <= 1) {
    baseMap[id] = name_JP;
  }
  return baseMap;
}

function getJobNameMap(
  id: string,
  name_JP: string,
  playable: number,
  baseMap: Record<string, string>
): Record<string, string> {
  if (playable <= 4) {
    baseMap[id] = name_JP;
  }
  return baseMap;
}

export async function loadElements(): Promise<Element[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}resources/elements.csv`);
  const csvText = await response.text();
  const tmp = Papa.parse<Element>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  const elementsList = tmp.data.map(autoConvertRow) as Element[];
  return elementsList;
}

export async function loadChars(): Promise<Char[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}resources/charas.csv`);
  const csvText = await response.text();
  const tmp = Papa.parse<Char>(csvText, {
    header: true,
    skipEmptyLines: true,
    newline: "\n",
    quoteChar: '"',
  });
  const result = tmp.data.map(autoConvertRow) as Char[];
  const filterWord = [
    "chara",
    "test_chicken",
    "player",
    "broom_chara",
    "adv",
    "adv_fairy",
    "at",
    "ungaga_pap",
    "yochlol",
    "mimic",
    "beholder",
    "guard_port",
  ];
  const filtered = result.filter(
    (row) =>
      (row.quality !== 4 || row.id === "big_daddy") &&
      (row.chance !== 0 || !filterWord.includes(row.id))
  );
  const charWithMap = filtered.map((row) => {
    const baseMap: Record<string, number> = {};
    const elementMap = getElementMap(row.elements, baseMap);
    const charNameMap = getNameMap(row.id, row.name_JP, row.aka_JP, {});
    return { ...row, elementMap, charNameMap };
  });
  return charWithMap;
}

export async function loadRaceElements(): Promise<Race[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}resources/races.csv`);
  const csvText = await response.text();
  const tmp = Papa.parse<Race>(csvText, {
    header: true,
    skipEmptyLines: true,
    newline: "\n",
    quoteChar: '"',
  });
  const result = tmp.data.map(autoConvertRow) as Race[];
  const raceWithMap = result.map((row) => {
    const baseMap: Record<string, number> = {};
    baseMap["STR"] = Number(row.STR);
    baseMap["END"] = Number(row.END);
    baseMap["DEX"] = Number(row.DEX);
    baseMap["PER"] = Number(row.PER);
    baseMap["LER"] = Number(row.LER);
    baseMap["WIL"] = Number(row.WIL);
    baseMap["MAG"] = Number(row.MAG);
    baseMap["CHA"] = Number(row.CHA);
    baseMap["SPD"] = Number(row.SPD);
    baseMap["INT"] = Number(row.INT);
    baseMap["martial"] = Number(row.martial);
    baseMap["life"] = Number(row.life);
    baseMap["mana"] = Number(row.mana);
    baseMap["vigor"] = Number(row.vigor);
    baseMap["PV"] = Number(row.PV);
    baseMap["DV"] = Number(row.DV);
    baseMap["PDR"] = Number(row.PDR);
    baseMap["EDR"] = Number(row.EDR);
    baseMap["EP"] = Number(row.EP);
    baseMap["handicraft"] = 1;
    baseMap["lumberjack"] = 1;
    baseMap["carpentry"] = 1;
    baseMap["mining"] = 1;
    baseMap["gathering"] = 1;
    baseMap["weaponSword"] = 1;
    baseMap["weaponAxe"] = 1;
    baseMap["weaponStaff"] = 1;
    baseMap["weaponDagger"] = 1;
    baseMap["weaponPolearm"] = 1;
    baseMap["weaponScythe"] = 1;
    baseMap["weaponBlunt"] = 1;
    baseMap["weaponBow"] = 1;
    baseMap["weaponCrossbow"] = 1;
    baseMap["throwing"] = 1;
    baseMap["shield"] = 1;
    baseMap["armorHeavy"] = 1;
    baseMap["armorLight"] = 1;
    baseMap["evasion"] = 1;
    baseMap["meditation"] = 1;
    baseMap["faith"] = 1;
    const elementMap = getElementMap(row.elements, baseMap);
    const raceNameMap = getRaceNameMap(row.id, row.name_JP, row.playable, {});
    return { ...row, elementMap, raceNameMap };
  });
  return raceWithMap;
}

export async function loadJobElements(): Promise<Job[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}resources/jobs.csv`);
  const csvText = await response.text();
  const tmp = Papa.parse<Job>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  const result = tmp.data.map(autoConvertRow) as Job[];
  const jobsWithMap = result.map((row) => {
    const elementMap = getElementMap(row.elements);
    elementMap["STR"] = Number(row.STR);
    elementMap["END"] = Number(row.END);
    elementMap["DEX"] = Number(row.DEX);
    elementMap["PER"] = Number(row.PER);
    elementMap["LER"] = Number(row.LER);
    elementMap["WIL"] = Number(row.WIL);
    elementMap["MAG"] = Number(row.MAG);
    elementMap["CHA"] = Number(row.CHA);
    elementMap["SPD"] = Number(row.SPD);
    const jobNameMap = getJobNameMap(row.id, row.name_JP, row.playable, {});
    return { ...row, elementMap, jobNameMap };
  });
  return jobsWithMap;
}
