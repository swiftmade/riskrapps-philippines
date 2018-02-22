var $ = require('jquery');
var Promise = require('bluebird');
var searchParams = require('./utils/search-params');

module.exports = function() {
    var session = {
        'xml': null,
        'draft': false,
        'submitted': false,
        'browser_mode': true,
        'instance_id': null,
        'deprecated_id': null
    };
    return new Promise(function(resolve) {
        if (!searchParams.has('submissionUrl')) {
            resolve(session);
            return;
        }
        $.getJSON(searchParams.get('submissionUrl'))
            .done(function(data) {
                session.submitted = true;
                session.xml = data.instance;
                session.instance_id = data.instance_id;
                session.deprecated_id = data.deprecated_id;
                resolve(session);
            })
            .fail(function() {
                throw new Error("Could not load document");
            });
    });
};
