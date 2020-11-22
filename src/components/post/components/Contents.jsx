import React, { useState, useEffect } from 'react';
import TimeAgo from 'react-timeago';
import PropTypes from 'prop-types';
import { ReactTinyLink } from 'react-tiny-link'

Contents.propTypes = {

};
function Contents(props) {
    //     console.log(props.state.timestamp)
    // const [date, setDate] = useState(props.state.timestamp);
    useEffect(() => {
        // console.log('render')
    }, [props])
    return (
        <div data-test-id="post-content">

            <div className="entrymeta-container">
                <div className="community-avatar-small-block"><a data-click-id="subreddit" className="community-name-small" href="/r/disenchantment/"><img alt="Subreddit Icon" role="presentation" src="https://styles.redditmedia.com/t5_39nlw/styles/communityIcon_ue0jbotw7rb11.png?width=256&s=cea19394d080599fa29f21be09e04f1285d48cbe" className="aside-avatar community-avatar-small" style={{ backgroundColor: 'rgb(0, 121, 211)' }} /></a></div>
                <div className="entrymeta-post-content">
                    <div className="entrymeta-post-block entrymeta-post-display">
                        <div className="name-small-block"><a data-click-id="subreddit" className="community-name-small" href="/r/disenchantment/">{props.state.community}</a>
                            <div id="SubredditInfoTooltip--t3_iz99vh--lightbox--disenchantment">
                            </div>
                        </div><span className="seperate-small-block seperate-small seperate-small-contain" role="presentation">•</span><span className="posted-by" style={{ color: 'rgb(129, 131, 132)' }}>Posted by</span>
                        <div className="name-small-block"><a className="_2tbHP6ZydRpjI44J3syuqC name-user" href="/user/itsthevoiceman/" style={{ color: 'rgb(129, 131, 132)' }}>{props.state.user}</a>
                            <div id="UserInfoTooltip--t3_iz99vh--lightbox" />
                        </div><a className="post-created-time" data-click-id="timestamp" href="https://www.reddit.com/r/disenchantment/comments/iz99vh/beware_the_proletariat_that_is_bunty/" target="_blank" rel="nofollow noopener noreferrer" style={{ color: 'rgb(129, 131, 132)' }}>{<TimeAgo date={new Date(props.state.timestamp)} />}</a>
                    </div>
                    <div className="_2wFk1qX4e1cxk8Pkw1rAHk" />
                </div>
            </div>
            <div className="post-title-large-block t3_iz99vh">
                <div className="title-post-block ">
                    <div className="title-post-format post-title-large-text " >
                        <h1 className="title-post-text">{props.state.title}</h1>
                    </div>
                </div>
            </div>
            {/* <div className="outbound-link-block link-block">
                <a href="https://i.imgur.com/b6h8dud.png" className="outbound-link styled-outbound-link" post="[object Object]" rel="noopener nofollow ugc" target="_blank">i.imgur.com/b6h8du...<i className="fa fa-external-link outbound-link-icon" /></a>
            </div> */}
            {
                props.state.type === 'image' ?

                    <div className="post-context-block" style={{ margin: '0px auto' }}>
                        <a href={"http://127.0.0.1:8000"+props.state.image} target="_blank">
                            <img alt="r/disenchantment - {props.content}" className="post-img ImageBox-image media-element post-img-align" src={"http://127.0.0.1:8000"+props.state.image} style={{ maxHeight: '700px' }} />
                        </a>
                    </div>
                    :props.state.type === 'url'?
                        <div className="link-post-large">
                            <ReactTinyLink
                                cardSize="large"
                                showGraphic={true}
                                maxLine={2}
                                minLine={1}
                                url={props.state.content}
                            />
                        </div>
                        :
                        <p className="wall-of-text">{props.state.content}</p>
            }

            <div className="post-action-container">
                <div className="post-action-block">
                    <div className="post-action-comment-block post-action-comment-cursor post-action-comment-format">
                        <i className="fa fa-comment post-comment-icon post-comment-icon-post" role="presentation" /><span className="post-comment-text">{props.cmtCount + " "}
                          comments</span></div>
                    {/* <div data-ignore-click="false"><button className="post-action-block-todo-align post-action-block-todo "><span className="post-action-block-todo-icon"><i className="fa fa-gift post-action-block-giveaward-icon block-todo-icon" id="View--GiveAward--t3_iz99vh--lightbox"><span className="empty" /></i></span><span className="post-action-todo-text">Give Award</span></button>
                    </div>
                    <div className="post-action-share-block" id="t3_iz99vh-overlay-share-menu">
                        <button data-click-id="share" className="post-action-share-btn"><i className="fa fa-share post-action-share-icon-block post-action-share-icon" /><span className="post-action-share-text">share</span></button></div>
                    <div data-ignore-click="false"><button className="post-action-block-todo-align post-action-block-todo "><span className="post-action-block-todo-icon"><i className="fa fa-bookmark post-action-save-icon-block block-todo-icon" /></span><span className="post-action-todo-text">save</span></button></div>
                    <div data-ignore-click="false"><button className="post-action-block-todo-align post-action-block-todo "><span className="post-action-block-todo-icon"><i className="fa fa-ban post-action-hide-icon-block block-todo-icon" /></span><span className="post-action-todo-text">hide</span></button></div>
                    <div data-ignore-click="false"><button className="post-action-block-todo-align post-action-block-todo "><span className="post-action-block-todo-icon"><i className="fa fa-flag post-action-hide-report-block block-todo-icon"><span className="empty" /></i></span><span className="post-action-todo-text">report</span></button></div>
                    <div className="OccjSdFd6HkHhShRg6DOl" />
                    <div><button aria-expanded="false" aria-haspopup="true" aria-label="more options" id="t3_iz99vh-overlay-overflow-menu" className="menu-dropdown _1EbinKu2t3KjaT2gR156Qp _1k3nXWGGz2NdPr8dg49Tbs _2sAFaB0tx4Hd5KxVkdUcAx _28vEaVlLWeas1CDiLuTCap uMPgOFYlCc5uvpa2Lbteu"><i className="fa fa-ellipsis-h dropdown _38GxRFSqSC-Z2VLi5Xzkjy" /></button>
                    </div>
                    <div className="_21pmAV9gWG6F_UKVe7YIE0" /> */}
                </div>
                {/* <div className="post-action-upvote-percent"><span>98% Upvoted</span></div> */}
            </div>
        </div>
    );
}

export default Contents;