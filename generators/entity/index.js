'use strict';
var util = require('util'),
    generators = require('yeoman-generator'),
    chalk = require('chalk'),
    _ = require('lodash'),
    shelljs = require('shelljs'),
    pluralize = require('pluralize'),
    prompts = require('./prompts'),
    scriptBase = require('../generator-base');

/* constants used througout */
const constants = require('../generator-constants'),
    INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX,
    CLIENT_MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR,
    CLIENT_TEST_SRC_DIR = constants.CLIENT_TEST_SRC_DIR,
    ANGULAR_DIR = constants.ANGULAR_DIR,
    SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR,
    SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR,
    TEST_DIR = constants.TEST_DIR,
    SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR,
    RESERVED_WORDS_JAVA = constants.RESERVED_WORDS_JAVA,
    RESERVED_WORDS_MYSQL = constants.RESERVED_WORDS_MYSQL,
    RESERVED_WORDS_POSGRES = constants.RESERVED_WORDS_POSGRES,
    RESERVED_WORDS_CASSANDRA = constants.RESERVED_WORDS_CASSANDRA,
    RESERVED_WORDS_ORACLE = constants.RESERVED_WORDS_ORACLE,
    RESERVED_WORDS_MONGO = constants.RESERVED_WORDS_MONGO,
    SUPPORTED_VALIDATION_RULES = constants.SUPPORTED_VALIDATION_RULES;


var EntityGenerator = generators.Base.extend({});

util.inherits(EntityGenerator, scriptBase);

module.exports = EntityGenerator.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.entityConfig = this.options.entityConfig;
        
        this.rootDir = this.destinationRoot();
        // enum-specific vars
        this.enums = [];

        this.existingEnum = false;

        this.fieldNamesUnderscored = ['id'];
        // these variable will hold field and relationship names for question options during update
        this.fieldNameChoices = [];
        this.relNameChoices = [];
    },
    initializing: {
        compose: function (args) {
            this.composeWith('jhipster:modules', {
                options: {
                    jhipsterVar: jhipsterVar,
                    jhipsterFunc: jhipsterFunc
                }
            });
        },

        validate: function () {
            // this shouldnt be run directly
            if (!this.entityConfig) {
                this.env.error(chalk.red.bold('ERROR!') + ' This sub generator should be used only from JHipster and cannot be run directly...\n');
            }
        }
        getConfig: function (args) {
            this.useConfigurationFile = false;
            this.env.options.appPath = this.config.get('appPath') || CLIENT_MAIN_SRC_DIR;
            this.baseName = this.config.get('baseName');
            this.packageName = this.config.get('packageName');
            this.applicationType = this.config.get('applicationType');
            this.packageFolder = this.config.get('packageFolder');
            this.authenticationType = this.config.get('authenticationType');
            this.hibernateCache = this.config.get('hibernateCache');
            this.databaseType = this.config.get('databaseType');
            this.prodDatabaseType = this.config.get('prodDatabaseType');
            this.searchEngine = this.config.get('searchEngine');
            this.enableTranslation = this.config.get('enableTranslation');
            this.nativeLanguage = this.config.get('nativeLanguage');
            this.languages = this.config.get('languages');
            this.buildTool = this.config.get('buildTool');
            this.testFrameworks = this.config.get('testFrameworks');
            // backward compatibility on testing frameworks
            if (this.testFrameworks === undefined) {
                this.testFrameworks = ['gatling'];
            }

            this.skipClient = this.applicationType === 'microservice' || this.config.get('skipClient') || this.options['skip-client'];

            this.angularAppName = this.getAngularAppName();
            this.jhipsterConfigDirectory = '.jhipster';
            this.mainClass = this.getMainClassName();

            this.filename = this.jhipsterConfigDirectory + '/' + this.entityNameCapitalized + '.json';
            if (shelljs.test('-f', this.filename)) {
                this.log(chalk.green('\nFound the ' + this.filename + ' configuration file, entity can be automatically generated!\n'));
                this.useConfigurationFile = true;
                this.fromPath = this.filename;
            }
        },

        composeEntityGenerator: function () {

        }

    },

    writing : {

        writeClientFiles: function () {
            if (this.skipClient) {
                return;
            }
            this.copyHtml(ANGULAR_DIR + 'entities/_entity-management.html', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityPluralFileName + '.html', this, {}, true);
            this.copyHtml(ANGULAR_DIR + 'entities/_entity-management-detail.html', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-detail.html', this, {}, true);
            this.copyHtml(ANGULAR_DIR + 'entities/_entity-management-dialog.html', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-dialog.html', this, {}, true);
            this.copyHtml(ANGULAR_DIR + 'entities/_entity-management-delete-dialog.html', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-delete-dialog.html', this, {}, true);

            this.addEntityToMenu(this.entityStateName, this.enableTranslation);

            this.template(ANGULAR_DIR + 'entities/_entity-management.state.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '.state.js', this, {});
            this.template(ANGULAR_DIR + 'entities/_entity-management.controller.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '.controller' + '.js', this, {});
            this.template(ANGULAR_DIR + 'entities/_entity-management-dialog.controller.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-dialog.controller' + '.js', this, {});
            this.template(ANGULAR_DIR + 'entities/_entity-management-delete-dialog.controller.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-delete-dialog.controller' + '.js', this, {});
            this.template(ANGULAR_DIR + 'entities/_entity-management-detail.controller.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-detail.controller' + '.js', this, {});
            this.template(ANGULAR_DIR + 'services/_entity.service.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityServiceFileName + '.service' + '.js', this, {});
            if (this.searchEngine === 'elasticsearch') {
                this.template(ANGULAR_DIR + 'services/_entity-search.service.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityServiceFileName + '.search.service' + '.js', this, {});
            }
        },

        writeClientTestFiles: function () {
            if (this.skipClient) return;

            this.template(CLIENT_TEST_SRC_DIR + 'spec/app/entities/_entity-management-detail.controller.spec.js',
                CLIENT_TEST_SRC_DIR + 'spec/app/entities/' + this.entityFolderName + '/' + this.entityFileName + '-detail.controller.spec.js', this, {});
            // Create Protractor test files
            if (this.testFrameworks.indexOf('protractor') !== -1) {
                this.template(CLIENT_TEST_SRC_DIR + 'e2e/entities/_entity.js', CLIENT_TEST_SRC_DIR + 'e2e/entities/' + this.entityFileName + '.js', this, {});
            }
        }
    }
});
