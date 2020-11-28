import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TrendingTags from './newsfeed/TrendingTags';
import PostNewsFeed from './newsfeed/PostNewsFeed';
import Post from '../post/Post';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from 'react';
import Loader from 'react-loader-spinner';
import Popup from 'reactjs-popup';
import CreatePost from '../../CreatePost';


// Khai báo hàm onLoadMore trong props để gọi hàm handleLoadMore phía component cha
NewsFeed.propTypes = {
    onLoadMore: PropTypes.func,
    onChangeFilter: PropTypes.func,
}

NewsFeed.defaultProps = {
    onLoadMore: null,
    onChangeFilter: null
}

function NewsFeed(props) {

    // Khai báo state postDetail để mỗi khi một PostNewsFeed được click nó sẽ gửi props của nó về đây để hiển thị trên popup
    const [postDetail, setPostDetail] = useState({});
    // Nếu là true thì sẽ hiện popup của post được click
    const [isShowPost, setIsShowPost] = useState(false);

    const config = {
        headers: { Authorization: `Bearer ${getCookie('token')}` }
    };
    function handleClickPost(detail) {
        setPostDetail({
            postId: detail.postId,
            type: detail.type,
            user: detail.user,
            avatar: detail.avatar,
            background: detail.background,
            upVotes: detail.upVotes,
            downVotes: detail.downVotes,
            image: detail.image,
            content: detail.content,
            community: detail.community,
            isAuthed: props.isAuthed
        });
        setIsShowPost(true);
        // axios.get(`http://127.0.0.1:8000/api/post/${detail.postId}`, config)
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

    //Chuyển hướng đến component submit
    const history = useHistory();
    function handleOnClickFormSubmit() {
        if (props.isAuthed) {
            history.push("/submit");
        }
        else
            alert('Chưa đăng nhập');
    }

    // console.log(props);
    // Sau khi popup của post được đóng, state này sẽ kiểm tra thay đổi về point của post đó
    const [pointsChanged, setPointsChanged] = useState({
        id: null,
        points: null
    });
    //Hàm xử lý khi close post, nhận giá trị id và points của post đó sau khi đóng
    function closePost(id, points, comments, views) {
        setIsShowPost(false);
        setPointsChanged({
            id: id,
            points: points,
            comment: comments,
            views: views
        });
    }


    // Khi nhận được danh sách post của page tiếp theo từ props ta sẽ xử lý và render lại component
    useEffect(() => {
        //Kiểm tra danh sách này có rỗng không
        if (typeof props.nextPosts !== 'undefined' && props.nextPosts.length > 0) {
            // Thêm danh sách này vào danh sách post hiện tại
            setPosts([...posts, ...props.nextPosts]);
        }
    }, [props.nextPosts])


    // Hàm lấy thêm post bằng props
    function fetchMoreData() {
        if (!props.onLoadMore) return;
        props.onLoadMore();
    }
    // State để lưu danh sách các post hiện trên newsfeed
    const [posts, setPosts] = useState([]);
    // Sau khi nhận được các post từ props nó mới set 
    useEffect(() => {
        setPosts(props.posts);
    }, [props.posts])

    function handleChangFilter(value) {
        if (!props.onChangeFilter) return;
        props.onChangeFilter(value);
    }
    // const [color, setColor] = useState(null);
    // useEffect(() => {
    //     setColor(props.color);
    // }, [props.color])
    return (
        <div className="col-lg-8 col-sm-12">

            <TrendingTags onChangeFilter={handleChangFilter} isAuthed={props.isAuthed} />
            <form>
                <Popup
                    modal
                    lockScroll
                    trigger={
                        <input type="text" placeholder="Submit your post" onClick={handleOnClickFormSubmit} />
                    }
                >
                    {
                        close => (
                                <CreatePost
                                    close={close}
                                    community={props.community}
                                />
                        )
                    }
                </Popup>

            </form>
            {/* Nếu một post trên newsfeed được click nó sẽ được hiện popup chi tiết tại đây */}
            {
                isShowPost ?
                    <Post
                        detail={postDetail}
                        cookie={props.cookie}
                        isAuthed={props.isAuthed}
                        onClosePost={closePost}
                    />
                    : null
            }
            <div className="popular-topics">
                <article className="post-6 page type-page status-publish hentry">
                    <div className="entrycontent clearfix">
                        <div className="entry-content">
                            {/* {props.posts.map(post => (
                                <PostNewsFeed
                                    key={post.id}
                                    postId={post.id}
                                    type={post.type}
                                    user={post.user.username}
                                    avatar={post.user.avatar}
                                    background={post.user.background}
                                    upVotes={post.up_vote}
                                    downVotes={post.down_vote}
                                    title={post.title}
                                    content={post.content}
                                    image={post.image}
                                    community={post.community_type}
                                    timestamp={post.timestamp}
                                    onClickPost={handleClickPost}
                                    isAuthed={props.isAuthed}
                                    showPost={isShowPost} 
                                    pointsChanged={pointsChanged}
                                />
                            ))} */}

                            <InfiniteScroll
                                dataLength={posts.length}
                                next={fetchMoreData}
                                hasMore={!props.isEnd}
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
                                {posts.map(post => (
                                    <PostNewsFeed
                                        key={post.id}
                                        postId={post.id}
                                        type={post.type}
                                        user={post.user.username}
                                        avatar={post.user.avatar}
                                        background={post.user.background}
                                        upVotes={post.up_vote}
                                        downVotes={post.down_vote}
                                        title={post.title}
                                        content={post.content}
                                        image={post.image}
                                        community={post.community_type}
                                        timestamp={post.timestamp}
                                        onClickPost={handleClickPost}
                                        isAuthed={props.isAuthed}
                                        view={post.view_count}
                                        showPost={isShowPost}
                                        pointsChanged={pointsChanged}
                                        color={props.color}
                                    />
                                ))}
                            </InfiniteScroll>

                            {/* Start: Pagination */}
                            {/* <div className="pagination">
                                <div className="wp-pagenavi" role="navigation">
                                    <span className="pages">Page 1 of 2</span><span aria-current="page" className="current">1</span><a className="page larger" title="Page 2" href="# ">2</a><a className="nextpostslink" rel="next" href="# ">»</a>
                                </div>
                            </div> */}
                            {/* End: Pagination */}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default NewsFeed;