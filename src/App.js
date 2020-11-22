import React, {useEffect, useState} from 'react';
import LoginPopup from './components/login/LoginPopup';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Community from './Community';
import Home from './Home';
import TopMenu from './components/header/TopMenu';
import Dashboard from './Dashboard';
import CreatePost from './CreatePost';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Post from './components/post/Post';



function App() {

    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            // console.log(document.cookie);
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();

                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');
    
    const [cookies, setCookie, removeCookie] = useCookies(['name']);

    function handleLoginForm(formLogin) {

        // console.log(csrftoken);
        const data = {
            username: formLogin.uname,
            password: formLogin.pass
        };
        axios.post('http://127.0.0.1:8000/api/token/', data, {}).then(function (response) {
            console.log("response ", response);
            if(response.status){
                if (response.status === 200) {
                setCookie('token', response.data.access, { path: '/' });
                setTimeout(window.location.reload(false), 1000);
                }
            }
            else{
                
            }
            
        })
            .catch(function (error) {
                document.getElementById('message').innerHTML="Sai tên tài khoản hoặc mật khẩu!";
            });
    }
    const [isLogged, setIsLogged] = useState(false);

    const [profile, setProfile] = useState(null);
    function checkLogin() {
        const config = {
            headers: {Authorization: `Bearer ${cookies.token}`}
        };
        axios.get('http://127.0.0.1:8000/api/profile', config).then(res => {
            if(res.status === 200){
                setIsLogged(true);
            }
            setProfile(res.data.results[0]);
        }).catch(function (error) {
        });
    }

    function handleLogout(value){
        if(value === true){
            console.log("Logout");
            removeCookie('token', { path: '/' });
            window.location.reload(false);
        }
    }
    function handleSubmitPost(values){
        console.log(values);
        const config = {
            headers: {Authorization: `Bearer ${cookies.token}`}
        };
        const data = {
            title: values.title,
            content: values.content,
            type: values.type,
            community: values.community,
            image: values.image
        };
        axios.post('http://127.0.0.1:8000/api/post/create', data, config).then(res => {
            if(res.status === 201){
                window.location.pathname = "/";
            }
            setProfile(res.data.results[0]);
        }).catch(function (error) {
        });
    }
    useEffect(() => {
        checkLogin();
    }, []);
    return (
        <Router>
            <div>
                <div id="main-header">
                    <TopMenu isLogged={isLogged} onLogout={handleLogout} username={profile?profile.username:''} avatar={profile?profile.avatar:null }/>
                    <Switch>
                        <Route exact path='/' render={(props) => (<Home {...props} isAuthed={isLogged} cookie={cookies}/>)}/>
                        <Route exact path='/community/:community' render={(props) => (<Community {...props} isAuthed={isLogged} cookie={cookies} profile={profile?profile:null}/>)}/>
                        <Route exact path='/user/:username' render={(props) => (<Dashboard {...props} isAuthed={isLogged} cookie={cookies} profile={profile?profile:null}/>)}/>
                        <Route exact path='/submit' render={(props) => (<CreatePost {...props} onSubmit={handleSubmitPost} isAuthed={isLogged} cookie={cookies} profile={profile?profile:null}/>)}/>
                        <Route exact path='/:community/post/:idPost' render={(props) => (<Post {...props} isAuthed={isLogged} cookie={cookies} />)}/>
                    </Switch>
                </div>
                <LoginPopup onLogin={handleLoginForm}/>

            </div>
        </Router>
    );
}

export default App;
