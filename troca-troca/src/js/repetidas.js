async function repetidas(name){
    $.ajax({
        url: restURL+"/album",
        crossDomain: true,
        type: "GET",
        headers: {
            username: name,
            opt: "give"
        },
        success: async function(response){
            $("#list_repetidas-container").empty();
            if(response.message == "Tem figurinha"){
                for (var i=0;i<response.fig.length;i++){
                    var img = "<img src=/static/"+(response.fig[i])+".png width=10% height=auto>"
                    $("#list_repetidas-container").append(img)
                }
            }else{
                $("#list_repetidas-container").append("<img src=/static/404nf.png width=60% height auto>");
            }
        },
        error: async function(error){console.log(error)}
    })
}