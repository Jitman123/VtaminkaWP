"use strict";

export default class ProductService{

    constructor(
        $http ,
       PASS
    ){

        this._$http = $http;
        this._PASS = PASS;

    }

    async getProducts(limit, offset){

        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.HOST_WP,
                data:{
                    'numberposts': limit || 10,
                    'offset': offset || 0,
                    'action': 'getProductList',
                    },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            });


            let products = response.data.products;

            console.log('RESPONSE', response.data);

            products.forEach( p => {
                p.amount = 1;
            } );

            return products;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch




    }//getProducts

    async getCategory(){

        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.HOST_WP,
                data:{
                    'action': 'getCategories',
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
    }//getCategory

    async getCategoryProducts( name ) {

        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.HOST_WP,
                data:{
                    'nameCategory': name,
                    'action': 'getProductByCategory',
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

            categories.name = response.data.nameCategory
            return  categories;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch

    }//getCategoryProducts

    async getSingleProduct(productID){

        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.HOST_WP,
                data:{
                    'id': productID,
                    'action': 'getSingleProduct',
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            });



            let product = response.data;

            console.log('RESPONSE sungle', response.data);

            return  product;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch

    }//getSingleProduct

    async getDelivery(){


        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.HOST_WP,
                data:{
                    'action': 'getDelivery',
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            });



            console.log("selivery", response.data);
            let delivery = response.data;

            return delivery;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch
    }
}