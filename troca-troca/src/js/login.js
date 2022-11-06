async function login(name, pswd){
    document.getElementById('username-login').value = '';
    document.getElementById('password-login').value = '';
    $.ajax({
        url: restURL+"/login",
        crossDomain: true,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            name: name,
            password: pswd
        }),
        success: async function(response){
            localStorage.setItem("data", JSON.stringify(response));
            goToAlbum();
        },
        error: async function(error){
            alert(error.responseJSON);
        }
    })
}
