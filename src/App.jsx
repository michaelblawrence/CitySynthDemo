import React from 'react';
import { Header, Footer, Portfolio, ProductAbout, TechStackAbout } from './components';
import contentData from './resumeData';
import { ProductDemo } from './components/portfolio/Demo';

const App = () => {
  return (
    <div className="App">
      <Header resumeData={contentData} />
      <ProductDemo resumeData={contentData} />
      <ProductAbout resumeData={contentData}/>
      <TechStackAbout resumeData={contentData} />
      <Portfolio resumeData={contentData} />
      <Footer resumeData={contentData} />
    </div>
  );
};

export default App;