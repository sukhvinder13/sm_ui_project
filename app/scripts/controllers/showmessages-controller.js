'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ShowMessagesControllerCtrl
 * @description
 * # MessagesControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ShowMessagesController', function (showmessagesService, $cookies, $log, $rootScope) {
        var MessagesCtrl = this;
        MessagesCtrl.messageDetails = {};
        MessagesCtrl.schoolId = $cookies.getObject('uds').schoolId;
        MessagesCtrl.loginId = $cookies.getObject('uds').id;
        //console.log(ShowMsgCtrl.loginId);
        $rootScope.$on('replymessage', function (scope, v) {
            MessagesCtrl.chatMessageId = v.msgId;
            MessagesCtrl.chatMessage = v.msg;
        });
    });