'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.reportsService
 * @description
 * # reportsService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('reportsService', function (Class, $q, School, Subject, FOsubject, $http, configService) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        // this.getClassDetailsBySchoolId = function (schoolId) {
        //     var _activepromise = $q.defer();
        //     Class.find({ filter: { where: { schoolId: schoolId } } }, function (response) {
        //         _activepromise.resolve(response);
        //     }, function (error) {
        //         _activepromise.reject(error);
        //     });
        //     return _activepromise.promise;
        // };
        this.getClassesDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Staff") {
                    School.find({ filter: { where: { id: schoolId } } }, function (res) {
                        if (res[0].marksFormat == "FO") {
                            FOsubject.find({ filter: { where: { schoolId: schoolId, staffId: loginId }, include: 'class' } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        } else if (res[0].marksFormat !== "FO") {
                            Subject.find({ filter: { where: { schoolId: schoolId, staffId: loginId }, include: 'class' } }, function (response) {
                                _activepromise.resolve(response);
                            });
                        }
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getClassDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                if (role === "Admin") {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Student") {
                    Student.find({ filter: { where: { id: loginId } } }, function (res) {
                        Class.find({ filter: { where: { id: res[0].classId }, order: 'sequenceNumber ASC' } }, function (response) {
                            _activepromise.resolve(response);
                        });
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                return _activepromise.promise;
            }
        };
        this.getSchoolDataById = function (schoolId) {
            var _activepromise = $q.defer();
            School.find({ filter: { where: { id: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getStudentPaymentDetails = function (schoolId) {
            var _activepromise = $q.defer();
            FeePayment.gestudentpaymentdetails({ schoolId: schoolId }, function (response) {
                _activepromise.resolve(response);
                console.log(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getCustomFeeReportdetails = function (schoolId, fromDate, toDate) {
            var _activepromise = $q.defer();
            $http({
                "url": configService.baseUrl() + '/FeePayments/customFeeReports?schoolId=' + schoolId + '&fromDate=' + fromDate + '&toDate=' + toDate + '',
                "method": "GET",
                "headers": { "Content-Type": "application/json" }
            }).then(function (response) {
                _activepromise.resolve(response);
                // ReportsCtrl.customFeeReport=response;
                // console.log(response);
            });
            return _activepromise.promise;
        };
        this.dailyExpenceReport = function (schoolId, fromDate, toDate) {
            var _activepromise = $q.defer();
            $http({
                "url": configService.baseUrl() + '/ExpensePayments?filter={"where":{"and":[{ "schoolId":"' + schoolId + '"},{"date": { "gte":"' + fromDate + '"}},{"date": {"lt":"' + toDate + '"}}]}}',
                "method": "GET",
                "headers": { "Content-Type": "application/json" }
            }).then(function (response) {
                _activepromise.resolve(response.data);
            });
            return _activepromise.promise;
        };
        this.sendDueNotification = function (data) {
            var _activepromise = $q.defer();
            $http.post(configService.baseUrl() + '/FeePayments/sendSMS', data)
                .then(function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };

    });
