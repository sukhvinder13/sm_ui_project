'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.feesService
 * @description
 * # feesService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    .service('feesService', function ($q, FeeSetup, Class, Student, StudentFees, Subject, FeePayment, School, FeeCategory,Optionals) {
      this.deleteOptional = function (id) {
          var _activepromise = $q.defer();
          Optionals.deleteById({ id: id },
              function (response) {
                  _activepromise.resolve(response);
              }, function (error) {
                  _activepromise.reject(error);
              });
          return _activepromise.promise;
      };
      this.upsertFeesetup = function (data) {
          var _activepromise = $q.defer();
          FeeSetup.upsertfeesetup(data,
              function (response) {
                  _activepromise.resolve(response);
              }, function (error) {
                  _activepromise.reject(error);
              });
          return _activepromise.promise;
      };
      this.getFeeSetupById = function (id) {
          var _activepromise = $q.defer();
          FeeSetup.findById({id:id},{'include':{relation:'feeItems'}},
              function (response) {
                  _activepromise.resolve(response);
              }, function (error) {
                  _activepromise.reject(error);
              });
          return _activepromise.promise;
      };
      this.getFeesetups = function (schoolId,classId) {
        var data={schoolId:schoolId};
        if(classId)data.classId=classId;
          var _activepromise = $q.defer();
          FeeSetup.getfeestups(data,
              function (response) {
                  _activepromise.resolve(response);
              }, function (error) {
                  _activepromise.reject(error);
              });
          return _activepromise.promise;
      };
      this.getStudentPayments = function (schoolId,role,studentId,classId) {
        var data={schoolId:schoolId};
        data.role=role;
        if(role === "Student" && studentId)data.studentId=studentId;
        if(classId)data.classId=classId;
          var _activepromise = $q.defer();
          FeePayment.gestudents(data,
              function (response) {
                  _activepromise.resolve(response);
              }, function (error) {
                  _activepromise.reject(error);
              });
          return _activepromise.promise;
      };
      this.getFeestructure=function(classId){
        var _activepromise = $q.defer();
          Class.getfeestructure({classId:classId},
            function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
        return _activepromise.promise;

      }
        this.getschoolDetailsByloginId = function (schoolId) {
            var _activepromise = $q.defer();
            School.find({ filter: { where: { id: schoolId } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };

        this.getsaveStudentFeeDetails = function (schoolId) {
            var _activepromise = $q.defer();
            FeePayment.find({ filter: { where: { schoolId: schoolId }, include: 'student' } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.CreateStudentFeeByStudentId = function (data) {
            var _activepromise = $q.defer();
            Student.prototype$updateAttributes({ id: data.id, paymentmode: data.paymentmode, payModeFlag: data.payModeFlag },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getFeeReportBySchoolId = function (schoolId, classId) {
            var _activepromise = $q.defer();
            //FeeSetup.find({ filter: { where: { schoolId: ids.schoolId } } }, function (response) {
            FeeSetup.find({ filter: { where: { and: [{ schoolId: schoolId }, { classId: classId }] } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getFeeStructureByClassId = function (schoolId, classId) {
            var _activepromise = $q.defer();
            //FeeSetup.find({ filter: { where: { schoolId: ids.schoolId } } }, function (response) {
            FeeSetup.find({ filter: { where: { and: [{ schoolId: schoolId }, { classId: classId }] } } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getFeesDetailsBySchoolId = function (schoolId) {
            var _activepromise = $q.defer();
            FeeSetup.find({ filter: { where: { schoolId: schoolId }, include: ['class', 'feeCategories'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
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
                else if (role === "Accountant") {
                    Class.find({ filter: { where: { schoolId: schoolId }, order: 'sequenceNumber ASC' } }, function (response) {
                        _activepromise.resolve(response);
                    }, function (error) {
                        _activepromise.reject(error);
                    });
                }
                else if (role === "Staff") {
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
            }
            return _activepromise.promise;

        };
        this.getStudentDetailsBySchoolId = function (schoolId, role, loginId) {
            var _activepromise = $q.defer();
            if (role === "Admin") {
                Student.find({ filter: { "where": { "schoolId": schoolId }, "include": [{ "relation": "class", "scope": { fields: ['className', 'sectionName'], "include": { "relation": "feeSetups" } } }, { "relation": "feePayments" }] } }, function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            }
            else if (role === "Student") {
                Student.find({ filter: { "where": { "schoolId": schoolId, id: loginId }, "include": [{ "relation": "class", "scope": { fields: ['className', 'sectionName'], "include": { "relation": "feeSetups" } } }, { "relation": "feePayments" }] } }, function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            }
            else if (role === "Staff") {
                Student.find({ filter: { where: { schoolId: schoolId }, include: 'class' } }, function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            } else {
                Student.find({ filter: { "where": { "schoolId": schoolId }, "include": [{ "relation": "class", "scope": { fields: ['className', 'sectionName'], "include": { "relation": "feeSetups" } } }, { "relation": "feePayments" }] } }, function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            }
            return _activepromise.promise;
        };

        this.getExistingFeeRecords = function (data) {
            var _activepromise = $q.defer();
            FeeSetup.findOne({ filter: { where: { feeType: data.feeType, classId: data.classId, schoolId: data.schoolId } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.feeUpdate = function (data) {
            var _activepromise = $q.defer();
            FeeSetup.upsert({ id: data.id, feetype: data.feetype, classId: data.classId, feeCategoriesId: data.feeCategoriesId, mode: data.mode, mandatory: data.mandatory }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.verifycategoryDataExistsOrNot = function (data) {
            var _activepromise = $q.defer();
            FeeCategory.findOne({ filter: { where: { categoryName: data.categoryName, schoolId: data.schoolId } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.CreateOrUpdateFee = function (data) {
            var _activepromise = $q.defer();
            FeeSetup.create(data,
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };

        this.CreateCategory = function (data) {
            var _activepromise = $q.defer();
            FeeCategory.create(data,
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.updateCategory = function (data) {
            var _activepromise = $q.defer();
            FeeCategory.upsert({ id: data.id, categoryName: data.categoryName }, function (response) {
                _activepromise.resolve(response);
            }, function (response) {
                _activepromise.reject(response);
            });
            return _activepromise.promise;
        };
        this.CreateOptionalFee = function (data) {
            var _activepromise = $q.defer();
            StudentFees.create(data,
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteFee = function (feeId) {
            var _activepromise = $q.defer();
            FeeSetup.deleteById({ id: feeId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
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
        this.getFeePaymentRecords = function (classId) {
            var _activepromise = $q.defer();
            FeeSetup.find({ where: { classId: { inq: [classId] } }, include: [{ relation: 'feeSetup' }] },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.getcategoryRecords = function (sid) {
            var _activepromise = $q.defer();
            FeeCategory.find({ filter: { where: { schoolId: sid } } },
                function (response) {
                    _activepromise.resolve(response);
                }, function (error) {
                    _activepromise.reject(error);
                });
            return _activepromise.promise;
        };
        this.deleteCategory = function (CategoryId) {
            var _activepromise = $q.defer();
            FeeCategory.deleteById({ id: CategoryId }, function (response) { _activepromise.resolve(response); }, function (error) { _activepromise.reject(error); }); return _activepromise.promise;
        };
        // this.getStudentFeeByStudentFeePaymentMode = function (paymentmode) {
        //     var _activepromise = $q.defer();
        //     FeeSetup.find({filter: { where: { monthly: paymentmode } }},
        //         function(response) {
        //             _activepromise.resolve(response);
        //         }, function(error) {
        //             _activepromise.reject(error);
        //         });
        //     return _activepromise.promise;
        // };
        this.getClassRecordsByClassId = function (classId) {
            var _activepromise = $q.defer();
            FeeSetup.find({ filter: { where: { classId: classId }, include: ['class','feeCategories'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
        this.getClassRecordsByClassIds = function (classId) {
            var _activepromise = $q.defer();
            FeeSetup.find({ filter: { where: { classId: classId }, include: ['class'] } }, function (response) {
                _activepromise.resolve(response);
            }, function (error) {
                _activepromise.reject(error);
            });
            return _activepromise.promise;
        };
    });
