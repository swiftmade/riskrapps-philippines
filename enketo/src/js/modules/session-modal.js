var Vue = require('vue');
var moment = require('moment');

Vue.filter('timeAgo', function (value) {
    return moment(value).fromNow();
});

function fireSessionEvent(name, payload) {
    var event = new CustomEvent(name, {
        detail: payload
    });

    var elem = document.getElementById("app");
    elem.dispatchEvent(event);
}

module.exports = Vue.component('modal', {
    template: '#modal-template',
    data: function () {
        return {
            name: "",
            error: "",
            disabled: false
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            twoWay: true
        },
        sessions: {
            type: Array,
            required: true,
            twoWay: false,
            default: function () {
                return []
            }
        }
    },
    methods: {
        destroy: function (session) {
            if (confirm('Do you really want to delete this session') !== true) {
                return
            }
            fireSessionEvent("session:destroy", {
                "session": session
            });
        },
        load: function (session) {
            fireSessionEvent("session:load", {
                "session": session
            });
        },
        create: function () {
            var name = this.name ? this.name.trim() : "";

            if (name == "") {
                this.error = "Please name this session";
                return;
            }

            this.disabled = true;

            fireSessionEvent("session:create", {
                name: this.name
            });
        }
    }
});