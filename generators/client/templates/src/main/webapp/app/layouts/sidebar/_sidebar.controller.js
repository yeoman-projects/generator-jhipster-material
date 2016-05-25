(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService'];

    function SidebarController ($state, Auth, Principal, ProfileService, LoginService) {
        var vm = this;
        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = Principal.isAuthenticated;

        ProfileService.getProfileInfo().then(function(response) {
            vm.inProduction = response.inProduction;
            vm.swaggerDisabled = response.swaggerDisabled;
        });

        //Menu Sections
        var entities = [];
        // jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here

        vm.sections = [];
        vm.sections.push({
            name : 'Entities',
            showPage: false,
            icon : 'glyphicon-th-list',
            translate : 'global.menu.entities.main',
            pages : entities
        });
        //Account
        vm.sections.push({
            name : 'Account',
            showPage: false,
            icon : 'glyphicon-user',
            translate : 'global.menu.account.main',
            pages : [{
                name : 'Settings',
                href : 'settings',
                target : '_self',
                icon : 'glyphicon-wrench',
                translate : 'global.menu.account.settings',
                show : true
            },{
                name : 'Password',
                href : 'password',
                target : '_self',
                icon : 'glyphicon-lock',
                translate : 'global.menu.account.password',
                show : true
            }<%_ if (authenticationType == 'session') { _%>,{
                name : 'Sessions',
                href : 'sessions',
                target : '_self',
                icon : 'glyphicon-cloud',
                translate : 'global.menu.account.sessions',
                show : true
            }
            <%_ } _%>
            ]});
        //Administration
        vm.sections.push({
            name : 'Administration',
            showPage: false,
            icon : 'glyphicon-tower',
            translate : 'global.menu.admin.main',
            pages : [<%_ if (applicationType == 'gateway') { _%>{
                name : 'Gateway',
                href : 'gateway',
                target : '_self',
                icon : 'glyphicon-road',
                translate : 'global.menu.admin.gateway',
                show : true
            },<%_ } _%>{
                name : 'User management',
                href : 'user-management',
                target : '_self',
                icon : 'glyphicon-user',
                translate : 'global.menu.admin.userManagement',
                show : true
            }<%_ if (websocket == 'spring-websocket') { _%>,{
                name : 'User tracker',
                href : '<%=jhiPrefix%>-tracker',
                target : '_self',
                icon : 'glyphicon-eye-open',
                translate : 'global.menu.admin.tracker',
                show : true
            }<%_ } _%>,{
                name : 'Metrics',
                href : '<%=jhiPrefix%>-metrics',
                target : '_self',
                icon : 'glyphicon-dashboard',
                translate : 'global.menu.admin.metrics',
                show : true
            },{
                name : 'Health',
                href : '<%=jhiPrefix%>-health',
                target : '_self',
                icon : 'glyphicon-heart',
                translate : 'global.menu.admin.health',
                show : true
            },{
                name : 'Configuration',
                href : 'configuration',
                target : '_self',
                icon : 'glyphicon-list-alt',
                translate : 'global.menu.admin.configuration',
                show : true
            },{
                name : 'Audits',
                href : 'audits',
                target : '_self',
                icon : 'glyphicon-bell',
                translate : 'global.menu.admin.audits',
                show : true
            },{
                name : 'Logs',
                href : 'logs',
                target : '_self',
                icon : 'glyphicon-tasks',
                translate : 'global.menu.admin.logs',
                show : true
            },{
                name : 'API Docs',
                href : 'docs',
                target : '_self',
                icon : 'glyphicon-book',
                translate : 'global.menu.admin.apidocs',
                show : (vm.inProduction || vm.swaggerDisabled)
            }
            <%_ if (devDatabaseType == 'h2Disk' || devDatabaseType == 'h2Memory') { _%>
            ,{
                name : 'Database',
                href : '/h2-console',
                target : '_tab',
                icon : 'glyphicon-hdd',
                translate : 'global.menu.admin.database',
                show :  vm.inProduction
            }
            <%_ } _%>
        ]
        });
        
        vm.isOpen = open;
        vm.show = false;

        function open(index){
            vm.sections[index].showPage = !vm.sections[index].showPage;
            vm.show = !vm.show;
        }

        <%_ if (enableTranslation){ _%>
        vm.tranOpen = tranOpen;
        vm.translationShow = false;
        function tranOpen(index) {
            vm.translationShow = !vm.translationShow;
        }
        <%_ } _%>
    }
})();
