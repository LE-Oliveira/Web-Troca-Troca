async function match(name, cidade){
    $.ajax({
        url: restURL+"/match",
        crossDomain: true,
        type: "GET",
        headers: {
            username: name,
            city: cidade
        },
        success: async function(response){
            $('#list_match-container').empty();
            console.log(response);
            if(response.matches.length==0){
                $('#list_match-container').append("<p1>Nao há ninguém na cidade para fazer match com você</p1>");
                $('#matched_btn-match').hide();
            }
            else{
                for(var i=0;i<response.matches.length;i++){
                    var str = `<p>${response.matches[i]}</p>
                    <button class="matched_btn" id="matched_btn-match">Dar match</button>`;
                    $('#list_match-container').append(str);
                    $('#matched_btn-match').show();
                }
            }
        },
        error: async function(error){console.log(error)}
    })
}