export interface Stats {
  count: number;
  msPlayed: number;
  artistName: string;
  other: { [trackName: string]: number };
}

export interface Play {
  [key: string]: string | number;
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
}
