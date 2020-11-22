import React from 'react';
// import PropTypes from 'prop-types';
import { useState } from 'react';
// import getBase64Image from '../../services/GetImage';
import axios from 'axios';
import { useCookies } from 'react-cookie';

Edit.propTypes = {

};

function Edit(props, { close }) {
    const [values, setValues] = useState({
        firstname: props.first_name,
        lastname: props.last_name,
        location: props.location,
        biography: props.bio,
        email: props.email,
        // avatar: null,
        // background: null
    });
    // const [dataUrlAvatar, setDataUrlAvatar] = useState(null);
    // const [dataUrlBackground, setDataUrlBackground] = useState(null);

    function handleFirstNameChange(e) {
        setValues({
            ...values,
            firstname: e.target.value
        });
    }
    function handleLastNameChange(e) {
        setValues({
            ...values,
            lastname: e.target.value
        });
    }
    function handleLocationChange(e) {
        setValues({
            ...values,
            location: e.target.value
        });
    }
    function handleBioChange(e) {
        setValues({
            ...values,
            biography: e.target.value
        });
    }
    function handleEmailChange(e) {
        setValues({
            ...values,
            email: e.target.value
        });
    }
    // const onSelectAvatar = (event) => {
    //     event.preventDefault();
    //     if (event.target.files && event.target.files.length > 0) {
    //         // setValues({
    //         //     ...values,
    //         //     image: event.target.files[0]
    //         // });
    //         const reader = new FileReader();
    //         reader.addEventListener("load", () => {
    //             setDataUrlAvatar(reader.result);
    //         });
    //         reader.readAsDataURL(event.target.files[0]);
    //     }
    // };
    // const onSelectBackground = (event) => {
    //     event.preventDefault();
    //     if (event.target.files && event.target.files.length > 0) {
    //         // setValues({
    //         //     ...values,
    //         //     image: event.target.files[0]
    //         // });
    //         const reader = new FileReader();
    //         reader.addEventListener("load", () => {
    //             setDataUrlBackground(reader.result);
    //         });
    //         reader.readAsDataURL(event.target.files[0]);
    //     }
    // };
    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    function handleSubmit() {
        // let avatarBase64 = getBase64Image(document.getElementById("down"));
        // let backgroundBase64 = getBase64Image(document.getElementById("up"));
        const config = {
            headers: {Authorization: `Bearer ${cookies.token}`}
        };
        var data = {
            first_name: values.firstname,
            last_name: values.lastname,
            location: values.location,
            bio: values.biography,
            email: values.email,
            background: null,
            avatar: null
        }
        axios.post('http://127.0.0.1:8000/api/profile/update/', data, config).then(function (response) {
            if (response.status === 200) {
                // alert(response.status);
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
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="form_name">Firstname </label>
                                                <input id="form_name"
                                                    type="text"
                                                    id="first-name"
                                                    name="first-name"
                                                    placeholder="First Name"
                                                    value={values.firstname}
                                                    onChange={handleFirstNameChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="form_lastname">Lastname </label>
                                                <input
                                                    type="text"
                                                    id="last-name"
                                                    name="last-name"
                                                    placeholder="Last Name"
                                                    value={values.lastname}
                                                    onChange={handleLastNameChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="form_email">Email </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={values.email}
                                                    onChange={handleEmailChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="form_location">Location </label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    name="location"
                                                    placeholder="Location"
                                                    value={values.location}
                                                    onChange={handleLocationChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="form_message">Biography </label>
                                                <textarea
                                                    type="text"
                                                    id="biography"
                                                    name="biography"
                                                    placeholder="Biography"
                                                    value={values.biography}
                                                    onChange={handleBioChange}
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


        // <article className="edit-profile popup">
        //     <form onSubmit={handleSubmit} id="edit-profile" encType="multipart/form-data">

        //         <div className="input-wrapper">
        //             <label htmlFor="first-name">
        //                 <input
        //                     type="text"
        //                     id="first-name"
        //                     name="first-name"
        //                     placeholder="First Name"
        //                     value={values.firstname}
        //                     onChange={handleFirstNameChange}
        //                 />
        //                 <input type="hidden" id="post-image" name="og-image" />
        //             </label>
        //         </div>
        //         <div className="input-wrapper">
        //             <label htmlFor="last-name">
        //                 <input
        // type="text"
        // id="last-name"
        // name="last-name"
        // placeholder="Last Name"
        // value={values.lastname}
        // onChange={handleLastNameChange}
        //                 />
        //             </label>
        //         </div>
        //         <div className="input-wrapper">
        //             <label htmlFor="location">
        //                 <input
        //                     type="text"
        //                     id="location"
        //                     name="location"
        //                     placeholder="Location"
        //                     value={values.location}
        //                     onChange={handleLocationChange}
        //                 />
        //             </label>
        //         </div>
        //         <div className="input-wrapper">
        //             <label htmlFor="biography">
        //                 <input
        //                     type="text"
        //                     id="biography"
        //                     name="biography"
        //                     placeholder="Biography"
        //                     value={values.biography}
        //                     onChange={handleBioChange}
        //                 />
        //             </label>
        //         </div>
        //         <div className="input-wrapper">
        //             <label htmlFor="email">
        //                 <input
        //                     type="email"
        //                     id="email"
        //                     name="email"
        //                     placeholder="Email"
        //                     value={values.email}
        //                     onChange={handleEmailChange}
        //                 />
        //             </label>
        //         </div>
        //         <div className="input-wrapper image-upload">
        //             <div className="file-upload-wrapper image-upload">
        //                 <img id="down" className="d-none" src={dataUrlAvatar} />
        //                 <input type="file" id="input-avatar" className="file-upload" onChange={onSelectAvatar} />
        //             </div>
        //         </div>
        //         <div className="input-wrapper image-upload">
        //             <div className="file-upload-wrapper image-upload">
        //                 <img id="up" className="d-none" src={dataUrlBackground} />
        //                 <input type="file" id="input-background" className="file-upload" onChange={onSelectBackground} />
        //             </div>
        //         </div>
        //         <button type="submit" name="submit" className="btn btn-primary" defaultValue="Submit">Submit</button>
        //         <div className="loading" />
        //     </form>
        // </article>
    );
}

export default Edit;