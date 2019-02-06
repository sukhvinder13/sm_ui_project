'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ClasstimetableControllerCtrl
 * @description
 * # ClasstimetableControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ClasstimetableController', function (classtimetableService, $cookies, $timeout, toastr, generateexcelFactory, APP_MESSAGES, Schedule) {
        var ClasstimetableCtrl = this;
        ClasstimetableCtrl.loginId = $cookies.getObject('uds').id;
        ClasstimetableCtrl.classId = $cookies.getObject('uds').classId;
        ClasstimetableCtrl.role = $cookies.get('role');
        ClasstimetableCtrl.schoolId = $cookies.getObject('uds').schoolId;
        if (ClasstimetableCtrl.role == 'Student') {
            ClasstimetableCtrl.formFields={showClassId : ClasstimetableCtrl.classId};
            $timeout(function () {
                ClasstimetableCtrl.showSchedules(false);
            }, 3000);
        }
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
        
          for(var i = 0; i<roleAccess[0].RolesData.length;i++){
              if(roleAccess[0].RolesData[i].name === "Time Table"){
                ClasstimetableCtrl.roleView = roleAccess[0].RolesData[i].view;
                ClasstimetableCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                ClasstimetableCtrl.roledelete = roleAccess[0].RolesData[i].delete;
              }
              
          }
        function Init() {

            this.getClasstimetableDetails = function () {
                classtimetableService.getClasstimetableDetailsBySchoolId(ClasstimetableCtrl.schoolId).then(function (result) {
                    if (result) {
                        ClasstimetableCtrl.timetableList = result;
                    }
                }, function (error) {
                });
            };
           
            this.getClassDetails = function () {
                classtimetableService.getClassDetailsBySchoolId(ClasstimetableCtrl.schoolId, ClasstimetableCtrl.role, ClasstimetableCtrl.loginId).then(function (result) {
                    if (result) {
                        if (Array.isArray(result)) {
                            var newArray = result.filter(function (thing, index, self) {
                                return self.findIndex(function (t) {
                                    return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                                }) === index;
                            });
                            ClasstimetableCtrl.classList = newArray;
                        }
                    }
                }, function (error) {
                });
            };
        }
        (new Init()).getClasstimetableDetails();
        (new Init()).getClassDetails();
        //Initialize the Table Component
        $timeout(function () {
            var columnsDefs = [null, null, null, {
                'width': '30%'
            }, null, null, {
                    'orderable': false,
                    'width': '10%',
                    'targets': 0
                }, {
                    'orderable': false,
                    'width': '10%',
                    'targets': 0
                }, {
                    'orderable': false,
                    'width': '10%',
                    'targets': 0
                }];
            TableEditable.init('#timetable_datatable', columnsDefs);
            Metronic.init();
        });

        //Close or Open modal
        ClasstimetableCtrl.closeModal = function () {
            var modal = $('#edit-timetable');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        ClasstimetableCtrl.openModal = function () {
            var modal = $('#edit-timetable');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            ClasstimetableCtrl.formFields = {};
        }

        /* ==================== Generate Time Table ======================== */
        ClasstimetableCtrl.timetableAction = function (invalid) {
            if (invalid) {
                return;
            }
            classtimetableService.getSchoolTimetableBySchoolId(ClasstimetableCtrl.schoolId).then(function (result) {
                if (result && result.timetables.length === 0) {
                    toastr.error('Data Error', 'Please Generate the School TimeTable First and Then Come Back to Class TimeTables');
                }
                else {
                    ClasstimetableCtrl.schoolTimetable = result;
                    //Get Working Days list
                    classtimetableService.getWorkingDaysBySchoolId(ClasstimetableCtrl.schoolId).then(function (result) {
                        if (result) {
                            ClasstimetableCtrl.workingDaysList = result;
                            checkClassTimeTable(ClasstimetableCtrl.schoolTimetable.timetables);
                        }
                    }, function (error) {
                        if (error) {
                            toastr.error('Data Error', 'Please add working days');
                        }
                    });
                }
            }, function (error) {
            });
        };
        function checkClassTimeTable(timetables) {
            classtimetableService.getClassTimeTableByClassId(ClasstimetableCtrl.formFields.classId).then(function (result) {
                if (result && result.schedules.length === 0) {
                    createSchedules(timetables);
                }
                else {
                    toastr.warning('Data Info', 'Data already exists');
                }
            }, function (error) {
            });
        }
        function createSchedules(timetables) {
            if (timetables && timetables.length > 0) {
                timetables.forEach(function (v) {
                    addSchedule(v.id);
                });
            }
        }
        function addSchedule(timetableId) {
            if (ClasstimetableCtrl.workingDaysList && ClasstimetableCtrl.workingDaysList.length > 0) {
                ClasstimetableCtrl.workingDaysList.forEach(function (v) {
                    var data = {
                        timetableId: timetableId,
                        workingDayId: v.id,
                        classId: ClasstimetableCtrl.formFields.classId
                    };
                    classtimetableService.createSchedule(data).then(function (res) {
                        if (res) {
                            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                        }
                    }, function (err) {
                    });
                });
            }
        }
        /* ==================== Generate Time Table End ==================== */

        /* ==================== Schedules =================================*/
        ClasstimetableCtrl.showSchedules = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: ClasstimetableCtrl.schoolId,
                classId: ClasstimetableCtrl.formFields.showClassId
            };
            classtimetableService.getClassTimeTablesList(data).then(function (result) {
                if (result) {
                    ClasstimetableCtrl.timetables = result;
                }
            }, function (error) {
            });
        };
        ClasstimetableCtrl.saveSchedule = function (data) { 
            for(var i=0;i<ClasstimetableCtrl.timetables.length;i++){
                for(var q=0;q<ClasstimetableCtrl.timetables[i].schedules.length;q++){
                    Schedule.prototype$patchAttributes({ id: ClasstimetableCtrl.timetables[i].schedules[q].id, subjectId: ClasstimetableCtrl.timetables[i].schedules[q].subjectId });        
                }
            }
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);

        };
        /* ==================== Schedules end =============================*/
        //Delete confirmation box
        ClasstimetableCtrl.confirmCallbackMethod = function () {
            ClasstimetableCtrl.delete();
        };
        //Delete cancel box
        ClasstimetableCtrl.confirmCallbackCancel = function () {

            return false;
        };
        //Delete Action
        ClasstimetableCtrl.delete = function () {
            classtimetableService.deleteSchedules(ClasstimetableCtrl.formFields.showClassId).then(function (result) {
                if (result) {
                    //Show Toast Message Success
                    toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                }
            }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                //console.log('Error while deleting Records. Error Stack' + error);
            });

        };
        //Export to Excel
        ClasstimetableCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        ClasstimetableCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable1");
            ClasstimetableCtrl.newWin = window.open("");
            ClasstimetableCtrl.newWin.document.write(divToPrint.outerHTML);
            ClasstimetableCtrl.newWin.print();
            ClasstimetableCtrl.newWin.close();
        }

        //End Print View
         ClasstimetableCtrl.reset = function () {
            for (var i = 0; i < ClasstimetableCtrl.timetables.length; i++) {
                for (var r = 0; r < ClasstimetableCtrl.timetables[i].schedules.length; r++) {
                    ClasstimetableCtrl.timetables[i].schedules[r].subjectId = "";
                }
            }
        }
        ClasstimetableCtrl.mouseEvent =function(){
            document.getElementById('saveId').style.display='';
            document.getElementById('editId').style.display='none';

            document.getElementById('mouseEvent').style.pointerEvents='auto';
        }
        ClasstimetableCtrl.disablemouseEvent =function(){
            document.getElementById('saveId').style.display='none';
            document.getElementById('editId').style.display='';
            document.getElementById('mouseEvent').style.pointerEvents='none';
        }
        ClasstimetableCtrl.pdf = function () {
            angular.element("#mouseEvent").addClass('mouseEvent');
            kendo.drawing
              .drawDOM("#printTable",
              {
                paperSize: "A4",
                margin: { top: "1cm", bottom: "1cm", left: "6cm", right: "0cm" },
                scale: 0.5,
                height: 500,
                image_compression: { FAST: "FAST" }
              })
              .then(function (group) {
                // group.children[0] = group.children[group.children.length - 1]
                // group.children.splice(1);
                $timeout(function () {
                  kendo.drawing.pdf.saveAs(group, "CLASS_TIMETABLE.pdf");
                  angular.element("#mouseEvent").removeClass('mouseEvent');
                }, 1000);
              });
          }
    });
