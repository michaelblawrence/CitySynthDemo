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
  GeneralAtten: 6,
  Harmonic2Gain: 7,
  HarmonicsControl: 8,
  HarmonicFix: 9,
  HarmonicFunction: 10,
  HarmonicPhase: 11,
  HarmonicV1: 12,
  HPFCutoff: 13,
  LPF: 14,
  LPFattack: 15,
  LPFceiling: 16,
  LPFenvelope: 17,
  LPFfloor: 18,
  LPFmodrate: 19,
  LPFrelease: 20,
  LPFwidth: 21,
  Pitchmod: 22,
  PitchmodWidth: 23,
  Release: 24,
  ReverbWet: 25,
  SubOscGain: 26,
  Sustain: 27,
  WFunction: 28
});

export const InvertedParam = reverseDict(Param);