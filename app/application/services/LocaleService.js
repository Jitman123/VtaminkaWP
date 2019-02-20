"use strict";


export default class LocaleService{

    constructor(
        $http ,
        PASS ,

    ){

        this._$http = $http;
        this._PASS = PASS;

    }

    async getLangs(){

            let response = await this._$http.get( `${this._PASS.HOST}${this._PASS.GET_LANGS}` );
            return response.data;

    }//getLangs

    async getTranslations( lang ){

        let sourceUrl = this._PASS.GET_TRANSLATIONS.replace('{{LANG}}' , lang.toUpperCase());

        let response = await this._$http.get( `${this._PASS.HOST}${sourceUrl}` );
        return response.data;


    }//getTranslations

}