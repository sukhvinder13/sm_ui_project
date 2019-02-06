'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.leaveapplicationService
 * @description
 * # leaveapplicationService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('leaveapplicationService', function ($q, Leave, SMUser, Class,Student,Staff,Admin) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getLeaveDetailsByloginId = function (loginId) {
            var _activepromise = $q.defer();
            Leave.find({ filter: { where: { loginId: loginId }, include: ['sMUser', 'submitter', 'class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getLeaveDetailsByRequesterId = function (loginId) {
            var _activepromise = $q.defer();
            Leave.find({ filter: { where: { reporterId: loginId }, include: ['sMUser', 'submitter', 'class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.deleteLeave = function (leaveId) {
            var _activepromise = $q.defer();
            Leave.deleteById({ id: leaveId },
                //this.deletesubjectsByclassId(leaveId),
                function (response) { _activepromise.resolve(response); },
                function (error) { _activepromise.reject(error); });
            return _activepromise.promise;
        };
        this.deleteLeaveRequest = function (leaveId) {
            var _activepromise = $q.defer();
            Leave.deleteById({ id: leaveId },
                //this.deletesubjectsByclassId(leaveId),
                function (response) { _activepromise.resolve(response); },
                function (error) { _activepromise.reject(error); });
            return _activepromise.promise;
        };
        // this.LeaveSend = function (loginId) {
        //     var _activepromise = $q.defer();
        //     LeaveApproval.find({ filter: { where: { reporterId: loginId }, include: 'sMUser' } },
        //         function (response) {
        //             _activepromise.resolve(response);
        //         }, function (error) {
        //             _activepromise.reject(error);
        //         });
        //     return _activepromise.promise;
        // };
        // this.getdetailedLeave = function (leaveId) {
        //     //console.log("messageid:"+messageId);
        //     var _activepromise = $q.defer();
        //     Leave.find({ filter: { where: { id: leaveId }}},
        //         function (response) {
        //             _activepromise.resolve(response);
        //         }, function (error) {
        //             _activepromise.reject(error);
        //         });
        //     return _activepromise.promise;
        // };
        // this.getAdminDetailsBySchoolId = function (schoolId) {
        //     var _activepromise = $q.defer();
        //     SMUser.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        //         _activepromise.resolve(response);
        //     }, function (error) {
        //         _activepromise.reject(error);
        //     });
        //     return _activepromise.promise;
        // };
        this.getAdminDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Student") {
                    Student.find({ filter: { where: { schoolId: schoolId, id: loginId } } }, function (res) {
                        Class.find({ filter: { where: { id: res[0].classId } } }, function (response) {
                            Staff.find({ filter: { where: { id: response[0].staffId } } }, function (response) {

                                _activepromise.resolve(response);
                            });
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
                    Admin.find({ filter: { where: { schoolId: schoolId} } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                } else if (role === "Accountant") {
                    Admin.find({ filter: { where: { schoolId: schoolId} } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getExistingLeaves = function (data) {
            var _activepromise = $q.defer();
            Leave.findOne({ filter: { where: { schoolId: data.schoolId, description: data.description } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.CreateOrUpdateLeaves = function (data) {
            var _activepromise = $q.defer();
            Leave.create(data,
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };

    });
