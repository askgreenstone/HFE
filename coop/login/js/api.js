var server = Common.globalDistUrl();
// var host = 'dist.green-stone.cn';
var tempHost = server.split('//')[1];
var host = tempHost.replace('/','');
var verify_url = server + 'comm/Verify.do';
var reg_url = server + 'exp/Reg.do';
var forget_pwd_url =  server + 'exp/Pwd.do';

var Api;

Api = (function() {
	function Api() {}

 	Api.prototype.login = function(username, password, successCallback,errorCallback) {
      //1002  ，短时间内输入次数过多，被锁定，需要验证码，来不及就先不做这里了。
      var container = this;
      var uri = username.toLowerCase();
      var ts = Date.parse(new Date());
      var nonce = 'BPDDYoz7'
      
      var mac = username+ts+nonce+'GET'+host+'/exp/Login.do';
      var pwd = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex).toUpperCase();
      result = CryptoJS.HmacSHA1(mac,pwd).toString(CryptoJS.enc.Base64);
    
      $.ajax({
        type:'GET',
        url:server+'exp/Login.do',
        beforeSend:function(req){
          var auth = "MAC id=\""+username+"\",ts=\""+ts+"\",nonce=\""+nonce+"\",mac=\""+result+"\"";
          req.setRequestHeader('Authorization',auth);
        },
        success:successCallback,
        error:errorCallback
      });
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
		data.t = 1;
		$.post(forget_pwd_url, JSON.stringify(data), function(json){
			if (callback)
				callback(json);
		});
 	};

 	return Api;

})();














