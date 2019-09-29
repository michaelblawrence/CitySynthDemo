/* tslint:disable */
// import * as wasm from './citysynth_wasm_bg';

/**
*/
/* export */ const CellEvent = Object.freeze({ Underpopulation:0,LivesOn:1,Overpopulation:2,Reproduction:3,NoChange:4, });
/**
*/
/* export */ const Cell = Object.freeze({ Dead:0,Alive:1, });

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
/* export */ const Param = Object.freeze({ Attack:0,AmpLFOrate:1,AmpLFOwidth:2,Decay:3,DelayWet:4,Gain:5,Harmonic2Gain:6,HarmonicsControl:7,HarmonicFix:8,HarmonicFunction:9,HarmonicPhase:10,HarmonicV1:11,HPFCutoff:12,LPF:13,LPFattack:14,LPFceiling:15,LPFenvelope:16,LPFfloor:17,LPFmodrate:18,LPFrelease:19,LPFwidth:20,Pitchmod:21,PitchmodWidth:22,Release:23,ReverbWet:24,SubOscGain:25,Sustain:26,WFunction:27, });

function freeUniverse(ptr) {

    wasm.__wbg_universe_free(ptr);
}
/**
*/
/* export */ class Universe {

    static __wrap(ptr) {
        const obj = Object.create(Universe.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeUniverse(ptr);
    }

    /**
    * @returns {Universe}
    */
    static new() {
        return Universe.__wrap(wasm.universe_new());
    }
    /**
    * @returns {number}
    */
    width() {
        return wasm.universe_width(this.ptr);
    }
    /**
    * @returns {number}
    */
    height() {
        return wasm.universe_height(this.ptr);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {void}
    */
    set_size(arg0, arg1) {
        return wasm.universe_set_size(this.ptr, arg0, arg1);
    }
    /**
    * @returns {number}
    */
    cells() {
        return wasm.universe_cells(this.ptr);
    }
    /**
    * @returns {void}
    */
    reset() {
        return wasm.universe_reset(this.ptr);
    }
    /**
    * @returns {void}
    */
    clear() {
        return wasm.universe_clear(this.ptr);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {void}
    */
    toggle(arg0, arg1) {
        return wasm.universe_toggle(this.ptr, arg0, arg1);
    }
    /**
    * @returns {void}
    */
    tick() {
        return wasm.universe_tick(this.ptr);
    }
}

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
