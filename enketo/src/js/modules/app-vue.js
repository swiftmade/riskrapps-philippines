var Vue = require('vue');
var vueModal = require('./session-modal');

var vue = new Vue({
    el: '#app',
    data: {
        showModal: false,
        sessions: []
    }
});

module.exports = vue;