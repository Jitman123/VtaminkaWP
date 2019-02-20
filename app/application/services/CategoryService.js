"use strict";

export default class CategoryService{

    constructor(
        $http ,
        PASS
    ){

        this._$http = $http;
        this._PASS = PASS;

    }


    async getCategories(){

        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.WORDPRESS,
                data:{
                    'action': 'getCategoriesAction',
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            });

            let categories = response.data;

            return categories;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch

    }//getCategories

    async getCategoryProducts( name ) {

        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.WORDPRESS,
                data:{
                    'nameCategory': name,
                    'action': 'getProductByCategoryAction',
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            });


            let categories = {};

            categories.products = response.data.products;

            categories.name = response.data.nameCategory;

            return  categories;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch

    }//getCategoryProducts

}//CategoryService