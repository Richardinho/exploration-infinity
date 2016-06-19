(function () {

	'use strict';

	window.onload = function () {

		var container = document.getElementById('container');

		var firstRenderedPageIndex;
		var lastRenderedPageIndex;

		//  maximum number of pages to render at any time, after which we start removing them
		//  from the top or the bottom.
		var maxPagesToRender = 5;

		var numberOfPagesRendered = 0;

		var currentPage;
		var currentPageIndex;

		setTimeout(function () {  //  hack to get round Chrome's remembering scroll

			function pageController() {
				var pageNumber = parseInt(arguments[0], 10);
				var page = getPage(pageNumber);
				if(page) {
					currentPage = page;
					currentPageIndex = pageNumber;
					if(pageNumber > 0) {
						firstRenderedPageIndex = pageNumber - 1;
						var prevPage = getPage(firstRenderedPageIndex);
						container.appendChild(prevPage);
						numberOfPagesRendered++;
						container.appendChild(page);
						numberOfPagesRendered++;
						var heightPrevPage = prevPage.getBoundingClientRect().bottom;
						window.scrollBy(0, heightPrevPage);

					} else {
						firstRenderedPageIndex = pageNumber;
						container.appendChild(page);
						numberOfPagesRendered++;
					}
					var nextPage = getPage(pageNumber + 1);
					if(nextPage) {
						container.appendChild(nextPage);
						numberOfPagesRendered++;
						lastRenderedPageIndex = pageNumber + 1;
					} else {
						lastRenderedPageIndex = pageNumber;
					}
				}
			}

			var router = new Router({
				pageController : pageController
			});

			Backbone.history.start({ pushState: true });

			var previousScroll = 0;
			var currentScroll = 0;

			window.addEventListener('scroll', function () {
				var newPage;
				//  scrolling forwards
				if(getWindowScroll() > previousScroll) {

					if(currentPage.getBoundingClientRect().bottom < 0) {
						currentPageIndex++;
						currentPage = getPage(currentPageIndex);
						router.navigate('page/' + currentPageIndex, { replace : true });
					}

					if(_atEnd()) {
						newPage = getPage(lastRenderedPageIndex + 1);
						if(newPage) {
							container.appendChild(newPage);
							numberOfPagesRendered++;
							if(numberOfPagesRendered > maxPagesToRender) {
								var pageToRemove = container.firstElementChild;
								var heightOfPageToRemove = pageToRemove.getBoundingClientRect().height;
								container.removeChild(container.firstElementChild);
								numberOfPagesRendered--;
								firstRenderedPageIndex++;
								window.scrollBy(0, -1 * heightOfPageToRemove);
							}
							lastRenderedPageIndex++;

						} else {

							console.log('no pages left');
						}
						//  add new page if it exists
					}
				} else {

					if(currentPage.getBoundingClientRect().top > 0) {
						if(currentPageIndex > 0) {
							currentPageIndex--;
							currentPage = getPage(currentPageIndex);
							router.navigate('page/' + currentPageIndex, { replace : true });
						}
					}
					if(_atStart() && firstRenderedPageIndex > 0) {
						newPage = getPage(firstRenderedPageIndex - 1);
						if(newPage) {
							prependChild(container, newPage);
							firstRenderedPageIndex--;
							numberOfPagesRendered++;
							if(numberOfPagesRendered > maxPagesToRender) {
								container.removeChild(container.lastElementChild);
								numberOfPagesRendered--;
								lastRenderedPageIndex--;
							}
							var newHeight = newPage.getBoundingClientRect().height;
							//setScroll(document.body.scrollTop + newHeight);
							window.scrollBy(0, newHeight);
						}
						// prepend page if it exists
					}
				}
				previousScroll = getWindowScroll();
			});
		}, 0);
	}

	function getWindowScroll() {
		return window.scrollY;
	}

	function prependChild(parent, child) {
		parent.insertBefore(child, parent.firstElementChild);
	}

	function _atStart() {
		return container.getBoundingClientRect().top > -10;
	}
	function _atEnd() {
		return container.getBoundingClientRect().bottom < window.innerHeight + 10;
	}

})();
