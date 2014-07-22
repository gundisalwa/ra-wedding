(function(){
	'use strict';

	var app = angular.module('ra-wedding', [ 'ui.router', 'ui.utils', 'duScroll', 'duParallax', 'youtube-embed' ]);


	app.config([ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  	$urlRouterProvider.otherwise('/pl');

  	$stateProvider
    .state('home',{
      url:'/',
      template:'<div ui-view/>',
      resolve:{
        'LanguagesData':[ 'Languages', function(Languages){
          return Languages.promise;
        }],
        'HotelsData': [ 'Hotels', function(Hotels){
          return Hotels.promise;
        }]
      },
      controller: 'WeddingCtrl'
    })
    .state('home.language',{
  		url:'{language}',
  		controller: 'LanguageCtrl'
  	});
  }]);


  app.service('Hotels', [ '$http' , function($http) {
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
  }]);


	app.service('Languages', [ '$http', function($http) {
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
	}]);


  app.controller('LanguageCtrl', [ "$rootScope", "$stateParams", "$state", "Languages", function($rootScope, $stateParams, $state, Languages){
    $rootScope.language = $stateParams.language;
    $rootScope.content = Languages.getData( $stateParams.language );
  }]);

	app.controller('WeddingCtrl', [ "$rootScope", "$stateParams", "$state", "Languages", "Hotels", "parallaxHelper", "$youtube", '$timeout',
    function($rootScope, $stateParams, $state, Languages, Hotels, parallaxHelper, $youtube, $timeout){

    $rootScope.background = parallaxHelper.createAnimator(-0.3, 300, -300);
    $rootScope.rolling = parallaxHelper.createAnimator(0.3, 1000, -1000);
    $rootScope.playerStatus = {
      mute: false,
      playing: true
    };


    $rootScope.weddingVideo = 'Ykgxgmd0moM';

    $rootScope.$on('youtube.player.ready', function () {
      $youtube.player.setVolume(30);
      $youtube.player.playVideo();
      $youtube.player.unMute();
    });

    $rootScope.toggleSound = function(){
      $timeout( function(){
        $rootScope.playerStatus.mute = !$rootScope.playerStatus.mute;
        $youtube.player[ $rootScope.playerStatus.mute ? 'mute' : 'unMute']();
      },0);
    };
    $rootScope.togglePlay = function(){
      $timeout( function(){
        $rootScope.playerStatus.playing = !$rootScope.playerStatus.playing;
        $youtube.player[ $rootScope.playerStatus.playing ? 'playVideo' : 'pauseVideo']();
      },0);
    };


    $rootScope.hotels = Hotels.getHotels();

		$rootScope.switchLanguage = function(lang){
			$state.go('home.language', {language:lang});
		};

    $rootScope.getStyle = function(hotel){
      
    };

	}]);


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