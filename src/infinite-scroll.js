var _ = require('underscore');

module.exports = function (options) {


	/*
		The purpose of the inner container is so as to make it easy to measure the height of the combined pages.
		The alternative would be to measure the individual pages separately.
		I'm not sure but I think this is more performant?
	*/

	//  todo: consider aria roles and accessibility in general

	'use strict';

	var previousScroll;
	
	var offset;

	var defaults = {
		numberOfPagesToRender : 4,
		pushState : true,
		paginationButtons : false,
		cachePages : true,
		createPageElement : function () {},
		pageNumbers : false,
		getPage : function () {
			throw {
				message : 'getPage() not configured'
			}
		}
	};

	var config = _.extend({}, defaults, options);


	//  keep track of what page we are on.
	var pageIndex;

	var upperPageIndex;
	var lowerPageIndex;

	var lowerBoundary;
	var upperBoundary;

	//  once this number of pages is rendered, start removing ones at beginning

	var numberOfRenderedPages;

	//  cache pages here along with some metadata
	//  todo: configure cacheable?
	var pageData = [];

	var viewport = config.viewport;
	var pageContent = config.pageContent;
	var pageContainer = config.pageContainer;

	if(!viewport || !pageContainer) return;

	//  runs on page load
	handleRequest();

	window.onpopstate = handleRequest;

	function resetScroll() {
		setScroll(0);
	}

	function setScroll(amount) {
		if(viewport == window) {
			document.body.scrollTop = amount;
		} else {
			viewport.scrollTop = amount;
		}

	}

	function handleRequest() {
		pageData = [];
		pageContainer.innerHTML = '';
		numberOfRenderedPages = 0;
		previousScroll = 0;
		offset = 0;
		resetScroll();
		var path  = window.location.pathname.substring(1);
		pageIndex = parseInt(path, 10);
		var page = _getPage(pageIndex);
		if(page) {
			upperPageIndex = pageIndex;
			lowerPageIndex = pageIndex;
			appendPage(page);
			lowerBoundary = 0;
			upperBoundary = _getHeight(page);
		} else {
			console.log('page not available');
		}
	}

	function getScroll() {

		if(viewport == window) {
			return document.body.scrollTop;
		} else {
			return viewport.scrollTop;
		}
	}

	viewport.addEventListener('scroll', function () {
		var page;
		if(_forwardScrolling()) {
			//  check upper boundary here for page change
/*
			if(getScroll() > upperBoundary) {

				if(pageData[pageIndex + 1]) {
					pageIndex++;

					lowerBoundary = upperBoundary;
					upperBoundary = upperBoundary + pageData[pageIndex].height;

					//  todo: configure to be pushState or replaceState
					history.pushState(null, null, pageIndex);

				//  todo: implement pagination buttons?
				}


			}*/

			if(beyondUpperLimit()) {
				page = _getPage(upperPageIndex + 1);
				if(page) {
					upperPageIndex++;
					appendPage(page);
					pageData[upperPageIndex].height = _getHeight(page);
					numberOfRenderedPages++;
					if(numberOfRenderedPages > config.numberOfPagesToRender) {
						removeFirstPage();
						numberOfRenderedPages--;
						lowerPageIndex++;
					}
				}
			}
		} else {

			//  check lower boundary here for page change
			/*if(getScroll() < lowerBoundary) {
				pageIndex--;

				upperBoundary = lowerBoundary;
				lowerBoundary = lowerBoundary - pageData[pageIndex].height;

				//  todo: configure to be pushState or replaceState
				history.pushState(null, null, pageIndex);
			}*/

			if(beforeLowerLimit()) {
				page = _getPage(lowerPageIndex - 1);
				if(page) {
					lowerPageIndex--;
					prependPage(page);
					pageData[lowerPageIndex].height = _getHeight(page);
					numberOfRenderedPages++;
					if(numberOfRenderedPages > config.numberOfPagesToRender) {
						removeLastPage();
						numberOfRenderedPages--;
						upperPageIndex--;
					}
				}
			}

		}
		//  keep track of scrolling position
		previousScroll = getScroll();
	});

	function appendPage(page) {
		pageContainer.appendChild(page);
	}

	function prependPage(page) {
		_appendFirstChild(pageContainer, page);
		var pageHeight = _getHeight(page);
		offset -= pageHeight;
		pageContainer.style.paddingTop = offset + 'px';
		// recalculate upper and lower boundaries
		//lowerBoundary+=pageHeight;
		//upperBoundary+=pageHeight;
	}

	function removeFirstPage() {
		var pageToRemove = pageContainer.firstElementChild;
		var pageHeight = _getHeight(pageToRemove);
		pageContainer.removeChild(pageToRemove);
		offset += pageHeight;
		pageContainer.style.paddingTop = offset + 'px';

		// recalculate upper and lower boundaries

		//lowerBoundary-=pageHeight;
    //upperBoundary-=pageHeight;
	}

	function removeLastPage() {
		var pageToRemove = pageContainer.lastElementChild;
		pageContainer.removeChild(pageToRemove);
	}

	//  detects when page has been scrolled after rendered content
	function beyondUpperLimit() {

		return  getScroll() + 50 >  _getHeight(pageContent) - getViewportHeight();
	}

	//  detects when page has been scrolled before rendered content
	function beforeLowerLimit() {

		return pageContainer.getBoundingClientRect().top + offset > -50;
	}

	// utility functions

	//  are we scrolling forwards or backwards
	function _forwardScrolling () {
		return getScroll() > previousScroll;
	}

	//  returns page element or false if no page is available
	function _getPage(pageIndex) {
		pageData[pageIndex] = {};
		return config.getPage(pageIndex);
	}

	//  measures height of page
	function _getHeight(page) {
		return page.getBoundingClientRect().height;
	}

	function getViewportHeight() {
		if(viewport == window) {
			return window.innerHeight;
		} else {
			return viewport.getBoundingClientRect().height;
		}
	}

	//  utility method for adding an element as the first child of a parent.
	function _appendFirstChild(parent, child) {
		parent.insertBefore(child, parent.firstElementChild);
	}
}


