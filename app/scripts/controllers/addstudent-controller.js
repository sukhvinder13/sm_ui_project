'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AddstudentControllerCtrl
 * @description
 * # AddstudentControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AddstudentController', function (addStudentService, AcademicBatch, configService, School, $filter, $cookies, toastr, APP_MESSAGES, $timeout, $stateParams, $http, $state, Student) {
    var AddStudentCtrl = this;
    //Default details by School ID
    AddStudentCtrl.schoolId = $cookies.getObject('uds').schoolId;
    AddStudentCtrl.role = $cookies.get('role');
    AddStudentCtrl.editmode = false;
    AddStudentCtrl.selectHide = false;
    // AddStudentCtrl.formFields={"password": "Student"};
    // AddStudentCtrl.formFields.password = {"password": "Student"};
    AddStudentCtrl.formFields = {
      regId: " "
    };

    $http({
      "url": configService.baseUrl() + '/ManageRoles?filter={"where":{"schoolId":"' + AddStudentCtrl.schoolId + '","type":"Student"}}',
      "method": "GET",
      "headers": { "Content-Type": "application/json" }
    }).then(function (response) {
      AddStudentCtrl.managerRoleid = response.data[0].id;
      // identityCtrl.roledata=response.data;
    });

    //get sschool name and generate respective data in required format.
    AddStudentCtrl.getSchoolName = function () {
      $http.get(configService.baseUrl() + '/Schools/' + $cookies.getObject('uds').schoolId)
        .then(function (response) {
          AddStudentCtrl.schoolCode = response.data.schoolCode;
          // AddStudentCtrl.schoolName = response.data.schoolName;
        }, function (error) { });
    };
    AddStudentCtrl.getSchoolName();

    AddStudentCtrl.uploadStudentImage = function (x) {
      AddStudentCtrl.file = document.getElementById('studentFile').files[0];
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', AddStudentCtrl.file);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/Students/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStudentCtrl.file = configService.baseUrl() + '/ImageContainers/Students/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    AddStudentCtrl.uploadSchoolTc = function (x) {
      AddStudentCtrl.tcFile = document.getElementById('tcFile').files[0];
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', AddStudentCtrl.tcFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/StudentTC/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStudentCtrl.tcFile = configService.baseUrl() + '/ImageContainers/StudentTC/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    //adhaar upload
    AddStudentCtrl.adhaar = function (x) {
      AddStudentCtrl.adhaarFile = document.getElementById('adhaarFile').files[0];
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', AddStudentCtrl.adhaarFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/StudentAdhaar/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStudentCtrl.adhaarFile = configService.baseUrl() + '/ImageContainers/StudentAdhaar/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    //caste Certi
    AddStudentCtrl.uploadCasteCerti = function (x) {
      AddStudentCtrl.castecertiFile = document.getElementById('castecertiFile').files[0];
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', AddStudentCtrl.castecertiFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/StudentCasteCerti/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStudentCtrl.castecertiFile = configService.baseUrl() + '/ImageContainers/StudentCasteCerti/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    //DOB cer
    AddStudentCtrl.uploadDOBCerti = function (x) {
      AddStudentCtrl.dobFile = document.getElementById('dobFile').files[0];
      // var date =new Date.now();
      var fd = new FormData();
      fd.append('file', AddStudentCtrl.dobFile);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/StudentDOBCerti/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
        .then(function (response) {
          if (response) {
            AddStudentCtrl.dobFile = configService.baseUrl() + '/ImageContainers/StudentDOBCerti/download/' + response.data.result[0].filename;
          }
        }, function (error) {
          console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };

    checkEdit();

    function checkEdit() {
      if ($stateParams && $stateParams.id) {
        AddStudentCtrl.editingStudentId = $stateParams.id;
        AddStudentCtrl.editmode = true;
        AddStudentCtrl.selectHide = true;

        addStudentService.getStudentDetailsById($stateParams.id).then(function (result) {
          console.log(result)
          if (result) {
            AddStudentCtrl.formFields = result;
            AddStudentCtrl.formFields.registrationNumber = result.registrationNo;
            AddStudentCtrl.file = result.file;
            AddStudentCtrl.myUpload1 = result.file;
            AddStudentCtrl.tcFile = result.tcFile;
            AddStudentCtrl.adhaarFile = result.adhaarFile;
            AddStudentCtrl.castecertiFile = result.castecertiFile;
            AddStudentCtrl.dobFile = result.dobFile;
            // AddStudentCtrl.formFields.password = result.password;
            $timeout(function () {
              AddStudentCtrl.setFloatLabel();
            }, 100);
          }
        }, function (error) {
          console.log('Error while fetching the records' + error);
        });
      } else {
        $timeout(function () {
          AddStudentCtrl.formFields.firstName = $stateParams.studentId;
          AddStudentCtrl.formFields.classId = $stateParams.classId;
          AddStudentCtrl.formFields.fatherName = $stateParams.fathername;
          AddStudentCtrl.formFields.contact = $stateParams.cnumber;
          AddStudentCtrl.formFields.currentAddress = $stateParams.address;
          AddStudentCtrl.formFields.email = $stateParams.email;
          AddStudentCtrl.formFields.DOJ =$filter('date')($stateParams.JoiningDate, "dd-MM-yyyy");
          console.log($stateParams.JoiningDate);
          AddStudentCtrl.formFields.DOB = $filter('date')($stateParams.DateOfBirth, "dd-MM-yyyy");
          console.log($stateParams.DateOfBirth);
          AddStudentCtrl.formFields.gender = $stateParams.Gender;
          console.log($stateParams.Gender);
      
          $timeout(function () {
            AddStudentCtrl.setFloatLabel();
          }, 100);

        }, 1000);
      }
    }
    AddStudentCtrl.ChangeView = function (view) {
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
  
    function Init() {
      this.getClassDetails = function () {
        addStudentService.getClassDetailsBySchoolId(AddStudentCtrl.schoolId).then(function (result) {
          if (result) {
            AddStudentCtrl.classList = result;
          }
        }, function (error) {
          console.log('Error while fetching the assignment records. Error stack : ' + error);
        });
      };
      this.getSchooldetails = function () {
        School.find({
          filter: {
            where: {
              id: AddStudentCtrl.schoolId
            }
          }
        }, function (response) {
          AddStudentCtrl.SetPrefix = response[0].studentPrefix[0].SetPrefix;
          AddStudentCtrl.SetSequence = Number(response[0].studentPrefix[0].SetSequence) + response[0].studentPrefix[0].counter;
          var conv = Number(AddStudentCtrl.SetSequence);
          if ($stateParams && $stateParams.id) { } else {
            AddStudentCtrl.formFields.registrationNumber = AddStudentCtrl.SetPrefix + conv;
          }
        })
      };
      this.getAcademicData = function () {
        AcademicBatch.find({
          filter: {
            where: {
              schoolId: AddStudentCtrl.schoolId,
              status: "Active"
            }
          }
        }, function (response) {
          AddStudentCtrl.showtable = response;
        }, function (error) { });
      };
    }
    (new Init()).getClassDetails();
    (new Init()).getSchooldetails();
    (new Init()).getAcademicData();
    // Add Action
    AddStudentCtrl.addstudentAction = function (invalid) {
      // if (AddStudentCtrl.formFields.RFID == "NA" || AddStudentCtrl.formFields.RFID == undefined || AddStudentCtrl.formFields.RFID == '') {
      //   var RFID = "";
      // } else {
      //   RFID = AddStudentCtrl.formFields.RFID;
      // }
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      if (invalid) {
        return;
      }
      // return;
      AddStudentCtrl.formFields.DOB = document.getElementById('DOB').value;
      AddStudentCtrl.formFields.DOJ = document.getElementById('JD').value;
      var data = {
        schoolId: AddStudentCtrl.schoolId,
        firstName: AddStudentCtrl.formFields.firstName,
        lastName: AddStudentCtrl.formFields.lastName,
        // email: AddStudentCtrl.formFields.email.toLowerCase(),
        email: AddStudentCtrl.formFields.email ? AddStudentCtrl.formFields.email : '',
        password: "Student",
        gender: AddStudentCtrl.formFields.gender,
        DOB: AddStudentCtrl.formFields.DOB,
        rollNo: AddStudentCtrl.formFields.rollNo,
        RFID: AddStudentCtrl.formFields.RFID,
        previousSchool: AddStudentCtrl.formFields.previousSchool,
        DOJ: AddStudentCtrl.formFields.DOJ,
        classId: AddStudentCtrl.formFields.classId,
        regId: AddStudentCtrl.formFields.regId,
        isDisable: AddStudentCtrl.formFields.isDisable,
        currentAddress: AddStudentCtrl.formFields.currentAddress,
        currentCity: AddStudentCtrl.formFields.currentCity,
        currentState: AddStudentCtrl.formFields.currentState,
        currentPincode: AddStudentCtrl.formFields.currentPincode,
        bloodGroup: AddStudentCtrl.formFields.bloodGroup,
        religion: AddStudentCtrl.formFields.religion,
        caste: AddStudentCtrl.formFields.caste,
        alternateContact: AddStudentCtrl.formFields.alternateContact,
        permanentAddress: AddStudentCtrl.formFields.permanentAddress,
        permanentCity: AddStudentCtrl.formFields.permanentCity,
        permanentState: AddStudentCtrl.formFields.permanentState,
        permanentPincode: AddStudentCtrl.formFields.permanentPincode,
        nationalId: AddStudentCtrl.formFields.nationalId,
        motherTounge: AddStudentCtrl.formFields.motherTounge,
        nationalIdType: AddStudentCtrl.formFields.nationalIdType,
        subCaste: AddStudentCtrl.formFields.subCaste,
        contact: AddStudentCtrl.formFields.contact,
        fatherName: AddStudentCtrl.formFields.fatherName,
        motherName: AddStudentCtrl.formFields.motherName,
        fatherContact: AddStudentCtrl.formFields.fatherContact,
        // motherContact: AddStudentCtrl.formFields.alternateContact,
        identificationMarks: AddStudentCtrl.formFields.identificationMarks,
        classofAdmission: AddStudentCtrl.formFields.classofAdmission,
        registrationNo: AddStudentCtrl.formFields.registrationNumber,
        file: AddStudentCtrl.file,
        tcFile: AddStudentCtrl.tcFile,
        adhaarFile: AddStudentCtrl.adhaarFile,
        castecertiFile: AddStudentCtrl.castecertiFile,
        dobFile: AddStudentCtrl.dobFile,
        fatherEmail: AddStudentCtrl.formFields.fatherEmail,
        motherEmail: AddStudentCtrl.formFields.motherEmail,
        academicbatch: AddStudentCtrl.formFields.academicbatch,


        // DOB:AddStudentCtrl.formFields.fromDate
      };
console.log(data);
      if (data) {
        //Check whether editmode or normal mode
        if (!AddStudentCtrl.editmode) {
          addStudentService.updateCount(AddStudentCtrl.schoolId).then(function (result) {
            if (result) { }
          });
          addStudentService.CreateOrUpdateStudent(data).then(function (res) {
            if (res) {
              if (res.RFID == "NA" || AddStudentCtrl.formFields.RFID == undefined || res.RFID == undefined || res.RFID == '' || res.RFID == 'null') {
                var RFID = res.id + "1";
                Student.prototype$patchAttributes({ id: res.id, manageRoleId: AddStudentCtrl.managerRoleid, RFID: RFID }, function (ress) {
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  $state.go('home.schooldirectory');
                })
              } else {
                var RFID = res.RFID;
                Student.prototype$patchAttributes({ id: res.id, manageRoleId: AddStudentCtrl.managerRoleid, RFID: RFID }, function (ress) {
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  $state.go('home.schooldirectory');
                })
              }
            }

          }, function (error) {
            console.log(error);
            // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            // console.log('Error while Fetching the Records' + JSON.stringify(error));
          });
        } else {
          data.id = AddStudentCtrl.editingStudentId;
          addStudentService.editStudent(data).then(function (result) {
            if (result) {
              //Show Toast Message Success
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              $state.go('home.schooldirectory');
            }
          }, function (error) {
            console.log(error);
            // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            console.log('Error while creating or updating records. Error stack' + error);
          });
        }
      }
    };
    //Calendar Fix @@TODO Move this to directive
    // $timeout(function () {
    //   $('#DOB').on('dp.change', function () {
    //     AddStudentCtrl.formFields.DOB = $(this).val();
    //   });
    //   $('#JD').on('dp.change', function () {
    //     AddStudentCtrl.formFields.DOJ = $(this).val();
    //   });
    // }, 1000);
    //Calendar Fix @@TODO Move this to directive
    // $timeout(function () {
    //     $('#assignmentdate1').on('dp.change', function () {
    //         AddStudentCtrl.formFields.fromDate = $(this).val();
    //     });
    // }, 500);
    // //Calendar Fix @@TODO Move this to directive
    // $timeout(function () {
    //     $('#assignmentdate2').on('dp.change', function () {
    //         AddStudentCtrl.formFields.toDate = $(this).val();
    //     });
    // }, 500);
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

    //validation
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

    //Setting up float label
    AddStudentCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=firstName]'));
      Metronic.setFlotLabel($('input[name=lastName]'));
      Metronic.setFlotLabel($('input[name=email]'));
      Metronic.setFlotLabel($('input[name=password]'));
      Metronic.setFlotLabel($('input[name=gender]'));
      Metronic.setFlotLabel($('input[name=DOB]'));
      Metronic.setFlotLabel($('input[name=RFID]'));
      Metronic.setFlotLabel($('input[name=DOJ]'));
      Metronic.setFlotLabel($('input[name=regId]'));
      Metronic.setFlotLabel($('input[name=rollNo]'));
      Metronic.setFlotLabel($('input[name=classId]'));
      Metronic.setFlotLabel($('input[name=isDisable]'));
      Metronic.setFlotLabel($('input[name=currentAddress]'));
      Metronic.setFlotLabel($('input[name=currentCity]'));
      Metronic.setFlotLabel($('input[name=currentState]'));
      Metronic.setFlotLabel($('input[name=currentPincode]'));
      Metronic.setFlotLabel($('input[name=bloodGroup]'));
      Metronic.setFlotLabel($('input[name=religion]'));
      Metronic.setFlotLabel($('input[name=caste]'));
      Metronic.setFlotLabel($('input[name=previousSchool]'));
      Metronic.setFlotLabel($('input[name=alternateContact]'));
      Metronic.setFlotLabel($('input[name=permanentAddress]'));
      Metronic.setFlotLabel($('input[name=permanentCity]'));
      Metronic.setFlotLabel($('input[name=permanentState]'));
      Metronic.setFlotLabel($('input[name=permanentPincode]'));
      Metronic.setFlotLabel($('input[name=nationalId]'));
      Metronic.setFlotLabel($('input[name=motherTounge]'));
      Metronic.setFlotLabel($('input[name=nationalIdType]'));
      Metronic.setFlotLabel($('input[name=subCaste]'));
      Metronic.setFlotLabel($('input[name=studentContact]'));
      Metronic.setFlotLabel($('input[name=fatherName]'));
      Metronic.setFlotLabel($('input[name=motherName]'));
      Metronic.setFlotLabel($('input[name=fcontact]'));
      Metronic.setFlotLabel($('input[name=fatherEmail]'));
      Metronic.setFlotLabel($('input[name=motherEmail]'));
      Metronic.setFlotLabel($('input[name=academicbatch]'));
      Metronic.setFlotLabel($('input[name=identificationMarks]'));
    };


    //checking data of email and roll no
    // AddStudentCtrl.checkMail = function (sEmail) {
    //   Student.findOne({
    //     filter: {
    //       where: {
    //         email: sEmail
    //       }
    //     }
    //   }, function (response) {
    //     if (response) {
    //       toastr.error("Email already exists");
    //       AddStudentCtrl.formFields.email = '';
    //     }
    //   });
    // };
    AddStudentCtrl.rollNo = function (classId, roll) {
      if (classId == undefined) {
        return;
      }
      if (roll == undefined) {
        return;
      }
      Student.find({
        filter: {
          where: {
            schoolId: AddStudentCtrl.schoolId,
            classId: classId,
            rollNo: roll
          }
        }
      }, function (response) {
        if (response.length > 0) {
          toastr.error("RollNo already exists", APP_MESSAGES.DATA_EXISTS);
          AddStudentCtrl.formFields.rollNo = '';
        }
      });
    };

    // AddStudentCtrl.formFields.registrationNumber

    // check contact
    AddStudentCtrl.checkContact = function (cnt) {
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
            AddStudentCtrl.formFields.contact = null;
            AddStudentCtrl.formFields.alternateContact = null;
            AddStudentCtrl.formFields.fatherContact = null;
          }
        })
      }
      if (abc < 2) {
        if (allow) {
          alert("please enter valid phone number");
        }
        AddStudentCtrl.formFields.contact = null;
        AddStudentCtrl.formFields.alternateContact = null;
        AddStudentCtrl.formFields.fatherContact = null;
        AddStudentCtrl.formFields.contact = "";
        AddStudentCtrl.formFields.fatherContact = "";
      }
    }
    // End check contact
  });