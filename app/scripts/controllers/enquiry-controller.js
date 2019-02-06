'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:EnquiryControllerJsCtrl
 * @description
 * # EnquiryControllerJsCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('EnquiryController', function (configService, enquiryService, $http, $cookies, $q, $timeout, generateexcelFactory, $scope, toastr, APP_MESSAGES, Enquiry, School, $filter) {

    var EnquiryCtrl = this;
    EnquiryCtrl.schoolId = $cookies.getObject('uds').schoolId;
    EnquiryCtrl.loginId = $cookies.getObject('uds').id;
    EnquiryCtrl.role = $cookies.get('role');

    EnquiryCtrl.editmode = false;
    EnquiryCtrl.detailsMode = false;
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Enquiry Form") {

        EnquiryCtrl.roleView = roleAccess[0].RolesData[i].view;
        EnquiryCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        EnquiryCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }


    }

    function Init() {
      //Get list of fees details by school ID
      this.getEnquiryDetails = function () {
        enquiryService.getEnquiryDetailsBySchoolId(EnquiryCtrl.schoolId, EnquiryCtrl.role, EnquiryCtrl.loginId).then(function (response) {
          if (response) {
            EnquiryCtrl.enquiryList = response;
          }
        }, function (error) {

        });
      };
      this.getClassDetails = function () {
        enquiryService.getClassDetailBySchoolID(EnquiryCtrl.schoolId).then(function (result) {
          if (result) {
            EnquiryCtrl.chooseClass = result;
          }
        })
      }
    };

    (new Init()).getEnquiryDetails();
    (new Init()).getClassDetails();
    EnquiryCtrl.notify = function (enqData) {
      var enq = enqData.enquiryType + '\n' + 'Enquiry';
      School.find({ filter: { where: { id: EnquiryCtrl.schoolId } } }, function (resp) {
        var aa = 'Thank you for your enquiry' + '\n' + enqData.enquiryType + '\n' + 'we will get in touch with you shortly' + '<br>' + 'Thank you' + '<br>' + resp[0].schoolName;
        $http({
          "url": configService.baseUrl() + '/Enquiries/emailNotification',
          "method": "POST",
          "headers": { "Content-Type": "application/json" },
          "data": {
            "to": enqData.email,
            "subject": enq,
            "html": aa,
          }
        }).then(function (response) {
        });
      });
    }
    // Add Action
    $scope.first = true;
    EnquiryCtrl.enquiryAction = function (invalid) {
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      $scope.first = !$scope.first;

      if (EnquiryCtrl.followUpDate == null) {
        EnquiryCtrl.followUpDate = "";
      };
      if (invalid) {
        return;
      }
      var data = {
        schoolId: EnquiryCtrl.schoolId,
        enquiryType: EnquiryCtrl.enquiryType,
        reference: EnquiryCtrl.reference,
        responseType: EnquiryCtrl.responseType,
        classId: EnquiryCtrl.classId,
        name: EnquiryCtrl.name,
        fathername: EnquiryCtrl.fathername,
        description: EnquiryCtrl.description,
        cnumber: EnquiryCtrl.cnumber,
        acnumber: EnquiryCtrl.acnumber,
        address: EnquiryCtrl.address,
        response: EnquiryCtrl.response,
        dateOfEnquiry: EnquiryCtrl.dateOfEnquiry,
        followUpDate: EnquiryCtrl.followUpDate,
        prevschool: EnquiryCtrl.prevschool,
        loginId: EnquiryCtrl.loginId,
        email: EnquiryCtrl.email,
        JoiningDate: EnquiryCtrl.JoiningDate,
        DateOfBirth: EnquiryCtrl.DateOfBirth,
        Gender: EnquiryCtrl.Gender
      };

      if (data) {
        //Check whether editmode or normal mode
        if (!EnquiryCtrl.editmode) {
          enquiryService.getExistingEnquiryRecords(data).then(function (result) {
            if (result) {
              toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
              $scope.first = !$scope.first;
              return;
            }
          }, function (result1) {
            if (result1) {
              enquiryService.CreateOrUpdateEnquiry(data).then(function (res) {
                console.log(res);
                if (res) {
                  (new Init()).getEnquiryDetails();
                  EnquiryCtrl.closeModal();
                  //Show Toast Message Success
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  $scope.first = !$scope.first;
                  clearformfields();
                }

              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                $scope.first = !$scope.first;
              });
            }
          });
        } else {
          data.id = EnquiryCtrl.editingEnquiryId;
          data.loginId = EnquiryCtrl.loginId;
          enquiryService.editEnquiry(data).then(function (result) {
            if (result) {
              //On Successfull refill the data list
              (new Init()).getEnquiryDetails();
              //Close Modal
              EnquiryCtrl.closeModal();
              EnquiryCtrl.clearfields();
              //Show Toast Message Success
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              $scope.first = !$scope.first;
            }
          }, function (error) {
            toastr.error(error, APP_MESSAGES.SERVER_ERROR);
          });
        }
      }
    };
    // //Delete Action
    var deleteEnquiry = function (index) {
      enquiryService.deleteEnquiry(EnquiryCtrl.enquiryList[index].id).then(function (result) {
        if (result) {
          //On Successfull refill the data list
          (new Init()).getEnquiryDetails();
          EnquiryCtrl.closeModal();
          //Show Toast Message Success
          toastr.success(APP_MESSAGES.DELETE_SUCCESS);
        }
      }, function (error) {
        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
      });
    };
    //    //delete ends
    EnquiryCtrl.closeModal = function () {
      var modal = $('#edit-enquiry');
      modal.modal('hide');
    };
    EnquiryCtrl.openModal = function () {
      var modal = $('#edit-enquiry');
      modal.modal('show');
    };
    EnquiryCtrl.openModal1 = function () {
      var modal = $('#edit-enquiry1');
      modal.modal('show');
    };
    EnquiryCtrl.closeModal1 = function () {
      var modal = $('#edit-enquiry1');
      modal.modal('hide');
    };
    //Clear Fields
    function clearformfields() {
      EnquiryCtrl.formFields = {};
    }
    //Delete confirmation box
    EnquiryCtrl.confirmCallbackMethod = function (id) {
      EnquiryCtrl.delIndex = 0;
      for (var i = 0; i < EnquiryCtrl.enquiryList.length; i++) {
        if (EnquiryCtrl.enquiryList[i].id === id) {
          EnquiryCtrl.delIndex = i;
        }
      }
      deleteEnquiry(EnquiryCtrl.delIndex);
    };
    //Delete cancel box
    EnquiryCtrl.confirmCallbackCancel = function (index) {
      if (index) {
        return false;
      }
      return;
    };

    //More Details
    EnquiryCtrl.detailsModee = function (id) {
      EnquiryCtrl.detailsMode = true;
      EnquiryCtrl.openModal();
      for (var i = 0; i < EnquiryCtrl.enquiryList.length; i++) {
        if (EnquiryCtrl.enquiryList[i].id === id) {
          EnquiryCtrl.enquiryListShow = EnquiryCtrl.enquiryList[i];
        }
      }
    };
    //Setting up float label
    EnquiryCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=name]'));
      Metronic.setFlotLabel($('input[name=classId]'));
      Metronic.setFlotLabel($('input[name=fathername]'));
      Metronic.setFlotLabel($('input[name=cnumber]'));
    };
    //Edit Action
    EnquiryCtrl.editEnquiry = function (id) {
      // console.log( EnquiryCtrl.enquiryList[index].JoiningDate);
      // console.log(EnquiryCtrl.enquiryList[index].DateOfBirth);
      // console.log(EnquiryCtrl.enquiryList[index].Gender);
      var index = "";
      for (var i = 0; i < EnquiryCtrl.enquiryList.length; i++) {
        if (EnquiryCtrl.enquiryList[i].id == id) {
          var index = i;
        }
      }

      EnquiryCtrl.openModal1();
      console.log(EnquiryCtrl.enquiryList[index].Gender);
      // console.log(EnquiryCtrl.enquiryList);
      EnquiryCtrl.enquiryType = EnquiryCtrl.enquiryList[index].enquiryType;
      EnquiryCtrl.reference = EnquiryCtrl.enquiryList[index].reference;
      EnquiryCtrl.responseType = EnquiryCtrl.enquiryList[index].responseType;
      EnquiryCtrl.classId = EnquiryCtrl.enquiryList[index].classId;
      EnquiryCtrl.name = EnquiryCtrl.enquiryList[index].studentId;
      EnquiryCtrl.fathername = EnquiryCtrl.enquiryList[index].fathername;
      EnquiryCtrl.cnumber = EnquiryCtrl.enquiryList[index].cnumber;
      EnquiryCtrl.acnumber = EnquiryCtrl.enquiryList[index].acnumber;
      EnquiryCtrl.address = EnquiryCtrl.enquiryList[index].address;
      EnquiryCtrl.response = EnquiryCtrl.enquiryList[index].response;
      EnquiryCtrl.dateOfEnquiry = new Date(EnquiryCtrl.enquiryList[index].dateOfEnquiry);
      EnquiryCtrl.followUpDate = new Date(EnquiryCtrl.enquiryList[index].followUpDate);
      EnquiryCtrl.loginId = EnquiryCtrl.enquiryList[index].loginId;
      EnquiryCtrl.editingEnquiryId = EnquiryCtrl.enquiryList[index].id;
      EnquiryCtrl.email = EnquiryCtrl.enquiryList[index].email;
      EnquiryCtrl.JoiningDate = new Date(EnquiryCtrl.enquiryList[index].JoiningDate);
      EnquiryCtrl.DateOfBirth = new Date(EnquiryCtrl.enquiryList[index].DateOfBirth);
      EnquiryCtrl.Gender = EnquiryCtrl.enquiryList[index].Gender;

      EnquiryCtrl.editmode = true;
    };

    //edit action ends
    //Export to Excel
    EnquiryCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download
    };
    //Bhasha Print View
    EnquiryCtrl.printData = function () {
      angular.element("#printTable").addClass('mouseEvent');
      var divToPrint = document.getElementById("printTable");
      EnquiryCtrl.newWin = window.open("");
      EnquiryCtrl.newWin.document.write(divToPrint.outerHTML);
      EnquiryCtrl.newWin.print();
      EnquiryCtrl.newWin.close();
      angular.element("#printTable").removeClass('mouseEvent');
    }

    //End Print View
    EnquiryCtrl.studentDetails = function (classId) {
      enquiryService.getStudentData(classId, EnquiryCtrl.schoolId).then(function (sucess) {
        if (sucess) {
          EnquiryCtrl.studentData = sucess;
        }
      });
    };
    EnquiryCtrl.clearfields = function () {
      EnquiryCtrl.enquiryType = "",
        EnquiryCtrl.reference = "",
        EnquiryCtrl.responseType = "",
        EnquiryCtrl.classId = "",
        EnquiryCtrl.name = "",
        EnquiryCtrl.fathername = "",
        EnquiryCtrl.cnumber = "",
        EnquiryCtrl.acnumber = "",
        EnquiryCtrl.address = "",
        EnquiryCtrl.response = "",
        // EnquiryCtrl.dateOfEnquiry = "",
        EnquiryCtrl.followUpDate = "",
        EnquiryCtrl.email = "",
        EnquiryCtrl.JoiningDate = "",
        EnquiryCtrl.DateOfBirth = "",
        EnquiryCtrl.Gender = ""
    }

    EnquiryCtrl.todaysDate = function () {
      EnquiryCtrl.dateOfEnquiry = new Date();
    }
    //   
    function formValidations() {
      if (EnquiryCtrl.enquiryType == undefined || EnquiryCtrl.enquiryType == '')
        return 'Select Enquiry Type ';

      if (EnquiryCtrl.classId == undefined || EnquiryCtrl.classId == undefined)
        return 'Select Class Name ';
      if (EnquiryCtrl.name == undefined || EnquiryCtrl.name == "")
        return 'Please Select Name ';

      if (EnquiryCtrl.fathername == undefined || EnquiryCtrl.fathername == "")
        return 'Please Enter Father Name';
      if (EnquiryCtrl.cnumber == undefined || EnquiryCtrl.cnumber == "")
        return 'Please Select Contact No  ';
      if (EnquiryCtrl.email == undefined || EnquiryCtrl.email == "")
        return 'Please Select Email  ';
        if (EnquiryCtrl.JoiningDate == undefined || EnquiryCtrl.JoiningDate == '')
        return 'Select Joining Date ';
        if (EnquiryCtrl.Gender == undefined || EnquiryCtrl.Gender == '')
        return 'Select Gender ';
        if (EnquiryCtrl.DateOfBirth == undefined || EnquiryCtrl.DateOfBirth == '')
        return 'Select Date Of Birth ';
      if (EnquiryCtrl.dateOfEnquiry == undefined || EnquiryCtrl.dateOfEnquiry == "")
        return 'Please Select Date of Enquiry  ';
      return undefined;
    }

    EnquiryCtrl.pdf = function () {
      angular.element("#printTable").addClass('mouseEvent');
      kendo.drawing
        .drawDOM("#expenseId",
          {
            paperSize: "A4",
            margin: { top: "2cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
            scale: 0.5,
            height: 500,
            image_compression: { FAST: "FAST" }
          })
        .then(function (group) {
          // group.children[0] = group.children[group.children.length - 1]
          // group.children.splice(1);
          $timeout(function () {
            angular.element("#printTable").removeClass('mouseEvent');
            kendo.drawing.pdf.saveAs(group, "ENQUIRY FORM.pdf");
          }, 1000);
        });
    }
  });
