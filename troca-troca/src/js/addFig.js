async function addFig(){
    const fid = parseInt(document.getElementById('id-sticker').value);
    const name = JSON.parse(localStorage.getItem("data"))[0];
    $.ajax({
        url: restURL+"/createStickerPerson",
        crossDomain: true,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            username: name,
            fidSticker: fid
        }),
        success: async function(response){
            alert(`Figura ${fid} adicionada com sucesso`);
            console.log(response);
        },
        error: async function(error){
            console.log(error);
            alert(error.responseJSON.message);
        }
    })
    document.getElementById('id-sticker').value = '';
}