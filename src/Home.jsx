import React, { useEffect, useState } from 'react';
import './App.css'; import NewsFeed from './components/body/NewsFeed';
import SideBar from './components/body/SideBar';
import TrendingBar from './components/header/TrendingBar';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function Home(props) {
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

    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    // State để filter post
    const [postFilter, setPostFilter] = useState(0); //0: Hot; 1: New; 2: Best; 3: Top
    // State để lưu danh sách các post
    const [posts, setPosts] = useState({
        result: []
    });
    var config = {
        headers: { Authorization: `Bearer ${cookies.token}` },
        cancelToken: source.token
    };


    useEffect(()=>{
        document.body.style.backgroundColor = "#30363C";
    },[])
    // Sau khi component được gọi, nó sẽ gọi api để lấy danh sách các post
    useEffect(() => {
        // console.log(postFilter)
        if (postFilter === 2) {
            const data = {
                sort: "best",
            }
            axios.post('http://127.0.0.1:8000/api/post/', data, config).then(res => {
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        if (postFilter === 0) {
            axios.get('http://127.0.0.1:8000/api/post').then(res => {
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        if (postFilter === 1) {
            axios.get('http://127.0.0.1:8000/api/post/recent').then(res => {
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        if (postFilter === 3) {
            // config =  {
            //     headers: { Authorization: `Bearer ${props.cookie.token}` },
            //     cancelToken: source.token
            // };
            var d = new Date();
            d.setHours(0, 0, 0);

            const data = {
                from_timestamp: Math.round(d.getTime() / 1000),
                to_timestamp: Math.round(Date.now() / 1000)
            }
            axios.post('http://127.0.0.1:8000/api/post/top', data, config).then(res => {

                console.log(posts);
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        if (postFilter === 4) {
            var d = new Date();
            d.setDate(d.getDate() - 7);

            const data = {
                from_timestamp: Math.round(d.getTime() / 1000),
                to_timestamp: Math.round(Date.now() / 1000)
            }
            axios.post('http://127.0.0.1:8000/api/post/top', data, config).then(res => {
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        if (postFilter === 5) {
            var d = new Date();
            d.setDate(d.getDate() - 30);
            const data = {
                from_timestamp: Math.round(d.getTime() / 1000),
                to_timestamp: Math.round(Date.now() / 1000)
            }
            axios.post('http://127.0.0.1:8000/api/post/top', data, config).then(res => {
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        if (postFilter === 6) {
            var d = new Date();
            d.setFullYear(d.setFullYear() - 1);
            const data = {
                from_timestamp: Math.round(d.getTime() / 1000),
                to_timestamp: Math.round(Date.now() / 1000)
            }
            axios.post('http://127.0.0.1:8000/api/post/top', data, config).then(res => {
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        if (postFilter === 7) {
            var d = new Date();
            d.setFullYear(d.setFullYear() - 1);
            const data = {
                from_timestamp: Math.round(d.getTime() / 1000),
                to_timestamp: Math.round(Date.now() / 1000)
            }
            axios.post('http://127.0.0.1:8000/api/post/top', data, config).then(res => {
                setPosts({
                    result: res.data.results
                });
                // Nếu có trang sau thì lưu vào state nextUrl để tiếp tục gọi
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }

            }).catch(function (error) {
            });
        }
        return () => {
            source.cancel();
        };

    }, [postFilter]);

    // State để lưu các post ở trang tiếp theo
    const [nextPosts, setNextPosts] = useState([]);
    const [isEnd, setIsEnd] = useState(false);
    //State lưu url của page tiếp theo (nếu có)
    const [nextUrl, setNextUrl] = useState(null);

    //Hàm để load thêm post, được gọi mỗi khi component NewsFeed srcoll đến gần cuối
    function handleLoadMore() {
        //Nếu có url của trang tiếp theo thì gọi tới api của trang này để lấy danh sách các post
        if (nextUrl !== null) {
            const config = {
                headers: { Authorization: `Bearer ${props.cookie.token}` },
                cancelToken: source.token
            };
            axios.get(nextUrl, config).then(res => {
                setNextPosts(res.data.results);

                // Nếu trang này có trang tiếp theo nữa thì lưu tiếp vào state
                if (res.data.next !== null) {
                    setNextUrl(res.data.next);
                }
                // Nếu không thì null
                if (res.data.next === null) {
                    setNextUrl(null);
                }

            }).catch(function (error) {
                if (error.response.next === null)
                    setIsEnd(true);
            });
        }

    }

    // Hàm để thay đổi filter
    function handleChangeFilter(value) {
        // console.log(value)
        setPostFilter(parseInt(value));
    }
    return (
        <div>
            <div id="main-header">

                <TrendingBar />
            </div>
            <div className="container">
                <div className="row">
                    <NewsFeed
                        posts={posts.result}
                        nextPosts={nextPosts}
                        isAuthed={props.isAuthed}
                        cookie={props.cookie}
                        onLoadMore={handleLoadMore}
                        onChangeFilter={handleChangeFilter}
                        isEnd={isEnd}
                        color={null}
                    />
                    <SideBar cookie={props.cookie} isAuthed={props.isAuthed} />
                </div>
            </div>

        </div>
    );
}

export default Home;
