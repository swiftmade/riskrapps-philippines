var $ = require('jquery');
var _ = require('lodash');
var moment = require('moment');
var toastr = require('toastr');
var angular = require('angular');
var app = angular.module('app', []);
var submit = require('./modules/submit');
var storage = require('./modules/storage');
var sessionRepo = storage.instance('sessions');

app.filter('fileSize', function() {
    return function(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
});

app.filter('date', function() {
    return function(date) {
        return moment(date).format("DD/MM/YYYY hh:mm");
    };
});

app.directive('progress', function() {
    return {
        scope: {
            value: '='
        },
        restrict: 'E',
        replace: true,
        template: '<div class="progress"> ' +
            '<div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100" style="width: {{value}}%"> ' +
            '<span class="sr-only">{{value}}% Complete (success)</span> ' +
            '</div> ' +
            '</div>'
    }
});

app.service('UploadManager', function() {
    var parallel = 4; // parallel uploads
    var active = 0;
    var queue = [];

    var manager = {
        run: function() {
            if (active == parallel || !queue.length) {
                return;
            }
            active++;

            var next = queue.shift();

            submit(next.packet, next.progress)
                .then(function() {
                    next.done(true);
                    active--;
                    manager.run();
                }).catch(function(err) {
                    next.done(false);
                    toastr.error(i18n._("submissions.error", { packet: next.packet.name }));
                });
        },
        queue: function(process) {
            if (process.packet.uploading || process.packet.uploaded) {
                return;
            }

            process.packet.uploading = true;
            queue.push(process);
            manager.run();
        }
    };

    return manager;
});

app.controller('SubmissionsCtrl', ['$scope', 'UploadManager', function($scope, $upload) {

    sessionRepo.all().then(function(sessions) {
        var packets = _.filter(sessions, function(session) {
            return !session.draft && !session.submitted;
        });

        packets = _.map(packets, function(packet) {
            packet.size = _.sum(_.map(packet._attachments, function(attachment) {
                return attachment.length;
            }));

            return packet;
        });

        $scope.packets = packets;
        $scope.$apply();
    });

    $scope.uploadAll = function() {
        angular.forEach($scope.packets, function(packet) {
            $scope.upload(packet);
        });
    };

    $scope.remove = function(packet) {
        var index = $scope.packets.indexOf(packet);
        $scope.packets.splice(index);
    };

    $scope.upload = function(packet) {
        $upload.queue({
            packet: packet,
            progress: function(p) {
                packet.progress = p * 100;
                $scope.$apply();
            },
            done: function(result) {
                packet.uploading = false;
                packet.uploaded = result;
                $scope.$apply();
                if(!result) {
                    return;
                }
                sessionRepo.get(packet._id).then(function(session) {
                    session.submitted = true;
                    return sessionRepo.update(session);
                }).then(function() {
                    toastr.success(i18n._("submissions.success", { packet: packet.name }));
                    $scope.remove(packet);
                });
            }
        });
    };
}]);
