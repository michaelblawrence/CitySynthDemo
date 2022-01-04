/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable no-console */

/**
 * @class CityRustGenerator
 * @extends AudioWorkletProcessor
 */
class CityRustGenerator extends AudioWorkletProcessor {
  constructor() {
    // @ts-check
    super();
    /** 
     * @type {{port: MessagePort}}
     */
    const {port} = this;
    port.onmessage = handleMessage.bind(this);
    port.onmessageerror = (err) => console.error(err);

    this.buffer = null;
    this.uiWaveformViewLength = 128;
    this.uiWaveformView = {
      buffer: new Float32Array(this.uiWaveformViewLength),
      sampleRate: 48000 / 20,
      counter: 0,
      shouldSend: (nSamples) => (this.uiWaveformView.counter += nSamples) >= this.uiWaveformView.sampleRate,
      post: () => { sendWaveformData(this.uiWaveformView.buffer, port); this.uiWaveformView.counter = 0; },
    };
  }

  process(_, outputs) {
    const output = outputs[0];

    for (let channel = 0; channel < output.length; ++channel) {
      if (globalThis.synth) {
        /**
         * @type CitySynth
         */
        const synth = globalThis.synth;
        synth.read(output[channel]);

        if (this.uiWaveformView.shouldSend(output[channel].length)) {
          output[channel]
            .slice(0, this.uiWaveformViewLength)
            .forEach((sample, idx) => this.uiWaveformView.buffer[idx] = sample);
          this.uiWaveformView.post();
        }
      }
    }

    return true;
  }
}

registerProcessor('city-rust', CityRustGenerator);

async function handleMessage(msg) {
  const { data: { type, data } } = msg;
  if (!type) {
    console.error('got message with wrong format');
  }

  switch (type) {
    case 'MODULE':
      await initModule(data, this.port);
      return;
    case 'FROM_MODULE_TYPE':
      await initModule(data, this.port);
      return;
    case 'FROM_MODULE_BYTE_BUFFER':
      await initModuleFromBytes(data, this.port);
      return;
    case 'USE_MODULE_INSTANCE':
      await useModuleInstance(data, this.port);
      return;
    case 'KEY_DOWN':
      handleKeyDown(data);
      return;
    case 'KEY_UP':
      handleKeyUp(data);
      return;
    case 'SET_PRESET':
      loadPreset(data);
      return;
    case 'SET_PARAM':
      setParam(data);
      return;
    case 'GET_PARAM':
      getParam(data, this.port);
      return;
    case 'DUMP_PARAMS':
      dumpAllParam(data, this.port);
      return;
    case 'REFRESH_EG':
      triggerRefresh();
      return;
  }
  console.error('got message with unknown type');
}

function handleKeyDown(data) {
  /**
     * @type CitySynth
     */
  const synth = globalThis.synth;
  if (synth) {
    synth.note_on(data.keyCode, data.oct);
  }
}

function handleKeyUp(data) {
  /**
     * @type CitySynth
     */
  const synth = globalThis.synth;
  if (synth) {
    synth.note_off(data);
  }
}

function loadPreset(data) {
  /**
     * @type CitySynth
     */
  const synth = globalThis.synth;
  if (synth && typeof data === 'string') {
    console.warn('changing from current preset.. ' + synth.print('preset name: '));
    console.log(`synth.load_preset(line = ${data});`);
    const result = synth.load_preset(data);
    if (result) {
      // console.error(result);
    }
  }
}


function setParam(data) {
  const { param, value } = data;
  const paramIden = Param[param];

  /**
     * @type CitySynth
     */
  const synth = globalThis.synth;
  if (synth && typeof paramIden !== 'undefined' && typeof value === 'number') {
    synth.set_state(paramIden, value);
  }
}

function getParam(data, port) {
  const { param } = data;
  const paramIden = Param[param];

  /**
     * @type CitySynth
     */
  const synth = globalThis.synth;
  if (synth && typeof paramIden !== 'undefined') {
    const value = synth.get_state(paramIden);
    port.postMessage({ type: 'PARAM_CALLBACK', param, paramIden, value });
    return value;
  }
}

/**
 * 
 * @param {Float32Array} samples 
 * @param {MessagePort} port 
 */
function sendWaveformData(samples, port) {
  port.postMessage({ type: 'WAVEFORM_PUSH', samples: [...samples] });
}

function dumpAllParam(data, port) {
  const { dumpAll } = data;
  const paramIdens = Object.keys(Param)
    .map(param => ({ param: param, paramIden: Param[param] }));

  /**
     * @type CitySynth
     */
  const synth = globalThis.synth;
  if (synth && dumpAll === true) {
    const values = paramIdens.map(item => ({ ...item, value: synth.get_state(item.paramIden) }));
    const dump = values.reduce((dict, kvp) => ({ ...dict, [kvp.param]: kvp.value }), {});
    // console.table(values);
    port.postMessage({ type: 'DUMP_PARAMS_CALLBACK', dump });
    return dump;
  }
}

function triggerRefresh() {
  /**
     * @type CitySynth
     */
  const synth = globalThis.synth;
  if (synth) {
    synth.refresh();
    console.log('synth.refresh();');
  }
}

async function initModuleFromBytes(bytes, port) {
  const module = await WebAssembly.compile(bytes);
  await initModule(module, port);
}

async function initModule(module, port) {
  if (globalThis.wasm) {
    console.warn('initModule was called after module was instantiated');
    return;
  }
  const instance = await WebAssembly.instantiate(module, {
    ['./citysynth_wasm']: {
      ['__wbindgen_throw']: (i1, i2) => {
        try {
          __wbindgen_throw(i1, i2);
        }
        catch (ex) {
          console.error('throw wasm error' + ex ? `: ${JSON.stringify(ex)}` : '');
        }
      }
    }
  });
  useModuleInstance(instance, port);
}

async function useModuleInstance(instance, port) {
  if (globalThis.wasm) {
    console.warn('useModuleInstance was called after module was instantiated');
    return;
  }
  globalThis.wasm = instance.exports;
  globalThis.synth = CitySynth.new(2);
  port.postMessage({ type: 'MODULE_READY' });
}
