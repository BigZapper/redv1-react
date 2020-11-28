import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';
import { useCookies } from 'react-cookie';

ListCommunity.propTypes = {

}

function ListCommunity(props) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    var config = {
        cancelToken: source.token
    };
    if (props.isAuthed) {
        config = {
            headers: { Authorization: `Bearer ${cookies.token}` },
            cancelToken: source.token
        };
    }
    const [communityList, setCommunityList] = useState([]);
    const [values, setValues] = useState('');
    useEffect(() => {
        if (props.type === 'user') {
            axios.get('http://127.0.0.1:8000/api/community/user/list', config).then(res => {
                if (res.status === 200) {
                    setCommunityList(res.data.results);
                }
            }).catch(function (error) {
            });
        }
    }, [props.type])

    const [resCommunity, setResCommunity] = useState([]);

    useEffect(() => {
        setResCommunity(communityList);
    }, [communityList])

    function handleUnFollow(community) {
        const data = {
            community: community,
            action: "un_follow"
        }
        axios.post(`http://127.0.0.1:8000/api/community/action`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {

            }
        }).catch(function (error) {
        });
    }

    function handleFollow(community) {
        const data = {
            community: community,
            action: "follow"
        }
        axios.post(`http://127.0.0.1:8000/api/community/action`, data, config).then(res => {
            // console.log(res.data.results);
            if (res.status === 200) {

            }
        }).catch(function (error) {
        });
    }
    function findCommunity(keyword) {
        var res = []
        communityList.forEach(function (item, index, array) {
            if (item.community_type.includes(keyword)) {
                res.push(item);
            }
        })
        return res;
    }

    function handleChangeCommunity(e) {
        setResCommunity(findCommunity(e.target.value));
        setValues(e.target.value);
    }
    return (
        <div className="communities">
            <input autocomplete="off" placeholder="Search your commnunity" type="text" name="" id="community-search" className="suggest" value={values} onChange={handleChangeCommunity} />
            <ul className="list-group seacrh">
                {
                    resCommunity.map(community => (
                        // <li key={community.id} onClick={()=> setValues({...values, community: community.community_type})} class={values.community===community.community_type?"list-group-item active":"list-group-item"}>{community.community_type}</li>
                        <a href={"/community/" + community.community_type} key={community.id} className={values.community === community.community_type ? "list-group-item list-group-item-action flex-column align-items-start user-search active" : "list-group-item list-group-item-action flex-column align-items-start user-search"}>
                            <img src={community.avatar} alt="" className="search-avatar" />
                            <div className="meta-box">
                                <div className="d-flex w-100 justify-content-between">
                                    <b className="mb-1">{community.community_type ? capitalizeFirstLetter(community.community_type) : null}</b>
                                    <p className="mb-1">@{community.community_type}</p>
                                </div>
                                <p className="mb-1">{community.member_count} members</p>
                            </div>

                        </a>
                    ))
                }
            </ul>

            {/* community.is_following ?
                                        <a onClick={() => handleUnFollow(community.community_type)} className="btn btn-primary joined" href="# " role="button">{"Unfollow"}</a>
                                        :
                                        <a onClick={() => handleFollow(community.community_type)} className="btn btn-primary join" href="# " role="button">{"Follow"}</a> */}
            <div className="text-center">
                <button onClick={props.close} type="button" className="btn btn-danger join">CLOSE</button>
            </div>
        </div>
    )
}

export default ListCommunity

