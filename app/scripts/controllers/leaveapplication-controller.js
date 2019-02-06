'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:LeaveapplicationControllerCtrl
 * @description
 * # LeaveapplicationControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('LeaveapplicationController', function (leaveapplicationService, $cookies, $timeout, $filter, toastr, APP_MESSAGES, generateexcelFactory, Leave, cfpLoadingBar, $scope) {
        var LeaveCtrl = this;
        LeaveCtrl.leavesend = [];
        LeaveCtrl.LeaveRequestList = [];
        LeaveCtrl.schoolId = $cookies.getObject('uds').schoolId;
        LeaveCtrl.loginId = $cookies.getObject('uds').id;
        LeaveCtrl.classId = $cookies.getObject('uds').classId;
        LeaveCtrl.role = $cookies.get('role');
        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Leave") {
                LeaveCtrl.roleView = roleAccess[0].RolesData[i].view;
                LeaveCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                LeaveCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }
            else if (roleAccess[0].RolesData[i].name === "Leave Approval") {
                LeaveCtrl.LeaveApprovalroleView = roleAccess[0].RolesData[i].view;
                LeaveCtrl.LeaveApprovalroleEdit = roleAccess[0].RolesData[i].edit;
                LeaveCtrl.LeaveApprovalroledelete = roleAccess[0].RolesData[i].delete;
            }

        }
        LeaveCtrl.myFunc = function (Approval) {
            LeaveCtrl.count = 1;
            LeaveCtrl.count += Approval.clickCount;
            Leave.upsert({ id: Approval.id, status: "Approved", clickCount: LeaveCtrl.count });
            $timeout(function () {
                (new Init()).getLeaveRequestList();
            }, 700);
            // $scope.showTravel();
        };
        LeaveCtrl.myFunc1 = function (Approval) {
            LeaveCtrl.count = 1;
            LeaveCtrl.count += Approval.clickCount;
            Leave.upsert({ id: Approval.id, status: "Rejected", clickCount: LeaveCtrl.count });
            $timeout(function () {
                (new Init()).getLeaveRequestList();
            }, 700);
            // $scope.showTravel();
        };
        function Init() {
            this.getLeaveList = function () {
                leaveapplicationService.getLeaveDetailsByloginId(LeaveCtrl.loginId).then(function (result) {
                    if (result) {
                        LeaveCtrl.LeaveList = result;
                        console.log(LeaveCtrl.LeaveList);
                    }
                }, function (error) {
                    //console.log.log('Error while fetching library records. Error stack : ' + error);
                });
            };
            this.getLeaveRequestList = function () {
                leaveapplicationService.getLeaveDetailsByRequesterId(LeaveCtrl.loginId).then(function (result) {
                    if (result) {
                        cfpLoadingBar.start();
                        LeaveCtrl.LeaveRequestList = result;
                        cfpLoadingBar.complete();
                    }
                }, function (error) {
                    //console.log.log('Error while fetching library records. Error stack : ' + error);
                });
            };
            // this.getLeaveRequestList = function () {
            //     leaveapplicationService.LeaveSend(LeaveCtrl.loginId).then(function (result) {
            //         if (result) {
            //             result.forEach(function (result) {
            //                 //console.log.log(result.leaveId);
            //                 leaveapplicationService.getdetailedLeave(result.leaveId).then(function (result1) {
            //                     if (result1) {
            //                         //console.log("105"+JSON.stringify(result1))  ;
            //                         LeaveCtrl.LeaveRequestList.push(result1);
            //                         //console.log.log(LeaveCtrl.LeaveRequestList);

            //                     }
            //                 });
            //             });
            //         }
            //     }, function (error) {
            //         //console.log.log('Error while fetching the records. Error stack : ' + error);
            //     });
            // };
            this.getAdminDetails = function () {
                leaveapplicationService.getAdminDetailsBySchoolId(LeaveCtrl.schoolId, LeaveCtrl.role, LeaveCtrl.loginId).then(function (result) {
                    if (result) {
                        LeaveCtrl.adminList = result;
                        //Passing data to treeData
                        //formatAdminDataToTree(LeaveCtrl.adminList);
                    }
                }, function (error) {
                    //console.log.log('Error while fetching the Admin records. Error stack : ' + error);
                });
            };
        }
        $scope.sortComment = function(comment) {
            var date = new Date(comment.date1);
            return date;
        };
        (new Init()).getLeaveList();
        (new Init()).getAdminDetails();
        (new Init()).getLeaveRequestList();
        //Initialize the Table Component

        // Add Action
        LeaveCtrl.leaveAction = function (invalid) {
            if (invalid) {
                return;
            }
            var data = {
                schoolId: LeaveCtrl.schoolId,
                description: LeaveCtrl.formFields.description,
                date1: LeaveCtrl.formFields.date1,
                date2: LeaveCtrl.formFields.date2,
                loginId: LeaveCtrl.loginId,
                reporterId: LeaveCtrl.formFields.reporterId,
                status: "Pending",
                classId: LeaveCtrl.classId,
                type: LeaveCtrl.role,
                clickCount: 0

            };
            if (data) {
                //Check whether editmode or normal mode
                if (!LeaveCtrl.editmode) {
                    // leaveapplicationService.getExistingLeaves(data).then(function (result) {
                    //     if (result) {
                    //         toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                    //         //console.log.log('data already exists');
                    //         return;
                    //     }
                    // }, function (result1) {
                    //     if (result1) {
                    leaveapplicationService.CreateOrUpdateLeaves(data).then(function (res) {
                        if (res) {
                            (new Init()).getLeaveList();
                            LeaveCtrl.closeModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                        }

                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log.log('Error while Fetching the Records' + error);
                    });
                    //     }
                    // });
                }
                else {
                    data.id = LeaveCtrl.editingLeaveId;
                    leaveapplicationService.editLeave(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            //(new Init()).getGradeList();
                            //Close Modal
                            LeaveCtrl.closeModal();
                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                        }
                    }, function (error) {
                        toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                        //console.log.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }
        };
        //Delete Action
        var deleteLeave = function (index) {
            if (LeaveCtrl.LeaveList) {
                leaveapplicationService.deleteLeave(LeaveCtrl.LeaveList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getLeaveList();
                        LeaveCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    //console.log.log('Error while deleting Leave. Error Stack' + error);
                });
            }
        };
        //Delete Action
        var deleteLeaveRequest = function (index) {
            if (LeaveCtrl.LeaveRequestList) {
                leaveapplicationService.deleteLeaveRequest(LeaveCtrl.LeaveRequestList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getLeaveRequestList();
                        LeaveCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    //console.log.log('Error while deleting Leave. Error Stack' + error);
                });
            }
        };
        //Close or Open modal
        LeaveCtrl.closeModal = function () {
            var modal = $('#edit-leave');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        LeaveCtrl.openModal = function () {
            var modal = $('#edit-leave');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            LeaveCtrl.formFields = {};
        }
        //Delete confirmation box
        LeaveCtrl.confirmCallbackMethod = function (index) {
            deleteLeave(index);
        };
        //Delete cancel box
        LeaveCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };
        //Delete confirmation box
        LeaveCtrl.confirmCallbackMethod1 = function (index) {
            deleteLeaveRequest(index);
        };
        //Delete cancel box
        LeaveCtrl.confirmCallbackCancel1 = function (index) {
            if (index) {
                return false;
            }
            return;
        };
        //Calendar Fix @@TODO Move this to directive
        $timeout(function () {
            $('#leavedate1').on('dp.change', function () {
                LeaveCtrl.formFields.date1 = $(this).val();
            });
        }, 500);
        //Calendar Fix @@TODO Move this to directive
        $timeout(function () {
            $('#leavedate2').on('dp.change', function () {
                LeaveCtrl.formFields.date2 = $(this).val();
            });
        }, 500);
        //Export to Excel
        LeaveCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        LeaveCtrl.printData = function () {
            var divToPrint = document.getElementById("printTable");
            LeaveCtrl.newWin = window.open("");
            LeaveCtrl.newWin.document.write(divToPrint.outerHTML);
            LeaveCtrl.newWin.print();
            LeaveCtrl.newWin.close();
        }

        LeaveCtrl.pdf = function () {
            document.getElementById("printTablesw").style.display = 'block';
            kendo.drawing
                .drawDOM("#printTable",
                    {
                        paperSize: "A4",
                        margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
                        scale: 0.5,
                        height: 500,
                        image_compression: { FAST: "FAST" }
                    })
                .then(function (group) {
                    // group.children[0] = group.children[group.children.length - 1]
                    // group.children.splice(1);
                    $timeout(function () {
                        kendo.drawing.pdf.saveAs(group, "LEAVE_APPROVE.pdf");
                        document.getElementById("printTablesw").style.display = 'none';
                    }, 1000);
                });
        }

        //End Print View

        LeaveCtrl.ValidateEndDate = function () {
            $("#leavedate1").change(function () {

                var startDate = document.getElementById("leavedate1").value;
                var endDate = document.getElementById("leavedate2").value;

                if ((Date.parse(endDate) < Date.parse(startDate))) {
                    alert("End date should be greater than Start date");
                    document.getElementById("leavedate1").value = "";
                }
            });

            $("#leavedate2").change(function () {

                var startDate = document.getElementById("leavedate1").value;
                var endDate = document.getElementById("leavedate2").value;

                if ((Date.parse(endDate) < Date.parse(startDate))) {
                    alert("End date should be greater than Start date");
                    document.getElementById("leavedate2").value = "";
                }
            });
        }
        $scope.orderByCustom = function (data) {
            var parts = data.date1.split('-');
            return new Date(parts[2], parts[1], parts[0]);
        };
    });
