'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:btController
 * @description
 * # btController
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('btController', function ($cookies, $timeout,$state, APP_MESSAGES, toastr,Btperms) {
        var btCtrl = this;

        btCtrl.isDisabled =false;
        btCtrl.role = $cookies.get('role');
        btCtrl.form={
          bankAccountNumber:'',
          schoolId:$cookies.getObject('uds').schoolId
        }
        Btperms.find({ filter:{where:{"schoolId":btCtrl.form.schoolId}}},function(result){
          console.log(result);
          btCtrl.form.bankAccountNumber=result[0].bankAccountNumber
        },function(error){
          console.log(error);
        });
        //currently this page only can see by Admins but apprently this can be able to use only by Super admins
        if(btCtrl.role !== 'Admin')
          $state.go('404');
        btCtrl.saveBTperms=function(){
          btCtrl.isDisabled =true;
          Btperms.upsertWithWhere( {where:{"schoolId":btCtrl.form.schoolId}},btCtrl.form,function (response) {
            window.alert('successfully saved')
          },function (error) {
            console.log(error);
          });
        }

    });
