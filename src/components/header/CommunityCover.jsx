import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import EditCommunity from '../comunity/EditCommunity';
import Popup from "reactjs-popup";
import ChangeColorCommunity from '../comunity/ChangeColorCommunity';
import ImageEdit from '../comunity/ImageEdit';

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

    const [changedColor, setChangedColor] = useState({
        background_color: props.detail.background_color,
        title_background_color: props.detail.title_background_color,
        description_background_color: props.detail.description_background_color,
        button_background_color: props.detail.button_background_color,
        button_text_color: props.detail.button_text_color,
        text_color: props.detail.text_color,
        post_background_color: props.detail.post_background_color
    });
    useEffect(() => {
        setChangedColor({
            background_color: props.detail.background_color,
            title_background_color: props.detail.title_background_color,
            description_background_color: props.detail.description_background_color,
            button_background_color: props.detail.button_background_color,
            button_text_color: props.detail.button_text_color,
            text_color: props.detail.text_color,
            post_background_color: props.detail.post_background_color
        })
    }, [props.detail.background_color])
    function handleSubmitColor(color) {
        setChangedColor({
            background_color: color.background_color,
            title_background_color: color.title_background_color,
            description_background_color: color.description_background_color,
            button_background_color: color.button_background_color,
            button_text_color: color.button_text_color,
            text_color: color.text_color,
            post_background_color: color.post_background_color
        })
    }

    function handleDemoChangeColor(values) {
        if (!props.onSubmitColor) return;
        props.onSubmitColor(values);
    }

    const [isShowBoxColor, setIsShowBoxColor] = useState(false);

    useEffect(() => {
        setIsJoined(props.detail.is_following);
    }, [props])

    const [inHoverAvatar, setHoverAvatar] = useState(false);

    function handleUpdateAvatar(img) {
        const data = {
            community_type: props.detail.community_type,
            avatar: img,

        }
        console.log(data);
        axios.post(`http://127.0.0.1:8000/api/community/update/`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                window.location.reload(false);
            }
        }).catch(function (error) {
            console.log(error.response)
        });
    }

    function handleUpdateBackground(img){
        const data = {
            community_type: props.detail.community_type,
            background: img
        }
        axios.post(`http://127.0.0.1:8000/api/community/update/`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {
                window.location.reload(false);
            }
        }).catch(function (error) {
        });
    }

    return (
        <div id="banner">
            <div className="cover">
                <div className="cover-wrap">
                    <img src={props.detail.background} alt="" />
                    {
                        props.detail.is_creator === true ?
                            <Popup
                                modal
                                trigger={
                                    <span className="trigger-edit-cover"> <i className="fa fa-camera e-cover" aria-hidden="true"></i></span>
                                }
                            >
                                {
                                    close =>
                                        <ImageEdit
                                            type={"background"}
                                            handleSubmit={handleUpdateBackground}
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
                        <img src={props.detail.avatar} alt="" className="avatar" />
                        {
                            props.detail.is_creator === true ?
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
                                            <ImageEdit
                                                type={"avatar"}
                                                handleSubmit={handleUpdateAvatar}
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
                                        <button onClick={handleLeave} onMouseEnter={() => setInHoverJoined(true)} onMouseLeave={() => setInHoverJoined(false)} type="button" className={inHoverJoined === true ? "btn btn-danger join" : "btn btn-warning join login"}>{inHoverJoined === true ? <a href="# "><i className="fa fa-times mr-1"></i>Leave</a> : <a href="# "><i className="fa fa-check mr-1"></i>Joined</a>}</button>


                                    </div>
                                    :
                                    <button onClick={hanldeJoin} type="button" className="btn btn-primary join"> Join</button>
                                : null
                        }
                        {
                            props.detail.is_creator === true ?
                                <div className="edit-community">
                                    <Popup
                                        modal
                                        trigger={
                                            <button className="btn btn-primary edit-community"> <div className="fa fa-cog"></div></button>
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
                                    <div className="change-color" onClick={() => setIsShowBoxColor(true)}>
                                        <span className="fa fa-eyedropper edit-color"></span>
                                        {
                                            isShowBoxColor === true ?
                                                <ChangeColorCommunity
                                                    name={props.detail.community_type}
                                                    background_color={changedColor.background_color}
                                                    title_background_color={changedColor.title_background_color}
                                                    description_background_color={changedColor.description_background_color}
                                                    button_background_color={changedColor.button_background_color}
                                                    button_text_color={changedColor.button_text_color}
                                                    text_color={changedColor.text_color}
                                                    post_background_color={changedColor.post_background_color}
                                                    onChangeColor={handleDemoChangeColor}
                                                    onSubmitColor={handleSubmitColor}
                                                    onClickOutSide={() => setIsShowBoxColor(false)}
                                                />
                                                : null
                                        }

                                    </div>
                                </div>

                                : null
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default CommunityCover;