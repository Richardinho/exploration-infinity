var port = 6465;
var express = require('express');
var app = express();
const api = express();
const resultsService = require('./results.service.js');

app.set('view engine', 'ejs')

app.use('/js', express.static(__dirname + '/web/js'));
app.use('/css', express.static(__dirname + '/web/css'));

//  create an api here for sending back paginated results
app.use('/api', api);

app.get('*', function(req, res){
  res.render('index', {
    results: resultsService.getResults(req.query)
  });
});

function start () {
	console.log('listening on port:', port);
}

app.listen(port, start);
