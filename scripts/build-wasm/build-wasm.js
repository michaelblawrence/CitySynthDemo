/* eslint-disable no-console */
/* eslint-disable no-undef */
const babel = require('@babel/core');
const inliner = require('./deps/inline-require');
const fs = require('fs');
const prettier = require('prettier');

const rootPath = '../..';
const binPath = rootPath + '/bin';
const tmpPath = binPath + '/tmp';

try {
  fs.mkdirSync(binPath, { recursive: true });
} catch {
  // console.error('couldn't create dir')
}

// const bareSeedJs = fs.readFileSync(rootPath + '/public/audio.js', 'utf-8');
const bareSeedJs = fs.readFileSync('audio.seed.js', 'utf-8');
fs.writeFileSync(binPath + '/seed.js', bareSeedJs); //../../public/audio.js ../../bin/seed.js

const originalBuildJs = fs.readFileSync(binPath + '/citysynth_wasm.js', 'utf-8');

const transformed = babel.transform(originalBuildJs, {
  plugins: ['remove-import-export']
});

try {
  fs.mkdirSync(tmpPath);
} catch {
  // console.error('couldn't create dir')
}

if (transformed.code) {
  fs.writeFileSync(tmpPath + '/pkg_intermediate_1.js', transformed.code);
  const textEncoderPolyfill = fs.readFileSync('deps/text.min.js', 'utf-8');
  fs.writeFileSync(tmpPath + '/text.min.js', textEncoderPolyfill);
} else {
  console.error('Could not babel transform code.');
  process.exit(1);
}

const originalSeedJs = fs.readFileSync(binPath + '/seed.js', 'utf-8');
const seedPath = binPath + '/seed.out.js';
const seedSuffix = `


// --------------------------------------- polyfills ------------------------------------
// require('./tmp/text.min');



// ---------------------------------------- wasm-bg -------------------------------------
require('./tmp/pkg_intermediate_1');
`;

fs.writeFileSync(seedPath, originalSeedJs + seedSuffix);

inliner(seedPath, (err, data) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  fs.writeFileSync(tmpPath + '/pkg_built_output.js', data);
  const formatted = prettier.format(data, {
    semi: true,
    parser: 'babel',
    endOfLine: 'crlf',
    useTabs: false,
    singleQuote: true,
    quoteProps: 'consistent',
    tabWidth: 2
    // filepath: rootPath + '/public/audio.js',
  });
  const classRename = file => file.replace(/CityRustGenerator/g, 'CodeGenCityRustGenerator');
  fs.writeFileSync(rootPath + '/public/audio.js', classRename(formatted));
  const wasmFile = fs.readFileSync(binPath + '/citysynth_wasm_bg.wasm');
  fs.writeFileSync(rootPath + '/public/wasm-synth/citysynth_wasm_bg.wasm', wasmFile);
});