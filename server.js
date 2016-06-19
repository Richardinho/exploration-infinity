var port = 6465;
var express = require('express');
var app = express();

app.use('/js', express.static(__dirname + '/web/js'));
app.use('/css', express.static(__dirname + '/web/css'));

app.get('/*', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

function start () {
	console.log('listening on port:', port);
}
app.listen(port, start);