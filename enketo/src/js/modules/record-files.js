var fileManager = require('enketo-core/src/js/file-manager');

module.exports = function(record) {

    /**
     * Get currently attached files from Enketo
    */
    var files = fileManager.getCurrentFiles();

    /**
     * Also append previously uploaded files, but as strings.
     */
    $('form.or input[type="file"][data-loaded-file-name]').each(function() {
        files.push($(this).data('loaded-file-name'));
    });    

    record.files = files
    return Promise.resolve(record)
}