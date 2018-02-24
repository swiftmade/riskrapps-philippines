var $ = require('jquery');
var _ = require('lodash');
var submit = require('./submit');
var vue = require('./app-vue');
var Promise = require('bluebird');
var storage = require('./storage');
var Optimizer = require("./optimizer");
var sessionRepo = storage.instance('sessions');
var BrowserSession = require('./browser-session');
var searchParams = require('./utils/search-params');

var SessionManager = {
    //
    session: null,
    returnUrl: null,
    browserMode: false, // In browser mode, app submissions are immediate (not persisted on disk)
    activeSessionIndex: null,

    activateBrowserMode: function() {
        var that = this;
        this.browserMode = true;
        this.returnUrl = searchParams.get('returnUrl');

        $('.save-progress').remove();

        return BrowserSession().then(function(session) {
            that.session = session;
            return session;
        });
    },
    //
    start: function() {
        var that = this;

        var browserMode = searchParams.get('mode');
        if (browserMode === 'edit' || browserMode === 'create') {
            return this.activateBrowserMode();
        }

        return this.loadSessions().then(function() {
            return new Promise(function(resolve) {
                that.selectSession().then(function(session) {
                    that.session = session;
                    vue.$set('showModal', false);
                    setTimeout(function() {
                        resolve(session);
                    }, 50);
                });
            });
        });
    },

    selectSession: function() {
        var that = this;
        vue.$set('showModal', true);

        return new Promise(function(resolve) {
            that.listenSessionEvents(resolve);
        });
    },

    listenSessionEvents: function(resolve) {
        //
        var that = this;
        var app = document.getElementById('app');

        app.addEventListener('session:destroy', function(event) {
            sessionRepo.remove(event.detail.session).then(function() {
                return that.loadSessions();
            });
        });

        app.addEventListener('session:load', function(event) {
            resolve(event.detail.session);
        });

        app.addEventListener("session:create", function(event) {
            return sessionRepo.create({
                name: event.detail.name,
                xml: "",
                submitted: false,
                draft: true,
                last_update: Date.now()
            }).then(function(session) {
                resolve(session);
            });
        });
    },

    loadSessions: function() {
        return sessionRepo.all().then(function(sessions) {
            // Only display draft sessions
            sessions = _.filter(sessions, function(session) {
                return session.draft;
            });

            vue.$set('sessions', sessions);
            return sessions;
        });
    },

    getAttachments: function(files) {
        var _this = this;
        var attachments = {};

        _.each(files, function(file) {
            /**
             * If the file value is a string
             * Then this is just a file name and should be marked as a stub
             * This prevents our storage engine from rewriting the stored file for this file.
             */ 
            if (typeof file == 'string') {
                if (_this.session.hasOwnProperty('_attachments') && _this.session._attachments.hasOwnProperty(file)) {
                    attachments[file] = _this.session['_attachments'][file];
                    attachments[file].stub = true;
                }
                return;
            }
            attachments[file.name] = {
                'content_type': file.type,
                'data': file
            };
        });

        return attachments;
    },

    save: function(record) {
        var _this = this;
        this.session.xml = record.xml;
        this.session._attachments = this.getAttachments(record.files);
        this.session.instance_id = record.instance_id;
        this.session.deprecated_id = record.deprecated_id;

        if (this.browserMode) {
            return Promise.resolve(this.session);
        }

        return sessionRepo.update(this.session)
            .then(function(session) {
                _this.session = session;
            });
    },

    optimize: function() {
        var _this = this;
        return Optimizer(this.session).then(function(session) {
            _this.session = session;
        });
    },

    end: function() {
        this.session.draft = false;
        this.session.last_update = Date.now();
        if (this.browserMode) {
            // Immediately submit and return
            return submit(this.session).then(function() {
                window.location = this.returnUrl;
                throw new Error("redirected!");
            }.bind(this));
        }
        return sessionRepo.update(this.session);
    }
};

module.exports = SessionManager;
