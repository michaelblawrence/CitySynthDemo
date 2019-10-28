// @ts-check

export function reverseDict(dict) {
  return Object.keys(dict)
    .reduce((rev, key) => ({ ...rev, [dict[key]]: key }), {});
}

export const MetaParam = Object.freeze({
  refresh: 0,
  altEnabled: 1,
  kbOctave: 2,
});
export const InvertedMetaParam = reverseDict(MetaParam);

export const Param = Object.freeze({
  Attack: 0,
  AmpLFOrate: 1,
  AmpLFOwidth: 2,
  Decay: 3,
  DelayWet: 4,
  Gain: 5,
  Harmonic2Gain: 6,
  HarmonicsControl: 7,
  HarmonicFix: 8,
  HarmonicFunction: 9,
  HarmonicPhase: 10,
  HarmonicV1: 11,
  HPFCutoff: 12,
  LPF: 13,
  LPFattack: 14,
  LPFceiling: 15,
  LPFenvelope: 16,
  LPFfloor: 17,
  LPFmodrate: 18,
  LPFrelease: 19,
  LPFwidth: 20,
  Pitchmod: 21,
  PitchmodWidth: 22,
  Release: 23,
  ReverbWet: 24,
  SubOscGain: 25,
  Sustain: 26,
  WFunction: 27
});
export const InvertedParam = reverseDict(Param);