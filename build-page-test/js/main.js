var container = document.getElementById('container');
console.log('reload page');
alert('reload');
var pages = [
	{ text : 'alpha'},
	{ text : 'beta' },
	{ text : 'gamma' },
	{ text : 'delta' },
	{ text : 'epsilon' },
	{ text : 'zeta' }
];

function getPage(index) {

	if(index >= pages.length) return false;

	var pageEl = document.createElement('div');
	pageEl.className = 'page';
	var page = pages[index];

	pageEl.textContent = page.text;
	return pageEl;
}



function loadPage(pageIndex) {
	var page = getPage(pageIndex);
	if(page) {
		container.appendChild(page);
	} else {
		console.log('end of pages');
	}
}

var firstPage = 4;

if(firstPage > 0) {
	//  load previous page before loading page
	loadPage(firstPage - 1);
	loadPage(firstPage);
	var heightOfPrevPage = container.firstElementChild.getBoundingClientRect().height;
	document.body.scrollTop = heightOfPrevPage;
	document.documentElement.scrollTop= heightOfPrevPage;
} else {
	loadPage(firstPage);
}

window.addEventListener('scroll', function () {
	console.log('scroll');
});
