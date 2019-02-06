'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:NoticeboardControllerCtrl
 * @description
 * # NoticeboardControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('NoticeboardController', function (configService, noticeboardService, $window, $http, $cookies, $timeout, APP_MESSAGES, toastr, generateexcelFactory, $scope, Student, $filter, Noticeboard) {
        var NoticeboardCtrl = this;
        NoticeboardCtrl.formFields = {};
        NoticeboardCtrl.editmode = false;
        NoticeboardCtrl.detailsMode = false;
        NoticeboardCtrl.viewValue = {};
        NoticeboardCtrl.schoolId = $cookies.getObject('uds').schoolId;
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Notice Board") {
                NoticeboardCtrl.roleView = roleAccess[0].RolesData[i].view;
                NoticeboardCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                NoticeboardCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }

        }
        NoticeboardCtrl.uploadFile = function (x) {
            NoticeboardCtrl.file = document.getElementById('noticeFile').files[0];
            // var date =new Date.now();
            var fd = new FormData();
            fd.append('file', NoticeboardCtrl.file);
            var uploadUrl = configService.baseUrl() + "/ImageContainers/Notices/upload";
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function (response) {
                    if (response) {
                        NoticeboardCtrl.file = configService.baseUrl() + '/ImageContainers/Notices/download/' + response.data.result[0].filename;
                    }
                }, function (error) {
                    //console.log('Error while fetching the assignment records. Error stack : ' + error);
                });
        };
        //Defaults
        NoticeboardCtrl.schoolId = $cookies.getObject('uds').schoolId;

        function Init() {
            this.getNoticeDetails = function () {
                noticeboardService.getNoticeDetailsBySchoolId(NoticeboardCtrl.schoolId).then(function (result) {
                    if (result) {
                        NoticeboardCtrl.noticeList = result;

                    }
                }, function (error) {
                    //console.log('Error while fetching the assignment records. Error stack : ' + error);
                });
            };
        }
        (new Init()).getNoticeDetails();
        //Initialize the Table Component
        $timeout(function () {
            var columnsDefs = [{
                'width': '10%'
            }, {
                'width': '10%'
            }, {
                'width': '40%'
            }, {
                'width': '10%'
            }, {
                'width': '10%'
            }, {
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
            TableEditable.init('#notice_datatable', columnsDefs);
            Metronic.init();
        }, 1000);
        //Close or Open modal
        NoticeboardCtrl.closeModal = function () {
            var modal = $('#edit-notice');
            modal.modal('hide');
            NoticeboardCtrl.viewValue.file = "";
            //ClearFields
            NoticeboardCtrl.file = "";
            NoticeboardCtrl.clearformfields();
            clearformfields();
        };
        NoticeboardCtrl.openModal = function () {
            var modal = $('#edit-notice');
            modal.modal('show');
            NoticeboardCtrl.clearformfields();
        };
        //Clear Fields
        function clearformfields() {
            NoticeboardCtrl.formFields = {};
            NoticeboardCtrl.myUpload = "";
            NoticeboardCtrl.file = "";
        }
        //Delete confirmation box
        NoticeboardCtrl.confirmCallbackMethod = function (id) {
            NoticeboardCtrl.delIndex = 0;
            for (var i = 0; i < NoticeboardCtrl.noticeList.length; i++) {
                if (NoticeboardCtrl.noticeList[i].id === id) {
                    NoticeboardCtrl.delIndex = i;
                }
            }
            deleteNotice(NoticeboardCtrl.delIndex);
        };
        // var hostname = location.hostname;
        // console.log(hostname);
        //Delete cancel box
        NoticeboardCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };
        // Add Action
        $scope.first = true;
        NoticeboardCtrl.noticeboardAction = function (invalid) {
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
                schoolId: NoticeboardCtrl.schoolId,
                title: NoticeboardCtrl.formFields.title,
                description: NoticeboardCtrl.formFields.description,
                date1: NoticeboardCtrl.formFields.date1,
                date2: NoticeboardCtrl.formFields.date2,
                file: NoticeboardCtrl.file

            };
            if (data) {
                //Check whether editmode or normal mode
                if (!NoticeboardCtrl.editmode) {
                    noticeboardService.getExistingNoticeRecords(data).then(function (result) {
                        if (result) {
                            toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                            $scope.first = !$scope.first;
                            NoticeboardCtrl.clearformfields();
                            //console.log('data already exists');
                            return;
                        }
                    }, function (result1) {
                        if (result1) {
                            noticeboardService.CreateOrUpdateNoticeboard(data).then(function (res) {
                                if (res) {
                                    (new Init()).getNoticeDetails();
                                    NoticeboardCtrl.closeModal();
                                    //Show Toast Message Success
                                    toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                                    $scope.first = !$scope.first;
                                    // NoticeboardCtrl.alertEmails(res);
                                    NoticeboardCtrl.clearformfields();
                                    NoticeboardCtrl.formFields.file = "";

                                    $timeout(function () {
                                        window.location.reload();
                                    }, 4000)
                                }
                            }, function (error) {
                                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                                $scope.first = !$scope.first;
                                //console.log('Error while Fetching the Records' + error);
                            });
                        }
                    });
                }
                else {
                    data.id = NoticeboardCtrl.editingNoticeId;
                    noticeboardService.editNotice(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getNoticeDetails();
                            //Close Modal
                            NoticeboardCtrl.closeModal();
                            //Show Toast Message Success
                            NoticeboardCtrl.clearformfields();

                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                            $scope.first = !$scope.first;
                            $window.location.reload();
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        $scope.first = !$scope.first;
                        //console.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }
        };
        //Delete Action
        var deleteNotice = function (index) {
            if (NoticeboardCtrl.noticeList) {
                noticeboardService.deleteNotice(NoticeboardCtrl.noticeList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getNoticeDetails();
                        NoticeboardCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log('Error while deleting Notices. Error Stack' + error);
                });
            }
        };
        $scope.orderByCustom = function (data) {
            var parts = data.date1.split('-');
            return new Date(parts[2], parts[1], parts[0]);
        };
        //Edit Action
        NoticeboardCtrl.editNotice = function (id) {
            NoticeboardCtrl.editIndex = 0;
            NoticeboardCtrl.editingNoticeId = id;
            Noticeboard.find({ filter: { where: { id: id } } }, function (response) {

                NoticeboardCtrl.formFields.title = response[0].title;
                NoticeboardCtrl.formFields.description = response[0].description;
                NoticeboardCtrl.formFields.edate = new Date(response[0].date1);
                NoticeboardCtrl.formFields.date1 = NoticeboardCtrl.formFields.edate;
                NoticeboardCtrl.formFields.bdate = new Date(response[0].date2);
                NoticeboardCtrl.formFields.date2 = NoticeboardCtrl.formFields.bdate;
                NoticeboardCtrl.formFields.file1 = response[0].file;

                var hostname = location.hostname;
                if (NoticeboardCtrl.formFields.file1) {
                    // NoticeboardCtrl.viewValue.file = "";
                    //  }else{
                    if (hostname == "test.studymonitor.in") {
                        NoticeboardCtrl.formFields.file = NoticeboardCtrl.formFields.file1.substring(65)

                    } else {

                        NoticeboardCtrl.formFields.file = NoticeboardCtrl.formFields.file1.substring(63)
                    }
                }
                NoticeboardCtrl.editingNoticeId = response[0].id;
                NoticeboardCtrl.setFloatLabel();
            })

            // NoticeboardCtrl.formFields.title = NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].title;
            // NoticeboardCtrl.formFields.description = NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].description;
            // NoticeboardCtrl.formFields.date1 = NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].date1;
            // NoticeboardCtrl.formFields.date2 = NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].date2;
            // NoticeboardCtrl.formFields.edate = new Date(NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].date1);
            // NoticeboardCtrl.formFields.date1 = NoticeboardCtrl.formFields.edate;
            // NoticeboardCtrl.formFields.bdate = new Date(NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].date2);
            // NoticeboardCtrl.formFields.date2 = NoticeboardCtrl.formFields.bdate;
            // var hostname = location.hostname;
            // if (hostname == "test.studymonitor.in") {
            //     // .substring(65)
            //     alert(NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].file);
            //     NoticeboardCtrl.viewValue.file1 = NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].file;
            //     NoticeboardCtrl.viewValue.file = NoticeboardCtrl.viewValue.file1.substring(65)

            // } else {

            //     NoticeboardCtrl.viewValue.file1 = NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].file;
            //     NoticeboardCtrl.viewValue.file = NoticeboardCtrl.viewValue.file1.substring(63);
            //     console.log(NoticeboardCtrl.viewValue.file);
            // }
            // NoticeboardCtrl.myUpload = NoticeboardCtrl.noticeList[NoticeboardCtrl.editIndex].file;

            //Set View Mode false
            NoticeboardCtrl.detailsMode = false;
            //Open Modal
            NoticeboardCtrl.openModal();

            $timeout(function () {


                //Enable Edit Mode
                NoticeboardCtrl.editmode = true;
            });

        };
        //Setting up float label
        NoticeboardCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=title]'));
            Metronic.setFlotLabel($('input[name=description]'));
            Metronic.setFlotLabel($('input[name=date1]'));
            Metronic.setFlotLabel($('input[name=date2]'));
        };
        //Calendar Fix @@TODO Move this to directive
        $timeout(function () {
            $('#noticedate1').on('dp.change', function () {
                NoticeboardCtrl.formFields.date1 = $(this).val();
            });
        }, 500);
        //Calendar Fix @@TODO Move this to directive
        $timeout(function () {
            $('#noticedate2').on('dp.change', function () {
                NoticeboardCtrl.formFields.date2 = $(this).val();
            });
        }, 500);
        NoticeboardCtrl.clearformfields = function () {

            NoticeboardCtrl.viewValue.file = "";
            NoticeboardCtrl.myUpload = "";
            NoticeboardCtrl.file = "";
            NoticeboardCtrl.formFields.file1 = "";
            NoticeboardCtrl.formFields.file = "";

        }
        //More Details
        NoticeboardCtrl.moreDetails = function (id) {
            NoticeboardCtrl.detailsMode = true;
            NoticeboardCtrl.openModal();
            Noticeboard.find({ filter: { where: { id: id } } }, function (response) {
                NoticeboardCtrl.viewValueData = response;
                NoticeboardCtrl.viewValueData.download = NoticeboardCtrl.viewValueData[0].file;
                console.log(NoticeboardCtrl.viewValueData.download);
                console.log(NoticeboardCtrl.viewValueData);
                $scope.fileLength = true;
                var hostname = location.hostname;

                //  hostname = 'test.studymonitor.in' ? 'NoticeboardCtrl.viewValue.file = NoticeboardCtrl.viewValue.file.substring(65)' : 'NoticeboardCtrl.viewValue.file1 =NoticeboardCtrl.viewValue.file.substring(63)'
                if (NoticeboardCtrl.viewValueData[0].file) {
                    if (hostname == "test.studymonitor.in") {

                        NoticeboardCtrl.viewValue.file = NoticeboardCtrl.viewValueData[0].file.substring(65);
                    } else {

                        NoticeboardCtrl.viewValue.file = NoticeboardCtrl.viewValueData[0].file.substring(63);
                    }
                }
            })
            // for (var i = 0; i < NoticeboardCtrl.noticeList.length; i++) {
            //     if (NoticeboardCtrl.noticeList[i].id === id) {
            //         NoticeboardCtrl.viewValue = NoticeboardCtrl.noticeList[i];
            //     }
            // }
            // console.log(NoticeboardCtrl.noticeList);
            // $scope.fileLength = false;
            // if (NoticeboardCtrl.viewValue.file.length == NoticeboardCtrl.viewValue.file.length) {




            // }

        };
        //Export to Excel
        NoticeboardCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'Notice Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        NoticeboardCtrl.printData = function () {
            var divToPrint = document.getElementById("tableToExport1");
            NoticeboardCtrl.newWin = window.open("");
            NoticeboardCtrl.newWin.document.write(divToPrint.outerHTML);
            NoticeboardCtrl.newWin.print();
            NoticeboardCtrl.newWin.close();
        }

        //End Print View
        NoticeboardCtrl.ValidateEndDate = function () {
            $("#noticedate1").change(function () {

                var startDate = document.getElementById("noticedate1").value;
                var endDate = document.getElementById("noticedate2").value;

                if ((Date.parse(endDate) < Date.parse(startDate))) {
                    alert("End date should be greater than Start date");
                    document.getElementById("noticedate1").value = "";
                }
            });

            $("#noticedate2").change(function () {

                var startDate = document.getElementById("noticedate1").value;
                var endDate = document.getElementById("noticedate2").value;

                if ((Date.parse(endDate) < Date.parse(startDate))) {
                    alert("End date should be greater than Start date");
                    document.getElementById("noticedate2").value = "";
                }
            });
        }
        NoticeboardCtrl.pdfData1 = function () {
            $timeout(function () {
                document.getElementById('pdfExport').style.display = 'none';
            }, 100);
        }
        function formValidations() {
            if (NoticeboardCtrl.formFields.title == undefined)
                return 'Please Select Title';

            if (NoticeboardCtrl.formFields.description == undefined)
                return 'Please Enter Description  ';
            if (NoticeboardCtrl.formFields.date1 == undefined)
                return 'Please Select From Date ';

            if (NoticeboardCtrl.formFields.date2 == undefined)
                return 'Please Select TO Date';

            return undefined;
        }
    });
