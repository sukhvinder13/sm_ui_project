'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:SchooltimetableControllerCtrl
 * @description
 * # SchooltimetableControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('SchooltimetableController', function (schooltimetableService, $cookies, generateexcelFactory, $scope, $timeout, $compile, toastr, APP_MESSAGES) {
        var SchooltimetableCtrl = this;

        //Defaults
        SchooltimetableCtrl.calendarEvent = [];
        SchooltimetableCtrl.formFields = {};
        SchooltimetableCtrl.editmode = false;
        SchooltimetableCtrl.detailsMode = false;
        SchooltimetableCtrl.viewValue = {};
        // $timeout(function () {
        //     $('#starttimepicker').datetimepicker({
        //         format: 'HH:mm'
        //     }, 500);
        //     $('#endtimepicker').datetimepicker({
        //         format: 'HH:mm'
        //     }, 500);
        //     //Initialize metronic
        //     Metronic.init();
        // });
        SchooltimetableCtrl.schoolId = $cookies.getObject('uds').schoolId;
       
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "School Timetable") {
                SchooltimetableCtrl.roleView = roleAccess[0].RolesData[i].view;
                SchooltimetableCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                SchooltimetableCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }

        }
        /*
         * Controller initialize
         */
        function Init() {
            this.getTimetable = function () {
                schooltimetableService.getSchoolTimetableById(SchooltimetableCtrl.schoolId).then(function (result) {
                    if (result) {
                        SchooltimetableCtrl.timetableList = result;

                        angular.forEach(SchooltimetableCtrl.timetableList, function (v, i) {
                            SchooltimetableCtrl.timetableList[i].startTime = new Date(v.startTime);
                            SchooltimetableCtrl.timetableList[i].endTime = new Date(v.endTime);
                        });

                        //Change the calendar config for start and end timings of the school
                        // var totalRecords = SchooltimetableCtrl.timetableList.length;
                        // SchooltimetableCtrl.calendarConfig.calendar.minTime = moment(SchooltimetableCtrl.timetableList[0].startTime).format('HH:mm:ss');
                        // SchooltimetableCtrl.calendarConfig.calendar.maxTime = moment(SchooltimetableCtrl.timetableList[totalRecords - 1].endTime).format('HH:mm:ss');
                        addEvents();
                    }
                });
            };
        }
        (new Init()).getTimetable();
        //Close or Open modal
        SchooltimetableCtrl.closeModal = function () {
            var modal = $('#edit-Schooltimetable');
            modal.modal('hide');
            //ClearFields
            clearformfields();
        };
        SchooltimetableCtrl.openModal = function () {
            var modal = $('#edit-Schooltimetable');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            SchooltimetableCtrl.formFields = {};
        }
        //Delete confirmation box
        SchooltimetableCtrl.confirmCallbackMethod = function (index) {
            deleteTimetable(index);
        };
        //Delete cancel box
        SchooltimetableCtrl.confirmCallbackCancel = function () {
            return false;
        };

        //Event click
        SchooltimetableCtrl.calendarEventClick = function (date, jsEvent, view) {
        };
        //Render a calendar
        SchooltimetableCtrl.calendarRenderEvent = function (event, element, view) {
            var template = '<a class="btn btn-circle btn-icon-only red delete" href="javascript:void(0);"><i class="icon-trash"></i></a>';
            element.append(template);
            element.find('.delete').bind('click', function () {
                SchooltimetableCtrl.deleteCalendarEvent(event);
                return false;
            });
            $compile(element)($scope);
        };
        //Calendar Configurations
        SchooltimetableCtrl.calendarConfig = {
            calendar: {
                height: 500,
                editable: false,
                defaultView: 'agendaDay',
                minTime: '6:00:00',
                maxTime: '22:00:00',
                eventClick: SchooltimetableCtrl.calendarEventClick,
                //eventRender: SchooltimetableCtrl.calendarRenderEvent
            }
        };
        //Add List of events to a calendar
        var addEvents = function () {
            //timetableSources
            if (SchooltimetableCtrl.timetableList && SchooltimetableCtrl.timetableList.length > 0) {
                var todayDate = new Date();
                angular.forEach(SchooltimetableCtrl.timetableList, function (v, i) {
                    SchooltimetableCtrl.calendarEvent.push({
                        "title": v.title + ' - ' + v.duration + ' Minutes',
                        "start": new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), v.startTime.getHours(), v.startTime.getMinutes()),
                        "end": new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), v.endTime.getHours(), v.endTime.getMinutes()),
                        "allDay": false,
                        "color": getColorCode(v.duration, v.title)
                    });
                    if (i) { }
                });
            }
        };
        //Get the different color code depends on the type of title or duration
        //As of Now - Duration less than 20 and title contains lunch
        var getColorCode = function (duration, title) {

            if ((parseInt(duration) <= 20) || (title.toLowerCase().indexOf('lunch') > -1)) {
                return "#EC7063";
            }
            return "#26a69a";
        };
        //Binding the events to Calendar Model
        SchooltimetableCtrl.eventSources = [SchooltimetableCtrl.calendarEvent];
        // Add Action
        SchooltimetableCtrl.TimetableAction = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: SchooltimetableCtrl.schoolId,
                title: SchooltimetableCtrl.formFields.title,
                startTime: SchooltimetableCtrl.formFields.startTime,
                endTime: SchooltimetableCtrl.formFields.endTime,
                duration: SchooltimetableCtrl.formFields.duration,
                attendance: SchooltimetableCtrl.formFields.attendance
            };
            if (data) {
                //Check whether editmode or normal mode
                if (!SchooltimetableCtrl.editmode) {
                    schooltimetableService.getExistingSchoolTimetableRecords(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            return;
                        }
                    }, function (result1) {
                        if (result1) {
                            schooltimetableService.createSchoolTimetableRecords(data).then(function (res) {
                                if (res) {
                                    (new Init()).getTimetable();
                                    SchooltimetableCtrl.closeModal();
                                    //Show Toast Message Success
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                }

                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                //console.log('Error while Fetching the Records' + error);
                            });
                        }
                    });
                }
                else {
                    data.id = SchooltimetableCtrl.editingTimetableId;
                    schooltimetableService.editTimetable(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getTimetable();
                            //Close Modal
                            SchooltimetableCtrl.closeModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }
        };
        //Delete Action
        var deleteTimetable = function (index) {
            if (SchooltimetableCtrl.timetableList) {
                schooltimetableService.deleteTimetable(index).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getTimetable();
                        SchooltimetableCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting Assignment. Error Stack' + error);
                });
            }
        };
        //Edit Action
        SchooltimetableCtrl.editTimetable = function (index) {

            var index = index;
            for (var i = 0; i < SchooltimetableCtrl.timetableList.length; i++) {
                if (index == SchooltimetableCtrl.timetableList[i].id) {
                    SchooltimetableCtrl.formFields.title = SchooltimetableCtrl.timetableList[i].title;
                    SchooltimetableCtrl.formFields.startTime = SchooltimetableCtrl.timetableList[i].startTime;
                    SchooltimetableCtrl.formFields.endTime = SchooltimetableCtrl.timetableList[i].endTime;
                    SchooltimetableCtrl.formFields.duration = SchooltimetableCtrl.timetableList[i].duration;
                    SchooltimetableCtrl.formFields.attendance = SchooltimetableCtrl.timetableList[i].attendance;
                    SchooltimetableCtrl.editingTimetableId = SchooltimetableCtrl.timetableList[i].id;
                    //Set View Mode false
                    SchooltimetableCtrl.detailsMode = false;
                    //Open Modal
                    SchooltimetableCtrl.openModal();

                    $timeout(function () {

                        SchooltimetableCtrl.setFloatLabel();
                        //Enable Edit Mode
                        SchooltimetableCtrl.editmode = true;
                    });
                }
            }


        };
        //Setting up float label
        SchooltimetableCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=title]'));
            Metronic.setFlotLabel($('input[name=startTime]'));
            Metronic.setFlotLabel($('input[name=endTime]'));
            Metronic.setFlotLabel($('input[name=attendance]'));
        };
        SchooltimetableCtrl.duration = function () {
            // function convertToDateTime(time) {
            //     var currentDT = new Date();
            //     var hours = time.split(':')[0];
            //     var minutes = time.split(':')[1];
            //     return currentDT.setHours(hours, minutes);
            // }
            // var startTime = new Date(convertToDateTime(SchooltimetableCtrl.formFields.startTime));
            // var endTime = new Date(convertToDateTime(SchooltimetableCtrl.formFields.endTime));
            // var duration = ((startTime - endTime)/ 60000);
            SchooltimetableCtrl.formFields.duration = ((SchooltimetableCtrl.formFields.endTime) - (SchooltimetableCtrl.formFields.startTime)) / 60000;
        };
        $timeout(function () {
            $('#starttimepicker').on('dp.change', function () {
                SchooltimetableCtrl.formFields.startTime = $(this).val();
            });
        }, 500);
        $timeout(function () {
            $('#endtimepicker').on('dp.change', function () {
                SchooltimetableCtrl.formFields.endTime = $(this).val();
            });
        }, 500);
        //Export to Excel
        SchooltimetableCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        SchooltimetableCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            SchooltimetableCtrl.newWin = window.open("");
            SchooltimetableCtrl.newWin.document.write(divToPrint.outerHTML);
            SchooltimetableCtrl.newWin.print();
            SchooltimetableCtrl.newWin.close();
        }

        //End Print View
    });
