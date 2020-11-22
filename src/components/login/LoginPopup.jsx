import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';

LoginPopup.propTypes = {
    onLogin: PropTypes.func,
    onRegister: PropTypes.func,
};

LoginPopup.defaultProps = {
    onLogin: null,
    onRegister: null
}

function showLoginTab() {
    document.getElementById('form-register').style.display = 'none';
    document.getElementById('form-login').style.display = 'block';
    document.getElementById('btn-reg-tab').classList.remove('active');
    document.getElementById('btn-login-tab').classList.add('active');
}
function showRegisterTab() {
    document.getElementById('form-register').style.display = 'block';
    document.getElementById('form-login').style.display = 'none';
    document.getElementById('btn-reg-tab').classList.add('active');
    document.getElementById('btn-login-tab').classList.remove('active');
}

function LoginPopup(props) {
    const { onLogin, onRegister } = props;
    const [uname, setUname] = useState('');
    const [password, setPassword] = useState('');

    function handleUnameChange(e) {
        setUname(e.target.value);
    }

    function handlePassChange(e) {
        setPassword(e.target.value);
    }

    function handleLogin(e) {
        e.preventDefault();
        //if(!onLogin) return;

        const formLogin = {
            uname: uname,
            pass: password
        };

        onLogin(formLogin);
        setUname('');
        setPassword('');
    }


    return (
        <div id="id01" className="modal">
            {/* Modal Content */}
            <div className="modal-content animate col-lg-4" >
                <div className="row justify-content-center">
                    <div className="col-3">
                        <button onClick={showLoginTab} type="button" id="btn-login-tab" className="btn btn-light btn-block active">LOGIN</button>
                    </div>
                    <div className="col-3">
                        <button onClick={showRegisterTab} type="button" id="btn-reg-tab" className="btn btn-light btn-block">REGISTER</button>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-3">

                    </div>
                </div>
                <form action="#" method='POST'>
                    <div id="form-login" className="container">
                        <label htmlFor="uname"><b>Username</b></label>
                        <input type="text" placeholder="Enter Username" name="uname" value={uname} onChange={handleUnameChange} required />
                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="password" value={password} onChange={handlePassChange} required />
                        <label id="message"></label>
                        <button type="submit" onClick={handleLogin}>Login</button>
                        <label>
                            <input type="checkbox" defaultChecked="checked" name="remember" /> Remember me
                    </label>
                    </div>
                </form>
                <form action="#" method='POST'>
                    <div id="form-register" className="container" style={{ display: 'none' }}>
                        <label htmlFor="uname"><b>Username</b></label>
                        <input type="text" placeholder="Enter Username" name="uname" required />
                        <label htmlFor="mail"><b>Email</b></label>
                        <input type="email" name="mail" placeholder="Enter Email" required />
                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="psw" required />
                        <label htmlFor="psw"><b>Enter password again</b></label>
                        <input type="password" placeholder="Enter Password" name="psw" required />
                        <button type="submit">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPopup;