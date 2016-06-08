+function () {

	'use strict';

	var previousScroll;

	//  keep track of what page we are on.
	var pageIndex;

	var upperPageIndex;
	var lowerPageIndex;

	var lowerBoundary;
	var upperBoundary;

	// once this number of pages is rendered, start removing ones at beginning
	var numberOfPagesToRender = 4;

	var numberOfRenderedPages;

	// cache pages here along with some metadata
	var pageCache = [];

	var container = document.querySelector('#container');
	var innerContainer = document.querySelector('#inner-container');

	var pagesService = [
		{  text : '1' },
		{  text : '2' },
		{  text : '3' },
		{  text : '4' },
		{  text : '5' },
		{  text : '6' },
		{  text : '7' },
		{  text : '8' },
		{  text : '9' },
		{  text : '10' },
		{  text : '11' }
	];

	//  runs on page load
	handleRequest();

	window.onpopstate = handleRequest;

	function handleRequest() {
		pageCache = [];
		innerContainer.innerHTML = '';
		numberOfRenderedPages = 0;
		previousScroll = 0;
		container.scrollTop = 0;
		var path  = window.location.pathname.substring(1);
		pageIndex = parseInt(path, 10);
		var page = _getPage(pageIndex);
		if(page) {
			upperPageIndex = pageIndex;
			lowerPageIndex = pageIndex;
			addPageAtEnd(page);
			lowerBoundary = 0;
			upperBoundary = _getHeight(page);
		} else {
			console.log('page not available');
		}
	}

	container.addEventListener('scroll', function () {
		var page;
		if(_forwardScrolling()) {
			//  check upper boundary here for page change

			if(container.scrollTop > upperBoundary) {
				pageIndex++;
				//  reset boundaries
				lowerBoundary = upperBoundary;
				upperBoundary = upperBoundary + pageCache[pageIndex].height;
				// update page in url
				history.pushState(null, null, pageIndex);

				console.log('page', pageIndex);
			}

			if(beyondUpperLimit()) {
				page = _getPage(upperPageIndex + 1);
				if(page) {
					upperPageIndex++;
					addPageAtEnd(page);
					pageCache[upperPageIndex].height = _getHeight(page);
					numberOfRenderedPages++;
					if(numberOfRenderedPages > numberOfPagesToRender) {
						removeEarlierPage();
						numberOfRenderedPages--;
						lowerPageIndex++;
					}
				}
			}
		} else {

			//  check lower boundary here for page change
			if(container.scrollTop < lowerBoundary) {
				pageIndex--;
				//  reset boundaries
				upperBoundary = lowerBoundary;
				lowerBoundary = lowerBoundary - pageCache[pageIndex].height;

				// update page in url
				console.log('page', pageIndex);
				history.pushState(null, null, pageIndex);
			}

			if(beforeLowerLimit()) {
				page = _getPage(lowerPageIndex - 1);
				if(page) {
					lowerPageIndex--;
					addPageAtStart(page);
					pageCache[lowerPageIndex].height = _getHeight(page);
					numberOfRenderedPages++;
					if(numberOfRenderedPages > numberOfPagesToRender) {
						removeLaterPage();
						numberOfRenderedPages--;
						upperPageIndex--;
					}
				}
			}
		}
		//  keep track of scrolling position
		previousScroll = container.scrollTop;
	});

	function addPageAtEnd(page) {
		innerContainer.appendChild(page);
	}

	function addPageAtStart(page) {
		var scroll = container.scrollTop;
		_appendFirstChild(innerContainer, page);
		var pageHeight = _getHeight(page);
		container.scrollTop = scroll + pageHeight;
		// recalculate upper and lower boundaries
		lowerBoundary+=pageHeight;
		upperBoundary+=pageHeight;
	}

	function removeEarlierPage() {
		var pageToRemove = innerContainer.firstElementChild;
		var pageHeight = _getHeight(pageToRemove);
		innerContainer.removeChild(pageToRemove);

		// recalculate upper and lower boundaries
		container.scrollTop = container.scrollTop - pageHeight;
		lowerBoundary-=pageHeight;
    upperBoundary-=pageHeight;
	}

	function removeLaterPage() {
		var pageToRemove = innerContainer.lastElementChild;
		innerContainer.removeChild(pageToRemove);
	}

	//  detects when page has been scrolled after rendered content
	function beyondUpperLimit() {
		return container.scrollTop + 50 > (_getHeight(innerContainer) - _getHeight(container));
	}

	//  detects when page has been scrolled before rendered content
	function beforeLowerLimit() {
		return container.scrollTop < 50;
	}

	function updatePagination(currentPageIndex) {

		console.log('current page', currentPageIndex);
	}

	// utility functions

	//  are we scrolling forwards or backwards
	function _forwardScrolling () {
		return container.scrollTop > previousScroll;
	}

	//  returns page element or false if no page is available
	function _getPage(pageIndex) {

		var pageData = pageCache[pageIndex];

		if(!pageData) {
			pageData = pagesService[pageIndex];
		}

		if(pageData) {
			pageCache[pageIndex] = pageData;
			return _createPageElement(pageData);
		} else {
			return false;
		}
	}

	function _createPageElement(pageData) {

		var el = document.createElement('div');
		el.className = 'page';
		el.textContent = pageData.text;
		return el;
	}

	//  measures height of page
	function _getHeight(page) {
		return page.clientHeight;
	}

	//  utility method for adding an element as the first child of a parent.
	function _appendFirstChild(parent, child) {
		parent.insertBefore(child, parent.firstElementChild);
	}

}();