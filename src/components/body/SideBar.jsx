import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Post from '../post/Post';
import { useState } from 'react';
import { useEffect } from 'react';
import { ReactTinyLink } from 'react-tiny-link';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import NumericLabel from 'react-pretty-numbers';
import TextTruncate from 'react-text-truncate';
import Popup from "reactjs-popup";
import CreateCommunity from '../comunity/CreateCommunity';
import CreatePost from '../../CreatePost'


SideBar.propTypes = {

};

function SideBar(props) {
    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const [communityList, setCommunityList] = useState([]);
    const communityPreList = useRef([]);

    var config = {
        cancelToken: source.token
    };
    if (props.isAuthed) {
        config = {
            headers: { Authorization: `Bearer ${cookies.token}` },
            cancelToken: source.token
        };
    }



    const [postDetail, setPostDetail] = useState({});
    const [isShowPost, setIsShowPost] = useState(false);
    const [pointsChanged, setPointsChanged] = useState({
        id: null,
        points: null
    });
    function closePost(id, points, comments, views) {
        setIsShowPost(false);
        setPointsChanged({
            id: id,
            points: points,
            comments: comments,
            views: views
        });
    }
    function handleClickPost(detail) {
        setPostDetail({
            postId: detail.id,
            upVotes: detail.up_vote,
            downVotes: detail.down_vote,
            title: detail.title,
            content: detail.content,
            community: detail.community_type,
            isAuthed: props.isAuthed,
            type: detail.type,
            user: detail.user.username,
            image: detail.image
        });
        setIsShowPost(true);
    }




    function getListCommunity() {
        const data = { page_size: 5 }
        axios.post('http://127.0.0.1:8000/api/community/recommend', data, config).then(res => {
            if (res.status === 200) {
                setCommunityList(res.data.results);
            }
        }).catch(function (error) {
        });
    }

    const [trending, setTrending] = useState([]);
    function getTrendingPost() {
        const data = { page_size: 5 }
        axios.post('http://127.0.0.1:8000/api/post/trending/25', data, config).then(res => {
            if (res.status === 200) {
                http://127.0.0.1:8000/api/post/trending/
                setTrending(res.data.results);
            }
        }).catch(function (error) {
        });
    }
    const [recent, setRecent] = useState([]);
    function getRecentPost() {
        const data = { page_size: 5 }
        config = {
            headers: { 'Content-Type': 'application/json', },
        }
        axios.post('http://127.0.0.1:8000/api/post/recent', data, config).then(res => {
            if (res.status === 200) {
                setRecent(res.data.results);
            }
        }).catch(function (error) {
        });
    }
    useEffect(() => {
        getListCommunity();
        getTrendingPost();
        getRecentPost();
        return () => {
            source.cancel();
        };
    }, [props])
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const history = useHistory();
    function handleOnClickFormSubmit() {
        if (props.isAuthed) {
            history.push("/submit");
        }
        else
            alert('Chưa đăng nhập');
    }

    const [currentCommunity, setCurrentCommunity] = useState({
        community: '',
        is_joined: false
    })
    function handleFollow(community) {
        const data = {
            community: community,
            action: "follow"
        }
        axios.post(`http://127.0.0.1:8000/api/community/action`, data, config).then(res => {
            communityPreList.current = communityList;
            // console.log(res.data.results);
            if (res.status === 200) {
                setCurrentCommunity({
                    community: community,
                    is_joined: true
                })
            }
        }).catch(function (error) {
        });
    }
    function handleUnfollow(community) {
        const data = {
            community: community,
            action: "un_follow"
        }
        axios.post(`http://127.0.0.1:8000/api/community/action`, data, config).then(res => {
                communityPreList.current = communityList;
            // console.log(res.data.results);
            if (res.status === 200) {
                setCurrentCommunity({
                    community: community,
                    is_joined: false
                });
            }
        }).catch(function (error) {
        });
    }

    return (
        <div id="sidebar-general" className="col-lg-4 col-sm-12">
            {isShowPost ? <Post detail={postDetail} cookie={props.cookie} isAuthed={props.isAuthed} onClosePost={closePost} /> : null}
            <div id="widget-upvote_topic_communities-4" className="widget topics-communities-widget">
                <header className="section-title">
                    <h6 className="title"> RECOMMEND COMMUNITIES</h6>
                </header>
                <div className="communities">
                    <ul>
                        {
                            communityList.map(community => (
                                <li key={community.id}>
                                    <a href={"/community" + "/" + community.community_type} title={"View all posts in @" + community.community_type}>{capitalizeFirstLetter(community.community_type)}</a>
                                    {
                                        props.isAuthed === true ?
                                                <a onClick={() => handleFollow(community.community_type)} className="btn btn-primary join" href="# " role="button">{currentCommunity.community === community.community_type?"Joined":"Join"}</a>
                                                // :
                                                // currentCommunity.community === community.community_type ?
                                                //     <a onClick={() => handleUnfollow(community.community_type)} className="btn btn-outline-secondary join" href="# " role="button">Joined</a>
                                                // : <a onClick={() => handleFollow(community.community_type)} className="btn btn-outline-secondary joined" href="# " role="button">Joined</a>
                                            // :
                                            // <a
                                            //     id={community.community_type}
                                            //     href="# "
                                            //     role="button"
                                            //     className={"btn btn-primary joined"}
                                            //     onMouseEnter={() => setInHoverJoined(true)}
                                            //     onMouseLeave={() => setInHoverJoined(false)}
                                            //     className={inHoverJoined === true ? "btn btn-primary leave" : "btn btn-primary joined"}
                                            // >{"Joined"}</a>
                                            : null
                                    }
                                </li>
                            ))
                        }
                    </ul>
                    <button type="button" className="btn btn-primary btn-block">VIEW ALL</button>
                </div>
            </div>
            <div id="widget-upvote_trending_topic-2" className="widget recent-widget upvote_trending_topic">
                <header className="section-title">
                    <h6 className="title"> Trending topic</h6>
                </header>
                <div className="recents">
                    <ul>
                        {trending.map(post => (
                            <li key={post.id}>
                                {
                                    post.type === 'image' ?
                                        <article onClick={e => { handleClickPost(post); e.preventDefault() }} className="hentry trending-posts post-3877 topic type-topic status-publish format-standard has-post-thumbnail topic_category-@Technology topic_tag-social-media">
                                            <div className="thumbnail-small open-post">
                                                <a rel="nofollow" href="# " title={post.title} alt={post.title}>
                                                    <img src={"http://127.0.0.1:8000" + post.image} className="attachment-thumbnail size-thumbnail wp-post-image" alt={post.title} title={post.title} /> </a>
                                            </div>
                                            <h3 className="post-title open-post">
                                                <a rel="nofollow" className="sidebar-title" href="# " target="_blank" title={post.title} alt={post.title}>
                                                    <TextTruncate
                                                        line={2}
                                                        element="p"
                                                        truncateText="…"
                                                        text={post.title}
                                                    />
                                                </a>
                                                <div><a href="# " className="subject" target="_blank"><i className="fa fa-eye mr-1"></i>{<NumericLabel params={{ currency: false, commafy: true, shortFormat: true, justification: 'L' }}>{post.view_count}</NumericLabel>}</a></div>
                                                <div><a href={"/community/" + post.community_type} className="subject" target="_blank">{"@" + post.community_type}</a></div>
                                            </h3>
                                        </article>
                                        : post.type === 'url' ?
                                            <article onClick={e => { handleClickPost(post); e.preventDefault() }} className="hentry trending-posts post-3877 topic type-topic status-publish format-standard has-post-thumbnail topic_category-@Technology topic_tag-social-media">
                                                <div className="thumbnail-small open-post">
                                                    {/* <a rel="nofollow" href="# " title={post.title} alt={post.title}> */}
                                                    <ReactTinyLink
                                                        cardSize="small"
                                                        showGraphic={true}
                                                        maxLine={1}
                                                        minLine={1}
                                                        url={post.content}
                                                    />
                                                    {/* </a> */}
                                                </div>
                                                <h3 className="post-title open-post">
                                                    <a rel="nofollow" className="sidebar-title" href="# " target="_blank" title={post.title} alt={post.title}>
                                                        <TextTruncate
                                                            line={2}
                                                            element="p"
                                                            truncateText="…"
                                                            text={post.title}
                                                        />
                                                    </a>
                                                    <div><a href="# " className="subject" target="_blank"><i className="fa fa-eye mr-1"></i>{<NumericLabel params={{ currency: false, commafy: true, shortFormat: true, justification: 'L' }}>{post.view_count}</NumericLabel>}</a></div>
                                                    <div><a href={"/community/" + post.community_type} className="subject" target="_blank">{"@" + post.community_type}</a></div>
                                                </h3>
                                            </article>
                                            :
                                            <article onClick={e => { handleClickPost(post); e.preventDefault() }} className="hentry trending-posts post-3877 topic type-topic status-publish format-standard has-post-thumbnail topic_category-@Technology topic_tag-social-media">
                                                <div className="thumbnail-small open-post">
                                                    <a rel="nofollow" href="# " title={post.title} alt={post.title}>
                                                        <i className="fa fa-file-text large-text" aria-hidden="true"></i>
                                                    </a>
                                                </div>
                                                <h3 className="post-title open-post">
                                                    <a rel="nofollow" className="sidebar-title" href="# " target="_blank" title={post.title} alt={post.title}>
                                                        <TextTruncate
                                                            line={2}
                                                            element="p"
                                                            truncateText="…"
                                                            text={post.title}
                                                        />
                                                    </a>
                                                    <div><a href="# " className="subject" target="_blank"><i className="fa fa-eye mr-1"></i>{<NumericLabel params={{ currency: false, commafy: true, shortFormat: true, justification: 'L' }}>{post.view_count}</NumericLabel>}</a></div>
                                                    <div><a href={"/community/" + post.community_type} className="subject" target="_blank">{"@" + post.community_type}</a></div>
                                                </h3>
                                            </article>
                                }
                            </li>
                        ))}

                    </ul>
                </div>
            </div>
            <div id="widget-create" className="widget recent-widget recent-post-widget">
                <p>Your personal frontpage. Come here to check in with your favorite communities.</p>
                {
                    props.isAuthed === true ?
                        <Popup
                            modal
                            lockScroll
                            trigger={
                                <button type="button" className="btn btn-dark btn-block">CREATE POST</button>
                            }
                        >
                            {
                                close =>
                                    <CreatePost
                                        close={close}
                                    />
                            }
                        </Popup>
                        :
                        <button type="button" className="btn btn-dark btn-block" onClick={handleOnClickFormSubmit}>CREATE POST</button>
                }

                {
                    props.isAuthed === true ?
                        <Popup
                            modal
                            trigger={
                                <button type="button" className="btn btn-primary btn-block">CREATE COMMUNITIES</button>
                            }
                        >
                            {
                                close =>
                                    <CreateCommunity close={close} />
                            }
                        </Popup>
                        :
                        <button type="button" onClick={handleOnClickFormSubmit} className="btn btn-primary btn-block">CREATE COMMUNITIES</button>
                }


            </div>
            <div id="widget-upvote_recent_posts-2" className="widget recent-widget recent-post-widget">
                <h4 className="widget-title"><span>Recent topics</span></h4>
                <div className="recents">
                    <ul>
                        {recent.map(post => (
                            <li key={post.id}>
                                {
                                    post.type === 'image' ?
                                        <article onClick={e => { handleClickPost(post); e.preventDefault() }} className="hentry trending-posts post-3877 topic type-topic status-publish format-standard has-post-thumbnail topic_category-@Technology topic_tag-social-media">
                                            <div className="thumbnail-small open-post">
                                                <a rel="nofollow" href="# " title={post.title} alt={post.title}>
                                                    <img src={"http://127.0.0.1:8000" + post.image} className="attachment-thumbnail size-thumbnail wp-post-image" alt={post.title} title={post.title} /> </a>
                                            </div>
                                            <h3 className="post-title open-post">
                                                <a rel="nofollow" className="sidebar-title" href="# " target="_blank" title={post.title} alt={post.title}>
                                                    <TextTruncate
                                                        line={2}
                                                        element="p"
                                                        truncateText="…"
                                                        text={post.title}
                                                    />
                                                </a>
                                                <div><a href="# " className="subject" target="_blank"><i className="fa fa-eye mr-1"></i>{<NumericLabel params={{ currency: false, commafy: true, shortFormat: true, justification: 'L' }}>{post.view_count}</NumericLabel>}</a></div>
                                                <div><a href={"/community/" + post.community_type} className="subject" target="_blank">{"@" + post.community_type}</a></div>
                                            </h3>
                                        </article>
                                        : post.type === 'url' ?
                                            <article onClick={e => { handleClickPost(post); e.preventDefault() }} className="hentry trending-posts post-3877 topic type-topic status-publish format-standard has-post-thumbnail topic_category-@Technology topic_tag-social-media">
                                                <div className="thumbnail-small open-post">
                                                    {/* <a rel="nofollow" href="# " title={post.title} alt={post.title}> */}
                                                    <ReactTinyLink
                                                        cardSize="small"
                                                        showGraphic={true}
                                                        maxLine={1}
                                                        minLine={1}
                                                        url={post.content}
                                                    />
                                                    {/* </a> */}
                                                </div>
                                                <h3 className="post-title open-post">
                                                    <a rel="nofollow" className="sidebar-title" href="# " target="_blank" title={post.title} alt={post.title}>
                                                        <TextTruncate
                                                            line={2}
                                                            element="p"
                                                            truncateText="…"
                                                            text={post.title}
                                                        />
                                                    </a>
                                                    <div><a href="# " className="subject" target="_blank"><i className="fa fa-eye mr-1"></i>{<NumericLabel params={{ currency: false, commafy: true, shortFormat: true, justification: 'L' }}>{post.view_count}</NumericLabel>}</a></div>
                                                    <div ><a href={"/community/" + post.community_type} className="subject" target="_blank">{"@" + post.community_type}</a></div>
                                                </h3>
                                            </article>
                                            :
                                            <article onClick={e => { handleClickPost(post); e.preventDefault() }} className="hentry trending-posts post-3877 topic type-topic status-publish format-standard has-post-thumbnail topic_category-@Technology topic_tag-social-media">
                                                <div className="thumbnail-small open-post">
                                                    <a rel="nofollow" href="# " title={post.title} alt={post.title}>
                                                        <i className="fa fa-file-text large-text" aria-hidden="true"></i>
                                                    </a>
                                                </div>
                                                <h3 className="post-title open-post">
                                                    <a rel="nofollow" className="sidebar-title" href="# " target="_blank" title={post.title} alt={post.title}>
                                                        <TextTruncate
                                                            line={2}
                                                            element="p"
                                                            truncateText="…"
                                                            text={post.title}
                                                        />
                                                    </a>
                                                    <div><a href="# " className="subject" target="_blank"><i className="fa fa-eye mr-1"></i>{<NumericLabel params={{ currency: false, commafy: true, shortFormat: true, justification: 'L' }}>{post.view_count}</NumericLabel>}</a></div>
                                                    <div><a href={"/community/" + post.community_type} className="subject" target="_blank">{"@" + post.community_type}</a></div>
                                                </h3>
                                            </article>
                                }
                            </li>
                        ))}


                    </ul>
                </div>
            </div>
            <div id="widget-footer" className="widget recent-widget recent-post-widget">
                <small>Your personal frontpage. Come here to check in with your favorite communities.</small>
                <small><i className="fa fa-copyright" aria-hidden="true" />2020</small>
            </div>
        </div>
    );
}

export default SideBar;