'use strict';

/**
 * @ngdoc overview
 * @name studymonitorApp
 * @description
 * # studymonitorApp
 *
 * Main module of the application.
 */
angular
    .module('studymonitorApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'lbServices',
        'frapontillo.bootstrap-switch',
        // 'ui.calendar',
        'toastr',
        'ngBootbox',
        'vsGoogleAutocomplete',
        'angular-loading-bar',
        'ngJsTree',
        'datatables',
        'ngPrint',
        'ui',
        'ngMap',
        'thatisuday.ng-image-gallery',
        'ng-mfb'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'identityLoginController',
                controllerAs: 'identityLoginCtrl',
                templateUrl: 'views/Identitylogin.html'
            })
            .state('identity', {
                url: '/',
                templateUrl: 'views/main-template.html'
            })
            .state('identity.home', {
                url: 'identity',
                views: {
                    'content': {
                        templateUrl: 'views/identity.html',
                        controller: 'identityController',
                        controllerAs: 'identityCtrl'
                    },
                    'header': {
                        templateUrl: 'views/identityheader-template.html',
                        controller: 'identityController',
                        controllerAs: 'identityCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })

            .state('identity.register', {
                url: 'register',
                views: {
                    'content': {
                        templateUrl: 'views/identity-register.html',
                        controller: 'identityController',
                        controllerAs: 'identityCtrl'
                    },
                    'header': {
                        templateUrl: 'views/identityheader-template.html',
                        controller: 'identityController',
                        controllerAs: 'identityCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }

            })
            .state('home', {
                url: '/',
                templateUrl: 'views/main-template.html'
            })
            .state('redirectlogin', {
                url: '/redirectlogin/:userId/:tokenId',
                controller: 'ParamsController',
                controllerAs: 'ParamsCtrl',
                templateUrl: 'views/refresh.html'
            })
            .state('home.console', {
                url: 'dashboard',
                views: {
                    'content': {
                        templateUrl: 'views/console.html',
                        controller: 'ConsoleController',
                        controllerAs: 'ConsoleCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('signup', {
                url: '/Signup',
                controller: 'LoginController',
                controllerAs: 'LoginCtrl',
                templateUrl: 'views/signup.html'
            })
            .state('home.class', {
                url: 'class',
                views: {
                    'content': {
                        templateUrl: 'views/class-template.html',
                        controller: 'ClassController',
                        controllerAs: 'ClassCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.subjects', {
                url: 'subjects',
                views: {
                    'content': {
                        templateUrl: 'views/subjects-template.html',
                        controller: 'SubjectsController',
                        controllerAs: 'SubjectsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            //For Laurus Format1
            .state('home.fosubjects', {
                url: 'fosubjects',
                views: {
                    'content': {
                        templateUrl: 'views/fosubjects-template.html',
                        controller: 'FosubjectsController',
                        controllerAs: 'FosubjectsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.examtype', {
                url: 'examtype',
                views: {
                    'content': {
                        templateUrl: 'views/examtype-template.html',
                        controller: 'ExamtypeControllerCtrl',
                        controllerAs: 'ExamtypeCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.feecategory', {
                url: 'feecategory',
                views: {
                    'content': {
                        templateUrl: 'views/feecategory-template.html',
                        controller: 'FeesController',
                        controllerAs: 'FeesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.foexams', {
                url: 'foexams',
                views: {
                    'content': {
                        templateUrl: 'views/foexams-template.html',
                        controller: 'Foexamcontroller',
                        controllerAs: 'FoexamsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.fomarks', {
                url: 'fomarks',
                views: {
                    'content': {
                        templateUrl: 'views/fomarks-template.html',
                        controller: 'FomarksController',
                        controllerAs: 'FomarksCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.expenses', {
                url: 'expenses',
                views: {
                    'content': {
                        templateUrl: 'views/expenses-template.html',
                        controller: 'ExpensesController',
                        controllerAs: 'ExpensesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.deposite', {
                url: 'deposite',
                views: {
                    'content': {
                        templateUrl: 'views/deposite-template.html',
                        controller: 'DepositControllerCtrl',
                        controllerAs: 'DepositCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.fees', {
                url: 'fees',
                views: {
                    'content': {
                        templateUrl: 'views/fees-template.html',
                        controller: 'FeesController',
                        controllerAs: 'FeesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.lessonplanner', {
                url: 'lessonplanner/:id',
                views: {
                    'content': {
                        templateUrl: 'views/lessonPlanner-template.html',
                        controller: 'LessonplannerControllerCtrl',
                        controllerAs: 'lessonPlnrCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.addtopic', {
                url: 'addtopic?:id',
                views: {
                    'content': {
                        templateUrl: 'views/addtopic-template.html',
                        controller: 'AddtopicController',
                        controllerAs: 'AddtopicCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.feeStructure', {
                url: 'feeStructure',
                views: {
                    'content': {
                        templateUrl: 'views/feeStructure.html',
                        controller: 'FeesStructureController',
                        controllerAs: 'FeesStrctCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.feeReport', {
                url: 'feeReport',
                views: {
                    'content': {
                        templateUrl: 'views/feereport-template.html',
                        controller: 'FeesController',
                        controllerAs: 'FeesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.feedetails', {
                url: 'feeDetails/:id',
                views: {
                    'content': {
                        templateUrl: 'views/feepaymentdetails-template.html',
                        controller: 'FeepaymentdetailsController',
                        controllerAs: 'FeeDetailsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.moredetails', {
                url: 'moreDetails/:id',
                views: {
                    'content': {
                        templateUrl: 'views/moredetails-template.html',
                        controller: 'MoredetailsController',
                        controllerAs: 'MoreDetailsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.studentmoreDetails', {
                url: 'studentmoreDetails/:id',
                views: {
                    'content': {
                        templateUrl: 'views/moredetails-template.html',
                        controller: 'MoredetailsController',
                        controllerAs: 'MoreDetailsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.staffmoredetails', {
                url: 'staffmoreDetails/:id',
                views: {
                    'content': {
                        templateUrl: 'views/staffmoredetails-template.html',
                        controller: 'StaffmoredetailsController',
                        controllerAs: 'StaffmoredetailsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.feepayment', {
                url: 'feepayment',
                views: {
                    'content': {
                        templateUrl: 'views/feepayment-template.html',
                        controller: 'FeesPaymentController',
                        controllerAs: 'FeesPaymentController'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.transport', {
                url: 'transport',
                views: {
                    'content': {
                        templateUrl: 'views/transport-template.html',
                        controller: 'TransportController',
                        controllerAs: 'TransportCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.busservices', {
                url: 'busservices',
                views: {
                    'content': {
                        templateUrl: 'views/bus-template.html',
                        controller: 'BussetupControllerCtrl',
                        controllerAs: 'BussetCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            }).state('home.busservice', {
                url: 'busservice',
                views: {
                    'content': {
                        templateUrl: 'views/busservice-template.html',
                        controller: 'BusserviceController',
                        controllerAs: 'BusserviceCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.buslive', {
                url: 'busliveservice',
                views: {
                    'content': {
                        templateUrl: 'views/buslive-template.html',
                        controller: 'Buslivecontroller',
                        controllerAs: 'BusliveCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.adminbushistory', {
                url: 'adminbushistory',
                views: {
                    'content': {
                        templateUrl: 'views/admin-buslive.html',
                        controller: 'AdminBuslivecontroller',
                        controllerAs: 'BusAdminliveCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.gpsReports', {
                url: 'gpsReports',
                views: {
                    'content': {
                        templateUrl: 'views/gpsReports.html',
                        controller: 'GpsreportsControllerCtrl',
                        controllerAs: 'GpsreportsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.addRoutes', {
                url: 'busservice/routes/:servicesId/:map',
                views: {
                    'content': {
                        templateUrl: 'views/addroutes-template.html',
                        controller: 'AddBusserviceController',
                        controllerAs: 'BusserviceCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.bussubscription', {
                url: 'bussubscription',
                views: {
                    'content': {
                        templateUrl: 'views/bussubscription-template.html',
                        controller: 'BussubscriptionController',
                        controllerAs: 'BussubscriptionCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            }).state('home.bussubscriptionList', {
                url: 'bussubscriptionlist/:servicesId/:busId',
                views: {
                    'content': {
                        templateUrl: 'views/bussubscriptionlist-template.html',
                        controller: 'BussubscriptionListController',
                        controllerAs: 'BussubscriptionListCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.assignments', {
                url: 'assignments',
                views: {
                    'content': {
                        templateUrl: 'views/assignments-template.html',
                        controller: 'AssignmentsController',
                        controllerAs: 'AssignmentsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.exams', {
                url: 'exams',
                views: {
                    'content': {
                        templateUrl: 'views/examlist-template.html',
                        controller: 'ExamlistController',
                        controllerAs: 'ExamlistCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.grade', {
                url: 'grades',
                views: {
                    'content': {
                        templateUrl: 'views/grade-template.html',
                        controller: 'GradeController',
                        controllerAs: 'GradeCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.library', {
                url: 'library',
                views: {
                    'content': {
                        templateUrl: 'views/library-template.html',
                        controller: 'LibraryController',
                        controllerAs: 'LibraryCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.noticeboard', {
                url: 'noticeboard',
                views: {
                    'content': {
                        templateUrl: 'views/noticeboard-template.html',
                        controller: 'NoticeboardController',
                        controllerAs: 'NoticeboardCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.schooltimetable', {
                url: 'schoool/timetable',
                views: {
                    'content': {
                        templateUrl: 'views/schooltimetable-template.html',
                        controller: 'SchooltimetableController',
                        controllerAs: 'SchooltimetableCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.bulkupload', {
                url: 'settings/bulkupload',
                views: {
                    'content': {
                        templateUrl: 'views/bulkupload-template.html',
                        controller: 'BulkuploadController',
                        controllerAs: 'BulkuploadCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.staffbulkupload', {
                url: 'settings/staffbulkupload',
                views: {
                    'content': {
                        templateUrl: 'views/staffbulkupload-template.html',
                        controller: 'BulkuploadController',
                        controllerAs: 'BulkuploadCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.timetable', {
                url: 'collaborate/timetable',
                views: {
                    'content': {
                        templateUrl: 'views/classtimetable-template.html',
                        controller: 'ClasstimetableController',
                        controllerAs: 'ClasstimetableCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.schooldirectory', {
                url: 'communicate/directory',
                views: {
                    'content': {
                        templateUrl: 'views/schooldirectory-template.html',
                        controller: 'SchooldirectoryController',
                        controllerAs: 'SchooldirectoryCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.addstudent', {
                url: 'communicate/directory/enrollstudent?:id',
                views: {
                    'content': {
                        templateUrl: 'views/addstudent-template.html',
                        controller: 'AddstudentController',
                        controllerAs: 'AddStudentCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.addenquirystudent', {
                url: 'communicate/directory/enrollenquirystudent?:classId/:studentId/:address/:fathername/:cnumber/:email/:JoiningDate/:DateOfBirth/:Gender',
                views: {
                    'content': {
                        templateUrl: 'views/addstudent-template.html',
                        controller: 'AddstudentController',
                        controllerAs: 'AddStudentCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.enrollmentform', {
                url: 'communicate/directory/enrollmentform',
                views: {
                    'content': {
                        templateUrl: 'views/enrollmentform-template.html',
                        controller: 'AddstaffController',
                        controllerAs: 'AddStaffCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.addstaff', {
                url: 'communicate/directory/enrollstaff?:id',
                views: {
                    'content': {
                        templateUrl: 'views/addstaff-template.html',
                        controller: 'AddstaffController',
                        controllerAs: 'AddStaffCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.addaccountant', {
                url: 'communicate/directory/addaccountant?:id',
                views: {
                    'content': {
                        templateUrl: 'views/addaccountant-template.html',
                        controller: 'AccountantController',
                        controllerAs: 'AccountantCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.certify', {
                url: 'administrativeDesk/Certificate',
                views: {
                    'content': {
                        templateUrl: 'views/bonafied-template.html',
                        controller: 'BonafideControllerCtrl',
                        controllerAs: 'BonafideCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.messages', {
                url: 'communicate/messages',
                views: {
                    'content': {
                        templateUrl: 'views/messages-template.html',
                        controller: 'MessagesController',
                        controllerAs: 'MessagesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.showMessage', {
                url: 'communicate/messages/show',
                views: {
                    'content': {
                        templateUrl: 'views/show-messagetemplate.html',
                        controller: 'MessagesController',
                        controllerAs: 'MessagesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.sendmessages', {
                url: 'communicate/messages/send',
                views: {
                    'content': {
                        templateUrl: 'views/sendmessage-template.html',
                        controller: 'MessagesController',
                        controllerAs: 'MessagesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.sentMessages', {
                url: 'communicate/messages/sent',
                views: {
                    'content': {
                        templateUrl: 'views/sentmessage.html',
                        controller: 'MessagesController',
                        controllerAs: 'MessagesCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.marks', {
                url: 'compete/marks',
                views: {
                    'content': {
                        templateUrl: 'views/marks-template.html',
                        controller: 'MarksController',
                        controllerAs: 'MarksCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.viewmarks', {
                url: 'compete/viewmarks',
                views: {
                    'content': {
                        templateUrl: 'views/viewMarks-template.html',
                        controller: 'MarksController',
                        controllerAs: 'MarksCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.viewmarksTemp2', {
                url: 'compete/vlewmarks',
                views: {
                    'content': {
                        templateUrl: 'views/viewMarks-template2.html',
                        controller: 'ViewmarksControllerCtrl',
                        controllerAs: 'MarksCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.viewmarksTemp3', {
                url: 'compete/vlewmarkss',
                views: {
                    'content': {
                        templateUrl: 'views/viewMarks-template3.html',
                        controller: 'ViewmarksSamskruthiCtrl',
                        controllerAs: 'MarksCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.profile', {
                url: 'myprofile',
                views: {
                    'content': {
                        templateUrl: 'views/profile-template.html',
                        controller: 'ProfileController',
                        controllerAs: 'ProfileCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.workingdays', {
                url: 'settings/workingdays',
                views: {
                    'content': {
                        templateUrl: 'views/workingdays-template.html',
                        controller: 'WorkingdaysController',
                        controllerAs: 'WorkingDaysCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.schoolcalendar', {
                url: 'settings/schoolcalendar',
                views: {
                    'content': {
                        templateUrl: 'views/schoolcalendar-template.html',
                        controller: 'SchoolcalendarController',
                        controllerAs: 'SchoolCalendarCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.bulkremovals', {
                url: 'settings/bulkremovals',
                views: {
                    'content': {
                        templateUrl: 'views/bulkremovals-template.html',
                        controller: 'BulkremovalsController',
                        controllerAs: 'BulkRemovalsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.mediauploads', {
                url: 'settings/mediauploads',
                views: {
                    'content': {
                        templateUrl: 'views/mediauploads-template.html',
                        controller: 'MediauploadsController',
                        controllerAs: 'MediaUploadCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.classupgrade', {
                url: 'settings/classupgrade',
                views: {
                    'content': {
                        templateUrl: 'views/classupgrade-template.html',
                        controller: 'ClassupgradeController',
                        controllerAs: 'ClassUpgradeCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.attendance', {
                url: 'attendance',
                views: {
                    'content': {
                        templateUrl: 'views/attendance-template.html',
                        controller: 'AttendanceController',
                        controllerAs: 'AttendanceCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.myattendance', {
                url: 'collaborate/myAttendance',
                views: {
                    'content': {
                        templateUrl: 'views/myAttendance-template.html',
                        controller: 'AttendanceController',
                        controllerAs: 'AttendanceCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.home', {
                url: 'home',
                views: {
                    'content': {
                        templateUrl: 'views/home-template.html',
                        controller: 'ConsoleController',
                        controllerAs: 'ConsoleCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.leave', {
                url: 'leave',
                views: {
                    'content': {
                        templateUrl: 'views/leave-template.html',
                        controller: 'LeaveapplicationController',
                        controllerAs: 'LeaveCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.leaveapprove', {
                url: 'leaveapproval',
                views: {
                    'content': {
                        templateUrl: 'views/leaveapproval-template.html',
                        controller: 'LeaveapplicationController',
                        controllerAs: 'LeaveCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
             .state('home.Rfid', {
                url: 'Rfid',
                views: {
                    'content': {
                        templateUrl: 'views/Rfid-template.html',
                        controller: 'RfidController',
                        controllerAs: 'RfidCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })


            .state('home.reports', {
                url: 'reports',
                views: {
                    'content': {
                        templateUrl: 'views/report-template.html',
                        controller: 'ReportsController',
                        controllerAs: 'ReportsCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.settings', {
                url: 'settings',
                views: {
                    'content': {
                        templateUrl: 'views/Settings-template.html',
                        controller: 'ConsoleController',
                        controllerAs: 'ConsoleCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })

            .state('home.schoolsettings', {
                url: 'settings',
                views: {
                    'content': {
                        templateUrl: 'views/schoolsettings.html',
                        controller: 'btController',
                        controllerAs: 'btCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.complent', {
                url: 'complent',
                views: {
                    'content': {
                        templateUrl: 'views/addcomplent.html',
                        controller: 'AddcomplaintController',
                        controllerAs: 'compleintCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.enquiry', {
                url: 'enquiry',
                views: {
                    'content': {
                        templateUrl: 'views/enquiry-template.html',
                        controller: 'EnquiryController',
                        controllerAs: 'EnquiryCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.RoleCreation', {
                url: 'roleCreation',
                views: {
                    'content': {
                        templateUrl: 'views/RoleCreation-template.html',
                        controller: 'RolecreationcontrollerCtrl',
                        controllerAs: 'RolecreationCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('home.visitor', {
                url: 'visitor',
                views: {
                    'content': {
                        templateUrl: 'views/visitor.html',
                        controller: 'AddvisitorController',
                        controllerAs: 'visitorCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header-template.html',
                        controller: 'HeaderController',
                        controllerAs: 'HeaderCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer-template.html'
                    }
                }
            })
            .state('404', {
                templateUrl: '404.html',
                url: '/404'
            });
        $urlRouterProvider.otherwise('/login');
    }).run(function ($rootScope, $state, $cookies) {
        //Capture an event whenever the route changes
        $rootScope.$on('$stateChangeStart', function (event, nextState) {
            /*
            * If user Logged in and try to reload or change route then user should be successfully navigates
            * Not logged in but trying to navigate page directly then user should be sent to login screen
            */
            //First condition to check whether user logged in or not
            var uds = $cookies.getObject('uts');
            if (uds === undefined && nextState.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
            $rootScope.userRole = $cookies.get('role');
        });
    }).constant('API_SERVER', 'http://localhost:3000/api')
    .directive('showTab', function () {
        return {
            link: function (scope, element) {
                element.click(function (e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    })
    .directive('allowDate', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    //   console.log(transformedInput);
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    .directive('allowDate1', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^0-9]/g, '-');
                    //   console.log(transformedInput);
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    .directive('preventRightClick', [

        function () {
            return {
                restrict: 'A',
                link: function ($scope, $ele) {
                    $ele.bind("contextmenu", function (e) {
                        e.preventDefault();
                    });
                }
            };
        }
    ])

    .filter('tel', [function () {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country == 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return (country + "" + city + "-" + number).trim();
        };
    }])
    .filter('cut', [function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    }])
    .filter('capitalize', function () {
        return function (input) {
            if (input.indexOf(' ') !== -1) {
                var inputPieces,
                    i;

                input = input.toLowerCase();
                inputPieces = input.split(' ');

                for (i = 0; i < inputPieces.length; i++) {
                    inputPieces[i] = capitalizeString(inputPieces[i]);
                }

                return inputPieces.toString().replace(/,/g, ' ');
            }
            else {
                input = input.toLowerCase();
                return capitalizeString(input);
            }

            function capitalizeString(inputString) {
                return inputString.substring(0, 1).toUpperCase() + inputString.substring(1);
            }
        };
      })
      .filter('setDecimal', function ($filter) {
        return function (input, places) {
            if (isNaN(input)) return input;
            // If we want 1 decimal place, we want to mult/div by 10
            // If we want 2 decimal places, we want to mult/div by 100, etc
            // So use the following to create that factor
            var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
            return Math.round(input * factor) / factor;
        };

    });

