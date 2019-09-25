import React from 'react';
import { SynthWindow, Header, Footer, Portfolio, ProductAbout, TechStackAbout } from './components';
import resumeData from './resumeData';

const App = () => {
  return (
    <div className="App">
      <Header resumeData={resumeData} />
      <SynthWindow />
      <ProductAbout resumeData={resumeData}/>
      <TechStackAbout resumeData={resumeData} />
      <Portfolio resumeData={resumeData} />
      {/* <Testimonials resumeData={resumeData}/> */}
      {/* <ContactUs resumeData={resumeData}/> */}
      <Footer resumeData={resumeData} />
    </div>
  );
};

export default App;