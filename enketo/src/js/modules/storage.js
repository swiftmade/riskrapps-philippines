var PouchDB = require('pouchdb');
var _ = require('lodash');

window.PouchDB = PouchDB;

function getStorageDriver(name) {
    var storage = new PouchDB(name, {
        adapter: 'idb',
        // We don't really want to keep revisions at all.
        revs_limit: 1,
        // Get rid of redundant documents after each write
        auto_compaction: true
    });

    return storage;
}

var instances = {}

function Storage(dbName) {

    var driver = getStorageDriver(dbName);

    this.all = function() {
        return driver
            .allDocs({ include_docs: true })
            .then(function(result) {
                return _.map(result.rows, function(row) {
                    return row.doc;
                });
            });
    };

    this.create = function(doc) {
        return driver.post(doc).then(function(result) {
            return driver.get(result.id);
        });
    };
    
    this.update = function(doc) {
        return driver.put(doc).then(function(result) {
            return driver.get(result.id);
        });
    };

    this.get = function(id) {
        return driver.get(id);
    };

    this.remove = function(doc) {
        return driver.remove(doc);
    };

    this.attach = function(id, attachmentId, blob) {
        return driver.putAttachment(id, attachmentId, blob);
    };
    
    this.getAttachment = function(id, filename) {
        return driver.getAttachment(id, filename);
    };
}

module.exports = {
    instance: function(name) {
        if ( ! instances.hasOwnProperty(name)) {
            instances[name] = new Storage(name)
        }
        return instances[name]
    }
};
