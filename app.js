(function(){
	'use strict';

	var app = angular.module('ra-wedding', [ 'templates', 'ui.router', 'ui.utils', 'duScroll', 'duParallax' ]);



	app.config(function ($stateProvider, $urlRouterProvider) {
  	$urlRouterProvider.otherwise('/pt/guest');

  	$stateProvider.state('home',{
  		url:'^/{language}/{guest}',
  		resolve:{
	      'GuestsData':function(Guests){
	        return Guests.promise;
	      },
	      'LanguagesData':function(Languages){
	        return Languages.promise;
	      },
        'HotelsData': function(Hotels){
          return Hotels.promise;
        }
	    },
  		controller: 'WeddingCtrl'
  	});
  });

	app.service('Guests', function($http) {
    var guestsData = null;

    var promise = $http.get('assets/json/guests.json').success(function (data) {
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

  app.service('Hotels', function($http) {
    var hotelsData = null;

    var promise = $http.get('assets/json/hotels.json').success(function (data) {
      hotelsData = data;
    });

    function getHotels(){
      return hotelsData;
    }

    return {
      promise:promise,
      getHotels: getHotels
    };
  });


	app.service('Languages', function($http) {
    var languagesData = null;

    var promise = $http.get('assets/json/languages.json').success(function (data) {
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


	app.controller('WeddingCtrl', function($rootScope, $stateParams, $state, Guests, Languages, Hotels, parallaxHelper){

    $rootScope.background = parallaxHelper.createAnimator(-0.3, 150, -150);
    $rootScope.rolling = parallaxHelper.createAnimator(0.3, 1000, -1000);

		$rootScope.guest = Guests.getGuest( $stateParams.guest );
    $rootScope.language = $stateParams.language;
		$rootScope.content = Languages.getData( $stateParams.language );

    $rootScope.hotels = Hotels.getHotels();

		$rootScope.switchLanguage = function(lang){
			$state.go('home', {language:lang, guest:$stateParams.guest});
		};

	});

	app.directive('skrollr', function(){
		// Runs during compile
		return {
			priority: 5001,
			link: function($scope, iElm, iAttrs, controller) {
				var s = skrollr.init();

				/*skrollr.menu.init(s, {
			    animate: true,
			    easing: 'sqrt',
				});*/
			}
		};
	});
	  
})();