import React from 'react';
import PropTypes from 'prop-types';

TrendingBar.propTypes = {

};

function TrendingBar(props) {
    return (
        <div id="trending-bar">
            <div className="container trending">
                <div id="trending-news">
                    <div className="trending-label">Trending now</div>
                    <div className="trending-slider owl-carousel owl-theme owl-loaded">
                        <div className="owl-stage-outer">
                            <div className="owl-stage" style={{ transform: 'translate3d(0px, 0px, 0px)', transition: 'all 0s ease 0s', width: '899px' }}>
                                <div className="owl-item active" style={{ width: '899px', marginRight: '0px' }}>
                                    <p className="hentry trending-news post-6 page type-page status-publish">
                                    </p><h3 className="trending-title"><a href="# ">Sorry, no trending topics at the moment.</a>
                                    </h3>
                                    <p />
                                </div>
                            </div>
                        </div>
                        <div className="owl-controls">
                            <div className="owl-nav">
                                <div className="owl-prev"><i className="fa fa-angle-left" /></div>
                                <div className="owl-next"><i className="fa fa-angle-right" /></div>
                            </div>
                            <div className="owl-dots" style={{ display: 'none' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrendingBar;