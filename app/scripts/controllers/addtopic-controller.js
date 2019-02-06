'use strict';

/**
 * @ngdoc function
 * @name studymonitorApp.controller:AddtopicControllerCtrl
 * @description
 * # AddtopicControllerCtrl
 * Controller of the studymonitorApp
 */
angular.module('studymonitorApp')
  .controller('AddtopicController', function (addtopicService, $stateParams, $http, $cookies, $timeout, $rootScope, LessonPlanner, $filter, toastr, APP_MESSAGES, $window, configService) {
    var AddtopicCtrl = this;

    AddtopicCtrl.schoolId = $cookies.getObject('uds').schoolId;
    $rootScope.topicsArr = [];
    $rootScope.videoArray = [];
    $rootScope.documentsArray = [];
    AddtopicCtrl.tott = [];
    AddtopicCtrl.ind = false;
    function Init() {
      this.getChapterDetails = function () {
        addtopicService.getChapterDetailsById($stateParams.id).then(function (result) {
          if (result) {
            AddtopicCtrl.formFields = result;

            AddtopicCtrl.formFields.chapterName = AddtopicCtrl.formFields[0].chapterName;
            AddtopicCtrl.formFields.noOfClasses = AddtopicCtrl.formFields[0].noOfClasses;
            AddtopicCtrl.formFields.showsubjectId = AddtopicCtrl.formFields[0].subjectId;
            AddtopicCtrl.formFields.showClassId = AddtopicCtrl.formFields[0].classId;
            AddtopicCtrl.formFields.TopicNo = AddtopicCtrl.formFields[0].TopicNo;
            AddtopicCtrl.formFields.PlannedClassToStartDate = AddtopicCtrl.formFields[0].PlannedClassToStartDate;
            AddtopicCtrl.formFields.TopicName = AddtopicCtrl.formFields[0].TopicName;
            AddtopicCtrl.formFields.PlannedClassToEndDate = AddtopicCtrl.formFields[0].PlannedClassToEndDate;
            AddtopicCtrl.formFields.ScheduleVirtualClassRoom = AddtopicCtrl.formFields[0].ScheduleVirtualClassRoom;
            AddtopicCtrl.formFields.overview = AddtopicCtrl.formFields[0].Overview
            AddtopicCtrl.formFields.homeAssigment = AddtopicCtrl.formFields[0].HomeAssigment
            AddtopicCtrl.formFields.objective = AddtopicCtrl.formFields[0].objective
            AddtopicCtrl.formFields.otherInfomation = AddtopicCtrl.formFields[0].otherInfomation
            $rootScope.videoArray = AddtopicCtrl.formFields[0].videoData
            $rootScope.documentsArray = AddtopicCtrl.formFields[0].docData
            AddtopicCtrl.addTopicId = AddtopicCtrl.formFields[0].id;
            addtopicService.getTopicDetailsByChapterId(AddtopicCtrl.schoolId, AddtopicCtrl.formFields.showsubjectId, AddtopicCtrl.formFields.showClassId, $stateParams.id).then(function (result) {
              if (result) {
                AddtopicCtrl.TopicList = result;
                AddtopicCtrl.topicarrayList = result[0].topicList;
              }
            }, function (error) {
              console.log('Error while fetching the Chapter records. Error stack : ' + error);
            });
            $timeout(function () {
            }, 100);
          }
        }, function (error) {
          console.log('Error while fetching the records' + error);
        });
      }
    }
    (new Init()).getChapterDetails();
    //Show Student View
    AddtopicCtrl.ShowStudentTopicData = function (topicno) {
      document.getElementById('showDiv1').style.display = 'block';
      document.getElementById('showDiv').style.display = 'none';
      $rootScope.videoArray = [];
      $rootScope.documentsArray = [];
      LessonPlanner.find({ filter: { where: { id: $stateParams.id } } }, function (response) {
        AddtopicCtrl.studTopicData = response;
        var storelen = AddtopicCtrl.studTopicData[0].topicList.length;
        for (var i = 0; i < storelen; i++) {
          if (topicno == AddtopicCtrl.studTopicData[0].topicList[i].TopicNo) {
            AddtopicCtrl.formFields.TopicNo = AddtopicCtrl.studTopicData[0].topicList[i].TopicNo;
            AddtopicCtrl.formFields.TopicName = AddtopicCtrl.studTopicData[0].topicList[i].TopicName;
            AddtopicCtrl.formFields.noOfClasses = AddtopicCtrl.studTopicData[0].topicList[i].noOfClasses;
            AddtopicCtrl.formFields.PlannedClassToStartDate = new Date(AddtopicCtrl.studTopicData[0].topicList[i].PlannedClassToStartDate);
            AddtopicCtrl.formFields.PlannedClassToEndDate = new Date(AddtopicCtrl.studTopicData[0].topicList[i].PlannedClassToEndDate);
            AddtopicCtrl.formFields.overview = AddtopicCtrl.studTopicData[0].topicList[i].Overview;
            AddtopicCtrl.formFields.ScheduleVirtualClassRoom = AddtopicCtrl.studTopicData[0].topicList[i].ScheduleVirtualClassRoom;
            AddtopicCtrl.formFields.homeAssigment = AddtopicCtrl.studTopicData[0].topicList[i].HomeAssigment;
            AddtopicCtrl.formFields.otherInfomation = AddtopicCtrl.studTopicData[0].topicList[i].otherInfomation;
            AddtopicCtrl.formFields.objective = AddtopicCtrl.studTopicData[0].topicList[i].objective;
            AddtopicCtrl.videoArray = AddtopicCtrl.studTopicData[0].topicList[i].videoData;
            AddtopicCtrl.docArray = AddtopicCtrl.studTopicData[0].topicList[i].docData;
            var storevidlen = AddtopicCtrl.studTopicData[0].topicList[i].videoData.length;
            for (var j = 0; j < storevidlen; j++) {
              $rootScope.videoArray.push({ "Iframe": AddtopicCtrl.studTopicData[0].topicList[i].videoData[j].Iframe });
            }
            var storedoclen = AddtopicCtrl.studTopicData[0].topicList[i].docData.length;

            for (var k = 0; k < storedoclen; k++) {
              $rootScope.documentsArray.push({ "documentFile": AddtopicCtrl.studTopicData[0].topicList[i].docData[k].documentFile });
            }
            var dateF = AddtopicCtrl.studTopicData[0].topicList[i].PlannedClassToStartDate;
            var parts = dateF.split('-');
            var curr = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
            AddtopicCtrl.formFields.PlannedClassToStartDate = curr;

            var dateT = AddtopicCtrl.studTopicData[0].topicList[i].PlannedClassToEndDate;

            var parts = dateT.split('-');

            var curr1 = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
            AddtopicCtrl.formFields.PlannedClassToEndDate = curr1;
          }
        }

      })
    }
    //End View
    AddtopicCtrl.defaultTopicNo = function () {
      document.getElementById('showDiv1').style.display = 'none';
      document.getElementById('showDiv').style.display = 'block';
      document.getElementById("SVCRID").value = "";
      document.getElementById("TOPNID").value = "";
      document.getElementById("date1").value = "";
      document.getElementById("date2").value = "";
      document.getElementById("NOCID").value = "";
      document.getElementById("OVRID").value = "";
      document.getElementById("HAID").value = "";
      document.getElementById("OBJID").value = "";
      document.getElementById("OIID").value = "";

      AddtopicCtrl.formFields.PlannedClassToStartDate = "";
      AddtopicCtrl.formFields.PlannedClassToEndDate = "";
      AddtopicCtrl.formFields.noOfClasses = "";
      AddtopicCtrl.formFields.objective = "";
      AddtopicCtrl.formFields.overview = "";
      AddtopicCtrl.formFields.otherInfomation = "";
      AddtopicCtrl.formFields.homeAssigment = "";
      AddtopicCtrl.formFields.ScheduleVirtualClassRoom = "";
      $rootScope.videoArray = "";
      $rootScope.videoArray = [];
      $rootScope.documentsArray = "";
      $rootScope.documentsArray = [];

      var decreaseTopicLen;
      var storechapterNo;
      var showTopicNo;
      var assignTopicNo;
      addtopicService.getTopicListByChapterId($stateParams.id).then(function (result) {
        if (result) {
          AddtopicCtrl.TopicListData = result;
          storechapterNo = AddtopicCtrl.TopicListData[0].chapterNo;


          if (AddtopicCtrl.TopicListData[0].topicList == undefined) {
            showTopicNo = storechapterNo + "." + 1
            AddtopicCtrl.formFields.TopicNo = showTopicNo;
          } else {

            decreaseTopicLen = AddtopicCtrl.TopicListData[0].topicList.length - 1;
            assignTopicNo = AddtopicCtrl.TopicListData[0].topicList[decreaseTopicLen].TopicNo;
            AddtopicCtrl.formFields.TopicNo = parseFloat(assignTopicNo) + 0.1;
            AddtopicCtrl.formFields.TopicNo = (Math.round(AddtopicCtrl.formFields.TopicNo * 10) / 10);

          }
          //  $timeout(function () {
          //     AddtopicCtrl.setFloatLabel();
          //   }, 100);
        }
      }, function (error) {
        console.log('Error while fetching the Chapter records. Error stack : ' + error);
      });
    }
    /***************Upload PDF**********************/
    AddtopicCtrl.uploadVideo = function () {

      if (AddtopicCtrl.formFields.video == undefined) {
        AddtopicCtrl.formFields.video = "";
      }
      else {
        $rootScope.videoArray.push({
          "Iframe": AddtopicCtrl.formFields.video
        })
        toastr.success("Video Uploaded Successfully");
        AddtopicCtrl.formFields.video = "";
      }
    };

    AddtopicCtrl.uploadPPTorPDF = function (x) {
      AddtopicCtrl.file = document.getElementById('topicPDF').files[0];
      var fd = new FormData();
      fd.append('file', AddtopicCtrl.file);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/topicPDF/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      })
        .then(function (response) {
          if (response) {
            AddtopicCtrl.pdfFile = configService.baseUrl() + '/ImageContainers/topicPDF/download/' + response.data.result[0].filename;
            $rootScope.documentsArray.push({ "documentFile": AddtopicCtrl.pdfFile });
            toastr.success("Document Uploaded Successfully");

          }
        }, function (error) {
          //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    AddtopicCtrl.uploadPPTorPDF1 = function (x) {
      AddtopicCtrl.file = document.getElementById('topicPDF1').files[0];
      var fd = new FormData();
      fd.append('file', AddtopicCtrl.file);
      var uploadUrl = configService.baseUrl() + "/ImageContainers/topicPDF/upload";
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      })
        .then(function (response) {
          if (response) {
            AddtopicCtrl.pdfFile = configService.baseUrl() + '/ImageContainers/topicPDF/download/' + response.data.result[0].filename;
            $rootScope.documentsArray.push({ "documentFile": AddtopicCtrl.pdfFile });
            toastr.success("Document Uploaded Successfully");

          }
        }, function (error) {
          //console.log.log('Error while fetching the assignment records. Error stack : ' + error);
        });
    };
    $timeout(function () {
      $('#date1').change(function () {
        AddtopicCtrl.formFields.PlannedClassToStartDate = $filter('date')(new Date(AddtopicCtrl.formFields.PlannedClassToStartDate), 'dd-MM-yyyy');
        $timeout(function () {
          for (var i = 0; i < AddtopicCtrl.TopicListData[0].topicList.length; i++) {
            if (AddtopicCtrl.formFields.PlannedClassToStartDate == AddtopicCtrl.TopicListData[0].topicList[i].PlannedClassToStartDate) {
              confirm("You have A Topic Already On This Date..Do You Want To Proceed?");
              break;
            }
          }
          var parts = AddtopicCtrl.formFields.PlannedClassToStartDate.split('-');
          var concatStarDate = parts[2] + "-" + parts[1] + "-" + parts[0];
          var parts1 = AddtopicCtrl.formFields.PlannedClassToEndDate.split('-');
          var concatEnDate = parts1[2] + "-" + parts1[1] + "-" + parts1[0];

          if (concatEnDate < concatStarDate) {
            alert("End date should be greater than Start date");
            AddtopicCtrl.formFields.PlannedClassToEndDate = "";
            document.getElementById("date2").value = "";
          }
        }, 800)

      });
      $('#date2').change(function () {
        AddtopicCtrl.formFields.PlannedClassToEndDate = $filter('date')(new Date(AddtopicCtrl.formFields.PlannedClassToEndDate), 'dd-MM-yyyy');


        if (AddtopicCtrl.formFields.PlannedClassToStartDate == "") {
          alert("Please Select Start Date First");
          AddtopicCtrl.formFields.PlannedClassToEndDate = "";
          document.getElementById("date2").value = "";

        } else if (AddtopicCtrl.formFields.PlannedClassToStartDate !== "" && AddtopicCtrl.formFields.PlannedClassToEndDate == "Invalid Date") {
          alert("End date should be greater than Start date");
          AddtopicCtrl.formFields.PlannedClassToEndDate = "";
          document.getElementById("date2").value = "";



        } else {
          var parts = AddtopicCtrl.formFields.PlannedClassToStartDate.split('-');
          var concatStarDate = parts[2] + "-" + parts[1] + "-" + parts[0];
          var parts1 = AddtopicCtrl.formFields.PlannedClassToEndDate.split('-');
          var concatEnDate = parts1[2] + "-" + parts1[1] + "-" + parts1[0];

          if (concatEnDate < concatStarDate) {
            alert("End date should be greater than Start date");
            AddtopicCtrl.formFields.PlannedClassToEndDate = "";
            document.getElementById("date2").value = "";
          }
        }


      });
    }, 1000);
    $timeout(function () {
      $('#two').change(function () {
        var startDate = document.getElementById("two").value;
        var endDate = document.getElementById("four").value;

        var parts = startDate.split('-');
        var parts1 = endDate.split('-');

        var concatStartDate = parts[2] + "-" + parts[1] + "-" + parts[0];
        AddtopicCtrl.formFields.PlannedClassToStartDate = concatStartDate;
        for (var i = 0; i < AddtopicCtrl.studTopicData[0].topicList.length; i++) {
          if (concatStartDate == AddtopicCtrl.studTopicData[0].topicList[i].PlannedClassToStartDate) {
            confirm("You have A Topic Already On This Date..Do You Want To Proceed?");
            break;
          }
        }

        var concatEndDate = parts1[2] + "-" + parts1[1] + "-" + parts1[0];
        AddtopicCtrl.formFields.PlannedClassToEndDate = concatEndDate;

        if ((Date.parse(endDate) < Date.parse(startDate))) {
          alert("End date should be greater than Start date");
          document.getElementById("four").value = "";
        }

      });
      $('#four').change(function () {
        var startDate = document.getElementById("two").value;
        var endDate = document.getElementById("four").value;
        var parts = endDate.split('-');

        var concatEndDate = parts[2] + "-" + parts[1] + "-" + parts[0];
        AddtopicCtrl.formFields.PlannedClassToEndDate = concatEndDate;

        if ((Date.parse(endDate) < Date.parse(startDate))) {
          alert("End date should be greater than Start date");
          document.getElementById("four").value = "";
        }

      });
    }, 1000);
    //Add Topic
    AddtopicCtrl.addTopicModal = function (id) {
      document.getElementById("one").value = "";
      document.getElementById("two").value = "";
      document.getElementById("three").value = "";
      document.getElementById("four").value = "";
      document.getElementById("five").value = "";
      document.getElementById("six").value = "";
      document.getElementById("seven").value = "";
      document.getElementById("eight").value = "";
      document.getElementById("nine").value = "";
      document.getElementById("ten").value = "";
      var AssignmentStatus;

      if (AddtopicCtrl.formFields.PlannedClassToStartDate == "") {
        AddtopicCtrl.formFields.PlannedClassToStartDate = "";
      };
      if (AddtopicCtrl.formFields.PlannedClassToEndDate == "") {
        AddtopicCtrl.formFields.PlannedClassToEndDate = "";
      }
      if (AddtopicCtrl.formFields.homeAssigment == '') {
        AssignmentStatus = "No"
      } else if (AddtopicCtrl.formFields.homeAssigment !== '') {
        AssignmentStatus = "Yes"
      }
      if (AddtopicCtrl.topicarrayList == undefined) {

      } else {
        for (var i = 0; i < AddtopicCtrl.topicarrayList.length; i++) {
          $rootScope.topicsArr.push({
            "noOfClasses": AddtopicCtrl.topicarrayList[i].noOfClasses,
            "ScheduleVirtualClassRoom": AddtopicCtrl.topicarrayList[i].ScheduleVirtualClassRoom,
            "TopicNo": AddtopicCtrl.topicarrayList[i].TopicNo,
            "PlannedClassToStartDate": AddtopicCtrl.topicarrayList[i].PlannedClassToStartDate,
            "StartDate": AddtopicCtrl.topicarrayList[i].StartDate,
            "TopicName": AddtopicCtrl.topicarrayList[i].TopicName,
            "PlannedClassToEndDate": AddtopicCtrl.topicarrayList[i].PlannedClassToEndDate,
            "EndDate": AddtopicCtrl.topicarrayList[i].EndDate,
            "Overview": AddtopicCtrl.topicarrayList[i].Overview,
            "HomeAssigment": AddtopicCtrl.topicarrayList[i].HomeAssigment,
            "AssignmentStatus": AddtopicCtrl.topicarrayList[i].AssignmentStatus,
            "objective": AddtopicCtrl.topicarrayList[i].objective,
            "otherInfomation": AddtopicCtrl.topicarrayList[i].otherInfomation,
            "videoData": AddtopicCtrl.topicarrayList[i].videoData,
            "docData": AddtopicCtrl.topicarrayList[i].docData

          })
        }
      }

      $rootScope.topicsArr.push({
        "noOfClasses": parseInt(AddtopicCtrl.formFields.noOfClasses),
        "ScheduleVirtualClassRoom": AddtopicCtrl.formFields.ScheduleVirtualClassRoom,
        "TopicNo": AddtopicCtrl.formFields.TopicNo,
        "PlannedClassToStartDate": AddtopicCtrl.formFields.PlannedClassToStartDate,
        "StartDate": $filter('date')(new Date(), 'dd-MM-yyyy - HH:mm:ss'),
        "TopicName": AddtopicCtrl.formFields.TopicName,
        "PlannedClassToEndDate": AddtopicCtrl.formFields.PlannedClassToEndDate,
        "EndDate": $filter('date')(new Date(), 'dd-MM-yyyy - HH:mm:ss'),
        "Overview": AddtopicCtrl.formFields.overview,
        "HomeAssigment": AddtopicCtrl.formFields.homeAssigment,
        "AssignmentStatus": AssignmentStatus,
        "objective": AddtopicCtrl.formFields.objective,
        "otherInfomation": AddtopicCtrl.formFields.otherInfomation,
        "videoData": $rootScope.videoArray,
        "docData": $rootScope.documentsArray
      })
      var data = {
        "id": id,
        "schoolId": AddtopicCtrl.schoolId,
        "classId": AddtopicCtrl.formFields.showClassId,
        "subjectId": AddtopicCtrl.formFields.showsubjectId,
        "chapterNo": AddtopicCtrl.formFields.chapterNo,
        "chapterName": AddtopicCtrl.formFields.chapterName,
        "topicList": $rootScope.topicsArr,

      }

      LessonPlanner.prototype$patchAttributes({

        id: data.id,
        schoolId: data.schoolId,
        classId: data.classId,
        subjectId: data.subjectId,
        chapterNo: data.chapterNo,
        chapterName: data.chapterName,
        topicList: data.topicList,
        videoData: data.videoData,
        docData: data.docData


      },
        function (response) {
          if (response) {

            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            AddtopicCtrl.formFields = "";
            $window.location.reload();
          }
        }, function (error) {
          console.log(error);
        });
    }
    //End Add Topic


    //Edit
    AddtopicCtrl.EditTopicModal = function (id, num) {
      var AssignmentStatus;

      var startDate = document.getElementById("two").value;
      var endDate = document.getElementById("four").value;
      var parts = startDate.split('-');
      var parts1 = endDate.split('-');

      AddtopicCtrl.formFields.PlannedClassToStartDate = parts[2] + "-" + parts[1] + "-" + parts[0];
      AddtopicCtrl.formFields.PlannedClassToEndDate = parts1[2] + "-" + parts1[1] + "-" + parts1[0];
      if (AddtopicCtrl.formFields.PlannedClassToStartDate == "" || startDate == "") {
        AddtopicCtrl.formFields.PlannedClassToStartDate = "";
      };
      if (AddtopicCtrl.formFields.PlannedClassToEndDate == "" || endDate == "") {
        AddtopicCtrl.formFields.PlannedClassToEndDate = "";
      }
      if (AddtopicCtrl.formFields.homeAssigment == '') {
        AssignmentStatus = "No"
      } else if (AddtopicCtrl.formFields.homeAssigment !== '') {
        AssignmentStatus = "Yes"
      }
      for (var i = 0; i < AddtopicCtrl.topicarrayList.length; i++) {
        if (num == AddtopicCtrl.topicarrayList[i].TopicNo) {

          AddtopicCtrl.topicarrayList[i].PlannedClassToStartDate = AddtopicCtrl.formFields.PlannedClassToStartDate;
          AddtopicCtrl.topicarrayList[i].noOfClasses = parseInt(AddtopicCtrl.formFields.noOfClasses);
          AddtopicCtrl.topicarrayList[i].ScheduleVirtualClassRoom = AddtopicCtrl.formFields.ScheduleVirtualClassRoom;
          AddtopicCtrl.topicarrayList[i].TopicName = AddtopicCtrl.formFields.TopicName;
          AddtopicCtrl.topicarrayList[i].PlannedClassToEndDate = AddtopicCtrl.formFields.PlannedClassToEndDate;
          AddtopicCtrl.topicarrayList[i].Overview = AddtopicCtrl.formFields.overview;
          AddtopicCtrl.topicarrayList[i].HomeAssigment = AddtopicCtrl.formFields.homeAssigment;
          AddtopicCtrl.topicarrayList[i].AssignmentStatus = AssignmentStatus;
          AddtopicCtrl.topicarrayList[i].objective = AddtopicCtrl.formFields.objective;
          AddtopicCtrl.topicarrayList[i].otherInfomation = AddtopicCtrl.formFields.otherInfomation;
          AddtopicCtrl.topicarrayList[i].videoData = $rootScope.videoArray;
          AddtopicCtrl.topicarrayList[i].docData = $rootScope.documentsArray;


          AddtopicCtrl.topicList = AddtopicCtrl.topicarrayList;

        }

      }

      LessonPlanner.prototype$patchAttributes({

        id: id,
        topicList: AddtopicCtrl.topicList,

      },
        function (response) {
          if (response) {

            toastr.success(APP_MESSAGES.INSERT_SUCCESS);
            AddtopicCtrl.formFields = "";
            $window.location.reload();
          }
        }, function (error) {
          console.log(error);
        });
    }

    //End Edit
    AddtopicCtrl.closeToggle = function (index) {
      var ii = AddtopicCtrl.tott[index];
      AddtopicCtrl.tott = [];
      for (var i = 0; i < AddtopicCtrl.topicarrayList.length; i++) {
        if (index === i) {
          if (ii == true) {
            var ind = false;
          } else {
            var ind = true;
          }
          AddtopicCtrl.tott.push(ind);
        } else {
          var ind = false;
          AddtopicCtrl.tott.push(ind);
        }
      }
    }
  });
