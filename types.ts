
export interface NameEntry {
  id: string;
  name: string;
  timestamp: number;
  addedAt: string;
}

export enum SortMode {
  AlphabeticalAsc = 'alphabetical-asc',
  AlphabeticalDesc = 'alphabetical-desc',
  Chronological = 'chronological',
}

export interface Settings {
  dedupe: boolean;
  sortMode: SortMode;
}
