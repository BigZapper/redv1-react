import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

LoggedUser.propTypes = {
    onLogout: PropTypes.func,
};

LoggedUser.defaultProps = {
    onLogout: null
}

function LoggedUser(props) {
    // console.log(props)
    function handleLogout(){
        axios.get('http://127.0.0.1:8000/api/logout').then(res => {
            if(res.status === 200){
                if(!props.onLogout) return;
                props.onLogout(true);
            }
        }).catch(function (error) {
        });
    }
    return (
        <div className="user-container">
                <div className="dropdown user">
                    <button type="button" className="btn btn-primary dropdown-toggle user-btn" data-toggle="dropdown">
                        <img className='avatar small' src={props.avatar}></img>
                        <p className='name-avatar'>{props.username} </p>
                    </button>
                    <div className="dropdown-menu">
                        <a href={'/user/'+props.username} className="dropdown-item">Profile</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
                
            </div>
    );
}

export default LoggedUser;