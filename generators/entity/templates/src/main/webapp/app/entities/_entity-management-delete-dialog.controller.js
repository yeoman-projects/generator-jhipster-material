(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>DeleteController',<%= entityAngularJSName %>DeleteController);

    <%= entityAngularJSName %>DeleteController.$inject = ['$mdDialog', 'entity', '<%= entityClass %>'];

    function <%= entityAngularJSName %>DeleteController($mdDialog, entity, <%= entityClass %>) {
        var vm = this;

        vm.<%= entityInstance %> = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $mdDialog.cancel();
        }

        function confirmDelete (id) {
            <%= entityClass %>.delete({id: id},
                function () {
                    $mdDialog.hide();
                });
        }
    }
})();
