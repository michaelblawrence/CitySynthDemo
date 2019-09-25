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
      await initModule(data);
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
    synth.note_on(data, -1);
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
    synth.load_preset(data);
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
    // console.log(`synth.set_state(paramIden = ${paramIden}, value = ${value});`);
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

async function initModule(module) {
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
  globalThis.wasm = instance.exports;
  globalThis.synth = CitySynth.new(2);
}



// ---------------------- polyfills -----------------------------------

if (typeof TextEncoder === 'undefined') {
  globalThis.TextEncoder = function TextEncoder() { };
  TextEncoder.prototype.encode = function encode(str) {
    'use strict';
    var Len = str.length, resPos = -1;
    // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
    //  takes up the equivelent space of 3 UTF-8 characters to encode it properly. However, Array's
    //  have an auto expanding length and 1.5x should be just the right balance for most uses.
    var resArr = typeof Uint8Array === 'undefined' ? new Array(Len * 1.5) : new Uint8Array(Len * 3);
    for (var point = 0, nextcode = 0, i = 0; i !== Len;) {
      point = str.charCodeAt(i), i += 1;
      if (point >= 0xD800 && point <= 0xDBFF) {
        if (i === Len) {
          resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
          resArr[resPos += 1] = 0xbd/*0b10111101*/; break;
        }
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        nextcode = str.charCodeAt(i);
        if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
          point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
          i += 1;
          if (point > 0xffff) {
            resArr[resPos += 1] = (0x1e/*0b11110*/ << 3) | (point >>> 18);
            resArr[resPos += 1] = (0x2/*0b10*/ << 6) | ((point >>> 12) & 0x3f/*0b00111111*/);
            resArr[resPos += 1] = (0x2/*0b10*/ << 6) | ((point >>> 6) & 0x3f/*0b00111111*/);
            resArr[resPos += 1] = (0x2/*0b10*/ << 6) | (point & 0x3f/*0b00111111*/);
            continue;
          }
        } else {
          resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
          resArr[resPos += 1] = 0xbd/*0b10111101*/; continue;
        }
      }
      if (point <= 0x007f) {
        resArr[resPos += 1] = (0x0/*0b0*/ << 7) | point;
      } else if (point <= 0x07ff) {
        resArr[resPos += 1] = (0x6/*0b110*/ << 5) | (point >>> 6);
        resArr[resPos += 1] = (0x2/*0b10*/ << 6) | (point & 0x3f/*0b00111111*/);
      } else {
        resArr[resPos += 1] = (0xe/*0b1110*/ << 4) | (point >>> 12);
        resArr[resPos += 1] = (0x2/*0b10*/ << 6) | ((point >>> 6) & 0x3f/*0b00111111*/);
        resArr[resPos += 1] = (0x2/*0b10*/ << 6) | (point & 0x3f/*0b00111111*/);
      }
    }
    if (typeof Uint8Array !== 'undefined') return resArr.subarray(0, resPos + 1);
    // else // IE 6-9
    resArr.length = resPos + 1; // trim off extra weight
    return resArr;
  };
  TextEncoder.prototype.toString = function () { return '[object TextEncoder]'; };
  try { // Object.defineProperty only works on DOM prototypes in IE8
    Object.defineProperty(TextEncoder.prototype, 'encoding', {
      get: function () {
        if (TextEncoder.prototype.isPrototypeOf(this)) return 'utf-8';
        else throw TypeError('Illegal invocation');
      }
    });
  } catch (e) { /*IE6-8 fallback*/ TextEncoder.prototype.encoding = 'utf-8'; }
  if (typeof Symbol !== 'undefined') TextEncoder.prototype[Symbol.toStringTag] = 'TextEncoder';
}

/**
 * @constructor
 * @param {string=} utfLabel
 * @param {{fatal: boolean}=} options
 */
function TextDecoder(utfLabel = 'utf-8', options = { fatal: false }) {
  if (utfLabel !== 'utf-8') {
    throw new RangeError(
      `Failed to construct 'TextDecoder': The encoding label provided ('${utfLabel}') is invalid.`);
  }
  if (options.fatal) {
    throw new Error('Failed to construct \'TextDecoder\': the \'fatal\' option is unsupported.');
  }
}

Object.defineProperty(TextDecoder.prototype, 'encoding', { value: 'utf-8' });

Object.defineProperty(TextDecoder.prototype, 'fatal', { value: false });

Object.defineProperty(TextDecoder.prototype, 'ignoreBOM', { value: false });

/**
 * @param {(!ArrayBuffer|!ArrayBufferView)} buffer
 * @param {{stream: boolean}=} options
 */
TextDecoder.prototype.decode = function (buffer, options = { stream: false }) {
  if (options['stream']) {
    throw new Error('Failed to decode: the \'stream\' option is unsupported.');
  }

  const bytes = new Uint8Array(buffer);
  let pos = 0;
  const len = bytes.length;
  const out = [];

  while (pos < len) {
    const byte1 = bytes[pos++];
    if (byte1 === 0) {
      break;  // NULL
    }

    if ((byte1 & 0x80) === 0) {  // 1-byte
      out.push(byte1);
    } else if ((byte1 & 0xe0) === 0xc0) {  // 2-byte
      const byte2 = bytes[pos++] & 0x3f;
      out.push(((byte1 & 0x1f) << 6) | byte2);
    } else if ((byte1 & 0xf0) === 0xe0) {
      const byte2 = bytes[pos++] & 0x3f;
      const byte3 = bytes[pos++] & 0x3f;
      out.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
    } else if ((byte1 & 0xf8) === 0xf0) {
      const byte2 = bytes[pos++] & 0x3f;
      const byte3 = bytes[pos++] & 0x3f;
      const byte4 = bytes[pos++] & 0x3f;

      // this can be > 0xffff, so possibly generate surrogates
      let codepoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
      if (codepoint > 0xffff) {
        // codepoint &= ~0x10000;
        codepoint -= 0x10000;
        out.push((codepoint >>> 10) & 0x3ff | 0xd800);
        codepoint = 0xdc00 | codepoint & 0x3ff;
      }
      out.push(codepoint);
    } else {
      // FIXME: we're ignoring this
    }
  }

  return String.fromCharCode.apply(null, out);
};



// ---------------------------------------- wasm-bg -------------------------------------

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachegetFloat32Memory = null;
function getFloat32Memory() {
  if (cachegetFloat32Memory === null || cachegetFloat32Memory.buffer !== wasm.memory.buffer) {
    cachegetFloat32Memory = new Float32Array(wasm.memory.buffer);
  }
  return cachegetFloat32Memory;
}

let WASM_VECTOR_LEN = 0;

function passArrayF32ToWasm(arg) {
  const ptr = wasm.__wbindgen_malloc(arg.length * 4);
  getFloat32Memory().set(arg, ptr / 4);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachedTextEncoder = new TextEncoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
  if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory;
}

function passStringToWasm(arg) {
  const buf = cachedTextEncoder.encode(arg);
  const ptr = wasm.__wbindgen_malloc(buf.length);
  getUint8Memory().set(buf, ptr);
  WASM_VECTOR_LEN = buf.length;
  return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8');

function getStringFromWasm(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
  if (cachedGlobalArgumentPtr === null) {
    cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
  }
  return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
  if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
    cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
  }
  return cachegetUint32Memory;
}
/**
*/
/* export */ const Param = Object.freeze({ Attack: 0, AmpLFOrate: 1, AmpLFOwidth: 2, Decay: 3, DelayWet: 4, Gain: 5, Harmonic2Gain: 6, HarmonicsControl: 7, HarmonicFix: 8, HarmonicFunction: 9, HarmonicPhase: 10, HarmonicV1: 11, HPFCutoff: 12, LPF: 13, LPFattack: 14, LPFceiling: 15, LPFenvelope: 16, LPFfloor: 17, LPFmodrate: 18, LPFrelease: 19, LPFwidth: 20, Pitchmod: 21, PitchmodWidth: 22, Release: 23, ReverbWet: 24, SubOscGain: 25, Sustain: 26, WFunction: 27, });

function freeCitySynth(ptr) {

  wasm.__wbg_citysynth_free(ptr);
}
/**
*/
/* export */ class CitySynth {

  static __wrap(ptr) {
    const obj = Object.create(CitySynth.prototype);
    obj.ptr = ptr;

    return obj;
  }

  free() {
    const ptr = this.ptr;
    this.ptr = 0;
    freeCitySynth(ptr);
  }

  /**
    * @param {number} arg0
    * @param {number | undefined} arg1
    * @returns {CitySynth}
    */
  static new(arg0, arg1) {
    return CitySynth.__wrap(wasm.citysynth_new(arg0, !isLikeNone(arg1), isLikeNone(arg1) ? 0 : arg1));
  }

  /**
    * @param {Float32Array} arg0
    * @returns {void}
    */
  read(arg0) {
    const ptr0 = passArrayF32ToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    try {
      return wasm.citysynth_read(this.ptr, ptr0, len0);

    } finally {
      arg0.set(getFloat32Memory().subarray(ptr0 / 4, ptr0 / 4 + len0));
      wasm.__wbindgen_free(ptr0, len0 * 4);

    }

  }

  /**
    * @param {number} arg0
    * @returns {void}
    */
  set_buffer_len(arg0) {
    return wasm.citysynth_set_buffer_len(this.ptr, arg0);
  }

  /**
    * @param {number} arg0
    * @param {number | undefined} arg1
    * @returns {void}
    */
  note_on(arg0, arg1) {
    return wasm.citysynth_note_on(this.ptr, arg0, !isLikeNone(arg1), isLikeNone(arg1) ? 0 : arg1);
  }

  /**
    * @param {number} arg0
    * @returns {void}
    */
  note_off(arg0) {
    return wasm.citysynth_note_off(this.ptr, arg0);
  }

  /**
    * @param {number} arg0
    * @returns {number}
    */
  set_freq(arg0) {
    return wasm.citysynth_set_freq(this.ptr, arg0);
  }

  /**
    * @param {number} arg0
    * @returns {number}
    */
  get_state(arg0) {
    return wasm.citysynth_get_state(this.ptr, arg0);
  }

  /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {number}
    */
  set_state(arg0, arg1) {
    return wasm.citysynth_set_state(this.ptr, arg0, arg1);
  }

  /**
    * @returns {void}
    */
  refresh() {
    return wasm.citysynth_refresh(this.ptr);
  }

  /**
    * @param {string} arg0
    * @returns {string}
    */
  print(arg0) {
    const ptr0 = passStringToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    wasm.citysynth_print(retptr, this.ptr, ptr0, len0);
    const mem = getUint32Memory();
    const rustptr = mem[retptr / 4];
    const rustlen = mem[retptr / 4 + 1];

    const realRet = getStringFromWasm(rustptr, rustlen).slice();
    wasm.__wbindgen_free(rustptr, rustlen * 1);
    return realRet;

  }

  /**
    * @param {string} arg0
    * @returns {string}
    */
  load_preset(arg0) {
    const ptr0 = passStringToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    wasm.citysynth_load_preset(retptr, this.ptr, ptr0, len0);
    const mem = getUint32Memory();
    const rustptr = mem[retptr / 4];
    const rustlen = mem[retptr / 4 + 1];
    if (rustptr === 0) return;
    const realRet = getStringFromWasm(rustptr, rustlen).slice();
    wasm.__wbindgen_free(rustptr, rustlen * 1);
    return realRet;

  }
}

/* export */ function __wbindgen_throw(ptr, len) {
  throw new Error(getStringFromWasm(ptr, len));
}


