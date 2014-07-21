!function(){"use strict";var e=angular.module("ra-wedding",["templates","ui.router","ui.utils","duScroll","duParallax"]);e.config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/pl"),e.state("home",{url:"/",template:"<div ui-view/>",resolve:{LanguagesData:["Languages",function(e){return e.promise}],HotelsData:["Hotels",function(e){return e.promise}]},controller:"WeddingCtrl"}).state("home.language",{url:"{language}",controller:"LanguageCtrl"})}]),e.service("Hotels",["$http",function(e){function t(){return n}var n=null,r=e.get("assets/json/hotels.json").success(function(e){n=e});return{promise:r,getHotels:t}}]),e.service("Languages",["$http",function(e){function t(e){return r.hasOwnProperty(e)}function n(e){return t(e)?r[e]:r.pt}var r=null,a=e.get("assets/json/languages.json").success(function(e){r=e});return{promise:a,getData:n}}]),e.controller("LanguageCtrl",["$rootScope","$stateParams","$state","Languages",function(e,t,n,r){e.language=t.language,e.content=r.getData(t.language)}]),e.controller("WeddingCtrl",["$rootScope","$stateParams","$state","Languages","Hotels","parallaxHelper",function(e,t,n,r,a,o){e.background=o.createAnimator(-.3,300,-300),e.rolling=o.createAnimator(.3,1e3,-1e3),e.hotels=a.getHotels(),e.switchLanguage=function(e){n.go("home.language",{language:e})},e.getStyle=function(){}}]),e.directive("skrollr",function(){return{priority:5001,link:function(){skrollr.init()}}})}();