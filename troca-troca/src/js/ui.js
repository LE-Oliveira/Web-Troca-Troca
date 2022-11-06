$(document).ready(function(){goToLogin();})

selectElement("login_btn-login").addEventListener("click", function(){
    const user = selectElement("username-login").value;
    const pswd = selectElement("password-login").value;
    login(user, pswd)
})

selectElement("register_btn-register").addEventListener("click", function(){
    const user = selectElement("username-register").value;
    const pswd = selectElement("password-register").value;
    const city = selectElement("city-register").value;
    register(user, pswd, city);
    alert(user);
    goToLogin();    
})

selectElement("register_btn-login").addEventListener("click", function(){goToRegister();})

selectElement("login_btn-register").addEventListener("click", function(){ goToLogin();})

selectElement("logout_btn").addEventListener("click", function(){goToLogin();})

selectElement("album_btn").addEventListener("click", function(){goToAlbum();})

selectElement("match_btn").addEventListener("click", function(){goToMatch();})

selectElement("filter_btn-match").addEventListener("click", function(){goToMatch();})

selectElement("matched_btn-match").addEventListener("click", function(){teste();
})

function selectElement(id){
    return document.getElementById(id);
}

function teste(){
    alert("TESTE");
}

function goToLogin(){
    $("#login-container").show();
    $("#register-container").hide();
    $('#album-container').hide();
    $('#header-container').hide();
    $('#match-container').hide();
}

function goToRegister(){
    $("#register-container").show();
    $("#login-container").hide();
    $('#album-container').hide();
    $('#header-container').hide();
    $('#match-container').hide();
}

function goToAlbum(){
    $('#album-container').show();
    album(JSON.parse(localStorage.getItem("data"))[1]);
    $('#header-container').show();
    $("#register-container").hide();
    $("#login-container").hide();
    $('#match-container').hide();
}

function goToMatch(){
    const name = JSON.parse(localStorage.getItem("data"))[0];
    var city;
    const value = selectElement("city_filter-match").value;
    if(value != undefined){city = value;}
    else city = JSON.parse(localStorage.getItem("data"))[1];
    match(name, city);
    $('#match-container').show();
    $('#header-container').show();
    $("#login-container").hide();
    $("#register-container").hide();
    $('#album-container').hide();
}