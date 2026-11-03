export interface CharacterPalette {
  id: string;
  name: string;
  body: string;
  bodyDark: string;
  wing: string;
  wingDark: string;
  beak: string;
  beakDark: string;
}

export const CHARACTERS: CharacterPalette[] = [
  {
    id: "classic",
    name: "Classic",
    body: "#f7d51d",
    bodyDark: "#c9a200",
    wing: "#ffffff",
    wingDark: "#dddddd",
    beak: "#f29030",
    beakDark: "#d4731a",
  },
  {
    id: "robin",
    name: "Robin",
    body: "#e0693a",
    bodyDark: "#b04a22",
    wing: "#f5e0c0",
    wingDark: "#d4b88a",
    beak: "#ffcc44",
    beakDark: "#cc9922",
  },
  {
    id: "bluebird",
    name: "Bluebird",
    body: "#4a90d9",
    bodyDark: "#2a6bb0",
    wing: "#ffffff",
    wingDark: "#c0d8e8",
    beak: "#f29030",
    beakDark: "#d4731a",
  },
  {
    id: "sparrow",
    name: "Sparrow",
    body: "#a8895c",
    bodyDark: "#7a6240",
    wing: "#d9c39a",
    wingDark: "#a8895c",
    beak: "#e0a040",
    beakDark: "#b07a20",
  },
  {
    id: "cardinal",
    name: "Cardinal",
    body: "#d92020",
    bodyDark: "#a01010",
    wing: "#2a2a2a",
    wingDark: "#1a1a1a",
    beak: "#ffcc44",
    beakDark: "#cc9922",
  },
  {
    id: "parrot",
    name: "Parrot",
    body: "#2ecb5e",
    bodyDark: "#1a8a40",
    wing: "#4a9cff",
    wingDark: "#2a6bb0",
    beak: "#ffcc44",
    beakDark: "#cc9922",
  },
];

const STORAGE_KEY = "flappy-character";

export function getSelectedCharacter(): CharacterPalette {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const found = CHARACTERS.find((c) => c.id === saved);
    if (found) return found;
  }
  return CHARACTERS[0];
}

export function setSelectedCharacter(id: string) {
  localStorage.setItem(STORAGE_KEY, id);
}
