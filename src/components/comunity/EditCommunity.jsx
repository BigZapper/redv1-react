import React from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useState } from 'react';

EditCommunity.propTypes = {

}
function EditCommunity(props) {
    const [cookies] = useCookies(['name']);
    const config = {
        headers: { Authorization: `Bearer ${cookies.token}` }
    };
    // const [pickedColor, setPickedColor] = useState(0); // 1: background; 2: title_background_color; 3: description_background_color; 4: button_background_color; 5: button_text_color; 6: text_color; 7: post_background_color
    const [values, setValues] = useState({
        description: props.description,
        rule: props.rule,
        // background_color: props.background_color,
        // title_background_color: props.title_background_color,
        // description_background_color: props.description_background_color,
        // button_background_color: props.button_background_color,
        // button_text_color: props.button_text_color,
        // text_color: props.text_color,
        // post_background_color: props.post_background_color
    })

    function handleDescriptionChange(e) {
        setValues({
            ...values,
            description: e.target.value
        });
    }

    function handleRuleChange(e) {
        setValues({
            ...values,
            rule: e.target.value
        });
    }

    function handleSubmit(e) {
        var data = {
            community_type: props.name,
            description: values.description,
            rule: values.rule,
            // background_color: values.background_color,
            // title_background_color: values.title_background_color,
            // description_background_color: values.description_background_color,
            // button_background_color: values.button_background_color,
            // text_color: values.text_color,
            // post_background_color: values.post_background_color
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
    return (
        <div className="row ">
            <div className="mx-auto">
                <div className="card mx-auto bg-light">
                    <div className="card-body bg-light">
                        <div className="containera">
                            <form onSubmit={handleSubmit} id="contact-form" role="form">
                                <div className="controls">
                                    <div className="row">

                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="form_message">Description </label>
                                                <textarea
                                                    type="text"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Description"
                                                    value={values.description}
                                                    onChange={handleDescriptionChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="form_message">Rule </label>
                                                <textarea
                                                    type="text"
                                                    id="rule"
                                                    name="rule"
                                                    placeholder="Rule"
                                                    value={values.rule}
                                                    onChange={handleRuleChange}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6 mx-auto">
                                            <button type="submit" name="submit" className="btn btn-success btn-block" defaultValue="Submit">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> {/* /.8 */}
            </div> {/* /.row*/}
        </div>
    )
}


export default EditCommunity

