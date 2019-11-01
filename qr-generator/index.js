//simple qrcode generator express for hrdf project

const express = require('express')
const app = express();
var port = 3400;

app.get('/', (req, res) => {

    var data = req.query.data;

    var qr = require('qr-image');

    var qr_svg = qr.image('I love QR!', { type: 'svg' });
    qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));

    var svg_string = qr.imageSync(data, { type: 'png' });
    res.send(svg_string);
})

app.listen(port, () => console.log('Example app listening on port ' + port + ' !'))