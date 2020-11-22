import React from 'react'
import PropTypes from 'prop-types'
import ColorPicker from './ColorPicker'
import Popup from "reactjs-popup";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

ChangeColorCommunity.propTypes = {
    onChangeColor: PropTypes.func,
}

ChangeColorCommunity.defaultProps = {
    onChangeColor: null
}

function ChangeColorCommunity(props) {
    const [cookies] = useCookies(['name']);
    const config = {
        headers: { Authorization: `Bearer ${cookies.token}` }
    };
    const [pickedColor, setPickedColor] = useState(0); // 1: background; 2: title_background_color; 3: description_background_color; 4: button_background_color; 5: button_text_color; 6: text_color; 7: post_background_color
    const [values, setValues] = useState({
        background_color: props.background_color,
        title_background_color: props.title_background_color,
        description_background_color: props.description_background_color,
        button_background_color: props.button_background_color,
        button_text_color: props.button_text_color,
        text_color: props.text_color,
        post_background_color: props.post_background_color
    })

    function handleSubmitBackgroundColor(color) {
        setValues({
            ...values,
            background_color: color
        });
        // setPickedColor(0);
    }

    function handleSubmitTitleBackgroundColor(color) {
        setValues({
            ...values,
            title_background_color: color
        });
    }

    function handleSubmitDescriptionBackgroundColor(color) {
        setValues({
            ...values,
            description_background_color: color
        });
    }

    function handleSubmitButtonBackgroundColor(color) {
        setValues({
            ...values,
            button_background_color: color
        });
    }

    function handleSubmitButtonTextColor(color) {
        setValues({
            ...values,
            button_text_color: color
        });
    }

    function handleSubmitTextColor(color) {
        setValues({
            ...values,
            text_color: color
        });
    }

    function handleSubmitPostBackgroundColor(color) {
        setValues({
            ...values,
            post_background_color: color
        });
    }

    function handleSubmit(e) {
        var data = {
            community_type: props.name,
            background_color: values.background_color,
            title_background_color: values.title_background_color,
            description_background_color: values.description_background_color,
            button_background_color: values.button_background_color,
            text_color: values.text_color,
            post_background_color: values.post_background_color
        }
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/community/update/', data, config).then(function (response) {
            if (response.status === 200) {
                console.log(response)
            }
        })
            .catch(function (error) {

            });
    }
    useEffect(() => {
        if (!props.onChangeColor) return;
        props.onChangeColor(values);
    }, [values])
    return (
        <div className="show-box-color">
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="pick-color-group">
                        <span onClick={() => { setPickedColor(1) }} className="box-color" style={{ backgroundColor: values.background_color }}></span>
                        <div className="label-color">Background  </div>
                        {
                            pickedColor === 1 ?
                                <ColorPicker
                                    onSubmitColor={handleSubmitBackgroundColor}
                                    onClickOutSide={() => setPickedColor(0)}
                                />
                                : null
                        }
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="pick-color-group">
                        <span onClick={() => { setPickedColor(2) }} className="box-color" style={{ backgroundColor: values.title_background_color }}></span>
                        <div className="label-color">Title background  </div>
                        {
                            pickedColor === 2 ?
                                <ColorPicker
                                    onSubmitColor={handleSubmitTitleBackgroundColor}
                                    onClickOutSide={() => setPickedColor(0)}
                                />
                                : null
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="pick-color-group">
                        <span onClick={() => { setPickedColor(3) }} className="box-color" style={{ backgroundColor: values.description_background_color }}></span>
                        <div className="label-color">Description background  </div>
                        {
                            pickedColor === 3 ?
                                <ColorPicker
                                    onSubmitColor={handleSubmitDescriptionBackgroundColor}
                                    onClickOutSide={() => setPickedColor(0)}
                                />
                                : null
                        }
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="pick-color-group">
                        <span onClick={() => { setPickedColor(4) }} className="box-color" style={{ backgroundColor: values.button_background_color }}></span>
                        <div className="label-color">Button background  </div>
                        {
                            pickedColor === 4 ?
                                <ColorPicker
                                    onSubmitColor={handleSubmitButtonBackgroundColor}
                                    onClickOutSide={() => setPickedColor(0)}
                                />
                                : null
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="pick-color-group">
                        <span onClick={() => { setPickedColor(5) }} className="box-color" style={{ backgroundColor: values.button_text_color }}></span>
                        <div className="label-color">Button text  </div>
                        {
                            pickedColor === 5 ?
                                <ColorPicker
                                    onSubmitColor={handleSubmitButtonTextColor}
                                    onClickOutSide={() => setPickedColor(0)}
                                />
                                : null
                        }
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="pick-color-group">
                        <span onClick={() => { setPickedColor(6) }} className="box-color" style={{ backgroundColor: values.text_color }}></span>
                        <div className="label-color">Text  </div>
                        {
                            pickedColor === 6 ?
                                <ColorPicker
                                    onSubmitColor={handleSubmitTextColor}
                                    onClickOutSide={() => setPickedColor(0)}
                                />
                                : null
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 col-sm-12">
                    <div className="pick-color-group">
                        <span onClick={() => { setPickedColor(7) }} className="box-color" style={{ backgroundColor: values.post_background_color }}></span>
                        <div className="label-color">Post background  </div>
                        {
                            pickedColor === 7 ?
                                <ColorPicker
                                    onSubmitColor={handleSubmitPostBackgroundColor}
                                    onClickOutSide={() => setPickedColor(0)}
                                />
                                : null
                        }
                    </div>
                </div>
            </div>
            <div className="col-md-6 mx-auto">
                <button onClick={handleSubmit} type="submit" name="submit" className="btn btn-success btn-block" defaultValue="Submit">Update</button>
            </div>
        </div>
    )
}


export default ChangeColorCommunity

