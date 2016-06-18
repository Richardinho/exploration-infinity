var Router = Backbone.Router.extend({

	initialize : function (options) {
		this.pageController = options.pageController
	},
	routes : {
		'page/:pageNumber'  :  'handlePage'
	},
	handlePage : function (pageNumber) {
		this.pageController(pageNumber);
	}
});