'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.BussubscriptionService
 * @description
 * # BussubscriptionService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('BussubscriptionService', function ($q, BusService,configService, BusSubscription, Class,$http, Student) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.getBussubscriptionDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
           BusSubscription.find({ filter: { where: { schoolId: schoolId }, include: [{ relation: 'busService' }, { relation: 'student', scope: { include: { relation: 'class' } } }] } }, function (response) {
        //    BusSubscription.find({ filter: { where: { schoolId: schoolId }}}, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getExistingBussubscriptionRecords = function (data) {
            var _activepromise = $q.defer();
            BusSubscription.findOne({ filter: { where: { busServiceId: data.busServiceId, studentId: data.studentId, pickupLocation: data.pickupLocation, schoolId: data.schoolId } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getBusserviceDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            BusService.find({ filter: { where: { schoolId: schoolId }, include: 'bus' } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getBusSubscDetails = function (servicesId) {
            // var _activepromise = $q.defer();
            // BusSubscription.find({ filter: { where: { schoolId: schoolId } } },
            //     function (response) {
            //         _activepromise.resolve(response);
            //     }, function (error) {
            //         _activepromise.reject(error);
            //     });
            // return _activepromise.promise;
            var _activepromise = $q.defer();
            $http.get(configService.tracking()+'/trakingbussubscriptions?filter={"include":[{"relation":"student","scope":{"fields": {"id": true,"contact":true,"firstName":true,"lastName":true}}},{"relation":"class","scope":{"fields": {"id": true,"className":true, "sectionName":true}}}],"where":{"serviceId": "'+servicesId+'"}}')
            .then(function (response) {
                // console.log()
            //   console.log(response);
              if (response) {
                _activepromise.resolve(response);
              }
            }, function (error) {
              _activepromise.reject(error);
            });
          return _activepromise.promise;
        };
        this.deleteBusSerice = function (index,id) {
            // alert(id);
            var _activepromise = $q.defer();
            $http.delete(configService.tracking()+'/trakingbussubscriptions/'+ id)
            .then(function (response) {
                // console.log()
            //   console.log(response);
              if (response) {
                _activepromise.resolve(response);
              }
            }, function (error) {
              _activepromise.reject(error);
            });
          return _activepromise.promise;
            // BusService.deleteById({ id: assignmentId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        this.getClassDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                _activepromise.resolve(response);
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
        this.CreateBussubscription = function (data) {
            // var _activepromise = $q.defer();
            // BusSubscription.create(data,
            //     function (response) {
            //         _activepromise.resolve(response);
            //     }, function (error) {
            //         _activepromise.reject(error);
            //     });
            // return _activepromise.promise;
            var _activepromise = $q.defer();
            $http.post(configService.tracking()+'/trakingbussubscriptions',data)
            .then(function (response) {
                // console.log()
            //   console.log(response);
              if (response) {
                _activepromise.resolve(response);
              }
            }, function (error) {
              _activepromise.reject(error);
            });
          return _activepromise.promise;
        };
        this.EDitBussubscription = function (data) {
            // console.log(data);
            // var _activepromise = $q.defer();
            // BusSubscription.create(data,
            //     function (response) {
            //         _activepromise.resolve(response);
            //     }, function (error) {
            //         _activepromise.reject(error);
            //     });
            // return _activepromise.promise;
            // alert("sfdfdsgfggsd");
            // console.log(configService.tracking()+'/trakingbussubscriptions/'+ data.id,data);
            var _activepromise = $q.defer();
            $http.patch(configService.tracking()+'/trakingbussubscriptions/'+ data.id,data)
            .then(function (response) {
                // console.log()
            //   console.log(response);
              if (response) {
                _activepromise.resolve(response);
              }
            }, function (error) {
              _activepromise.reject(error);
            });
          return _activepromise.promise;
        };
        this.deleteBussubscription = function (index) {
            var _activepromise = $q.defer();
            $http.delete(configService.tracking()+'/buses/'+ index)
            .then(function (response) {
                // console.log()
            //   console.log(response);
              if (response) {
                _activepromise.resolve(response);
              }
            }, function (error) {
              _activepromise.reject(error);
            });
          return _activepromise.promise;
        };
        this.getRoutesByServiceId = function (serviceId) {
            var _activepromise = $q.defer();
            BusService.findById({ id: serviceId }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getStudentsByClassId = function (classId) {
            var _activepromise = $q.defer();
            Student.find({
                filter: { where: { classId: classId } }
            }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
    });