"use strict";


export default function CartDirective (){

    return{

        restrict: 'A',
        scope: {
            product:'='
        },
        templateUrl: 'templates/directives/cart-directive.html',

        controller: ['$scope', 'ProductService','CartService', function  ($scope, ProductService,  CartService){

                 ProductService.getSingleProduct($scope.product.ProductID)
                     .then (response=>{
                         $scope.product.description = response.ProductDescription;

                     })
                     .catch(error=>{
                         console.log(error);
                     })

                 $scope.cart = CartService.getCart();


                 $scope.RemoveProduct = function  (product){

                     let index=-1;
                     for(let i=0; i<$scope.cart.length; i++){
                         if($scope.cart[i]['ProductID'] === product.ProductID) {
                             index = i;
                         }
                     }

                     $scope.cart.splice( index , 1 );
                     CartService.changeStorageService($scope.cart);


                 }

                 $scope.ChangeProductAmount= function  (product){

                     if(product.amount==0){
                         $scope.RemoveProduct(product);
                     }

                     $scope.$parent.$parent.Total=CartService.total();

                     CartService.changeStorageService($scope.cart);
                 }


        }  ]
    }

}
