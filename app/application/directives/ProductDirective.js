"use strict";


export default  function ProductDirective( ){

    return {

        restrict: 'A',
        scope: {
            product: '='
        },
        templateUrl: 'templates/directives/product-directive.html',
        controller: [ '$scope' , 'CartService' , function ( $scope , CartService){

            $scope.changeAmount = function ( newAmount ){
                $scope.product.amount = newAmount;

                
            }

            $scope.AddProduct = function ( product ){
                product.isInCart = true;
                CartService.addProduct( product );

            }
            


        } ],
        link: function ( scope , element ){

            new SelectFx(
                element.context.querySelector('select.cs-select'),
                {
                    onChange: scope.changeAmount // let val = this.value; scope.changeAmount( val )
                }
            );
            ripplyScott.init('.button', 0.75);

        }
    }

}