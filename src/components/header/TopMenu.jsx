import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoggedUser from '../login/LoggedUser';
import NotLoginBtn from '../login/NotLoginBtn';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';


TopMenu.propTypes = {
    onLogout: PropTypes.func,
};

TopMenu.defaultProps = {
    onLogout: null
}

function TopMenu(props) {
    const { isLogged } = props;
    // api/profile
    // request  check if current user profile is accessable
    // if current user profile is not accessable > show login component else > show user avatar
    // check by status 401
    //useState + useEffect > condition by didLookUp and setDidLookUp (false) > set = true if first request being sended
    //const [avatar, setAvartar] = useState(null);
    function handleLogout(value) {
        if (!props.onLogout) return;
        props.onLogout(value);
    }

    const [searchResults, setSearchResults] = useState([]);
    const [isClickOutSide, setIsClickOutSide] = useState(false);
    const [filter, setFilter] = useState({
        page_size: 5,
        key_word: '',
        search_type: ''
    })

    function handleFiltersChange(newFilters) {
        console.log(newFilters);
        setFilter({
            ...filter,
            key_word: newFilters.searchTerm,
            search_type: newFilters.searchType
        })
    }
    const [isFocus, setIsFocus] = useState(false)
    function handleIsFocus(value) {
        setIsFocus(value);
        // console.log(value);
    }
    useEffect(() => {
        async function fecthPostList() {
            axios.post('http://127.0.0.1:8000/api/search/', filter).then(res => {
                if (res.status === 200) {
                    // console.log(res.data.results);
                    setSearchResults(res.data.results);
                }
            }).catch(function (error) {
            });
        }
        fecthPostList();
        // console.log(searchResults);
    }, [filter])
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top">
            <Link className="navbar-brand" to="/">Voteria</Link>
            <div className="search">
                <SearchForm onSubmit={handleFiltersChange} onFocus={handleIsFocus} />
                {
                    isFocus === true ?
                    filter.key_word !== '' ?
                        <SearchResult
                            results={searchResults}
                            type={filter.search_type}
                            onClickOutSide={() => setIsFocus(false)}
                        />
                        : null
                    :null
                }
            </div>


            {isLogged ? <LoggedUser onLogout={handleLogout} username={props.username} avatar={props.avatar} /> : <NotLoginBtn />}
            {/* {avatar == null ? {component load}} */}
            {/* User avatar componet set by state of user avatar */}
            {/* login componet set by state of user avvatar(null) */}
            {/* <LoggedUser/> */}

        </nav>

    );
}

export default TopMenu;