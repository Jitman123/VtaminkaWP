"use strict";


export default function LangsOptionDirective( ){

    return {

        restrict: 'A',
        template: '',
        scope: {
            'langs': '='
        },
        controller: [ '$scope', 'localStorageService' , '$translate' , function ( $scope , localStorageService , $translate){

            if(localStorageService.get('lang')){
                $scope.currentLang = localStorageService.get('lang');
            }//if
            else{
                $scope.currentLang = $scope.langs[0];
            }//else

            $scope.changeLanguage = function ( newLanguage ){

                $scope.$parent.updateTranslations( newLanguage );

                localStorageService.set( 'lang' , newLanguage );

                $translate.use(localStorageService.get('lang'));

            };

        } ],
        link: function ( scope, element, attrs, controller, transcludeFn ){

            let options = '<option value="RU" >Язык</option>';

            scope.langs.forEach( (lang) => {

                if(scope.currentLang === lang){
                    options += `<option value="${lang}" selected >${lang}</option>`;
                }//if
                else{
                    options += `<option value="${lang}">${lang}</option>`;
                }//else


            } );

            element.html( options );

            new SelectFx(
                document.querySelector('#langs'),{
                    onChange: scope.changeLanguage
                }
            );




        }//link

    }//LangsListDirective {}

}//LangsListDirective ()