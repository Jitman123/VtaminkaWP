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
                url: this._PASS.WORDPRESS,
                data:{
                    'numberposts': limit || 10,
                    'offset': offset || 0,
                    'action': 'getProductListAction'
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

            products.forEach( p => {
                p.amount = 1;
            } );

            return products;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch

    }//getProducts

    async getSingleProduct(productID){

        try{

            let response = await this._$http({
                method: 'POST',
                url: this._PASS.WORDPRESS,
                data:{
                    'id': productID,
                    'action': 'getSingleProductAction',
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

            return  product;

        }//try
        catch( ex ){

            console.log('EX: ' , ex);

        }//catch

    }//getSingleProduct

}