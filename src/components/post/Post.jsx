import React from 'react';
import PropTypes from 'prop-types';
import Contents from './components/Contents';
import CommentSection from './components/comment-container/CommentSection';
import SideBarCommunity from '../body/SideBarCommunity';
import CommentContainer from './components/CommentContainer';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


Post.propTypes = {
    onClosePost: PropTypes.func,
};
Post.defaultProps = {
    onClosePost: null
}

function Post(props) {
    var postId = 0;
    const {idPost} = useParams();
    if(props.detail){
        postId = props.detail.postId;
    }
    else
        postId = idPost;
    // if(idPost!==null)
    // {
    //     postId = idPost;
    // }
    // else{
    //     postId = props.detail.postId;
    // }
    const [postDetail, setPostDetail] = useState({
        postId: 0,
        user: "",
        upVotes: 0,
        downVotes: 0,
        title: "",
        content: "",
        community: "",
    });
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
    const [countComment, setCountComment] = useState(0);
    async function onLoadPost() {
        axios.get(`http://127.0.0.1:8000/api/post/${postId}`, config).then(function (response) {

            setPostDetail({
                postId: response.data.id,
                user: response.data.user.username,
                type: response.data.type,
                image: response.data.image,
                upVotes: response.data.up_vote,
                downVotes: response.data.down_vote,
                title: response.data.title,
                content: response.data.content,
                community: response.data.community_type,
                timestamp: response.data.timestamp
            });
            setPoints(response.data.up_vote - response.data.down_vote);
        })
            .catch(function (error) {
                console.log(error.response);
                // if (error.response.status) {
                //     if (error.response.status === 401) {
                //         showPopup();
                //         console.log("Post riêng tư");
                //     }
                //     if (error.response.status === 403) {
                //         showPopup();
                //         console.log(error.response.statusText);
                //     }
                // }

                if (axios.isCancel(error)) {
                    console.log("cancelled");
                }
            });

        axios.get(`http://127.0.0.1:8000/api/comment/${postId}/count`, config).then(function (response) {
            setCountComment(response.data.Total);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [voteStatus, setVoteStatus] = useState(0);
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

        // console.log(postDetail);
    useEffect(() => {
        onLoadPost();
        if (props.isAuthed) {
            handleCheckVote(postId);
        }
        return () => {
            source.cancel();
        };
    }, [props]);


    async function onClickUpVote() {
        if (props.isAuthed) {
            // nếu post đã được upvote rồi thì huỷ upvote
            // if (document.getElementById("upvote_detail_" + props.detail.postId).classList.contains('active')) {
            //     handleUpVote(-1);
            //     document.getElementById("upvote_detail_" + props.detail.postId).classList.toggle('active');
            //     document.getElementById("point_detail_" + props.detail.postId).classList.toggle('point-active');
            // }
            // // nếu post đã được downvote thì huỷ downvote và kích hoạt upvote
            // else if (document.getElementById("downvote_detail_" + props.detail.postId).classList.contains('active')) {
            //     handleDownVote(0);
            //     setTimeout(handleUpVote(2), 1);
            //     document.getElementById("downvote_detail_" + props.detail.postId).classList.toggle('active');
            // }
            // // nếu post chưa được vote thì kích hoạt upvote
            // else {
            //     handleUpVote(1);
            //     document.getElementById("upvote_detail_" + props.detail.postId).classList.toggle('active');
            //     document.getElementById("point_detail_" + props.detail.postId).classList.toggle('point-active');
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
        else
            showPopup();

    }

    async function onClickDownVote() {

        if (props.isAuthed) {
            // nếu post đã được downvote rồi thì huỷ downvote
            // if (document.getElementById("downvote_detail_" + props.detail.postId).classList.contains('active')) {
            //     handleDownVote(1);
            //     document.getElementById("downvote_detail_" + props.detail.postId).classList.toggle('active');
            //     document.getElementById("point_detail_" + props.detail.postId).classList.toggle('point-active');
            // }
            // // nếu post đã được upvote thì huỷ upvote và kích hoạt downvote
            // else if (document.getElementById("upvote_detail_" + props.detail.postId).classList.contains('active')) {
            //     handleUpVote(0);
            //     setTimeout(handleDownVote(-2), 1);
            //     document.getElementById("upvote_detail_" + props.detail.postId).classList.toggle('active');
            // }
            // // nếu post chưa được vote thì kích hoạt downvote
            // else {
            //     handleDownVote(-1);
            //     document.getElementById("downvote_detail_" + props.detail.postId).classList.toggle('active');
            //     document.getElementById("point_detail_" + props.detail.postId).classList.toggle('point-active');
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
        else
            showPopup();
    }
    function showPopup() {
        document.getElementById('id01').style.display = 'block';

        document.getElementById('form-register').display = 'none';
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('btn-reg-tab').classList.remove('active');
        document.getElementById('btn-login-tab').classList.add('active');

    };
    const [points, setPoints] = useState(0);
    async function handleUpVote(p) {
        const data = {
            id: postId,
            action: 'up_vote'
        };
        axios.post('http://127.0.0.1:8000/api/post/action', data, config).then(function (response) {
            setPoints(points + p);
            console.log('up');
        })
            .catch(function (error) {
                if (error.response.status === 403) {
                    showPopup();
                }
            });
    }
    async function handleDownVote(p) {
        const data = {
            id: postId,
            action: 'down_vote'
        };
        axios.post('http://127.0.0.1:8000/api/post/action', data, config).then(function (response) {
            setPoints(points + p);
            console.log('down');
        })
            .catch(function (error) {
                if (error.response.status === 403) {
                    showPopup();
                }
            });
    }
    function closePostPopup() {
        if (!props.onClosePost) return;
        props.onClosePost(postId, points);
    }

    const [color, setColor] = useState({})
    function handleGetColor(color){
        setColor(color);
    }
    return (
        <div className="Sub-Community">
            <div id="background" className="black-background" onClick={closePostPopup}>
            </div>
            <div id="post-popup" className="post-container container-post">
                <div className="block-post ">
                    <div className="container-scroll " id="overlayScrollContainer"  style={{backgroundColor: color.background_color}}>
                        <div className="post-title-bar-container  " tabIndex={-1}  style={{backgroundColor: color.title_background_color, color: color.button_text_color}}>
                            <div className="post-title-bar-block ">
                                <div className="post-title-container">
                                    <div className="points-block post-points-title-block post-points-title-container" id="vote-arrows-t3_iz99vh">
                                        <button aria-label="upvote" aria-pressed="false" className="voteButton" data-click-id="upvote" onClick={onClickUpVote}>
                                            <span className="upvote-caret-block upvote-caret upvote-container upvote-container-block">
                                                <i id={"upvote_detail_" + postId} className={voteStatus === 1 ? "fa fa-caret-up upvote-block-position active" : "fa fa-caret-up upvote-block-position"} />
                                            </span>
                                        </button>
                                        <div id={"point_detail_" + postId} className={voteStatus === 1 || voteStatus === -1 ? "points points-title point-active" : "points points-title"} style={{ color: '#0d0d0d' }}>
                                            {points}</div>
                                        <button aria-label="downvote" aria-pressed="false" className="voteButton" data-click-id="downvote" onClick={onClickDownVote}>
                                            <span className="downvote-caret-block downvote-caret downvote-container downvote-container-block">
                                                <i id={"downvote_detail_" + postId} className={voteStatus === -1 ? "fa fa-caret-down downvote-position active" : "fa fa-caret-down downvote-position"} />
                                            </span>
                                        </button>
                                    </div>
                                    {
                                        postDetail.type === 'image' ?
                                            <i className="fa fa-file-image-o  post-type" />
                                            : postDetail.type === 'url' ?
                                                <i className="fa fa-link  post-type" />
                                                : <i className="fa fa-file-text post-type" />
                                    }

                                    <div className="post-title-bar t3_iz99vh">
                                        <div className="title-post-block title-post-position ">
                                            <div className="title-post-format  title-post-position" >
                                                <h1 className="title-post-text">{postDetail.title}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="close-post-block"><button className="_1McO-Omm_mC2bkTnVgD6NV close-post-btn " title="Close" aria-label="Close" onClick={closePostPopup}><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <polygon fill="inherit" points="11.649 9.882 18.262 3.267 16.495 1.5 9.881 8.114 3.267 1.5 1.5 3.267 8.114 9.883 1.5 16.497 3.267 18.264 9.881 11.65 16.495 18.264 18.262 16.497">
                                    </polygon>
                                </svg><span className="close-post-text">Close</span></button></div>
                            </div>
                        </div>
                        <div tabIndex={-1} className="post-body-container" >
                            <div className="row">
                                <div className="col-lg-8 col-md-7 col-sm-12">
                                    <div className="post-article-container">
                                        <div tabIndex={0} />
                                        <div className="post-article-block" style={{backgroundColor: color.post_background_color, color: color.text_color}}>
                                            <div className="post-content-container  Post t3_iz99vh " id="t3_iz99vh" tabIndex={-1} data-testid="t3_iz99vh">
                                                <Contents state={postDetail} cmtCount={countComment} color={color} />
                                            </div>
                                            <CommentContainer postId={postId} user={postDetail.user} cookie={props.cookie} isAuthed={props.isAuthed} cmtCount={countComment} color={color}/>
                                        </div>
                                    </div>
                                </div>
                                <SideBarCommunity community={postDetail.community} onGetColor={handleGetColor}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}

export default Post;