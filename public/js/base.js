document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById('id01');
    var popup = document.getElementsByClassName('login');
    var login_tab = document.getElementById('form-login');
    var register_tab = document.getElementById('form-register');
    var login_tab_btn = document.getElementById('btn-login-tab');
    var reg_tab_btn = document.getElementById('btn-reg-tab');

    var post_popup = document.getElementsByClassName('open-post');
    var black_background = document.getElementById('background');


    showPostPopup = function(event){
        document.getElementById('post-popup').style.display='block';
        black_background.classList.add('black-background');
        event.preventDefault()
    }
    removePostPopup = function(){
        document.getElementById('post-popup').style.display='none';
        black_background.classList.remove('black-background');
    }
    black_background.onclick = function(){
        removePostPopup()
    }
    for (let i = 0; i < post_popup.length; i++) {
        post_popup[i].addEventListener('click', showPostPopup, false);        
    }

    var showPopup = function(event) {
        document.getElementById('id01').style.display='block';
        
        register_tab.style.display='none';
        login_tab.style.display='block';
        reg_tab_btn.classList.remove('active');
        login_tab_btn.classList.add('active');
        event.preventDefault()

    };

    for (var i = 0; i < popup.length; i++) {
        popup[i].addEventListener('click', showPopup, false);
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    reg_tab_btn.onclick = function(){
        login_tab.style.display='none';
        register_tab.style.display='block';
        login_tab_btn.classList.remove('active');
        reg_tab_btn.classList.add('active');
    }

    login_tab_btn.onclick = function(){
        register_tab.style.display='none';
        login_tab.style.display='block';
        reg_tab_btn.classList.remove('active');
        login_tab_btn.classList.add('active');
    }
}, false)