use cityrust::synth::poly::{self, CitySynth as PolySynth};
use cityrust::synth::sender::{KeyData, KeyEventHandler};
use cityrust::utils::loader;
use cityrust::utils::parameters::R;
use cityrust::utils::state::StateManager;

use wasm_bindgen::prelude::*;

const DEFAULT_SAMPLE_RATE: f64 = 44100.0;

#[wasm_bindgen]
pub struct CitySynth {
    poly: PolySynth,
    bucket: StateManager<R, f64>,
    events: KeyEventHandler<KeyData>,
}

#[wasm_bindgen]
impl CitySynth {
    pub fn new(voices_count: usize, sample_rate: Option<f64>) -> Self {
        crate::set_panic_hook();
        let mut bucket = StateManager::new();
        loader::load_defaults(&mut bucket);

        let sample_rate = sample_rate.unwrap_or(DEFAULT_SAMPLE_RATE);
        let (synth, events_handler) = PolySynth::new(sample_rate, voices_count, bucket.clone());

        Self {
            poly: synth,
            events: events_handler,
            bucket,         
        }
    } 

    pub fn read(&mut self, buffer: &mut [f32]) {
        self.poly.read(buffer);
    }

    pub fn set_buffer_len(&mut self, samples: usize) {
        self.poly.set_buffer_len(samples);
    }

    pub fn note_on(&mut self, key_code: usize, oct: Option<i32>) {
        PolySynth::note_on(&mut self.events, key_code as u8, oct.unwrap_or(0));
    }

    pub fn note_off(&mut self, key_code: usize) {
        PolySynth::note_off(&mut self.events, key_code as u8);
    }

    pub fn set_freq(&mut self, freq: f64) -> f64 {
        let old_value = self.poly.state().get(R::Frequency);
        self.bucket.set(R::Frequency, freq);
        old_value
    }

    pub fn get_state(&self, key: Param) -> f64 {
        if let Some(key) = key.to_inner_param() {
            self.poly.state().get(key)
        } else {
            0.0
        }
    }

    pub fn set_state(&mut self, key: Param, value: f64) -> f64 {
        if let Some(key) = key.to_inner_param() {
            let old_value = self.poly.state().get(key);
            self.poly.state_mut().set(key, value);
            old_value
        } else {
            0.0
        }
    }

    pub fn refresh(&mut self) {
        self.poly.refresh();
    }

    pub fn print(&self, name: String) -> String {
        let preset = self.poly.save_preset(name);
        preset.unwrap().to_string()
    }

    pub fn load_preset(&mut self, preset: String) -> Option<String> {
        self.poly.load_preset(preset).err()
    }
}

#[wasm_bindgen]
pub enum Param {
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

impl Param {
    fn to_inner_param(&self) -> Option<R> {
        match self {
            Param::Attack             => Some(R::Attack),
            Param::AmpLFOrate         => Some(R::AmpLFOrate),
            Param::AmpLFOwidth        => Some(R::AmpLFOwidth),
            Param::Decay              => Some(R::Decay),
            Param::DelayWet           => Some(R::DelayWet),
            Param::Gain               => Some(R::Gain),
            Param::Harmonic2Gain      => Some(R::Harmonic2Gain),
            Param::HarmonicsControl   => Some(R::HarmonicsControl),
            Param::HarmonicFix        => Some(R::HarmonicFix),
            Param::HarmonicFunction   => Some(R::HarmonicFunction),
            Param::HarmonicPhase      => Some(R::HarmonicPhase),
            Param::HarmonicV1         => Some(R::HarmonicV1),
            Param::HPFCutoff          => Some(R::HPFCutoff),
            Param::LPF                => Some(R::LPF),
            Param::LPFattack          => Some(R::LPFattack),
            Param::LPFceiling         => Some(R::LPFceiling),
            Param::LPFenvelope        => Some(R::LPFenvelope),
            Param::LPFfloor           => Some(R::LPFfloor),
            Param::LPFmodrate         => Some(R::LPFmodrate),
            Param::LPFrelease         => Some(R::LPFrelease),
            Param::LPFwidth           => Some(R::LPFwidth),
            Param::Pitchmod           => Some(R::Pitchmod),
            Param::PitchmodWidth      => Some(R::PitchmodWidth),
            Param::Release            => Some(R::Release),
            Param::ReverbWet          => Some(R::ReverbWet),
            Param::SubOscGain         => Some(R::SubOscGain),
            Param::Sustain            => Some(R::Sustain),
            Param::WFunction          => Some(R::WFunction),
        }
    }
}