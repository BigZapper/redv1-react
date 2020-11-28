import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

SideBarCommunity.propTypes = {
    onGetColor: PropTypes.func,
};

SideBarCommunity.defaultProps = {
    onGetColor: null
}

function SideBarCommunity(props) {

    // console.log(props)
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    var config = {}
    if (props.isAuthed) {
        config = {
            headers: { Authorization: `Bearer ${props.cookie.token}` },
            cancelToken: source.token
        };
    }

    else {
        config = {
            headers: { 'Content-Type': 'application/json', },
            cancelToken: source.token
        };
    }

    const [community, setCommunity] = useState({})

    function getDateCreated() {
        var date = new Date(community.timestamp);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        date = dd + '/' + mm + '/' + yyyy;
        return date;
    }

    useEffect(() => {
        if (!props.onGetColor) return;
        const color = {
            background_color: community.background_color,
            title_background_color: community.title_background_color,
            description_background_color: community.description_background_color,
            button_background_color: community.button_background_color,
            button_text_color: community.button_text_color,
            text_color: community.text_color,
            post_background_color: community.post_background_color
        }
        props.onGetColor(color);
    }, [community])

    useEffect(() => {
        function getCommunity() {
            const data = {
                community: props.community
            };
            axios.post('http://127.0.0.1:8000/api/community/', data, config).then(res => {
                // console.log(res);
                if (res.status === 200) {
                    setCommunity(res.data.results[0]);
                }
            }).catch(function (error) {
            });
        }
        getCommunity();
        return () => {
            source.cancel();
        };
    }, [props.community])

    const history = useHistory();
    function handleOnClickFormSubmit() {
        if (props.isAuthed) {
            history.push("/submit");
        }
        else
            alert('Chưa đăng nhập');
    }
    return (
        <div id="sidebar" className="col-lg-4 col-md-5 col-sm-12">
            <div className="widget about" style={{ backgroundColor: community.description_background_color, color: community.text_color }}>
                {/* <div className="change-color">
                        <span className="fa fa-pencil edit-color"></span>
                    </div> */}
                <header className="section-title-about" style={{ backgroundColor: community.title_background_color }}>
                    <h6 className="title-about"> About Community</h6>
                </header>
                <div className="aside-community-entry"><img alt="Subreddit Icon" role="presentation" src={community.avatar} className="aside-avatar aside-avatar-block" style={{ backgroundColor: 'rgb(0, 121, 211)' }} />
                    <div className="aside-community-name">
                        <a className="aside-community-link" href="/r/disenchantment/">
                            <span style={{color: community.text_color }}className="aside-community-link-text" title={community.community_type}>{community.community_type}</span>
                        </a>
                    </div>
                </div>
                <div className="communities about-context">
                    <div className="pagagraph">
                        <p className="com-about">{community.description}</p>
                    </div>
                    <div className="member-infor">
                        <div className="total-members">
                            <div className="number-members">{community.follower}</div>
                            <p className="text-members" id="IdCard--Subscribers--undefined--t5_2qh7a">Members
                </p>
                        </div>
                        <div className="online-members">
                            <div className="number-members">{community.member_count}</div>
                            <p className="text-members" id="IdCard--CurrentlyViewing--undefined--t5_2qh7a">
                                Online</p>
                        </div>
                        <div />
                    </div>
                    <hr className="about-line" />
                    <div>
                        <div className="date-created"><i className="fa fa-birthday-cake" aria-hidden="true" /> Created {getDateCreated()}</div>
                    </div>
                    <div className="create-post">
                        <a style={{ backgroundColor: community.button_background_color, color:community.button_text_color }} onClick={e => { handleOnClickFormSubmit(); e.preventDefault() }} className="button-create" href="#" >Create post</a>

                    </div>
                </div>
            </div>
            <div className="widget about" data-redditstyle="true" style={{ backgroundColor: community.description_background_color, color: community.text_color }}>
                <header className="title-bg" className="section-title-about" style={{ backgroundColor: community.title_background_color }}>
                    <h6 className="title-about"> Rules</h6>
                </header>
                <div className="communities about-context" style={{ maxHeight: 'none' }}>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">1.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Use correct title formatting</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context">
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>Artwork - Title, Artist/Me, Medium, Year</p>
                                    <p>If you are the artist and don't want to use your own name, you can use Me as
                      the artist. If you are not the artist, you must specify the artist name.</p>
                                    <p>Example: The Night Watch, Rembrandt, Oils, 1642</p>
                                    <p>News article - Title, Year</p>
                                    <p>Discussion - make it a self post. Expand on your question in the text and
                      include image examples when possible.</p>
                                    <p>Videos - Videos should be titled in a way consistent with it's content.
                      Videos must be in the gif format.</p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">2.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Direct Image/Video Links Only</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context">
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>All submissions other than articles must be a direct link to a static image
                      or gif (url must end in .jpg, .png, .gif etc.).</p>
                                    <p>Articles must contain more substance than just a gallery of images or an
                      embedded video, and they must cover some current news in the art world. </p>
                                    <p>Images should only contain 1 art piece.</p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">3.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Do Not Make Multiple Posts</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>You must wait at least 48 hours between posts.
                      Excessive posts/comments could be considered spam and result in a ban.</p>
                                    <p>Please use rolling stickies for daily challenges or special threads.</p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">4.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Do Not Submit Sketches or Doodles</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>Post these to other subreddits like <a href="/r/IDAP">/r/IDAP</a>, <a href="/r/sketches">/r/sketches</a> and <a href="/r/doodles">/r/doodles</a> instead. If it's an unfinished work and
                      you need advice, post it as a self-post and indicate in the comments that
                      you're looking for feedback or advice. </p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">5.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Do not Submit Work With Extraneous Objects</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>We're here to look at art, not your Prismacolor pencils, the desk you framed
                                    your painting over, your easel, or anything else that would not be seen if
                      the art were publicly displayed.</p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">6.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Do Not Post Memes or Low Quality Work</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>Low effort submissions may be removed. Melted crayon "art" and bad MSPaint
                                    drawings are subject to a 3 day ban. This rule is totally up to mod
                      discretion.</p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">7.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">No Fanart, Comics, or Requests</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>Submissions that don't fit here may be redirected to more suitable subreddits
                      like <a href="/r/fanart">/r/fanart</a>, <a href="/r/artporn">/r/artporn</a>,
                      or <a href="/r/comics">/r/comics</a>. Requests for art work should be
                      submitted to <a href="/r/designjobs">/r/designjobs</a> instead.</p>
                                    <p>See here: <a href="https://old.reddit.com/r/art/wiki/fan_art">https://old.reddit.com/r/art/wiki/fan_art</a>
                                    </p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">8.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Be Respectful and Stay on Topic</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>Bigotry, slapfights, unconstructive criticism, and off-topic comments will
                      not be tolerated and may result in all parties being banned.</p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">9.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">No Blogs/Social Media/Stores/Spam/Self-Promo
                  </div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p><a href="/r/art">/r/art</a> is not a place to sell your work or grow your
                      following. Consider <a href="/r/artstore">/r/artstore</a>. This applies to
                      comments <em>and</em> submissions. It applies to watermarks on images as
                      well. </p>
                                    <p>Also see here if you're using reddit for self-promotion: <a href="https://www.reddit.com/wiki/selfpromotion">https://www.reddit.com/wiki/selfpromotion</a>
                                    </p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                    <div className="rule-block ">
                        <div className="rule-title">
                            <div className="number-rule-block">
                                <div className="number">10.</div>
                            </div>
                            <div className="rule-name">
                                <div className="rule-name-context">Turtles are Friends, Not Food</div>
                            </div>
                            <div className="number-rule-block">
                                <div />
                            </div>
                        </div>
                        <div className="rule-context-block">
                            <div className="rule-context" >
                                {/* SC_OFF */}
                                <div className="md">
                                    <p>Do not add any extraneous information, or be subjective in your title.</p>
                                    <p>Plagiarism is grounds for a permaban.</p>
                                    <p><strong>Note: When rules are updated on "old" reddit they do not
                                    automatically update on the redesign. If your post is removed for a
                                    reason that doesn't seem to align with the rules currently please check
                        <a href="http://old.reddit.com/r/art">http://old.reddit.com/r/art</a>
                        for the most up-to-date info.</strong></p>
                                    <p>If you see rule-breaking content report it by clicking the "report" button or
                      messaging the moderators directly via modmail.</p>
                                </div>{/* SC_ON */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="widget-upvote_recent_posts-2" className="widget recent-widget recent-post-widget" className="description-body">
                <small className="description-body">Your personal frontpage. Come here to check in with your favorite communities.</small>
                <small className="description-body"><i className="fa fa-copyright" aria-hidden="true" />2020</small>
            </div>
        </div>

    );
}

export default SideBarCommunity;