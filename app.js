var port = 6464;
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/src'));
app.get('/*', function(req, res){
  res.sendFile(__dirname + '/src/index.html');
});
function start () {
	console.log('listening on port:', port);
}
app.listen(port, start);