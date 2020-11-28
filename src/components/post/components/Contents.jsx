import React, { useState, useEffect } from 'react';
import NumericLabel from 'react-pretty-numbers';
import TimeAgo from 'react-timeago';
import PropTypes from 'prop-types';
import { ReactTinyLink } from 'react-tiny-link'

Contents.propTypes = {

};
function Contents(props) {
    //     console.log(props.state.timestamp)
    // const [date, setDate] = useState(props.state.timestamp);
    useEffect(() => {
        // console.log(props.state)
    }, [props])
    return (
        <div data-test-id="post-content">

            <div className="entrymeta-container">
                <div className="community-avatar-small-block"><a data-click-id="subreddit" className="community-name-small" href={"/user/"+props.state.user}><img alt={"Subreddit Icon"} role="presentation" src={props.state.avatar} className="aside-avatar community-avatar-small" style={{ backgroundColor: 'rgb(0, 121, 211)' }} /></a></div>
                <div className="entrymeta-post-content">
                    <div className="entrymeta-post-block entrymeta-post-display">
                        <div className="name-small-block"><a data-click-id="subreddit" className="community-name-small" href={"/user/"+props.state.user}>{props.state.user}</a>
                            <div id="SubredditInfoTooltip--t3_iz99vh--lightbox--disenchantment">
                            </div>
                        </div><span className="seperate-small-block seperate-small seperate-small-contain" role="presentation">•</span><span className="posted-by" style={{ color: 'rgb(129, 131, 132)' }}>Posted in</span>
                        <div className="name-small-block"><a className="_2tbHP6ZydRpjI44J3syuqC name-user" href={"/community/" + props.state.community} style={{ color: 'rgb(129, 131, 132)' }}>{props.state.community}</a>
                            <div id="UserInfoTooltip--t3_iz99vh--lightbox" />
                        </div>
                        <a className="post-created-time" data-click-id="timestamp" href="https://www.reddit.com/r/disenchantment/comments/iz99vh/beware_the_proletariat_that_is_bunty/" target="_blank" rel="nofollow noopener noreferrer" style={{ color: 'rgb(129, 131, 132)' }}>{<TimeAgo date={new Date(props.state.timestamp)} />}</a>
                    </div>
                    <div className="_2wFk1qX4e1cxk8Pkw1rAHk" />
                </div>
            </div>
            <div className="post-title-large-block t3_iz99vh">
                <div className="title-post-block ">
                    <div className="title-post-format post-title-large-text " >
                        <h1 style={{ color: props.color.text_color }} className="title-post-text">{props.state.title}</h1>
                    </div>
                </div>
            </div>
            {/* <div className="outbound-link-block link-block">
                <a href="https://i.imgur.com/b6h8dud.png" className="outbound-link styled-outbound-link" post="[object Object]" rel="noopener nofollow ugc" target="_blank">i.imgur.com/b6h8du...<i className="fa fa-external-link outbound-link-icon" /></a>
            </div> */}
            {
                props.state.type === 'image' ?

                    <div className="post-context-block" style={{ margin: '0px auto' }}>
                        <a href={"http://127.0.0.1:8000" + props.state.image} target="_blank">
                            <img alt="r/disenchantment - {props.content}" className="post-img ImageBox-image media-element post-img-align" src={"http://127.0.0.1:8000" + props.state.image} style={{ maxHeight: '700px' }} />
                        </a>
                    </div>
                    : props.state.type === 'url' ?
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
                        <i className="fa fa-eye ml-2"></i><span className="ml-1">{<NumericLabel params={{ currency: false, commafy: true, shortFormat: true, justification: 'L' }}>{props.state.view}</NumericLabel>}</span>
                </div>
                {/* <div className="post-action-upvote-percent"><span>98% Upvoted</span></div> */}
            </div>
        </div>
    );
}

export default Contents;