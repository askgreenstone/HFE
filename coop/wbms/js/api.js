var server = 'http://dist.green-stone.cn';
var verify_url = server + '/comm/Verify.do';
var reg_url = server + '/exp/Reg.do';
var forget_pwd_url =  server + '/exp/Pwd.do';

var Api;

Api = (function() {
	function Api() {}

 	Api.prototype.login = function(username, password, callback) {
 		return callback();
 	};
 	Api.prototype.verify = function(phonenumber, callback) {
		$.get(verify_url+'?pn='+phonenumber, function(json){
			if (callback)
				callback(json);
		});
 	};
 	Api.prototype.register = function(phonenumber, username, password, vcode, callback) {
 		var data = {};
		data.pn = phonenumber;
		data.n = username;
		data.pwd = password;
		data.vc = vcode;
		$.post(reg_url, JSON.stringify(data), function(json){
			if (callback)
				callback(json);
		});
 	};
 	Api.prototype.forgetpassword = function(phonenumber, newpassword, vcode, callback) {
 		var data = {};
		data.pn = phonenumber;
		data.pwd = newpassword;
		data.vc = vcode;
		$.post(forget_pwd_url, JSON.stringify(data), function(json){
			if (callback)
				callback(json);
		});
 	};

 	return Api;

})();














