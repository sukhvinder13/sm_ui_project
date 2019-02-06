'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ExpensesControllerCtrl
 * @description
 * # ExpensesControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
    .controller('ExpensesController', function (configService, expensesService, $cookies, $http, $timeout, toastr, APP_MESSAGES, generateexcelFactory, $scope, School) {
        var ExpensesCtrl = this;
        ExpensesCtrl.formFields = {};
        ExpensesCtrl.editmode = false;
        ExpensesCtrl.detailsMode = false;
        ExpensesCtrl.viewValue = {};
        ExpensesCtrl.innerHTML = {};
        //Defaults
        ExpensesCtrl.schoolId = $cookies.getObject('uds').schoolId;
        ExpensesCtrl.loginId = $cookies.getObject('uds').id;
        ExpensesCtrl.role = $cookies.get('role');

        var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

        for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
            if (roleAccess[0].RolesData[i].name === "Expenses") {
                ExpensesCtrl.roleView = roleAccess[0].RolesData[i].view;
                ExpensesCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
                ExpensesCtrl.roledelete = roleAccess[0].RolesData[i].delete;
            }

        }
        ExpensesCtrl.uploadFile = function (x) {
            ExpensesCtrl.file = document.getElementById('expencesFile').files[0];
            // var date =new Date.now();
            var fd = new FormData();
            fd.append('file', ExpensesCtrl.file);
            var uploadUrl = configService.baseUrl() + "/ImageContainers/Expenses/upload";

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function (response) {
                    if (response) {
                        ExpensesCtrl.file = configService.baseUrl() + '/ImageContainers/Expenses/download/' + response.data.result[0].filename;
                    }
                }, function (error) {
                    // console.log.log('Error while fetching the assignment records. Error stack : ' + error);
                });
        };

        function Init() {
            this.getExpenseRecords = function () {
                expensesService.getExpensesBySchoolId(ExpensesCtrl.schoolId, ExpensesCtrl.role, ExpensesCtrl.loginId).then(function (response) {
                    if (response) {
                        ExpensesCtrl.expensesList = response;
                        console.log(ExpensesCtrl.expensesList)
                    }
                }, function (error) {
                    //console.log.log('Error while fetching expense records. Error stack : ' + error);
                });
            };
        }
        (new Init()).getExpenseRecords();
        //Trigger the editable datatable
        // $timeout(function () {
        //     var columnsDefs = [null, null, null, null, {
        //         'orderable': false,
        //         'width': '10%',
        //         'targets': 0
        //     }, {
        //             'orderable': false,
        //             'width': '10%',
        //             'targets': 0
        //         }, {
        //             'orderable': false,
        //             'width': '10%',
        //             'targets': 0
        //         }];
        //     TableEditable.init('#expenses_datatable', columnsDefs);
        //     Metronic.init();
        // }, 1000);
        //Close or Open modal
        ExpensesCtrl.closeModal = function () {
            var modal = $('#edit-expenses');
            modal.modal('hide');

            //ClearFields
            clearformfields();
        };
        ExpensesCtrl.openModal = function () {
            var modal = $('#edit-expenses');
            modal.modal('show');
        };
        //Clear Fields
        function clearformfields() {
            ExpensesCtrl.formFields = {};
        }
        //Delete confirmation box
        ExpensesCtrl.confirmCallbackMethod = function (index) {
            deleteExpense(index);
        };
        //Delete cancel box
        ExpensesCtrl.confirmCallbackCancel = function (index) {
            if (index) {
                return false;
            }
            return;
        };
        // Add Action
        $scope.first = true;
        ExpensesCtrl.expenseAction = function (invalid) {
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
                schoolId: ExpensesCtrl.schoolId,
                expenseType: ExpensesCtrl.formFields.expenseType,
                claimedBy: ExpensesCtrl.formFields.claimedBy,
                description: ExpensesCtrl.formFields.description,
                date: new Date((ExpensesCtrl.formFields.date).setHours(5, 31, 0, 0)).toISOString(),
                amount: ExpensesCtrl.formFields.amount,
                userExpenseId: ExpensesCtrl.loginId,
                voucherNo: ExpensesCtrl.formFields.voucherNo,
                paymentMode: ExpensesCtrl.formFields.paymentMode,
                file: ExpensesCtrl.file
            };
            if (data) {

                //Check whether editmode or normal mode
                if (!ExpensesCtrl.editmode) {
                    // expensesService.getExistingExpenseRecords(data).then(function (result) {
                    //     if (result) {
                    //         toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
                    //         //console.log.log('data already exists');
                    //        $scope.first = !$scope.first;
                    //         return;
                    //     }
                    // }, function (result1) {
                    //     if (result1) {
                    expensesService.CreateOrUpdateExpense(data).then(function (res) {
                        if (res) {
                            (new Init()).getExpenseRecords();
                            ExpensesCtrl.closeModal();
                            //Show Toast Message Success
                            $scope.first = !$scope.first;
                            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                            window.location.reload();
                        }

                    }, function (error) {
                        //console.log.log('Error while Fetching the Records' + error);
                    });
                }
                else {
                    data.id = ExpensesCtrl.editingExpenseId;
                    expensesService.editExpense(data).then(function (result) {
                        if (result) {
                            //On Successfull refill the data list
                            (new Init()).getExpenseRecords();
                            //Close Modal
                            ExpensesCtrl.closeModal();
                            $scope.first = !$scope.first;

                            //Show Toast Message Success
                            toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
                            window.location.reload();
                        }
                    }, function (error) {
                        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                        //console.log.log('Error while creating or updating records. Error stack' + error);
                    });
                }
            }

        };
        //Delete Action
        var deleteExpense = function (index) {
            if (ExpensesCtrl.expensesList) {
                expensesService.deleteExpense(ExpensesCtrl.expensesList[index].id).then(function (result) {
                    if (result) {
                        //On Successfull refill the data list
                        (new Init()).getExpenseRecords();
                        ExpensesCtrl.closeModal();
                        //Show Toast Message Success
                        toastr.success(APP_MESSAGES.DELETE_SUCCESS);
                    }
                }, function (error) {
                    toastr.error(error, APP_MESSAGES.SERVER_ERROR);
                    //console.log.log('Error while deleting expense. Error Stack' + error);
                });
            }
        };
        //Edit Action
        ExpensesCtrl.editExpense = function (index) {
            ExpensesCtrl.formFields.expenseType = ExpensesCtrl.expensesList[index].expenseType;
            ExpensesCtrl.formFields.claimedBy = ExpensesCtrl.expensesList[index].claimedBy;
            ExpensesCtrl.formFields.description = ExpensesCtrl.expensesList[index].description;
            ExpensesCtrl.formFields.date = new Date(ExpensesCtrl.expensesList[index].date);
            ExpensesCtrl.formFields.amount = ExpensesCtrl.expensesList[index].amount;
            ExpensesCtrl.formFields.voucherNo = ExpensesCtrl.expensesList[index].voucherNo;
            ExpensesCtrl.formFields.paymentMode = ExpensesCtrl.expensesList[index].paymentMode;
            ExpensesCtrl.myUpload = ExpensesCtrl.expensesList[index].file;
            ExpensesCtrl.editingExpenseId = ExpensesCtrl.expensesList[index].id;
            //Set View Mode false
            ExpensesCtrl.detailsMode = false;
            //Open Modal
            ExpensesCtrl.openModal();

            $timeout(function () {

                ExpensesCtrl.setFloatLabel();
                //Enable Edit Mode
                ExpensesCtrl.editmode = true;
            });

        };
        //Setting up float label
        ExpensesCtrl.setFloatLabel = function () {
            Metronic.setFlotLabel($('input[name=expensetype]'));
            Metronic.setFlotLabel($('input[name=description]'));
            Metronic.setFlotLabel($('input[name=date]'));
            Metronic.setFlotLabel($('input[name=amount]'));
        };

        //Calendar Fix @@TODO Move this to directive
        // $('.calendarctrl').on('dp.change', function () {
        //     ExpensesCtrl.formFields.date = $(this).val();
        // });
        //More Details
        ExpensesCtrl.moreDetails = function (index) {
            ExpensesCtrl.detailsMode = true;
            ExpensesCtrl.openModal();
            ExpensesCtrl.viewValue = ExpensesCtrl.expensesList[index];
            $scope.fileLength = false;
            if (ExpensesCtrl.viewValue.file.length == ExpensesCtrl.viewValue.file.length) {
                $scope.fileLength = true;
            }
        };
        ExpensesCtrl.printToCart = function (expenseId) {
            var innerContents = document.getElementById(expenseId);
            var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
            popupWinindow.document.close();
        };
        //Export to Excel
        ExpensesCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        };
        //Bhasha Print View
        ExpensesCtrl.printData = function () {
            angular.element("#printTable").addClass('mouseEvent');
            var divToPrint = document.getElementById("printTable");
            ExpensesCtrl.newWin = window.open("");
            ExpensesCtrl.newWin.document.write(divToPrint.outerHTML);
            ExpensesCtrl.newWin.print();
            ExpensesCtrl.newWin.close();
            angular.element("#printTable").removeClass('mouseEvent');
        }


        ExpensesCtrl.pdf = function() {
            angular.element("#printTable").addClass('mouseEvent');
            kendo.drawing
            .drawDOM("#printTable",
            {
                paperSize: "A4",
                margin: { top: "1cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" },
                scale: 0.6,
                height: 500
            })
            .then(function (group) {
                kendo.drawing.pdf.saveAs(group, "Expenses.pdf");
            angular.element("#printTable").removeClass('mouseEvent');
            });
        }
        //End Print View
        //CLEAR FORMS
        ExpensesCtrl.clearform = function () {
            ExpensesCtrl.myUpload = "";
            clearformfields();


        }
        //avoid future date
        var dateControler = {
            currentDate: null
        }
        $(document).on("change", "#txtDate", function (event, ui) {
            var now = new Date();
            var selectedDate = new Date($(this).val());
            if (selectedDate > now) {
                $(this).val(dateControler.currentDate)
            } else {
                dateControler.currentDate = $(this).val();
            }
        });
        //ends heree
        //Updating the date model
        //Calendar Fix @@TODO Move this to directive
        $timeout(function () {
            $('#date').on('dp.change', function () {
                ExpensesCtrl.formFields.date = $(this).val();
            });
        }, 500);

        ExpensesCtrl.printExpense = function (index) {
            School.find({ filter: { where: { id: ExpensesCtrl.schoolId } } }, function (response) {
                ExpensesCtrl.studSchoolList = response;
            });
            ExpensesCtrl.formFields.index = index+1;
            ExpensesCtrl.formFields.expenseType = ExpensesCtrl.expensesList[index].expenseType;
            ExpensesCtrl.formFields.claimedBy = ExpensesCtrl.expensesList[index].claimedBy;
            ExpensesCtrl.formFields.description = ExpensesCtrl.expensesList[index].description;
            ExpensesCtrl.formFields.date = ExpensesCtrl.expensesList[index].date;
            ExpensesCtrl.formFields.amount = ExpensesCtrl.expensesList[index].amount;

        }

        ExpensesCtrl.printExpense1 = function () {

            var divToPrint = document.getElementById("Expprint");
            ExpensesCtrl.newWin = window.open("");
            ExpensesCtrl.newWin.document.write(divToPrint.innerHTML);
            $timeout(function () {
                ExpensesCtrl.newWin.print();
                ExpensesCtrl.newWin.close();
            }, 4000);
        }
        function formValidations() {
            //total should be more then 0
            if (ExpensesCtrl.formFields.expenseType == undefined)
                return 'Select Expense Type ';

            if (ExpensesCtrl.formFields.claimedBy == undefined)
                return 'Select ClaimedBy Name ';
            if (ExpensesCtrl.formFields.description == undefined)
                return 'Please Select Description ';

            if (ExpensesCtrl.formFields.date == null)
                return 'Please Select Date';
            if (ExpensesCtrl.formFields.amount == undefined)
                return 'Please Select Amount  ';
            if (ExpensesCtrl.formFields.date > new Date())
                return 'Please Select Date'



            return undefined;
        }
    });
