(function(){
	'use strict';

	var app = angular.module('ra-wedding', [ 'templates', 'ui.router' ]);


	app.config(function ($stateProvider, $urlRouterProvider) {
  	$urlRouterProvider.otherwise('/pt/guest');

  	$stateProvider.state('home',{
  		url:'^/{language}/{guest}',
  		template:'',
  		resolve:{
	      'GuestsData':function(Guests){
	        return Guests.promise;
	      },
	      'LanguagesData':function(Languages){
	        return Languages.promise;
	      }
	    },
  		controller: 'WeddingCtrl'
  	});
  });


	app.service('Guests', function($http) {
    var guestsData = null;

    var promise = $http.get('assets/guests.json').success(function (data) {
      guestsData = data;
    });

    function getGuest(id){
    	return isGuest(id) ? guestsData[id] : guestsData.guest;
    }

    function isGuest(id){
    	return guestsData.hasOwnProperty(id);
    }

    return {
      promise:promise,
      getGuest: getGuest
    };
	});


	app.service('Languages', function($http) {
    var languagesData = null;

    var promise = $http.get('assets/languages.json').success(function (data) {
      languagesData = data;
    });

    function isAvailableLanguage(lang){
    	return languagesData.hasOwnProperty(lang);
    }

    function getData(lang){
    	return isAvailableLanguage(lang)? languagesData[lang] : languagesData.pt ;
    }

    return {
      promise:promise,
      getData: getData
    };
	});


	app.controller('WeddingCtrl', function($scope, $stateParams, Guests, Languages){
		$scope.guest = Guests.getGuest( $stateParams.guest );
		$scope.content = Languages.getData( $stateParams.language );
	});

	app.directive('skrollr', function(){
		// Runs during compile
		return {
			// name: '',
			   terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				skrollr.init();
			}
		};
	});
	  
})();