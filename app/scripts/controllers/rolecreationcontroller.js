'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:RolecreationcontrollerCtrl
 * @description
 * # RolecreationcontrollerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('RolecreationcontrollerCtrl', function (configService, roleCreationService, $timeout, toastr, APP_MESSAGES, $state, $cookies, $http, $window, ManageRole, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var RolecreationCtrl = this;
    RolecreationCtrl.schoolId = $cookies.getObject('uds').schoolId;
    RolecreationCtrl.shiva1 = $window.localStorage.getItem('tree');
    RolecreationCtrl.shiva2 = JSON.parse(RolecreationCtrl.shiva1);
    RolecreationCtrl.RoleCreationlistAdmin1 = [];
    RolecreationCtrl.RoleCreationlistAdmin2 = [];
    RolecreationCtrl.RoleCreationlistStaff1 = [];
    RolecreationCtrl.RoleCreationlistStaff2 = [];
    RolecreationCtrl.RoleCreationlistStudent1=[];
    RolecreationCtrl.RoleCreationlistStudent2=[];
    RolecreationCtrl.shiva = RolecreationCtrl.shiva2[0].type;
    if ($rootScope.roleAdmin == undefined) {

    } else {
      RolecreationCtrl.searchTab = $rootScope.roleAdmin;
      $timeout(function(){
        RolecreationCtrl.grabData(RolecreationCtrl.searchTab);
      },1000);
    }
    RolecreationCtrl.back = function () {
      $state.go('home.settings');
    }
    function Init() {
      //Get list of fees details by school ID
      this.getRolecreationDetailsAdmin = function () {
        console.log(RolecreationCtrl.schoolId);
        $http({
          "url": configService.baseUrl() +'/ManageRoles?filter={"where":{"schoolId":"' + RolecreationCtrl.schoolId + '"}}',
          "method": "GET",
          "headers": { "Content-Type": "application/json" }
        }).then(function (response) {
          console.log(response);
          for(var q =0;q<response.data.length;q++){
          }
          for (var i=0;i<response.data.length;i++) {
            if (response.data[i].type == "Admin") {
              RolecreationCtrl.RoleCreationlistAdmin = response.data[i];
            } else if (response.data[i].type == "Staff") {
              RolecreationCtrl.RoleCreationlistStaff = response.data[i];
            } else if (response.data[i].type == "Student") {
              RolecreationCtrl.RoleCreationlistStudent = response.data[i];
              var stud1 = RolecreationCtrl.RoleCreationlistStudent.RolesData.length;
            } else if (response.data[i].type == "Accountant") {
              RolecreationCtrl.RoleCreationlistAccountant = response.data[i];
            } else if (response.data[i].type == "Parent") {
              RolecreationCtrl.RoleCreationlistParent = response.data[i];
            }
          }
        });

        $http({
          "url": configService.baseUrl() +'/ManageRoles?{"schoolId":"' + RolecreationCtrl.schoolId + '"}',
          "method": "PUT",
          "headers": { "Content-Type": "application/json" }
        })
          .then(function (response) {
          })
      };

     
    }
    (new Init()).getRolecreationDetailsAdmin();


    // set data start
    RolecreationCtrl.grabData = function(data){
      if(data == "Admin"){
        if(RolecreationCtrl.RoleCreationlistAdmin1.length==0||RolecreationCtrl.RoleCreationlistAdmin2.length==0){

        
        var list1 = RolecreationCtrl.RoleCreationlistAdmin.RolesData.length;
              var adm1 = list1 / 2;
              var admin1 = Math.round((list1 / 2) * 100 / 100);
              var admin2 = list1 - admin1 + 1;
              for (var i = 0; i < admin1; i++) {
                RolecreationCtrl.RoleCreationlistAdmin1.push({ "index": i, "w": RolecreationCtrl.RoleCreationlistAdmin.RolesData[i] });
              };
              for (var i = admin2; i < RolecreationCtrl.RoleCreationlistAdmin.RolesData.length; i++) {
                RolecreationCtrl.RoleCreationlistAdmin2.push({ "index": i, "w": RolecreationCtrl.RoleCreationlistAdmin.RolesData[i] });
              };
            }
      }
      if(data == "Staff"){
        if(RolecreationCtrl.RoleCreationlistStaff1.length==0||RolecreationCtrl.RoleCreationlistStaff2.length==0){
        var staf1 = RolecreationCtrl.RoleCreationlistStaff.RolesData.length;
              var stafflist1 = RolecreationCtrl.RoleCreationlistStaff.RolesData.length;
              var staff1 = Math.round((stafflist1 / 2) * 100 / 100);
              var staff2 = stafflist1 - staff1 + 1;
              for (var i = 0; i < staff1; i++) {
                RolecreationCtrl.RoleCreationlistStaff1.push({ "index": i, "w": RolecreationCtrl.RoleCreationlistStaff.RolesData[i] });
              }
              for (var i = staff2; i < RolecreationCtrl.RoleCreationlistStaff.RolesData.length; i++) {

                RolecreationCtrl.RoleCreationlistStaff2.push({ "index": i, "w": RolecreationCtrl.RoleCreationlistStaff.RolesData[i] });
              }
            }

      }   
      if(data == "Student"){
        if(RolecreationCtrl.RoleCreationlistStudent1.length==0||RolecreationCtrl.RoleCreationlistStudent2.length==0){
        var stu1 =  RolecreationCtrl.RoleCreationlistStudent.RolesData.length;
              var stulist1 = RolecreationCtrl.RoleCreationlistStudent.RolesData.length;
              var stu1 = Math.round((stulist1 / 2) * 100 / 100);
              var stu2 = stulist1 - stu1 + 1;
              for (var i = 0; i < stu1; i++) {
                RolecreationCtrl.RoleCreationlistStudent1.push({ "index": i, "w": RolecreationCtrl.RoleCreationlistStudent.RolesData[i] });
              }
              for (var i = stu2; i <  RolecreationCtrl.RoleCreationlistStudent.RolesData.length; i++) {

                RolecreationCtrl.RoleCreationlistStudent2.push({ "index": i, "w":  RolecreationCtrl.RoleCreationlistStudent.RolesData[i] });
              }
            }
      }
      if(data == "Parent"){
        var stu1 = RolecreationCtrl.RoleCreationlistParent.RolesData.length;
              var stulist1 = RolecreationCtrl.RoleCreationlistParent.RolesData.length;
              var stu1 = Math.round((stulist1 / 2) * 100 / 100);
              var stu2 = stulist1 - stu1 + 1;
              RolecreationCtrl.RoleCreationlistParent1=[];
              RolecreationCtrl.RoleCreationlistParent2=[];
              for (var i = 0; i <= stu1; i++) {
                RolecreationCtrl.RoleCreationlistParent1.push({ "index": i, "w": RolecreationCtrl.RoleCreationlistParent.RolesData[i] });
              }
              for (var i = stu2; i <  RolecreationCtrl.RoleCreationlistParent.RolesData.length; i++) {

                RolecreationCtrl.RoleCreationlistParent2.push({ "index": i, "w":  RolecreationCtrl.RoleCreationlistParent.RolesData[i] });
              }
              
      } 
      if(data == "Accountant"){
        var stu1 = RolecreationCtrl.RoleCreationlistAccountant.RolesData.length;
              var stulist1 = RolecreationCtrl.RoleCreationlistAccountant.RolesData.length;
              var stu1 = Math.round((stulist1 / 2) * 100 / 100);
              var stu2 = stulist1 - stu1 + 1;
              RolecreationCtrl.RoleCreationlistAccountant1=[];
              RolecreationCtrl.RoleCreationlistAccountant2=[];
              for (var i = 0; i <= stu1; i++) {
                RolecreationCtrl.RoleCreationlistAccountant1.push({ "index": i, "w": RolecreationCtrl.RoleCreationlistAccountant.RolesData[i] });
              }
              for (var i = stu2; i <=  RolecreationCtrl.RoleCreationlistParent.RolesData.length; i++) {

                RolecreationCtrl.RoleCreationlistAccountant2.push({ "index": i, "w":  RolecreationCtrl.RoleCreationlistAccountant.RolesData[i] });
              }
      }     
    }
    //set data end
    RolecreationCtrl.checkViewAdmin = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].view == true) {
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].view = false;
      } else if (RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].view == false) {
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistAdmin.RolesData,
          "status": RolecreationCtrl.RoleCreationlistAdmin.status,
          "schoolId": RolecreationCtrl.RoleCreationlistAdmin.schoolId,
          "type": RolecreationCtrl.RoleCreationlistAdmin.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {

        })
    };
    RolecreationCtrl.checkEditAdmin = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].edit == true) {
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].edit = false;
      } else if (RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].edit == false) {
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].view = true;
      }
     
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistAdmin.RolesData,
          "status": RolecreationCtrl.RoleCreationlistAdmin.status,
          "schoolId": RolecreationCtrl.RoleCreationlistAdmin.schoolId,
          "type": RolecreationCtrl.RoleCreationlistAdmin.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkdeleteAdmin = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].delete == true) {
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].delete = false;
      } else if (RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].delete == false) {
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].delete = true;
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistAdmin.RolesData[index].view = true;
      }
    
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistAdmin.RolesData,
          "status": RolecreationCtrl.RoleCreationlistAdmin.status,
          "schoolId": RolecreationCtrl.RoleCreationlistAdmin.schoolId,
          "type": RolecreationCtrl.RoleCreationlistAdmin.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    //admin end

    // student start
    RolecreationCtrl.checkViewStudent = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistStudent.RolesData[index].view == true) {
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].view = false;
      } else if (RolecreationCtrl.RoleCreationlistStudent.RolesData[index].view == false) {
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistStudent.RolesData,
          "status": RolecreationCtrl.RoleCreationlistStudent.status,
          "schoolId": RolecreationCtrl.RoleCreationlistStudent.schoolId,
          "type": RolecreationCtrl.RoleCreationlistStudent.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkEditStudent = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistStudent.RolesData[index].edit == true) {
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].edit = false;
      } else if (RolecreationCtrl.RoleCreationlistStudent.RolesData[index].edit == false) {
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].view = true;
      }
    
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistStudent.RolesData,
          "status": RolecreationCtrl.RoleCreationlistStudent.status,
          "schoolId": RolecreationCtrl.RoleCreationlistStudent.schoolId,
          "type": RolecreationCtrl.RoleCreationlistStudent.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {

        })
    };
    RolecreationCtrl.checkdeleteStudent = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistStudent.RolesData[index].delete == true) {
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].delete = false;
      } else if (RolecreationCtrl.RoleCreationlistStudent.RolesData[index].delete == false) {
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].delete = true;
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistStudent.RolesData[index].view = true;
      }
      
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistStudent.RolesData,
          "status": RolecreationCtrl.RoleCreationlistStudent.status,
          "schoolId": RolecreationCtrl.RoleCreationlistStudent.schoolId,
          "type": RolecreationCtrl.RoleCreationlistStudent.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    // student end

    //staff start
    RolecreationCtrl.checkViewStaff = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistStaff.RolesData[index].view == true) {
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].view = false;
      } else if (RolecreationCtrl.RoleCreationlistStaff.RolesData[index].view == false) {
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistStaff.RolesData,
          "status": RolecreationCtrl.RoleCreationlistStaff.status,
          "schoolId": RolecreationCtrl.RoleCreationlistStaff.schoolId,
          "type": RolecreationCtrl.RoleCreationlistStaff.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkEditStaff = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistStaff.RolesData[index].edit == true) {
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].edit = false;
      } else if (RolecreationCtrl.RoleCreationlistStaff.RolesData[index].edit == false) {
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistStaff.RolesData,
          "status": RolecreationCtrl.RoleCreationlistStaff.status,
          "schoolId": RolecreationCtrl.RoleCreationlistStaff.schoolId,
          "type": RolecreationCtrl.RoleCreationlistStaff.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkdeleteStaff = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistStaff.RolesData[index].delete == true) {
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].delete = false;
      } else if (RolecreationCtrl.RoleCreationlistStaff.RolesData[index].delete == false) {
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].delete = true;
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistStaff.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistStaff.RolesData,
          "status": RolecreationCtrl.RoleCreationlistStaff.status,
          "schoolId": RolecreationCtrl.RoleCreationlistStaff.schoolId,
          "type": RolecreationCtrl.RoleCreationlistStaff.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkViewAccountant = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].view == true) {
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].view = false;
      } else if (RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].view == false) {
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistAccountant.RolesData,
          "status": RolecreationCtrl.RoleCreationlistAccountant.status,
          "schoolId": RolecreationCtrl.RoleCreationlistAccountant.schoolId,
          "type": RolecreationCtrl.RoleCreationlistAccountant.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkEditAccountant = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].edit == true) {
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].edit = false;
      } else if (RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].edit == false) {
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistAccountant.RolesData,
          "status": RolecreationCtrl.RoleCreationlistAccountant.status,
          "schoolId": RolecreationCtrl.RoleCreationlistAccountant.schoolId,
          "type": RolecreationCtrl.RoleCreationlistAccountant.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkdeleteAccountant = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].delete == true) {
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].delete = false;
      } else if (RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].delete == false) {
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].delete = true;
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistAccountant.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistAccountant.RolesData,
          "status": RolecreationCtrl.RoleCreationlistAccountant.status,
          "schoolId": RolecreationCtrl.RoleCreationlistAccountant.schoolId,
          "type": RolecreationCtrl.RoleCreationlistAccountant.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkViewParent = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistParent.RolesData[index].view == true) {
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].view = false;
      } else if (RolecreationCtrl.RoleCreationlistParent.RolesData[index].view == false) {
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistParent.RolesData,
          "status": RolecreationCtrl.RoleCreationlistParent.status,
          "schoolId": RolecreationCtrl.RoleCreationlistParent.schoolId,
          "type": RolecreationCtrl.RoleCreationlistParent.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkEditParent = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistParent.RolesData[index].edit == true) {
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].edit = false;
      } else if (RolecreationCtrl.RoleCreationlistParent.RolesData[index].edit == false) {
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistParent.RolesData,
          "status": RolecreationCtrl.RoleCreationlistParent.status,
          "schoolId": RolecreationCtrl.RoleCreationlistParent.schoolId,
          "type": RolecreationCtrl.RoleCreationlistParent.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
    RolecreationCtrl.checkdeleteParent = function (recordID, data, index) {
      if (RolecreationCtrl.RoleCreationlistParent.RolesData[index].delete == true) {
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].delete = false;
      } else if (RolecreationCtrl.RoleCreationlistParent.RolesData[index].delete == false) {
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].delete = true;
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].edit = true;
        RolecreationCtrl.RoleCreationlistParent.RolesData[index].view = true;
      }
      $http({
        "url": configService.baseUrl() +'/ManageRoles',
        "method": "PUT",
        "data": {
          "id": recordID, "RolesData": RolecreationCtrl.RoleCreationlistParent.RolesData,
          "status": RolecreationCtrl.RoleCreationlistParent.status,
          "schoolId": RolecreationCtrl.RoleCreationlistParent.schoolId,
          "type": RolecreationCtrl.RoleCreationlistParent.type,
        },
        "headers": { "Content-Type": "application/json" }
      })
        .then(function (response) {
        })
    };
  });