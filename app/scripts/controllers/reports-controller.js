'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:ReportsControllerCtrl
 * @description
 * # ReportsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('ReportsController', function (School, reportsService, Attendance, configService, $cookies, Student, FeeCategory, Class, $filter, $scope, $http, Calendar, Staff, Smsreport, FeePayment, ExpensePayment, feesService, feepaymentdetailsService, $stateParams, Deposit, toastr, $timeout) {
    var ReportsCtrl = this;
    ReportsCtrl.isStudentsReportReady = false;
    ReportsCtrl.holidayList = [];
    ReportsCtrl.studentList = [];
    ReportsCtrl.dueList = [];
    ReportsCtrl.newArray = [];
    ReportsCtrl.classStuDue = [];
    ReportsCtrl.toggle = [];
    ReportsCtrl.ind = [];
    ReportsCtrl.loginId = $cookies.getObject('uds').id;
    ReportsCtrl.schoolId = $cookies.getObject('uds').schoolId;
    ReportsCtrl.ClosingAmountforDay;
    var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
    for (var i = 0; i < roleAccess[0].RolesData.length; i++) {
      if (roleAccess[0].RolesData[i].name === "Reports") {
        ReportsCtrl.ReportsroleView = roleAccess[0].RolesData[i].view;
        ReportsCtrl.ReportsroleEdit = roleAccess[0].RolesData[i].edit;
        ReportsCtrl.Reportsroledelete = roleAccess[0].RolesData[i].delete;
      }


    }
    ReportsCtrl.role = $cookies.get('role');
    ReportsCtrl.arrayPush = [];
    ReportsCtrl.feeexpreData = [];
    ReportsCtrl.expreData = [];

    function Init() {
      this.getClassDetails = function () {
        reportsService.getClassDetailsBySchoolId(ReportsCtrl.schoolId, ReportsCtrl.role, ReportsCtrl.loginId).then(function (result) {
          if (result) {
            ReportsCtrl.classList = result;
          }
        }, function (error) { });
      };
      this.getClassesDetails = function () {
        reportsService.getClassesDetailsBySchoolId(ReportsCtrl.schoolId, ReportsCtrl.role, ReportsCtrl.loginId).then(function (result) {
          if (result) {
            if (Array.isArray(result)) {
              var newArray = result.filter(function (thing, index, self) {
                return self.findIndex(function (t) {
                  return t.class.className === thing.class.className && t.class.sectionName === thing.class.sectionName;
                }) === index;
              });
              ReportsCtrl.classesList = newArray;
            }
          }
        }, function (error) { });
      };
      this.getSchoolList = function () {
        reportsService.getSchoolDataById(ReportsCtrl.schoolId).then(function (result) {
          if (result) {
            ReportsCtrl.schoolData = result;
            ReportsCtrl.schoolSmsCode = ReportsCtrl.schoolData[0].schoolCode ? ReportsCtrl.schoolData[0].schoolCode : 'STUDYM';
            ReportsCtrl.schoolCode = ReportsCtrl.schoolData[0].code;
            ReportsCtrl.apiUrl = ReportsCtrl.schoolData[0].apiUrl;
            ReportsCtrl.apiKey = ReportsCtrl.schoolData[0].apiKey;
            ReportsCtrl.apiUname = ReportsCtrl.schoolData[0].apiUname;
            ReportsCtrl.apiPwd = ReportsCtrl.schoolData[0].apiPwd;
            ReportsCtrl.Dailyfee = ReportsCtrl.schoolData[0].Dailyfee;
            ReportsCtrl.Attendance = ReportsCtrl.schoolData[0].Attendance;
            ReportsCtrl.Classwise = ReportsCtrl.schoolData[0].Classwise;
            ReportsCtrl.Dailyexpense = ReportsCtrl.schoolData[0].Dailyexpense;
            ReportsCtrl.Studtl = ReportsCtrl.schoolData[0].Studtl;
            ReportsCtrl.Stffdtl = ReportsCtrl.schoolData[0].Stffdtl;
            ReportsCtrl.Smsrep = ReportsCtrl.schoolData[0].Smsrep;
            ReportsCtrl.Cusrep = ReportsCtrl.schoolData[0].Cusrep;
            ReportsCtrl.feeDuerep = ReportsCtrl.schoolData[0].feeDuerep;
            ReportsCtrl.absentRep = !ReportsCtrl.schoolData[0].AttendanceAreaRep ? true : false;
            ReportsCtrl.attArearep = ReportsCtrl.schoolData[0].AttendanceAreaRep ? true : false;
          }
        }, function (error) { });
      };
      Calendar.find({
        filter: {
          where: {
            schoolId: ReportsCtrl.schoolId
          }
        }
      }, function (response) {
        ReportsCtrl.holidayList = response;
      }, function (error) { });
    }
    (new Init()).getClassDetails();
    (new Init()).getClassesDetails();
    (new Init()).getSchoolList();
    // (new Init()).getStudentPaymentDetails();
    // (new Init()).getStaffDetails();
    //ng-change for report type
    ReportsCtrl.selectchange = function (report) {
      ReportsCtrl.attenarray = [];
      var reportValue = report;
      if (reportValue == "att") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('userId').style.display = 'block';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "feer") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('classId').style.display = 'block';
        document.getElementById('fromDate').style.display = 'none';
        document.getElementById('toDate').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "feediscr") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('classId').style.display = 'block';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fromDate').style.display = 'none';
        document.getElementById('toDate').style.display = 'none';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.toDate = null;
        ReportsCtrl.formFields.classId = null;
      } else if (reportValue == "feeexpr") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('toDate').style.display = 'block';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "expr") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('toDate').style.display = 'block';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "studentData") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('classId').style.display = 'block';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('fromDate').style.display = 'none';
        document.getElementById('toDate').style.display = 'none';
        document.getElementById('selectall').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('unSelectall').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "staffData") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        ReportsCtrl.selectClass1(ReportsCtrl.formFields.reportId);
        document.getElementById('select_all').style.display = 'block';
        document.getElementById('unSelect_all').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('fromDate').style.display = 'none';
        document.getElementById('toDate').style.display = 'none';
        document.getElementById('selectall').style.display = 'block';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('unSelectall').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "smsr") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('toDate').style.display = 'block';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "customReport") {
        document.getElementById('custom_Expence_Report1').style.display = 'block';
        document.getElementById('custom_Expence_Report').style.display = 'block';
        document.getElementById('custom_Report').style.display = 'block';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('toDate').style.display = 'block';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "feedueReport") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fromDate').style.display = 'none';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('toDate').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        // document.getElementById('expandAll').style.display = 'block';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = null;
        ReportsCtrl.formFields.toDate = null;
      } else if (reportValue == "absentReport") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'block';
        document.getElementById('toDate').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        // document.getElementById('expandAll').style.display = 'block';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = new Date();
        ReportsCtrl.formFields.toDate = null;
      }
      else if (reportValue == "attAreaWiseReport") {
        document.getElementById('custom_Expence_Report1').style.display = 'none';
        document.getElementById('custom_Expence_Report').style.display = 'none';
        document.getElementById('custom_Report').style.display = 'none';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('userId').style.display = 'none';
        document.getElementById('classId').style.display = 'none';
        document.getElementById('toDate').style.display = 'none';
        document.getElementById('feereports_datatable').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'none';
        document.getElementById('feeexpreports_datatable').style.display = 'none';
        document.getElementById('attreports_datatable').style.display = 'none';
        document.getElementById('expreports_datatable').style.display = 'none';
        document.getElementById('detailsExports').style.display = 'none';
        document.getElementById('smsreport_details').style.display = 'none';
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('expandAll').style.display = 'none';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'none';
        // document.getElementById('expandAll').style.display = 'block';
        ReportsCtrl.formFields.userId = null;
        ReportsCtrl.formFields.classId = null;
        ReportsCtrl.formFields.fromDate = new Date();
        ReportsCtrl.formFields.toDate = null;
      }
    }
    ReportsCtrl.userChange = function (user) {
      var userValue = user;
      if (userValue == "userstudent") {
        document.getElementById('classId').style.display = 'block';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('toDate').style.display = 'block';
      } else if (userValue == "userstaff") {
        document.getElementById('classId').style.display = 'none';
        document.getElementById('fromDate').style.display = 'block';
        document.getElementById('toDate').style.display = 'block';
      }
    }
    // option checkbox
    ReportsCtrl.selectAll = function (firstName) {
      document.getElementById('unSelectall').style.display = 'block';
      document.getElementById('selectall').style.display = 'none';
      ReportsCtrl.firstName = true;
      ReportsCtrl.lastName = true;
      ReportsCtrl.rollNo = true;
      ReportsCtrl.bloodGroup = true;
      ReportsCtrl.gender = true;
      ReportsCtrl.regId = true;
      ReportsCtrl.RFID = true;
      ReportsCtrl.nationalIdType = true;
      ReportsCtrl.nationalId = true;
      ReportsCtrl.contact = true;

      ReportsCtrl.alternateContact = true;
      ReportsCtrl.previousSchool = true;
      ReportsCtrl.isDisable = true;
      ReportsCtrl.status = true;
      ReportsCtrl.religion = true;
      ReportsCtrl.caste = true;
      ReportsCtrl.subCaste = true;
      ReportsCtrl.motherTounge = true;
      ReportsCtrl.currentAddress = true;
      ReportsCtrl.currentCity = true;
      ReportsCtrl.currentPincode = true;
      ReportsCtrl.classofAdmission = true;
      ReportsCtrl.identificationMarks = true;
      ReportsCtrl.type = true;
      ReportsCtrl.created = true;
      ReportsCtrl.fatherName = true;
      ReportsCtrl.fatherContact = true;
      ReportsCtrl.motherName = true;
      ReportsCtrl.email = true;
      ReportsCtrl.dateofBirth = true;
      ReportsCtrl.dateofJoin = true;
      ReportsCtrl.currentState = true;
      ReportsCtrl.motherContact = true;
    }
    //Checkbox ends here
    // Unselect checkbox
    ReportsCtrl.unSelectAll = function (firstName) {
      document.getElementById('selectall').style.display = 'block';
      document.getElementById('unSelectall').style.display = 'none';
      ReportsCtrl.firstName = false;
      ReportsCtrl.lastName = false;
      ReportsCtrl.rollNo = false;
      ReportsCtrl.bloodGroup = false;
      ReportsCtrl.gender = false;
      ReportsCtrl.regId = false;
      ReportsCtrl.RFID = false;
      ReportsCtrl.nationalIdType = false;
      ReportsCtrl.nationalId = false;
      ReportsCtrl.contact = false;
      ReportsCtrl.alternateContact = false;
      ReportsCtrl.previousSchool = false;
      ReportsCtrl.isDisable = false;
      ReportsCtrl.status = false;
      ReportsCtrl.religion = false;
      ReportsCtrl.caste = false;
      ReportsCtrl.subCaste = false;
      ReportsCtrl.motherTounge = false;
      ReportsCtrl.currentAddress = false;
      ReportsCtrl.currentCity = false;
      ReportsCtrl.currentPincode = false;
      ReportsCtrl.classofAdmission = false;
      ReportsCtrl.identificationMarks = false;
      ReportsCtrl.squalification = false;
      ReportsCtrl.qualifiedUniversity = false;
      ReportsCtrl.percentage = false;

      ReportsCtrl.type = false;
      ReportsCtrl.created = false;
      ReportsCtrl.fatherName = false;
      ReportsCtrl.fatherContact = false;
      ReportsCtrl.motherName = false;
      ReportsCtrl.email = false;
      ReportsCtrl.dateofBirth = false;
      ReportsCtrl.dateofJoin = false;
      ReportsCtrl.currentState = false;
      ReportsCtrl.motherContact = false;
    }
    // ends here
    // option checkbox
    ReportsCtrl.select_All = function (firstName) {
      document.getElementById('unSelect_all').style.display = 'block';
      document.getElementById('select_all').style.display = 'none';
      ReportsCtrl.firstName = true;
      ReportsCtrl.lastName = true;
      ReportsCtrl.email = true;
      ReportsCtrl.gender = true;
      ReportsCtrl.dateofBirth = true;
      ReportsCtrl.dateofJoin = true;
      ReportsCtrl.regId = true;
      ReportsCtrl.RFID = true;
      ReportsCtrl.contact = true;
      ReportsCtrl.alternateContact = true;
      ReportsCtrl.squalification = true;
      ReportsCtrl.qualifiedUniversity = true;
      ReportsCtrl.percentage = true;
      ReportsCtrl.currentAddress = true;
      ReportsCtrl.currentCity = true;
      ReportsCtrl.currentState = true;
      ReportsCtrl.currentPincode = true;
      ReportsCtrl.nationalIdType = true;
      ReportsCtrl.nationalId = true;
      ReportsCtrl.motherTounge = true;
      ReportsCtrl.bloodGroup = true;
    }
    //Checkbox ends here
    // Unselect checkbox
    ReportsCtrl.unSelect_All = function (firstName) {
      document.getElementById('select_all').style.display = 'block';
      document.getElementById('unSelect_all').style.display = 'none';
      ReportsCtrl.firstName = false;
      ReportsCtrl.lastName = false;
      ReportsCtrl.email = false;
      ReportsCtrl.gender = false;
      ReportsCtrl.dateofBirth = false;
      ReportsCtrl.dateofJoin = false;
      ReportsCtrl.regId = false;
      ReportsCtrl.RFID = false;
      ReportsCtrl.contact = false;
      ReportsCtrl.alternateContact = false;
      ReportsCtrl.squalification = false;
      ReportsCtrl.qualifiedUniversity = false;
      ReportsCtrl.percentage = false;
      ReportsCtrl.currentAddress = false;
      ReportsCtrl.currentCity = false;
      ReportsCtrl.currentState = false;
      ReportsCtrl.currentPincode = false;
      ReportsCtrl.nationalIdType = false;
      ReportsCtrl.nationalId = false;
      ReportsCtrl.motherTounge = false;
      ReportsCtrl.bloodGroup = false;

    }
    // ends here
    //slice and dice student list in hierarchical data structure
    ReportsCtrl.innerTable = function (res) {
      res.map(function (student) {
        ReportsCtrl.attenReports.map(function (attendence) {
          if (student.RFID === attendence.RFID) {
            var obj = {
              "Pdate": attendence.DT,
              "attendencestatus": "Present",
              "inTime": attendence.DOT,
              "outTime": attendence.DOT
            };
            var filteredCount = student['attendenceStats'].filter(function (item) {
              return item["Pdate"] === attendence.DT;
            })
            if (student['attendenceStats'].length === 0 || filteredCount.length === 0) {
              student['attendenceStats'].push(obj);
              student['presentDays'] += 1;
            } else {
              student['attendenceStats'].map(function (item) {
                if (item['Pdate'] === attendence.DT) {
                  if (item['inTime'] > attendence.DOT) item['inTime'] = attendence.DOT;
                  else if (item['outTime'] < attendence.DOT) item['outTime'] = attendence.DOT;
                }
              })
            }
          }
        })
      });
      ReportsCtrl.isStudentsReportReady = true;
    }


    ReportsCtrl.subtractPublicHolidays = function () {
      var startDate = ReportsCtrl.formFields.fromDate.getDate() + '/' + Number(ReportsCtrl.formFields.fromDate.getMonth() + 1) + '/' + ReportsCtrl.formFields.fromDate.getFullYear();
      var endDate = ReportsCtrl.formFields.toDate.getDate() + '/' + Number(ReportsCtrl.formFields.toDate.getMonth() + 1) + '/' + ReportsCtrl.formFields.toDate.getFullYear();
      ReportsCtrl.holidayList.map(function (item) {
        var holiday = new Date(item.date);
        if ((holiday.getTime() >= ReportsCtrl.formFields.fromDate.getTime() && holiday.getTime() <= ReportsCtrl.formFields.toDate.getTime()) && ReportsCtrl.diffDays > 0) {
          ReportsCtrl.diffDays--;
        }
      });
    }
    // dates repeat start
    ReportsCtrl.RepeatOfDates = function (fromDate, toDate) {
      var f = fromDate;
      var t = toDate;
      var dd1 = f.getDate();
      var mm1 = f.getMonth(); //January is 0!
      var yyyy1 = f.getFullYear();
      var dd2 = t.getDate();
      var mm2 = t.getMonth(); //January is 0!
      var yyyy2 = t.getFullYear();

      // Returns an array of dates between the two dates
      var getDates = function (f, t) {
        // ReportsCtrl.show = [];
        var dates = [],
          currentDate = f,
          addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
          };
        while (currentDate <= t) {
          dates.push(currentDate);
          currentDate = addDays.call(currentDate, 1);
        }
        return dates;
      };

      // Usage
      var dates = getDates(new Date(yyyy1, mm1, dd1), new Date(yyyy2, mm2, dd2));
      var show = [];
      dates.forEach(function (date) {
        show.push(date);
        ReportsCtrl.showdate1 = dates;
      });
      var filterDates = [];
      for (var i = 0; i < ReportsCtrl.showdate1.length; i++) {
        if ($filter('date')(ReportsCtrl.showdate1[i], "EEE") !== 'Sun') {
          filterDates.push(ReportsCtrl.showdate1[i]);
        } else { };
      }
      ReportsCtrl.showdate = filterDates;
    }


    //checking row data end
    ReportsCtrl.CalculateTotalWorkingDays = function (d1, d2) {
      var count = 0;
      var startDate = new Date(d1);
      var endDate = new Date(d2);
      var curDate = startDate;
      while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0)
          count++;
        curDate.setDate(curDate.getDate() + 1);
      }
      ReportsCtrl.diffDays = count;
    }
    ReportsCtrl.calculateFeeExp = function (data) {
      ReportsCtrl.TotalPaidAmount = _.sumBy(data, 'paidAmount');
    }


    ReportsCtrl.statusTable = function (record) {
      for (var i = 0; i < record.length; i++) {
        for (var d = 0; d < ReportsCtrl.showdate.length; d++) {
          var oobj = {
            "Pdate": $filter('date')(ReportsCtrl.showdate[d], "yyyy/MM/dd"),
            "attendencestatus": "absent",
            "inTime": "",
            "outTime": ""
          }
          record[i].statusofAttendence.push(oobj);
        }
        for (var q = 0; q < record[i].statusofAttendence.length; q++) {
          for (var a = 0; a < record[i].attendenceStats.length; a++) {
            if (record[i].statusofAttendence[q].Pdate === record[i].attendenceStats[a].Pdate) {
              record[i].statusofAttendence[q] = record[i].attendenceStats[a];
            }
          }
        }
      }
    }
    // New reports Staff Export Ends
    ReportsCtrl.reportView = function (report) {
      ReportsCtrl.attenarray = [];
      var reportValue = report;
      var userid = ReportsCtrl.formFields.userId;
      if (reportValue == "att" && userid == "userstudent") {
        document.getElementById('attreports_datatable').style.display = 'block';
        document.getElementById('feereports_datatable').style.display = 'hide';
        document.getElementById('fee_due_report').style.display = 'none';
        var reportid = ReportsCtrl.formFields.reportId;

        var classId = ReportsCtrl.formFields.classId;
        var fromDate = ReportsCtrl.formFields.fromDate;
        var toDate = ReportsCtrl.formFields.toDate;
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        ReportsCtrl.date1 = $filter('date')(fromDate, 'yyyy/MM/dd');
        ReportsCtrl.date2 = $filter('date')(toDate, 'yyyy/MM/dd');

        ReportsCtrl.CalculateTotalWorkingDays(ReportsCtrl.formFields.fromDate, ReportsCtrl.formFields.toDate);
        ReportsCtrl.subtractPublicHolidays();

        Student.find({
          filter: {
            where: {
              classId: classId
            },
            include: 'class'
          }
        }, function (responseOuter) {
          responseOuter.map(function (item) {
            item['attendenceStats'] = [];
            item['presentDays'] = 0;
          });
          $http({
            "method": "GET",
            "url": configService.baseUrl() + '/Attendances/reportAttendances?SID=' + ReportsCtrl.schoolCode + '&fromDate=' + ReportsCtrl.date1 + '&toDate=' + ReportsCtrl.date2,
            "headers": {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }).then(function (response) {
            ReportsCtrl.attenReports = response.data.reports;
            for (var i = 0; i < ReportsCtrl.attenReports.length; i++) {

              ReportsCtrl.attenarray.push(ReportsCtrl.attenReports[i].RFID);
            }
            ReportsCtrl.innerTable(responseOuter);
            ReportsCtrl.studentList = responseOuter;
          });
        }

        );

      }
      if (reportValue == "att" && userid == "userstaff") {
        document.getElementById('attreports_datatable').style.display = 'block';
        document.getElementById('feereports_datatable').style.display = 'hide';
        document.getElementById('fee_due_report').style.display = 'none';
        var reportid = ReportsCtrl.formFields.reportId;
        var classId = ReportsCtrl.formFields.classId;
        var fromDate = ReportsCtrl.formFields.fromDate;
        var toDate = ReportsCtrl.formFields.toDate;
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        ReportsCtrl.date1 = $filter('date')(fromDate, 'yyyy/MM/dd');
        ReportsCtrl.date2 = $filter('date')(toDate, 'yyyy/MM/dd');

        ReportsCtrl.RepeatOfDates(ReportsCtrl.formFields.fromDate, ReportsCtrl.formFields.toDate);

        ReportsCtrl.CalculateTotalWorkingDays(ReportsCtrl.formFields.fromDate, ReportsCtrl.formFields.toDate);
        ReportsCtrl.subtractPublicHolidays();

        if (ReportsCtrl.role === "Staff") {
          Staff.find({
            filter: {
              where: {
                schoolId: ReportsCtrl.schoolId,
                id: ReportsCtrl.loginId
              }
            }
          }, function (responseOuter) {
            responseOuter.map(function (item) {
              item['attendenceStats'] = [];
              item['presentDays'] = 0;
              item['statusofAttendence'] = [];
            });
            $http({
              "method": "GET",
              "url": configService.baseUrl() + '/Attendances/reportAttendances?SID=' + ReportsCtrl.schoolCode + '&fromDate=' + ReportsCtrl.date1 + '&toDate=' + ReportsCtrl.date2,
              "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json"
              }
            }).then(function (response) {
              ReportsCtrl.attenReports = response.data.reports;
              for (var i = 0; i < ReportsCtrl.attenReports.length; i++) {

                ReportsCtrl.attenarray.push(ReportsCtrl.attenReports[i].RFID);
              }
              ReportsCtrl.innerTable(responseOuter);

              ReportsCtrl.statusTable(responseOuter);

              ReportsCtrl.studentList = responseOuter;
            });
          }

          );

        } else {
          Staff.find({
            filter: {
              where: {
                schoolId: ReportsCtrl.schoolId
              }
            }
          }, function (responseOuter) {
            responseOuter.map(function (item) {
              item['attendenceStats'] = [];
              item['presentDays'] = 0;
              item['statusofAttendence'] = [];
            });
            $http({
              "method": "GET",
              "url": configService.baseUrl() + '/Attendances/reportAttendances?SID=' + ReportsCtrl.schoolCode + '&fromDate=' + ReportsCtrl.date1 + '&toDate=' + ReportsCtrl.date2,
              "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json"
              }
            }).then(function (response) {
              ReportsCtrl.attenReports = response.data.reports;
              for (var i = 0; i < ReportsCtrl.attenReports.length; i++) {

                ReportsCtrl.attenarray.push(ReportsCtrl.attenReports[i].RFID);
              }
              ReportsCtrl.innerTable(responseOuter);
              ReportsCtrl.statusTable(responseOuter);

              ReportsCtrl.studentList = responseOuter;

            });
          }

          );
        }

      } else if (reportValue == "feer") {
        document.getElementById('fee_due_report').style.display = 'none';
        if (ReportsCtrl.formFields.classId == undefined) {
          alert('Please Select Class');
          return
        }
        ReportsCtrl.cid = ReportsCtrl.formFields.classId;
        document.getElementById('feereports_datatable').style.display = 'block';
        document.getElementById('fromDate').style.display = 'hide';
        document.getElementById('toDate').style.display = 'hide';
        feesService.getStudentPayments(ReportsCtrl.schoolId, ReportsCtrl.role, ReportsCtrl.loginId, ReportsCtrl.cid).then(function (result) {
          if (result) {
            ReportsCtrl.studFeeData = result.students;
            ReportsCtrl.totalAmount = _.sumBy(ReportsCtrl.studFeeData, 'total');
            ReportsCtrl.discAmount = _.sumBy(ReportsCtrl.studFeeData, 'discount');
            ReportsCtrl.paybleAmount = _.sumBy(ReportsCtrl.studFeeData, 'payable');
            ReportsCtrl.paidAmount = _.sumBy(ReportsCtrl.studFeeData, 'paid');
            ReportsCtrl.dueAmount = _.sumBy(ReportsCtrl.studFeeData, 'due');

          }
        }, function (error) {
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });

      } else if (reportValue == "feediscr") {
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('feediscreports_datatable').style.display = 'block';
        ReportsCtrl.totalDisc = 0;
        ReportsCtrl.newArray = [];
        $http({
          "method": "GET",
          "url": configService.baseUrl() + '/discounts/discountReports?schoolId=' + ReportsCtrl.schoolId + '&classId=' + ReportsCtrl.formFields.classId,
          "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }).then(function (response) {
          ReportsCtrl.discounts = response.data.report;
          for (var x in ReportsCtrl.discounts) {
            for (var y in ReportsCtrl.newArray) {
              var found = false;
              if (ReportsCtrl.discounts[x].feeSetupId == ReportsCtrl.newArray[y].feeSetupId && ReportsCtrl.discounts[x].studentId == ReportsCtrl.newArray[y].studentId) {
                ReportsCtrl.newArray[y].discount += ReportsCtrl.discounts[x].discount;
                found = true;
                break;

              }
            }
            if (!found) {
              ReportsCtrl.newArray.push(ReportsCtrl.discounts[x]);
            }
          }

          _.each(ReportsCtrl.newArray, function (element) {
            if (element.feeSetupId != "") {
              ReportsCtrl.totalDisc += element.discount;
            }
          });
        });
      } else if (reportValue == "feeexpr") {
        var fromDate = ReportsCtrl.formFields.fromDate;
        var toDate = ReportsCtrl.formFields.toDate;


        ReportsCtrl.date3 = $filter('date')(fromDate, 'yyyy-MM-dd');
        ReportsCtrl.date4 = $filter('date')(toDate, 'yyyy-MM-dd');
        var ddate3 = ReportsCtrl.date3;
        var dddate3 = ReportsCtrl.date4;

        ReportsCtrl.getDateArray(ddate3, dddate3);

        document.getElementById('feeexpreports_datatable').style.display = 'block';
        document.getElementById('fee_due_report').style.display = 'none';

      } else if (reportValue == "expr") {
        document.getElementById('fee_due_report').style.display = 'hide';
        var fromDate = ReportsCtrl.formFields.fromDate;
        var toDate = ReportsCtrl.formFields.toDate;


        // ReportsCtrl.date5 = $filter('date')(fromDate, 'yyyy-MM-dd');
        // ReportsCtrl.date6 = $filter('date')(toDate, 'yyyy-MM-dd');
        // var ddate5 = ReportsCtrl.date5;
        // var dddate5 = ReportsCtrl.date6;

        ReportsCtrl.getDateArray1(fromDate, toDate);


        document.getElementById('expreports_datatable').style.display = 'block';
        document.getElementById('fee_due_report').style.display = 'none';

      } else if (reportValue == "customReport") {
        document.getElementById('fee_due_report').style.display = 'none';
        var fromDate = ReportsCtrl.formFields.fromDate;
        var toDate = ReportsCtrl.formFields.toDate;
        ReportsCtrl.fdate = $filter('date')(fromDate, 'dd-MM-yyyy');
        ReportsCtrl.tdate = $filter('date')(toDate, 'dd-MM-yyyy');
        var parts = ReportsCtrl.fdate.split('-');
        var fromdate = parts[2] + "-" + parts[1] + "-" + parts[0];
        var fromdates = $filter('date')(new Date(fromdate), 'dd-MM-yyyy');
        var partss = ReportsCtrl.tdate.split('-');
        var todate = partss[2] + "-" + partss[1] + "-" + partss[0];
        var fromDate = $filter('date')(new Date(), "dd-MM-yyyy");
        // Previous dates in javascript
        var fromDate = ReportsCtrl.formFields.fromDate;
        ReportsCtrl.sDate = $filter('date')(fromDate, 'yyyy-MM-dd 00:00:00');
        var toDate = ReportsCtrl.formFields.toDate;
        ReportsCtrl.eDate = $filter('date')(toDate, 'yyyy-MM-dd 23:59:59');
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var lastD = Date.parse(new Date(fromdate)) - oneDay;

        //custom remote method
        reportsService.getCustomFeeReportdetails(ReportsCtrl.schoolId, ReportsCtrl.sDate, ReportsCtrl.eDate).then(function (result) {
          if (result) {
            ReportsCtrl.customFeeReport = result;
            // console.log(result);
          }
        }, function (error) {
          console.log(error);
        });
        //ends
        School.find({
          filter: {
            where: {
              id: ReportsCtrl.schoolId
            }
          }
        }, function (response) {
          ReportsCtrl.studSchoolList = response;
        });

      } else if (reportValue == "studentData") {
        document.getElementById('detailsExports').style.display = 'block';
        document.getElementById('fee_due_report').style.display = 'none';
        ReportsCtrl.cid = ReportsCtrl.formFields.classId;
        Student.find({
          filter: {
            where: {
              schoolId: ReportsCtrl.schoolId,
              classId: ReportsCtrl.cid
            }
          }
        }, function (response) {
          ReportsCtrl.studentDetails = response;
        }, function (error) { })
      } else if (reportValue == "staffData") {
        document.getElementById('fee_due_report').style.display = 'none';
        document.getElementById('staffdetailsExports').style.display = 'block';
        ReportsCtrl.cid = ReportsCtrl.formFields.classId;
        Staff.find({
          filter: {
            where: {
              schoolId: ReportsCtrl.schoolId
            }
          }
        }, function (response) {
          ReportsCtrl.studentDetails = response;
        }, function (error) { })
      } else if (reportValue == "feedueReport") {
        ReportsCtrl.dueFeeT = 0;
        ReportsCtrl.newArray = [];
        document.getElementById('fee_due_report').style.display = 'block';
        document.getElementById('expandAll').style.display = 'block';
        document.getElementById('collapseAll').style.display = 'none';
        document.getElementById('mailNotify').style.display = 'block';
        feesService.getStudentPayments(ReportsCtrl.schoolId, ReportsCtrl.role, ReportsCtrl.loginId).then(function (result) {
          if (result) {
            ReportsCtrl.studentdueList = result.students;
            // console.log(ReportsCtrl.studentdueList);
            ReportsCtrl.sumoftot = _.sumBy(ReportsCtrl.studentdueList, 'total');
            ReportsCtrl.sumofdisc = _.sumBy(ReportsCtrl.studentdueList, 'discount');
            ReportsCtrl.sumofpaid = _.sumBy(ReportsCtrl.studentdueList, 'paid');
            ReportsCtrl.payTillNow = _.sumBy(ReportsCtrl.studentdueList, 'payTillNow');
            ReportsCtrl.sumofdue = _.sumBy(ReportsCtrl.studentdueList, 'due');
            ReportsCtrl.sumofdueTillNow = _.sumBy(ReportsCtrl.studentdueList, 'dueTillNow');
            ReportsCtrl.sumofdueTMinusPaid = ReportsCtrl.sumofdueTillNow - ReportsCtrl.payTillNow
            for (var x in ReportsCtrl.studentdueList) {
              for (var y in ReportsCtrl.newArray) {
                var found = false;
                if (ReportsCtrl.studentdueList[x].classId == ReportsCtrl.newArray[y].classId) {
                  ReportsCtrl.newArray[y].dueTillNow += ReportsCtrl.studentdueList[x].dueTillNow;
                  ReportsCtrl.newArray[y].payTillNow += ReportsCtrl.studentdueList[x].payTillNow;
                  found = true;
                  break;

                }
              }
              if (!found) {
                ReportsCtrl.newArray.push(ReportsCtrl.studentdueList[x]);
              }
            }
          }
        }, function (error) {
          // console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        })
        // $http({
        //   "method": "GET",
        //   "url": configService.baseUrl() +'/FeePayments/feeDueReport?schoolId=' + ReportsCtrl.schoolId,
        //   "headers": {
        //     "Content-Type": "application/json",
        //     "Accept": "application/json"
        //   }
        // }).then(function (response) {
        //   console.log(response.data);
        // })

      } else if (reportValue == "smsr") {
        document.getElementById('smsreport_details').style.display = 'block';
        document.getElementById('fee_due_report').style.display = 'none';
        var fromDate = ReportsCtrl.formFields.fromDate;
        ReportsCtrl.nowDate = $filter('date')(fromDate, 'dd-MM-yyyy');

        var toDate = ReportsCtrl.formFields.toDate;
        ReportsCtrl.nextDate = $filter('date')(toDate, 'dd-MM-yyyy');
        var start = Date.parse(fromDate);
        var end = Date.parse(toDate);
        if (start > end) {
          alert("from date should be greater than to date");
          return;
        }

        var dates = [],
          currentDate = ReportsCtrl.formFields.fromDate,
          addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
          };
        while (currentDate <= ReportsCtrl.formFields.toDate) {
          dates.push($filter('date')(new Date(currentDate), 'dd-MM-yyyy'));
          currentDate = addDays.call(currentDate, 1);
        }
        ReportsCtrl.datesLength = dates.length;
        var dataSms = [];

        async.each(dates, function (chuck, ccb) {
          // console.log(chuck);
          Smsreport.find({
            filter: {
              where: {
                schoolId: ReportsCtrl.schoolId,
                date: chuck
              }
            }
          }, function (response) {
            if (response.length > 0) {
              response.map(function (item) {
                dataSms.push(item);
                ReportsCtrl.AttensmsreportData = _.filter(dataSms, { "smstype": "AttendanceSms" }).length;
                // console.log(ReportsCtrl.AttensmsreportData);
                ReportsCtrl.feesmsreportData = _.filter(dataSms, { "smstype": "feeReceipt" }).length;
                console.log(ReportsCtrl.feesmsreportData);
                ReportsCtrl.generalsmsreportData = _.filter(dataSms, { 'smstype': 'generalSms' }).length;
                // console.log(ReportsCtrl.generalsmsreportData);
              })
              ccb();
            } else {
              ccb();
            }
          });
        }, function (error) {

        })

      } else if (reportValue == "absentReport") {
        // console.log(ReportsCtrl.formFields.classId);
        // console.log(reportValue);
        var date = $filter('date')(ReportsCtrl.formFields.fromDate, 'yyyy/MM/dd');  //   date- 2018/09/25
        // console.log(date);
        Attendance.find({ filter: { where: { DT: date } } }, function (attResult) {
          // console.log(attResult);
          Student.find({ filter: { where: { schoolId: ReportsCtrl.schoolId } } }, function (studentResult) {
            // console.log(studentResult);
            studentResult.map(function (item) {
              item.present = false;
              if (item.RFID) {
                attResult.map(function (rfid) {
                  if (rfid.RFID === item.RFID) {
                    item.present = true;
                  }
                })
              }
            })
            angular.copy(ReportsCtrl.classList, ReportsCtrl.attenarray)
            ReportsCtrl.attenarray.map(function (cls) {
              cls.studentList = [];
              var count = 0;
              studentResult.map(function (stu) {
                if (cls.id === stu.classId) {
                  cls.studentList.push(stu);
                  if (!stu.present) {
                    count++;
                    cls.absentCount = count;
                  }
                }
              })
            })
            ReportsCtrl.attenarray = ReportsCtrl.attenarray.map(function(m) {
              return m.absentCount > 0;
              // return m !== 5;
            });
            console.log(ReportsCtrl.attenarray);

          })
        })
      }
      // attAreaWiseReport
      else if (reportValue == "attAreaWiseReport") {
        // console.log("asd");
        var data = [], location = [];
        var date = ($filter('date')(ReportsCtrl.formFields.fromDate, 'yyyy/MM/dd'));
        Attendance.find({ filter: { where: { DT: date } } }, function (attResult) {
          // console.log(attResult);
          Student.find({ filter: { where: { schoolId: ReportsCtrl.schoolId }, include: 'class' } }, function (stuResult) {
            // console.log(stuResult);
            //start
            stuResult.map(function (student) {
              student.attendanceShow = false;
              attResult.map(function (Rf) {
                if (Rf.RFID === student.RFID) {
                  student.attendanceShow = true;
                }
              })
            })
            //end
            stuResult.map(function (student) {
              if (!student.attendanceShow) {
                data.push(student);
                if (student.currentCity === null || student.currentCity === "") {
                  location.push({ location: "other" });
                } else {
                  location.push({ location: student.currentCity.toLowerCase() });
                }
              }
            })
            // console.log(data);
            location = _.uniqBy(location, 'location');
            // console.log(location);
            location.map(function (item) {
              item.studentList = [];
              data.map(function (item2) {
                if (item2.currentCity) {
                  if (item.location.toLowerCase() === item2.currentCity.toLowerCase()) {
                    item.studentList.push(item2);
                  }
                } else {
                  if (item.location === "other") {
                    item.studentList.push(item2);
                  }
                }
              })
            })
            // console.log(location);
            ReportsCtrl.attenarray = location;
            // console.log(ReportsCtrl.attenarray);
          })
        })
      }

    }
    ReportsCtrl.getDateArray = function (start, end) {
      var
        arr = new Array(),
        dt = new Date(start);
      var adt = new Date(end);

      while (dt <= adt) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }
      for (var i = 0; i < arr.length; i++) {

        ReportsCtrl.formatArr = $filter('date')(arr[i], 'yyyy-MM-dd');
        // console.log(ReportsCtrl.formatArr);
        FeePayment.find({ filter: { where: { schoolId: ReportsCtrl.schoolId, payDate: { between: [ReportsCtrl.formatArr + "T" + "00:00:00", ReportsCtrl.formatArr + "T" + "23:59:00"] } }, include: 'student' } }, function (response) {
          // FeePayment.find({
          //   filter: {
          //     where: {
          //       schoolId: ReportsCtrl.schoolId,
          //       payDate: {
          //         between: [start, end]
          //       }
          //     },
          //     include: 'student'
          //   }
          // }, function (response) {
          // console.log(response);
          var sumofpaidAmoun = _.sumBy(response, 'paidAmount');

          ReportsCtrl.feeexpreData.push({
            "payDate": response[0].payDate,
            "TotalPaidAmount": sumofpaidAmoun,
            "date": [response]
          });
          console.log(ReportsCtrl.feeexpreData);
        }, function (error) {

        });
      }
      return arr;
    }
    $scope.orderByCustom = function (data) {
      var date = $filter('date')(data.payDate, "dd-MM-yyyy");
      console.log(date);
      // var parts2 = (data.payDate.substring(8, 10));
      // var parts1 = data.payDate.substring(5, 7);
      // var parts = data.payDate.substring(0, 4);
      // console.log(parts);
      // console.log(parts2);
      // console.log(parts1);
      // var concatdate =parts2 + "-" + parts1 + "-" + parts;
      // console.log(concatdate);
      // return concatdate;
      var parts = date.split('-');
      var concatdate = parts[2] + "-" + parts[1] + "-" + parts[0];
      //  console.log(concatdate);
      return concatdate;
    };
    $scope.orderByRollNo = function (data) {
      var date = data.rollNo;
      return date;
    }
    //   $scope.sortComment = function(comment) {
    //     var date = new Date(comment.date1);
    //     return date;
    // };
    ReportsCtrl.getDateArray1 = function (from, to) {
      var fromDate = new Date(from);
      fromDate.setHours(5, 30, 0, 0);
      var toDate = new Date(to);
      toDate.setHours(5, 30, 0, 0);
      toDate.setDate(toDate.getDate() + 1)
      reportsService.dailyExpenceReport(ReportsCtrl.schoolId, fromDate.toISOString(), toDate.toISOString()).then(function (success) {
        // ReportsCtrl.expreData = success;
        var temp_dateObjects = _.groupBy(success, 'date');
        var myArray = [];
        for (var date in temp_dateObjects) {

          myArray.push({ date: date, TotalPaidAmount: _.sumBy(temp_dateObjects[date], 'amount'), data: temp_dateObjects[date] });
        }
        ReportsCtrl.expreData = myArray;
        // console.log(ReportsCtrl.expreData);
        // var temp_dateObjects = _.groupBy(success, 'date');
      }).catch(function (err) {
        console.log(err)
      })
      // var
      //   arr = new Array(),
      //   dt = new Date(start);
      // var adt = new Date(end);

      // while (dt <= adt) {
      //   arr.push(new Date(dt));
      //   dt.setDate(dt.getDate() + 1);
      // }
      // for (var i = 0; i < arr.length; i++) {

      //   ReportsCtrl.formatArr1 = $filter('date')(arr[i], 'dd-MM-yyyy');

      //   ExpensePayment.find({
      //     filter: {
      //       where: {
      //         schoolId: ReportsCtrl.schoolId,
      //         date: {
      //           between: [ReportsCtrl.formatArr1, ReportsCtrl.formatArr1]
      //         }
      //       }
      //     }
      //   }, function (response) {

      //     var sumofpaidAmoun = _.sumBy(response, 'amount');


      //     ReportsCtrl.expreData.push({
      //       "date": response[0].date,
      //       "TotalPaidAmount": sumofpaidAmoun
      //     });

      //   }, function (error) {

      //   });
      // }

      // return arr;
    }
    ReportsCtrl.Bhasha = function (d) {
      FeePayment.find({
        filter: {
          where: {
            schoolId: ReportsCtrl.schoolId,
            payDate: {
              between: [d + " - " + "00:00:00", d + " - " + "23:59:00"]
            }
          },
          include: ['student']
        }
      }, function (response) {
        ReportsCtrl.insideTable = response;
      }, function (error) {

      });
    }
    ReportsCtrl.insideTables = function (d) {
      ExpensePayment.find({
        filter: {
          where: {
            schoolId: ReportsCtrl.schoolId,
            date: {
              between: [d, d]
            }
          }
        }
      }, function (response) {
        ReportsCtrl.exprTable = response;
      }, function (error) {

      });
    }
    ReportsCtrl.selectClass = function (roleId) {
      if (roleId == "studentData") {
        ReportsCtrl.unSelectAll();
        ReportsCtrl.selectedValue = true;
        document.getElementById('detailsExports').style.display = 'block';
        ReportsCtrl.cid = ReportsCtrl.formFields.classId;
        Student.find({
          filter: {
            where: {
              schoolId: ReportsCtrl.schoolId,
              classId: ReportsCtrl.cid
            }
          }
        }, function (response) {
          ReportsCtrl.studentDetails = response;
        }, function (error) { })
      } else {
        ReportsCtrl.selectedValue = false;
      }
    }
    //Select staff details
    ReportsCtrl.selectClass1 = function (roleId) {
      if (roleId == "staffData") {
        ReportsCtrl.unSelectAll();
        ReportsCtrl.selectedValue1 = true;
        document.getElementById('staffdetailsExports').style.display = 'block';
        // ReportsCtrl.cid = ReportsCtrl.formFields.classId;
        Staff.find({
          filter: {
            where: {
              schoolId: ReportsCtrl.schoolId,
              // classId: ReportsCtrl.cid
            }
          }
        }, function (response) {
          ReportsCtrl.staffDetails = response;
        }, function (error) { })
      } else {
        ReportsCtrl.selectedValue1 = false;
      }
    }
    // ends here
    //Export To Excel
    ReportsCtrl.printData = function () {
      var divToPrint = document.getElementById("feereports_datatable");
      ReportsCtrl.newWin = window.open("");
      ReportsCtrl.newWin.document.write(divToPrint.outerHTML);
      ReportsCtrl.newWin.print();
      ReportsCtrl.newWin.close();
    }
    $(document).ready(function () {
      $("#btnExport1").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('feereports_datatable');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'fee_report' + '.xls';
        a.click();
      });
      $("#btnExport").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('attreports_datatable1');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'Atten_report' + '.xls';
        a.click();
      });
      $("#btnExport2").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('feediscreports_datatable');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'feediscount_report' + '.xls';
        a.click();
      });
      $("#btnExport3").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('feeexpreports_datatable');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'fee_report' + '.xls';
        a.click();
      });
      $("#btnExport4").click(function (e) {
        console.log(e)
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('student_details');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'Student_details_report' + '.xls';
        a.click();
      });
      $("#btnExport5").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('expreports_datatable');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'Expenses_report' + '.xls';
        a.click();
      });
      $("#btnExport6").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('export_all');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'Student_details_report' + '.xls';
        a.click();
      });
      $("#btnExport7").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('staff_details');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'Staff_details_report' + '.xls';
        a.click();
      });
      //Fee DUe Report
      $("#btnExport16").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('fee_due_report');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'fee_due_report' + '.xls';
        a.click();
      });
      $("#btnExportAbsent").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('absentRecord');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'absent_report' + '.xls';
        a.click();
      });
      $("#btnExportAttArea").click(function (e) {
        e.preventDefault();

        //getting data from our table
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('attAreaReports_datatable');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'absent_report' + '.xls';
        a.click();
      });
    });

    ReportsCtrl.showStar = function (value, students) {
      if (value > 100) {
        students['showStarMark'] = '*';
      } else {
        // students['showStarMark']='-';
      }
    }
    ReportsCtrl.highlightColor = function (dates, report, x) {
      ReportsCtrl.holidayList.map(function (item) {
        var concatDate = item.year + "/" + item.date.substring(0, 2) + "/" + item.date.substring(3, 5);

        if (report.Pdate == concatDate) {
          report['color'] = 'yellow';
        } else {

          var sunday = new Date(report.Pdate);
          var day = sunday.getDay();
          if (day == 0) {
            report['color'] = 'yellow';
          } else {
            report['color'] = 'lol';
          }
        }
      })
    }
    ReportsCtrl.test = function (students) {
      var matchedPosition = students.rollNo.search(/[a-z]/i);
      if (matchedPosition == -1) {
        var a = Number(students.rollNo);
        students.rolll = a;
        return students.rolll;
      } else {
        var a = students.rollNo;
        students.rolll = a;
        return students.rolll;
      }
    }
    ReportsCtrl.test1 = function (student) {

      var matchedPosition = student.rollNo.search(/[a-z]/i);
      if (matchedPosition == -1) {
        var b = Number(student.rollNo);
        student.roll2 = b;
        return student.roll2;
      } else {
        var b = student.rollNo;
        student.roll2 = b;
        return student.roll2;
      }
    }
    ReportsCtrl.test2 = function (students) {

      var matchedPosition = students.rollNo.search(/[a-z]/i);
      if (matchedPosition == -1) {
        var b = Number(students.rollNo);
        students.roll3 = b;
        return students.roll3;
      } else {
        var b = students.rollNo;
        students.roll3 = b;
        return students.roll3;
      }
    }
    ReportsCtrl.Reportprint = function () {
      console.log("rertyu");
      var divToPrint = document.getElementById("Reportsprint");
      ReportsCtrl.newWin = window.open("");
      ReportsCtrl.newWin.document.write(divToPrint.innerHTML);
      $timeout(function () {
        ReportsCtrl.newWin.print();
        ReportsCtrl.newWin.close();
      }, 1000);
    }
    ReportsCtrl.classReportprint = function () {
      console.log("feer");
      var divToPrint = document.getElementById("feereports_datatable");
      ReportsCtrl.newWin = window.open("");
      ReportsCtrl.newWin.document.write(divToPrint.innerHTML);
      $timeout(function () {
        ReportsCtrl.newWin.print();
        ReportsCtrl.newWin.close();
      }, 1000);
    }
    //   ReportsCtrl.Reportprint1 = function (index) {
    //     School.find({ filter: { where: { id: ReportsCtrl.schoolId } } }, function (response) {
    //       ReportsCtrl.studSchoolList = response;
    //     });
    // }
    //class Wise Fee Due Data
    ReportsCtrl.getDue = function (cid) {
      feesService.getStudentPayments(ReportsCtrl.schoolId, ReportsCtrl.role, ReportsCtrl.loginId, cid).then(function (result) {
        if (result) {
          ReportsCtrl.getDue = [];
          ReportsCtrl.classStuDue.push({ "classStuDue": result.students });
        }
      }, function (error) {
        toastr.error(error, APP_MESSAGES.SERVER_ERROR);
      })
    }
    ReportsCtrl.openAllToggle = function (index) {
      document.getElementById('expandAll').style.display = 'none';
      document.getElementById('collapseAll').style.display = 'block';
      var ii = ReportsCtrl.toggle[index];
      ReportsCtrl.toggle = [];
      for (var i = 0; i < ReportsCtrl.newArray.length; i++) {
        if (index === i) {
          if (ii == true) {
            var ind = true;
          } else {
            var ind = true;
          }
          ReportsCtrl.toggle.push(ind);
        } else {
          var ind = true;
          ReportsCtrl.toggle.push(ind);
        }
      }
    }
    ReportsCtrl.closeAllToggle = function (index) {
      document.getElementById('expandAll').style.display = 'block';
      document.getElementById('collapseAll').style.display = 'none';
      var ii = ReportsCtrl.toggle[index];
      ReportsCtrl.toggle = [];
      for (var i = 0; i < ReportsCtrl.newArray.length; i++) {
        if (index === i) {
          if (ii == true) {
            var ind = false;
          } else {
            var ind = true;
          }
          ReportsCtrl.toggle.push(ind);
        } else {
          var ind = false;
          ReportsCtrl.toggle.push(ind);
        }
      }
    }
    $scope.finalDueTextArray = [];
    ReportsCtrl.mailNotify = function () {
      var enqData = ReportsCtrl.classStuDue;
      _.each(enqData[0].classStuDue, function (enqData1) {
        var duetillDate = enqData1.dueTillNow - enqData1.payTillNow;
        if (duetillDate > 0) {
          var msg = 'Dear parent, This is inform you that, your ward';
          var name = enqData1.name;
          var clss = enqData1.class;
          var section = enqData1.section;
          var msg1 = '-fee has not been cleared for the period';
          var date = $filter('date')(enqData1.dateArray, "dd-MM-yyyy");
          date.sort(function (a, b) {
            var da = new Date(a).getTime();
            var db = new Date(b).getTime();
            return da < db ? -1 : da > db ? 1 : 0
          });
          var firstDate = $filter('date')(date[0], "dd-MM-yyyy");
          var lastDate = $filter('date')(new Date(), "dd-MM-yyyy")
          var To = 'To';
          var amount = '.Hence, we request you to remit Rs.';
          var msg2 = 'at the earliest through cheque/DD/Online payment. Dear Parent, Please clear the fee due as soon as possible. Principal,';
          var sclname = ReportsCtrl.schoolData[0].schoolName;
          var address = ReportsCtrl.schoolData[0].Address ? ReportsCtrl.schoolData[0].Address : ' ';
          var city = ReportsCtrl.schoolData[0].City ? ReportsCtrl.schoolData[0].City : ' ';
          var txt = msg + ' ' + name + ', ' + clss + ' ' + section + ' ' + msg1 + ' ' + firstDate + ' ' + To + ' ' + lastDate + ' ' + amount + ' ' + duetillDate + ' ' + msg2 + ' ' + sclname + ' ' + address + ' ' + city;
          $scope.finalDueTextArray.push({
            text: txt,
            contact: enqData1.contact,
            schoolCode: ReportsCtrl.schoolSmsCode,
            apiUrl: ReportsCtrl.apiUrl,
            apiKey: ReportsCtrl.apiKey,
            apiUname: ReportsCtrl.apiUname,
            apiPwd: ReportsCtrl.apiPwd
          })
        }
      })
      reportsService.sendDueNotification($scope.finalDueTextArray).then(function (success) {
        toastr.success("Message Sent Successfully");
      }).catch(function (err) {
        toastr.error("Message Not Sent");
      })

    }
    ReportsCtrl.changess = function (roll) {
      if (!(isNaN(roll.rollNo))) {
        roll.rollNo = Number(roll.rollNo)
      }
    }
  });
