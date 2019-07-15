var React = require('react');

var ArticleDetail = require('../public/ArticleDetail.react');
var Card = require('../public/Card.react');
var CommonMixin = require('../../Mixin');
var Single = require('../public/Single.react');
var Share = require('../../common/Share.react');
var Message = require('../../common/Message.react');
var Shadow = require('../../common/Shadow.react');
var Password = require('../../common/Password.react');
var Toolbar = require('../../common/Toolbar.react');
var Shade = require('../../common/Shade.react');
var Establish = require('../public/Establish.react');
var LatestNews = require('../public/LatestNews.react');

require('../../../../css/theme/theme025.less');

var Index025 = React.createClass({
	mixins:[CommonMixin],
    getInitialState: function(){
        return {
            activeState:false,
            navArrs:[],
            shareTitle:'',
            shareDesc:'',
            shareImg:'',
            documentExpTitle: '',
            documentDepartTitle: '',
            expspecial:[],
            newsTitle:'',
            newsContent:'',
            newsShow:false,
            expertInfo: {}
        };
    },
    getLatestNews:function(){
        var that = this;
        // if(that.props.title) return;
        var ownUri = this.getUrlParams('ownUri');
        if(!ownUri){
            ownUri = this.checkDevOrPro();
            console.log(ownUri);
        }
        var idf = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        $.ajax({
            type: 'GET',
            url: global.url+'/usr/FeedTimeline.do?ownUri='+ownUri+'&c=1&idf='+idf+'&p=0',
            success:function(data){
                console.log(data);
                if(data.c == 1000){
                    this.setState({
                        newsTitle: data.r.fl.length>0?data.r.fl[0].title:'',
                        newsContent: data.r.fl.length>0?data.r.fl[0].content:'',
                        newsShow: false
                    });
                }
            }.bind(this),
            error:function(){
                this.showRefresh('系统开了小差，请刷新页面');
            }.bind(this)
        })
        
    },
    transferArr: function(str){
        var arr =[]; 
        var descArr = [];
        // arr = str.replace(/"/g,"").replace(/\[/,"").replace(/\]/g,"").split(",");
        arr = JSON.parse(str);
        // 如果用户没有选择擅长领域，则不显示
        console.log('乔凡测试'+arr);
        var eilArr = ['','公司企业','资本市场','证券期货','知识产权','金融保险','合同债务','劳动人事','矿业能源','房地产','贸易','海事海商','涉外','财税','物权','婚姻家庭','侵权','诉讼仲裁','刑事','破产','新三板','反垄断','家族财富','交通事故','医疗','人格权','其他'];
        if(arr.length < 1){
            descArr = []
        }else{
            for(var i = 0; i<arr.length; i++){
                if(arr[i] == 99){
                    descArr.push('其他')
                }else{
                    descArr.push(eilArr[arr[i]])
                }
            }
        }
        console.log(descArr);
        var lawyerArr = descArr.slice(0,3);
        console.log(lawyerArr);
        return lawyerArr;
    },
    getServerInfo: function(){
        var ownUri = this.getUrlParams('ownUri');
        if(!ownUri){
            ownUri = this.checkDevOrPro();
            console.log(ownUri);
        }
        var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        $.ajax({
            type:'get',
            url: global.url+'/usr/QueryMicroCard.do?ownUri='+ownUri+'&ida='+ida,
            success: function(data) {
                // alert(JSON.stringify(data));
                console.log(data);
                // alert('ownUri:'+ownUri+'ntid:'+ntid);
                if(data.c == 1000){
                    this.setState({
                        nm:data.nm,
                        dp:data.dp,
                        rk:data.rk,
                        expspecial:data.es?(this.transferArr(data.es).slice(0,3)):(this.transferArr("[]"))
                    });
                }
            }.bind(this),
            error: function(xhr, status, err) {
                this.showRefresh('系统开了小差，请刷新页面');
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getUserList: function(flag){
        // alert($(window).width()+'x'+$(window).height());
        var ownUri = this.getUrlParams('ownUri');
        if(!ownUri){
            ownUri = this.checkDevOrPro();
            console.log(ownUri);
        }
        var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        if(flag){
            $.ajax({
                type:'get',
                url: global.url+'/exp/QueryNewsTypes.do?&ownUri='+ownUri+'&ida='+ida,
                success: function(data) {
                    // alert(JSON.stringify(data));
                    console.log(data);
                    if(data.c == 1000){
                        var temp = this.checkMenuType(data.ntl);
                        this.setState({navArrs:temp});
                        //缓存菜单数据
                        sessionStorage.setItem('menu_info_index025',JSON.stringify(data.ntl));
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                    this.showRefresh('系统开了小差，请刷新页面');
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }else{
            var localJsons = this.checkMenuType(JSON.parse(sessionStorage.getItem('menu_info_index025')));
            this.setState({navArrs:localJsons});
        }
    },
    getBgLogo: function(){
        var ownUri = this.getUrlParams('ownUri');
        if(!ownUri){
            ownUri = this.checkDevOrPro();
            console.log(ownUri);
        }
        var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        var from = this.getUrlParams('from');
        $.ajax({
            type:'get',
            async:false,
            url: global.url+'/usr/GetMicWebImgs.do?ou='+ownUri+'&ida='+ida,
            success: function(data) {
                // alert(JSON.stringify(data));
                console.log(data);
                if(data.c == 1000){
                // this.setState({navArrs:data.ntl});
                //alert(0);
                this.setState({bg:data.bi,logo:data.l});
                //依据菜单版本号判断，版本号不一致，需要重新请求服务端数据
                if(from == 'app'){
                    this.getUserList(true);
                }else if(sessionStorage.getItem('menu_version_index025')){
                    if(sessionStorage.getItem('menu_version_index025') != data.mv){
                    this.getUserList(true);
                    }else{
                    this.getUserList(false);
                    }
                }else{
                    this.getUserList(true);
                }
                sessionStorage.setItem('menu_version_index025',data.mv);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                this.showRefresh('系统开了小差，请刷新页面');
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getExpertInfo: function(){
        var ownUri = this.getUrlParams('ownUri');
        if(!ownUri){
            ownUri = this.checkDevOrPro();
        }
        var exOwnUri = ownUri.replace('e','');
        var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        $.ajax({
            type:'get',
            url: global.url+'/exp/ExpertInfo.do?ei='+exOwnUri,
            success: function(data) {
                console.log(data);
                if(data.c == 1000){
                    var expertHead = data.p||'header.jpg';
                    var exCompanyLogo = data.cl||'header.jpg';
                    this.getWxShareInfo(expertHead,exCompanyLogo);
                    var arr = []
                    arr.push(data)
                    console.log(arr)
                    this.setState({
                        hI:data.p||'header.jpg',
                        expertInfo: arr[0] 
                    })
                }
            }.bind(this),
            error: function(xhr, status, err) {
                this.showRefresh('系统开了小差，请刷新页面');
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getWxShareInfo: function(expertHead,exCompanyLogo){
        var ownUri = this.getUrlParams('ownUri');
        if(!ownUri){
            ownUri = this.checkDevOrPro();
            console.log(ownUri);
        }
        var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        $.ajax({
            type:'get',
            url: global.url+'/usr/GetMicWebShareInfo.do?ou='+ownUri+'&st=1&ida='+ida,
            success: function(data) {
                // alert(JSON.stringify(data));
                console.log(data);
                // console.log('qiaof:'+(data.enm?(data.eg?(data.enm+data.eg+'的'):(data.enm+'的')):('我的'))+'名片')
                if(data.c == 1000){
                if(data.sil.length>0){
                    this.setState({
                    shareTitle:data.sil[0].sti,
                    // shareDesc:data.sil[0].sd,
                    shareDesc: data.sil[0].sti,
                    // shareImg:data.sil[0].spu,
                    shareImg: 'dachenglogo20190708_W180_H180_S4.png',
                    documentDepartTitle: data.dnm?data.dnm:'机构介绍',
                    documentExpTitle: data.enm?data.enm:'我'
                    });
                }else{
                    if(ida == 1){
                        this.setState({
                            shareTitle:(data.dnm?data.dnm:'我的')+'机构简介',
                            shareDesc:'欢迎访问'+(data.dnm?data.dnm:'我的')+'机构简介',
                            shareImg:exCompanyLogo
                        });
                    }else{
                        this.setState({
                            shareTitle:(data.enm?(data.eg?(data.enm+data.eg+'的'):(data.enm+'的')):('我的'))+'名片',
                            shareDesc:'欢迎访问我的名片，您可以直接在线咨询我',
                            shareImg:expertHead
                        });
                    }
                }
                }
            }.bind(this),
            error: function(xhr, status, err) {
                this.showRefresh('系统开了小差，请刷新页面');
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    // 跳转到地图导航
    gotoLink: function(path){
        var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        location.href = '#'+path+'?ownUri='+this.getUrlParams('ownUri')+'&ida='+ida;
    },
    //查询用户微网站是否过期
    getUserWebState: function(){
        var ownUri = this.getUrlParams('ownUri');
        if(!ownUri){
            ownUri = this.checkDevOrPro();
        }
        var ida = this.getUrlParams('ida')?this.getUrlParams('ida'):0;
        $.ajax({
            type:'get',
            url: global.url+'/exp/QueryMicWebActivate.do?ownUri='+ownUri+'&ida='+ida,
            success: function(data) {
                // alert(JSON.stringify(data));
                console.log(data);
                if(data.c == 1000){
                //0未激活、1试用、2正常付费、3试用到期、4正常付费到期
                if(data.as==3||data.as==4){
                    //activeState true则显示弹层
                    this.setState({activeState:true});
                }
                }
            }.bind(this),
            error: function(xhr, status, err) {
                this.showRefresh('系统开了小差，请刷新页面');
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.staticWebPV(1);
        // this.getUserList();
        $('body').css({'background':'#fff'});
        // 乔凡：重新修改title（解决ios不能修改document.title问题）
        var that = this;
        setTimeout(function(){
            var ida = that.getUrlParams('ida');
            var title = '';
            console.log(that.state.documentDepartTitle);
            console.log(that.state.documentExpTitle);
            if(ida == 1){
                title = that.state.documentDepartTitle?that.state.documentDepartTitle:'机构介绍';
            }else{
                title = that.state.documentExpTitle?(that.state.documentExpTitle+'的名片'):'名片';
            }
            var $body = $('body')
            document.title = title;
            // hack在微信等webview中无法修改document.title的情况
            var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body);
        },300)
    },
    componentWillMount: function(){
        // this.getServerInfo();
        // this.getBgLogo();
        console.log('bg:'+this.state.bg);
        this.getUserWebState();
        // this.getLatestNews();
        this.getExpertInfo();
    },
	render:function(){
        console.log(this.state.expertInfo);
        console.log(this.state.newsShow);
        var expSpecial = this.state.expspecial.map(function(item,i){
            return(
                <span key={new Date().getTime()+i}>{item}</span>
            );
        }.bind(this));
        var navNodes = this.state.navArrs.map(function(item,i){
            return(
                <li key={new Date().getTime()+i} onClick={this.menuLink.bind(this,item.type,item.ntid,item.limit,item.psw,item.title)}>
                    <a href={item.ac?item.ac:'javascript:void(0);'}>
                        <p><img src={global.img+item.src} width="100%"/>{item.title}</p>
                    </a>
                </li>
            );
        }.bind(this));
        // var exportNodes = this.state.expertInfo.map(function(item,i){
        //     return(
        //         <div>
        //             <li key={i} className="expertName">{item.n}</li>
        //         </div>
        //     )
        // })
		return (
			<div>
				<div className="theme025_container">
                    <div className="theme025_box">
                        <div className="theme025_content"></div>
                        <div className="theme025_headImg">
                            <img src="./image/theme025/logo.png" />
                        </div>
                        {/* <div className="theme025_content">
                            <div className="theme025_content_blank"></div>
                            <div className="theme025_content_abs">{expSpecial}</div>
                            <div className="theme025_content_depart">{this.state.dp}</div>
                            <div className="theme025_content_lawyer"><span className="theme025_content_lawyer">{this.state.nm}</span><span>{this.state.rk}</span></div>
                        </div> */}
                    </div>
                    <ul className="theme025_menu_list">
                        <li className="expertName">{this.state.expertInfo.n}</li>
                        <li className="expertEmail">{this.state.expertInfo.g}</li>
                        <li className="expertEmail">{this.state.expertInfo.e}</li>
                        <li className="expertTel expertMobile"><a href={"tel://" + this.state.expertInfo.m}>手机{this.state.expertInfo.m}<img src="./image/theme025/more.png" /></a></li>
                        <li className="expertAddress expertAddressTitle"><a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'address2')}>大成律师事务所<img width="6"  src="./image/theme025/more.png" /></a></li>
                        <li className="expertAddress">
                            <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'address2')}>{this.state.expertInfo.ad ? this.state.expertInfo.ad.substr(0,12) : ''}</a>
                        </li>
                        <li className="expertAddress">
                            <a href="javascript:void(0);" onClick={this.gotoLink.bind(this,'address2')}>{this.state.expertInfo.ad ? this.state.expertInfo.ad.substr(12) : ''}</a>
                        </li>
                        <li className="expertAddress">邮编: 100020</li>
                        <li className="expertAddress expertAddressActive">大成 Salans FMC SNR Denton McKenna Long</li>
                    </ul>
                </div>
                <Share title={this.state.shareTitle} desc={this.state.shareDesc} imgUrl={global.img+this.state.shareImg} target="index025"/>
                <Message/>
                <Shadow display={this.state.activeState} context="用户尚未开通此功能!"/>
                <div id="limit_password_box" title="" value="" name="" type="">
                    <Password display="true"/>
                </div>
                <LatestNews newsShow={this.state.newsShow} newsTitle={this.state.newsTitle} newsContent={this.state.newsContent} />
                <Establish/>
                <Toolbar/>
                <Shade/>
			</div>
			)
	}
})
module.exports = Index025;