//index.js
//获取应用实例
const App = getApp()

Page({
  data: {
    // banner
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    // tab
    tab:[{
      title:'员工餐',
      icon:'/img/index_tab1.png',
      url:'/pages/order_food/index?type=1'
    },{
      title:'回族餐',
      icon:'/img/index_tab2.png',
      url:'/pages/order_food/index?type=2'
    }],
    phone:'15032266556',
    index: 0,
    ethnicOutid:1,
    ethnic:[{
      name:'汉族',
      id:1
    },{
      name:'回族',
      id:2
    }],
  },
  onLoad() {
    let _this = this
    App._get('v1_0_0.home/index',{},res=>{
      _this.setData(res.data)
    })
  },
  // 弹框
  register_pop(){
    let _this = this
    _this.setData({
      pop_show:true
    })
    //获取所有公司
    App._get('v1_0_0.register/get_company_list',{},res=>{
      _this.setData({
        company:res.data.list
      })
    })
     // 微信Code获取
     wx.login({
      success: res => {
        _this.setData({
          wxCode:res.code
        })
      }
    })
  },
  onShow(){
    let _this = this
    _this.setData({
      user_id:wx.getStorageSync('user_id'),
      user_token:wx.getStorageSync('user_token')
    })
  },
  //注册
  register(){
    let _this = this
    const {user_Name,user_Phone,company_id,section_id,ethnicOutid,wxCode}=_this.data
    if(user_Name == '' || !user_Name){
      App.popToast('姓名不能为空')
      return
    }
    if(user_Phone == ''){
      App.popToast('手机号不能为空')
    }else if (!(/^1[34578]\d{9}$/.test(user_Phone)) ) {
      App.popToast('手机号格式不对')
      return
    }
    if(company_id == '' || !company_id){
      App.popToast('请选择公司')
      return
    }
    if(section_id == '' || !section_id){
      App.popToast('请选择部门')
      return
    }
    App._get('v1_0_0.register/do_register',{
      code:wxCode,
      name:user_Name,
      phone:user_Phone,
      company_id,
      class_id:section_id,
      nation:ethnicOutid
    },res=>{
      if(res.code == 200){
        App.showSuccess(res.msg,()=>{
          _this.setData({
            pop_show:false,
            user_id:res.data.user_id,
            user_token:res.data.user_token
          })
        })
        wx.setStorageSync('user_id',res.data.user_id)
        wx.setStorageSync('user_token',res.data.user_token)
      }
    })
  },
  //拨打联系电话
  Tap_phone(){
    let _this = this
    wx.makePhoneCall({
      phoneNumber: _this.data.phone
    })
  },
  //获取手机号
  blurPhone(e){
    let _this = this
    _this.setData({
      user_Phone:e.detail.value
    })
  },
  // 获取姓名
  blurname(e){
    let _this = this
    _this.setData({
      user_Name:e.detail.value
    })
  },
  //获取部门
  section_bindPickerChange(e) {
    let _this = this
    _this.setData({
      index: e.detail.value,
      section_text:_this.data.section[e.detail.value].name,
      section_id:_this.data.section[e.detail.value].id
    })
  },
  has_section(){
    App.showError("请先选择公司")
  },
  // 获取公司
  company_bindPickerChange(e){
    let _this = this
    _this.setData({
      index: e.detail.value,
      company_text:_this.data.company[e.detail.value].name,
      company_id:_this.data.company[e.detail.value].id
    })
    // 获取所有部门
    App._get('v1_0_0.register/get_class_list',{
      company_id:_this.data.company[e.detail.value].id
    },res=>{
      _this.setData({
        section:res.data.list
      })
    })
  },
  // 获取民族
  ethnic(e){
    let _this = this
    _this.setData({
      ethnicOutid:e.currentTarget.id
    })
  }
})
