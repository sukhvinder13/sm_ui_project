'use strict';


const Promise = require('bluebird');
module.exports=function(){
	console.log('successfully changed status');
	return new Promise((resolve) =>{
		resolve();
	});
};
