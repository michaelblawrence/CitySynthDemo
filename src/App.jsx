import React from 'react';
import { SynthWindow, Header, About, Resume, Footer, Portfolio } from './components';
import resumeData from './resumeData';

const App = () => {
  return (
    <div className="App">
      <Header resumeData={resumeData} />
      <SynthWindow />
      <About resumeData={resumeData} iden="about" />
      <About resumeData={resumeData} iden="tech" />
      <Portfolio resumeData={resumeData} />
      {/* <Testimonials resumeData={resumeData}/> */}
      {/* <ContactUs resumeData={resumeData}/> */}
      <Footer resumeData={resumeData} />
    </div>
  );
};

export default App;