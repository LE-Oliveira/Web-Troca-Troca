let ws;
async function startWebSocket(name, mail){
    ws = new ReconnectingWebSocket(webSocketURL);
    ws.onopen = function (event) {
        ws.send(JSON.stringify({tipo:"login", data: [name, mail]}));
        console.log(event);
    };
    ws.onmessage = function incoming(message){
        var m = JSON.parse(message.data);
        switch (m.tipo){
            case 'match':
                const opt = confirm(`O user ${m.data.FUser} deseja troca a figurinha ${m.data.FFig} pela sua figurinha ${m.data.SFig}. Deseja confirmar o match?`);
                if(opt){
                    alert(`Match confirmado, entre em contato com o user ${m.data.FUser} pelo email ${m.Email}`);
                    ws.send(JSON.stringify({tipo:"matched", data:[]}));
                }
                break;
        }
    }
    ws.onclose = function (event) {
        ws.send(JSON.stringify({tipo:"logout", data: name}));
    };
}
