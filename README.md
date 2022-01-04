# CitySynth Online
## A WebAssembly + WebAudio polyphonic audio synthesizer written in Rust + React!
## Try It Out! https://michaelblawrence.github.io/CitySynthDemo/

# Goal
CitySynth is a full featured polyphonic synthesizer with unlimited harmonic DCOs, qwerty keyboard support, and a time-modulating reverb-delay mix.

# Building
## From source
Core audio engine code found here: https://gitlab.com/mblawrence27/city-rust

## Requires
  - [yarn](https://classic.yarnpkg.com/lang/en/docs/install)
  - [rust](https://www.rust-lang.org/tools/install)
  - [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Building from source
 - Fetch npm dependencies: `yarn install`
 - Build WebAssembly .wasm file and .js bindings: `yarn build-wasm`
 - Build React frontend `yarn build`
 - Run locally with `yarn start`
