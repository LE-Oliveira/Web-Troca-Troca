async function register(name, pswd, cidade){
    document.getElementById('username-register').value = '';
    document.getElementById('city-register').value = '';
    document.getElementById('password-register').value = '';
    $.ajax({
        url: restURL+"/register",
        crossDomain: true,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            username: name,
            city: cidade,
            password: pswd
        }),
        success: async function(response){
            console.log(response);
        },
        error: async function(error){console.log(error)}
    })
}