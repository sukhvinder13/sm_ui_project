'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AddstaffControllerCtrl
 * @description
 * # AddstaffControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AddstaffController', function (addStaffService, School, $cookies, $filter, configService, toastr, APP_MESSAGES, Staff, $timeout, $stateParams, $http, $state) {
    var AddStaffCtrl = this;
    //Default details by School ID
    AddStaffCtrl.schoolId = $cookies.getObject('uds').schoolId;
    AddStaffCtrl.editmode = false;
    AddStaffCtrl.selectHide = false;
    AddStaffCtrl.formFields = {
      regId: " "
    };

    AddStaffCtrl.uploadImage = function (x) {
      AddStaffCtrl.file = document.getElementById('myFile').files[0];
      var fd = new FormData();
      fd.append('file', AddStaffCtrl.file);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/Staffs/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStaffCtrl.file = configService.baseUrl() + '/ImageContainers/Staffs/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          // console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    $http({
      "url": configService.baseUrl() + '/ManageRoles?filter={"where":{"schoolId":"' + AddStaffCtrl.schoolId + '","type":"Staff"}}',
      "method": "GET",
      "headers": { "Content-Type": "application/json" }
    }).then(function (response) {
      // console.log(response);
      AddStaffCtrl.managerRoleid = response.data[0].id;
      // console.log(AddStaffCtrl.managerRoleid);
      // identityCtrl.roledata=response.data;
    });
    //Upload exprience certificate
    AddStaffCtrl.uploadExpCerti = function (x) {
      AddStaffCtrl.ExpcertiFile = document.getElementById('ExpcertiFile').files[0];
      var fd = new FormData();
      fd.append('file', AddStaffCtrl.ExpcertiFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/StaffExpCerti/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStaffCtrl.ExpcertiFile = configService.baseUrl() + '/ImageContainers/StaffExpCerti/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          //   console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    //upload adhaar
    AddStaffCtrl.uploadAdhaar = function (x) {
      AddStaffCtrl.adhaarFile = document.getElementById('adhaarFile').files[0];
      var fd = new FormData();
      fd.append('file', AddStaffCtrl.adhaarFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/Staffadhaar/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStaffCtrl.adhaarFile = configService.baseUrl() + '/ImageContainers/Staffadhaar/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          // console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    //upload pancard
    AddStaffCtrl.uploadPancard = function (x) {
      AddStaffCtrl.pancardFile = document.getElementById('pancardFile').files[0];
      var fd = new FormData();
      fd.append('file', AddStaffCtrl.pancardFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/Staffpancard/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStaffCtrl.pancardFile = configService.baseUrl() + '/ImageContainers/Staffpancard/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          // console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };

    function Init() {
      this.getClassDetails = function () {
        addStaffService.getClassDetailsBySchoolId(AddStaffCtrl.schoolId).then(function (result) {
          if (result) {
            AddStaffCtrl.classList = result;
          }
        }, function (error) {
          //console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
      };
      this.getSchooldetails = function () {
        School.find({
          filter: {
            where: {
              id: AddStaffCtrl.schoolId
            }
          }
        }, function (response) {
          AddStaffCtrl.SetPrefix = response[0].staffPrefix[0].SetPrefix;
          AddStaffCtrl.SetSequence = Number(response[0].staffPrefix[0].SetSequence) + response[0].staffPrefix[0].counter;
          if ($stateParams && $stateParams.id) { } else {
            AddStaffCtrl.formFields.regId = AddStaffCtrl.SetPrefix + AddStaffCtrl.SetSequence;
          }
        })
      };
      // this.autoRegstrationNo = function () {
      //   if (AddStaffCtrl.editmode) {
      //     return;
      //   }
      //   $timeout(function () {

      //     Staff.find({
      //       filter: {
      //         where: {
      //           schoolId: AddStaffCtrl.schoolId
      //         }
      //       }
      //     }, function (result) {
      //       if (result) {
      //         var conv = Number(AddStaffCtrl.SetSequence);

      //         if (result.length > 0) {
      //           var add = conv + result.length;
      //         } else {
      //           var add = conv;
      //         }

      //         if ($stateParams && $stateParams.id) {} else {
      //           AddStaffCtrl.formFields.regId = AddStaffCtrl.SetPrefix + add;

      //         }
      //       }
      //     })
      //   }, 500);

      // }

    }
    (new Init()).getClassDetails();
    (new Init()).getSchooldetails();
    // (new Init()).autoRegstrationNo();

    // Edit Function
    checkEdit();

    function checkEdit() {
      if ($stateParams && $stateParams.id) {
        addStaffService.getStaffDetailsById($stateParams.id).then(function (result) {
          AddStaffCtrl.editingStaffId = $stateParams.id;
          AddStaffCtrl.editmode = true;
          AddStaffCtrl.selectHide = true;

          if (result) {
            AddStaffCtrl.formFields = result;
            if (result.BED == true) {
              AddStaffCtrl.formFields.BED = "Yes";
            } else if (result.BED == false) { AddStaffCtrl.formFields.BED = "No"; }
            // AddStaffCtrl.formFields.BED = result.BED;
            AddStaffCtrl.formFields.password = result.password;
            AddStaffCtrl.file = result.file;
            AddStaffCtrl.ExpcertiFile = result.ExpcertiFile;
            AddStaffCtrl.adhaarFile = result.adhaarFile;
            AddStaffCtrl.pancardFile = result.pancardFile;
            // AddStaffCtrl.formFields.dateofBirth = new Date(result.dateofBirth);
            // AddStaffCtrl.formFields.dateofJoin = new Date(result.dateofJoin);
            $timeout(function () {

              AddStaffCtrl.setFloatLabel();
            }, 100);
          }
        }, function (error) {
          // console.log('Error while fetching the records' + error);
        });
      }
    }
    // Add Action
    AddStaffCtrl.addstaffAction = function (invalid) {
      // if (AddStaffCtrl.formFields.RFID == "NA" || AddStaffCtrl.formFields.RFID == undefined || AddStaffCtrl.formFields.RFID == '') {
      //   var RFID = "";
      // } else {
      //   RFID = AddStaffCtrl.formFields.RFID;
      // }
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      if (invalid) {
        return;
      }
      AddStaffCtrl.formFields.dateofBirth = document.getElementById('DOB').value;
      AddStaffCtrl.formFields.dateofJoin = document.getElementById('JD').value;
      var data = {
        schoolId: AddStaffCtrl.schoolId,
        firstName: AddStaffCtrl.formFields.firstName,
        lastName: AddStaffCtrl.formFields.lastName,
        // email: AddStaffCtrl.formFields.email.toLowerCase(),
        email: AddStaffCtrl.formFields.email ? AddStaffCtrl.formFields.email : '',
        password: "Staffpass",
        gender: AddStaffCtrl.formFields.gender,
        dateofBirth: AddStaffCtrl.formFields.dateofBirth,
        RFID: AddStaffCtrl.formFields.RFID,
        dateofJoin: AddStaffCtrl.formFields.dateofJoin,
        regId: AddStaffCtrl.formFields.regId,
        isDisable: AddStaffCtrl.formFields.isDisable,
        currentAddress: AddStaffCtrl.formFields.currentAddress,
        currentCity: AddStaffCtrl.formFields.currentCity,
        currentState: AddStaffCtrl.formFields.currentState,
        currentPincode: AddStaffCtrl.formFields.currentPincode,
        bloodGroup: AddStaffCtrl.formFields.bloodGroup,
        religion: AddStaffCtrl.formFields.religion,
        caste: AddStaffCtrl.formFields.caste,
        alternateContact: AddStaffCtrl.formFields.alternateContact,
        permanentAddress: AddStaffCtrl.formFields.permanentAddress,
        permanentCity: AddStaffCtrl.formFields.permanentCity,
        permanentState: AddStaffCtrl.formFields.permanentState,
        permanentPincode: AddStaffCtrl.formFields.permanentPincode,
        nationalId: AddStaffCtrl.formFields.nationalId,
        motherTounge: AddStaffCtrl.formFields.motherTounge,
        nationalIdType: AddStaffCtrl.formFields.nationalIdType,
        subCaste: AddStaffCtrl.formFields.subCaste,
        contact: AddStaffCtrl.formFields.contact,
        qualification: AddStaffCtrl.formFields.qualification,
        percentage: AddStaffCtrl.formFields.percentage,
        qualifiedUniversity: AddStaffCtrl.formFields.qualifiedUniversity,
        BED: AddStaffCtrl.formFields.BED,
        file: AddStaffCtrl.file,
        ExpcertiFile: AddStaffCtrl.ExpcertiFile,
        adhaarFile: AddStaffCtrl.adhaarFile,
        pancardFile: AddStaffCtrl.pancardFile,
        designation: AddStaffCtrl.formFields.designation

      };
      if (data) {
        //Check whether editmode or normal mode
        if (!AddStaffCtrl.editmode) {
          // addStaffService.getExistingStaffRecords(data).then(function (result) {
          //   if (result) {
          //     toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
          //     //console.log('data already exists');
          //     return;
          //   }
          // }, function (result1) {
          //   if (result1) {
          // addStaffService.getClassDetailsById(AddStaffCtrl.schoolId).then(function (dataresponse) {

          //             data.roleid = dataresponse[0].id;
          //             if (dataresponse) {
          addStaffService.CreateOrUpdateStaff(data).then(function (res) {
            if (res) {
              console.log(res.RFID);
              if (res.RFID == "NA" || AddStaffCtrl.formFields.RFID == undefined || res.RFID == undefined || res.RFID == '' || res.RFID == 'null') {
                //Show Toast Message Success
                Staff.prototype$patchAttributes({ id: res.id, manageRoleId: AddStaffCtrl.managerRoleid, RFID: res.id + "2" }, function (ress) {
                  console.log(ress);
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  // toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  School.find({ filter: { where: { id: AddStaffCtrl.schoolId } } }, function (respons) {
                    respons[0].staffPrefix[0].counter + 1;
                    var countter1 = respons[0].staffPrefix[0].counter + 1;
                    respons[0].staffPrefix[0].counter = countter1;
                    var dataCount = respons[0].staffPrefix;
                    School.prototype$patchAttributes({ id: AddStaffCtrl.schoolId, staffPrefix: dataCount }, function (response) {
                      if (response) {
                        $timeout(function () {
                          $state.go('home.schooldirectory');
                        }, 2000)
                      }
                    })

                  })

                })
              } else {
                var RFID = res.RFID;
                Staff.prototype$patchAttributes({ id: res.id, manageRoleId: AddStaffCtrl.managerRoleid, RFID: RFID }, function (ress) {
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  // toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  School.find({ filter: { where: { id: AddStaffCtrl.schoolId } } }, function (respons) {
                    respons[0].staffPrefix[0].counter + 1;
                    var countter1 = respons[0].staffPrefix[0].counter + 1;
                    respons[0].staffPrefix[0].counter = countter1;
                    var dataCount = respons[0].staffPrefix;
                    School.prototype$patchAttributes({ id: AddStaffCtrl.schoolId, staffPrefix: dataCount }, function (response) {
                      if (response) {
                        $timeout(function () {
                          $state.go('home.schooldirectory');
                        }, 2000)
                      }
                    })

                  })

                })
              }

            }
          }, function (error) {
            console.log(error);
            // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            //console.log('Error while Fetching the Records' + error);
          });
          //   }
          // });
          //   }
          // });
        } else {
          data.id = AddStaffCtrl.editingStaffId;
          addStaffService.editStaff(data).then(function (result) {
            if (result) {
              //Show Toast Message Success
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              $state.go('home.schooldirectory');
            }
          }, function (error) {
            console.log(error);
            // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            //console.log('Error while creating or updating records. Error stack' + error);
          });
        }
      }
    };
    // Dropdown function
    AddStaffCtrl.ChangeView = function (view) {
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
    //     AddStaffCtrl.formFields.dateofBirth = $(this).val();
    //   });
    //   $('#JD').on('dp.change', function () {
    //     AddStaffCtrl.formFields.dateofJoin = $(this).val();
    //   });
    // }, 1000);
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
        var addYear = parseInt(parts[2]) + 2;
        var ssa = parts[2] + "-" + parts[1] + "-" + parts[0];
        var ss = $filter('date')(new Date(ssa), "MMMM dd, yyyy");

        // var Dob = Date.parse(ss);
        var Dob = Date.parse(ss) + 86400000;

        var part = getJD.split('-');
        var Jda = part[2] + "-" + part[1] + "-" + part[0];
        var sos = $filter('date')(new Date(Jda), "MMMM dd, yyyy");
        var Jd = Date.parse(sos);
        if (Jd < Dob) {
          alert("DOJ Should Be Greater Than DOB");
          document.getElementById('JD').value = "";
        }
      });
    }, 1000);

    //Setting up float label
    AddStaffCtrl.setFloatLabel = function () {
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

    // AddStaffCtrl.checkMail = function (sEmail) {
    //   Staff.findOne({
    //     filter: {
    //       where: {
    //         email: sEmail
    //       }
    //     }
    //   }, function (response) {
    //     if (response) {
    //       toastr.error("Email already exists");
    //     }
    //   });
    // };

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
    //auto generation
    AddStaffCtrl.autoRegstrationNo = function () {
      if (AddStaffCtrl.editmode) {
        return;
      }
      Staff.find({
        filter: {
          where: {
            schoolId: AddStaffCtrl.schoolId
          }
        }
      }, function (result) {
        if (result) {
          var conv = Number(AddStaffCtrl.SetSequence);

          if (result.length > 0) {
            var add = conv + result.length;
          } else {
            var add = conv
          }
          AddStaffCtrl.formFields.regId = AddStaffCtrl.SetPrefix + add;
        }
      })
    }
    // check contact
    AddStaffCtrl.checkContact = function (cnt) {
      var allow = true;
      var arrr = [];
      var abcd = cnt.split('');
      for (var i = 0; i < abcd.length; i++) {
        arrr.push(Number(Number(abcd[i])));
      }
      var abc = Number(arrr[0]);
      if (arrr.length > 9) {
        var dataa = [];
        arrr.map(function (item) {
          if (abcd[0] == item) {
            dataa.push(item);
          }
          if (dataa.length > 9) {
            allow = false;
            alert("please enter valid phone number ");
            AddStaffCtrl.formFields.contact = null;
            AddStaffCtrl.formFields.alternateContact = null;
          }
        })
      }
      if (abc < 2) {
        if (allow) {
          alert("please enter valid phone number");
        }
        AddStaffCtrl.formFields.contact = null;
        AddStaffCtrl.formFields.alternateContact = null;
        AddStaffCtrl.formFields.contact = "";
      }
    }
    // End check contact

  });
