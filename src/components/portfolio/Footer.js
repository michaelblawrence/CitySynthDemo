import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Footer extends Component {
  render() {
    let contentData = this.props.contentData;
    return (
      <footer>
        <div className="row">
          <div className="twelve columns">
            <ul className="social-links">
              {
                contentData.socialLinks && contentData.socialLinks.map((item) => {
                  return (
                    <li key={item.url}>
                      <a href={item.url}>
                        <i className={item.className} />
                      </a>
                    </li>
                  );
                })
              }
            </ul>

          </div>
          <div id="go-top"><a className="smoothscroll" title="Back to Top" href="#home"><i className="icon-up-open" /></a></div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  contentData: PropTypes.object
};
