'use strict';

/**
 * @ngdoc service
 * @name studymonitorApp.appMessages
 * @description
 * # appMessages
 * Value in the studymonitorApp.
 */
angular.module('studymonitorApp')
  .value('APP_MESSAGES', {
      'LOGIN_INVALID': 'Invalid email address or password',
      'LOGIN_SUCCESS': 'Loged In successfully',
      'INSERT_SUCCESS': 'Data saved successfully',
      'UPDATE_SUCCESS': 'Data updated successfully',
      'SERVER_ERROR': ' Server Error. Please reload',
      'DELETE_SUCCESS': 'Record Deleted successfully',
      'DATA_EXISTS_DESC': 'Provided information already exists',
      'DATA_EXISTS': 'Data already exists',
      'MESSAGE_SENT': 'Message Sent Successfully',
      'INVALID_MARKS': 'Entered Marks greater than the Maximum Marks',
      'INVALID_TIME':'Entered the endtime less than start Time',
      'EMAIL_SENT':'Mail has been sent',
      'SUBSCRIPT_SUCESS':'Your Subscription is Successful',
      'SUBSCRIPT_ERROR':'You Have Already Subscribed To This Student.Please Contact Your School Admin For Any Issues',
      'SUBSCRIPT_NOTDONE':'You Have Not Subscribed Yet.Please Contact Your School Admin',
      'DISCOUNT_INVALID':'Entered Discount must be less than the Total Value',
      'DISCOUNT_APPLIED':'Discount Applied',
      'SET_SUCCESS':'Marks Setting Applied',
      'FEE_PAID':'Fees has been paid',
      'BUS_FULL':'Seats are filled in this bus'
  });
