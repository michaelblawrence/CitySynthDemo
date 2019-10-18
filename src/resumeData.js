const contentData = {
  'imagebaseurl': 'https://rbhatia46.github.io/',
  'productName': 'CitySynth',
  'productDescription': 'CitySynth is a polyphonic software synthesizer thats wild but warm offering unrivaled discrete harmonic oscillator control.',
  'productRole': 'An open source WebAudio Synth.',
  'productFeatures': [
    'Polyphonic subtractive synthesizer',
    'Unlimited stacked overtone oscillators',
    'Save your own presets or use from 100+ factory presets',
    'Always online, always free'
  ],
  'name': 'Michael Lawrence',
  'role': 'Software Developer',
  'linkedinId': 'Your LinkedIn Id',
  'skypeid': 'Your skypeid',
  'roleDescription': 'I like dabbling in various parts of frontend development and like to learn about new technologies, write technical articles or simply play games in my free time.',
  'socialLinks': [
    {
      'name': 'github',
      'url': 'http://github.com/michaelblawrence',
      'className': 'fa fa-github'
    }
  ],
  'productAbout': 'CitySynth offers both modulating algorithmic reverb and delay, buttery filters and a per-oscillator analogue-style end stage. Complete with over 100 factory presets, you\'ll be surprised by the range of possibilities. With musical PC keyboard support and (soon) MIDI support, CitySynth is a tool for the studio and on the go!',
  'prodectTech': `Bringing CitySynth online is only possible due to recent advancements in web tech.
  This was made possible by the rewrite of the original core audio engine in the Rust programming language.
  Leveraging wasm-bindgen, this audio engine is compiled into WebAssembly and instantiated and run on a separate WebAudio worker thread on the browser.
  The new core audio engine allows CitySynth to run reliably with no runtime heap allocations. This makes it a perfect fit for real-time audio synthesis and allows for a predictable runtime in the browser.
  The CitySynth UI, originally implemented in C# WinForms, has been achieved using purely web technologies.
  React, Redux and RxJS have been utilized to provide bi-directional bindings between the WebAudio thread and the interface.
  Taking CitySynth from a desktop executable to the Web has come with many challenges and resulted in a medley of new and interesting tech! Come back soon for a blog post recording some of the challenges faced in recreating this virtual instrument on the web.
  There's plenty more to come from the CitySynth project, a proof of concept VST plugin can be found on the city-rust repo, and there are plans to target native desktop once again with the power of node.js and electron! So feel free to keep in touch or even contribute to the open-source projects!`,
  'aboutme': 'I am currently a pre-final year student at The LNM Institute of Information Technology and pursuing my B.Tech from here. I am a self taught Full Stack Web Developer, currently diving deeper into Machine Learning. I believe that to be successful in life, one needs to be obsessive with their dreams and keep working towards them.',
  'address': 'London',
  'website': 'https://michaelblawrence.github.io/rustwasmtester/react/',
  'education': [
    {
      'UniversityName': 'University College London',
      'specialization': 'Chemistry MSci',
      'MonthOfPassing': 'Jun',
      'YearOfPassing': '2018',
      'Achievements': 'Some Achievements'
    }
  ],
  'work': [
    {
      'CompanyName': 'Spreadex',
      'specialization': 'Graduate .NET Software Developer',
      'MonthOfLeaving': 'Sept',
      'YearOfLeaving': '2018',
      'Achievements': 'Some Achievements'
    }
  ],
  'skillsDescription': 'Your skills here',
  'skills': [
    {
      'skillname': 'C# / .NET'
    },
    {
      'skillname': 'Typescript / Angular'
    },
    {
      'skillname': 'Rust / WebAssembly'
    }
  ],
  'portfolio': [
    {
      'name': 'projectnucleus',
      'description': 'A fast-paced couch multiplayer game',
      'href': 'https://github.com/michaelblawrence/projectnucleus',
      'imgurl': 'images/projectnucleus_screenshot001.png'
    },
    {
      'name': 'CitySynth Online',
      'description': 'This website is also open source, complete with the live demo of CitySynth Online',
      'href': 'https://github.com/michaelblawrence/CitySynthDemo',
      'imgurl': 'images/this-is-city-synth.png'
    },
    {
      'name': 'learnr',
      'description': 'A LSTM-based single-player game training machine learning library',
      'href': 'https://github.com/michaelblawrence/learnr',
      'imgurl': 'images/learnr-training-demo.png'
    }
  ],
  'testimonials': [
    {
      'description': 'This is a sample testimonial',
      'name': 'Some technical guy'
    },
    {
      'description': 'This is a sample testimonial',
      'name': 'Some technical guy'
    }
  ]
};

export default contentData;