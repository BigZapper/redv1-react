import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import getBase64Image from '../../services/GetImage';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useCookies } from 'react-cookie';

ImageUpload.propTypes = {

};

function ImageUpload(props) {
    const [cookies, setCookie, removeCookie] = useCookies(['name']);

    const { open, acceptedFiles } = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true
    });

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                setDataUrl(reader.result);
            }
            reader.readAsDataURL(file);
            // console.log(dataUrl);
        })

    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));



    const [dataUrl, setDataUrl] = useState(props.avatar);
    function handleSubmit(e) {
        e.preventDefault();
        let avatarBase64 = getBase64Image(document.getElementById("down"));
        // let backgroundBase64 = getBase64Image(document.getElementById("up"));
        const config = {
            headers: {Authorization: `Bearer ${cookies.token}`}
        };
        var data = {
            first_name: props.first_name,
            last_name: props.last_name,
            location: props.location,
            bio: props.bio,
            email: props.email,
            background: null,
            avatar: avatarBase64
        }
        axios.post('http://127.0.0.1:8000/api/profile/update/', data, config).then(function (response) {
            if (response.status === 200) {
                window.location.reload(false)
            }
        })
            .catch(function (error) {

            });
    }

    return (
        <form onSubmit={handleSubmit} id="submit-image" encType="multipart/form-data">
            <div className="input-wrapper image-upload">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here</p>
                    <button className="btn btn-primary" type="button" onClick={open}>Open File Dialog</button>
                </div>
                <aside>
                    {/* <h4>Files</h4> */}
                    <ul>{files}</ul>
                    <img id="down" src={dataUrl} />
                </aside>
                <button type="submit" name="submit" className="btn btn-primary" defaultValue="Submit">Submit</button>
            </div>
        </form>
    );
}

export default ImageUpload;