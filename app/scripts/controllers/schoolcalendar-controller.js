'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:SchoolcalendarControllerCtrl
 * @description
 * # SchoolcalendarControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('SchoolcalendarController', function ($scope, schoolcalendarService, $location, $window, $filter, Calendar, $cookies, toastr, APP_MESSAGES) {
    var SchoolCalendarCtrl = this;
    SchoolCalendarCtrl.index = 0;
    SchoolCalendarCtrl.ShowCalendarList = [];
    SchoolCalendarCtrl.schoolId = $cookies.getObject('uds').schoolId;
    SchoolCalendarCtrl.role = $cookies.get('role');
   var roleAccess = JSON.parse(window.localStorage.getItem('tree'));
   
    for(var i = 0; i<roleAccess[0].RolesData.length;i++){
        if(roleAccess[0].RolesData[i].name === "School Calender"){
          SchoolCalendarCtrl.roleView = roleAccess[0].RolesData[i].view;
          SchoolCalendarCtrl.roleEdit = roleAccess[0].RolesData[i].edit;
          SchoolCalendarCtrl.roledelete = roleAccess[0].RolesData[i].delete;
        }
        
    }
    SchoolCalendarCtrl.eventAction = function () {
      SchoolCalendarCtrl.createDate = $filter('date')(new Date(SchoolCalendarCtrl.formFields.date), "MM-dd-yyyy");
      SchoolCalendarCtrl.mon = $filter('date')(new Date(SchoolCalendarCtrl.createDate), "MM");
      SchoolCalendarCtrl.month = SchoolCalendarCtrl.mon - 1;
      SchoolCalendarCtrl.day = $filter('date')(new Date(SchoolCalendarCtrl.createDate), "dd");
      SchoolCalendarCtrl.year = $filter('date')(new Date(SchoolCalendarCtrl.createDate), "yyyy");
      var data = {
        schoolId: SchoolCalendarCtrl.schoolId,
        eventName: SchoolCalendarCtrl.formFields.title,
        date: SchoolCalendarCtrl.createDate,
        day: SchoolCalendarCtrl.day,
        month: SchoolCalendarCtrl.month,
        year: SchoolCalendarCtrl.year

      };
      if (data) {
        schoolcalendarService.CreateEvent(data).then(function (res) {
          if (res) {
            SchoolCalendarCtrl.calendarData = res;
            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            clearformfields();
            // $window.location.reload();
          }
        }, function (error) {
          console.log(error);
          // toastr.error(error, APP_MESSAGES.SERVER_ERROR);
        });
      }

    };
    //Clear Fields
    function clearformfields() {
      SchoolCalendarCtrl.formFields = {};
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    //render NEW CALENDAR CODE

    Calendar.find({ filter: { where: { schoolId: SchoolCalendarCtrl.schoolId } } }, function (response) {
      SchoolCalendarCtrl.calendarResponse = response;
      var x = response;
      var d = '', m = '', y = '';
      if (x.length > 0) {
        for (var i = 0; i < SchoolCalendarCtrl.calendarResponse.length; i++) {
          d = SchoolCalendarCtrl.calendarResponse[i].day;
          m = SchoolCalendarCtrl.calendarResponse[i].month;
          y = SchoolCalendarCtrl.calendarResponse[i].year;
          SchoolCalendarCtrl.ShowCalendarList.push({ 'title': SchoolCalendarCtrl.calendarResponse[i].eventName, 'start': new Date(y, m, d) });
        }
        if (SchoolCalendarCtrl.role === "Admin") {
          renderCalendar();
        } else {
          renderCalendarOther();
        }
      }

    }, function (error) {
    });

    var renderCalendar = function () {
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        displayEventTime: false,
        year: y,
        month: m, // August
        events: SchoolCalendarCtrl.ShowCalendarList,
        eventRender: function (event, element, view) {
          // if (event.start.getMonth() !== view.start.getMonth()) {
          //   return false;
          // }
          return true;
        }
      });
      $scope.loadingImage = false;
    }
    var renderCalendarOther = function () {
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        editable: false,
        displayEventTime: false,
        year: y,
        month: m, // August
        events: SchoolCalendarCtrl.ShowCalendarList,
        eventRender: function (event, element, view) {
          return true;
        }
      });
      $scope.loadingImage = false;
    }


    SchoolCalendarCtrl.setFloatLabel = function () {
      Metronic.setFlotLabel($('input[name=date]'));
      Metronic.setFlotLabel($('input[name=title]'));
    };
    SchoolCalendarCtrl.setFloatLabel();
    SchoolCalendarCtrl.showList = function () {
      document.getElementById("data1").style.display = "none";
      document.getElementById("data2").style.display = "block";
      Calendar.find({ filter: { where: { schoolId: SchoolCalendarCtrl.schoolId } } }, function (response) {
        SchoolCalendarCtrl.dataResponse = response;
      });
    }
    SchoolCalendarCtrl.hide = function () {
      document.getElementById("data1").style.display = "block";
      document.getElementById("data2").style.display = "none";
      $window.location.reload();
    }
    SchoolCalendarCtrl.edit = function (id) {
      for (var i = 0; i < SchoolCalendarCtrl.dataResponse.length; i++) {
        if (SchoolCalendarCtrl.dataResponse[i].id === id) {
          SchoolCalendarCtrl.index = i;
        }
      }
      SchoolCalendarCtrl.title = SchoolCalendarCtrl.dataResponse[SchoolCalendarCtrl.index].eventName;
      SchoolCalendarCtrl.new = new Date(SchoolCalendarCtrl.dataResponse[SchoolCalendarCtrl.index].date);
      SchoolCalendarCtrl.date = SchoolCalendarCtrl.new;

    }
    SchoolCalendarCtrl.editAction = function () {
      SchoolCalendarCtrl.editDate = $filter('date')(new Date(SchoolCalendarCtrl.date), "MM-dd-yyyy");
      SchoolCalendarCtrl.mon = $filter('date')(new Date(SchoolCalendarCtrl.editDate), "MM");
      SchoolCalendarCtrl.month = SchoolCalendarCtrl.mon - 1;
      SchoolCalendarCtrl.day = $filter('date')(new Date(SchoolCalendarCtrl.editDate), "dd");
      SchoolCalendarCtrl.year = $filter('date')(new Date(SchoolCalendarCtrl.editDate), "yyyy");
      Calendar.upsert({
        id: SchoolCalendarCtrl.dataResponse[SchoolCalendarCtrl.index].id,
        date: SchoolCalendarCtrl.editDate,
        eventName: SchoolCalendarCtrl.title,
        day: SchoolCalendarCtrl.day,
        month: SchoolCalendarCtrl.month,
        schoolId: SchoolCalendarCtrl.dataResponse[SchoolCalendarCtrl.index].schoolId,
        year: SchoolCalendarCtrl.year

      }, function (response) {
        if (response) {
          var modal = $('#data1');
          modal.modal('hide');
          toastr.success("Record edited Succesfully");
          SchoolCalendarCtrl.showList();
          renderCalendar();
        }
      });
    }
    SchoolCalendarCtrl.delAction = function (id) {
      Calendar.deleteById({ id: id }, function (response) {
        if (response) {
          toastr.success("Record Delected Succesfully");
          SchoolCalendarCtrl.showList();
        }
      });
    }
    SchoolCalendarCtrl.confirmCallbackCancel = function (index) {
      if (index) {
        return false;
      }
      return;
    };
  });
