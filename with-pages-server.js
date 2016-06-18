var port = 6465;
var express = require('express');
var app = express();

app.use('/js', express.static(__dirname + '/with-paging/js'));
app.use('/css', express.static(__dirname + '/with-paging/css'));

app.get('/*', function(req, res){
  res.sendFile(__dirname + '/with-paging/index.html');
});

function start () {
	console.log('listening on port:', port);
}
app.listen(port, start);