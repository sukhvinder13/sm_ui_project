'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.messagesService
 * @description
 * # messagesService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('showmessagesService', function ($q, Chat) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        this.getMessageDetailsByChatId = function (messageId) {
            var _activepromise = $q.defer();
            Chat.find({ filter: { where: { id: messageId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
    });