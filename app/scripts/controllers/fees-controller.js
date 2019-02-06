'use strict';
/**
 * @ngdoc function
 * @name studymonitorApp.controller:FeesControllerCtrl
 * @description
 * # FeesControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('FeesController', function (feesService, $cookies, $timeout, $scope, FeeSetup, generateexcelFactory, FeePayment, $state, $location, Student, toastr, APP_MESSAGES, StudentFees, $stateParams, $window) {
    var FeesCtrl = this;

    FeesCtrl.schoolId = $cookies.getObject('uds').schoolId;
    FeesCtrl.loginId = $cookies.getObject('uds').id;
    FeesCtrl.ShowDuefeesList = [];
    FeesCtrl.duefeesCheckedArry = [];
    FeesCtrl.ShowoptionalList = [];
    FeesCtrl.pushoptList = [];
    FeesCtrl.ShowadmissionList = [];
    FeesCtrl.pushadmList = [];
    FeesCtrl.feepaymentpush = [];
    FeesCtrl.role = $cookies.get('role');

    feesService.getschoolDetailsByloginId(FeesCtrl.schoolId).then(function (ress) {
      if (ress) {
        if (ress[0].faymentStudents) {
          FeesCtrl.enableFeedata = ress[0].faymentStudents;
        }
      }
    })

    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));

    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Fees Configuration") {
        FeesCtrl.roleView = roleAccess[0].RolesData[i].view;
        FeesCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
        FeesCtrl.roledelete = roleAccess[0].RolesData[i].delete;
      }

      else if (roleAccess[0].RolesData[i].name === "Fee Setup") {
        FeesCtrl.FeeCategoryroleView = roleAccess[0].RolesData[i].view;
        FeesCtrl.FeeCategoryroleEdit = roleAccess[0].RolesData[i].edit;
        FeesCtrl.FeeCategoryroledelete = roleAccess[0].RolesData[i].delete;

      }

    }
    //Defaults
    FeesCtrl.formFields = {};
    FeesCtrl.feeStrcture = {};
    FeesCtrl.editMode = false;
    FeesCtrl.editmode1 = false;
    FeesCtrl.showMonthly = false;
    FeesCtrl.showterm = false;
    FeesCtrl.showyearly = false;

    this.getFeesetups = function (schoolId, classId) {
      console.log(schoolId);
      console.log(classId);
      feesService.getFeesetups(schoolId, classId).then(function (res) {
        if (res) {
          FeesCtrl.feesList = res.feeSetup;
          FeesCtrl.classList = res.classes;
        }
      }, function (error) {
        console.log(error);

      });
    };
    this.getFeesetups(FeesCtrl.schoolId);
    (new Init()).categoryList();
    FeesCtrl.chooseClass = function (classId) {
      console.log(classId);
      this.getFeesetups(FeesCtrl.schoolId, classId);

    };
    FeesCtrl.feeSetupModel = {
      "classId": "",
      "feetype": "",
      "mandatory": '',
      "feeCategoriesId": "",
      "mode": "",
      "recursive": '',
      "schoolId": FeesCtrl.schoolId,
      "feeItems": []
    };
    this.item = {
      oneTime: {
        "description": '',
        'amount': '',
        'date': '',
        'mode': 'one time',
        'sNo': 0
      },
      Monthly: [{
        "description": '',
        'amount': '',
        'date': '',
        'mode': 'Monthly',
        'sNo': 0
      }],
      Term: [{
        "description": '',
        'amount': '',
        'date': '',
        'mode': 'Term',
        'sNo': 0
      }],
      Yearly: [{
        "description": '',
        'amount': '',
        'date': '',
        'mode': 'Yearly',
        'sNo': 0
      }]
    };
    this.isMonthlyChecked, this.isTermChecked, this.isYearlyChecked = false;
    this.isNew = true;
    var validateData = function (data) {
      var msg = '';
      if (data.feetype.length == 0) msg = 'Fee Name is Requird';
      if (data.classId.length == 0) msg = 'Class is required';
      if (data.feeCategoriesId.length == 0) msg = 'Category is Required'
      if (data.mandatory.length == 0) msg = 'Fee Type is Requird';
      angular.forEach(data.feeItems, function (item) {

        if (item.description.length == 0) msg = 'Description is Requird';
        if (item.amount == '') msg = 'Amount is required';
      });
      return msg;
    }
    FeesCtrl.addRow = function (val) {
      this.item[val]
      this.item[val].push({
        "description": '',
        'amount': '',
        'date': '',
        'mode': val,
        'sNo': this.item[val].length
      })
    }
    FeesCtrl.deleteRow = function ($index, val) {
      this.item[val].splice($index, 1);
    }
    //END STUDENT FEES IN NEW PAGE
    $scope.first = true;
    FeesCtrl.feeAction = function (invalid) {
      var message = formValidations();
      if (message != undefined && message.trim().length > 1) {
        alert(message);
        return;
      }
      $scope.first = !$scope.first;
      if (invalid) {
        return;
      }
      var mode = [];
      if (this.isNew) {
        if (FeesCtrl.feeSetupModel.recursive == 'One time') {
          FeesCtrl.feeSetupModel.feeItems = [];
          FeesCtrl.feeSetupModel.feeItems.push(this.item.oneTime);
          mode.push('onetime')
          FeesCtrl.feeSetupModel.mode = mode;
        }
        else {
          var items = []

          if (this.isMonthlyChecked) {
            items = items.concat(this.item.Monthly);
            mode.push('Monthly');
          }
          if (this.isTermChecked) {
            items = items.concat(this.item.Term);
            mode.push('Term')
          }
          if (this.isYearlyChecked) {
            items = items.concat(this.item.Yearly);
            mode.push('Yearly')
          }
          FeesCtrl.feeSetupModel.feeItems = items;
          FeesCtrl.feeSetupModel.mode = mode;
        }
      }
      var errmsg = validateData(FeesCtrl.feeSetupModel)
      if (errmsg != '') {
        toastr.error(errmsg);
        $scope.first = !$scope.first;
        return;
      }
      if (this.isNew) {
        console.log("new");
        console.log(FeesCtrl.feeSetupModel.schoolId);
        if (FeesCtrl.feeSetupModel.schoolId == undefined) {
          console.log("in if undefined");
          FeesCtrl.feeSetupModel.schoolId = FeesCtrl.schoolId;
          console.log(FeesCtrl.feeSetupModel.schoolId);
        }
        feesService.upsertFeesetup(FeesCtrl.feeSetupModel).then(function (res) {
          if (res) {
            console.log(res);
            toastr.success('Successfully Created.');
            $scope.first = !$scope.first;
            FeesCtrl.closeModal();
            FeesCtrl.chooseClass(FeesCtrl.classId);
            // this.getFeesetups(FeesCtrl.schoolId, FeesCtrl.classId);
            // $timeout(function () {
            //   $window.location.reload();
            // }, 1000);
          }
        }, function (error) {
          console.log(error);
          $scope.first = !$scope.first;
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }
      else {
        console.log("NOTnew");
        feesService.feeUpdate(FeesCtrl.feeSetupModel).then(function (res) {
          if (res) {
            console.log(res);
            toastr.success('Successfully Created.');
            $window.location.reload();
            $scope.first = !$scope.first;

          }
        }, function (error) {
          console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }


    };

    //Edit Fee Setup
    FeesCtrl.editFee = function (feeId) {
      FeesCtrl.feeSetupModel = _.find(FeesCtrl.feesList, { 'id': feeId });
      // FeesCtrl.feeSetupModel=FeesCtrl.feesList[index]
      FeesCtrl.isNew = false;
      FeesCtrl.openModal();
      $timeout(function () {

        //Enable Edit Mode
        FeesCtrl.editmode = true;
      });

    }
    //Delete confirmation box
    FeesCtrl.confirmCallbackMethod = function (id) {
      deleteFee(id);
    };
    //*********************************DELETE FEE******************************** */
    //Delete Action
    var deleteFee = function (feeId) {
      if (FeesCtrl.feesList) {
        feesService.deleteFee(feeId).then(function (result) {
          if (result) {
            //On Successfull refill the data list
            if (FeesCtrl.classId !== "") {
              FeesCtrl.chooseClass(FeesCtrl.classId);
            } else {
              FeesCtrl.getFeesetups(FeesCtrl.schoolId);
            }
            FeesCtrl.closeModal();
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
          }
        }, function (error) {
        });
      }
    };

    FeesCtrl.myFunction = function () {
      var prtContent = document.getElementById("payfee");
      var WinPrint = window.open();
      WinPrint.document.write(prtContent.innerHTML);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    };

    function Init() {

      this.getFeePaymentList = function (classId) {
        feesService.getFeePaymentRecords(classId).then(function (result) {
          if (result) {
            FeesCtrl.feePaymentList = result;
          }
        }, function (error) {
          if (error) {
          }
        });
      };
      this.getSchoolLogo = function () {
        var schoolDetails = $cookies.getObject('__s');
        if (!angular.equals({}, schoolDetails)) {
          FeesCtrl.schoolLogo = schoolDetails.logo;
        }
      };
      this.categoryList = function () {
        feesService.getcategoryRecords(FeesCtrl.schoolId).then(function (result) {
          if (result) {
            FeesCtrl.categoryList = result;
          }
        }, function (error) {
          if (error) {
          }
        });
      };
    }


    // (new Init()).getStudentDetails();
    // (new Init()).getsaveStudentFeeDetails();
    // (new Init()).getSchoolLogo();
    // (new Init()).getSchoolDetails();



    FeesCtrl.closeModal = function () {
      var modal = $('#edit-fees');
      modal.modal('hide');
      // $window.location.reload();

      //ClearFields
      clearformfields();
    };
    FeesCtrl.closeModal1 = function () {
      var modal = $('#edit-feecategory');
      modal.modal('hide');

      //ClearFields
      clearformfields();
    };
    FeesCtrl.openModal = function () {
      var modal = $('#edit-fees');
      modal.modal('show');
    };
    FeesCtrl.openModal1 = function () {
      var modal = $('#edit-feecategory');
      modal.modal('show');
    };
    //Clear Fields
    function clearformfields() {
      FeesCtrl.isMonthlyChecked = false;
      FeesCtrl.isTermChecked = false;
      FeesCtrl.isYearlyChecked = false;
      FeesCtrl.formFields = {};
      // FeesCtrl.feeSetupModel = {};
      FeesCtrl.feeSetupModel={
        "classId": "",
        "feetype": "",
        "mandatory": '',
        "feeCategoriesId":"",
        "mode":"",
        "recursive":'',
        "schoolId": FeesCtrl.schoolId,
        "feeItems": []
      };
      FeesCtrl.item={
      oneTime:{
        "description":'',
        'amount':'',
        'date':'',
        'mode':'one time',
        'sNo':0
      },
      Monthly:[{
        "description":'',
        'amount':'',
        'date':'',
        'mode':'Monthly',
        'sNo':0
      }],
      Term:[{
        "description":'',
        'amount':'',
        'date':'',
        'mode':'Term',
        'sNo':0
      }],
      Yearly:[{
        "description":'',
        'amount':'',
        'date':'',
        'mode':'Yearly',
        'sNo':0
      }]
    };
    }


    //Delete cancel box
    FeesCtrl.confirmCallbackCancel = function (index) {
      if (index) {
        return false;
      }
      return;
    };


    //Delete confirmation box
    FeesCtrl.confirmCallbackMethod1 = function (index) {
      deleteCategory(index);
    };
    //Delete cancel box
    FeesCtrl.confirmCallbackCancel1 = function (index) {
      if (index) {
        return false;
      }
      return;
    };



    //*********************************DELETE FEE******************************** */
    //Get Students based on Selected Classes
    FeesCtrl.selectedClass = function () {
      if (FeesCtrl.paymentclassId) {
        (new Init()).getFeePaymentList(FeesCtrl.paymentclassId);
      }
    };
    //Calendar Fix @@TODO Move this to directive
    $timeout(function () {
      $('duedate').on('dp.change', function () {
        FeesCtrl.formFields.date = $(this).val();
      });
    }, 500);

    /**************************** Fees Action ************************************* */

    //More Details
    FeesCtrl.moreDetails = function (index) {
      FeesCtrl.detailsMode = true;
      FeesCtrl.openModal();
      FeesCtrl.viewValue = FeesCtrl.feesList[index];
    };
    /**************************** Fees Action End ********************************* */

    FeesCtrl.oneTimePay = [];
    FeesCtrl.recursive = function () {
      if (FeesCtrl.formFields.Recursive === "One time") {
        FeesCtrl.feeStrcture.occuranceFlag = false;
        FeesCtrl.feeStrcture.oneTimeFeeIdFlag = true;
        FeesCtrl.oneTimePay = [{
          'description': "",
          'amount': "",
          'date': ""
        }];
      } else {
        FeesCtrl.feeStrcture.occuranceFlag = true;
        FeesCtrl.feeStrcture.oneTimeFeeIdFlag = false;
        FeesCtrl.oneTimePay.splice(0, FeesCtrl.oneTimePay.length);
      }
    };
    /*monthly show hied*/
    FeesCtrl.showmonthly = false;
    FeesCtrl.monthlyfeeTF = function () {
      if (FeesCtrl.showmonthly) {
        FeesCtrl.Monthly.splice(0, FeesCtrl.Monthly.length);
        FeesCtrl.showmonthly = false;
        var index = FeesCtrl.mode.indexOf("monthly");
        FeesCtrl.mode.splice(index, 1);
      } else {
        FeesCtrl.Monthly = [{
          'description': "",
          'amount': "",
          'date': ""
        }];
        FeesCtrl.mode.push("monthly");
        FeesCtrl.showmonthly = true;
      }
    };
    FeesCtrl.showtermly = false;
    FeesCtrl.termlyfeeTF = function () {
      if (FeesCtrl.showtermly) {
        FeesCtrl.Term.splice(0, FeesCtrl.Term.length);
        FeesCtrl.showtermly = false;
        var index = FeesCtrl.mode.indexOf("termly");
        FeesCtrl.mode.splice(index, 1);
      } else {
        FeesCtrl.Term = [{
          'description': "",
          'amount': "",
          'date': ""
        }];
        FeesCtrl.mode.push("termly");
        FeesCtrl.showtermly = true;
      }
    };
    //FeesCtrl.yearly = [];
    FeesCtrl.showyearly = false;
    FeesCtrl.yearlyfeeTF = function () {
      if (FeesCtrl.showyearly) {
        FeesCtrl.yearly.splice(0, FeesCtrl.yearly.length);
        FeesCtrl.showyearly = false;
        var index = FeesCtrl.mode.indexOf("yearly");
        FeesCtrl.mode.splice(index, 1);
      } else {
        FeesCtrl.yearly = [{
          "description": "",
          "amount": "",
          "date": ""
        }];
        FeesCtrl.mode.push("yearly");
        FeesCtrl.showyearly = true;
      }
    };

    /*end*/


    /** Remove Edit */
    FeesCtrl.removeEditedFields = function () {
      FeesCtrl.editMode = false;
    };

    /*mode */
    FeesCtrl.mode = [];
    /*end*/
    FeesCtrl.optionalAction = function () {
      var array1 = FeesCtrl.feeSetUpDetails;

      if (FeesCtrl.optionalfeeSetUpDetails != undefined) {
        for (var i = 0; i < FeesCtrl.optionalfeeSetUpDetails.length; i++) {
          FeesCtrl.ShowoptionalList.push(FeesCtrl.optionalfeeSetUpDetails[i]);
          if (FeesCtrl.ShowoptionalList[i].isChecked == true) {
            FeesCtrl.pushoptList.push(FeesCtrl.ShowoptionalList[i]);
          }
        }
      }
      if (FeesCtrl.admissionfeeSetUpDetails != undefined) {
        for (var i = 0; i < FeesCtrl.admissionfeeSetUpDetails.length; i++) {
          FeesCtrl.ShowadmissionList.push(FeesCtrl.admissionfeeSetUpDetails[i]);
          if (FeesCtrl.ShowadmissionList[i].isChecked == true) {
            FeesCtrl.pushadmList.push(FeesCtrl.ShowadmissionList[i]);

          }
        }
      }
      Array.prototype.push.apply(array1, FeesCtrl.pushoptList);
      Array.prototype.push.apply(array1, FeesCtrl.pushadmList);
      var data = {
        studentId: FeesCtrl.studentData.id,
        SCS: FeesCtrl.schoolId + FeesCtrl.studentData.classId + FeesCtrl.studentData.id,
        "optionalData": array1,
        discountAmount: "NA"
      };
      feesService.CreateOptionalFee(data).then(function (res) {
        if (res) {
          toastr.success(APP_MESSAGES.INSERT_SUCCESS);
          $('#fullDetailedFeeOfStudent').modal('hide');
        }
      }, function (error) {
      });
    };
    //PAY STUDENT FEES IN NEW PAGE
    FeesCtrl.editDetails = function (stuid) {

      window.open('#!/' + 'feeDetails/' + stuid, '_blank'); // in new tab

    };


    FeesCtrl.getFeeStructure = function () {
      feesService.getFeeStructureByClassId(FeesCtrl.schoolId, FeesCtrl.feeStrcture.classId).then(function (res) {
        FeesCtrl.feeStructuerData = res;
      }, function (error) {
      });
    };
    FeesCtrl.getFeeReport = function () {
      feesService.getFeeReportBySchoolId(FeesCtrl.schoolId).then(function (res) {
      });
    };
    /********* FEE Payment****** */
    FeesCtrl.studentDetails;
    FeesCtrl.feeSetUpDetails = [];
    FeesCtrl.allOptionalTotal = 0;
    FeesCtrl.individualFeeDetails = function (id) {
      FeesCtrl.studentId = id;
      Student.find({ filter: { where: { id: id }, include: 'class' } }, function (studenT) {
        if (typeof studenT[0].payModeFlag !== undefined && studenT[0].payModeFlag == true) {
          FeesCtrl.studentData = studenT[0];
          FeesCtrl.studentDetails = studenT[0];
          FeeSetup.find({ filter: { where: { classId: studenT[0].classId, mode: studenT[0].paymentmode, mandatory: "Mandatory" } } }, function (studentFeeSetUp) {
            FeesCtrl.feeSetUpDetails = studentFeeSetUp;
            $('#fullDetailedFeeOfStudent').modal('show');
          })
        } else {
          $('#selectFeeStructure').modal('show');
        }
      });
    };

    //END PAY DUE
    FeesCtrl.allTotal = 0;
    FeesCtrl.allAdmissionTotal = 0;
    FeesCtrl.feeChecked = function (flag, data, index) {
      var total = 0;
      var allTotal = 0;
      if (flag) {
        FeesCtrl.feeSetUpDetails[index].savedFeeData.push(data);
      } else {
        FeesCtrl.feeSetUpDetails[index].savedFeeData.splice(FeesCtrl.feeSetUpDetails[index].savedFeeData.indexOf(data), 1);
      }
      angular.forEach(FeesCtrl.feeSetUpDetails[index].savedFeeData, function (value, index) {
        if (!isNaN(value.amount)) {
          total = total + parseFloat(value.amount);
        }
      });
      FeesCtrl.feeSetUpDetails[index].totalFee = total;
      angular.forEach(FeesCtrl.feeSetUpDetails, function (value, index) {
        if (!isNaN(value.totalFee)) {
          allTotal = allTotal + parseFloat(value.totalFee);
        }
      });
      FeesCtrl.allTotal = allTotal;
      if (typeof FeesCtrl.feeSetUpDetails[index].discountFlag && FeesCtrl.feeSetUpDetails[index].discountFlag) {
        FeesCtrl.discountFu(FeesCtrl.feeSetUpDetails[index].discountAmount, index);
      }
    };
    FeesCtrl.discountFu = function (discount, index) {
      var total = FeesCtrl.feeSetUpDetails[index].totalFee;
      if (typeof discount && discount > 0 && discount < total) {
        total = total - discount;
      }

      FeesCtrl.feeSetUpDetails[index].totalFee = total;
      FeesCtrl.feeSetUpDetails[index].discountFlag = true;
      FeesCtrl.feeSetUpDetails[index].discountAmount = discount;
    };


    FeesCtrl.paid = function (amount, index) {
      var paidTotal = 0;
      var total = FeesCtrl.feeSetUpDetails[index].totalFee;
      if (typeof amount && amount > 0 && amount < total) {
        total = total - amount;
        FeesCtrl.feeSetUpDetails[index].dueFee = total;
      } else {
        total = 0;
      }

      FeesCtrl.feeSetUpDetails[index].dueFee = total;
      FeesCtrl.feeSetUpDetails[index].amountFlag = true;
      FeesCtrl.feeSetUpDetails[index].paidAmount = amount;
      angular.forEach(FeesCtrl.feeSetUpDetails, function (value, index) {
        if (!isNaN(value.paidAmount)) {
          paidTotal = paidTotal + parseFloat(value.paidAmount);
        }
      });
      FeesCtrl.paidTotal = paidTotal;
    };
    FeesCtrl.selectFeeStructureClose = function () {
      $('#selectFeeStructure').modal('hide');
    };
    FeesCtrl.fullDetailedFeeOfStudentClose = function () {
      $('#fullDetailedFeeOfStudent').modal('hide');
    };
    FeesCtrl.fullDetailedDueFeeOfStudentClose = function () {
      $('#fullDetailedDueFeeOfStudent').modal('hide');
    };
    FeesCtrl.selectFeeStructure = function (invalid) {
      if (invalid) {
        return;
      }
      var data = {
        paymentmode: FeesCtrl.formFields.payment,
        payModeFlag: true,
      };
      if (data) {

        data.id = FeesCtrl.studentId;
        feesService.CreateStudentFeeByStudentId(data).then(function (res) {
          if (res) {
            clearformfields();
            $('#selectFeeStructure').modal('hide');
          }
        }, function (error) {
        });

      }
    };
    /********* FEE Payment****** */
    FeesCtrl.payDetails = function (index) {
      $('#payfee').modal('show');

      var total = 0;
      var paid = 0;
      var due = 0;
      angular.forEach(FeesCtrl.feeSetUpDetails, function (value, index) {
        if (!isNaN(value.totalFee)) {
          total = total + parseFloat(value.totalFee);
        }
        if (!isNaN(value.amountpaid)) {
          paid = paid + parseFloat(value.amountpaid);
        }
        if (!isNaN(value.dueFee)) {
          due = due + parseFloat(value.dueFee);
        }
      });
      FeesCtrl.amountPaid = paid;
      FeesCtrl.totalAmount = total;
      FeesCtrl.dueAmount = due;


    };
    FeesCtrl.duefeechecked = function (flag, data) {

      var dueAllTotal = 0;
      if (flag) {
        FeesCtrl.duefeesCheckedArry.push(data);
        angular.forEach(FeesCtrl.duefeesCheckedArry, function (value, index) {
          if (!isNaN(value.dueFee)) {
            dueAllTotal = dueAllTotal + parseFloat(value.dueFee);
          }
          FeesCtrl.allDueFeesTotal = dueAllTotal;
        });
      } else {

        FeesCtrl.duefeesCheckedArry.splice(data, 1);

      }

    }
    FeesCtrl.payDetailsClose = function () {

      $('#payfee').modal('hide');
    };
    //Admission Row
    FeesCtrl.addadmissionRow = function () {
      FeeSetup.find({ filter: { where: { classId: FeesCtrl.studentDetails.classId, mode: FeesCtrl.studentDetails.paymentmode, mandatory: "Admfee" } } }, function (studentFeeSetUp) {
        FeesCtrl.admissionfeeSetUpDetails = studentFeeSetUp;
      });
      FeesCtrl.admissionFeeFlag = true;
    };
    FeesCtrl.isAdmissionChecked;
    FeesCtrl.admissionCheckedArry = [];
    FeesCtrl.admissionRecords = function (data, flag, index) {
      if (flag) {
        FeesCtrl.admissionCheckedArry.push(data);
      } else {
        var total = 0;
        var allTotal = 0;
        var index1 = FeesCtrl.admissionCheckedArry.indexOf(data);
        var originalIndex = FeesCtrl.admissionfeeSetUpDetails.indexOf(data);
        FeesCtrl.admissionfeeSetUpDetails[originalIndex].totalFee = 0;
        FeesCtrl.admissionfeeSetUpDetails[originalIndex].savedFeeData = [];
        FeesCtrl.admissionCheckedArry.splice(index1, 1);
        angular.forEach(FeesCtrl.admissionCheckedArry, function (value, index) {
          if (!isNaN(value.totalFee)) {
            allTotal = allTotal + parseFloat(value.totalFee);
          }
        });
        FeesCtrl.allAdmissionTotal = allTotal;
      }
    };

    FeesCtrl.admissionFeeChecked = function (flag, data, index) {
      var total = 0;
      var allTotal = 0;
      if (flag) {
        FeesCtrl.admissionCheckedArry[index].savedFeeData.push(data);
      } else {
        if (FeesCtrl.admissionCheckedArry.length > 0) {
          FeesCtrl.admissionCheckedArry[index].savedFeeData.splice(FeesCtrl.admissionCheckedArry[index].savedFeeData.indexOf(data), 1);
        }
      }
      if (FeesCtrl.admissionCheckedArry.length > 0) {
        angular.forEach(FeesCtrl.admissionCheckedArry[index].savedFeeData, function (value, index) {
          if (!isNaN(value.amount)) {
            total = total + parseFloat(value.amount);
          }
        });
        FeesCtrl.admissionCheckedArry[index].totalFee = total;
        angular.forEach(FeesCtrl.admissionCheckedArry, function (value, index) {
          if (!isNaN(value.totalFee)) {
            allTotal = allTotal + parseFloat(value.totalFee);
          }
        });
      }
      if (typeof FeesCtrl.admissionCheckedArry[index].discountFlag && FeesCtrl.admissionCheckedArry[index].discountFlag) {
        FeesCtrl.discountFu(FeesCtrl.feeSetUpDetails[index].discountAmount, index);
      }
      FeesCtrl.allAdmissionTotal = allTotal;
    };
    FeesCtrl.paidAdmissionTotal = 0;
    FeesCtrl.admissionPaid = function (amount, index) {
      var paidTotal = 0;
      var total = FeesCtrl.admissionCheckedArry[index].totalFee;
      if (typeof amount && amount > 0 && amount < total) {
        total = total - amount;
        FeesCtrl.admissionCheckedArry[index].dueFee = total;
      } else {
        total = 0;
      }
      FeesCtrl.admissionCheckedArry[index].dueFee = total;
      FeesCtrl.admissionCheckedArry[index].amountFlag = true;
      FeesCtrl.admissionCheckedArry[index].paidAmount = amount;
      angular.forEach(FeesCtrl.admissionCheckedArry, function (value, index) {
        if (!isNaN(value.paidAmount)) {
          paidTotal = paidTotal + parseFloat(value.paidAmount);
        }
      });
      FeesCtrl.paidAdmissionTotal = paidTotal;
    };
    //Optional Row
    FeesCtrl.optionalCheckedArry = [];
    FeesCtrl.addoptionalRow = function () {
      FeesCtrl.optionalfeeSetUpDetails;
      StudentFees.find({ filter: { where: { SCS: FeesCtrl.studentDetails.schoolId + FeesCtrl.studentDetails.classId + FeesCtrl.studentDetails.id } } }, function (optionalFeeData) {
        if (optionalFeeData.length > 0) {
          FeeSetup.find({ filter: { where: { classId: FeesCtrl.studentDetails.classId, mode: FeesCtrl.studentDetails.paymentmode, mandatory: "Optional" } } }, function (studentFeeSetUp) {

            if (studentFeeSetUp.length > 0) {
              studentFeeSetUp.forEach(function (val) {
                optionalFeeData[0].optionalData.forEach(function (value) {
                  if (value.id == val.id) {
                    val['isChecked'] = true;
                    FeesCtrl.optionalCheckedArry.push(val);
                  }
                });
              });
              optionalFeeData[0].optionalData.forEach(function (value) {

              });
              FeesCtrl.optionalfeeSetUpDetails = studentFeeSetUp;
            }
          });
        } else {
          FeeSetup.find({ filter: { where: { classId: FeesCtrl.studentDetails.classId, mode: FeesCtrl.studentDetails.paymentmode, mandatory: "Optional" } } }, function (studentFeeSetUp) {
            FeesCtrl.optionalfeeSetUpDetails = studentFeeSetUp;
          });
        }
      });
      FeesCtrl.optionalFeeFlag = true;
    };
    FeesCtrl.isOptionalChecked;
    FeesCtrl.optionalRecords = function (data, flag, index) {
      if (flag) {
        FeesCtrl.optionalCheckedArry.push(data);
      } else {
        var total = 0;
        var allTotal = 0;
        var index1 = FeesCtrl.optionalCheckedArry.indexOf(data);
        var originalIndex = FeesCtrl.optionalfeeSetUpDetails.indexOf(data);
        FeesCtrl.optionalfeeSetUpDetails[originalIndex].totalFee = 0;
        FeesCtrl.optionalfeeSetUpDetails[originalIndex].savedFeeData = [];
        FeesCtrl.optionalCheckedArry.splice(index1, 1);
        angular.forEach(FeesCtrl.optionalCheckedArry, function (value, index) {
          if (!isNaN(value.totalFee)) {
            allTotal = allTotal + parseFloat(value.totalFee);
          }
        });
        FeesCtrl.allOptionalTotal = allTotal;
      }
    };

    FeesCtrl.optionalFeeChecked = function (flag, data, index) {
      var total = 0;
      var allTotal = 0;
      if (flag) {
        FeesCtrl.optionalCheckedArry[index].savedFeeData.push(data);
      } else {
        if (FeesCtrl.optionalCheckedArry.length > 0) {
          FeesCtrl.optionalCheckedArry[index].savedFeeData.splice(FeesCtrl.optionalCheckedArry[index].savedFeeData.indexOf(data), 1);
        }
      }
      if (FeesCtrl.optionalCheckedArry.length > 0) {
        angular.forEach(FeesCtrl.optionalCheckedArry[index].savedFeeData, function (value, index) {
          if (!isNaN(value.amount)) {
            total = total + parseFloat(value.amount);
          }
        });
        FeesCtrl.optionalCheckedArry[index].totalFee = total;
        angular.forEach(FeesCtrl.optionalCheckedArry, function (value, index) {
          if (!isNaN(value.totalFee)) {
            allTotal = allTotal + parseFloat(value.totalFee);
          }
        });
      }
      if (typeof FeesCtrl.optionalCheckedArry[index].discountFlag && FeesCtrl.optionalCheckedArry[index].discountFlag) {
        FeesCtrl.discountFu(FeesCtrl.feeSetUpDetails[index].discountAmount, index);
      }
      FeesCtrl.allOptionalTotal = allTotal;
    };
    FeesCtrl.paidOptionalTotal = 0;
    FeesCtrl.optionalPaid = function (amount, index) {
      var paidTotal = 0;
      var total = FeesCtrl.optionalCheckedArry[index].totalFee;
      if (typeof amount && amount > 0 && amount < total) {
        total = total - amount;
        FeesCtrl.optionalCheckedArry[index].dueFee = total;
      } else {
        total = 0;
      }
      FeesCtrl.optionalCheckedArry[index].dueFee = total;
      FeesCtrl.optionalCheckedArry[index].amountFlag = true;
      FeesCtrl.optionalCheckedArry[index].paidAmount = amount;
      angular.forEach(FeesCtrl.optionalCheckedArry, function (value, index) {
        if (!isNaN(value.paidAmount)) {
          paidTotal = paidTotal + parseFloat(value.paidAmount);
        }
      });
      FeesCtrl.paidOptionalTotal = paidTotal;
    };
    FeesCtrl.discountFun1 = function (discount, index) {
      var total = FeesCtrl.optionalCheckedArry[index].totalFee;
      if (typeof discount && discount > 0 && discount < total) {
        total = total - discount;
      }

      FeesCtrl.optionalCheckedArry[index].totalFee = total;
      FeesCtrl.optionalCheckedArry[index].discountFlag = true;
      FeesCtrl.optionalCheckedArry[index].discountAmount = discount;
    };
    //Export to Excel
    FeesCtrl.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = generateexcelFactory.tableToExcel(tableId, 'class Sheet');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download
    };
    //Bhasha Print View
    FeesCtrl.printData = function () {
      var divToPrint = document.getElementById("feesprintTable");
      FeesCtrl.newWin = window.open("");
      FeesCtrl.newWin.document.write(divToPrint.outerHTML);
      FeesCtrl.newWin.print();
      FeesCtrl.newWin.close();
    }

    //End Print View

    FeesCtrl.discountFun = function (discount, index) {
      var total = FeesCtrl.admissionCheckedArry[index].totalFee;
      if (typeof discount && discount > 0 && discount < total) {
        total = total - discount;
      }

      FeesCtrl.admissionCheckedArry[index].totalFee = total;
      FeesCtrl.admissionCheckedArry[index].discountFlag = true;
      FeesCtrl.admissionCheckedArry[index].discountAmount = discount;
    };
    //Add Fee Category

    //********************************** Create or Update New Record
    FeesCtrl.addFeeCategory = function (invalid) {
      if (invalid) {
        return;
      }
      var data = {
        schoolId: FeesCtrl.schoolId,
        categoryName: FeesCtrl.formFields.categoryName
      };

      if (data) {

        if (FeesCtrl.editmode1) {
          data.id = FeesCtrl.editingcategoryId;
          feesService.updateCategory(data).then(function (result) {
            if (result) {
              //Re initialize the data
              (new Init()).categoryList();
              //Close Modal Window
              FeesCtrl.closeModal1();
              //Clear Fields
              clearformfields();
              //Show Toast
              toastr.success(APP_MESSAGES.UPDATE_SUCCESS);
            }
          }, function (error) {
            if (error) {
              //Close Modal Window
              FeesCtrl.closeModal1();
              //Clear Fields
              clearformfields();
              //Show Toast
              toastr.error(APP_MESSAGES.SERVER_ERROR);
            }
          });
        }
        else {
          feesService.verifycategoryDataExistsOrNot(data).then(function (result) {
            if (result) {
              toastr.error(APP_MESSAGES.DATA_EXISTS_DESC, APP_MESSAGES.DATA_EXISTS);
            }
          }, function (result1) {
            if (result1.status === 404) {
              feesService.CreateCategory(data).then(function (result) {
                if (result) {
                  //Re initialize the data
                  (new Init()).categoryList();
                  //Close Modal Window
                  FeesCtrl.closeModal1();
                  //Clear Fields
                  clearformfields();
                  //Show Toast
                  toastr.success(APP_MESSAGES.INSERT_SUCCESS);
                }
              }, function (error) {
                toastr.error(error, APP_MESSAGES.SERVER_ERROR);
              });
            }
          });
        }
      }
    };
    //validataion
    function formValidations() {
      //total should be more then 0
      if (FeesCtrl.feeSetupModel.feetype == undefined)
        return 'Please Select Fee Type ';

      if (FeesCtrl.feeSetupModel.classId == undefined)
        return 'Please Select Class Name ';
      if (FeesCtrl.feeSetupModel.feeCategoriesId == undefined)
        return 'Please Select Category ';

      if (FeesCtrl.feeSetupModel.mandatory == undefined)
        return 'Please Category Type';

      if (FeesCtrl.feeSetupModel.recursive == undefined)
        return 'Please Select Payment Mode'

      return undefined;
    }
    //Edit Subject
    FeesCtrl.updateCategory = function (index) {
      FeesCtrl.formFields.categoryName = FeesCtrl.categoryList[index].categoryName;
      FeesCtrl.editingcategoryId = FeesCtrl.categoryList[index].id;
      //Open Modal
      FeesCtrl.openModal1();

      $timeout(function () {
        FeesCtrl.editmode1 = true;
      });
    };

    //********************************** Create or Update New Record End
    //********************************** Delete Record
    //Delete Action
    FeesCtrl.viewClass = function () {
      FeesCtrl.feeSetupModel.classId = FeesCtrl.classId;
    }
    var deleteCategory = function (index) {
      if (FeesCtrl.categoryList) {
        feesService.deleteCategory(FeesCtrl.categoryList[index].id).then(function (result) {
          if (result) {
            //On Successfull refill the data list
            (new Init()).categoryList();
            FeesCtrl.closeModal();
            //Show Toast Message Success
            toastr.success(APP_MESSAGES.DELETE_SUCCESS);
          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }
    };
  }).filter('total', function () {
    return function (array) {
      var total = 0;
      angular.forEach(array, function (value, index) {
        if (!isNaN(value.amount))
          total = total + parseFloat(value.amount);
      });
      return total;
    };
  });
