import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
// import ImgDialog from './ImgDialog'
import getCroppedImg from './cropImage'
import getBase64Image from '../../services/GetImage';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useCookies } from 'react-cookie';

// const dogImg =
//     'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'

const AvatarEdit = (props) => {
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

    // const files = acceptedFiles.map(file => (
    //     <li key={file.path}>
    //         {file.path} - {file.size} bytes
    //     </li>
    // ));



    const [dataUrl, setDataUrl] = useState(props.avatar);
    function handleSubmit(e) {
        // e.preventDefault();
        // let avatarBase64 = getBase64Image(document.getElementById("down"));
        // let backgroundBase64 = getBase64Image(document.getElementById("up"));
        const config = {
            headers: { Authorization: `Bearer ${cookies.token}` }
        };

        var data = {}
        if (props.type === "avatar") {
            var data = {
                first_name: props.first_name,
                last_name: props.last_name,
                location: props.location,
                bio: props.bio,
                email: props.email,
                background: null,
                avatar: croppedImage
            }
        }
        else{
            var data = {
                first_name: props.first_name,
                last_name: props.last_name,
                location: props.location,
                bio: props.bio,
                email: props.email,
                background: croppedImage,
                avatar: null
            }
        }
        console.log(data);
        axios.post('http://127.0.0.1:8000/api/profile/update/', data, config).then(function (response) {
            if (response.status === 200) {
                window.location.reload(false)
            }
        })
            .catch(function (error) {
                // console.log(avatarBase64);
            });
    }
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const onCropComplete = async (_, croppedAreaPixels) => {
        // setCroppedAreaPixels(croppedAreaPixels)
        const croppedImage = await getCroppedImg(
            dataUrl,
            croppedAreaPixels,
            rotation
        )
        // console.log(croppedImage)
        setCroppedImage(croppedImage)
    }

    // const showCroppedImage = useCallback(async () => {
    //     try {
    //         const croppedImage = await getCroppedImg(
    //             dataUrl,
    //             croppedAreaPixels,
    //             rotation
    //         )
    //         // console.log(croppedImage)
    //         setCroppedImage(croppedImage)

    //     } catch (e) {
    //         console.error(e)
    //     }
    // }, [croppedAreaPixels, rotation])

    // const onClose = useCallback(() => {
    //     setCroppedImage(null)
    // }, [])



    return (
        <div>
            {dataUrl ? (
                <React.Fragment>
                    {
                        props.type === "avatar" ?
                            <div className="cropContainer">
                                <Cropper
                                    image={dataUrl}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={1 / 1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            :
                            <div className="cropContainer">
                                <Cropper
                                    image={dataUrl}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={30 / 9}
                                    // cropShape="round"
                                    // showGrid={false}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                    }

                    <div className="controls">
                        <div className="sliderContainer">
                            <Typography
                                variant="overline"
                                // classes="sliderLabel"
                            >
                                Zoom
                            </Typography>
                            <Slider
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                // classes="slider"
                                onChange={(e, zoom) => setZoom(zoom)}
                            />
                        </div>
                        <div className="sliderContainer">
                            <Typography
                                variant="overline"
                                // classes="sliderLabel"
                            >
                                Rotation
                            </Typography>
                            <Slider
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                // classes="slider"
                                onChange={(e, rotation) => setRotation(rotation)}
                            />
                        </div>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            // classes="cropButton"
                        >
                            Save
                        </Button>
                        {/* <button className="btn btn-primary" type="button" onClick={handleSubmit}>Save</button> */}
                        <img id="down" alt="crop" className="d-none" src={croppedImage} />
                    </div>
                    {/* <ImgDialog img={croppedImage} onClose={onClose} /> */}
                </React.Fragment>
            ) :
                <form id="submit-image" encType="multipart/form-data">
                    <div className="input-wrapper image-upload">
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here</p>
                            <button className="btn btn-primary" type="button" onClick={open}>Open File Dialog</button>
                        </div>
                        <aside>
                            {/* <h4>Files</h4> */}
                            {/* <ul>{files}</ul> */}
                        </aside>
                    </div>
                </form>
            }

        </div>
    )
}

export default AvatarEdit;