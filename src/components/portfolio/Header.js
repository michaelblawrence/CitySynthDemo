import React from 'react';
import PropTypes from 'prop-types';
export const Header = ({ contentData }) => {
  return (
    <React.Fragment>

      <header id="home">
        <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
          <a className="mobile-btn" href="#" title="Hide navigation">Hide navigation</a>
          <ul id="nav" className="nav">
            <li className="current"><a className="smoothscroll" href="#home">Home</a></li>
            <li><a className="smoothscroll" href="#demo">Try</a></li>
            <li><a className="smoothscroll" href="#about">About</a></li>
            <li><a className="smoothscroll" href="#tech">Tech</a></li>
            <li><a className="smoothscroll" href="#portfolio">Projects</a></li>
          </ul>
        </nav>

        <div className="row banner">
          <div className="banner-text">
            <h1 className="responsive-headline">This is {contentData.productName}.</h1>
            <h3 style={{ color: '#fff', fontFamily: 'sans-serif ' }}>
              <span className="banner-tagline">
                {contentData.productRole}
              </span>
              <span className="banner-description">
                {contentData.productDescription}
              </span>
            </h3>
            <hr />
            <ul className="social">
              {
                contentData.socialLinks && contentData.socialLinks.map(item => (
                  <li key={item.name}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer"><i className={item.className}></i></a>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        <p className="scrolldown">
          <a className="smoothscroll icon" href="#demo"><i className="icon-down-circle"></i></a>
          <a className="smoothscroll try-msg" href="#demo">Try the synth below</a>
        </p>

      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  contentData: PropTypes.object,
};
