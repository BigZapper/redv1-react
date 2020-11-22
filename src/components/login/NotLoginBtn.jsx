import React from 'react';
import PropTypes from 'prop-types';

NotLoginBtn.propTypes = {

};

function NotLoginBtn(props) {
    return (
        <div className="btn-login">
            <a href="#  " className="login"><i className="fa fa-user" aria-hidden="true" /> Login</a>
        </div>
    );
}

export default NotLoginBtn;