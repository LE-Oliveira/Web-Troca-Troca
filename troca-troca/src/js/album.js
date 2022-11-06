async function album(name){
    $.ajax({
        url: restURL+"/album",
        crossDomain: true,
        type: "GET",
        headers: {
            username: name
        },
        success: async function(response){
            console.log(response);
            $("#list_album-container").empty();
            if(response.message == "Tem figurinha"){
                for (var i=0;i<response.fig[0].length;i++){
                    var img = "<img src=/static/"+(i+1)+".png width=10% height=auto>"
                    console.log(img);
                    $("#list_album-container").append(img)
                }
            }else{
                $("#list_album-container").append("<img src=/static/404nf.png width=70% height auto>");
            }
        },
        error: async function(error){console.log(error.responseJSON)}
    })
}