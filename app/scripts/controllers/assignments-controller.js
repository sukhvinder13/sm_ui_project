'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AssignmentsControllerCtrl
 * @description
 * # AssignmentsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AssignmentsController', function (configService, assignmentsService, $scope, $cookies, $timeout, $filter, toastr, APP_MESSAGES, generateexcelFactory, Assignment, Student, $http, Class, Subject, FOsubject) {
    var AssignmentsCtrl = this;
    AssignmentsCtrl.formFields = {};
    AssignmentsCtrl.editmode = false;
    AssignmentsCtrl.detailsMode = false;
    AssignmentsCtrl.viewValue = {};
    AssignmentsCtrl.classList = [];
    AssignmentsCtrl.currentWeekDisplay = true;
    AssignmentsCtrl.nextWeekDisplay = false;
    AssignmentsCtrl.lastWeekDisplay = false;
    AssignmentsCtrl.colspan = 8;
    AssignmentsCtrl.pdfCurrent =true;

    AssignmentsCtrl.role = $cookies.get('role');
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Assignments") {

        AssignmentsCtrl.roleView = roleAccess[0].RolesData[i].view;
        AssignmentsCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        AssignmentsCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }
    }
    if (AssignmentsCtrl.role == 'Student') {
      AssignmentsCtrl.classId = $cookies.getObject('uds').classId;
      $timeout(function () {
        AssignmentsCtrl.chooseClass(AssignmentsCtrl.classId); AssignmentsCtrl.sub(AssignmentsCtrl.formFields.classId);
      }, 1000);
    }
    //Get Assignment details by School ID
    AssignmentsCtrl.schoolId = $cookies.getObject('uds').schoolId;
    AssignmentsCtrl.loginId = $cookies.getObject('uds').id;
    AssignmentsCtrl.role = $cookies.get('role');
    AssignmentsCtrl.subject = true;
    AssignmentsCtrl.firstday = new Date();

    AssignmentsCtrl.lastday = new Date() + 6;

    function Init() {
      this.getAssignmentDetails = function () {
        assignmentsService.getAssignmentDetailsBySchoolId(AssignmentsCtrl.schoolId, AssignmentsCtrl.role, AssignmentsCtrl.loginId).then(function (result) {
          if (result) {
            AssignmentsCtrl.assignmentList = result;
          }
        }, function (error) { });
      };

      this.getClassDetails = function () {
        assignmentsService.getClassDetailsBySchoolId(AssignmentsCtrl.schoolId, AssignmentsCtrl.role, AssignmentsCtrl.loginId).then(function (result) {
          if (result) {
            AssignmentsCtrl.classList = result;
          }
        }, function (error) { });
      };
      this.getClassesDetails = function () {
        assignmentsService.getClassesDetailsBySchoolId(AssignmentsCtrl.schoolId, AssignmentsCtrl.role, AssignmentsCtrl.loginId).then(function (result) {
          if (result) {
            if (Array.isArray(result)) {
              var newArray = result.filter(function (thing, index, self) {
                return self.findIndex(function (t) {
                  return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                }) === index;
              });
              AssignmentsCtrl.classesList = newArray;
            }
          }
        }, function (error) { });
      };

    }
    // (new Init()).getAssignmentDetails();
    (new Init()).getClassDetails();
    (new Init()).getClassesDetails();
    AssignmentsCtrl.getAssignmentDetailsByclassId = function (classId) {
      Assignment.find({ filter: { where: { classId: classId }, inlcude: ['class', 'subject'] } }, function (response) {
        AssignmentsCtrl.assignmentList = response;
      })
    };
    AssignmentsCtrl.chooseClass = function (classId, date) {
      document.getElementById('calendar').style.display = '';
      document.getElementById('nextWeek').style.display = 'none';
      document.getElementById('lastWeek').style.display = 'none';
      document.getElementById('currentWeek').style.display = '';

      // if (classId === undefined) {
      //   toastr.error("Please select Class");
      //   return;
      // }
      // if (date === undefined) {
      //     toastr.error("Please select Date");
      //     return;
      // }
      AssignmentsCtrl.classId = classId;
      var toDate = new Date();
      var tomDate = toDate.getDate() + 1;
      if (tomDate < 10) {
        var tomDate = "0" + tomDate;
      }
      var tomMonth = toDate.getMonth() + 1;
      var tomYear = toDate.getFullYear();
      if (tomMonth < 10) tomMonth = '0' + tomMonth;
      AssignmentsCtrl.toDate = $filter('date')(toDate, 'dd-MM-yyyy');
      AssignmentsCtrl.tomorrowDate = tomDate + "-" + tomMonth + "-" + tomYear;

      //CURENT WEEK
      var curr = new Date();
      var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
      AssignmentsCtrl.firstday = $filter('date')(firstday, 'dd-MM-yyyy');

      var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
      AssignmentsCtrl.lastday = $filter('date')(lastday, 'dd-MM-yyyy');

      //Previous Week
      var curr1 = new Date();
      var firstday1 = new Date(curr1.setDate(curr1.getDate() - curr1.getDay()));
      AssignmentsCtrl.firstday1 = $filter('date')(firstday1, 'dd-MM-yyyy');

      var lastday1 = new Date(curr1.setDate(curr1.getDate() - curr1.getDay() - 6));
      AssignmentsCtrl.lastday1 = $filter('date')(lastday1, 'dd-MM-yyyy');
      assignmentsService.getClassRecordsByClassId(AssignmentsCtrl.classId, AssignmentsCtrl.toDate).then(function (result) {
        if (result) {
          AssignmentsCtrl.assignmentList = result;
        }
      }, function (error) { });
      assignmentsService.getClassRecordsByClassId1(AssignmentsCtrl.classId, AssignmentsCtrl.tomorrowDate).then(function (result) {
        if (result) {
          AssignmentsCtrl.assignmentList1 = result;
        }
      }, function (error) { });
      // assignmentsService.getClassRecordsByClassId2(AssignmentsCtrl.classId, AssignmentsCtrl.firstday, AssignmentsCtrl.lastday).then(function (result) {
      //   if (result) {
      //     AssignmentsCtrl.assignmentList2 = result;
      //   }
      // }, function (error) {});
      var p1 = AssignmentsCtrl.firstday.split('-');
      var p2 = AssignmentsCtrl.lastday.split('-');

      var listDateyo = [];
      AssignmentsCtrl.thisweekDates = [];
      AssignmentsCtrl.thisweekDatesdata = [];
      var startDate = p1[2] + "-" + p1[1] + "-" + p1[0];
      var endDate = p2[2] + "-" + p2[1] + "-" + p2[0];
      var dateMove = new Date(startDate);
      var strDate = startDate;

      while (strDate < endDate) {
        var strDate = dateMove.toISOString().slice(0, 10);
        listDateyo.push(strDate);
        dateMove.setDate(dateMove.getDate() + 1);
      };
      // for (var i = 0; i < listDateyo.length; i++) {
        async.each(listDateyo, function (Dateyo, Cb) {
        var yooo = Dateyo.split('-');
        var fssDate = yooo[2] + "-" + yooo[1] + "-" + yooo[0];
        Assignment.find({
          filter: {
            where: {
              classId: classId,
              toDate: fssDate
            },
            include: ['class', 'subject']
          }
        }, function (response) {
          AssignmentsCtrl.thisweekDatesdata.push(response);
          Cb();
        })

      },function(err){
        if(err){console.log(err);}else{
          async.each(AssignmentsCtrl.thisweekDatesdata, function (data, subCb) {
            if(data.length>0){
              var count = 0;
              data.map(function(item){
                AssignmentsCtrl.thisweekDates.push(item);
                if(data.length == count)subCb();
                count++;
              })
            }else{subCb();}
          },function(err){
            if(err){console.log(err);}
          });

        }
      })
    };

    //Close or Open modal
    AssignmentsCtrl.closeModal = function () {
      var modal = $('#edit-assignments');
      modal.modal('hide');
      AssignmentsCtrl.subjectList = [];

      //ClearFields
      clearformfields();
    };
    AssignmentsCtrl.openModal = function () {
      var modal = $('#edit-assignments');
      modal.modal('show');
    };
    //Clear Fields
    function clearformfields() {
      AssignmentsCtrl.formFields = {};
    }
    //Delete confirmation box
    AssignmentsCtrl.confirmCallbackMethod = function (assigmentId) {
      deleteAssignment(assigmentId);
    };
    //Delete cancel box
    AssignmentsCtrl.confirmCallbackCancel = function () {
      return false;
    };
    // Add Action
    $scope.first = true;
    AssignmentsCtrl.assignmentAction = function (invalid) {
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      $scope.first = !$scope.first;
      if (invalid) {
        return;
      }
      var data = {
        schoolId: AssignmentsCtrl.schoolId,
        title: AssignmentsCtrl.formFields.title,
        classId: AssignmentsCtrl.formFields.classId,
        subjectId: AssignmentsCtrl.formFields.subjectId,
        description: AssignmentsCtrl.formFields.description,
        fromDate: $filter('date')(AssignmentsCtrl.formFields.fromDate, 'dd-MM-yyyy'),
        toDate: $filter('date')(AssignmentsCtrl.formFields.toDate, 'dd-MM-yyyy')
      };
      if (data) {
        //Check whether editmode or normal mode
        if (!AssignmentsCtrl.editmode) {
          assignmentsService.getExistingAssignmentRecords(data).then(function (result) {
            if (result) {
              toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
              $scope.first = !$scope.first;
              return;
            }
          }, function (result1) {
            if (result1) {
              assignmentsService.CreateOrUpdateAssignment(data).then(function (res) {
                if (res) {
                  // (new Init()).getAssignmentDetails();
                  AssignmentsCtrl.closeModal();
                  //Show Toast Message Success
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                  AssignmentsCtrl.chooseClass(AssignmentsCtrl.classId);
                  $scope.first = !$scope.first;
                  AssignmentsCtrl.subject = false;
                  // AssignmentsCtrl.alertEmails(res);

                }

              }, function (error) {
                $scope.first = !$scope.first;
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
              });
            }
          });
        } else {
          data.id = AssignmentsCtrl.editingAssignmentId;
          assignmentsService.editAssignment(data).then(function (result) {
            if (result) {
              //On Successfull refill the data list
              // (new Init()).getAssignmentDetails();
              //Close Modal
              AssignmentsCtrl.closeModal();
              //Show Toast Message Success
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
              AssignmentsCtrl.chooseClass(AssignmentsCtrl.classId);
              $scope.first = !$scope.first;
            }
          }, function (error) {
            toastr.error(error, APP_MESSAGES.SERVER_ERROR);
            $scope.first = !$scope.first;
          });
        }
      }
    };
    //Delete Action
    var deleteAssignment = function (assigmentId) {
      if (AssignmentsCtrl.assignmentList) {
        assignmentsService.deleteAssignment(assigmentId).then(function (result) {
          if (result) {
            //On Successfull refill the data list
            // (new Init()).getAssignmentDetails();
            AssignmentsCtrl.closeModal();
            //Show Toast Message Success
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
            AssignmentsCtrl.chooseClass(AssignmentsCtrl.classId);
            //(new Init()).getAssignmentDetails();
          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }
    };
    //Edit Action
    AssignmentsCtrl.editAssignment = function (index, status, id) {
      if (status == "today") {
        AssignmentsCtrl.formFields.title = AssignmentsCtrl.assignmentList[index].title;
        AssignmentsCtrl.formFields.classId = AssignmentsCtrl.assignmentList[index].classId;
        $timeout(function(){
        if(AssignmentsCtrl.assignmentList[index].subject.FoSubjectFlag){
          AssignmentsCtrl.subjectList.map(function(item){
            if(item.subjectName === AssignmentsCtrl.assignmentList[index].subject.subjectName)
            AssignmentsCtrl.formFields.subjectId = item.id;
          })
        }else{
        AssignmentsCtrl.formFields.subjectId = AssignmentsCtrl.assignmentList[index].subjectId;}
      },1000);
        AssignmentsCtrl.formFields.description = AssignmentsCtrl.assignmentList[index].description;
        // AssignmentsCtrl.formFields.edate1 = AssignmentsCtrl.assignmentList2[index].fromDate;
        // AssignmentsCtrl.formFields.edate = new Date(AssignmentsCtrl.assignmentList[index].fromDate);
        // AssignmentsCtrl.formFields.fromDate = AssignmentsCtrl.formFields.edate;
        // AssignmentsCtrl.formFields.bdate = new Date(AssignmentsCtrl.assignmentList[index].toDate);
        // AssignmentsCtrl.formFields.toDate = AssignmentsCtrl.formFields.bdate;
        AssignmentsCtrl.editingAssignmentId = AssignmentsCtrl.assignmentList[index].id;

        var dateF = AssignmentsCtrl.assignmentList[index].fromDate;
        var parts = dateF.split('-');
        var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.fromDate = curr;
        AssignmentsCtrl.formFields.bdate = new Date(AssignmentsCtrl.assignmentList[index].toDate);
        AssignmentsCtrl.formFields.toDate = AssignmentsCtrl.formFields.bdate;

        var dateT = AssignmentsCtrl.assignmentList[index].toDate;

        var parts = dateT.split('-');

        var curr1 = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.toDate = curr1;

      } else if (status == "tomorrow") {
        AssignmentsCtrl.formFields.title = AssignmentsCtrl.assignmentList1[index].title;
        AssignmentsCtrl.formFields.classId = AssignmentsCtrl.assignmentList1[index].classId;
        AssignmentsCtrl.formFields.subjectId = AssignmentsCtrl.assignmentList1[index].subjectId;
        AssignmentsCtrl.formFields.description = AssignmentsCtrl.assignmentList1[index].description;

        AssignmentsCtrl.editingAssignmentId = AssignmentsCtrl.assignmentList1[index].id;
        var dateF = AssignmentsCtrl.assignmentList1[index].fromDate;

        var parts = dateF.split('-');

        var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);

        AssignmentsCtrl.formFields.fromDate = curr;
        AssignmentsCtrl.formFields.bdate = new Date(AssignmentsCtrl.assignmentList1[index].toDate);
        AssignmentsCtrl.formFields.toDate = AssignmentsCtrl.formFields.bdate;
        var dateT = AssignmentsCtrl.assignmentList1[index].toDate;
        var parts = dateT.split('-');
        var curr1 = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.toDate = curr1;
      }
      if (status == "thisweek") {
        AssignmentsCtrl.formFields.title = id.title;
        AssignmentsCtrl.formFields.classId = id.classId;
        AssignmentsCtrl.formFields.subjectId = id.subjectId;
        AssignmentsCtrl.formFields.description = id.description;

        var dateF = id.fromDate;
        var parts = dateF.split('-');
        var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.fromDate = curr;

        var dateT = id.toDate;
        var parts = dateT.split('-');
        var curr1 = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.toDate = curr1;
        AssignmentsCtrl.editingAssignmentId = id.id;
      }
      if (status == "next") {
        AssignmentsCtrl.formFields.title = id.title;
        AssignmentsCtrl.formFields.classId = id.classId;
        AssignmentsCtrl.formFields.subjectId = id.subjectId;
        AssignmentsCtrl.formFields.description = id.description;
        var dateF = id.fromDate;
        var parts = dateF.split('-');
        var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.fromDate = curr;

        var dateT = id.toDate;
        var parts = dateT.split('-');
        var curr1 = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.toDate = curr1;

        AssignmentsCtrl.editingAssignmentId = id.id;
      }
      if (status == "last") {
        AssignmentsCtrl.formFields.title = id.title;
        AssignmentsCtrl.formFields.classId = id.classId;
        AssignmentsCtrl.formFields.subjectId = id.subjectId;
        AssignmentsCtrl.formFields.description = id.description;

        var dateF = id.fromDate;
        var parts = dateF.split('-');
        var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.fromDate = curr;

        var dateT = id.toDate;
        var parts = dateT.split('-');
        var curr1 = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
        AssignmentsCtrl.formFields.toDate = curr1;
        AssignmentsCtrl.editingAssignmentId = id.id;

      }
      AssignmentsCtrl.selectedClass(AssignmentsCtrl.formFields.classId);
      //Set View Mode false
      AssignmentsCtrl.detailsMode = false;
      //Open Modal
      AssignmentsCtrl.openModal();

      $timeout(function () {

        AssignmentsCtrl.setFloatLabel();
        //Enable Edit Mode
        AssignmentsCtrl.editmode = true;
      });

    };

    //Setting up float label
    AssignmentsCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=title]'));
      Metronic.setFlotLabel($('input[name=classId]'));
      Metronic.setFlotLabel($('input[name=subjectId]'));
      Metronic.setFlotLabel($('input[name=description]'));
      Metronic.setFlotLabel($('input[name=fromDate]'));
      Metronic.setFlotLabel($('input[name=toDate]'));
    };
    //Calendar Fix @@TODO Move this to directive
    $timeout(function () {
      $('#assignmentdate1').on('dp.change', function () {
        AssignmentsCtrl.formFields.fromDate = $(this).val();
      });
    }, 500);
    //Calendar Fix @@TODO Move this to directive
    $timeout(function () {
      $('#assignmentdate2').on('dp.change', function () {
        AssignmentsCtrl.formFields.toDate = $(this).val();
      });
    }, 500);
    //More Details
    AssignmentsCtrl.moreDetails = function (data) {
      AssignmentsCtrl.detailsMode = true;
      AssignmentsCtrl.openModal();
      Assignment.find({
        filter: {
          where: {
            id: data
          },
          include: ['class', 'subject']
        }
      }, function (response) {
        if (response[0].subject) {
          AssignmentsCtrl.viewValue = response;
        } else {
          FOsubject.find({
            filter: {
              where: {
                id: response[0].subjectId
              }
            }
          }, function (res) {
            if (res) {
              response[0].subject = res[0];
              AssignmentsCtrl.viewValue = response;
            }
          })
        }

      })
    };
    //Get Subjects based on Selected Classes
    AssignmentsCtrl.selectedClass = function () {
      if (AssignmentsCtrl.formFields.classId, AssignmentsCtrl.role, AssignmentsCtrl.loginId) {
        assignmentsService.getSubjectsByClassId(AssignmentsCtrl.schoolId, AssignmentsCtrl.formFields.classId, AssignmentsCtrl.role, AssignmentsCtrl.loginId).then(function (result) {
          if (result) {
            AssignmentsCtrl.subjectList = result;
          }
        });
      }
    };
    //Export to Excel
    AssignmentsCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download
    };
    //Bhasha Print View
    AssignmentsCtrl.printData = function () {
      var divToPrint = document.getElementById("tableToExportfromHere");
      AssignmentsCtrl.newWin = window.open("");
      AssignmentsCtrl.newWin.document.write(divToPrint.outerHTML);
      AssignmentsCtrl.newWin.print();
      AssignmentsCtrl.newWin.close();
    }
    AssignmentsCtrl.assignClass = function () {
      AssignmentsCtrl.formFields.classId = AssignmentsCtrl.classId;
      AssignmentsCtrl.selectedClass();
    }

    //End Print View
    AssignmentsCtrl.ValidateEndDate = function () {
      $("#assignmentdate1").change(function () {
        var startDate = document.getElementById("assignmentdate1").value;
        var endDate = document.getElementById("assignmentdate2").value;

        if ((Date.parse(endDate) < Date.parse(startDate))) {
          alert("End date should be greater than Start date");
          document.getElementById("assignmentdate1").value = "";
        }
      });

      $("#assignmentdate2").change(function () {
        var startDate = document.getElementById("assignmentdate1").value;
        var endDate = document.getElementById("assignmentdate2").value;

        if ((Date.parse(endDate) < Date.parse(startDate))) {
          alert("End date should be greater than Start date");
          document.getElementById("assignmentdate2").value = "";
        }
      });
    }

    AssignmentsCtrl.lastWeek = function (fday, lday, classId) {
      var cursor = new Date();
      var firstdays = new Date(cursor.setDate(cursor.getDate() - cursor.getDay()));
      AssignmentsCtrl.firstdays = $filter('date')(firstdays, 'dd-MM-yyyy');

      var lastdays = new Date(cursor.setDate(cursor.getDate() - cursor.getDay() + 6));
      AssignmentsCtrl.lastdays = $filter('date')(lastdays, 'dd-MM-yyyy');



      var parts = fday.split('-');
      var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
      var lastD = new Date(curr.setDate(curr.getDate() - curr.getDay() - 1));
      AssignmentsCtrl.lastday = $filter('date')(lastD, 'dd-MM-yyyy');

      var lday = AssignmentsCtrl.lastday;
      var parts1 = lday.split('-');
      var curr1 = new Date(parts1[2] + "-" + parts1[1] + "-" + parts1[0]);
      var firstD = new Date(curr1.setDate(curr1.getDate() - curr1.getDay()));
      AssignmentsCtrl.firstday = $filter('date')(firstD, 'dd-MM-yyyy');

      if (AssignmentsCtrl.firstdays == AssignmentsCtrl.firstday && AssignmentsCtrl.lastdays == AssignmentsCtrl.lastday) {
        document.getElementById('currentWeek').style.display = '';
        document.getElementById('nextWeek').style.display = 'none';
        document.getElementById('lastWeek').style.display = 'none';
        AssignmentsCtrl.currentWeekDisplay = true;
        AssignmentsCtrl.nextWeekDisplay = false;
        AssignmentsCtrl.lastWeekDisplay = false;
        AssignmentsCtrl.pdfCurrent = true;
      } else {

        document.getElementById('currentWeek').style.display = 'none';
        document.getElementById('nextWeek').style.display = 'none';
        document.getElementById('lastWeek').style.display = '';
        AssignmentsCtrl.currentWeekDisplay = false;
        AssignmentsCtrl.nextWeekDisplay = false;
        AssignmentsCtrl.lastWeekDisplay = true;
        AssignmentsCtrl.pdfCurrent = false;
        var listDate = [];
        AssignmentsCtrl.listOdDates = [];
        var startDate = $filter('date')(firstD, 'yyyy-MM-dd');
        var endDate = $filter('date')(lastD, 'yyyy-MM-dd');
        var dateMove = new Date(startDate);
        var strDate = startDate;

        while (strDate < endDate) {
          var strDate = dateMove.toISOString().slice(0, 10);
          listDate.push(strDate);
          dateMove.setDate(dateMove.getDate() + 1);
        };

        for (var i = 0; i < listDate.length; i++) {
          var yo = listDate[i].split('-');
          var ffDate = yo[2] + "-" + yo[1] + "-" + yo[0];

          Assignment.find({
            filter: {
              where: {
                classId: classId,
                toDate: ffDate
              },
              include: ['class', 'subject']
            }
          }, function (responseData) {
            AssignmentsCtrl.listOdDates.push(responseData);
          })

        }
      }
    }
    AssignmentsCtrl.nextWeek = function (next, fday, classId) {
      var cursor = new Date();
      var firstdays = new Date(cursor.setDate(cursor.getDate() - cursor.getDay()));
      AssignmentsCtrl.firstdays = $filter('date')(firstdays, 'dd-MM-yyyy');

      var lastdays = new Date(cursor.setDate(cursor.getDate() - cursor.getDay() + 6));
      AssignmentsCtrl.lastdays = $filter('date')(lastdays, 'dd-MM-yyyy');

      var parts = next.split('-');

      var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);

      var firstday = new Date(curr.setDate(curr.getDate() + 1 - curr.getDay() + 6));
      AssignmentsCtrl.firstday = $filter('date')(firstday, 'dd-MM-yyyy');
      var partss = AssignmentsCtrl.firstday.split('-');

      var last = new Date(partss[2] + "-" + partss[1] + "-" + partss[0]);

      var lastday = new Date(last.setDate(last.getDate() - last.getDay() + 6));
      AssignmentsCtrl.lastday = $filter('date')(lastday, 'dd-MM-yyyy');

      if (AssignmentsCtrl.firstdays == AssignmentsCtrl.firstday && AssignmentsCtrl.lastdays == AssignmentsCtrl.lastday) {
        document.getElementById('currentWeek').style.display = '';
        document.getElementById('nextWeek').style.display = 'none';
        document.getElementById('lastWeek').style.display = 'none';
        AssignmentsCtrl.currentWeekDisplay = true;
        AssignmentsCtrl.nextWeekDisplay = false;
        AssignmentsCtrl.lastWeekDisplay = false;
        AssignmentsCtrl.pdfCurrent = true;
      } else {
        document.getElementById('currentWeek').style.display = 'none';
        document.getElementById('nextWeek').style.display = '';
        document.getElementById('lastWeek').style.display = 'none';
        AssignmentsCtrl.currentWeekDisplay = false;
        AssignmentsCtrl.nextWeekDisplay = true;
        AssignmentsCtrl.lastWeekDisplay = false;
        AssignmentsCtrl.pdfCurrent=false;
        var listDate = [];
        AssignmentsCtrl.listOfDates = [];
        var startDate = $filter('date')(firstday, 'yyyy-MM-dd');
        var endDate = $filter('date')(lastday, 'yyyy-MM-dd');
        var dateMove = new Date(startDate);
        var strDate = startDate;

        while (strDate < endDate) {
          var strDate = dateMove.toISOString().slice(0, 10);
          listDate.push(strDate);
          dateMove.setDate(dateMove.getDate() + 1);
        };
        for (var i = 0; i < listDate.length; i++) {
          var yo = listDate[i].split('-');
          var ffDate = yo[2] + "-" + yo[1] + "-" + yo[0];
          Assignment.find({
            filter: {
              where: {
                classId: classId,
                toDate: ffDate
              },
              include: ['class', 'subject']
            }
          }, function (responseData) {
            AssignmentsCtrl.listOfDates.push(responseData);
          })

        }
      }
    }

    AssignmentsCtrl.sub = function (classId) {
      if (status === undefined) {
        AssignmentsCtrl.subject = true;
      } else {
        AssignmentsCtrl.subject = false;
      }

    }
    //validataion
    function formValidations() {
      //total should be more then 0
      if (AssignmentsCtrl.formFields.classId == undefined)
        return 'Please Select Class  ';

      if (AssignmentsCtrl.formFields.subjectId == undefined)
        return 'Please Select Subject ';

      if (AssignmentsCtrl.formFields.toDate == undefined)
        return 'Please Select To Date';

      if (AssignmentsCtrl.formFields.fromDate == undefined)
        return 'Please Select From Date'
      if (AssignmentsCtrl.formFields.title == undefined)
        return 'Please Select Title'

      if (AssignmentsCtrl.formFields.description == undefined)
        return 'Please Select Description ';

      return undefined;
    }
    // emails sending ends

    AssignmentsCtrl.getsubject = function (dataaa) {
      if (!dataaa.subject) {
        FOsubject.findOne({ filter: { where: { id: dataaa.subjectId } } }, function (res) {
          res.FoSubjectFlag = true;
          dataaa.subject = res;
        })
      }
    }
    //pdf code
    AssignmentsCtrl.pdf = function () {
    AssignmentsCtrl.colspan = 6;
    if(AssignmentsCtrl.pdfCurrent){
    angular.element("#tableToExport").addClass('hideLastTwoColoms');
        } else {
    angular.element("#tableToExport").addClass('hideLastTwoColom');    
        }
      $timeout(function(){
      kendo.drawing
        .drawDOM("#tableToExport",
        {
          paperSize: "A4",
          margin: { top: "2cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
          scale: 0.5,
          height: 500,
          image_compression: { FAST: "FAST" }
        })
        .then(function (group) {
            kendo.drawing.pdf.saveAs(group, "ASSIGMENT.pdf");
            
    AssignmentsCtrl.colspan = 8;
    angular.element("#tableToExport").removeClass('hideLastTwoColoms');
    angular.element("#tableToExport").removeClass('hideLastTwoColom');
    AssignmentsCtrl.colspan = 8;
    $timeout(function(){
      AssignmentsCtrl.colspan =10;
    },200);
    
        });
      },500)
    }

  });
