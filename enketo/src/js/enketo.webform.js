var Vue = require('vue');
var $ = (window.jQuery = window.$ = require("jquery"));
require('./modules/utils/overlay');

var toastr = require('toastr');
var vue = require('./modules/app-vue');
var support = require("./modules/support");
// until all plugins are commonJS-friendly, expose jQuery globally
window.Vue = Vue;

support.touch = true;

toastr.options = {
    "positionClass": "toast-top-left"
};

var Survey = require('./modules/survey');

$(document).ready(function() {
    $('html').addClass('touch');
    Survey.initializeSurvey();
    
    $('.save-progress').click(function() {
        Survey.saveSession(true);
    });

    $('#close-button').click(function() {
        Survey.saveAndExit();
    });

    $('.validate-form').on('click', function() {
        Survey.validate().then(function() {
            toastr.success("The data looks valid!");
            $('.last-page').click();
        }).catch(function(error) {
            toastr.error(error.message ? error.message : "An unknown error occured");
        });
    });

    $('.first-page-alias').click(function() { $('.first-page').click(); });
    $('.last-page-alias').click(function() { $('.last-page').click(); });

    // validate handler for validate button
    $('.submit-form').on('click', function() {
        Survey.submit().then(function() {
            // Successful
            toastr.success("Your submission has been successfully saved on the device");
            $('.submit-form').remove();
            window.location = "index.html";
        }).catch(function(error) {
            if(error.message == "redirected!") {
                return;
            }
            // Rejected!
            toastr.error(error.message ? error.message : "An unknown error occured");
        });

        return false;
    });
});
