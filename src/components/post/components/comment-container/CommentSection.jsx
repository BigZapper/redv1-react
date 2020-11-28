import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';
import CommentForm from './CommentForm';
import axios from 'axios';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

CommentSection.propTypes = {

};


function CommentSection(props) {
    function showPopup() {
        document.getElementById('id01').style.display = 'block';

        document.getElementById('form-register').display = 'none';
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('btn-reg-tab').classList.remove('active');
        document.getElementById('btn-login-tab').classList.add('active');

    };

    const [cookies] = useCookies(['name']);
    // thêm state mỗi khi thêm comment ở bài viết sẽ thay đổi trạng thái
    const [postCmtClick, setPostCmtClick] = useState(false);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    var config = {}
    const [profile, setProfile] = useState(null);
    if (props.isAuthed) {
        config = {
            headers: { Authorization: `Bearer ${cookies.token}` },
            cancelToken: source.token
        };
    }

    else {
        config = {
            headers: { 'Content-Type': 'text/plain', },
            cancelToken: source.token
        };
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/profile', config).then(res => {
            console.log(res.data.results[0].username)
            if (res.status === 200) {
                setProfile(res.data.results[0].username);
            }
        }).catch(function (error) {
            console.log(error.response)
        });
    }, [props.isAuthed])

    // danh sách chứa comment của bài viết được server trả về
    const [commentList, setCommentList] = useState([]);
    // hàm xử lí khi nhấn submit một comment trên bài viết
    function handleCommentSubmit(values) {
        // console.log(props.cookie.token)
        const data = {
            id: values.postId,
            content: values.content
        }
        axios.post('http://127.0.0.1:8000/api/comment/create/', data, config).then(function (response) {
            // thay đổi state để re render component Comment
            setPostCmtClick(!postCmtClick);

            // Thêm comment vừa tạo vào danh sách comment
            setCommentList(...commentList, response.data[0].results);
        })
            .catch(function (error) {
                if (error.response.status === 403) {
                    showPopup();
                }
                console.log(error);
                console.log("Lỗi tạo comment trên post");
            });
    }

    // Hàm lấy các comment của post hiện tại từ server ra
    function fecthComment() {
        axios.get(`http://127.0.0.1:8000/api/comment/${props.postId}`, config).then(res => {
            setCommentList(res.data.results);
        }).catch(function (error) {
            console.log(error);
            console.log("Lỗi lấy comment của post hiện tại");
        });
    }

    // gọi lại hàm fecthComment khi click vào một post hoặc sau khi gửi comment trên post
    useEffect(() => {
        if (props.postId) {
            fecthComment();
            return () => {
                source.cancel();
            };
        }
    }, [props.postId, postCmtClick]);



    function handleCheckCommentVote(id) {
        const data = {
            id: id
        };
        axios.post('http://127.0.0.1:8000/api/comment/check/vote', data, config).then(function (response) {
            if (response.data[0] === "up_vote") {
                document.getElementById("comment-up-" + id).classList.add('active');
                document.getElementById("comment-down-" + id).classList.remove('active');
                // setCommentPointStatus(1);
            }
            else if (response.data[0] === "down_vote") {
                document.getElementById("comment-down-" + id).classList.add('active');
                document.getElementById("comment-up-" + id).classList.remove('active');
                // setCommentPointStatus(-1);
            }
            else {
                document.getElementById("comment-up-" + id).classList.remove('active');
                document.getElementById("comment-down-" + id).classList.remove('active');
                // setCommentPointStatus(0);
            }


        })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <div>
            {/* Khối comment editor */}
            <div className="post-comment-form-block-position post-comment-form-block">
                <div className="comment-as-block">
                    <span className="comment-as-text">Comment as <a className="name-user " href={"/user/" + profile + "/"}>{profile}</a>
                    </span>
                </div>
                {/* Component chứa form để comment */}
                <CommentForm onSubmit={handleCommentSubmit} postId={props.postId} isAuthed={props.isAuthed} color={props.color} />
                <div className="comments-nav">
                    <ul className="nav nav-pills">
                        <li role="presentation" className="dropdown">
                            <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                There are {props.cmtCount} comments <span className="caret" />
                            </a>
                            <ul className="dropdown-menu">
                                <li className="mb-2"><a href="#"><i class="fa fa-rocket filter-icon" aria-hidden="true"></i>{" " + "Best"}</a></li>
                                <li><a href="#"><i class="fa fa-fire filter-icon" aria-hidden="true">{" "}</i>Hot</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                {/* Kết thúc khối comment editor */}
            </div>
            {/* Khối danh sách comment */}
            <div className="comment-section-container comment-section-background" style={{ backgroundColor: props.color.post_background_color, color: props.color.text_color }}>
                <div>
                    <div className="comment-section-block ">
                        <div className="comment-section-wrapper">
                            {/* {postCmtClick?  <Comment id={tmpNewCmt.id} user={tmpNewCmt.username} content={tmpNewCmt.content} isNew={true}/>: null} */}
                            {!Array.isArray(commentList) ? null : commentList.map(comment => (
                                <Comment
                                    key={comment.id}
                                    id={comment.id}
                                    user={comment.username}
                                    content={comment.content}
                                    upvote={comment.up_vote}
                                    downvote={comment.down_vote}
                                    timestamp={comment.timestamp}
                                    isAuthed={props.isAuthed}
                                    level={1}

                                />
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentSection;