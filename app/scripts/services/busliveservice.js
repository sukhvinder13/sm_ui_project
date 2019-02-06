'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.busLiveService
 * @description
 * # busLiveService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('busLiveService', function ($q, Bus, $http, configService, School) {
        this.getVehicleDetailsbySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role) {
                // if (role === "Admin") {
                //     $http.get(configService.tracking() + '/services?filter={"where":{"schoolId": "' + schoolId + '"}}')
                //         .then(function (response) {
                //             if (response) {
                //                 _activepromise.resolve(response);
                //             }
                //         }, function (error) {
                //             _activepromise.reject(error);
                //         });
                // }
                // else
                if (role === "Student") {
                    $http.get(configService.tracking() + '/trakingbussubscriptions?filter={"include":[{"relation":"servicerel"}],"where":{"studentId": "' + loginId + '"}}')
                        .then(function (response) {
                            if (response) {
                                _activepromise.resolve(response);
                            }
                        }, function (error) {
                            _activepromise.reject(error);
                        });
                }
                else {
                    _activepromise.resolve(null);
                }

            } else {
                _activepromise.resolve(null);
            }
            return _activepromise.promise;
        };
        this.getVehicleDetailsbySchoolIdAdmin = function (schoolId) {
            var _activepromise = $q.defer();
            $http.get(configService.tracking() + '/services?filter={"where":{"schoolId": "' + schoolId + '"}}')
                .then(function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };

        this.getLatAndLogByDeviceId = function (index) {
            var _activepromise = $q.defer();
            $http.get(configService.GPStracking() + '/getlastrecord/' + index)
                .then(function (response) {
                    _activepromise.resolve(response.data.data);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.gethistoryDetailsbySchoolId = function (serno, date) {
            var _activepromise = $q.defer();
            $http.get(configService.GPStracking() + '/getAllDeviceData/' + serno + '/' + date)

                .then(function (response) {
                    _activepromise.resolve(response.data.data);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };

        this.getAdminDataIMEI = function (deviceId) {
            var _activepromise = $q.defer();
            $http.get(configService.GPStracking() + '/getAllDeviceData/' + deviceId)
                .then(function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };

        this.getIMEIByVichleNo = function (vehicleNo) {

            var _activepromise = $q.defer();
            $http.get(configService.tracking() + '/buses?filter={"where":{"vehicleNo": "' + vehicleNo + '"}}')
                .then(function (response) {
                    _activepromise.resolve(response.data);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getbyschoollocationSchoolId = function (schoolId) {

            var response = $q.defer();
            $http.get(configService.baseUrl() + '/Schools/' + schoolId + '?filter[fields][id]=true&filter[fields][busaddress]=true&filter[fields][lat]=true&filter[fields][lng]=true')
                .then(function (success) {
                    response.resolve(success.data);
                }, function (data) {
                    response.reject(data);
                });
            return response.promise;
        };

        this.getParentData = function (schoolId, role) {
            var _activepromise = $q.defer();
            $http.get(configService.baseUrl() + '/btperms?filter={"where":{"schoolId": "' + schoolId + '","type":"' + role + '"}}')
                .then(function (response) {
                    if (response) {
                        _activepromise.resolve(response);
                    }
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getTripsBydate = function (vNo, date) {
            var _activepromise = $q.defer();
            $http.get(configService.GPStracking() + '/gpsReports/' + vNo + '/' + date)
                .then(function (response) {
                    _activepromise.resolve(response.data);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
    }); 
