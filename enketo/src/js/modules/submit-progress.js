module.exports = {
    show: function(msg) {
        $("#submit-progress-text").text(msg);
        $("#submit-progress").overlay('show');
    },
    hide: function() {
        $('#submit-progress').overlay('hide');
    }
}