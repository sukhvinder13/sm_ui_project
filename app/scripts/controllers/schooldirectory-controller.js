'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:SchooldirectoryControllerCtrl
 * @description
 * # SchooldirectoryControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('SchooldirectoryController', function (configService, $cookies, $http, schooldirectoryService, $scope, $stateParams, $location, FOsubject, $timeout, APP_MESSAGES, generateexcelFactory, toastr, $state, $compile, Mail, Parent, StudentParent, Student) {
    var SchooldirectoryCtrl = this;
    //Defaults
    SchooldirectoryCtrl.directorList = [];
    SchooldirectoryCtrl.studentsList = [];
    SchooldirectoryCtrl.studentsList1 = [];
    SchooldirectoryCtrl.accountantlist = [];
    SchooldirectoryCtrl.studentsAsPerAssignedClass = [];
    SchooldirectoryCtrl.staffList = [];
    SchooldirectoryCtrl.parentList = [];
    SchooldirectoryCtrl.profileList = [];
    SchooldirectoryCtrl.showForPdf = true;
    //SchooldirectoryCtrl.searchSelection = 'Students';

    SchooldirectoryCtrl.schoolId = $cookies.getObject('uds').schoolId;
    SchooldirectoryCtrl.loginId = $cookies.getObject('uds').id;
    SchooldirectoryCtrl.role = $cookies.get('role');



    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "School Directory") {
        SchooldirectoryCtrl.roleView = roleAccess[0].RolesData[i].view;
        SchooldirectoryCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        SchooldirectoryCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }

    }

    function Init() {
      this.getStudentsList = function () {
        schooldirectoryService.getStudentsList(SchooldirectoryCtrl.schoolId, SchooldirectoryCtrl.role, SchooldirectoryCtrl.loginId).then(function (result) {
          if (result) {
            SchooldirectoryCtrl.studentsList = result;
            // SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList;

            // $scope.numPerPage = 10;
            // $scope.noOfPages = SchooldirectoryCtrl.directorList.length / $scope.numPerPage;
            // $scope.currentPage = 1;


            // $scope.setPage = function () {
            //     $scope.data = SchooldirectoryCtrl.directorList.get(($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage);
            // };

            // $scope.$watch('currentPage', $scope.setPage);

            //Call Metronic
            // Metronic.init();
          }
        }, function (error) { });
      }
      this.getSelectedStudentsList = function () {
        FOsubject.find({
          filter: {
            where: {
              staffId: SchooldirectoryCtrl.loginId
            }
          }
        }, function (response) {
          var staffClassIds = _.uniqBy(response, 'classId');
          async.each(staffClassIds, function (chunk, subCb) {
            Student.find({
              filter: {
                where: {
                  classId: chunk.classId
                },
                include: 'class'
              }
            }, function (res) {
              SchooldirectoryCtrl.studentsAsPerAssignedClass.push(res);
              subCb();
            })
          }, function (err) {
            if (err) {
              alert(err);
            } else {
              // toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              SchooldirectoryCtrl.studentsAsPerAssignedClass.map(function (item) {
                item.map(function (item2) {
                  SchooldirectoryCtrl.studentsList1.push(item2);
                });
              })
            }
          })
        }, function (error) { });
      }
      this.getClassDetails = function () {
        schooldirectoryService.getClassDetailsBySchoolId(SchooldirectoryCtrl.schoolId, SchooldirectoryCtrl.role, SchooldirectoryCtrl.loginId).then(function (result) {
          if (result) {
            if (Array.isArray(result)) {
              var newArray = result.filter(function (thing, index, self) {
                return self.findIndex(function (t) {
                  return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                }) === index;
              });
              SchooldirectoryCtrl.classList = newArray;
            }

          }
        }, function (error) { });
      };
      this.getAdminClassDetails = function () {
        schooldirectoryService.getClassesDetailsBySchoolId(SchooldirectoryCtrl.schoolId, SchooldirectoryCtrl.role, SchooldirectoryCtrl.loginId).then(function (result) {
          if (result) {
            SchooldirectoryCtrl.classesList = result;

          }

        }, function (error) { });
      };
      this.getStaffList = function () {
        schooldirectoryService.getStaffList(SchooldirectoryCtrl.schoolId).then(function (result) {
          if (result) {
            SchooldirectoryCtrl.staffList = result;
          }
        }, function (error) { });
      };
      this.getaccountantlist = function () {
        schooldirectoryService.getaccountantlist(SchooldirectoryCtrl.schoolId).then(function (result) {
          if (result) {
            SchooldirectoryCtrl.accountantlist = result;
            console.log(SchooldirectoryCtrl.accountantlist);
          }
        }, function (error) { });
      };
      this.getParentsList = function () {
        schooldirectoryService.getParentsListBySchoolId(SchooldirectoryCtrl.schoolId).then(function (result) {
          if (result) {
            SchooldirectoryCtrl.parentList = result;
          }
        }, function (error) { });
      };
      this.getSingleStudent = function () {
        schooldirectoryService.getStudentsListByLoginId(SchooldirectoryCtrl.schoolId, SchooldirectoryCtrl.loginId).then(function (result) {
          if (result) {
            SchooldirectoryCtrl.studentsListByLogin = result;
            if (SchooldirectoryCtrl.role === "Student") {
              SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.staffList;
            }
          }
        });
      };
      this.getstudentdetails = function () {
        var ss = $cookies.getObject('uts');
        $http({
          method: "GET",
          url: configService.baseUrl() + "/Students/findrecords?schoolId=" + SchooldirectoryCtrl.schoolId + "&numb=" + 10 + "&access_token=" + ss.accessToken,
        }).then(function mySuccess(response) {
          SchooldirectoryCtrl.findrecords = response.data;
        }, function myError(response1) {
        });
      }
    }
    // Make an call to functions
    (new Init()).getStudentsList();
    (new Init()).getStaffList();
    (new Init()).getaccountantlist();
    (new Init()).getParentsList();
    (new Init()).getClassDetails();
    (new Init()).getAdminClassDetails();
    (new Init()).getSingleStudent();
    (new Init()).getSelectedStudentsList();
    (new Init()).getstudentdetails();


    SchooldirectoryCtrl.chooseClass = function (classId) {
      $scope.staffdata = false;
      SchooldirectoryCtrl.classId = classId;
      schooldirectoryService.getClassRecordsByClassId(SchooldirectoryCtrl.classId).then(function (result) {
        if (result) {
          SchooldirectoryCtrl.classidregister = result;
          SchooldirectoryCtrl.directorList = result;
        }
      }, function (error) { });

    };
    /*
     * Watch an expression and load the data respectively
     * If Student radio button is selected then bind directoryList to StudentList and
     * Same things goes for the other two options
     */
    $scope.$watch('SchooldirectoryCtrl.searchSelection', function (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        switch (newValue) {
          case 'Students':
            SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList;
            $timeout(function () {
              $('[data-toggle="popover"]').popover().click(function (ev) {
                if (ev) {
                  $compile($('.popover.in').contents())($scope);
                }
              });
            });
            break;
          case 'Parents':
            SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.parentList;
            break;
          case 'Staff':
            SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.staffList;
            break;
        }
      }
    });
    //dropdown user typ by bhasha

    SchooldirectoryCtrl.selectchange = function (reportId) {
      var checkUserId = reportId;
      if (checkUserId == "stud") {
        if (SchooldirectoryCtrl.role !== "Student") {
          $scope.ShowSpinnerStatus = true;
          $timeout(function () {
            if (SchooldirectoryCtrl.role === "Staff") {
              $scope.staffdata = true;

              SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList1;
            } else {
              $scope.staffdata = false;
              SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.findrecords.data;
              $timeout(function () {
                SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList;
              }, 3000);
            }
            $scope.ShowSpinnerStatus = false;
          }, 10)
          //SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList;
        } else {
          SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsListByLogin;
        }
      } else if (checkUserId == "staff") {
        var ShowSpinnerStatus = true;
        $timeout(function () {
          SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.staffList;
          $scope.ShowSpinnerStatus = false;
        })
      } else if (checkUserId == "Accountant") {
        var ShowSpinnerStatus = true;
        SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.accountantlist
        console.log(SchooldirectoryCtrl.directorList);
        $scope.ShowSpinnerStatus = false;
      }
    }
    /* ==================== More Details Section ========================== */
    SchooldirectoryCtrl.showMoreDetails = function (data) {
      if (SchooldirectoryCtrl.searchSelection) {
        SchooldirectoryCtrl.profileList = data;

        $timeout(function () {
          SchooldirectoryCtrl.openProfileModal();
        });
      }
    };
    SchooldirectoryCtrl.openProfileModal = function () {
      var modal = $('#details-modal');
      modal.modal('show');
    };
    SchooldirectoryCtrl.closeProfileModal = function () {
      var modal = $('#details-modal');
      modal.modal('hide');
    };
    SchooldirectoryCtrl.openTab = function (id, event) {
      $('#' + id).tab('show');
    };
    /* ==================== More Details Section End ====================== */
    //Delete confirmation box
    SchooldirectoryCtrl.confirmCallbackMethod = function (data) {
      deleteRecord(data);
    };
    //Delete cancel box
    SchooldirectoryCtrl.confirmCallbackCancel = function () {
      return false;
    };
    /* ==================== Edit Details Section ========================== */
    SchooldirectoryCtrl.editDetails = function (data) {
      if (data.type) {
        switch (data.type) {
          case 'Student':
            // $state.go('home.addstudent', { 'id': data.id });
            var url = $state.href('home.addstudent', {
              'id': data.id
            });
            window.open(url, '_blank');
            break;
          case 'Staff':
            var url = $state.href('home.addstaff', {
              'id': data.id
            });
            window.open(url, '_blank');
            break;
          case 'Parents':
            var url = $state.href('home.parent', {
              'id': data.id
            });
            window.open(url, '_blank');
            break;
          case 'Accountant':
            var url = $state.href('home.addaccountant', {
              'id': data.id
            });
            window.open(url, '_blank');
            break;
        }
        $timeout(function () { });
      }
    };
    //Delete Action
    var deleteRecord = function (data) {
      if (data.type) {
        switch (data.type) {
          case 'Student':
            SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList;
            if (SchooldirectoryCtrl.studentsList) {
              schooldirectoryService.deleteStudent(data.id).then(function (result) {
                if (result) {
                  (new Init()).getStudentsList();
                  schooldirectoryService.getStudentsList(SchooldirectoryCtrl.schoolId, SchooldirectoryCtrl.role, SchooldirectoryCtrl.loginId).then(function (result) {
                    if (result) {
                      SchooldirectoryCtrl.studentsList = result;
                      if (SchooldirectoryCtrl.classId == "") {
                        SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList;
                      } else {
                        SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.classidregister;
                      }
                      // SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.studentsList;
                    }
                  }, function (error) { });
                  //Show Toast Message Success
                  toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                  if (SchooldirectoryCtrl.classId !== "") {
                    SchooldirectoryCtrl.chooseClass(SchooldirectoryCtrl.classId);
                  } else {
                    (new Init()).getStudentsList();
                  }
                }
              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
              });
            }
            break;
          case 'Staff':
            SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.staffList;
            if (SchooldirectoryCtrl.staffList) {
              schooldirectoryService.deleteStaff(data).then(function (result) {
                if (result) {
                  (new Init()).getStaffList();
                  schooldirectoryService.getStaffList(SchooldirectoryCtrl.schoolId).then(function (result) {
                    if (result) {
                      SchooldirectoryCtrl.staffList = result;
                      SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.staffList;

                    }
                  }, function (error) { });
                  //Show Toast Message Success
                  toastr.success(APP_MESSAGES.DELETE_SUCCESS);

                }
              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
              });
            }
            break;
          case 'Accountant':
          // SchooldirectoryCtrl.accountantlist
            SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.accountantlist;
            if (SchooldirectoryCtrl.accountantlist) {
              schooldirectoryService.deleteAccountant(data).then(function (result) {
                if (result) {
                  (new Init()).getaccountantlist();
                  schooldirectoryService.getaccountantlist(SchooldirectoryCtrl.schoolId).then(function (result) {
                    if (result) {
                      SchooldirectoryCtrl.accountantlist = result;
                      SchooldirectoryCtrl.directorList = SchooldirectoryCtrl.accountantlist;

                    }
                  }, function (error) { });
                  //Show Toast Message Success
                  toastr.success(APP_MESSAGES.DELETE_SUCCESS);

                }
              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
              });
            }
            // if (SchooldirectoryCtrl.accountantlist) {
            //   Accountant.deleteById({
            //     id: data.id
            //   }, function () {
            //     $scope.resultaccountant = accountant.find({
            //       filter: {
            //         where: {
            //           AccountantId: data.id,
            //           schoolId: SchooldirectoryCtrl.schoolId
            //         }
            //       }
            //     },
            //       function (response) {
            //         response.forEach(function (resultaccountant) {
            //           var p = resultaccountant.toJSON();
            //           accountant.deleteById({
            //             id: p.id
            //           }, function (result) {
            //             toastr.success(APP_MESSAGES.DELETE_SUCCESS);
            //             SchooldirectoryCtrl.directorList.splice(data, 1);
            //             (new Init()).getaccountantlist();
            //           });
            //         });

            //       },
            //       function (error) {
            //         toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            //       });
            //   });
            // }
            break;
        }
      }
    };
    //****** SENDING EMAIL *******/
    SchooldirectoryCtrl.submitemail = function (data) {
      if (data) {
        Parent.create({
          email: SchooldirectoryCtrl.subscribeemail,
          password: "parent"
        }, function () {
          var message = 'Welcome To Study Monitor.Your default password is parent.Please subscribe to your child ' + data.firstName + ' ' + data.lastName + ' ' + window.location.origin + '/#!/Signup' + ' using the following Key : ' + data.id;
          sendSubscriptionEmail(SchooldirectoryCtrl.subscribeemail, data, message);
        }, function () {
          var message = "Please subscribe to your child " + data.firstName + ' ' + data.lastName + ' ' + window.location.origin + "/#!/Signup" + " using the following Key : " + data.id;
          sendSubscriptionEmail(SchooldirectoryCtrl.subscribeemail, data, message);
        });
      }
    };

    function sendSubscriptionEmail(email, data, message) {
      SchooldirectoryCtrl.subject = 'Student Subscription From ';
      Mail.create({
        // type:'subscription',
        email: email.toLowerCase(),
        message: message,
        subject: SchooldirectoryCtrl.subject,
        schoolId: data.schoolId
      }, function (result) {
        (new Init()).getStudentsList();
        toastr.success(APP_MESSAGES.EMAIL_SENT);
      }, function (error) {
        toastr.error('Data Error', 'Not able to subscribe' + error);
      });
    }
    //****** SENDING EMAIL ********/
    //Export to Excel
    SchooldirectoryCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      document.getElementById('printTable').style.display = 'block';

      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
        $window.location.reload();
        document.getElementById('printTable').style.display = 'none';
      }, 100); // trigger download
      document.getElementById('printTable').style.display = 'none';
    };
    //Bhasha Print View
    SchooldirectoryCtrl.printData = function () {
      document.getElementById('printTable').style.display = 'block';
      var divToPrint = document.getElementById("printTable");
      SchooldirectoryCtrl.newWin = window.open("");
      SchooldirectoryCtrl.newWin.document.write(divToPrint.outerHTML);

      setTimeout(function () {
        SchooldirectoryCtrl.newWin.print();
        SchooldirectoryCtrl.newWin.close();
        $window.location.reload();
      }, 250);
    }

    //End Print View
    //Bhasha More details
    SchooldirectoryCtrl.MoreDetails = function (stuid) {
      if (SchooldirectoryCtrl.formFields.roleId == 'stud') {
        $location.url('studentmoreDetails/' + stuid);
      } else if (SchooldirectoryCtrl.formFields.roleId == 'staff') {
        $location.url('staffmoreDetails/' + stuid);
      }else if(SchooldirectoryCtrl.formFields.roleId == 'Accountant'){
        $location.url('accountantmore/' + stuid);
      }



    };
    SchooldirectoryCtrl.test = function (data) {
      var matchedPosition = data.rollNo.search(/[a-z]/i);
      console.log(matchedPosition);
      if (matchedPosition != -1) {
      } else {
        console.log(typeof (data.rollNo));
        var a = Number(data.rollNo);
        data.rolll = a;
        return data.rolll;
      }
    }
    // $scope.myExpression = function (data) {
    //   // alert("rollNO");
    //   console.log(data.rollNo);
    //   var words = data.rollNo;
    //   console.log(parseInt(words));
    //   return parseInt(words);
    // };
    SchooldirectoryCtrl.clearform = function () {
      SchooldirectoryCtrl.classId = "";
    }
    SchooldirectoryCtrl.pdf = function () {
      kendo.drawing
        .drawDOM("#printTable",
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
            kendo.drawing.pdf.saveAs(group, "DIRECTORY.pdf");
          }, 1000);
        });
      $timeout(function () {
        SchooldirectoryCtrl.showForPdf = true;
      }, 1000);
    }
  });
