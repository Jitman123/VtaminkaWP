"use strict";

export  default class NewsService{

    constructor($http ,
                PASS ,){

        this._$http = $http;
        this._PASS = PASS;

    }//constructor

    async getNews(){

        let response = await this._$http.get(`${this._PASS.HOST}${this._PASS.GET_NEWS}` )


        return response.data;
    }//getNews
}