var toastr = require('toastr');
var Promise = require('bluebird');
var Form = require('enketo-core/src/js/Form');
var searchParams = require('./utils/search-params');
var appendRecordFiles = require("./record-files");
var submitProgress = require('./submit-progress');
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
                    JumpTo(that.form);
                    that.modifyUI();
                    that.subscribeProgress();

                    that.preventAccidentalLeave();
                    that.toggleAutosave(true);
                    //
                    $header.show();
                    
                    setTimeout(() => {
                        $("#loading-block").remove();
                        $(window).scrollTop(0);
                        resolve();
                    })
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
                survey.form = survey.form.replace(/jr:\/\/images\/https:\/\/www.dropbox.com\/s\/.*?\//g, "assets/");
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
        $('#submit-progress').hide();
        $('<br />').insertAfter('#form-title');
        $('#form-title').detach().insertAfter('.form-header .pull-right');
        $('input[type="file"]').attr('capture', 'camera');
        $('select[multiple=multiple] option[value=""]').remove();

        $('.next-page').off('click').click(function(e) {
            this.customNextPage();
        }.bind(this));


        /*
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

            $(this).at
            *tr('src', 'assets/' + file);
        });*/
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
        // return Promise.resolve(true);
        function disableSubmitButton() {
            var previousContent = $('.submit-form').html();
            $('.submit-form').attr('disabled', 'disabled').html('Validating...');
            return new Promise(function(resolve) {
                setTimeout(resolve);
            });
        }

        var that = this;
        return disableSubmitButton().then(function() {
            that.form.validate();
        }).then(function(valid) {
            $('.submit-form').html(previousContent).removeAttr('disabled');
            if ( ! valid) {
                throw new Error("Validation failed");
            }
        });
    },

    submit: function() {
        var _this = this;
        // First, save all fields
        return this.validate()
            .then(function() {
                submitProgress.show('Saving your session...');
                return _this.saveSession();
            }).then(function() {
                submitProgress.show("Optimizing attachments...");
                return SessionManager.optimize();
            })
            .then(function() {
                submitProgress.show("Finalizing your submission...");
                _this.toggleAutosave(false);
                _this.stopLeaveCheck();
                return SessionManager.end();
            })
            .catch(function(error) {
                submitProgress.hide();
                if (error.message == 'redirected!') {
                    throw error;
                }
                console.error(error);
                throw new Error(i18n._("survey.errors"));
            });
    },

    getRecord: function() {
        var _this = this;
        return Promise.resolve({
            'instance_id': this.form.instanceID,
            'deprecated_id': this.form.deprecatedID,
            'xml': this.form.getDataStr(),
        });
    },

    /**
     * outcome must be either success or error
     */
    finishSaving: function(outcome, message) {
        this.saving = null;
        var $saveProgress = $(".save-progress");
        $saveProgress.html('<i class="fa fa-save"></i>');
        $saveProgress.removeAttr('disabled', 'disabled');

        if (message) {
            toastr[outcome](message)
        }
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

        return this.getRecord()
            .then(appendRecordFiles)
            .then(function(record) {
                return SessionManager.save(record);
            })
            .then(function() {
                _this.finishSaving("success", showMsg ? i18n._("survey.saved") : null);
            })
            .catch(function(error) {
                _this.finishSaving("error", "An error occured while saving this sesssion...");
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
