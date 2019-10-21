import React from 'react';
import { Header, Footer, Portfolio, ProductAbout, ProductDemo, TechStackAbout } from './components';
import contentData from './contentData';

const App = () => {
  return (
    <div className="App">
      <Header contentData={contentData} />
      <ProductDemo contentData={contentData} />
      <ProductAbout contentData={contentData}/>
      <TechStackAbout contentData={contentData} />
      <Portfolio contentData={contentData} />
      <Footer contentData={contentData} />
    </div>
  );
};

export default App;