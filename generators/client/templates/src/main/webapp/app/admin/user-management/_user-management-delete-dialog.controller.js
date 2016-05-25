(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('UserManagementDeleteController', UserManagementDeleteController);

    UserManagementDeleteController.$inject = ['$mdDialog', 'entity', 'User'];

    function UserManagementDeleteController ($mdDialog, entity, User) {
        var vm = this;

        vm.user = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $mdDialog.cancel();
        }

        function confirmDelete (login) {
            User.delete({login: login},
                function () {
                    $mdDialog.hide();
                });
        }
    }
})();
