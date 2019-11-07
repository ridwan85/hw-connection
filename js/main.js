var myWebSocket;
function connectToWS(port) {
    myWebSocket = new WebSocket("ws://localhost:" + port);
    myWebSocket.onopen = function (evt) {
        console.log("onopen.");

    };

    myWebSocket.onclose = function (evt) {
        console.log("onclose.");
    };

    myWebSocket.onerror = function (evt) {
        console.log("Error!");
    };

    myWebSocket.onmessage = function (event) {
        var leng;
        if (event.data.size === undefined) {
            leng = event.data.length
        } else {
            leng = event.data.size
        }
        console.log("onmessage. size: " + leng + ", content: " + event.data);
    }

}



function sendData(msg){

    if(myWebSocket){
        myWebSocket.send(msg);
    }else{
        alert("Please open connection to the socket first");
    }
  
}

function sendDataToPrinter(count){
    var data_dummy = [{
        "area" : "P1",
        "section" : "P2",
        "concession_price" : 5,
        "tel_no" : "01920100123",
        "qr_code" : "JKJAMMXJJKW"
        "company_name" : "CATCH THAT BUS",
        "order_id": "MQRT190201",
        "time" : "12:00PM",
        "date" : "17/09/2019",
        "total_price" : 5,
        // "logo" : "http://localhost:1337/images/Johor.png",
        "paid_amount":5,
        "balance_amount" : 0
      }]

    var msg = JSON.stringify(data_dummy);
    if(myWebSocket){
        myWebSocket.send(msg);
    }else{
        alert("Please open connection to the socket first");
    }

}

function sendMsg() {
    var message = document.getElementById("myMessage").value;
    console.log(message);

    if(myWebSocket){
        myWebSocket.send(message);
    }else{
        alert("Please open connection to the socket first");
    }
   
}
function closeConn() {
    myWebSocket.close();
}
