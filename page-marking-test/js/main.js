var container = document.querySelector('#container');
var scrollAmount = 0;
var previousScroll = 0;
var currentPage = container.firstElementChild;
var pageNumber = 1;

window.addEventListener('scroll', function () {
	scrollAmount = document.body.scrollTop;
	if(scrollAmount < 0) return;
	if(backwardsScrolling()) {
		if(getUpperLimit() > 0) {
			if(!!currentPage.previousElementSibling) {
				pageNumber--;
				currentPage = currentPage.previousElementSibling;
				console.log('new page', pageNumber);
			}
		}
	} else {
		if(getLowerLimit() < 0) {
			if(!!currentPage.nextElementSibling) {
				pageNumber++;
				currentPage = currentPage.nextElementSibling;
				console.log('new page', pageNumber);
			}
		}
	}
	previousScroll = document.body.scrollTop;  // because we might manipulate scroll amount
});

function getUpperLimit() {
	return currentPage.getBoundingClientRect().top;
}

function getLowerLimit() {
	return currentPage.getBoundingClientRect().bottom;
}

function backwardsScrolling() {
	return scrollAmount < previousScroll;
}