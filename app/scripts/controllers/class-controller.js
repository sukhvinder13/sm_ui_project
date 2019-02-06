'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ClassControllerCtrl
 * @description
 * # ClassControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ClassController', function ($scope, $log, $timeout, classService, APP_MESSAGES, $cookies, Class, $state, toastr, $window, generateexcelFactory, cfpLoadingBar, classtimetableService) {
        var ClassCtrl = this;
        ClassCtrl.formFields = {};
        ClassCtrl.editmode = false;
        ClassCtrl.detailsMode = false;
        ClassCtrl.viewValue = {};
        ClassCtrl.classList1 = [];
        ClassCtrl.classList2 = [];
        ClassCtrl.showForPdf = true;
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Class") {
                ClassCtrl.roleView = roleAccess[0].RolesData[i].view;
                ClassCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                ClassCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
            }

        }
        function init() {
            //var GetClassDetails = function () {
            ClassCtrl.schoolId = $cookies.getObject('uds').schoolId;
            classService.getClassDetails(ClassCtrl.schoolId).then(function (result) {
                if (result && result.hasOwnProperty('classes')) {
                    cfpLoadingBar.start();
                    cfpLoadingBar.inc();
                    cfpLoadingBar.set(0.3);
                    ClassCtrl.classList = result.classes;
                    var list1 = ClassCtrl.classList.length;

                    var sd1 = list1 / 2;

                    var list2 = Math.round((list1 / 2) * 100 / 100);


                    if (list2 !== 0) {
                        list2 = Math.round((list1 / 2) * 100 / 100) - 1;

                    }

                    for (var i = 0; i < list2; i++) {
                        ClassCtrl.classList1.push({ "index": i, "w": ClassCtrl.classList[i] });
                    }


                    for (var i = list2 + 1; i < ClassCtrl.classList.length; i++) {

                        ClassCtrl.classList2.push({ "index": i, "w": ClassCtrl.classList[i] });
                    }
                    ClassCtrl.staffList = result.staffs;
                    cfpLoadingBar.complete();
                }
            }, function (error) {
                if (error) {
                    //console.log('Error while fecthing class records. Error stack: ' + error);
                }
            });
            //}
            Class.find({ filter: { where: { schoolId: ClassCtrl.schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                ClassCtrl.classData = response;
                ClassCtrl.lengthClass = ClassCtrl.classData.length;
                ClassCtrl.lastRecordMinusOne = response[ClassCtrl.lengthClass - 1].setclassId;
            })
        }
        init();
        // ClassCtrl.saveSeq = function (index, id) {
        //     Class.prototype$patchAttributes({ id: id, sequenceNumber: index }, function (response) {
        //         // init();
        //     })
        // }
        /*
         * Actions - For Create a new Class
         * Actions - For Updating the existing records
         */
        ClassCtrl.CheckBoxCLick = function () {
            var getChkboxStat = document.getElementById("beforeId");

            if (getChkboxStat.checked == true) {
                document.getElementById("afterId").disabled = true;
                // document.getElementById("afterId").checked = false;
                document.getElementById('HideSequ').style.display = 'block';



            } else {
                document.getElementById("afterId").disabled = false;
                // document.getElementById("afterId").checked = false;

                document.getElementById('HideSequ').style.display = 'none';


            }

        }
        ClassCtrl.CheckBoxCLick1 = function () {
            var getChkboxStat = document.getElementById("afterId");
            if (getChkboxStat.checked == true) {

                document.getElementById("beforeId").disabled = true;
                // document.getElementById("beforeId").checked = false;
                document.getElementById('HideSequ').style.display = 'block';

            } else {
                document.getElementById("beforeId").disabled = false;
                document.getElementById('HideSequ').style.display = 'none';
            }

        }
        $scope.first = true;
        ClassCtrl.classAction = function (invalid) {
            var message = formValidations();
            if (message != undefined && message.trim().length > 1) {
                alert(message);
                return;
            }
            $scope.first = !$scope.first;

            if (invalid) {
                return;
            }

            if (ClassCtrl.formFields.sectionName == undefined || ClassCtrl.formFields.sectionName == null || ClassCtrl.formFields.sectionName == "") {
                ClassCtrl.formFields.sectionName = " ";
            }
            if (!ClassCtrl.editmode) {
                var checkBox1 = document.getElementById("beforeId");
                var saveSeqStatus;
                if (checkBox1.checked == true) {
                    saveSeqStatus = "before";

                } else {

                }

                var checkBox2 = document.getElementById("afterId");
                if (checkBox2.checked == true) {
                    saveSeqStatus = "after";
                } else {

                }
                var sequence = saveSeqStatus;
                var setclassId = ClassCtrl.formFields.setclassId;
                var saveSequence;
                if (sequence == "before") {
                    if (ClassCtrl.classData.length == 0) {
                        saveSequence = 1;
                    } else {
                        for (var i = 0; i < ClassCtrl.classData.length; i++) {
                            if (setclassId == ClassCtrl.classData[i].id) {

                                saveSequence = ClassCtrl.classData[i].sequenceNumber;
                                Class.find({ filter: { where: { sequenceNumber: { between: [ClassCtrl.classData[i].sequenceNumber, ClassCtrl.classData.length] } } } }, function (response) {
                                    for (var i = 0; i < response.length; i++) {
                                        Class.prototype$patchAttributes({ id: response[i].id, sequenceNumber: response[i].sequenceNumber + 1 }, function (updatedData) {
                                        })
                                    }
                                })

                            }
                        }
                    }

                } else if (sequence == "after") {
                    if (ClassCtrl.classData.length == 0) {
                        saveSequence = 1;
                    } else {
                        for (var i = 0; i < ClassCtrl.classData.length; i++) {
                            if (setclassId == ClassCtrl.classData[i].id) {
                                saveSequence = ClassCtrl.classData[i].sequenceNumber + 1;
                                Class.find({ filter: { where: { sequenceNumber: { between: [saveSequence, ClassCtrl.classData.length] } } } }, function (response) {
                                    for (var i = 0; i < response.length; i++) {
                                        Class.prototype$patchAttributes({ id: response[i].id, sequenceNumber: response[i].sequenceNumber + 1 })
                                    }
                                })
                            }
                        }
                    }
                }
                else if (sequence == undefined) {
                    sequence = "";
                    saveSequence = ClassCtrl.lengthClass + 1;
                    setclassId = ClassCtrl.lastRecordMinusOne;


                }
            } else {
                var checkBox1 = document.getElementById("beforeId");
                var saveSeqStatus;
                if (checkBox1.checked == true) {
                    saveSeqStatus = "before";
                } else {

                }

                var checkBox2 = document.getElementById("afterId");
                if (checkBox2.checked == true) {
                    saveSeqStatus = "after";

                } else {

                }
                var sequence = saveSeqStatus;
                var setclassId = ClassCtrl.formFields.setclassId;
                var saveSequence;
                var editDataId;

                if (sequence == "before") {

                    Class.find({ filter: { where: { id: setclassId } } }, function (response) {
                        saveSequence = response[0].sequenceNumber;
                        if (ClassCtrl.getsequenceNumber < saveSequence) {
                            Class.find({ filter: { where: { sequenceNumber: { between: [ClassCtrl.getsequenceNumber, saveSequence - 1] } } } }, function (res) {
                                for (var i = 0; i < res.length; i++) {
                                    if (res[i].sequenceNumber !== ClassCtrl.getsequenceNumber) {

                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: res[i].sequenceNumber - 1 }, function (editClassD1) {
                                        })
                                    } else {
                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: saveSequence - 1 }, function (editClassDs) {
                                        })
                                    }

                                }
                            })
                        } else if (ClassCtrl.getsequenceNumber > saveSequence) {
                            Class.find({ filter: { where: { sequenceNumber: { between: [saveSequence, ClassCtrl.getsequenceNumber] } } } }, function (res) {
                                for (var i = 0; i < res.length; i++) {
                                    if (res[i].sequenceNumber !== ClassCtrl.getsequenceNumber) {

                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: res[i].sequenceNumber + 1 }, function (editClassD1) {
                                        })
                                    } else {
                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: saveSequence }, function (editClassDs) {
                                        })
                                    }

                                }
                            })
                        }
                    })
                    editDataId = ClassCtrl.classId

                } else if (sequence = "after") {

                    Class.find({ filter: { where: { id: setclassId } } }, function (response) {
                        saveSequence = response[0].sequenceNumber;
                        if (ClassCtrl.getsequenceNumber < saveSequence) {
                            Class.find({ filter: { where: { sequenceNumber: { between: [ClassCtrl.getsequenceNumber, saveSequence] } } } }, function (res) {
                                for (var i = 0; i < res.length; i++) {
                                    if (res[i].sequenceNumber !== ClassCtrl.getsequenceNumber) {

                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: res[i].sequenceNumber - 1 }, function (editClassD1) {
                                        })
                                    } else {
                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: saveSequence }, function (editClassDs) {
                                        })
                                    }

                                }

                            })
                        } else if (ClassCtrl.getsequenceNumber > saveSequence) {
                            Class.find({ filter: { where: { sequenceNumber: { between: [saveSequence + 1, ClassCtrl.getsequenceNumber] } } } }, function (res) {
                                for (var i = 0; i < res.length; i++) {
                                    if (res[i].sequenceNumber !== ClassCtrl.getsequenceNumber) {

                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: res[i].sequenceNumber + 1 }, function (editClassD11) {
                                        })
                                    } else {
                                        Class.prototype$patchAttributes({ id: res[i].id, sequenceNumber: saveSequence + 1 }, function (editClassDs1) {
                                        })
                                    }

                                }

                            })
                        }
                    })

                }
            }
            var checkBox = document.getElementById("checkMeOut");
            var saveMsgStatus;
            if (checkBox.checked == true) {
                saveMsgStatus = "Yes";
            } else {
                saveMsgStatus = "No";
            }

            var data = {
                schoolId: ClassCtrl.schoolId,
                className: ClassCtrl.formFields.className,
                sectionName: ClassCtrl.formFields.sectionName,
                staffId: ClassCtrl.formFields.staffName,
                sendMessage: ClassCtrl.formFields.sendMessage,
                msgStatus: saveMsgStatus,
                sequenceNumber: saveSequence,
                setSeq: sequence,
                setclassId: setclassId
            };
            if (data) {
                //Check whether editmode or normal mode
                if (!ClassCtrl.editmode) {
                    classService.findClassRecord(data).then(function (res) {
                        if (res) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            $scope.first = !$scope.first;

                        }
                    }, function (res1) {
                        if (res1) {
                            classService.classAdd(data).then(function (result) {
                                if (result) {
                                    cfpLoadingBar.start();
                                    //On Successfull refill the data list
                                    init();
                                    //Close Modal
                                    ClassCtrl.closeModal();

                                    ClassCtrl.class = result;

                                    //generate time table after creating the class
                                    /* ==================== Generate Time Table ======================== */
                                    classtimetableService.getSchoolTimetableBySchoolId(ClassCtrl.schoolId).then(function (result) {
                                        if (result && result.timetables.length === 0) {
                                            toastr.error('Data Error', 'Please Generate the School TimeTable First and Then Come Back to Class TimeTables');
                                        } else {
                                            ClassCtrl.schoolTimetable = result;
                                            //Get Working Days list
                                            classtimetableService.getWorkingDaysBySchoolId(ClassCtrl.schoolId).then(function (result) {
                                                if (result) {
                                                    ClassCtrl.workingDaysList = result;
                                                    checkClassTimeTable(ClassCtrl.schoolTimetable.timetables);
                                                }
                                            }, function (error) {
                                                if (error) {
                                                    toastr.error('Data Error', 'Please add working days');
                                                }
                                            });
                                        }
                                    }, function (error) {
                                        console.log('Error while fetching Time table records.' + error);
                                    });

                                    function checkClassTimeTable(timetables) {
                                        classtimetableService.getClassTimeTableByClassId(ClassCtrl.class.id).then(function (result) {
                                            if (result && result.schedules.length === 0) {
                                                createSchedules(timetables);
                                            }
                                            else {
                                                toastr.warning('Data Info', 'Data already exists');
                                            }
                                        }, function (error) {
                                            console.log('Error while fetching the Class List schedules.' + error);
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
                                        if (ClassCtrl.workingDaysList && ClassCtrl.workingDaysList.length > 0) {
                                            ClassCtrl.workingDaysList.forEach(function (v) {
                                                var data = {
                                                    timetableId: timetableId,
                                                    workingDayId: v.id,
                                                    classId: ClassCtrl.class.id
                                                };
                                                classtimetableService.createSchedule(data).then(function (res) {
                                                    if (res) {
                                                        //toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                                    }
                                                    window.location.reload();
                                                }, function (err) {
                                                    console.log('Error while fetching schedule records. Error stack' + err);
                                                });
                                            });
                                        }
                                    }
                                    /* ==================== Generate Time Table End ==================== */

                                    //Show Toast Message Success
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                    init();
                                    cfpLoadingBar.complete();
                                    $scope.first = !$scope.first;

                                }
                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                //console.log('Error while creating or updating records. Error stack' + error);
                            });
                        }
                    });
                }
                else {
                    data.classId = ClassCtrl.classId;
                    classService.classUpdate(data).then(function (response) {
                        if (response) {
                            //On successfull refill the data list
                            // init();
                            //Close Modal
                            ClassCtrl.closeModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                            init();
                            $scope.first = !$scope.first;
                            $timeout(function () {

                                window.location.reload();

                            }, 3000);

                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    });
                }
            }
        };

        //Delete Action
        var deleteClass = function (index) {
            if (ClassCtrl.classList) {
                classService.deleteClass(ClassCtrl.classList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        init();
                        ClassCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    //console.log('Error while deleting class. Error Stack' + error);
                });
            }
        };
        //Edit Action
        ClassCtrl.editClass = function (index) {
            ClassCtrl.formFields.className = ClassCtrl.classList[index].className;
            ClassCtrl.formFields.sectionName = ClassCtrl.classList[index].sectionName;
            ClassCtrl.formFields.staffName = ClassCtrl.classList[index].staffId;
            ClassCtrl.formFields.sendMessage = ClassCtrl.classList[index].sendMessage;
            // ClassCtrl.formFields.setSeq = ClassCtrl.classList[index].setSeq;
            // ClassCtrl.formFields.beforeCheck = ClassCtrl.classList[index].setSeq;
            // ClassCtrl.formFields.afterCheck = ClassCtrl.classList[index].setSeq;
            ClassCtrl.formFields.setclassId = ClassCtrl.classList[index].setclassId;
            ClassCtrl.getsequenceNumber = ClassCtrl.classList[index].sequenceNumber;
            ClassCtrl.classId = ClassCtrl.classList[index].id;

            if (ClassCtrl.classList[index].setSeq === "after") {
                ClassCtrl.after = "checked";
                document.getElementById('HideSequ').style.display = 'block';
                document.getElementById("beforeId").disabled = true;


            }
            if (ClassCtrl.classList[index].setSeq === "before") {
                ClassCtrl.before = "checked";
                document.getElementById('HideSequ').style.display = 'block';
                document.getElementById("afterId").disabled = true;


            }

            //Set View Mode false
            ClassCtrl.detailsMode = false;
            //Open Modal
            ClassCtrl.openModal();

            $timeout(function () {

                ClassCtrl.setFloatLabel();
                //Enable Edit Mode
                ClassCtrl.editmode = true;
            });

        };

        //Setting up float label
        ClassCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=sectionname]'));
            Metronic.setFlotLabel($('input[name=classname]'));
            Metronic.setFlotLabel($('input[name=staffname]'));
        };

        //Close or Open modal
        ClassCtrl.closeModal = function () {
            var modal = $('#edit-class');
            modal.modal('hide');
            // location.reload();

            //ClearFields
            clearformfields();
        };
        ClassCtrl.openModal = function () {
            var modal = $('#edit-class');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            ClassCtrl.formFields = {};
        }

        //Delete confirmation box
        ClassCtrl.confirmCallbackMethod = function (index) {
            deleteClass(index);
        };
        //Delete cancel box
        ClassCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };
        //More Details
        ClassCtrl.moreDetails = function (index) {
            ClassCtrl.detailsMode = true;
            ClassCtrl.openModal();
            ClassCtrl.viewValue = ClassCtrl.classList[index];
        };
        //Export to Excel
        ClassCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        ClassCtrl.printData = function () {
            var divToPrint = document.getElementById("classprintTable");
            ClassCtrl.newWin = window.open("");
            ClassCtrl.newWin.document.write(divToPrint.outerHTML);
            ClassCtrl.newWin.print();
            ClassCtrl.newWin.close();
        }
        function formValidations() {

            //total should be more then 0
            if (ClassCtrl.formFields.className == undefined)
                return 'Select Class Name ';
            // //SectinNAme to be selected
            // if (ClassCtrl.formFields.sectionName == undefined)
            //     return 'Select Section Name ';
            //selectTeacher
            if (ClassCtrl.formFields.staffName == undefined)
                return 'Select Teacher Name ';


            if (ClassCtrl.classData.length > 0) {
                var afterId1 = document.getElementById('afterId');
                var beforeId1 = document.getElementById('beforeId');
                if (beforeId1.checked == false && afterId1.checked == false) {
                    return 'Select Set Seq ';

                }
                if (ClassCtrl.formFields.setclassId == undefined) {
                    return 'Select Set Class Name ';
                }

            }

            return undefined;
        }
        ClassCtrl.pdf = function () {
            kendo.drawing
                .drawDOM("#classprintTable",
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
                        kendo.drawing.pdf.saveAs(group, "CLASS.pdf");
                    }, 1000);
                });
            $timeout(function () {
                ClassCtrl.showForPdf = true;
            }, 1000)
        }
    });