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
            if(response.matches.length==0){
                $('#list_match-container').append("<p1>Nao há ninguém na cidade para fazer match com você</p1>");
            }
            else{
                for(var i=0;i<response.matches.length;i++){
                    var str = `<p>${response.matches[i]}</p>
                    <button class="matched_btn" id="matched_btn-match-${i}">Dar match</button>`;
                    $('#list_match-container').append(str);
                    selectElement(`matched_btn-match-${i}`).addEventListener("click", function(){alert(i)});
                }
            }
        },
        error: async function(error){console.log(error)}
    })
}

// async function matched(){
//     $.ajax({
//         url: restURL+"/match",
//         crossDomain: true,
//         type: "GET",
//         headers: {
//             username: name,
//             city: cidade
//         },
//         success: async function(response){ 
//             $('#list_match-container').empty();
//             if(response.matches.length==0){
//                 $('#list_match-container').append("<p1>Nao há ninguém na cidade para fazer match com você</p1>");
//             }
//             else{
//                 for(var i=0;i<response.matches.length;i++){
//                     var str = `<p>${response.matches[i]}</p>
//                     <button class="matched_btn" id="matched_btn-match-${i}">Dar match</button>`;
//                     $('#list_match-container').append(str);
//                     selectElement(`matched_btn-match-${i}`).addEventListener("click", function(){alert(i)});
//                 }
//             }
//         },
//         error: async function(error){console.log(error)}
//     })
// }