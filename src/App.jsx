import React from 'react';
import { Header, Footer, Portfolio, ProductAbout, TechStackAbout } from './components';
import contentData from './contentData';
import { ProductDemo } from './components/portfolio/Demo';

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