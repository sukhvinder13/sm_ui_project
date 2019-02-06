'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.messagesService
 * @description
 * # messagesService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .service('messagesService', function ($q, $http, Chat, Student, Staff, School, UserMessages, Comments, SMUser, Admin, Accountant, Smsreport, configService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getMessageDetailsByloginId = function (loginId) {
      var _activepromise = $q.defer();
      Chat.find({ filter: { where: { senderId: loginId }, include: ['comments', 'sMUser', 'sMReciver'] } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getMsgid = function (schoolId) {
      var _activepromise = $q.defer();
      School.find({ filter: { where: { id: schoolId } } }, function (response) {
        _activepromise.resolve(response);
        //alert(JSON.stringify(response));
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getStudentDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Student.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getAccountantDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Accountant.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getStaffDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      Staff.find({ filter: { where: { schoolId: schoolId }, order: 'firstName DESC' } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getAdminDetailsBySchoolId = function (schoolId) {
      var _activepromise = $q.defer();
      SMUser.find({ filter: { where: { schoolId: schoolId,type:'Admin'  } } }, function (response) {
        _activepromise.resolve(response);
      }, function (error) {
        _activepromise.reject(error);
      });
      return _activepromise.promise;
    };
    this.getClassDetails = function (schoolId) {
      var _activepromise = $q.defer();
      School.findOne({ filter: { where: { id: schoolId }, include: [{ relation: 'classes', scope: { include: [{ relation: 'subjects', scope: { include: 'staff' } }, { relation: 'staff' }] } }, { relation: 'staffs' }] } },
        function (response) {
          _activepromise.resolve(response);
        },
        function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.CreateOrUpdateMessage = function (data) {
      var _activepromise = $q.defer();
      Chat.create(data,
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.countAndUpdatetime = function (id) {
      var _activepromise = $q.defer();
      Chat.find({ filter: { where: { id: id } } },
        function (response) {

          response[0].count++
          // var count = 0
          Chat.upsert({ id: response[0].id, changeTime: new Date() })

          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    }
    this.AddComment = function (data) {
      var _activepromise = $q.defer();
      Comments.create(data,
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.editMesssage = function (data) {
      var _activepromise = $q.defer();
      Chat.upsert({ id: data.id, treeData: data.treeData, message: data.message },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    // this.showUserMessagesByloginId = function (loginId) {
    //   var _activepromise = $q.defer();
    //   UserMessages.find({ filter: { where: { userId: loginId}} }, function (response) {
    //     _activepromise.resolve(response);
    //   }, function (error) {
    //     _activepromise.reject(error);
    //   });
    //   return _activepromise.promise;
    // };
    this.MessageSend = function (loginId) {
      var _activepromise = $q.defer();
      UserMessages.find({ filter: { where: { userId: loginId }, include: 'sMUser' } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    this.getdetailedMeassage = function (messageId) {
      var _activepromise = $q.defer();
      Chat.find({ filter: { where: { id: messageId }, include: ['comments', 'sMUser', 'sMReciver'] } },
        function (response) {
          _activepromise.resolve(response);
        }, function (error) {
          _activepromise.reject(error);
        });
      return _activepromise.promise;
    };
    // 3rd party sms service
    this.sendSMS = function (data1) {
      var D = $q.defer();
      $http.post(configService.baseUrl() + '/smsreports/smsTrigger',data1).then(function (data) {
        D.resolve(data);
      }, function (err) {
        D.reject(err);
      });
      return D.promise;
    };
     this.sendSMSTriggerd = function (data1) {
      var D = $q.defer();
      $http.post(configService.baseUrl() + '/smsreports/smsTriggered',data1).then(function (data) {
        D.resolve(data);
      }, function (err) {
        D.reject(err);
      });
      return D.promise;
    };
  });
