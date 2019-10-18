/* eslint-disable react/prop-types */
import React, { Component } from 'react';

export class ProductAbout extends Component {
  render() {
    let resumeData = this.props.resumeData;
    return (
      <section id={'about'}>
        <div className="row">
          <div className="four columns">

            <img className="tech-logo" src="images/cropped-osc-panel.png" alt="CitySynth in action" />

          </div>

          <div className="eight columns main-col">

            <h2>CitySynth</h2>
            <p>
              {
                resumeData.productAbout
              }
            </p>

            <div className="row">

              <div className="eight columns product-details">

                <h2>Features</h2>
                <p className="features">
                  {resumeData.productFeatures.map(entry => (
                    <span key={entry}>{entry}</span>))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export class TechStackAbout extends Component {
  render() {
    let resumeData = this.props.resumeData;
    return (
      <section id={'tech'}>
        <div className="row">

          <div className="eight columns main-col">

            <h2>How it works</h2>
            <p>
              {
                resumeData.prodectTech
              }
            </p>

            <div className="row">

              {/* <div className="columns contact-details">

                <h2>Contact Details</h2>
                <p className="address">
                  <span>{resumeData.name}</span>
                  <br></br>
                  <span>
                    {resumeData.address}
                  </span>
                  <br></br>
                  <span>{resumeData.website}</span>
                </p>
              </div> */}
            </div>
          </div>

          <div className="four columns">
            <div className="tech-logo--container">
              <h3 className="tech-logo-header">Powered by:</h3>
              <img className="tech-logo" src="images/webassembly_logo.jpg" alt="WebAssembly Logo" />
            </div>
          </div>
        </div>
      </section>
    );
  }
}