(function () {

	'use strict';

	window.onload = function () {

		var container = document.getElementById('container');

		var firstRenderedPageIndex;
		var lastRenderedPageIndex;

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
						container.appendChild(page);
						var heightPrevPage = prevPage.getBoundingClientRect().bottom;
						setScroll(heightPrevPage);

					} else {
						firstRenderedPageIndex = pageNumber;
						container.appendChild(page);
					}
					var nextPage = getPage(pageNumber + 1);
					if(nextPage) {
						container.appendChild(nextPage);
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
				if(document.body.scrollTop > previousScroll) {

					if(currentPage.getBoundingClientRect().bottom < 0) {
						currentPageIndex++;
						currentPage = getPage(currentPageIndex);
						router.navigate('page/' + currentPageIndex, { replace : true });
					}

					if(_atEnd()) {
						newPage = getPage(lastRenderedPageIndex + 1);
						if(newPage) {
							container.appendChild(newPage);
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
						console.log('at start');
						newPage = getPage(firstRenderedPageIndex - 1);
						if(newPage) {
							prependChild(container, newPage);
							firstRenderedPageIndex--;
							var newHeight = newPage.getBoundingClientRect().height;
							setScroll(document.body.scrollTop + newHeight);
						}
						// prepend page if it exists
					}
				}
				previousScroll = document.body.scrollTop;
			});
		}, 0);
	}

	function setScroll(amount) {
		document.body.scrollTop = amount;
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
