import React, { Component } from 'react';
import { SynthWindow } from './components';
class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Header resumeData={resumeData}/> */}
        {/* <About resumeData={resumeData}/> */}
        {/* <Resume resumeData={resumeData}/> */}
        {/* <Portfolio resumeData={resumeData}/> */}
        {/* <Testimonials resumeData={resumeData}/> */}
        {/* <ContactUs resumeData={resumeData}/> */}
        {/* <Footer resumeData={resumeData}/> */}
        <SynthWindow />
      </div>
    );
  }
}

export default App;