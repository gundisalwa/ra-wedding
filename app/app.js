(function(){
	'use strict';

	var app = angular.module('ra-wedding', [ 'templates', 'ui.router', 'ui.utils', 'duScroll', 'duParallax' ]);


	app.config(function ($stateProvider, $urlRouterProvider) {
  	$urlRouterProvider.otherwise('/pt');

  	$stateProvider
    .state('home',{
      url:'/',
      template:'<div ui-view/>',
      resolve:{
        'LanguagesData':function(Languages){
          return Languages.promise;
        },
        'HotelsData': function(Hotels){
          return Hotels.promise;
        }
      },
      controller: 'WeddingCtrl'
    })
    .state('home.language',{
  		url:'{language}',
  		controller: 'LanguageCtrl'
  	});
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


  app.controller('LanguageCtrl', function($rootScope, $stateParams, $state, Languages){
    $rootScope.language = $stateParams.language;
    $rootScope.content = Languages.getData( $stateParams.language );
  });

	app.controller('WeddingCtrl', function($rootScope, $stateParams, $state, Languages, Hotels, parallaxHelper){

    $rootScope.background = parallaxHelper.createAnimator(-0.3, 300, -300);
    $rootScope.rolling = parallaxHelper.createAnimator(0.3, 1000, -1000);

    $rootScope.hotels = Hotels.getHotels();

		$rootScope.switchLanguage = function(lang){
			$state.go('home.language', {language:lang});
		};

    $rootScope.getStyle = function(hotel){
      
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