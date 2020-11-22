import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NewsFeed from './components/body/NewsFeed';
import SideBarCommunity from './components/body/SideBarCommunity';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import CommunityCover from './components/header/CommunityCover';
import { useState } from 'react';

function Community(props) {
  useEffect(() => {
    var modal = document.getElementById('id01');
    var popup = document.getElementsByClassName('login');
    var login_tab = document.getElementById('form-login');
    var register_tab = document.getElementById('form-register');
    var login_tab_btn = document.getElementById('btn-login-tab');
    var reg_tab_btn = document.getElementById('btn-reg-tab');



    function showPopup(event) {
      document.getElementById('id01').style.display = 'block';

      register_tab.style.display = 'none';
      login_tab.style.display = 'block';
      reg_tab_btn.classList.remove('active');
      login_tab_btn.classList.add('active');
      event.preventDefault()

    };

    for (var i = 0; i < popup.length; i++) {
      popup[i].addEventListener('click', showPopup, false);
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }

    reg_tab_btn.onclick = function () {
      login_tab.style.display = 'none';
      register_tab.style.display = 'block';
      login_tab_btn.classList.remove('active');
      reg_tab_btn.classList.add('active');
    }

    login_tab_btn.onclick = function () {
      register_tab.style.display = 'none';
      login_tab.style.display = 'block';
      reg_tab_btn.classList.remove('active');
      login_tab_btn.classList.add('active');
    }


  }, []);
  // console.log(props);
  let { community } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(['name']);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  var config = {};
  if (props.isAuthed) {
    config = {
      headers: { Authorization: `Bearer ${cookies.token}` },
      cancelToken: source.token
    };
  }


  const [communityDetail, setCommunityDetail] = useState({});
  function getCommunity() {
    const data = {
      "community": community
    }
    axios.post('http://127.0.0.1:8000/api/community/', data, config).then(res => {
      if (res.status === 200) {
        // console.log(res.data.results[0])
        setCommunityDetail(res.data.results[0]);
      }
    }).catch(function (error) {
    });
  }

  const [posts, setPosts] = useState({
    result: []
  });
  function getPosts() {
    axios.get(`http://127.0.0.1:8000/api/post/community/${community}`).then(res => {
      setPosts({
        result: res.data.results
      });

    }).catch(function (error) {
    });
  }

  const [color, setColor] = useState({
    background_color: communityDetail.background_color,
    title_background_color: communityDetail.title_background_color,
    description_background_color: communityDetail.description_background_color,
    button_background_color: communityDetail.button_background_color,
    button_text_color: communityDetail.button_text_color,
    text_color: communityDetail.text_color,
    post_background_color: communityDetail.post_background_color
  })
  function handleChangeDemoColor(values) {
    setColor({
      background_color: values.background_color,
      title_background_color: values.title_background_color,
      description_background_color: values.description_background_color,
      button_background_color: values.button_background_color,
      button_text_color: values.button_text_color,
      text_color: values.text_color,
      post_background_color: values.post_background_color
    })
  }

  useEffect(() => {
    getCommunity();
    getPosts();
  }, [props])

  useEffect(() => {
    setColor({
      background_color: communityDetail.background_color,
      title_background_color: communityDetail.title_background_color,
      description_background_color: communityDetail.description_background_color,
      button_background_color: communityDetail.button_background_color,
      button_text_color: communityDetail.button_text_color,
      text_color: communityDetail.text_color,
      post_background_color: communityDetail.post_background_color
    })
  }, [communityDetail])


  useEffect(() => {
    function setBackground() {
      document.body.style.backgroundColor = color.background_color;
      document.getElementById("container-community").style.backgroundColor = color.background_color;
      var post = document.getElementsByClassName("post");
      for (var i = 0; i < post.length; i++) {
        post[i].style.backgroundColor = color.post_background_color;
        post[i].style.color = color.text_color;
      }
      var title_bg = document.getElementsByClassName("section-title-about");
      for (var i = 0; i < title_bg.length; i++) {
        title_bg[i].style.backgroundColor = color.title_background_color;
      }
      
      var description_bg = document.getElementsByClassName("widget");
      for (var i = 0; i < description_bg.length; i++) {
        description_bg[i].style.backgroundColor = color.description_background_color;
      }
    };
    setBackground()
  }, [color])
  return (
    <div>
      <div id="main-header">

        <CommunityCover detail={communityDetail} isAuthed={props.isAuthed} name={community} onSubmitColor={handleChangeDemoColor} />
      </div>
      <div className="container" id="container-community">
        <div className="row">
          <NewsFeed posts={posts.result} isAuthed={props.isAuthed} name={community} />
          <SideBarCommunity isAuthed={props.isAuthed} cookie={cookies} community={community} />
        </div>
      </div>
    </div>
  );
}

export default Community;
