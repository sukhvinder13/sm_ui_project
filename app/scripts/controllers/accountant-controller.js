'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AccountantControllerCtrl
 * @description
 * # AccountantControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AccountantController', function (accountantService, School, $timeout, toastr, APP_MESSAGES,configService, ManageRole, $state, $cookies, $stateParams, $http, $filter, Accountant) {
    var AccountantCtrl = this;
    AccountantCtrl.schoolId = $cookies.getObject('uds').schoolId;
    AccountantCtrl.editmode = false;
    AccountantCtrl.selectHide = false;
    AccountantCtrl.uploadImage = function (x) {
      AccountantCtrl.file = document.getElementById('myFile').files[0];
      var fd = new FormData();
      fd.append('file', AccountantCtrl.file);
      var uploadUrl = configService.baseUrl()+"/ImageContainers/Accountants/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AccountantCtrl.file = configService.baseUrl()+'/ImageContainers/Accountants/download/' + response.data.result[0].filename;
          }
        }, function (error) { });
    };
    $http({
      "url": configService.baseUrl()+'/ManageRoles?filter={"where":{"schoolId":"'+AccountantCtrl.schoolId+'","type":"Accountant"}}',
      "method": "GET",
      "headers": { "Content-Type": "application/json" }
  }).then(function (response) {
      AccountantCtrl.managerRoleid = response.data[0].id;
  });
    //upload exp certifiacte
    AccountantCtrl.UploadExpcerti = function (x) {
      AccountantCtrl.expCertiFile = document.getElementById('expCertiFile').files[0];
      var fd = new FormData();
      fd.append('file', AccountantCtrl.expCertiFile);
      var uploadUrl = configService.baseUrl()+"/ImageContainers/Accountants_certi/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AccountantCtrl.expCertiFile = configService.baseUrl()+'/ImageContainers/Accountants_certi/download/' + response.data.result[0].filename;
          }
        }, function (error) { });
    };
    //upload adhaar
    AccountantCtrl.uploadadhaar = function (x) {
      AccountantCtrl.adhaarFile = document.getElementById('adhaarFile').files[0];
      var fd = new FormData();
      fd.append('file', AccountantCtrl.adhaarFile);
      var uploadUrl = configService.baseUrl()+"/ImageContainers/Accountants_adhaar/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AccountantCtrl.adhaarFile = configService.baseUrl()+'/ImageContainers/Accountants_adhaar/download/' + response.data.result[0].filename;
          }
        }, function (error) { });
    };
    //upload pancard
    AccountantCtrl.uploadPancard = function (x) {
      AccountantCtrl.pancardFile = document.getElementById('pancardFile').files[0];
      var fd = new FormData();
      fd.append('file', AccountantCtrl.pancardFile);
      var uploadUrl = configService.baseUrl()+"/ImageContainers/Accountants_pancard/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AccountantCtrl.pancardFile = configService.baseUrl()+'/ImageContainers/Accountants_pancard/download/' + response.data.result[0].filename;
          }
        }, function (error) { });
    };
    checkEdit();
    function checkEdit() {
      if ($stateParams && $stateParams.id) {
        accountantService.getAccountantDetailsById($stateParams.id).then(function (result) {
          AccountantCtrl.editingaccountantId = $stateParams.id;
          AccountantCtrl.editmode = true;
          AccountantCtrl.selectHide = false;

          if (result) {
            console.log(result.firstName);
            $timeout(function () {
              AccountantCtrl.formFields = result;
              // AccountantCtrl.formFields.password = result.password;
              // AccountantCtrl.file = result.file;
              // AccountantCtrl.ExpcertiFile = result.ExpcertiFile;
              // AccountantCtrl.adhaarFile = result.adhaarFile;
              // AccountantCtrl.pancardFile = result.pancardFile;
            }, 1000)

          }
        }, function (error) {
        });
      }
    }

    // Add Action
    AccountantCtrl.addaccountantAction = function (invalid) {
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      if (invalid) {
        return;
      }
      var data = {
        schoolId: AccountantCtrl.schoolId,
        firstName: AccountantCtrl.formFields.firstName,
        lastName: AccountantCtrl.formFields.lastName,
        // email: AccountantCtrl.formFields.email.toLowerCase(),
        email: AccountantCtrl.formFields.email ? AccountantCtrl.formFields.email:'',
        password:"accountantpass",
        DOB: AccountantCtrl.formFields.DOB,
        type: "Accountant",
        bloodGroup: AccountantCtrl.formFields.bloodGroup,
        DOJ: AccountantCtrl.formFields.DOJ,
        RFID: AccountantCtrl.formFields.RFID,
        motherTounge: AccountantCtrl.formFields.motherTounge,
        currentAddress: AccountantCtrl.formFields.currentAddress,
        gender: AccountantCtrl.formFields.gender,
        currentState: AccountantCtrl.formFields.currentState,
        nationalId: AccountantCtrl.formFields.nationalId,
        alternateContact: AccountantCtrl.formFields.alternateContact,
        currentCity: AccountantCtrl.formFields.currentCity,
        contact: AccountantCtrl.formFields.contact,
        rno: AccountantCtrl.formFields.rno,
        qualifcation: AccountantCtrl.formFields.qualification,
        file: AccountantCtrl.file,
        expCertiFile: AccountantCtrl.expCertiFile,
        adhaarFile:AccountantCtrl.adhaarFile,
        pancardFile:AccountantCtrl.pancardFile,
        designation:AccountantCtrl.formFields.designation,

        };
      if (data) {
        //Check whether editmode or normal mode
        if (!AccountantCtrl.editmode) {
          accountantService.getExistingAccountantRecords(data).then(function (result) {
            if (result) {
              toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
              return;
            }
          }, function (result1) {
            if (result1) {
              accountantService.CreateOrUpdateAccountant(data,AccountantCtrl.managerRoleid).then(function (res) {
                if (res) {
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  $state.go('home.schooldirectory');
                }

              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
              });
            }
          });
        } else {
          data.id = AccountantCtrl.editingAccountantId;
          accountantService.editAccountant(data).then(function (result) {
            if (result) {
              //Show Toast Message Success
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              $state.go('home.schooldirectory');
            }
          }, function (error) {

            toastr.error(error, APP_MESSAGES.SERVER_ERROR);
          });
        }
      }
    };
    AccountantCtrl.ChangeView = function (view) {
      if (view == "enrollstudent") {
        $state.go('home.addstudent');
      } else if (view == "enrollstaff") {
        $state.go('home.addstaff');
      } else if (view == "enrollmultiplestudent") {
        $state.go('home.bulkupload');
      } else if (view == "enrollmultiplestaff") {
        $state.go('home.staffbulkupload');
      } else if (view == "enrollaccountant") {
        $state.go('home.addaccountant');
      }
    }
    //Calendar Fix @@TODO Move this to directive
    // $timeout(function () {
    //   $('#DOB').on('dp.change', function () {
    //     AccountantCtrl.formFields.DOB = $(this).val();
    //   });
    //   $('#JD').on('dp.change', function () {
    //     AccountantCtrl.formFields.DOJ = $(this).val();
    //   });
    // }, 1000);
    //init
    function Init() {

      this.getSchooldetails = function () {
        School.find({
          filter: {
            where: {
              id: AccountantCtrl.schoolId
            }
          }
        }, function (response) {
          AccountantCtrl.SetPrefix = response[0].accountantPrefix[0].SetPrefix;
          AccountantCtrl.SetSequence = response[0].accountantPrefix[0].SetSequence;
        })
      };
      this.autoRegstrationNo = function () {
        if (AccountantCtrl.editmode) {
          return;
        }
        $timeout(function () {
        Accountant.find({
          filter: {
            where: {
              schoolId: AccountantCtrl.schoolId
            }
          }
        }, function (result) {
          if (result) {
            var conv = Number(AccountantCtrl.SetSequence);
  
            if (result.length > 0) {
              var add = conv + result.length;
            } else {
              var add = conv
            }
            AccountantCtrl.formFields={rno : AccountantCtrl.SetPrefix + add};
          }
        })
      }, 500);
      }

    }
    (new Init()).getSchooldetails();
    (new Init()).autoRegstrationNo();
    AccountantCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=firstName]'));
      Metronic.setFlotLabel($('input[name=lastName]'));
      Metronic.setFlotLabel($('input[name=email]'));
      Metronic.setFlotLabel($('input[name=password]'));
      Metronic.setFlotLabel($('input[name=gender]'));
      Metronic.setFlotLabel($('input[name=dateofBirth]'));
      Metronic.setFlotLabel($('input[name=RFID]'));
      Metronic.setFlotLabel($('input[name=dateofJoin]'));
      Metronic.setFlotLabel($('input[name=regId]'));
      Metronic.setFlotLabel($('input[name=isDisable]'));
      Metronic.setFlotLabel($('input[name=currentAddress]'));
      Metronic.setFlotLabel($('input[name=currentCity]'));
      Metronic.setFlotLabel($('input[name=currentState]'));
      Metronic.setFlotLabel($('input[name=currentPincode]'));
      Metronic.setFlotLabel($('input[name=bloodGroup]'));
      Metronic.setFlotLabel($('input[name=religion]'));
      Metronic.setFlotLabel($('input[name=caste]'));
      Metronic.setFlotLabel($('input[name=alternateContact]'));
      Metronic.setFlotLabel($('input[name=permanentAddress]'));
      Metronic.setFlotLabel($('input[name=permanentCity]'));
      Metronic.setFlotLabel($('input[name=permanentState]'));
      Metronic.setFlotLabel($('input[name=permanentPincode]'));
      Metronic.setFlotLabel($('input[name=nationalId]'));
      Metronic.setFlotLabel($('input[name=motherTounge]'));
      Metronic.setFlotLabel($('input[name=nationalIdType]'));
      Metronic.setFlotLabel($('input[name=subCaste]'));
      Metronic.setFlotLabel($('input[name=contact]'));
      Metronic.setFlotLabel($('input[name=qualification]'));
      Metronic.setFlotLabel($('input[name=percentage]'));
      Metronic.setFlotLabel($('input[name=qualifiedUniversity]'));
      Metronic.setFlotLabel($('input[name=BED]'));
      Metronic.setFlotLabel($('input[name=Designation]'));


    };

    $timeout(function () {
      $('#DOB').on('dp.change', function () {
        // AddStudentCtrl.formFields.DOB = $(this).val();
        var getDOB = document.getElementById('DOB').value;
        var getJD = document.getElementById('JD').value;
        var parts = getJD.split('-');
        var JD = parts[0] + "-" + parts[1] + "-" + parts[2];
        var JD1 = parts[2] + "-" + parts[1] + "-" + parts[0];
      });
      $('#JD').on('dp.change', function () {
        var getDOB = document.getElementById('DOB').value;
        var getJD = document.getElementById('JD').value;
        // if (getDOB == "") {
        //   alert("Please Select DOB Before Selecting The Join Date");
        //   document.getElementById('JD').value = "";
        //   return;
        // }
        if (getJD == "") {
          return;
        }
        var parts = getDOB.split('-');
        var addYear = parseInt(parts[2]);
        var ssa = addYear + "-" + parts[1] + "-" + parts[0];
        var ss = $filter('date')(new Date(ssa), "MMMM dd, yyyy");
        var Dob = Date.parse(ss);

        var part = getJD.split('-');
        var Jda = part[2] + "-" + part[1] + "-" + part[0];
        var sos = $filter('date')(new Date(Jda), "MMMM dd, yyyy");
        var Jd = Date.parse(sos);
        if (Jd < Dob) {
          alert("DOJ Should Be  Greater Than DOB");
          document.getElementById('JD').value = "";
        }
      });
    }, 1000);
    // check contact
    AccountantCtrl.checkContact = function (cnt) {
      var allow =true;
      var arrr = [];

      var abcd = cnt.split('');
      for (var i = 0; i < abcd.length; i++) {
        arrr.push(Number(Number(abcd[i])));
      }

      var abc = Number(arrr[0]);
      // var abc1 = Number(cnt);
      if(arrr.length>9){
        var dataa=[];
        arrr.map(function(item){
          if(abcd[0]==item){
            dataa.push(item);
          }
          if(dataa.length>9){
            allow = false;
              alert("please enter valid phone number ");
              AccountantCtrl.formFields.contact = null;
              AccountantCtrl.formFields.alternateContact = null;
          }
        })
    }
      if(abc<2){
        if(allow){
        alert("please enter valid phone number");}
        AccountantCtrl.formFields.contact = null;
        AccountantCtrl.formFields.alternateContact = null;
        AccountantCtrl.formFields.contact = "";
      }
    }
    // End check contact

    function formValidations() {

      var getDOB = document.getElementById('DOB').value;
      var getJD = document.getElementById('JD').value;
      if (getJD == undefined || getJD == null || getJD == "")
        return 'Please select Joining Date ';
      var parts = getDOB.split('-');
      // var addYear = parseInt(parts[2]) + 2;
      var ssa = parts[2] + "-" + parts[1] + "-" + parts[0];
      var ss = $filter('date')(new Date(ssa), "MMMM dd, yyyy");

      // var Dob = Date.parse(ss);
      var Dob = Date.parse(ss) + 86400000;
      var Dob1 = Date.parse(ss);


      var part = getJD.split('-');
      var Jda = part[2] + "-" + part[1] + "-" + part[0];
      var sos = $filter('date')(new Date(Jda), "MMMM dd, yyyy");
      var Jd = Date.parse(sos);


      if (Jd == Dob1)
        return 'DOB and DOJ Cannot be same';
        if (Jd < Dob)
        return 'DOJ Cannot be less than DOB ';
    }
    //autogenegration
    

  });