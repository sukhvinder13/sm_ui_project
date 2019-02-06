'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:DepositControllerCtrl
 * @description
 * # DepositControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('DepositControllerCtrl', function ($cookies,$http,depositService, $timeout, toastr, APP_MESSAGES, generateexcelFactory, $scope, School ,Deposit) {
   var DepositCtrl=this;
   DepositCtrl.formFields = {};
   DepositCtrl.editmode = false;
   DepositCtrl.detailsMode = false;
   DepositCtrl.viewValue = {};
   DepositCtrl.innerHTML = {};
   //Defaults
   DepositCtrl.schoolId = $cookies.getObject('uds').schoolId;
   DepositCtrl.loginId = $cookies.getObject('uds').id;
   DepositCtrl.role = $cookies.get('role');

      var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
    
      for(var i = 0; i<roleAccess[0].RolesData.length;i++){
          if(roleAccess[0].RolesData[i].name === "Expenses"){
           DepositCtrl.roleView = roleAccess[0].RolesData[i].view;
           DepositCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
           DepositCtrl.roledelete = roleAccess[0].RolesData[i].delete;
          }
          
      }
  
   function Init() {
       this.getExpenseRecords = function () {
           depositService.getExpensesBySchoolId(DepositCtrl.schoolId, DepositCtrl.role, DepositCtrl.loginId).then(function (response) {
               if (response) {
                   DepositCtrl.depositList = response;
               }
           }, function (error) {
               //console.log.log('Error while fetching expense records. Error stack : ' + error);
           });
       };
   }
   (new Init()).getExpenseRecords();
   
   //Close or Open modal
   DepositCtrl.closeModal = function () {
       var modal = $('#edit-expenses');
       modal.modal('hide');

       //ClearFields
       clearformfields();
   };
   DepositCtrl.openModal = function () {
       var modal = $('#edit-expenses');
       modal.modal('show');
   };
   //Clear Fields
   function clearformfields() {
       DepositCtrl.formFields = {};
   }
   //Delete confirmation box
   DepositCtrl.confirmCallbackMethod = function (index) {
       deleteExpense(index);
   };
   //Delete cancel box
   DepositCtrl.confirmCallbackCancel = function (index) {
       if (index) {
           return false;
       }
       return;
   };
   // Add Action
    $scope.first = true;
   DepositCtrl.expenseAction = function (invalid) {
      console.log("cntrl");
       
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
           schoolId: DepositCtrl.schoolId,
           date: new Date((DepositCtrl.formFields.date).setHours(5, 31, 0, 0)).toISOString(),
           bank: DepositCtrl.formFields.bank,
           branch: DepositCtrl.formFields.branch,
           amount: DepositCtrl.formFields.amount
       };
       if (data) {

           //Check whether editmode or normal mode
           if (!DepositCtrl.editmode) {
            //    depositService.getExistingExpenseRecords(data).then(function (result) {
            //        if (result) {
              //          toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
              //          //console.log.log('data already exists');
              //         $scope.first = !$scope.first;
              //          return;
              //      }
              //  }, function (result1) {
              //      if (result1) {
                       depositService.CreateOrUpdateExpense(data).then(function (res) {
                           if (res) {
                               (new Init()).getExpenseRecords();
                               DepositCtrl.closeModal();
                               //Show Toast Message Success
                               $scope.first = !$scope.first;
                               toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                           }

                       }, function (error) {
                           //console.log.log('Error while Fetching the Records' + error);
                       });
                //    }
            //    });
           }
           else {
               data.id = DepositCtrl.editingExpenseId;
               depositService.editExpense(data).then(function (result) {
                   if (result) {
                       //On Successfull refill the data list
                       (new Init()).getExpenseRecords();
                       //Close Modal
                       DepositCtrl.closeModal();
                       $scope.first = !$scope.first;

                       //Show Toast Message Success
                       toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
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
       if (DepositCtrl.depositList) {
           depositService.deleteExpense(DepositCtrl.depositList[index].id).then(function (result) {
               if (result) {
                   //On Successfull refill the data list
                   (new Init()).getExpenseRecords();
                   DepositCtrl.closeModal();
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
   DepositCtrl.editExpense = function (index) {
       DepositCtrl.formFields.date = DepositCtrl.depositList[index].date;
       DepositCtrl.formFields.amount = DepositCtrl.depositList[index].amount;
       DepositCtrl.formFields.bank = DepositCtrl.depositList[index].bank;
       DepositCtrl.formFields.branch = DepositCtrl.depositList[index].branch;
    //    DepositCtrl.editingExpenseId = DepositCtrl.depositList[index].id;
       //Set View Mode false
       DepositCtrl.detailsMode = false;
       //Open Modal
       DepositCtrl.openModal();

       $timeout(function () {

           DepositCtrl.setFloatLabel();
           //Enable Edit Mode
           DepositCtrl.editmode = true;
       });

   };
   //Setting up float label
   DepositCtrl.setFloatLabel = function () {
       Metronic.setFlotLabel($('input[name=expensetype]'));
       Metronic.setFlotLabel($('input[name=description]'));
       Metronic.setFlotLabel($('input[name=date]'));
       Metronic.setFlotLabel($('input[name=amount]'));
   };

   //Calendar Fix @@TODO Move this to directive
   // $('.calendarctrl').on('dp.change', function () {
   //     DepositCtrl.formFields.date = $(this).val();
   // });
   //More Details
   DepositCtrl.moreDetails = function (index) {
       DepositCtrl.detailsMode = true;
       DepositCtrl.openModal();
       DepositCtrl.viewValue = DepositCtrl.depositList[index];
       $scope.fileLength = false;
       if (DepositCtrl.viewValue.file.length == DepositCtrl.viewValue.file.length) {
           $scope.fileLength = true;
       }
   };
   DepositCtrl.printToCart = function (expenseId) {
       var innerContents = document.getElementById(expenseId);
       var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
       popupWinindow.document.open();
       popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
       popupWinindow.document.close();
   };
   //Export to Excel
   DepositCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
       var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
       $timeout(function () {
           location.href = exportHref;
       }, 100); // trigger download
   };
   //Bhasha Print View
   DepositCtrl.printData = function () {
       var divToPrint = document.getElementById("printTable");
       DepositCtrl.newWin = window.open("");
       DepositCtrl.newWin.document.write(divToPrint.outerHTML);
       DepositCtrl.newWin.print();
       DepositCtrl.newWin.close();
   }

   //End Print View
   //Updating the date model
   //Calendar Fix @@TODO Move this to directive
   $timeout(function () {
       $('#date').on('dp.change', function () {
           DepositCtrl.formFields.date = $(this).val();
       });
   }, 500);

   DepositCtrl.printExpense = function (index) {
       School.find({ filter: { where: { id: DepositCtrl.schoolId } } }, function (response) {
           DepositCtrl.studSchoolList = response;
       });
       DepositCtrl.formFields.index = index;
       DepositCtrl.formFields.expenseType = DepositCtrl.depositList[index].expenseType;
       DepositCtrl.formFields.claimedBy = DepositCtrl.depositList[index].claimedBy;
       DepositCtrl.formFields.description = DepositCtrl.depositList[index].description;
       DepositCtrl.formFields.date = DepositCtrl.depositList[index].date;
       DepositCtrl.formFields.amount = DepositCtrl.depositList[index].amount;

   }

   DepositCtrl.printExpense1 = function () {

       var divToPrint = document.getElementById("Expprint");
       DepositCtrl.newWin = window.open("");
       DepositCtrl.newWin.document.write(divToPrint.innerHTML);
       $timeout(function () {
           DepositCtrl.newWin.print();
           DepositCtrl.newWin.close();
       }, 4000);
   }
    function formValidations() {
       //total should be more then 0
       if (DepositCtrl.formFields.date == undefined)
           return 'Select Date ';
     
       if (DepositCtrl.formFields.bank== undefined)
           return 'Select  Bank ';
        if (DepositCtrl.formFields.branch == undefined)
           return 'Please Select Branch ';
     
       if (DepositCtrl.formFields.amount== null)
           return 'Please Select Amount';
    


       

       return undefined;}
       
  });
