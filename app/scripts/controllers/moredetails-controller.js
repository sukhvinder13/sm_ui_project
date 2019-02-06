'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:MoredetailsControllerCtrl
 * @description
 * # MoredetailsControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('MoredetailsController', function (configService, moredetailsService, feesService, feepaymentdetailsService, $stateParams, $scope, toastr, APP_MESSAGES, $timeout, $http, $window, $cookies, FeeSetup, Calendar, AcademicBatch, $filter, Class, Student,messagesService) {
    var MoreDetailsCtrl = this;
    MoreDetailsCtrl.studId = $stateParams.id;
    MoreDetailsCtrl.schoolId = $cookies.getObject('uds').schoolId;
    MoreDetailsCtrl.senderId = $cookies.getObject('uds').id;
    MoreDetailsCtrl.studentList = [];
    MoreDetailsCtrl.studClassAtt = [];
    MoreDetailsCtrl.studClassAtt1 = [];
    MoreDetailsCtrl.classRfids = [];
    MoreDetailsCtrl.month = [{
      "month": 5,
      "monthName": "June"
    },
    {
      "month": 6,
      "monthName": "July"
    },
    {
      "month": 7,
      "monthName": "August"
    },
    {
      "month": 8,
      "monthName": "September"
    },
    {
      "month": 9,
      "monthName": "October"
    },
    {
      "month": 10,
      "monthName": "November"
    },
    {
      "month": 11,
      "monthName": "December"
    },
    {
      "month": 0,
      "monthName": "January"
    },
    {
      "month": 1,
      "monthName": "February"
    },
    {
      "month": 2,
      "monthName": "March"
    },
    {
      "month": 3,
      "monthName": "April"
    },
    {
      "month": 4,
      "monthName": "May"
    },
    ];
    var date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth();
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    $scope.firstDay = firstDay;
    $scope.lastDay = lastDay;
    $scope.date = date;

    function Init() {
      this.getStudentData = function () {
        moredetailsService.getStudentData(MoreDetailsCtrl.studId).then(function (result) {
          if (result) {
            // console.log(result);
            MoreDetailsCtrl.studentData = result;
            MoreDetailsCtrl.studentData.classId1 = result[0].classId;
            if (MoreDetailsCtrl.studentData.classId1) {
              (new Init()).getRfid();
            }

          }
        }, function (error) { });
      };

      this.getRfid = function () {
        Student.find({
          filter: {
            where: {
              classId: MoreDetailsCtrl.studentData.classId1
            }
          }
        }, function (response1) {
          MoreDetailsCtrl.studClassAtt = response1;
          MoreDetailsCtrl.classRfids = MoreDetailsCtrl.studClassAtt.map(function (as) {
            return as.RFID;
          });
        });
      };

      this.getMsgId = function () {
        moredetailsService.getMsgid(MoreDetailsCtrl.schoolId).then(function (result) {
          if (result) {
            MoreDetailsCtrl.smsid = result;
            MoreDetailsCtrl.schoolSmsCode = MoreDetailsCtrl.smsid[0].schoolCode;
            MoreDetailsCtrl.schoolapiUrl = MoreDetailsCtrl.smsid[0].apiUrl;
            MoreDetailsCtrl.schoolapiKey = MoreDetailsCtrl.smsid[0].apiKey;
            MoreDetailsCtrl.schoolapiuname = MoreDetailsCtrl.smsid[0].apiUname;
            MoreDetailsCtrl.schoolapipwd = MoreDetailsCtrl.smsid[0].apiPwd;
            // console.log(MoreDetailsCtrl.schoolSmsCode);

          }
        }, function (error) {

        });
      };
      this.getStudentPaymentDetails = function () {
        var Init = this;
        feepaymentdetailsService.getStudentPaymentDetails($stateParams.id).then(function (res) {
          if (res) {
            if (res.paymentMode == undefined || res.paymentMode == '')
              MoreDetailsCtrl.showPaymentModeSelection = true;
            _.each(res.payments, function (payment) {
              if (payment.receiptNumber)
                payment['order_temp'] = parseInt(payment.receiptNumber.split('_')[1]);
              else
                payment['order_temp'] = 0;
            });
            MoreDetailsCtrl.studentDetails = Init.parseData(res);
            // console.log(MoreDetailsCtrl.studentDetails.feeSetup);
            MoreDetailsCtrl.paybleAmount = 0;
            for (var i = 0; i < MoreDetailsCtrl.studentDetails.feeSetup.length; i++) {
              MoreDetailsCtrl.paybleAmount += _.sumBy(MoreDetailsCtrl.studentDetails.feeSetup[i].feeitems, 'payable');
            }
            Init.getFeesetups(MoreDetailsCtrl.studentDetails.classId);
          }
        }, function (error) {
          console.log(error);
          toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      },
        this.parseData = function (data) {
          _.each(data.feeSetup, function (setup) {
            setup.removalble = true;
            _.each(data.payments, function (p) {
              if (p.feeSetupId && setup.setupId == p.feeSetupId) setup.removalble = false;
              if (p.optionalId && setup.optionalId == p.optionalId) setup.removalble = false;
            });
          });
          return data;
        };
      this.getFeesetups = function (classId) {
        feesService.getFeesetups(MoreDetailsCtrl.schoolId, classId).then(function (res) {
          if (res) {
            MoreDetailsCtrl.feesList = res.feeSetup;
            MoreDetailsCtrl.classList = res.classes;
          }
        }, function (error) {
          console.log(error);

        });
      };
      this.getSchoolList = function () {
        moredetailsService.getSchoolDataById(MoreDetailsCtrl.schoolId).then(function (result) {
          if (result) {
            MoreDetailsCtrl.schoolData = result;
            MoreDetailsCtrl.schoolCode = MoreDetailsCtrl.schoolData[0].code;
            MoreDetailsCtrl.fetchingStudentAtt();
          }
        }, function (error) { });
      };
      this.getHolidaysRecords = function () {
        Calendar.find({
          filter: {
            where: {
              schoolId: MoreDetailsCtrl.schoolId
            }
          }
        }, function (response) {
          MoreDetailsCtrl.holidayList = response;
        }, function (error) { });

        AcademicBatch.find({
          filter: {
            where: {
              schoolId: MoreDetailsCtrl.schoolId,
              status: 'Active'
            }
          }
        }, function (response) {
          MoreDetailsCtrl.academicBatchYear = response[0].academicBatch;
          if (response > 0) {
            alert("Please select Academic Batch/Active in Settings");
            return
          }
          MoreDetailsCtrl.academicBatch = response;
          var iSmonth = true,
            year = new Date(MoreDetailsCtrl.academicBatch[0].startDate).getFullYear();
          MoreDetailsCtrl.month.map(function (item) {
            if (item.month == 11) {
              iSmonth = false;
            }
            if (iSmonth) {
              item.StartDate = new Date(year, item.month, 1);
              item.endDate = new Date(year, item.month + 1, 0);
              item.StartDateFormated = $filter('date')(item.StartDate, 'yyyy/MM/dd');
              item.endDateFormated = $filter('date')(item.endDate, 'yyyy/MM/dd');
            } else {
              item.StartDate = new Date(year + 1, item.month, 1);
              item.endDate = new Date(year + 1, item.month + 1, 0);
              item.StartDateFormated = $filter('date')(item.StartDate, 'yyyy/MM/dd');
              item.endDateFormated = $filter('date')(item.endDate, 'yyyy/MM/dd');
            }
            MoreDetailsCtrl.attendenceData = MoreDetailsCtrl.month;
          });
        }, function (error) { });
      };
    }
    (new Init()).getStudentData();
    (new Init()).getMsgId();
    (new Init()).getStudentPaymentDetails();
    (new Init()).getHolidaysRecords();
    (new Init()).getSchoolList();
    // (new Init()).getFeesetups();
    MoreDetailsCtrl.myVar = false;
    MoreDetailsCtrl.toggle = function () {
      MoreDetailsCtrl.myVar = !MoreDetailsCtrl.myVar;
    };
    //Send trough SMS
    var bulkmob = '';
    // console.log(MoreDetailsCtrl.schoolSmsCode);
    MoreDetailsCtrl.sms = function () {
      //    console.log(MoreDetailsCtrl.schoolSmsCode);
      if (MoreDetailsCtrl.smsid !== "") {
        var sender = MoreDetailsCtrl.schoolSmsCode;
      } else {
        var sender = 'studym';
      }
      // console.log(sender);
      bulkmob = MoreDetailsCtrl.studentData[0].contact;
      var uname = 'studym';
      var pswd = 'studym123';
      // var baseurl = 'http://203.212.70.200/smpp/sendsms?username=';
      var msgSubj = MoreDetailsCtrl.formFields.messagesubject;
      var msgData = MoreDetailsCtrl.formFields.message;
      var msg = msgSubj + ' ' + msgData;
      var tDate = new Date();
      MoreDetailsCtrl.todayDate = $filter('date')(tDate, "dd-MM-yyyy");
      var ObjectData = {
        selectedStudents: bulkmob,
        senderCode: sender,
        senderId: MoreDetailsCtrl.senderId,
        schoolId: MoreDetailsCtrl.schoolId,
        studentId:MoreDetailsCtrl.studId,
        text: msg,
        sent_date: tDate,
        date: MoreDetailsCtrl.todayDate,
        apiUrl: MoreDetailsCtrl.schoolapiUrl,
        apiKey: MoreDetailsCtrl.schoolapiKey,
        schoolapiuname: MoreDetailsCtrl.schoolapiuname,
        schoolapipwd: MoreDetailsCtrl.schoolapipwd

      }
      messagesService.sendSMSTriggerd(ObjectData).then(function (success) {

        console.log("SMS success");
        console.log(success);
        clearformfields();
        toastr.success(APP_MESSAGES.MESSAGE_SENT);
      }).catch(function (err1) {
        toastr.error(' SMS failed... try again');
      })
      // var smsurl = baseurl + uname + '&password=' + pswd + '&to=' + bulkmob + '&from=' + sender + '&text=' + msg + '&category=bulk';
      // $timeout(function () {
      //   // $window.location.reload();
      // }, 10000); // trigger download
      // $http({
      //   method: 'POST',
      //   url: smsurl
      // }).
      // success(function (status) {

      // }).
      // error(function (status) {});
    };
    //Clear Fields
    function clearformfields() {
      MoreDetailsCtrl.formFields = {};
    }
    //Attemndance start
    //innerTable
    MoreDetailsCtrl.innerTable = function (res) {
      res.map(function (student) {
        MoreDetailsCtrl.attenReports.map(function (attendence) {
          if (student.RFID === attendence.RFID) {
            var obj = {
              "Pdate": attendence.DT,
              "attendencestatus": "Present",
              "inTime": attendence.DOT,
              "outTime": attendence.DOT
            };
            var filteredCount = student['attendenceStats'].filter(function (item) {
              return item["Pdate"] === attendence.DT;
            });
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
      MoreDetailsCtrl.isStudentsReportReady = true;
    }
    //ends here
    //for attendence
    MoreDetailsCtrl.CalculateTotalWorkingDays = function (d1, d2) {
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
      return count;
    }
    MoreDetailsCtrl.getHolidayDetails = function () {
      Calendar.find({
        filter: {
          where: {
            schoolId: MoreDetailsCtrl.schoolId,
            // month: 4
          }
        }
      }, function (response) {
        MoreDetailsCtrl.holidayList = response;
      }, function (error) { });

    }
    //get holidays
    MoreDetailsCtrl.subtractPublicHolidays = function () {
      var startDate = MoreDetailsCtrl.formFields.fromDate.getDate() + '/' + Number(MoreDetailsCtrl.formFields.fromDate.getMonth() + 1) + '/' + MoreDetailsCtrl.formFields.fromDate.getFullYear();
      var endDate = MoreDetailsCtrl.formFields.toDate.getDate() + '/' + Number(MoreDetailsCtrl.formFields.toDate.getMonth() + 1) + '/' + MoreDetailsCtrl.formFields.toDate.getFullYear();
      MoreDetailsCtrl.holidayList.map(function (item) {
        var holiday = new Date(item.date);
        if ((holiday.getTime() >= MoreDetailsCtrl.formFields.fromDate.getTime() && holiday.getTime() <= MoreDetailsCtrl.formFields.toDate.getTime()) && MoreDetailsCtrl.diffDays > 0) {
          MoreDetailsCtrl.diffDays--;
        }
      });
    }
    //ends here
    MoreDetailsCtrl.fetchingStudentAtt = function () {
      async.each(MoreDetailsCtrl.month, function (node, cb) {
        $http({
          "method": "GET",
          "url": configService.baseUrl() + '/Attendances/reportAttendances?SID=' + MoreDetailsCtrl.schoolCode + '&fromDate=' + node.StartDateFormated + '&toDate=' + node.endDateFormated,
          "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }).then(function (response) {
          MoreDetailsCtrl.studClassAtt1 = response;
          node.workingDays = MoreDetailsCtrl.CalculateTotalWorkingDays(node.StartDate, node.endDate);
          node.StudentPresentDays = _.filter(response.data.reports, {
            'RFID': MoreDetailsCtrl.studentData[0].RFID
          }).length;
          node.ClassPresentStudent = [];
          async.each(MoreDetailsCtrl.classRfids, function (noo, CBs) {
            node.ClassPresentStudent.push({
              kk: _.filter(MoreDetailsCtrl.studClassAtt1.data.reports, {
                'RFID': noo
              }).length
            });
            CBs();
          }, function (err) {
            if (err) {
              console.log(err);
            } else {
              node.AverageOfClass = (_.sumBy(node.ClassPresentStudent, 'kk') / node.ClassPresentStudent.length);
            }
          });
          cb();
          MoreDetailsCtrl.workingDaysA = [];
          MoreDetailsCtrl.presentDaysA = [];
          MoreDetailsCtrl.absentDaysA = [];
          MoreDetailsCtrl.averagePresentDays = [];


          for (var j = 0; j < MoreDetailsCtrl.month.length; j++) {
            MoreDetailsCtrl.presentDaysA.push(MoreDetailsCtrl.month[j].StudentPresentDays);
          }
          for (var k = 0; k < MoreDetailsCtrl.month.length; k++) {
            MoreDetailsCtrl.absentDaysA.push(MoreDetailsCtrl.month[k].studentAbsentDay);
          }
          for (var l = 0; l < MoreDetailsCtrl.month.length; l++) {
            MoreDetailsCtrl.averagePresentDays.push(MoreDetailsCtrl.month[l].AverageOfClass);
          }
          for (var i = 0; i < MoreDetailsCtrl.month.length; i++) {
            if (MoreDetailsCtrl.month[i].AverageOfClass !== 0) {
              MoreDetailsCtrl.workingDaysA.push(MoreDetailsCtrl.month[i].exactWorkingDay);
            } else {
              MoreDetailsCtrl.workingDaysA.push(0);

            }
          }

          //Attendence charts
          Highcharts.chart('container', {
            chart: {
              type: 'column'
            },
            title: {
              text: 'Attendence'
            },
            subtitle: {
              text: ''
            },
            xAxis: {
              categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
              crosshair: true
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Days'
              }
            },
            // tooltip: {
            //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            //   pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            //     '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            //   footerFormat: '</table>',
            //   shared: true,
            //   useHTML: true
            // },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: [{
              name: 'Total Working Days',
              data: MoreDetailsCtrl.workingDaysA,
              color: '#0c62b2'

            }, {
              name: 'Present Days',
              data: MoreDetailsCtrl.presentDaysA,
              color: '#ed2326'

            }, {
              name: 'Average PresentDays of Class',
              data: MoreDetailsCtrl.averagePresentDays,
              color: '#41f452'
            }]
          });
          //attendence chart ends here
        });
      },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            async.eachSeries(MoreDetailsCtrl.month, function (Nobbie, cbb) {
              var month = Nobbie.StartDate.getMonth();
              var year = Nobbie.StartDate.getFullYear();
              var dd = _.filter(MoreDetailsCtrl.holidayList, 'month', 'year');
              Nobbie.holidayDays = _.filter(dd, {
                'month': month,
                'year': year.toString()
              }).length;
              Nobbie.holidayDate = _.filter(dd.date);
              Nobbie.exactWorkingDay = Nobbie.workingDays - Nobbie.holidayDays;
              Nobbie.studentAbsentDay = Nobbie.exactWorkingDay - Nobbie.StudentPresentDays;
              cbb();
            }, function (err) {
              if (err) {
                console.log(err);
              } else {
                MoreDetailsCtrl.totalPresentDays = _.sumBy(MoreDetailsCtrl.month, 'StudentPresentDays');
                MoreDetailsCtrl.totalWorkingDays = _.sumBy(MoreDetailsCtrl.month, 'workingDays');
                MoreDetailsCtrl.totalHoliDays = _.sumBy(MoreDetailsCtrl.month, 'holidayDays');
              }
            });
          }
        });
    }
    //ends here
  });