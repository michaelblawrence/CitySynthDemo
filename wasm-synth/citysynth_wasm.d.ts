/* tslint:disable */
export enum CellEvent {
  Underpopulation,
  LivesOn,
  Overpopulation,
  Reproduction,
  NoChange,
}
export enum Cell {
  Dead,
  Alive,
}
export enum Param {
  Attack,
  AmpLFOrate,
  AmpLFOwidth,
  Decay,
  DelayWet,
  Gain,
  Harmonic2Gain,
  HarmonicsControl,
  HarmonicFix,
  HarmonicFunction,
  HarmonicPhase,
  HarmonicV1,
  HPFCutoff,
  LPF,
  LPFattack,
  LPFceiling,
  LPFenvelope,
  LPFfloor,
  LPFmodrate,
  LPFrelease,
  LPFwidth,
  Pitchmod,
  PitchmodWidth,
  Release,
  ReverbWet,
  SubOscGain,
  Sustain,
  WFunction,
}
export class Universe {
  free(): void;
  static new(): Universe;
  width(): number;
  height(): number;
  set_size(arg0: number, arg1: number): void;
  cells(): number;
  reset(): void;
  clear(): void;
  toggle(arg0: number, arg1: number): void;
  tick(): void;
}
export class CitySynth {
  free(): void;
  static new(arg0: number, arg1: number | undefined): CitySynth;
  read(arg0: Float32Array): void;
  set_buffer_len(arg0: number): void;
  note_on(arg0: number, arg1: number | undefined): void;
  note_off(arg0: number): void;
  set_freq(arg0: number): number;
  get_state(arg0: number): number;
  set_state(arg0: number, arg1: number): number;
  refresh(): void;
  print(arg0: string): string;
  load_preset(arg0: string): string;
}
