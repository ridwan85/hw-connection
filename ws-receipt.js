
"use strict";
// Websocket
var webSocketsServerPort = 1341;
var webSocketServer = require("websocket").server;
var http = require("http");
var server = http.createServer(function (request, response) {
  // Not important for us. We're writing WebSocket server, not HTTP server
});
var clients = [];

server.listen(webSocketsServerPort, function () {
  console.log(
    new Date() + " Server is listening on port " + webSocketsServerPort
  );
});

var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket request is just
  // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

wsServer.on("request", function (request) {
  console.log(new Date() + " Connection from origin " + request.origin + ".");
  var connection = request.accept(null, request.origin);
  console.log(new Date() + " Connection accepted.");

  var index = clients.push(connection) - 1;

  // user sent some message
  connection.on("message", function (message) {
    onReceive(message);
  });

  // user disconnected
  connection.on("close", function (connection) {
    console.log("client disconnected");
  });
});

function onReceive(msg) {
  //console.log(msg);
  console.log("ws msg:" + msg.utf8Data);
  // print(msg.utf8Data);
//   var msgFromWeb = JSON.parse(msg.utf8Data);

  createPdf(msg.utf8Data);
}

function onSending(msg) {
  console.log("uart msg:" + msg);
  for (var i = 0; i < clients.length; i++) clients[i].sendUTF(msg);
}



function createPdf(data_dummy) {
  var data_dummy = JSON.parse(data_dummy);
  console.log("datas",data_dummy);
  var print_option = 2;
  var execFile = require("child_process").exec;

  var pdf = require("html-pdf");

  var options1 = {
    height: "100mm",
    width: "60mm"
  };
  //var json = JSON.parse(data);
  //console.log("data for print ticket", json);

  var express = require("express");
  var app = express();
  app.use(express.static(__dirname + "/images/"));

  var styles = `<head>
    <style>
        body {
            font-family: 'Lato', sans-serif;
            padding: 0;
            margin: 0;
        }
        .pb_before { page-break-before: always !important; position:relative !important; border:1px solid transparent; } /* Breaks page before of element */
        .pb_after  { page-break-after: always !important; } /* Breaks page after of element */
        .pbi_avoid { page-break-inside: avoid !important; } /* Avoid breaks page in element */
        .span1{
            position:absolute;
            left: 10px;
            font-size:2.3mm;
            font-weight:bold;
            top:0mm;
            width:55mm;
            text-align:center;
            
        }
        .span2{
          text-align: left;
          font-size:2.3mm;
          font-weight:bold;
          left: 10px;
        }
        .span3{
            position:absolute;
            left: 70mm;
            top:0mm;
            width:55mm;
            font-size:2.5mm;
            font-weight:bold;
        }
        .fontTitle{
          font-size:2.3mm; 
          font-weight:bold;
        }
        .fontPrice{
          font-size:2.3mm; 
          font-weight:bold; 
          text-align: right; 
          width: 100px;
        }
        div.flip-x {
            -webkit-transform: rotate(270deg);
            left:17mm;
            bottom:10mm;
            width:50mm;
            position:absolute;
        }
        div.flip-x-2 {
            -webkit-transform: rotate(270deg);
            left:22mm;
            bottom:10mm;
            width:50mm;
            position:absolute;
        }
    </style>
</head>`;

  //dummy data
  // var data_dummy = [{
  //   "area" : "P1",
  //   "section" : "P2",
  //   "concession_price" : 5,
  //   "tel_no" : "01132086314",
  //   "company_name" : "CATCH THAT BUS",
  //   "order_id": "MQRT190201",
  //   "time" : "12:00PM",
  //   "date" : "17/09/2019",
  //   "total_price" : 5,
  //   "logo" : "http://localhost:1337/images/Johor.png",
  //   "paid_amount":5,
  //   "balance_amount" : 0
  // }]
  
  var divs = "";
  var divItem = "";
  for (var i = 0; i < data_dummy.length; i++) {
    var json = data_dummy[i];
    var area = "P2";//json.item[i].area;
    var section = "P3"//json.item[i].section;
    var consession_price = 5;//json.item[i].concession_price;
    var consession_name = "Parking"//json.item[i].consession_name;
    var tel_no = json.tel_no;
    var company_name = json.company_name;
    var time = json.time;
    var date = json.date;
    var total_price = json.total_price;
    var order_id = json.order_id;
    //var logo = json.logo;
    var paid_amount = json.paid_amount;
    var balance_amount = json.balance_amount;

    console.log(total_price);

    divItem +=
      `
      <tr>
        <td class="fontTitle">${area} - ${section} (${consession_name})</td>
        <td class="fontPrice">RM ${consession_price.toFixed(2)}</td>
      </tr>
    `;
  }
  divs +=
    `
        <div class="pb_before">
            <div class="span1"> 
               
                <br>
                <br>
                <div style="text-align:'center'">
                <img src="http://localhost:3400?data=90192090123" style="width:50px;"/>
                </div>
               
                -----------------------------------------------------------------
                <br><br>
                ${company_name}
                <br>
                Tel No. : ${tel_no}
                <br>
                <br>
                - Invoice - 
                <br><br>
                Date : ${date}
                <br>
                Time : ${time}
                <br><br>
            
                ----------------------------------------------------------------
                <br>
                <div class="span2">
                  <table style="margin: 0px 10px">
                    ${divItem}
                  </table>
                </div>
                ----------------------------------------------------------------
                <div class="span2">
                  <table style="margin: 0px 10px">
                    <tr>
                      <td style="font-size:2.3mm; font-weight:bold; width: 132px;">Subtotal</td>
                      <td style="font-size:2.3mm; font-weight:bold; text-align: right; width: 100px;">RM ${total_price.toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
                -----------------------------------------------------------------
                <div class="span2">
                  <table style="margin: 0px 10px">
                    <tr>
                      <td style="font-size:2.5mm; font-weight:bold; width: 132px;">Total</td>
                      <td style="font-size:2.5mm; font-weight:bold; text-align: right; width: 100px;">RM ${total_price.toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
                <br>
                <div class="span2">
                  <table style="margin: 0px 10px">
                    <tr>
                      <td style="font-size:2.3mm; font-weight:bold; width: 130px;">Paid Cash</td>
                      <td style="font-size:2.3mm; font-weight:bold; text-align: right; width: 50px;">RM ${paid_amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="font-size:2.3mm; font-weight:bold; width: 130px;">Change Due</td>
                      <td style="font-size:2.3mm; font-weight:bold; text-align: right; width: 50px;">RM ${balance_amount.toFixed(2)}</td>
                    </tr>
                  </table>
                </div>

                ----------------------------------------------------------------
                <br><br>
                Thank you for using Catch That Bus
                <br>
                www.catchthatbus.com
                <br><br>
               
            </div>

       
        </div>`;
  // }

  var htm = `${styles}<body>${divs}</body>`;

  pdf.create(htm, options1).toFile("./receipt.pdf", function (err, res) {
    if (err) {
      console.log(err);
    }
    console.log(res);

    onSending("printing");

    execFile('PDFtoPrinter.exe receipt.pdf "CUSTOM K80" ');

  });
}
