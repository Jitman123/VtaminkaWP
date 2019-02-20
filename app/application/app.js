"use strict";

//====================FUNCTIONS=============================//
//import { showMarkerDetails } from './functions/google';

//====================ANGULAR-JS=============================//
import * as ng from '../node_modules/angular/angular';
import * as route from '../node_modules/angular-route/angular-route';
import * as uiRouter from '../node_modules/@uirouter/angularjs/release/angular-ui-router';
import * as localStorage from '../node_modules/angular-local-storage/dist/angular-local-storage';
import * as loadingBar from '../node_modules/angular-loading-bar/build/loading-bar';
import * as angularTranslate from '../node_modules/angular-translate/dist/angular-translate';
import * as angularTranslateStaticFiles from '../node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files';

import * as angularAnimate from '../node_modules/angular-animate/angular-animate';
import * as angularArea from '../node_modules/angular-aria/angular-aria';
import * as angularMessages from '../node_modules/angular-messages/angular-messages';
import * as angularMaterial from '../node_modules/angular-material/angular-material';
import * as angularNgMap from '../node_modules/ngmap/build/scripts/ng-map';


//====================CONTROLLERS===========================//
import MainController from './controllers/MainController';

//====================SERVICES==============================//
import LocaleService from './services/LocaleService';
import ProductService from './services/ProductService';
import CartService from './services/CartService';
import CategoryService from './services/CategoryService';
import NewsService from './services/NewsService';

//====================FILTERS==============================//

import DescriptionFilter from './filters/DescriptionFilter';
//====================DIRECTIVES==============================//
import LangsOptionDirective from './directives/LangsOptionDirective';
import ProductDirective from './directives/ProductDirective';
import SingleProductDirective from './directives/SingleProductDirective';
import CartDirective from './directives/CartDirective';



angular.module('VtaminkaApplication.controllers' , []);
angular.module('VtaminkaApplication.services' , []);
angular.module('VtaminkaApplication.filters' , []);
angular.module('VtaminkaApplication.directives' , []);
angular.module('VtaminkaApplication.constants' , []);

//====================CONTROLLERS DECLARATIONS================================//
angular.module('VtaminkaApplication.controllers')
    .controller( 'MainController' , [ '$scope' , 'LocaleService' , '$translate' , 'localStorageService' , MainController ]);

//====================CONSTANTS================================//

angular.module('VtaminkaApplication.constants')
    .constant('PASS' , {
        HOST: '/vtaminka/app/public/',
        WORDPRESS: '/vtaminka/admin/wp-admin/admin-ajax.php',
        GET_NEWS : 'news/news-list.json',
        GET_LANGS: 'i18n/langs.json',
        GET_PRODUCTS :'products/products-list.json',
        GET_TRANSLATIONS: 'i18n/{{LANG}}.json',
        GET_PRODUCT:"products/Vitamin{{ProductID}}.json",
        GET_PROMO:"products/promo.json"

    });


//====================SERVICES DECLARATIONS===================//
angular.module('VtaminkaApplication.services')
    .service('LocaleService' , [ '$http', 'PASS', LocaleService ]);

angular.module('VtaminkaApplication.services')
    .service('ProductService' , [ '$http', 'PASS', ProductService ]);

angular.module('VtaminkaApplication.services')
    .service( 'CartService' , [ 'localStorageService','$http','PASS', CartService ]);

angular.module('VtaminkaApplication.services')
    .service( 'CategoryService' , [ '$http','PASS', CategoryService ]);

angular.module('VtaminkaApplication.services')
    .service('NewsService', ['$http', 'PASS', NewsService ]);

//====================DIRECTIVES DECLARATIONS===================//
angular.module('VtaminkaApplication.directives')
    .directive('langsOptionDirective' , [ LangsOptionDirective ]);

angular.module('VtaminkaApplication.directives')
    .directive('productDirective' , [ ProductDirective ]);

angular.module('VtaminkaApplication.directives')
    .directive('singleProductDirective' , [ SingleProductDirective ]);

angular.module('VtaminkaApplication.directives')
    .directive('cartDirective' , [ CartDirective ]);



//====================FILTERS DECLARATIONS===================//
angular.module('VtaminkaApplication.filters')
    .filter('DescriptionFilter', [DescriptionFilter]);


let app = angular.module('VtaminkaApplication',[
    'angular-loading-bar',
    'LocalStorageModule',
    'VtaminkaApplication.controllers',
    'VtaminkaApplication.filters',
    'VtaminkaApplication.services',
    'VtaminkaApplication.directives',
    'VtaminkaApplication.constants',
    'ngRoute',
    'ui.router',
    'pascalprecht.translate',
    'ngMaterial',
    'ngMessages',
    'ngMap'
]);

app.config( [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    'localStorageServiceProvider' ,
    'cfpLoadingBarProvider',
    '$translateProvider',
    ($stateProvider , $urlRouterProvider , $locationProvider , localStorageServiceProvider , cfpLoadingBarProvider , $translateProvider)=>{

    $locationProvider.html5Mode(true).hashPrefix('!')

    $urlRouterProvider.otherwise('/home');

    $translateProvider.useStaticFilesLoader({
        'prefix': 'i18n/',
        'suffix': '.json'
    });

    $translateProvider.preferredLanguage('RU');

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;

    localStorageServiceProvider.setStorageCookie( 7 , '/' );
    localStorageServiceProvider.setStorageCookieDomain('localhost');

    $stateProvider.state('home' , {
        'url': '/home',
        'views':{
            "header":{
                "templateUrl": "templates/header.html",
                controller: [ '$scope' , 'CartService' , 'langs' , 'ProductService', 'categories', function ($scope, CartService , langs, ProductService, categories ){
                    $scope.langs = langs;

                    $scope.cart = CartService.getCart();

                    $scope.categories = categories;

                } ]
            },
            "content": {
                'templateUrl': "templates/home/home.html",
                controller: [ '$scope' ,  'CartService' , 'products', 'news', 'ProductService', function ($scope , CartService , products,news, ProductService){

                    ripplyScott.init('.button', 0.75);

                    $scope.limit = 2;
                    $scope.offset = 0;

                    $scope.cart = CartService.getCart();

                    $scope.products = products;

                    products.forEach(p=>{

                        for(let i=0; i<$scope.cart.length; i++){
                            if(p.ProductID === $scope.cart[i].ProductID){
                                p.isInCart=true;
                                p.amount=$scope.cart[i].amount;
                            }
                        }
                    })

                    $scope.MoreProduct = async function(){

                        $scope.offset += $scope.limit;

                        let moreProducts = await ProductService.getProducts( $scope.limit , $scope.offset );

                        moreProducts.forEach( p => {

                            $scope.products.push(p);

                            let checkProduct = $scope.cart.find( pr => pr.productID === p.productID );

                            if(checkProduct){

                                p.amount = checkProduct.amount;
                                p.isInCart = true;

                            }//if

                        } );

                        if( moreProducts.length === 0 ) {

                            $scope.offset += $scope.products.length;

                        }//if

                    }//MoreProduct

                    $scope.news = news;



                } ]
            },
            "footer": {
                'templateUrl': "templates/footer.html",
            }
        },
        'resolve': {

            'products': [ 'ProductService' , function ( ProductService ){

                return ProductService.getProducts();
            } ],
            'langs': [ 'LocaleService' , function ( LocaleService ){
                return LocaleService.getLangs();
            }  ],

            'categories':['CategoryService', function  ( CategoryService){
                return CategoryService.getCategories();
            }],
            'news': [ 'NewsService', function  ( NewsService ){
                return NewsService.getNews()
            }
            ]

        }
    });

    $stateProvider.state('categoryProducts',{

            'url':'/category/:categoryID',
            "views":{
                "header":{
                    "templateUrl": "templates/header.html",
                    controller: [ '$scope' , 'CartService' , 'langs' , 'ProductService', 'categories', function ($scope, CartService , langs, ProductService, categories ){
                        $scope.langs = langs;

                        $scope.cart = CartService.getCart();

                        $scope.categories = categories;

                    } ]
                },
                "content":{
                    'templateUrl': "templates/categoryProducts/categoryProducts.html",
                    controller:['$scope', '$stateParams' ,'ProductService','categoryProducts' ,function ($scope,$stateParams,ProductService,categoryProducts) {
                        $scope.categoryProducts = categoryProducts;

                        console.log(' $scope.categoryProducts',  $scope.categoryProducts);
                        $scope.categoryName = $stateParams.categoryID;

                    }]
                },
                "footer": {
                    'templateUrl': "templates/footer.html",
                },
            },
            'resolve': {

                'langs': [ 'LocaleService' , function ( LocaleService ){
                    return LocaleService.getLangs();
                }  ],

                'categories':['CategoryService', function  ( CategoryService){
                    return CategoryService.getCategories();
                }],

                'categoryProducts':['CategoryService','$stateParams', function  ( CategoryService, $stateParams){
                    return CategoryService.getCategoryProducts($stateParams.categoryID);
                }]

            }

        });


    $stateProvider.state('singleProduct' , {
            'url': '/product/:productID/:productAmount',
            'views':{
                "header":{
                    "templateUrl": "templates/header.html",
                    controller: [ '$scope' , 'CartService' , 'langs' , 'ProductService', 'categories', function ($scope, CartService , langs, ProductService, categories ){
                        $scope.langs = langs;

                        $scope.cart = CartService.getCart();

                        $scope.categories = categories;

                    } ]
                },
                "content": {
                    'templateUrl': "templates/singleProduct/singleProduct.html",
                    controller:['$scope','product','$stateParams', function ($scope, product, $stateParams) {
                        $scope.product = product;
                        $scope.product.amount = $stateParams.productAmount;
                        var tabs = [
                            { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."},
                            { title: 'Two', content: "You can swipe left and right on a mobile device to change tabs."},
                            { title: 'Three', content: "You can bind the selected tab via the selected attribute on the md-tabs element."},
                            { title: 'Four', content: "If you set the selected tab binding to -1, it will leave no tab selected."},
                            { title: 'Five', content: "If you remove a tab, it will try to select a new one."},
                            { title: 'Six', content: "There's an ink bar that follows the selected tab, you can turn it off if you want."},
                            { title: 'Seven', content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab."},
                            { title: 'Eight', content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!"},
                            { title: 'Nine', content: "If you set md-theme=\"green\" on the md-tabs element, you'll get green tabs."},
                            { title: 'Ten', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Eleven', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Twelve', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Thirteen', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Fourteen', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Fifteen', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Sixteen', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Seventeen', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Eighteen', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Nineteen', content: "If you're still reading this, you should just go check out the API docs for tabs!"},
                            { title: 'Twenty', content: "If you're still reading this, you should just go check out the API docs for tabs!"}
                        ];

                        $scope.tabs = tabs;

                    }]
                },
                "footer": {
                    'templateUrl': "templates/footer.html",
                }

            },
            'resolve': {


                'langs': [ 'LocaleService' , function ( LocaleService ){
                return LocaleService.getLangs();
                }  ],


                'categories':['CategoryService', function  ( CategoryService){
                    return CategoryService.getCategories();
                }],

                'product':['ProductService','$stateParams', function  ( ProductService, $stateParams){
                    return ProductService.getSingleProduct($stateParams.productID);
                }
                ]

        }
        });

    $stateProvider.state('cart' , {
            'url': '/cart',
            'views':{
                "header":{
                    "templateUrl": "templates/header.html",
                    controller: [ '$scope' , 'CartService' , 'langs' , 'ProductService', 'categories', function ($scope, CartService , langs, ProductService, categories ){
                        $scope.langs = langs;

                        $scope.cart = CartService.getCart();

                        $scope.categories = categories;

                    } ]
                },
                "content": {
                    'templateUrl': "templates/cart/cart.html",
                    controller: [ '$scope' ,  'CartService' ,  function ($scope , CartService ){

                        $scope.cart = CartService.getCart();

                        $scope.Total=CartService.total();

                        $scope.$watch( 'cart.length' , function (){

                                $scope.Total = CartService.total();

                        } );
                    } ]
                },
                "footer": {
                    'templateUrl': "templates/footer.html",
                }
            },
            'resolve': {

                'langs': [ 'LocaleService' , function ( LocaleService ){
                    return LocaleService.getLangs();
                }  ],

                'categories':['CategoryService', function  ( CategoryService){
                    return CategoryService.getCategories();
                }],


            }
        });

    $stateProvider.state('checkout' , {
            'url': '/checkout',
            'views':{
                "header":{
                    "templateUrl": "templates/header.html",
                    controller: [ '$scope' , 'CartService' , 'langs' , 'ProductService', 'categories', function ($scope, CartService , langs, ProductService, categories ){
                        $scope.langs = langs;

                        $scope.cart = CartService.getCart();

                        $scope.categories = categories;

                    } ]
                },
                "content": {
                    'templateUrl': "templates/checkout/checkout.html",
                    controller: [ '$scope' , 'PASS','$http', 'CartService', 'ProductService' , 'CategoryService',   function ($scope , PASS, $http, CartService , CategoryService ){

                        $scope.cart = CartService.getCart();

                        $scope.order = {

                            user: {
                                'userName': '',
                                'userEmail': '',
                                'userPhone': '',
                                'userAdress': '',
                                'userMessage': '',
                                'numberCard': '',
                                'yearCard': '',
                                'monthCard': '',
                                'cvvCard': '',
                                'nameCard': '',
                            },
                            promoCode: '',
                            products: $scope.cart
                        };

                        $scope.years = [
                            1990,
                            1991,
                            1992,
                            1993,
                            1994,
                            1995,
                        ];

                        $scope.monthes = [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12
                        ];

                        $scope.Total = CartService.total();

                        $scope.promoOk=false;

                        $scope.regName=true;
                        $scope.regMail=true;
                        $scope.regPhone=true;


                        ripplyScott.init('.button', 0.75);

                        $scope.PromoClick = async function  (){

                            let response = await CartService.GetPromo( $scope.order.promoCode );

                            console.log(response);

                            if( response.code === 200){

                                $scope.discount = response.data;
                                $scope.promoOk = true;

                            }//if
                            
                        }//PromoClick

                        $scope.OrderConfirm = function(){

                            CartService.addOrder( JSON.stringify($scope.order));

                            $scope.cart = CartService.getCart();

                        };
                        
                        $scope.RegName = function  (){

                            let regEng = /^[A-Z]{1}[a-z]{3,10}$/;

                            let regLat = /^[А-Я]{1}[а-я]{3,10}$/;

                            if(regEng.test($scope.name) || regLat.test($scope.name)) {
                                $scope.regName=true;
                            }//if
                            else {
                                $scope.regName=false;
                            }

                        }//RegName
                        
                        $scope.RegEmail=function  (){

                            let regEmail = /^[a-z0-9\.\_\-]+@[a-z0-9]{2,6}(\.[a-z0-9]+)?\.[a-z]{2,5}$/ig;

                            if(regEmail.test($scope.email)) {
                                $scope.regMail=true;
                            }//if
                            else {
                                $scope.regMail=false;
                            }

                        }//RegEmail

                        $scope.RegPhone = function  (){

                            let regPhone = /^\+38\(0[0-9]{2}\)\-[0-9]{3}(\-[0-9]{2}){2}$/i;

                            if(regPhone.test($scope.phone)) {
                                $scope.regPhone=true;
                            }//if
                            else {
                                $scope.regPhone=false;
                            }

                        }//RegPhone


                    } ]
                },
                "footer": {
                    'templateUrl': "templates/footer.html",
                }
            },
            'resolve': {


                'categories':['CategoryService', function  ( CategoryService){
                    return CategoryService.getCategories();
                }],
                'langs': [ 'LocaleService' , function ( LocaleService ){
                    return LocaleService.getLangs();
                }  ],


            }
        });

    $stateProvider.state('contacts' , {
        'url': '/contacts',
        'views':{
            "header":{
                "templateUrl": "templates/header.html",
                controller: [ '$scope' , 'CartService' , 'langs' , 'CategoryService', 'categories', function ($scope, CartService , langs, CategoryService , categories ){
                    $scope.langs = langs;

                    $scope.cart = CartService.getCart();

                    $scope.categories = categories;

                } ]
            },
            "content": {
                'templateUrl': "templates/contacts.html",
                controller: [ '$scope' , 'NgMap' ,  function ($scope , NgMap ){

                    $scope.center = {
                        'lat': 48.019849,
                        'lng': 37.804198
                    };

                    NgMap.getMap().then(function(map) {

                        map.setCenter($scope.center);
                        $scope.map = map;

                    });

                    $scope.showMarkerDetails = function ( event ){
                        console.log(event);
                    }


                } ]
            },
            "footer": {
                'templateUrl': "templates/footer.html",
            }
        },
        'resolve': {


            'categories':['CategoryService', function  ( CategoryService){
                return CategoryService.getCategories();
            }],

            'langs': [ 'LocaleService' , function ( LocaleService ){
                return LocaleService.getLangs();
            }  ],


        }
    })

} ] );

app.run(
    [          '$rootScope', '$state', '$stateParams', 'localStorageService', '$translate',
        function ($rootScope,   $state,   $stateParams, localStorageService , $translate) {

            let userLang = localStorageService.get('lang');

            if(userLang){
                $translate.use(userLang);
            }//if




        }
    ]);

