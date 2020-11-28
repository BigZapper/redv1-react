import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

TrendingTags.propTypes = {
    onChangeFilter: PropTypes.func,
};

TrendingTags.defaultProps = {
    onChangeFilter: null,
}

function TrendingTags(props) {
    const [filter, setFilter] = useState(0); //0: Hot; 1: New; 2: Best; 3: Top today; 4: top week; 5: top month
    // const [top, setTop] = useState('date');
    function handleChangeFilter(value) {
        if (!props.onChangeFilter) return;
        // console.log(value);
        setFilter(value);
        props.onChangeFilter(parseInt(value));
    }
    return (
        <div>
            {/* <div id="trending-tags">
                <ul className="trending-tags">
                    <li className="first"><i className="fa fa-tags" aria-hidden="true" /> Trending Tags: </li>
                    <li><a href="# " rel="tag">Startup</a>
                    </li>
                    <li><a href="# " rel="tag">Cars</a></li>
                    <li><a href="# " rel="tag">New York Post</a></li>
                    <li><a href="# " rel="tag">Viral</a></li>
                </ul>
            </div> */}
            {/* end row trending tags */}
            <header className="section-title">
                <div className="filter">
                    <a className={filter === 0 ? "filter-link active" : "filter-link"} href="# " onClick={(e) => { handleChangeFilter(0); e.preventDefault() }}>
                        <i className="fa fa-fire filter-icon" aria-hidden="true" />
                        <div className="filter-title">
                            Hot
                        </div>
                    </a>
                    <a className={filter === 1 ? "filter-link active" : "filter-link"} href="# " onClick={(e) => { handleChangeFilter(1); e.preventDefault() }}>
                        <i className="fa fa-certificate filter-icon" aria-hidden="true" />
                        <div className="filter-title">
                            New
                        </div>
                    </a>
                    {
                        props.isAuthed === true ?
                            <span>
                                <a className={filter === 2 ? "filter-link active" : "filter-link"} href="# " onClick={(e) => { handleChangeFilter(2); e.preventDefault() }}>
                                    <i className="fa fa-rocket filter-icon" aria-hidden="true" />
                                    <div className="filter-title">
                                        Best
                        </div>
                                </a>
                                <a className={filter == 3 || filter == 4 || filter == 5 || filter == 6 || filter == 7 ? "filter-link active" : "filter-link"} href="# " onClick={(e) => { handleChangeFilter(3); e.preventDefault() }}>
                                    <i className="fa fa-line-chart filter-icon" aria-hidden="true" />
                                    <div className="filter-title">
                                        Top
                        </div>
                                </a>
                            </span>
                            : null
                    }

                    {
                        filter == 3 || filter == 4 || filter == 5 || filter == 6 || filter == 7 ?
                            <div value={filter} onChange={(e) => { handleChangeFilter(e.target.value) }} className="box">
                                <select>
                                    <option value={3}>Today</option>
                                    <option value={4}>This Week</option>
                                    <option value={5}>This Month</option>
                                    <option value={6}>This Year</option>
                                    <option value={7}>All Time</option>
                                </select>
                            </div>
                            : null
                    }
                </div>
            </header>

        </div>
    );
}

export default TrendingTags;