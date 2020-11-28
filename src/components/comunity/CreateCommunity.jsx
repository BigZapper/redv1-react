import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useCookies } from 'react-cookie';
import ImageEdit from './ImageEdit';

CreateCommunity.propTypes = {
}

CreateCommunity.defaultProps = {
}

function CreateCommunity(props) {

    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const config = {
        headers: { Authorization: `Bearer ${cookies.token}` }
    };
    const [values, setValues] = useState({
        sub_community: "",
        community: "",
        description: "",
        rule: "",
        avatar: null,
        background: null
    });

    function postCommunity(values) {
        axios.post(`http://127.0.0.1:8000/api/community/create`, values, config).then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                window.location.reload(false);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    // Khai báo một state để lưu giá trị các communities nhận từ server
    const [listCommunities, setListCommunities] = useState([]);
    // Hàm gửi request các community mà user đang theo dõi
    useEffect(() => {
        function getListCommunity() {
            axios.get('http://127.0.0.1:8000/api/community/user/list', config).then(res => {
                if (res.status === 200) {
                    setListCommunities(res.data.results.map(community => community.community_type));
                }
            }).catch(function (error) {
            });
        }
        getListCommunity();
    }, [])

    function handleCommunityNameChange(e) {
        setValues({
            ...values,
            sub_community: e.target.value,
        })
    }

    function handleChangeParentCommunity(e) {
        setValues({
            ...values,
            community: e.target.value,
        })
    }

    function handleDescriptionChange(e) {
        setValues({
            ...values,
            description: e.target.value,
        })
    }

    function handleRuleChange(e) {
        setValues({
            ...values,
            rule: e.target.value,
        })
    }


    async function handleSubmitBackground(image) {
        if (image !== null) {
            await setValues({
                ...values,
                background: image
            });
        }
    }

    async function handleSubmitAvatar(image) {
        if (image !== null) {
            await setValues({
                ...values,
                avatar: image
            });
        }
    }


    function handleSubmit(e) {
        e.preventDefault();

        // Khai báo biến mới để gửi request, nhận giá trị từ state values
        var formValues = {
            community: values.sub_community,
            description: values.description,
            rule: values.rule,
            avatar: values.avatar,
            background: values.background
        }
        if (values.community !== '') {
            formValues = {
                community: values.community,
                sub_community: values.sub_community,
                description: values.description,
                rule: values.rule,
                avatar: values.avatar,
                background: values.background
            };
        }

        console.log(formValues);
        postCommunity(formValues);

        // Sau khi gửi api xong thì set lại giá trị rỗng cho state values
        setValues({
            sub_community: "",
            community: "",
            description: "",
            rule: "",
            avatar: null,
            background: null
        });
    }

    return (
        <div className="row create-community">
            <div className="mx-auto">
                <div className="card mx-auto bg-light">
                    <div className="card-body bg-light">
                        <div className="containera">
                            <form onSubmit={handleSubmit} id="contact-form" role="form">
                                <div className="controls">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="form_name">Background </label>
                                                {
                                                    values.background !== null ?
                                                        <img id="bkg" alt="crop" src={values.background} />
                                                        :
                                                        <ImageEdit type={"background"} handleSubmit={handleSubmitBackground} />
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="form_name">Avatar </label>
                                                {
                                                    values.avatar !== null ?
                                                        <img id="avt" alt="crop" src={values.avatar} />
                                                        :
                                                        <ImageEdit type={"avatar"} handleSubmit={handleSubmitAvatar} />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="form_name">Community name </label>
                                                        <input id="form_name"
                                                            type="text"
                                                            id="community-name"
                                                            name="community-name"
                                                            placeholder="Community Name"
                                                            value={values.sub_community}
                                                            onChange={handleCommunityNameChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="form_lastname">Parent Community </label>
                                                        <select value={values.community} onChange={handleChangeParentCommunity} name="story_category" id="story_category" className="topic-category">
                                                            <option value={-1}></option>
                                                            {listCommunities.map(community => (
                                                                <option key={community} className="level-0" value={community} >{community}</option>
                                                            ))}

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
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
                                                <div className="col-md-6 mx-auto">
                                                    <button type="button" name="cancel" className="btn btn-danger btn-block" defaultValue="Cancel" onClick={props.close}>Cancel</button>
                                                </div>
                                            </div>
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


export default CreateCommunity

