"use strict";
// Websocket
let webSocketsServerPort = 1341;
let webSocketServer = require("websocket").server;
let http = require("http");
let server = http.createServer(function (request, response) {
  // Not important for us. We're writing WebSocket server, not HTTP server
});
let clients = [];

server.listen(webSocketsServerPort, function () {
  console.log(
    new Date() + " Server is listening on port " + webSocketsServerPort
  );
});

let wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket request is just
  // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

wsServer.on("request", function (request) {
  console.log(new Date() + " Connection from origin " + request.origin + ".");
  let connection = request.accept(null, request.origin);
  console.log(new Date() + " Connection accepted.");

  let index = clients.push(connection) - 1;

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
  console.log("ws msg:" + msg.utf8Data);
  createPdf(msg.utf8Data);
}

function onSending(msg) {
  console.log("uart msg:" + msg);
  for (let i = 0; i < clients.length; i++) clients[i].sendUTF(msg);
}

function createPdf(x) {
  // values = JSON.parse(values);
  // console.log("valuess----->", values);
  let print_option = 2;
  let execFile = require("child_process").exec;

  let pdf = require("html-pdf");

  let options1 = {
    height: "200mm",
    width: "80mm"
  };

  let express = require("express");
  let app = express();
  app.use(express.static(__dirname + "/images/"));

  let tickectdetails = {
    busticket: "BUS TICKET",
    header: {
      SEAT_NO: "SEAT NO",
      PNR_No: "PNR No"
    },
    body: {
      ROUTE: "ROUTE",
      DEPART_DATE: "DEPART DATE",
      DEPART_TIME: "DEPART TIME",
      SOLD_BY: "SOLD BY",
      Ticket_No: "Ticket No.",
      Name: "Name",
      Phone_No: "Phone No.",
      IC_Passport_No: "IC / Passport No.",
      Price: "Price"
    },
    termsandcondition: {
      header: "Terms & Conditions / Terma & Syarat",
      list: {
        list1: "Ticket sold is not refundable.",
        list2: "Please retain the ticket for inspection.",
        list3: "The company will not be responsible for the safety of luggage or personal items left on the bus",
        list4: "Please be on the bus 15 minutes before departure",
        list5: "The company will not be liable for any trip delay or vehicle transfer failure"
      }
    },
    footer: {
      company: "Terminal Klang Sentral(620831-A)",
      terminal: "KLANG SENTRAL BUS TERMINAL(TKS)",
      bus: "PERSIARAN KLANG SENTRAL 1/KU",
      hotline: "Hotline: +603 9212 1818",
      email: "feedback@klangsentral.com"
    }
  };

  var values = {
    departDate: "2019-11-05",
    departTime: "22:00:00",
    soldBy: "KTB",
    seatNo: 123,
    passportNumber :"AXALASKL",
    phoneNo:"1123566989",
    pnrNo: 345,
    TicketNo: "12345",
    name: "tester",
    source: {
      id: 35,
      name: "KLANG",
      code: "KLG",
      stateName: "Selangor",
      regionName: "Northern"
    },
    destination: {
      id: 32,
      name: "BUTTERWORTH",
      code: "BTW",
      stateName: null,
      regionName: "Central"
    },
    operator: {
      id: 11,
      integrationId: 6,
      name: "KTB TEST",
      company: "KTB TEST",
      code: "KTBTEST"
    },
    pax: 1,
    catGroups: {
      count: {
        adult: 1
      },
      sum: {
        adult: 36.7
      }
    },
    total: 36.7,
    insurance: {
      count: 1,
      amount: 0.5
    }
  };
  let styles = `<head>
  <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=1, user-scalable=no">
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:100,300,400,500,700,900" rel='stylesheet' type='text/css'>
  <style>
  html{
    padding:5px;
    font-family : 'arial';
  }
     
      .solid-border {
        border-top: 1px dotted black;
        border-bottom: 1px dotted black;
      }
      body {
        margin: 0;
        font-size: 11px;
        padding: 5px;
      }
    </style>
  </head>`;
  let divs = "";
  divs += `<div style="position:relative;margin:auto; padding-bottom: 5px; border-bottom: 1px dashed black;">
  <div style="/* display: flex; */">
 
  <div style="text-align:center">
  <img style="text-align:center" alt="Kisok klangsentral" src="http://klangsentral.com/img/klangsentral-logo.png" height="90px" width="auto">
  </div>
  
  <div style="text-align: center;flex->direction: column;font-weight: bold;align-self:center;">BUS TICKET<br></div>

</div>

<div class="solid-border" style="margin-top:20px;padding: 5px 0;/* text-align: center; */">
${tickectdetails.header.SEAT_NO}: ${values.seatNo}
    <div style="
    display: flex;
    float: right;
">

   <div style="float:right"> PNR NO : QSNQIL3 </div>
</div>
</div>
<div class="summary" style="
    border-bottom: 2px dotted black;
">
<div style="margin-top: 10px;text-align: center;font-weight: normal;">${values.operator.name}</div>

<div style="display: flex;flex-wrap: wrap;padding-bottom: 5px;">
    <div style="display:flex; flex-direction:row;width: 100%; margin-top: 5px;">

</div>

</div>   

<table style="font-size:12px;">
      <tr>
      
      <td style="width:200px; text-align:left; font-weight:bold;">
       Route
      </td>
      <td style="width:200px; text-align:right">
      ${values.source.name} -  
      ${values.destination.name}
      </td>
      </tr>

      <tr>
      <td style="width:200px; text-align:left; font-weight:bold">
      Depart Date
     </td>
     <td style="width:200px; text-align:right">
     ${values.departDate}
     </td>
     </tr>

     <tr>
     <td style="width:200px; text-align:left; font-weight:bold">
     Depart Time
    </td>
    <td style="width:200px; text-align:right">
    ${values.departTime}
    </td>
    </tr>

    <tr>
    <td style="width:200px; text-align:left; font-weight:bold">
    Sold By
   </td>
   <td style="width:200px; text-align:right">
   ${values.soldBy}
   </td>
   </tr>

   <tr>
   <td style="width:200px; text-align:left; font-weight:bold">
   Ticket No
  </td>
  <td style="width:200px; text-align:right">
  ${values.TicketNo}
  </td>
  </tr>

  <tr>
  <td style="width:200px; text-align:left; font-weight:bold">
  Name
 </td>
 <td style="width:200px; text-align:right">
 ${values.name}
 </td>
 </tr>

 <tr>
 <td style="width:200px; text-align:left; font-weight:bold">
 Phone No
</td>
<td style="width:200px; text-align:right">
${values.phoneNo}
</td>
</tr>

<tr>
<td style="width:200px; text-align:left; font-weight:bold">
 IC / Passport No
</td>
<td style="width:200px; text-align:right">
${values.passportNumber}
</td>
</tr>

<tr>
<td style="width:200px; text-align:left; font-weight:bold">
 Price
</td>
<td style="width:200px; text-align:right">
${values.total}
</td>

      </tr>
</table>
</div>



</div>
</div>
<div style="margin-top: 5px;">
<div style="text-align:cnter; font-weight: bold; font-size: 12px;">
    ${tickectdetails.termsandcondition.header}
</div>
<div>
<ol style="padding-left: 25px">
<li>${tickectdetails.termsandcondition.list.list1}</i></li>
<li>${tickectdetails.termsandcondition.list.list2}</i></li>
<li>${tickectdetails.termsandcondition.list.list3}<br>
<i>${tickectdetails.termsandcondition.list.list4}</i></li>
<li>${tickectdetails.termsandcondition.list.list5}</i></li>
<li>${tickectdetails.termsandcondition.list.list6}<br>
<i>${tickectdetails.termsandcondition.list.list7}</i></li>
</ol>
</div>
<div style="text-align:center; margin-top: 5px;">
<span style="font-weight: bold;">${tickectdetails.footer.company}</span><br>${tickectdetails.footer.terminal} <br>
${tickectdetails.footer.bus}<br>${tickectdetails.footer.hotline}<br>${tickectdetails.footer.email}
</div>
</div>
</div>`;

  let htm = `${styles}<body>${divs}</body>`;
  console.log(htm);
  pdf.create(htm, options1).toFile("./receipt.pdf", function (err, res) {
    if (err) {
      console.log(err);
    }
    console.log(res);
    onSending("printing");
    execFile('PDFtoPrinter.exe receipt.pdf "CUSTOM KPM180H Cutter" ');
  });
}

// createPdf('{}')