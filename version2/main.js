function infiniteScroll(options) {

	var previousScroll = 0;
	var loading = false;
	var pagesLoaded = 1;

	function addPage() {
		return createPage().then(function (page) {
			config.pageContainer.appendChild(page);
			pagesLoaded++;
		});
	}


	var defaults = {
		maxpages : 3,
		foo : 50
	};


	var config = extend({}, defaults, options);



	init();
	function init() {
		if(contentDoesNotFillViewport()) {
			config.pageContainer.lastChild.style.height = '800px';
		}
	}

	function removeFirstPage() {
		var pageToRemove = config.pageContainer.firstElementChild;
		var pageHeight = _getHeight(pageToRemove);
		config.pageContainer.removeChild(pageToRemove);
		config.pageContainer.scrollTop = config.pageContainer.scrollTop - pageHeight;

	}

	function loadPage() {

		loading = true;

		if(pagesLoaded >= config.maxpages) {
      console.log('max pages exceeded');

      removeFirstPage();
    }

		return addPage().then(function () {

			if(contentDoesNotFillViewport()) {
				//  make sure content always fills the viewport to allow scrolling
				config.pageContainer.lastChild.style.height = '800px';
			}
		}).then(function () {
			loading = false;
		});


	}

	function atBeginningOfScroll(scrollAmount) {

		return scrollAmount - config.foo < config.pageContainer.getBoundingClientRect().top;


	}





	config.viewport.addEventListener('scroll', function () {
		if (loading) { return; }
		var scrollAmount = amountScrolled();
		if(backwardsScrolling(scrollAmount)) {
			console.log('scroll back');
			if(atBeginningOfScroll(scrollAmount)) {

				console.log('need to load more before');

			}

		} else {  // assume forward scrolling
			if(scrollAmount + config.foo > getContentHeight() - getViewportHeight()) {
				addSpinner();
				loadPage().then(function () {
					removeSpinner();
				});
			}
		}

		previousScroll = amountScrolled();
		console.log('previous scrol', previousScroll);



	});

	function contentDoesNotFillViewport() {

    return getContentHeight() < getViewportHeight();

  }


	function addSpinner() {

		config.spinner.style.display = 'block';
	}

	function removeSpinner() {
		config.spinner.style.display = 'none';
	}

	function backwardsScrolling(currentScroll) {

		console.log(currentScroll, previousScroll);
		return currentScroll < previousScroll;
	}

	function amountScrolled() {
		if(config.viewport === window ) return document.body.scrollTop;
		return config.viewport.scrollTop;
	}

	function getViewportHeight() {
		if(window === config.viewport) return window.innerHeight;
		return config.viewport.getBoundingClientRect().height;
	}

	function createPage() {
		return new Promise(function (resolve, reject) {
			//setTimeout(function () {
				var pageEl = document.createElement('div');
				pageEl.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
				resolve(pageEl);
			//}, 1000);
		});
	}

	function getContentHeight() {
		return config.content.getBoundingClientRect().height;
	}

	//  measures height of page
	function _getHeight(page) {
		return page.clientHeight;
	}

	function _appendFirstChild(parent, child) {
    parent.insertBefore(child, parent.firstElementChild);
  }


}


function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}
