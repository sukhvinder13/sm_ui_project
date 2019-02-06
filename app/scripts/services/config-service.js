'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.configService
 * @description
 * # configService
 * Service in the studymonitorApp.
 */
angular.module('studymonitorApp')
    // AngularJS will instantiate a singleton by calling "new" on this function
    .service('configService', function ($q, Noticeboard, Assignment, $location, Leave, FOexam, School, SMUser, Student, Attendance, $filter, Timetable, Schedule, Class, Media, UserMessages, Chat) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        
        var hostname = location.hostname;
        this.baseUrl = function () {
            if (hostname == 'studymonitor.in')
                return 'https://api.studymonitor.in/api';
            else if (hostname == 'dev.studymonitor.in')
                return 'http://139.162.6.194:3000/api';
            else if (hostname == 'test.studymonitor.in')
                return 'http://173.255.217.199:3000/api';
            else
                return 'http://localhost:3000/api';
        };
        this.tracking = function () {
            return hostname == 'studymonitor.in' ? 'https://gpsapi.studymonitor.in/api' : 'http://dev.studymonitor.in:3003/api';
        }
        this.GPStracking = function () {
            return 'https://track.studymonitor.in';
        }
        this.googleMapsApi = function () {
            return 'https://maps.googleapis.com/maps/api';
        }
    });