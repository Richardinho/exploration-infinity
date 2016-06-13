var explorationInfinity = require('./infinite-scroll');

//  todo: make asynchronous call
var pagesService = [
	{  text : '0', type : 'large' },
	{  text : '1', type : 'small' },
	{  text : '2', type : 'medium' },
	{  text : '3', type : 'small' },
	{  text : '4', type : 'medium' },
	{  text : '5', type : 'small' },
	{  text : '6', type : 'large' },
	{  text : '7', type : 'medium' },
	{  text : '8', type : 'small' },
	{  text : '9', type : 'large'},
	{  text : '10', type : 'medium' }
];



function getSmallText(text) {
	return '<h1>' + text + '</h1><p>At vero eos et accusamus et <img src="pieta.jpg">iusto odio dignissimos vo est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p><p> Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>'

}
function getMediumText(text) {

	return '<h1>' + text + '</h1><p>At vero eo et dolorum er quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut</p><p> officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et <img src="delfic.jpg">molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores</p><p> alias consequatur aut perferendis doloribus asperiores repellat.</p>';
}
function getLargeText(text) {

	return '<h1>' + text + '</h1><p>At vero eos e atque tiae non recusandae. Itaque earum rerum hic tenetur a<img src="adam.jpg"> sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>';
}


explorationInfinity(
	window,
	document.querySelector('#page-container'),
	{
		getPage : function (pageIndex) {
			var pageData = pagesService[pageIndex];
			if(pageData) {
				return _createPageElement(pageData);
			} else {
				return false;
			}
		}
	}
);

	//  overridable
	function _createPageElement(pageData) {

		var el = document.createElement('div');
		el.classList.add('page');
		el.classList.add(pageData.type);
		switch(pageData.type) {
		case  'small' :
			el.innerHTML = getSmallText(pageData.text);
			break;
		case 'medium' :
			el.innerHTML= getMediumText(pageData.text);
			break;
		case 'large' :
			el.innerHTML = getLargeText(pageData.text);
			break;
		}

		return el;
	}