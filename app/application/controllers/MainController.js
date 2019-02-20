"use strict";

export default class MainController{

    constructor( $scope , LocaleService , $translate , localStorageService ){


        $scope.localStorageService = localStorageService;

        $scope.updateTranslations = function ( lang ){

            $translate.use(lang);
            $scope.localStorageService.set( 'lang' , lang );

        }

    }//constructor

}