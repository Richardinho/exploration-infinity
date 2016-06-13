var _ = require('underscore');

module.exports = function (viewport, container, options) {

	'use strict';

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

	var previousScroll;
	var firstRenderedPageIndex;
	var lastRenderedPageIndex;


	//  once this number of pages is rendered, start removing ones at beginning

	var numberOfRenderedPages;

	if(!viewport || !container) return;

	//  runs on page load
	handleRequest();

	function handleRequest() {
		container.innerHTML = '';
		numberOfRenderedPages = 0;
		previousScroll = 0;
		container.style.paddingTop = "0";
		var page = _getPage(0);
		if(page) {
			firstRenderedPageIndex = 0;
			lastRenderedPageIndex = 0;
			_appendPage(page);
		} else {
			console.log('page not available');
		}
	}

	viewport.addEventListener('scroll', function () {
		var page;
		if(_backwardsScrolling()) {
			if(_atStart()) {
				page = _getPage(firstRenderedPageIndex - 1);
				if(page) {
					firstRenderedPageIndex--;
					_prependPage(page);
					numberOfRenderedPages++;
					if(numberOfRenderedPages > config.numberOfPagesToRender) {
						_removeLastPage();
						numberOfRenderedPages--;
						lastRenderedPageIndex--;
					}
				}
			}
		} else {
			if(_atEnd()) {
				page = _getPage(lastRenderedPageIndex + 1);
				if(page) {
					lastRenderedPageIndex++;
					_appendPage(page);
					numberOfRenderedPages++;
					if(numberOfRenderedPages > config.numberOfPagesToRender) {
						_removeFirstPage();
						numberOfRenderedPages--;
						firstRenderedPageIndex++;
					}
				}
			}
		}
		//  keep track of scrolling position
		previousScroll = _getScroll();
	});

	function _appendPage(page) {
		container.appendChild(page);
	}

	function _prependPage(page) {
		_prependChild(container, page);
		var pageHeight = _getHeight(page);
		container.style.paddingTop = getContainerPaddingTop() - pageHeight + 'px';
	}

	function _removeFirstPage() {
		var pageToRemove = container.firstElementChild;
		var pageHeight = _getHeight(pageToRemove);
		container.removeChild(pageToRemove);
		container.style.paddingTop = getContainerPaddingTop() + pageHeight + 'px';
	}

	function getContainerPaddingTop() {
		return container.firstElementChild.getBoundingClientRect().top - container.getBoundingClientRect().top;
	}

	function _removeLastPage() {
		var pageToRemove = container.lastElementChild;
		container.removeChild(pageToRemove);
	}

	//  detects when page has been scrolled after rendered content
	function _atEnd() {
		if(viewport == window) {
			return container.getBoundingClientRect().bottom <= _getViewportHeight() + 50;
		} else {
			return _getScroll() + 50 > container.getBoundingClientRect().height - _getViewportHeight();
		}
	}

	//  detects when page has been scrolled before rendered content
	function _atStart() {
		if(viewport === window) {
			return container.getBoundingClientRect().top + getContainerPaddingTop() > 0;
		} else {
			return _getScroll() + 50 < getContainerPaddingTop();
		}
	}

	//  are we scrolling forwards or backwards
	function _backwardsScrolling () {
		return _getScroll() < previousScroll;
	}
	
	function _getScroll() {
		if(viewport == window) {
			return document.body.scrollTop;
		} else {
			return viewport.scrollTop;
		}
	}

	//  returns page element or false if no page is available
	function _getPage(pageIndex) {
		return config.getPage(pageIndex);
	}

	//  measures height of page
	function _getHeight(el) {
		return el.getBoundingClientRect().height;
	}

	function _getViewportHeight() {
		if(viewport === window) {
			return window.innerHeight;
		} else {
			return _getHeight(viewport);
		}
	}

	//  utility method for adding an element as the first child of a parent.
	function _prependChild(parent, child) {
		parent.insertBefore(child, parent.firstElementChild);
	}
}


