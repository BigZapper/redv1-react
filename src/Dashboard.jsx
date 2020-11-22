import React, { useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
import TrendingBar from './components/header/TrendingBar';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PostNewsFeed from './components/body/newsfeed/PostNewsFeed';
import Post from './components/post/Post';
import SideBar from './components/body/SideBar';
import Edit from './components/profile/Edit';
// import ImageUpload from './components/profile/ImageUpload';
import AvatarEdit from './components/profile/AvatarEdit';
import Loader from 'react-loader-spinner';
import Popup from "reactjs-popup";
import { useCookies } from 'react-cookie';
import InfiniteScroll from "react-infinite-scroll-component";



Dashboard.propTypes = {

};

function Dashboard(props) {
    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const [filterPost, setFilterPost] = useState(0); // 0: submited, 1: commented, 2: upvoted, 3: downvoted
    let { username } = useParams();

    const [loggedUser, setLoggedUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const configU = {
        headers: { Authorization: `Bearer ${cookies.token}` },
        cancelToken: source.token
    };
    function checkLogin() {

        axios.get('http://127.0.0.1:8000/api/profile', configU).then(res => {
            if (res.status === 200) {
                setLoggedUser(res.data.results[0]);
                setIsLogged(true);
            }
        }).catch(function (error) {
        });
    }

    var config = {
        headers: { 'Content-Type': 'text/plain' },
        cancelToken: source.token
    }
    if (isLogged) {
        config = {
            headers: { Authorization: `Bearer ${cookies.token}` },
            cancelToken: source.token
        };
    }

    // else {
    //     config = {};
    // }
    const [detailUser, setDetailUser] = useState({});
    const [loadingUser, setLoadingUser] = useState(false);
    function getUser() {
        setLoadingUser(true);
        console.log(config);
        axios.get(`http://127.0.0.1:8000/api/profile/${username}`, config).then(res => {
            if (res.status === 200) {
                console.log(res.data.results[0])
                setDetailUser({
                    first_name: res.data.results[0].first_name,
                    last_name: res.data.results[0].last_name,
                    id: res.data.results[0].id,
                    location: res.data.results[0].location,
                    bio: res.data.results[0].bio,
                    follower_count: res.data.results[0].follower_count,
                    following_count: res.data.results[0].following_count,
                    is_following: res.data.results[0].is_following,
                    username: res.data.results[0].username,
                    background: res.data.results[0].background,
                    avatar: res.data.results[0].avatar,
                    timestamp: res.data.results[0].timestamp,
                    email: res.data.results[0].email
                });
                setLoadingUser(false);
            }
        }).catch(function (error) {
        });
    }


    // const [count, setCount] = useState({
    //     posts: 0,
    //     comments: 0,
    //     votes: 0
    // });
    const [countPost, setCountPost] = useState(0);
    const [countComment, setCountComment] = useState(0);
    const [countVote, setCountVote] = useState(0);
    const [loadingCountPost, setLoadingCountPost] = useState(false);
    const [loadingCountComment, setLoadingCountComment] = useState(false);
    const [loadingCountVote, setLoadingCountVote] = useState(false);
    function getCountPost() {
        setLoadingCountPost(true);
        axios.get(`http://127.0.0.1:8000/api/post/count/user/${username}`, config).then(res => {
            if (res.status === 200) {
                setCountPost(res.data.Total);
                setLoadingCountPost(false);
            }
        }).catch(function (error) {
            setLoadingCountPost(false);
        });
        // let countPost = `http://127.0.0.1:8000/api/post/count/user/${username}`;
        // let countComment = `http://127.0.0.1:8000/api/comment/count/${username}`;
        // let countVoted = `http://127.0.0.1:8000/api/post/vote/count/user/${username}`;
        // const requestPost = axios.get(countPost);
        // const requestComment = axios.get(countComment);
        // const requestVoted = axios.get(countVoted);
        // axios.all([requestPost, requestComment, requestVoted], config).then(axios.spread((...responses) => {
        //     if (responses[0].status === 200 && responses[1].status === 200 && responses[2].status === 200) {
        //         setCount({
        //             posts: responses[0].data.Total,
        //             comments: responses[1].data.Total,
        //             votes: responses[2].data.Total,
        //         });
        //         setLoadingCountPost(false);
        //     }
        //     if(responses[0].status === 200){

        //     }

        //     // use/access the results 
        // })).catch(function (error) {
        //     setLoadingCountPost(false);
        // });
    }
    function getCountComment() {
        setLoadingCountComment(true);
        axios.get(`http://127.0.0.1:8000/api/comment/count/${username}`, config).then(res => {
            if (res.status === 200) {
                setCountComment(res.data.Total);
                setLoadingCountComment(false);
            }
        }).catch(function (error) {
            setLoadingCountComment(false);
        });
    }
    function getCountVote() {
        setLoadingCountVote(true);
        axios.get(`http://127.0.0.1:8000/api/post/vote/count/user/${username}`, config).then(res => {
            if (res.status === 200) {
                setCountVote(res.data.Total);
                setLoadingCountVote(false);
            }
        }).catch(function (error) {
            setLoadingCountVote(false);
        });
    }
    const [postList, setPostList] = useState([]);
    const [loadingPost, setLoadingPost] = useState(false);
    function getSubmitedPosts() {
        setLoadingPost(true);
        axios.get(`http://127.0.0.1:8000/api/post/user/${username}`, config).then(res => {
            if (res.status === 200) {
                setFilterPost(0);
                setPostList(res.data.results);
                setLoadingPost(false);
            }
        }).catch(function (error) {
        });
    }
    function getCommentedPosts() {
        setLoadingPost(true);
        axios.get(`http://127.0.0.1:8000/api/post/comment/${username}`, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                setFilterPost(1);
                setPostList(res.data.results);
                setLoadingPost(false);
            }
        }).catch(function (error) {
        });
    }
    function getUpvotedPosts() {
        setLoadingPost(true);
        axios.get(`http://127.0.0.1:8000/api/post/up_vote/${username}`, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                setFilterPost(2);
                setPostList(res.data.results);
                setLoadingPost(false);
            }
        }).catch(function (error) {
        });
    }
    function getDownvotedPosts() {
        setLoadingPost(true);
        axios.get(`http://127.0.0.1:8000/api/post/down_vote/${username}`, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                setFilterPost(3);
                setPostList(res.data.results);
                setLoadingPost(false);
            }
        }).catch(function (error) {
        });
    }


    const [nextPosts, setNextPosts] = useState([]);
    const [page, setPage] = useState(2);
    const [isEnd, setIsEnd] = useState(false);
    function onLoadMore(page) {
        if (filterPost === 0) {
            axios.get(`http://127.0.0.1:8000/api/post/user/${username}?page=${page}`).then(res => {
                setNextPosts(res.data.results);
                // console.log(res.data.results)

            }).catch(function (error) {
                if (error.response.status === 404)
                    setIsEnd(true);
            });
        }
        else if(filterPost === 1){
            axios.get(`http://127.0.0.1:8000/api/post/comment/${username}?page=${page}`).then(res => {
                setNextPosts(res.data.results);
                // console.log(res.data.results)

            }).catch(function (error) {
                if (error.response.status === 404)
                    setIsEnd(true);
            });
        }
        else if(filterPost === 2){
            axios.get(`http://127.0.0.1:8000/api/post/up_vote/${username}?page=${page}`).then(res => {
                setNextPosts(res.data.results);
                // console.log(res.data.results)

            }).catch(function (error) {
                if (error.response.status === 404)
                    setIsEnd(true);
            });
        }
        else if(filterPost === 3){
            axios.get(`http://127.0.0.1:8000/api/post/down_vote/${username}?page=${page}`).then(res => {
                setNextPosts(res.data.results);
                // console.log(res.data.results)

            }).catch(function (error) {
                if (error.response.status === 404)
                    setIsEnd(true);
            });
        }

    }


    useEffect(() => {
        if (typeof nextPosts !== 'undefined' && nextPosts.length > 0)
            setPostList([...postList, ...nextPosts]);
    }, [nextPosts])

    function fetchMoreData() {
        setPage(page + 1);
        setTimeout(() => {
            onLoadMore(page);
            // if (typeof nextPosts !== 'undefined' && nextPosts.length > 0)
            //     setPostList([...postList, ...nextPosts]);
        }, 2000);
    }

    console.log(postList);

    useEffect(() => {
        checkLogin();
    }, [])
    useEffect(() => {
        getUser();
        getCountPost();
        getCountVote();
        getCountComment();
        getSubmitedPosts();
        return () => {
            source.cancel();
        };
    }, [isLogged])

    useEffect(() => {
        setIsFollow(detailUser.is_following)
    }, [detailUser.is_following])

    const [postDetail, setPostDetail] = useState({});
    const [isShowPost, setIsShowPost] = useState(false);
    const [pointsChanged, setPointsChanged] = useState({
        id: null,
        points: null
    });
    function closePost(id, points) {
        setIsShowPost(false);
        setPointsChanged({
            id: id,
            points: points
        });
    }
    function handleClickPost(detail) {
        setPostDetail({
            postId: detail.postId,
            user: detail.user,
            type: detail.type,
            image: detail.image,
            avatar: detail.avatar,
            background: detail.background,
            upVotes: detail.upVotes,
            downVotes: detail.downVotes,
            content: detail.content,
            community: detail.community,
            isAuthed: props.isAuthed
        });
        setIsShowPost(true);
    }

    function getDateCreated() {
        var date = new Date(detailUser.timestamp);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        date = dd + '/' + mm + '/' + yyyy;
        return date;
    }
    const [inHoverAvatar, setHoverAvatar] = useState(false);

    const [inHoverFollow, setInHoverFollow] = useState(false);
    const [isFollow, setIsFollow] = useState();
    function handleFollow() {
        const data = {
            id: detailUser.id,
            action: "follow"
        }
        axios.post(`http://127.0.0.1:8000/api/profile/action/`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                setIsFollow(true);
            }
        }).catch(function (error) {
        });

    }
    function handleUnfollow() {
        const data = {
            id: detailUser.id,
            action: "un_follow"
        }
        axios.post(`http://127.0.0.1:8000/api/profile/action/`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                setIsFollow(false);
            }
        }).catch(function (error) {
        });
    }
    return (
        <div>
            <TrendingBar />
            <div className="container clearfix">
                {/* {isShowEdit ? <Edit /> : null} */}
                {isShowPost ? <Post detail={postDetail} cookie={props.cookie} isAuthed={props.isAuthed} onClosePost={closePost} /> : null}
                <div className="row">
                    <div id="maincontent" className="full-width col-md-8">
                        <div className="page-user">
                            {
                                loadingUser
                                    ?
                                    <div className="loader">
                                        <Loader
                                            type="Oval"
                                            color="#00BFFF"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    :
                                    <div id="banner-dashboard">
                                        <div className="cover">
                                            <div className="cover-wrap">
                                                <img src={detailUser.background} alt="cover" />
                                                {
                                                    isLogged && loggedUser.username === detailUser.username ?
                                                        <Popup
                                                            modal
                                                            trigger={
                                                                <span className="trigger-edit-cover"> <i className="fa fa-camera e-cover" aria-hidden="true"></i></span>
                                                            }
                                                        >
                                                            {
                                                                close =>
                                                                    // <ImageUpload
                                                                    // first_name={detailUser.first_name}
                                                                    // last_name={detailUser.last_name}
                                                                    // bio={detailUser.bio}
                                                                    // email={detailUser.email}
                                                                    // location={detailUser.location}
                                                                    // avatar={detailUser.avatar}
                                                                    // close={close}
                                                                    // />
                                                                    <AvatarEdit
                                                                        type="cover"
                                                                        first_name={detailUser.first_name}
                                                                        last_name={detailUser.last_name}
                                                                        bio={detailUser.bio}
                                                                        email={detailUser.email}
                                                                        // avatar={detailUser.avatar}
                                                                        // background={detailUser.background}
                                                                        location={detailUser.location}
                                                                        close={close}
                                                                    />
                                                            }
                                                        </Popup>
                                                        : null
                                                }
                                            </div>

                                        </div>
                                        <div className="container community-bar">
                                            <div id="community">
                                                <div className="avatar-wrap" onMouseEnter={() => setHoverAvatar(true)} onMouseLeave={() => setHoverAvatar(false)}>
                                                    <img src={detailUser.avatar} alt="avatar" className="avatar" />
                                                    {
                                                        isLogged && loggedUser.username === detailUser.username ?
                                                            <Popup
                                                                modal
                                                                trigger={
                                                                    < div id="edit-avatar" className={inHoverAvatar === false ? "trigger-edit" : "trigger-edit show"}>
                                                                        <i className="fa fa-camera" aria-hidden="true"></i>
                                                                    </div>
                                                                }
                                                            >
                                                                {
                                                                    close =>
                                                                        // <ImageUpload
                                                                        // first_name={detailUser.first_name}
                                                                        // last_name={detailUser.last_name}
                                                                        // bio={detailUser.bio}
                                                                        // email={detailUser.email}
                                                                        // location={detailUser.location}
                                                                        // avatar={detailUser.avatar}
                                                                        // close={close}
                                                                        // />
                                                                        <AvatarEdit
                                                                            type="avatar"
                                                                            first_name={detailUser.first_name}
                                                                            last_name={detailUser.last_name}
                                                                            bio={detailUser.bio}
                                                                            email={detailUser.email}
                                                                            location={detailUser.location}
                                                                            close={close}
                                                                        />
                                                                }
                                                            </Popup>
                                                            : null
                                                    }
                                                </div>
                                                <div className="community-title-block">
                                                    <div className="community-text">
                                                        <h1 className="community-title">
                                                            {detailUser.first_name + " " + detailUser.last_name}
                                                        </h1>
                                                        {
                                                            isLogged && loggedUser.username === detailUser.username
                                                                ?
                                                                <Popup modal trigger={<span className="edit-profile"> <i className="fa fa-pencil" aria-hidden="true"></i></span>}>
                                                                    {
                                                                        close =>
                                                                            <Edit
                                                                                first_name={detailUser.first_name}
                                                                                last_name={detailUser.last_name}
                                                                                bio={detailUser.bio}
                                                                                email={detailUser.email}
                                                                                location={detailUser.location}
                                                                                cookie={props.cookie}
                                                                                close={close}
                                                                            />
                                                                    }
                                                                </Popup>
                                                                // <span onClick={e => { handleEditProfile(); e.preventDefault() }} className="edit-profile"> <i className="fa fa-cog" aria-hidden="true"></i></span>
                                                                :
                                                                null
                                                        }
                                                        <h2 className="community-ref"> @{detailUser.username}</h2>
                                                        <p> {detailUser.bio}</p>
                                                        <h2 className="community-ref inline"> <i className="fa fa-location-arrow" aria-hidden="true"></i> From {detailUser.location}</h2>
                                                        <h2 className="community-ref inline"> <i className="fa fa-calendar" aria-hidden="true"></i> Joined {getDateCreated()}</h2>
                                                        <h2 className="community-ref inline"> <i className="fa fa-envelope" aria-hidden="true"></i> Email {detailUser.email}</h2>
                                                    </div>

                                                </div>
                                                {
                                                    isLogged === false || loggedUser.username === detailUser.username ?
                                                        null
                                                        : isLogged === true ?
                                                            isFollow === true ?
                                                                <div className="community-button">
                                                                    <button type="button" onClick={handleUnfollow} className={inHoverFollow === false ? "btn btn-warning" : "btn btn-danger"} onMouseEnter={() => setInHoverFollow(true)} onMouseLeave={() => setInHoverFollow(false)}>{inHoverFollow === false ? "Following" : "Unfollow"}</button>
                                                                </div>
                                                                :
                                                                <div className="community-button">
                                                                    <button type="button" className="btn btn-primary" onClick={handleFollow}>Follow</button>
                                                                </div>
                                                            : null
                                                }

                                            </div>
                                        </div>
                                    </div>
                            }

                            <div className="profile-tabs">
                                <div className="warrior-tab post-lists">
                                    <div id="fullwidth">
                                        <article className="post-9 page type-page status-publish hentry">
                                            <div className="post-lists">
                                                {/* <div className="widget about-profile-widget">
                                                    <div className="thumbnail">
                                                        <img src="http://demo2.themewarrior.com/upvote/wp-content/uploads/sites/19/2020/05/34-upvotedemo-IMG-20200530-WA0017-150x150.jpg" alt="" /> </div>
                                                    <div className="detail">
                                                        <h4 className="widget-title"><span>{detailUser.username}</span></h4>
                                                        <p>Quote: {detailUser.bio}</p>
                                                        <p>Location: {detailUser.location}</p>
                                                        <p>Join Date: {<TimeAgo date={new Date(detailUser.timestamp)} />}</p>
                                                        <p>Email: {detailUser.email}</p>
                                                    </div>
                                                </div> */}
                                                <div className="statistic-widget">
                                                    <ul className="row column-2">
                                                        <li className="column">
                                                            <div className="inner">
                                                                <h4 className="widget-title"><span>Submitted</span></h4>
                                                                <div className="statistic-number">
                                                                    {
                                                                        loadingCountPost
                                                                            ?
                                                                            <Loader
                                                                                type="Bars"
                                                                                color="#00BFFF"
                                                                                height={50}
                                                                                width={50}
                                                                                timeout={3000}
                                                                            />
                                                                            :
                                                                            countPost
                                                                    }
                                                                </div>
                                                                <h4 className="widget-title"><span>Posts</span></h4>
                                                            </div>
                                                        </li>
                                                        <li className="column">
                                                            <div className="inner">
                                                                <h4 className="widget-title"><span>Wrote</span></h4>
                                                                <div className="statistic-number">
                                                                    {
                                                                        loadingCountComment
                                                                            ?
                                                                            <Loader
                                                                                type="Bars"
                                                                                color="#00BFFF"
                                                                                height={50}
                                                                                width={50}
                                                                                timeout={3000}
                                                                            />
                                                                            :
                                                                            countComment
                                                                    }
                                                                </div>
                                                                <h4 className="widget-title"><span>Comments</span></h4>
                                                            </div>
                                                        </li>
                                                        <li className="column">
                                                            <div className="inner">
                                                                <h4 className="widget-title"><span>Voted</span></h4>
                                                                <div className="statistic-number">
                                                                    {
                                                                        loadingCountVote
                                                                            ?
                                                                            <Loader
                                                                                type="Bars"
                                                                                color="#00BFFF"
                                                                                height={50}
                                                                                width={50}
                                                                                timeout={3000}
                                                                            />
                                                                            :
                                                                            countVote
                                                                    }
                                                                </div>
                                                                <h4 className="widget-title"><span>Posts</span></h4>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="profile-tabs">
                                                <div className="warrior-tab post-lists">
                                                    <div className="warrior-tab-nav clearfix">
                                                        <ul>
                                                            <li className={filterPost === 0 ? "filter-post active" : "filter-post"}><a href="# " data-content="#links" onClick={e => { getSubmitedPosts(); e.preventDefault() }}>Submitted</a></li>
                                                            <li className={filterPost === 1 ? "filter-post active" : "filter-post"}><a href="# " data-content="#comments" onClick={e => { getCommentedPosts(); e.preventDefault() }}>Commented</a></li>
                                                            <li className={filterPost === 2 ? "filter-post active" : "filter-post"}><a href="# " data-content="#upvotes" onClick={e => { getUpvotedPosts(); e.preventDefault() }}>Upvoted</a></li>
                                                            <li className={filterPost === 3 ? "filter-post active" : "filter-post"}><a href="# " data-content="#downvotes" onClick={e => { getDownvotedPosts(); e.preventDefault() }}>Downvoted</a></li>
                                                        </ul>
                                                    </div>
                                                    <div className="warrior-tab-content">
                                                        <div id="links" className="dashboard-post-lists">
                                                            <div className="infinite-scroll">
                                                                {
                                                                    loadingPost
                                                                        ?
                                                                        <div className="loader">
                                                                            <Loader
                                                                                type="Puff"
                                                                                color="#00BFFF"
                                                                                height={100}
                                                                                width={100}
                                                                                timeout={3000}
                                                                            />
                                                                        </div>
                                                                        :
                                                                        <InfiniteScroll
                                                                            dataLength={postList.length}
                                                                            next={fetchMoreData}
                                                                            hasMore={!isEnd}
                                                                            loader={
                                                                                <div className="text-center">
                                                                                    <Loader
                                                                                        type="Oval"
                                                                                        color="#00BFFF"
                                                                                        height={50}
                                                                                        width={50}
                                                                                        timeout={3000}
                                                                                    />
                                                                                </div>
                                                                            }
                                                                        >
                                                                            {postList.map(post => (
                                                                                <PostNewsFeed
                                                                                    key={post.id}
                                                                                    postId={post.id}
                                                                                    type={post.type}
                                                                                    image={post.image}
                                                                                    user={post.user.username}
                                                                                    avatar={post.user.avatar}
                                                                                    background={post.user.background}
                                                                                    upVotes={post.up_vote}
                                                                                    downVotes={post.down_vote}
                                                                                    title={post.title}
                                                                                    content={post.content}
                                                                                    community={post.community_type}
                                                                                    timestamp={post.timestamp}
                                                                                    onClickPost={handleClickPost}
                                                                                    isAuthed={props.isAuthed}
                                                                                    showPost={isShowPost}
                                                                                    pointsChanged={pointsChanged}
                                                                                />
                                                                            ))}
                                                                        </InfiniteScroll>
                                                                }
                                                                {/* Start: Pagination */}
                                                                {/* <div className="pagination">
                                                                    <div className="wp-pagenavi" role="navigation">
                                                                        <span className="pages">Page 1 of 62</span><span aria-current="page" className="current">1</span><a className="page larger" title="Page 2" href="http://demo2.themewarrior.com/upvote/dashboard/page/2/">2</a><a className="page larger" title="Page 3" href="http://demo2.themewarrior.com/upvote/dashboard/page/3/">3</a><a className="page larger" title="Page 4" href="http://demo2.themewarrior.com/upvote/dashboard/page/4/">4</a><a className="page larger" title="Page 5" href="http://demo2.themewarrior.com/upvote/dashboard/page/5/">5</a><span className="extend">...</span><a className="larger page" title="Page 10" href="http://demo2.themewarrior.com/upvote/dashboard/page/10/">10</a><a className="larger page" title="Page 20" href="http://demo2.themewarrior.com/upvote/dashboard/page/20/">20</a><a className="larger page" title="Page 30" href="http://demo2.themewarrior.com/upvote/dashboard/page/30/">30</a><span className="extend">...</span><a className="nextpostslink" rel="next" href="http://demo2.themewarrior.com/upvote/dashboard/page/2/">»</a><a className="last" href="http://demo2.themewarrior.com/upvote/dashboard/page/62/">Last
                                »</a>
                                                                    </div>
                                                                </div> */}
                                                                {/* End: Pagination */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div> {/* END: .post-lists */}
                                    {/* START: Respond */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <SideBar cookie={props.cookie} isAuthed={props.isAuthed} />
                </div>
            </div>

        </div >
    );
}

export default Dashboard;