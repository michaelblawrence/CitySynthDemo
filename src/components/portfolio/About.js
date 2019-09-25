/* eslint-disable react/prop-types */
import React, { Component } from 'react';
export class ProductAbout extends Component {
  render() {
    let resumeData = this.props.resumeData;
    return (
      <section id={'about'}>
        <div className="row">

          <div className="four columns">

            {/* <img className="profile-pic" src="images/profilepic.jpg" alt="" /> */}

          </div>

          <div className="eight columns main-col">

            <h2>CitySynth</h2>
            <p>
              {
                resumeData.productAbout
              }
            </p>

            <div className="row">

              <div className="columns contact-details">

                <h2>Features</h2>
                <p className="address">
                  <span>{resumeData.name}</span>
                  <span>{resumeData.address}</span>
                  <span>{resumeData.website}</span>
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

            <h2>About Me</h2>
            <p>
              {
                resumeData.aboutme
              }
            </p>

            <div className="row">

              <div className="columns contact-details">

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
              </div>
            </div>
          </div>

          <div className="four columns">

            {/* <img className="profile-pic" src="images/profilepic.jpg" alt="" /> */}

          </div>
        </div>
      </section>
    );
  }
}