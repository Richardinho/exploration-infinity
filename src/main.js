var explorationInfinity = require('./infinite-scroll');

//  todo: make asynchronous call
var pagesService = [
	{  text : '0' },
	{  text : '1' },
	{  text : '2' },
	{  text : '3' },
	{  text : '4' },
	{  text : '5' },
	{  text : '6' },
	{  text : '7' },
	{  text : '8' },
	{  text : '9' },
	{  text : '10' }
];


explorationInfinity({
	getPage : function (pageIndex) {
		return pagesService[pageIndex];
	}
});