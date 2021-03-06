import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ListCommunity from '../comunity/ListCommunity'
import Popup from 'reactjs-popup';

LoggedUser.propTypes = {
    onLogout: PropTypes.func,
};

LoggedUser.defaultProps = {
    onLogout: null
}

function LoggedUser(props) {
    // console.log(props)
    function handleLogout() {
        axios.get('http://127.0.0.1:8000/api/logout').then(res => {
            if (res.status === 200) {
                if (!props.onLogout) return;
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
                    <a href={'/user/' + props.username} className="dropdown-item">Profile</a>
                    <Popup
                        modal
                        trigger={
                            <a href="# " className="dropdown-item">Following</a>
                        }
                    >
                        {
                            close => (
                                <div className="list-community">
                                    <h1 className="page-title">Following Community</h1>
                                    <ListCommunity
                                        type={"user"}
                                        isAuthed={true}
                                        close={close}
                                    />
                                </div>
                            )
                        }
                    </Popup>

                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" onClick={handleLogout}>Logout</a>
                </div>
            </div>

        </div>
    );
}

export default LoggedUser;