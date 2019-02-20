"use strict";

export default  function SingleProductDirective() {

    return {

        restrict:'A',
        scope:{
            product:'=',
            tabs: '='
        },
        templateUrl: 'templates/directives/single-product-directive.html',
        controller:['$scope', 'CartService', function  ($scope, CartService){

            $scope.cart = CartService.getCart();

            $scope.ChangeAmount= function (product) {

                for(let i=0; i<$scope.cart.length; i++){
                    if($scope.cart[i].ProductID===product.ProductID){
                        $scope.cart[i].amount = product.amount;
                    }//if
                }//for

                CartService.changeStorageService($scope.cart);
            }//ChangeAmount
            
            $scope.AddProduct = function (product) {

                let count=0;
                for(let i=0; i<$scope.cart.length; i++){

                    if($scope.cart[i].ProductID===product.ProductID){
                        count++;
                    }//if
                }//for
                
                if(count===0){
                    let newProduct =CartService._getSimpleProduct(product);
                    newProduct.isInCart=true;
                    CartService.addProduct(newProduct);
                }//if
                

                
            }//AddProduct
        }
        ],

        link: function  (scope, element){



                    /*
                    get snap amount programmatically or just set it directly (e.g. "273")
                    in this example, the snap amount is list item's (li) outer-width (width+margins)
                    */
                    var amount=Math.max.apply(Math,$(".tabsContent li").map(function(){return $(this).outerWidth(true);}).get());

                    $(".tabsContent").mCustomScrollbar({
                        axis:"x",
                        theme:"inset",
                        advanced:{
                            autoExpandHorizontalScroll:true
                        },
                        scrollButtons:{
                            enable:true,
                            scrollType:"stepped"
                        },
                        keyboard:{scrollType:"stepped"},
                        snapAmount:amount,
                        mouseWheel:{scrollAmount:amount}
                    });

            ripplyScott.init('.button', 0.75);


        }


    }

}