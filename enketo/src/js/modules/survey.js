var toastr = require('toastr');
var Promise = require('bluebird');
var Form = require('enketo-core/src/js/Form');
var searchParams = require('./utils/search-params');
var fileManager = require('enketo-core/src/js/file-manager');
//
var JumpTo = require('./jump-to');
var SessionManager = require('./session-manager');
//
var $header = $('.form-header');

var Survey = {
    form: null,
    formId: null,
    autoSave: null,
    saving: null,

    initializeSurvey: function() {
        var that = this;

        return new Promise(function(resolve, reject) {
            that.loadSurvey().then(function(survey) {

                var formStr = that.modifySurvey(survey.form);
                var modelStr = survey.model;
                $header.after(formStr);

                SessionManager.start().then(function(session) {
                    that.initializeForm(modelStr, session.xml, session.submitted);
                    that.formId = $('form').attr('id');
                    JumpTo(that.form.view); // Initialize Angular app
                    that.modifyUI();
                    that.subscribeProgress();

                    that.preventAccidentalLeave();
                    that.toggleAutosave(true);
                    //
                    $header.show();
                    $('#loading-block').remove();
                    setTimeout(() => {
                        $(window).scrollTop(0);
                    })
                    resolve();
                });
            });
        });
    },

    toggleAutosave: function(on) {
        if (this.autoSave) {
            clearInterval(this.autoSave);
        }
        if (on) {
            var that = this;
            this.autoSave = setInterval(function() {
                that.saveSession();
            }, 60 * 1000);
        }
    },

    loadSurvey: function() {
        return new Promise(function(resolve, reject) {
            $.getJSON(searchParams.get('json'), function(survey) {
                resolve(survey);
            });
        });
    },

    localizeForm: function() {
        if(searchParams.has('lang')) {
            i18n.set(searchParams.get('lang'));
        }
        var lang = i18n.get();
        this.form.langs.setAll(lang == 'en' ? 'default' : lang);
    },

    initializeForm: function(modelStr, instanceStr, submitted) {
        this.form = new Form('form.or:eq(0)', {
            modelStr: modelStr,
            instanceStr: instanceStr,
            submitted: submitted == undefined ? false : submitted
        });

        var loadErrors = this.form.init();
        if (loadErrors.length) {
            console.log(loadErrors);
            throw new Error("The form could not be initialized");
        }

        this.localizeForm();
    },

    modifySurvey: function(str) {
        return str;
    },

    customNextPage: function() {
        var that = this.form.pages;
        var currentIndex, next, newIndex;
        that.updateAllActive();
        currentIndex = that.getCurrentIndex();
        next = that.getNext(currentIndex);
        newIndex = currentIndex + 1;
        that.flipTo(next, newIndex);
    },

    modifyUI: function() {
        $('<br />').insertAfter('#form-title');
        $('#form-title').detach().insertAfter('.form-header .pull-right');
        $('input[type="file"]').attr('capture', 'camera');
        $('select[multiple=multiple] option[value=""]').remove();

        $('.next-page').off('click').click(function(e) {
            this.customNextPage();
        }.bind(this));

        var $imgTags = $('img');
        $imgTags.each(function() {
            var $el = $(this);
            var src = $el.attr('src');
            if (src.indexOf("jr://images/") < 0 || src == "jr://images/-") {
                return;
            }

            var url = src.replace("jr://images/", "");
            var parser = document.createElement('a');
            parser.href = url;

            var parts = parser.pathname.split("/");
            var file = parts[parts.length - 1];

            $(this).attr('src', 'assets/' + file);
        });
    },

    subscribeProgress: function() {
        var $progress = $('.form-progress');
        $(document).on('progressupdate.enketo', 'form.or', function(event, status) {
            if ($progress.length > 0) {
                $progress.css('width', status + '%');
            }
        });
    },

    preventAccidentalLeave: function() {
        window.onbeforeunload = function(e) {
            return i18n._("survey.leave");
        };
    },

    stopLeaveCheck: function() {
        window.onbeforeunload = null;
    },

    validate: function() {
        // DEBUG MODE?
        return Promise.resolve(true);
        var previousContent = $('.submit-form').html();
        $('.submit-form').attr('disabled', 'disabled').html('Validating...');

        var that = this;
        return new Promise(function(resolve, reject) {
            //
            that.form.validate().then(function(valid) {
                $('.submit-form').html(previousContent).removeAttr('disabled');
                if (valid) {
                    resolve();
                } else {
                    throw new Error("Validation failed");
                }
            });
        });
    },

    submit: function() {
        var _this = this;
        // First, save all fields
        return this.validate()
            .then(function() {
                return _this.saveSession();
            })
            .then(function() {
                _this.toggleAutosave(false);
                _this.stopLeaveCheck();
                return SessionManager.end();
            })
            .catch(function(error) {
                if (error.message == 'redirected!') {
                    throw error;
                }
                console.error(error);
                throw new Error(i18n._("survey.errors"));
            });
    },

    getRecord: function() {
        //
        var files = fileManager.getCurrentFiles();
        // Bring out any previously attached media
        $('form.or input[type="file"][data-loaded-file-name]').each(function() {
            files.push($(this).data('loaded-file-name'));
        });

        return {
            'instance_id': this.form.instanceID,
            'deprecated_id': this.form.deprecatedID,
            'xml': this.form.getDataStr(),
            'files': files
        };
    },

    saveSession: function(showMsg) {
        if (this.saving !== null) {
            // Prevent triggering a save repeatedly.
            return this.saving;
        }
        var _this = this;
        var $saveProgress = $('.save-progress');

        $saveProgress.html('<i class="fa fa-spinner fa-spin"></i>');
        $saveProgress.attr('disabled', 'disabled');

        var finishSaving = function() {
            _this.saving = null;
            $saveProgress.html('<i class="fa fa-save"></i>');
            $saveProgress.removeAttr('disabled', 'disabled');
        };
        return SessionManager.save(this.getRecord()).then(function() {
            finishSaving();
            if (showMsg) {
                toastr.success(i18n._("survey.saved"));
            }
        }).catch(function(error) {
            finishSaving();
            toastr.error('An error occured while saving this sesssion...');
            throw error;
        });
    },

    saveAndExit: function() {
        this.saveSession(false).then(function() {
            var redirectUri = SessionManager.browserMode
                ? SessionManager.returnUrl
                : 'index.html';
            window.location = redirectUri;
        });
    }
};

module.exports = Survey;
