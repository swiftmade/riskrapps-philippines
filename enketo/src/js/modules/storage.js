var PouchDB = require('pouchdb');
var _ = require('lodash');

window.PouchDB = PouchDB;

function getStorage(name) {
    var storage = new PouchDB(name, { adapter: 'websql' });
    if (!storage.adapter) {
        storage = new PouchDB(name);
    }
    return storage;
}

module.exports = {

    instance: function(name) {
        var storage = getStorage(name);

        return {
            all: function() {
                return storage.allDocs({ 'include_docs': true }).then(function(result) {
                    return _.map(result.rows, function(row) {
                        return row.doc;
                    });
                });
            },

            create: function(doc) {
                return storage.post(doc).then(function(result) {
                    return storage.get(result.id);
                });
            },

            update: function(doc) {
                return storage.put(doc).then(function(result) {
                    return storage.get(result.id);
                });
            },

            get: function(id) {
                return storage.get(id);
            },

            remove: function(doc) {
                return storage.remove(doc);
            },

            attach: function(id, attachmentId, blob) {
                return storage.putAttachment(id, attachmentId, blob);
            },

            getAttachment: function(id, filename) {
                return storage.getAttachment(id, filename);
            }
        }
    }
};
