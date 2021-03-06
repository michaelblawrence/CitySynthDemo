/* eslint-disable react/prop-types */
import React, { Component } from 'react';
export class Portfolio extends Component {
  render() {
    let contentData = this.props.contentData;
    return (
      <section id="portfolio">
        <div className="row">
          <div className="twelve columns collapsed">
            <h1>Check Out Some of My Works.</h1>
            <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
              {
                contentData.portfolio && contentData.portfolio.map((item) => {
                  return (
                    <div className="columns portfolio-item" key={item.name}>
                      <div className="item-wrap">
                        <a href={item.href}>
                          <img src={item.imgurl} alt={item.name} className="item-img" />
                          <div className="overlay">
                            <div className="portfolio-item-meta">
                              <h5>{item.name}</h5>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </section>
    );
  }
}