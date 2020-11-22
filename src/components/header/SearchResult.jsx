import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextTruncate from 'react-text-truncate';
import TimeAgo from 'react-timeago';

SearchResult.propTypes = {
    onClickOutSide: PropTypes.func,
};

SearchResult.defaultProps = {
    onClickOutSide: null
}



function SearchResult(props) {

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    function useOutsideAlerter(ref) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    if(!props.onClickOutSide) return
                    props.onClickOutSide(true);
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function handleRedirect(value) {
        console.log("redirect")
        window.location.href = "http://localhost:3000/user/" + value;
    }
    // console.log(props.results)
    return (
        <div className="list-group search-block" ref={wrapperRef}>
            {
                props.type === 'post' ?
                    props.results.map(res => (
                        <a key={res.id} target="_blank" href={"/" + res.community_type + "/post/" + res.id} className="list-group-item list-group-item-action flex-column align-items-start">
                            {
                                res.type === 'image' ?
                                    <img src={res.image} alt="" className="search-image" />
                                    :
                                    res.type === 'article' ?
                                        <i className="fa fa-file-text article-search" aria-hidden="true"></i>
                                        :
                                        <i className="fa fa-link article-search" aria-hidden="true"></i>
                            }

                            <div className="meta-box">
                                <div className="d-flex w-100 justify-content-between">
                                    <b className="mb-1">{res.title}</b>
                                    <small>{<TimeAgo date={new Date(res.timestamp)} />}</small>
                                </div>
                                {/* <p className="mb-1">{res.content}</p> */}
                                {
                                    res.type !== 'image' ?
                                        <p className="mb-1">
                                            <TextTruncate
                                                line={1}
                                                element="span"
                                                truncateText="…"
                                                text={res.content}
                                            // textTruncateChild={<a href="#">Read on</a>}
                                            />
                                        </p>
                                        : null
                                }


                                <small>{res.community_type}</small>
                            </div>
                        </a>
                    ))
                    :
                    props.type === 'user' ?
                        props.results.map(res => (
                            <a onClick={e => { handleRedirect(res.username); e.preventDefault() }} key={res.id} href={"/user/" + res.username} className="list-group-item list-group-item-action flex-column align-items-start user-search">
                                <img src={res.avatar} alt="" className="search-avatar" />
                                <div className="meta-box">
                                    <div className="d-flex w-100 justify-content-between">
                                        <b className="mb-1">{res.first_name} {res.last_name}</b>
                                        <p className="mb-1">@{res.username}</p>
                                    </div>
                                    <p className="mb-1">{res.bio}</p>
                                </div>

                            </a>
                        ))
                        :
                        props.results.map(res => (
                            <a key={res.id} href={"/community/" + res.community_type} className="list-group-item list-group-item-action flex-column align-items-start user-search">
                                <img src={res.avatar} alt="" className="search-avatar" />
                                <div className="meta-box">
                                    <div className="d-flex w-100 justify-content-between">
                                        <b className="mb-1">{res.community_type ? capitalizeFirstLetter(res.community_type) : null}</b>
                                        <p className="mb-1">@{res.community_type}</p>
                                    </div>
                                    <p className="mb-1">{res.member_count} members</p>
                                </div>

                            </a>
                        ))
            }

        </div>

    );
}

export default SearchResult;