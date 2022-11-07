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

selectElement("repetidas_btn").addEventListener("click", function(){goToRepetidas();})

selectElement("match_btn").addEventListener("click", function(){goToMatch();})

selectElement("filter_btn-match").addEventListener("click", function(){goToMatch();})

selectElement("add-fig_btn").addEventListener("click", function(){goToAddFig();})

selectElement("add-fig_btn-add").addEventListener("click", function(){addFig();})

function selectElement(id){
    return document.getElementById(id);
}

function goToLogin(){
    $("#login-container").show();
    $("#register-container").hide();
    $('#album-container').hide();
    $('#header-container').hide();
    $('#match-container').hide();
    $('#add-fig-container').hide();
    $('#repetidas-container').hide();
}

function goToRegister(){
    $("#register-container").show();
    $("#login-container").hide();
    $('#album-container').hide();
    $('#header-container').hide();
    $('#match-container').hide();
    $('#add-fig-container').hide();
    $('#repetidas-container').hide();
}

function goToAlbum(){
    album(JSON.parse(localStorage.getItem("data"))[0]);
    $('#album-container').show();
    $('#header-container').show();
    $("#register-container").hide();
    $("#login-container").hide();
    $('#match-container').hide();
    $('#add-fig-container').hide();
    $('#repetidas-container').hide();
}

function goToRepetidas(){
    repetidas(JSON.parse(localStorage.getItem("data"))[0]);
    $('#repetidas-container').show();
    $('#header-container').show();
    $('#album-container').hide();
    $("#register-container").hide();
    $("#login-container").hide();
    $('#match-container').hide();
    $('#add-fig-container').hide();
}

function goToAddFig(){
    $('#add-fig-container').show();
    $('#header-container').show();
    $("#register-container").hide();
    $("#login-container").hide();
    $('#match-container').hide();
    $('#album-container').hide();
    $('#repetidas-container').hide();
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
    $('#add-fig-container').hide();
    $('#repetidas-container').hide();
}

