'use strict';

var max = 10;

var pages = [];

function getPage(pageIndex) {

	if(pageIndex > max) return;

	if(pages[pageIndex]) {
		return pages[pageIndex];
	} else {

		var page = document.createElement('div');
		page.textContent = 'page ' + pageIndex;
		page.className = 'page';
		pages[pageIndex] = page;
		return page;
	}
}