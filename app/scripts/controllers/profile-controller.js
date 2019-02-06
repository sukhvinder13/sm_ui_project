'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ProfileControllerCtrl
 * @description
 * # ProfileControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('ProfileController', function (configService, profileService, $cookies, $timeout, toastr, APP_MESSAGES, $state, $http) {
    var ProfileCtrl = this;
    //Default SchoolId
    ProfileCtrl.schoolId = $cookies.getObject('uds').schoolId;
    // For Role
    ProfileCtrl.disable = false;
    ProfileCtrl.role = $cookies.get('role');
    //Defaults
    ProfileCtrl.firstName = $cookies.getObject('uds').firstName;
    ProfileCtrl.lastName = $cookies.getObject('uds').lastName;
    ProfileCtrl.email = $cookies.getObject('uds').email;
    ProfileCtrl.contact = $cookies.getObject('uds').contact;
    ProfileCtrl.password = $cookies.getObject('uds').password;
    ProfileCtrl.password = $cookies.getObject('uds').cPassword;
    ProfileCtrl.editUserId = $cookies.getObject('uds').id;
    //Setting up float label
    $timeout(function () {
      ProfileCtrl.setFloatLabel();
    });
    ProfileCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=firstName]'));
      Metronic.setFlotLabel($('input[name=lastName]'));
      Metronic.setFlotLabel($('input[name=email]'));
      Metronic.setFlotLabel($('input[name=contact]'));
      Metronic.setFlotLabel($('input[name=password]'));
      Metronic.setFlotLabel($('input[name=cPassword]'));
    };
    //Profile ImageUpdation
    ProfileCtrl.uploadProfileImage = function (index) {
      ProfileCtrl.file = document.getElementById('profileFile').files[0];
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', ProfileCtrl.file);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/ProfilePics/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            // $scope.Students.abcd =   response.id;
            ProfileCtrl.file = configService.baseUrl() + '/ImageContainers/ProfilePics/download/' + response.data.result[0].filename;
            // //console.log(JSON.stringify(response.result[0].filename));
          }
        }, function (error) {
          //console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    ProfileCtrl.profileAction = function (invalid) {
      if (invalid) {
        return;
      }
      var data = {
        'firstName': ProfileCtrl.firstName,
        'lastName': ProfileCtrl.lastName,
        'email': ProfileCtrl.email,
        'contact': ProfileCtrl.contact,
        'password': ProfileCtrl.password,
        'cPassword': ProfileCtrl.cPassword,
        'file': ProfileCtrl.file,
        'profileUpdate': true
      };
      if (data) {
        if (ProfileCtrl.role) {
          data.id = ProfileCtrl.editUserId;
          profileService.updateUser(data, ProfileCtrl.role).then(function (response) {
            if (response) {
              $cookies.putObject('uds', response);
              //Show Toast Message Success
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              $timeout(function () {
                location.reload();
                $cookies.remove('uds');
                $cookies.remove('uts');
                $state.go('login');
              }, 500);
            }
          });
        }
      }
    };
    ProfileCtrl.matchingPwd = function () {
      if (ProfileCtrl.password === ProfileCtrl.cPassword) {
        document.getElementById('cPwd').style.backgroundColor = "lightgreen";
        document.getElementById('newPwd').style.backgroundColor = "lightgreen";
        ProfileCtrl.disable = false;
      } else {
        document.getElementById('cPwd').style.backgroundColor = "pink";
        document.getElementById('newPwd').style.backgroundColor = "lightgreen";
        ProfileCtrl.disable = true;
      }
    }
    ProfileCtrl.matchingPwd1 = function () {
      if (ProfileCtrl.password.length >= 5) {
        document.getElementById('newPwd').style.backgroundColor = "lightgreen";
      }
      if (ProfileCtrl.cPassword === null || ProfileCtrl.cPassword === undefined) {
        return;
      }
      if (ProfileCtrl.password === ProfileCtrl.cPassword) {
        document.getElementById('cPwd').style.backgroundColor = "lightgreen";
        document.getElementById('newPwd').style.backgroundColor = "lightgreen";
        ProfileCtrl.disable = false;
      } else {
        document.getElementById('cPwd').style.backgroundColor = "pink";
        document.getElementById('newPwd').style.backgroundColor = "lightgreen";
        ProfileCtrl.disable = true;
      }
    }
  });