import { Player, LineupSlot } from '../types/baseball';

export const GUERREROS_ROSTER: Player[] = [
  { id: 1, num: 1, name: "Johan Olivo", defaultPos: "CF", bats: "L", throws: "R", obp: 0.380, slg: 0.450, avg: 0.315, iso: 0.135, woba: 0.370, ops: 0.830, photo: "/assets/players/gve55/johan_olivo.png", pa: 120, ab: 105, h: 33, doubles: 6, triples: 2, hr: 2, bb: 13, so: 14, r: 24, rbi: 18 },
  { id: 2, num: 2, name: "Pablo Morales", defaultPos: "1B", bats: "R", throws: "R", obp: 0.340, slg: 0.510, avg: 0.290, iso: 0.220, woba: 0.375, ops: 0.850, photo: "/assets/players/gve55/pablo_morales.png", pa: 135, ab: 120, h: 35, doubles: 9, triples: 1, hr: 5, bb: 12, so: 22, r: 21, rbi: 31 },
  { id: 3, num: 3, name: "Raul Lozada", defaultPos: "SS", bats: "R", throws: "R", obp: 0.360, slg: 0.410, avg: 0.300, iso: 0.110, woba: 0.345, ops: 0.770, photo: "/assets/players/gve55/raul_lozada.png", pa: 115, ab: 100, h: 30, doubles: 5, triples: 0, hr: 2, bb: 12, so: 11, r: 19, rbi: 16 },
  { id: 4, num: 4, name: "Jorge Mitchell", defaultPos: "2B", bats: "R", throws: "R", obp: 0.320, slg: 0.390, avg: 0.270, iso: 0.120, woba: 0.315, ops: 0.710, photo: "/assets/players/gve55/jorge_mitchell.png", pa: 110, ab: 100, h: 27, doubles: 6, triples: 1, hr: 1, bb: 8, so: 18, r: 15, rbi: 14 },
  { id: 5, num: 5, name: "Oswaldo Grillo", defaultPos: "3B", bats: "R", throws: "R", obp: 0.330, slg: 0.420, avg: 0.280, iso: 0.140, woba: 0.330, ops: 0.750, photo: "/assets/players/gve55/oswaldo_grillo.png", pa: 125, ab: 110, h: 31, doubles: 7, triples: 1, hr: 2, bb: 11, so: 19, r: 17, rbi: 20 },
  { id: 6, num: 6, name: "Nestor Vera", defaultPos: "LF", bats: "L", throws: "R", obp: 0.390, slg: 0.520, avg: 0.325, iso: 0.195, woba: 0.405, ops: 0.910, photo: "/assets/players/gve55/nestor_vera.png", pa: 140, ab: 120, h: 39, doubles: 10, triples: 2, hr: 3, bb: 16, so: 15, r: 28, rbi: 26 },
  { id: 7, num: 7, name: "Pedro Moreno", defaultPos: "RF", bats: "L", throws: "R", obp: 0.370, slg: 0.480, avg: 0.305, iso: 0.175, woba: 0.380, ops: 0.850, photo: "/assets/players/gve55/pedro_moreno.png", pa: 130, ab: 115, h: 35, doubles: 8, triples: 2, hr: 3, bb: 13, so: 17, r: 23, rbi: 22 },
  { id: 8, num: 8, name: "Juan Perez", defaultPos: "C", bats: "R", throws: "R", obp: 0.310, slg: 0.360, avg: 0.250, iso: 0.110, woba: 0.300, ops: 0.670, photo: "/assets/players/gve55/juan_perez.png", pa: 100, ab: 90, h: 22, doubles: 4, triples: 0, hr: 2, bb: 8, so: 21, r: 10, rbi: 13 },
  { id: 9, num: 9, name: "Martin Rojas", defaultPos: "DH", bats: "R", throws: "R", obp: 0.350, slg: 0.460, avg: 0.295, iso: 0.165, woba: 0.360, ops: 0.810, photo: "/assets/players/gve55/martin_rojas.png", pa: 125, ab: 110, h: 32, doubles: 8, triples: 1, hr: 3, bb: 12, so: 16, r: 18, rbi: 24 },
  { id: 10, num: 10, name: "Pedro Chavez", defaultPos: "P", bats: "R", throws: "R", era: 3.20, fip: 3.15, obp: 0.200, slg: 0.220, avg: 0.180, photo: "/assets/players/gve55/pedro_chavez.png" },
  { id: 11, num: 11, name: "Luis Silva", defaultPos: "OF", bats: "R", throws: "R", obp: 0.345, slg: 0.420, avg: 0.285, iso: 0.135, woba: 0.340, ops: 0.765, photo: "/assets/players/gve55/luis_silva.png", pa: 85, ab: 75, h: 21, doubles: 4, triples: 1, hr: 1, bb: 8, so: 12, r: 12, rbi: 11 },
  { id: 12, num: 12, name: "Luis Barrios", defaultPos: "IF", bats: "R", throws: "R", obp: 0.330, slg: 0.410, avg: 0.275, iso: 0.135, woba: 0.330, ops: 0.740, photo: "/assets/players/gve55/luis_barrios.png", pa: 70, ab: 62, h: 17, doubles: 3, triples: 0, hr: 1, bb: 6, so: 9, r: 8, rbi: 9 },
  { id: 13, num: 13, name: "Paul Segarra", defaultPos: "OF", bats: "L", throws: "R", obp: 0.350, slg: 0.430, avg: 0.290, iso: 0.140, woba: 0.345, ops: 0.780, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", pa: 65, ab: 58, h: 17, doubles: 4, triples: 1, hr: 1, bb: 5, so: 10, r: 9, rbi: 8 },
  { id: 14, num: 14, name: "Julio Machado", defaultPos: "P", bats: "R", throws: "R", era: 3.10, fip: 3.25, obp: 0.190, slg: 0.210, avg: 0.160, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { id: 15, num: 15, name: "Arquimedes Avancines", defaultPos: "IF", bats: "R", throws: "R", obp: 0.360, slg: 0.440, avg: 0.300, iso: 0.140, woba: 0.355, ops: 0.800, photo: "/assets/players/gve55/arquimedes_avancines.png", pa: 90, ab: 80, h: 24, doubles: 5, triples: 0, hr: 2, bb: 9, so: 11, r: 14, rbi: 15 },
  { id: 16, num: 16, name: "Luis Rodriguez", defaultPos: "IF", bats: "R", throws: "R", obp: 0.330, slg: 0.410, avg: 0.270, iso: 0.140, woba: 0.325, ops: 0.740, photo: "/assets/players/gve55/luis_rodriguez.png", pa: 60, ab: 52, h: 14, doubles: 3, triples: 1, hr: 1, bb: 6, so: 8, r: 7, rbi: 6 }
];

export const INITIAL_LINEUP: LineupSlot[] = [
  { order: 1, player: GUERREROS_ROSTER[0], pos: 'CF' },
  { order: 2, player: GUERREROS_ROSTER[5], pos: 'LF' },
  { order: 3, player: GUERREROS_ROSTER[6], pos: 'RF' },
  { order: 4, player: GUERREROS_ROSTER[1], pos: '1B' },
  { order: 5, player: GUERREROS_ROSTER[8], pos: 'DH' },
  { order: 6, player: GUERREROS_ROSTER[2], pos: 'SS' },
  { order: 7, player: GUERREROS_ROSTER[4], pos: '3B' },
  { order: 8, player: GUERREROS_ROSTER[3], pos: '2B' },
  { order: 9, player: GUERREROS_ROSTER[7], pos: 'C' }
];

export const INITIAL_BENCH: Player[] = GUERREROS_ROSTER.slice(9);
export const ROSTER_GUERREROS_55 = GUERREROS_ROSTER;
