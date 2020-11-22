import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import TimeAgo from 'react-timeago';
import { ReactTinyLink } from 'react-tiny-link';
import TextTruncate from 'react-text-truncate';


PostNewsFeed.propTypes = {
    postId: PropTypes.number,
    user: PropTypes.string,
    upVotes: PropTypes.number,
    downVotes: PropTypes.number,
    content: PropTypes.string,
    community: PropTypes.string,
    onClickPost: PropTypes.func
};

PostNewsFeed.defaultProps = {
    postId: 0,
    user: '',
    upVotes: 0,
    downVotes: 0,
    content: '',
    community: '',
    onClickPost: null
}


function PostNewsFeed(props) {
    const { onClickPost } = props;
    const [points, setPoints] = useState(props.upVotes - props.downVotes);
    const [voteStatus, setVoteStatus] = useState(0); //0 : none; 1 : upvote; -1 : downvote

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    var config = {}
    if (props.isAuthed) {
        config = {
            headers: { Authorization: `Bearer ${getCookie('token')}` },
            cancelToken: source.token
        };
    }

    else {
        config = {
            headers: { 'Content-Type': 'text/plain', },
            cancelToken: source.token
        };
    }

    function handleClickPost(detail) {
        onClickPost(detail);
        // setNewPoints(true);
    }

    // useEffect(() => {
    //     var post_popup = document.getElementsByClassName('open-post');
    //     var black_background = document.getElementById('background');
    //     var post_close = document.getElementsByClassName('close-post-btn');


    //     function showPostPopup(event) {
    //         document.getElementById('post-popup').style.display = 'block';
    //         black_background.classList.add('black-background');
    //         event.preventDefault();
    //     }
    //     function removePostPopup() {
    //         document.getElementById('post-popup').style.display = 'none';
    //         black_background.classList.remove('black-background');
    //     }
    //     black_background.onclick = function () {
    //         removePostPopup()
    //     }
    //     for (let i = 0; i < post_popup.length; i++) {
    //         post_popup[i].addEventListener('click', showPostPopup, false);
    //     }
    //     for (let i = 0; i < post_close.length; i++) {
    //         post_close[i].addEventListener('click', removePostPopup, false);
    //     }
    // }, [])

    useEffect(() => {
        var modal = document.getElementById('id01');
        var popup = document.getElementsByClassName('login');
        var login_tab = document.getElementById('form-login');
        var register_tab = document.getElementById('form-register');
        var login_tab_btn = document.getElementById('btn-login-tab');
        var reg_tab_btn = document.getElementById('btn-reg-tab');



        function showPopup(event) {
            document.getElementById('id01').style.display = 'block';
            document.getElementById('message').innerHTML = '';

            register_tab.style.display = 'none';
            login_tab.style.display = 'block';
            reg_tab_btn.classList.remove('active');
            login_tab_btn.classList.add('active');
            event.preventDefault()

        };

        for (var i = 0; i < popup.length; i++) {
            popup[i].addEventListener('click', showPopup, false);
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }

        reg_tab_btn.onclick = function () {
            login_tab.style.display = 'none';
            register_tab.style.display = 'block';
            login_tab_btn.classList.remove('active');
            reg_tab_btn.classList.add('active');
        }

        login_tab_btn.onclick = function () {
            register_tab.style.display = 'none';
            login_tab.style.display = 'block';
            reg_tab_btn.classList.remove('active');
            login_tab_btn.classList.add('active');
        }


    }, []);


    function getCookie(name) {
        // Split cookie string and get all individual name=value pairs in an array
        var cookieArr = document.cookie.split(";");

        // Loop through the array elements
        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");

            /* Removing whitespace at the beginning of the cookie name
            and compare it with the given string */
            if (name == cookiePair[0].trim()) {
                // Decode the cookie value and return
                return decodeURIComponent(cookiePair[1]);
            }
        }

        // Return null if not found
        return null;
    }


    function showPopup() {
        document.getElementById('id01').style.display = 'block';

        document.getElementById('form-register').display = 'none';
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('btn-reg-tab').classList.remove('active');
        document.getElementById('btn-login-tab').classList.add('active');

    };


    async function handleCheckVote(id) {
        const data = {
            id: id
        };
        axios.post('http://127.0.0.1:8000/api/post/check/vote', data, config).then(function (response) {
            if (response.data[0] === "up_vote") {
                // document.getElementById("upvote_" + id).classList.add('active');
                // document.getElementById("downvote_" + id).classList.remove('active');
                // document.getElementById("point_" + id).classList.add('point-active');
                setVoteStatus(1);
            }
            else if (response.data[0] === "down_vote") {
                // document.getElementById("downvote_" + id).classList.add('active');
                // document.getElementById("upvote_" + id).classList.remove('active');
                // document.getElementById("point_" + id).classList.add('point-active');
                setVoteStatus(-1);
            }
            else {
                // document.getElementById("point_" + id).classList.remove('point-active');
                // document.getElementById("upvote_" + id).classList.remove('active');
                // document.getElementById("downvote_" + id).classList.remove('active');
                setVoteStatus(0);
            }


        })
            .catch(function (error) {
                console.log(error);
            });
    }
    const [countComment, setCountComment] = useState(0);
    async function handleCountComment(id) {

        axios.get(`http://127.0.0.1:8000/api/comment/${id}/count`, config).then(function (response) {
            setCountComment(response.data.Total);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        handleCountComment(props.postId);
        if (props.isAuthed) {
            handleCheckVote(props.postId);
        }
        return () => {
            source.cancel();
        };

    }, [props.showPost]);



    async function onClickUpVote() {
        if (props.isAuthed) {
            // nếu post đã được upvote rồi thì huỷ upvote
            // if (document.getElementById("upvote_" + props.postId).classList.contains('active')) {
            //     handleUpVote(-1);
            //     document.getElementById("upvote_" + props.postId).classList.remove('active');
            //     document.getElementById("point_" + props.postId).classList.remove('point-active');
            // }
            // // nếu post đã được downvote thì huỷ downvote và kích hoạt upvote
            // else if (document.getElementById("downvote_" + props.postId).classList.contains('active')) {
            //     handleDownVote(0);
            //     setTimeout(handleUpVote(2), 1);
            //     document.getElementById("downvote_" + props.postId).classList.remove('active');
            // }
            // // nếu post chưa được vote thì kích hoạt upvote
            // else {
            //     handleUpVote(1);
            //     document.getElementById("upvote_" + props.postId).classList.add('active');
            //     document.getElementById("point_" + props.postId).classList.add('point-active');
            // }
            if (voteStatus === 1) {
                handleUpVote(-1);
                setVoteStatus(0);
            }
            else if (voteStatus === -1) {
                handleDownVote(0);
                setTimeout(handleUpVote(2), 1);
                setVoteStatus(1);
            }
            else {
                handleUpVote(1);
                setVoteStatus(1);
            }
        }

    }

    async function onClickDownVote() {
        if (props.isAuthed) {
            // nếu post đã được downvote rồi thì huỷ downvote
            // if (document.getElementById("downvote_" + props.postId).classList.contains('active')) {
            //     handleDownVote(1);
            //     document.getElementById("downvote_" + props.postId).classList.remove('active');
            //     document.getElementById("point_" + props.postId).classList.remove('point-active');
            // }
            // // nếu post đã được upvote thì huỷ upvote và kích hoạt downvote
            // else if (document.getElementById("upvote_" + props.postId).classList.contains('active')) {
            //     handleUpVote(0);
            //     setTimeout(handleDownVote(-2), 1);
            //     document.getElementById("upvote_" + props.postId).classList.remove('active');
            // }
            // // nếu post chưa được vote thì kích hoạt downvote
            // else {
            //     handleDownVote(-1);
            //     document.getElementById("downvote_" + props.postId).classList.add('active');
            //     document.getElementById("point_" + props.postId).classList.add('point-active');
            // }
            if (voteStatus === -1) {
                handleDownVote(1);
                setVoteStatus(0);
            }
            else if (voteStatus === 1) {
                handleUpVote(0);
                setTimeout(handleDownVote(-2), 1);
                setVoteStatus(-1);
            }
            else {
                handleDownVote(-1);
                setVoteStatus(-1);
            }
        }
    }


    async function handleUpVote(p) {
        const data = {
            id: props.postId,
            action: 'up_vote'
        };
        axios.post('http://127.0.0.1:8000/api/post/action', data, config).then(function (response) {
            setPoints(points + p);
            console.log('up' + points);
        })
            .catch(function (error) {
                if (error.response.status === 403) {
                    showPopup();
                }
            });
    }
    async function handleDownVote(p) {
        const data = {
            id: props.postId,
            action: 'down_vote'
        };
        axios.post('http://127.0.0.1:8000/api/post/action', data, config).then(function (response) {
            if (response.status === 200) {
                setPoints(points + p);
                console.log('down' + points);
            }

        })
            .catch(function (error) {
                if (error.response.status === 403) {
                    showPopup();
                }
            });
    }


    useEffect(() => {
        if (props.pointsChanged.id === props.postId) {
            setPoints(props.pointsChanged.points);
        }
        // console.log(props.user)
    console.log(props);
    }, [props.pointsChanged])

    return (
        <article id="post-3877" className="post hentry clearfix post-3877 topic type-topic status-publish format-standard has-post-thumbnail topic_category-@Technology topic_tag-social-media">
            <div className="rankpoint">
                <div className="points">
                    <a className={props.isAuthed ? "" : "login"} data-post_id={"up" + props.postId} title="Up"><i id={"upvote_" + props.postId} className={voteStatus === 1 ? "fa fa-caret-up active" : "fa fa-caret-up"} onClick={onClickUpVote} /></a>
                    <div id={"point_" + props.postId} className={voteStatus === 1 || voteStatus === -1 ? "point-active" : ""}> {points}</div>
                    <a className={props.isAuthed ? "" : "login"} data-post_id={"down" + props.postId} title="Down"><i id={"downvote_" + props.postId} className={voteStatus === -1 ? "fa fa-caret-down active" : "fa fa-caret-down"} onClick={onClickDownVote} /></a>
                </div>
            </div>
            <div className="entrycontent clearfix">
                <div className="detail">
                    <div className="entrymeta">
                        <span className="avatar">
                            <a href={"/user/" + props.user}><img src={props.avatar} alt="" /> {props.user} </a></span>
                        <span className="date">
                            <a href="# ">{<TimeAgo date={new Date(props.timestamp)} />} </a> <a href={"/community"+"/"+props.community}>{props.community}</a>
                        </span>
                        <span className="comments">
                            <a href="# "><i className="fa fa-comments" />{" " + countComment}</a>
                        </span>
                    </div>
                    <h3 className="post-title open-post">
                        <a onClick={e => { handleClickPost(props); e.preventDefault() }} href="# " title={props.title} rel="nofollow">{props.title}</a>
                    </h3>
                </div>
                {
                    props.type === 'image' ?
                        <div className="thumbnail open-post list-post" onClick={e => { handleClickPost(props); e.preventDefault() }}>
                            <a href="# " title={props.title} rel="nofollow">
                                <img src={props.image} className="attachment-thumbnail size-thumbnail wp-post-image" alt={props.title} title={props.title} />

                            </a>
                        </div>
                        : props.type === 'url' ?
                            <div className="link-post">
                                <ReactTinyLink
                                    cardSize="small"
                                    showGraphic={true}
                                    maxLine={2}
                                    minLine={1}
                                    url={props.content}
                                />
                            </div>
                            :
                            <p className="wall-of-text nf" onClick={e => { handleClickPost(props); e.preventDefault() }}>
                                <TextTruncate
                                    line={3}
                                    element="span"
                                    truncateText="…"
                                    text={props.content}
                                    textTruncateChild={<a className="read-on" href="# " onClick={e => { handleClickPost(props); e.preventDefault() }}>Read on</a>}
                                />
                            </p>
                }

            </div>
        </article>
    );
}

export default PostNewsFeed;