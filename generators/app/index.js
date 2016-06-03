'use strict';
var util = require('util'),
    generators = require('yeoman-generator'),
    chalk = require('chalk'),
    prompts = require('./prompts'),
    packagejs = require('../../package.json'),
    exec = require('child_process').exec;

var JhipsterGenerator = generators.Base.extend({});
// Stores JHipster variables
var jhipsterVar = {moduleName: 'material'};
// Stores JHipster functions
var jhipsterFunc = {};
/* Constants use throughout */
const constants;

module.exports = JhipsterGenerator.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.configOptions = {};
        // This adds support for a `--skip-client` flag

        // This adds support for a `--skip-server` flag
        this.option('skip-server', {
            desc: 'Skip the server-side application generation',
            type: Boolean,
            defaults: false
        });

        // This adds support for a `--skip-user-management` flag
        this.option('skip-user-management', {
            desc: 'Skip the user management module during app generation',
            type: Boolean,
            defaults: false
        });

        // This adds support for a `--[no-]i18n` flag
        this.option('i18n', {
            desc: 'Disable or enable i18n when skipping client side generation, has no effect otherwise',
            type: Boolean,
            defaults: true
        });

        // This adds support for a `--with-entities` flag
        this.option('with-entities', {
            desc: 'Regenerate the existing entities if any',
            type: Boolean,
            defaults: false
        });

        // This adds support for a `--jhi-prefix` flag
        this.option('jhi-prefix', {
            desc: 'Add prefix before services, controllers and states name',
            type: String,
            defaults: 'jhi'
        });

        this.currentQuestion = 0;
        this.totalQuestions = constants.QUESTIONS;
        this.skipServer = this.configOptions.skipServer = this.options['skip-server'] || this.config.get('skipServer');
        this.skipUserManagement = this.configOptions.skipUserManagement = this.options['skip-user-management'] || this.config.get('skipUserManagement');
        this.jhiPrefix = this.configOptions.jhiPrefix || this.config.get('jhiPrefix') || this.options['jhi-prefix'];
        this.withEntities = this.options['with-entities'];

    },
    initializing: {
        displayLogo: function () {
            this.log(chalk.white('\nWelcome to ' + chalk.bold('JHipster Material') + '! ' + chalk.yellow('v' + packagejs.version + '\n')));
        },

        composeModule: function (args) {
            /* compose with Jhipster module to get access to reusable functions from JHipster */
            this.composeWith('jhipster:modules', {
                options: {
                    jhipsterVar: jhipsterVar,
                    jhipsterFunc: jhipsterFunc,
                    skipValidation: true
                }
            });
            this.jhipsterVar = jhipsterVar;
            this.jhipsterFunc = jhipsterFunc;
        },

        setupVars: function () {
            constants = jhipsterVar.CONSTANTS;
            this.applicationType = this.config.set('applicationType');
            this.baseName = this.config.set('baseName');
            this.jhipsterVersion = this.config.set('jhipsterVersion');
            this.testFrameworks = this.config.set('testFrameworks');
            this.enableTranslation = this.config.set('enableTranslation');
            this.nativeLanguage = this.config.set('nativeLanguage');
            this.languages = this.config.set('languages');
            var configFound = this.baseName !== undefined && this.applicationType !== undefined;
            if (configFound) {
                this.existingProject = true;
            }
        }
    },

    prompting: {
        askForApplicationType: prompts.askForApplicationType,
        askForModuleName: prompts.askForModuleName
    },

    configuring: {
        setup: function () {
            this.configOptions.skipI18nQuestion = true;
            this.configOptions.baseName = this.baseName;
            this.configOptions.logo = false;
            this.generatorType = 'app';

            if (this.skipServer) {
                this.generatorType = 'client';
                // defaults to use when skipping server
            }
        },

        composeServer: function () {
            if (this.skipServer) return;

            this.composeWith('jhipster:server', {
                options: {
                    'client-hook': true,
                    configOptions: this.configOptions
                }
            }, {
                local: require.resolve('generator-jhipster')
            });
        },

        composeClient: function () {
            if (this.skipClient) return;

            this.composeWith('Jhipster-material:client', {
                options: {
                    'skip-install': this.options['skip-install'],
                    configOptions: this.configOptions,
                    jhipsterFunc: jhipsterFunc,
                    jhipsterVar: jhipsterVar
                }
            }, {
                local: require.resolve('../client')
            });

        },

        askFori18n: prompts.askFori18n
    },

    default: {

        askForTestOpts: prompts.askForTestOpts,

        setSharedConfigOptions: function () {
            this.configOptions.lastQuestion = this.currentQuestion;
            this.configOptions.totalQuestions = this.totalQuestions;
            this.configOptions.testFrameworks = this.testFrameworks;
            this.configOptions.enableTranslation = this.enableTranslation;
            this.configOptions.nativeLanguage = this.nativeLanguage;
            this.configOptions.languages = this.languages;
        },

        composeLanguages: function () {
            if (this.skipI18n) return;
            this.jhipsterFunc.composeLanguagesSub(this, this.configOptions, this.generatorType);
        },

        saveConfig: function () {
            this.config.set('jhipsterVersion', packagejs.version);
            this.config.set('applicationType', this.applicationType);
            this.config.set('baseName', this.baseName);
            this.config.set('testFrameworks', this.testFrameworks);
            this.config.set('jhiPrefix', this.jhiPrefix);
            this.skipServer && this.config.set('skipServer', true);
            this.skipUserManagement && this.config.set('skipUserManagement', true);
            this.config.set('enableTranslation', this.enableTranslation);
            if (this.enableTranslation) {
                this.config.set('nativeLanguage', this.nativeLanguage);
                this.config.set('languages', this.languages);
            }
        }
    },

    writing: {

        regenerateEntities: function () {
            if (this.withEntities) {
                this.getExistingEntities().forEach(function (entity) {
                    this.composeWith('Jhipster:entity', {
                        options: {
                            regenerate: true,
                            'skip-install': true
                        },
                        args: [entity.name]
                    }, {
                        local: require.resolve('generator-jhipster')
                    });
                }, this);
            }
        }
    },

    end: {
        registering: function () {
            try {
                jhipsterFunc.registerModule("generator-jhipster-material", "entity", "post", "entity", "Add material design");
            } catch (err) {
                this.log(chalk.red.bold('WARN!') + ' Could not register as a jhipster post entity creation hook...\n');
            }
        },

        afterRunHook: function () {
            try {
                var modules = this.getModuleHooks();
                if (modules.length > 0) {
                    this.log('\n' + chalk.bold.green('Running post run module hooks\n'));
                    // run through all post app creation module hooks
                    modules.forEach(function (module) {
                        if (module.hookFor === 'app' && module.hookType === 'post') {
                            // compose with the modules callback generator
                            try {
                                this.composeWith(module.generatorCallback, {
                                    options: {
                                        appConfig: this.configOptions
                                    }
                                });
                            } catch (err) {
                                this.log(chalk.red('Could not compose module ') + chalk.bold.yellow(module.npmPackageName) +
                                    chalk.red('. \nMake sure you have installed the module with ') + chalk.bold.yellow('\'npm -g ' + module.npmPackageName + '\''));
                            }
                        }
                    }, this);
                }
            } catch (err) {
                this.log('\n' + chalk.bold.red('Running post run module hooks failed. No modification done to the generated app.'));
            }
        }
    }
});
