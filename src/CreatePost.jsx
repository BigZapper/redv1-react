import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import getCookie from './services/GetCookie';
import SuggestionInputSearch from 'suggestion-react-input-search';
import { useDropzone } from 'react-dropzone';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

// Hàm onSubmit để gửi request tạo post mới trong props
CreatePost.propTypes = {
    onSubmit: PropTypes.func,
};

CreatePost.defaultProps = {
    onSubmit: null
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function CreatePost(props) {
    const { onSubmit } = props;
    // Khai báo các values để gửi tới api
    const [values, setValues] = useState({
        title: '',
        content: '',
        type: 'article',
        community: props.community ? props.community : "",
        image: null
    });

    // Khai báo một state để lưu giá trị các communities nhận từ server
    const [listCommunities, setListCommunities] = useState([]);
    // Hàm gửi request các community mà user đang theo dõi
    function getListCommunity() {
        const config = {
            headers: { Authorization: `Bearer ${getCookie('token')}` }
        };
        axios.get('http://127.0.0.1:8000/api/community/user/list', config).then(res => {
            if (res.status === 200) {
                // setListCommunities(res.data.results.map(community => community.community_type));
                setListCommunities(res.data.results);
            }
        }).catch(function (error) {
        });
    }

    // Các hàm xử lý khi các input được nhập
    function handleContentChange(e) {
        setValues({
            ...values,
            content: e.target.value
        });
    }
    function hanleTitleChange(e) {
        setValues({
            ...values,
            title: e.target.value
        })
    }
    function handleChangeType(typeValue) {
        setValues({
            ...values,
            type: typeValue
        });
    }
    const [resCommunity, setResCommunity] = useState([]);
    function findCommunity(keyword){
        var res = []
        listCommunities.forEach(function(item, index, array){
            if(item.community_type.includes(keyword)){
                res.push(item);
            }
        })
        return res;
    }
    function handleChangeCommunity(e) {
        // var res = []
        // listCommunities.forEach(function(item, index, array){
        //     if(item.community_type.includes(e.target.value)){
        //         res.push(item);
        //     }
        // })
        setResCommunity(findCommunity(e.target.value));
        setValues({
            ...values,
            community: e.target.value
        });
        // console.log(values)
    }

    // useEffect(()=>{console.log(resCommunity)},[resCommunity])

    // Biến state để lưu hình ảnh được upload dưới dạng base64
    const [dataUrl, setDataUrl] = useState(null);

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
                // console.log(reader.result);
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


    // const onSelectFile = (event) => {
    //     event.preventDefault();
    //     if (event.target.files && event.target.files.length > 0) {
    //         // setValues({
    //         //     ...values,
    //         //     image: event.target.files[0]
    //         // });
    //         const reader = new FileReader();
    //         reader.addEventListener("load", () => {
    //             setDataUrl(reader.result);
    //         });
    //         reader.readAsDataURL(event.target.files[0]);
    //     }
    // };

    // Hàm xử lý khi click nút submit
    function handleSubmit(e) {
        e.preventDefault();
        if (!onSubmit) return;
        // let base64 = null;
        // if(values.type === 'image'){
        //     // base64 = getBase64Image(document.getElementById("down"));
        //     // base64 = getBase64Image(dataUrl);
        //     // console.log(base64);
        // }

        // Khai báo biến mới để gửi request, nhận giá trị từ state values
        const formValues = {
            title: values.title,
            content: values.content,
            type: values.type,
            community: values.community,
            image: dataUrl,
        };
        onSubmit(formValues);

        // Sau khi gửi api xong thì set lại giá trị rỗng cho state values
        setValues({
            title: '',
            content: '',
            type: '',
            community: '',
            image: null
        });
    }

    // Sau khi component được gọi nó sẽ gọi hàm để lấy danh sách các list mà user đang theo dõi
    useEffect(() => {
        getListCommunity();
    }, [])

    useEffect(() => {
        // var com = document.querySelectorAll(".suggest")[0];
        // if (com) {
        //     com.value = props.community ? props.community : "";
        //     console.log(com.value)
        // }
        if(props.community){
            setResCommunity(findCommunity(props.community))
            // console.log(props.community)
        }
        else
            setResCommunity(listCommunities)
    }, [listCommunities])

    return (
        <div className="page-user create-post">
            <h1 className="page-title">Submit Post</h1>
            <div className="profile-tabs">
                <div className="warrior-tab post-lists">
                    <div id="fullwidth">
                        <article className="post-8 page type-page status-publish hentry">
                            <form onSubmit={handleSubmit} id="submit-topic" encType="multipart/form-data">

                                <div className="input-wrapper">
                                    <label htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="post-title"
                                        name="title"
                                        placeholder="Title"
                                        value={values.title}
                                        onChange={hanleTitleChange}
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="title">
                                        Community
                                    </label>
                                    {
                                        typeof listCommunities !== 'undefined' && listCommunities.length > 0 ?
                                            <div className="choose-community">
                                                {/* <SuggestionInputSearch
                                                    onSubmitFunction={handleChangeCommunity}
                                                    recentSearches={listCommunities}
                                                    placeholder={"Search your community"}
                                                    inputClass={"suggest"}
                                                    autocompleteOnMatch={true}
                                                /> */}
                                                {/* <Autocomplete
                                                    id="combo-box-demo"
                                                    value={values.community}
                                                    onChange={handleChangeCommunity}
                                                    options={listCommunities}
                                                    getOptionLabel={(option) => option.community_type}
                                                    style={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                                                /> */}
                                                <input autocomplete="off" placeholder="Search your commnunity" type="text" name="" id="community-search" className="suggest" value={values.community} onChange={handleChangeCommunity} />
                                                <ul className="list-group seacrh">
                                                    {
                                                        resCommunity.map(community => (
                                                            // <li key={community.id} onClick={()=> setValues({...values, community: community.community_type})} class={values.community===community.community_type?"list-group-item active":"list-group-item"}>{community.community_type}</li>
                                                            <li key={community.id} onClick={() => setValues({ ...values, community: community.community_type })} className={values.community === community.community_type ? "list-group-item list-group-item-action flex-column align-items-start user-search active" : "list-group-item list-group-item-action flex-column align-items-start user-search"}>
                                                                <img src={community.avatar} alt="" className="search-avatar" />
                                                                <div className="meta-box">
                                                                    <div className="d-flex w-100 justify-content-between">
                                                                        <b className="mb-1">{community.community_type ? capitalizeFirstLetter(community.community_type) : null}</b>
                                                                        <p className="mb-1">@{community.community_type}</p>
                                                                    </div>
                                                                    <p className="mb-1">{community.member_count} members</p>
                                                                </div>

                                                            </li>
                                                        ))
                                                    }

                                                </ul>
                                            </div>
                                            : null
                                    }
                                    {/* <select value={values.community} onChange={handleChangeCommunity} name="story_category" id="story_category" className="topic-category">
                                        <option value={-1}>Select a Community</option>
                                        {listCommunities.map(community => (
                                            <option key={community.id} className="level-0" value={community.community_type} >{community.community_type}</option>
                                        ))}

                                    </select> */}
                                </div>
                                <div className="input-wrapper format text-center">
                                    <div>
                                        {/* Default inline 1*/}
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                id="article-type"
                                                name="inlineDefaultRadiosExample"
                                                checked={values.type === 'article'}
                                                onChange={() => handleChangeType("article")}
                                            />
                                            <label className="custom-control-label" htmlFor="article-type">Article</label>
                                        </div>
                                        {/* Default inline 2*/}
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                id="image-type"
                                                name="inlineDefaultRadiosExample"
                                                onChange={() => handleChangeType("image")}
                                            />
                                            <label className="custom-control-label" htmlFor="image-type">Image</label>
                                        </div>
                                        {/* Default inline 3*/}
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                id="url-type"
                                                name="inlineDefaultRadiosExample"
                                                onChange={() => handleChangeType("url")}
                                            />
                                            <label className="custom-control-label" htmlFor="url-type">URL</label>
                                        </div>
                                    </div>

                                </div>
                                {
                                    values.type === 'article' ?
                                        <div className="input-wrapper">
                                            <label htmlFor="description">
                                                <textarea
                                                    name="description"
                                                    id="post-desc"
                                                    rows={8}
                                                    placeholder="Enter your content"
                                                    required
                                                    value={values.content}
                                                    onChange={handleContentChange}
                                                />
                                            </label>
                                        </div>
                                        :
                                        values.type === 'image' ?

                                            <div className="input-wrapper image-upload">
                                                <div {...getRootProps({ className: 'dropzone' })}>
                                                    <input {...getInputProps()} />
                                                    <p>Drag 'n' drop some files here</p>
                                                    <button className="btn btn-warning join mt-2 mb-2" type="button" onClick={open}>Open File Dialog</button>
                                                </div>
                                                <aside>
                                                    <h4>Files</h4>
                                                    <ul>{files}</ul>
                                                    <img id="down" src={dataUrl} />
                                                </aside>
                                            </div>
                                            :
                                            values.type === 'url' ?
                                                <div className="input-wrapper">
                                                    <label htmlFor="url">
                                                        <input
                                                            type="text"
                                                            id="post-title"
                                                            name="url"
                                                            placeholder="Enter your URL"
                                                            value={values.content}
                                                            onChange={handleContentChange}
                                                        />
                                                        <input type="hidden" id="post-image" name="og-image" />
                                                    </label>
                                                </div>
                                                :
                                                null
                                }

                                <div className="input-wrapper text-center">
                                    <button type="submit" name="submit" className="btn btn-primary join" defaultValue="Submit">Submit</button>
                                    <button onClick={props.close} type="cancel" name="cancel" className="btn btn-danger join ml-2" defaultValue="Cancel">Cancel</button>
                                </div>
                            </form>
                        </article>
                        {/* START: Respond */}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CreatePost;