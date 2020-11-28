import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CommentForm from './CommentForm';
import axios from 'axios';
import TimeAgo from 'react-timeago';

Comment.propTypes = {
    checkVoteComment: PropTypes.func,
};

Comment.defaultProps = {
    checkVoteComment: null
}

function Comment(props) {

    function showPopup() {
        document.getElementById('id01').style.display = 'block';

        document.getElementById('form-register').display = 'none';
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('btn-reg-tab').classList.remove('active');
        document.getElementById('btn-login-tab').classList.add('active');

    };

    // state để set active class cho nút toggle comment
    const [active, setActive] = useState(true);
    // state để lấy ra id của comment đang muốn reply
    const [currentCmtId, setCurrentCmtId] = useState(props.id);
    const [commentReplyList, setCommentReplyList] = useState([]);

    function collapseThisForm() {
        var thisForm = document.getElementById("replyComment" + props.id);
        thisForm.classList.remove('show');
    }
    function collaspAllFormOther() {
        var otherForm = document.getElementsByClassName('replyComment');
        var thisForm = document.getElementById("replyComment" + props.id);
        for (var i = 0; i < otherForm.length; i++) {
            otherForm[i].classList.remove('show');
        }
        // thisForm.classList.add('show');
    }
    //toggle dấu + -
    function toggleClass() {
        setActive(!active);
    };
    
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
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    var config = {}
    if(props.isAuthed){
        config = {
            headers: { Authorization: `Bearer ${getCookie('token')}` },
            cancelToken: source.token
        };        
    }

    else{
        config = {
            headers: {'Content-Type': 'text/plain', },
            cancelToken: source.token
        };        
    }
    const [commentParent, setCommentParent] = useState(1);
    async function fecthRelyComment(cmtId) {
        axios.get(`http://127.0.0.1:8000/api/comment/parent/${cmtId}`, config).then(res => {
            // console.log('reply comments của ' + props.content);
            // console.log(res.data.results)
            setCommentReplyList( res.data.results);
            setCommentParent(cmtId);
        }).catch(function (error) {
            console.log(error);
            console.log('lỗi lấy comment parent');
        });
    }

    async function handleCommentSubmit(values) {
        collapseThisForm();
        const data = {
            content: values.content
        }
        axios.post(`http://127.0.0.1:8000/api/comment/child/create/${values.parentId}`, data, config).then(function (response) {
            setCurrentCmtId(response.data.id);
            console.log(response.data);
            setCommentReplyList([...commentReplyList, response.data])
        })
            .catch(function (error) {
                // if (error.response.status === 403) {
                //     showPopup();
                // }
                console.log(error)
                console.log('lỗi tạo cmt child');
            });
    }
    // useEffect(()=>{
    //     console.log(commentReplyList);
    // },[commentReplyList])


    function getReplies() {
        
        if (!Array.isArray(commentReplyList))
            return null;
        return commentReplyList.map(comment => (
            <Comment
                key={comment.id}
                id={comment.id}
                user={comment.username}
                content={comment.content}
                upvote={comment.up_vote}
                downvote={comment.down_vote}
                isAuthed={props.isAuthed}
                timestamp={comment.timestamp}
                level={props.level + 1}
                parent={commentParent}
            />
        ))
    }

    const [commentPoint, setCommentPoint] = useState(props.upvote - props.downvote)
    const [commentPointStatus, setCommentPointStatus] = useState(0); // -1: down, 0: none, 1: up
    async function handleCheckCommentVote(id) {
        const data = {
            id: id
        };
        axios.post('http://127.0.0.1:8000/api/comment/check/vote', data, config).then(function (response) {
            if(response.data[0]==="up_vote"){
                // document.getElementById("comment-up-" + id).classList.add('active');
                // document.getElementById("comment-down-" + id).classList.remove('active');
                setCommentPointStatus(1);
            }
            else if(response.data[0]==="down_vote"){
                // document.getElementById("comment-down-" + id).classList.add('active');
                // document.getElementById("comment-up-" + id).classList.remove('active');
                setCommentPointStatus(-1);
            }
            else{
                // document.getElementById("comment-up-" + id).classList.remove('active');
                // document.getElementById("comment-down-" + id).classList.remove('active');
                setCommentPointStatus(0);
            }


        })
            .catch(function (error) {
                console.log(error);
            });
    }
    useEffect(() => {
        fecthRelyComment(currentCmtId);
        // console.log('reply comments của ' + props.content);
        // console.log(commentReplyList)
        return () => {
            source.cancel();
        };
    }, []);
    useEffect(() =>{
        handleCheckCommentVote(props.id);
    }, [])


    function onClickUpVoteComment(){
        if (props.isAuthed) {
            // if(document.getElementById("comment-up-"+props.id).classList.contains('active')){
            //     document.getElementById("comment-up-"+props.id).classList.remove('active');
            //     handleUpVoteComment(-1);
            // }
            // else if(document.getElementById("comment-down-"+props.id).classList.contains('active')){
            //     document.getElementById("comment-down-"+props.id).classList.toggle('active');
            //     document.getElementById("comment-up-"+props.id).classList.toggle('active');
            //     handleDownVoteComment(0);
            //     handleUpVoteComment(2);
            // }
            // else{
            //     document.getElementById("comment-up-"+props.id).classList.toggle('active');
            //     handleUpVoteComment(1);
            //}
            if(commentPointStatus === 1){
                setCommentPointStatus(0);
                handleUpVoteComment(-1);
            }
            else if(commentPointStatus===-1){
                setCommentPointStatus(1);
                handleDownVoteComment(0);
                handleUpVoteComment(2);
            }
            else if(commentPointStatus===0){
                console.log("comment tus = 0");
                setCommentPointStatus(1);
                handleUpVoteComment(1);
            }
        }
        else
            showPopup();
    }

    function onClickDownVoteComment(){
        if(props.isAuthed){
            // if(document.getElementById("comment-down-"+props.id).classList.contains('active')){
            //     document.getElementById("comment-down-"+props.id).classList.remove('active');
            //     handleDownVoteComment(1);
            // }
            // else if(document.getElementById("comment-up-"+props.id).classList.contains('active')){
            //     document.getElementById("comment-up-"+props.id).classList.toggle('active');
            //     document.getElementById("comment-down-"+props.id).classList.toggle('active');
            //     handleUpVoteComment();
            //     handleDownVoteComment(-2);
            // }
            // else{
            //     handleDownVoteComment(-1);
            //     document.getElementById("comment-down-"+props.id).classList.toggle('active');
            // }
            if(commentPointStatus === -1){
                setCommentPointStatus(0);
                handleDownVoteComment(1);
            }
            else if(commentPointStatus===1){
                setCommentPointStatus(-1);
                handleUpVoteComment(0);
                handleDownVoteComment(-2);
            }
            else{
                setCommentPointStatus(-1);
                handleDownVoteComment(-1);
            }
        }
        else
            showPopup();
    }


    function handleUpVoteComment(p) {
        if (props.isAuthed) {
            const data = {
                id: props.id,
                action: 'up_vote'
            }
            axios.post(`http://127.0.0.1:8000/api/comment/action`, data, config).then(function (response) {
                setCommentPoint( commentPoint + p);
                console.log("up cmt");
                return;
            })
                .catch(function (error) {
                    if (error.response.status === 403) {
                        showPopup();
                    }
                    console.log('lỗi upvote comment');
                    console.log(error.response)
                });
        }
        else
            showPopup();
    }
    function handleDownVoteComment(p) {
        if (props.isAuthed) {
            const data = {
                id: props.id,
                action: 'down_vote'
            }
            axios.post(`http://127.0.0.1:8000/api/comment/action`, data, config).then(function (response) {
                setCommentPoint( commentPoint + p);
                console.log("down cmt");
            })
                .catch(function (error) {
                    if (error.response.status === 403) {
                        showPopup();
                    }
                    console.log('lỗi downvote comment');
                });
        }
        else
            showPopup();
    }


    return (
        <div className="media">
            <div className="media-heading">
                <button onClick={toggleClass} className="btn btn-default btn-xs" type="button" data-toggle="collapse" data-target={"#collapseLevel-" + props.id} aria-expanded="true" aria-controls="collapseExample">
                    <i className={active ? "fa fa-minus expand" : "fa fa-plus expand "} aria-hidden="true" />
                </button>
                {/* <span id={"comment-" + props.id} className="badge badge-warning">
                    {commentPoint}
                </span> */}
                 <a href={"/user/"+props.user}><strong style={{color: "#AAAAAA"}}>{props.user}</strong></a> • <i className="fa fa-clock-o"></i> {<TimeAgo date={new Date(props.timestamp)} />} 
            </div>
            <div className="panel-collapse collapse in show" id={"collapseLevel-" + props.id}>
                <div className="media-left">
                    <div className="vote-wrap">
                        <div className="vote_up" onClick={onClickUpVoteComment}>
                            <i id={"comment-up-"+ props.id} className={commentPointStatus===1? "fa fa-caret-up active":"fa fa-caret-up"} aria-hidden="true" />
                        </div>
                        <div id={"point_detail_" + props.id} className={commentPointStatus === 1 || commentPointStatus === -1 ? "points points-title p-comment point-active" : "points points-title p-comment"}>
                                            {commentPoint}</div>
                        <div className="vote_down" onClick={onClickDownVoteComment}>
                            <i id={"comment-down-"+ props.id} className={commentPointStatus===-1? "fa fa-caret-down active":"fa fa-caret-down" } aria-hidden="true" />
                        </div>
                    </div>
                    {/* vote-wrap */}
                </div>
                {/* media-left */}
                <div className="media-body">
                    <p>{props.content}</p>
                    {props.isAuthed?
                        <div className="comment-meta">
                            {/* <span><a href="#">delete</a></span>
                            <span><a href="#">report</a></span>
                            <span><a href="#">hide</a></span> */}
                            <span>
                                <a role="button" data-toggle="collapse" href={"#replyComment" + props.id} aria-expanded="true" aria-controls="collapseExample" onClick={collaspAllFormOther}> <i className="fa fa-reply"></i> Reply</a>
                            </span>
                            <div className="replyComment collapse" id={"replyComment" + props.id}>
                                <CommentForm onSubmit={ handleCommentSubmit} parentId={ props.level>6? props.parent:props.id} isAuthed={props.isAuthed}/>
                            </div>
                        </div>
                    :null}
                    
                    {/* comment-meta */}
                    {/* {commentReplyList && commentReplyList.length ? <a className="showComment">View comment</a> : null} */}
                    {getReplies(props.id)}
                    
                </div>
            </div>
        </div>
    );
}

export default Comment;