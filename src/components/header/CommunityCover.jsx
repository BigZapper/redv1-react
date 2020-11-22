import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import EditCommunity from '../comunity/EditCommunity';
import Popup from "reactjs-popup";
import ChangeColorCommunity from '../comunity/ChangeColorCommunity';

CommunityCover.propTypes = {
    onSubmitColor: PropTypes.func,
};

CommunityCover.defaultProps = {
    onSubmitColor: null
}

function CommunityCover(props) {
    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const [isJoined, setIsJoined] = useState(false);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    var config = {};
    if (props.isAuthed) {
        config = {
            headers: { Authorization: `Bearer ${cookies.token}` },
            cancelToken: source.token
        };
    }


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    const [inHoverJoined, setInHoverJoined] = useState(false);
    function hanldeJoin() {
        const data = {
            community: props.detail.community_type,
            action: "follow"
        }
        axios.post(`http://127.0.0.1:8000/api/community/action`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                setIsJoined(true);
            }
        }).catch(function (error) {
        });
    }

    function handleLeave() {
        const data = {
            community: props.detail.community_type,
            action: "un_follow"
        }
        axios.post(`http://127.0.0.1:8000/api/community/action`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                setIsJoined(false);
            }
        }).catch(function (error) {
        });
    }


    function handleSubmitColor(color) {
        const data = {
            community_type: props.name,
            background_color: color
        }
        axios.post(`http://127.0.0.1:8000/api/community/update/`, data, config).then(res => {
            console.log(res);
            // if(!props.onSubmitColor) return;
            // props.onSubmitColor(color);
        }).catch(function (error) {
        });
    }

    function handleDemoChangeColor(values){
        if(!props.onSubmitColor) return;
        props.onSubmitColor(values);
    }

    useEffect(() => {
        setIsJoined(props.detail.is_following);
    }, [props])
    return (
        <div id="banner">
            <div className="cover">
                <img src={props.detail.background} alt="" />
            </div>
            <div className="container community-bar">
                <div id="community">
                    <img src={props.detail.avatar} alt="" className="avatar" />
                    <div className="community-title-block">
                        <div className="community-text">
                            <h1 className="community-title">
                                {props.detail.community_type ? capitalizeFirstLetter(props.detail.community_type) : null}
                            </h1>
                            <h2 className="community-ref">
                                @{props.detail.community_type}
                            </h2>
                        </div>
                        {
                            props.isAuthed ?
                                isJoined === true ?
                                    <div className="community-button">
                                        <button onClick={handleLeave} onMouseEnter={() => setInHoverJoined(true)} onMouseLeave={() => setInHoverJoined(false)} type="button" className={inHoverJoined === true ? "btn btn-danger join" : "btn btn-warning join login"}>{inHoverJoined === true ? "Leave" : "Joined"}</button>
                                        {
                                            props.detail.is_creator === true ?
                                                <div className="edit-community">
                                                    <Popup
                                                        modal
                                                        trigger={
                                                            <button className="btn btn-primary edit-community"> <div className="fa fa-cog"></div> Edit</button>
                                                        }
                                                    >
                                                        {
                                                            close =>
                                                                <EditCommunity
                                                                    name={props.detail.community_type}
                                                                    description={props.detail.description}
                                                                    rule={props.detail.rule}
                                                                    close={close}
                                                                />
                                                        }
                                                    </Popup>
                                                    <div className="change-color">
                                                        <span className="fa fa-pencil edit-color"></span>
                                                        <ChangeColorCommunity
                                                            name={props.detail.community_type}
                                                            background_color={props.detail.background_color}
                                                            title_background_color={props.detail.title_background_color}
                                                            description_background_color={props.detail.description_background_color}
                                                            button_background_color={props.detail.button_background_color}
                                                            button_text_color={props.detail.button_text_color}
                                                            text_color={props.detail.text_color}
                                                            post_background_color={props.detail.post_background_color}
                                                            onChangeColor={handleDemoChangeColor}
                                                        />
                                                    </div>
                                                </div>

                                                : null
                                        }

                                    </div>
                                    :
                                    <button onClick={hanldeJoin} type="button" className="btn btn-primary join">Join</button>
                                : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityCover;