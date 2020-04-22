const App = getApp()
import utils from '../../utils/util.js'
Page({
    data:{
        menu:[{
            type:2,
            icon:"/img/scan.png",
            name:'扫一扫',
            tap:'transferScan'
        },{
            type:1,
            icon:"/img/record.png",
            name:'核销记录',
            url:'/pages/order/operation?type=3&auth=1'
        }]
    },
    onShow(){
        let _this =this
        App._get('v1_0_0.user/index',{},res=>{
            _this.setData(res.data)})
    },
    transferScan(){
        let _this = this
        wx.scanCode({
            success: (res) => {
                App._get('v1_0_0.Classrecord/record',{
                    code_user_id:utils.urlEncode(res.result).user_id,
                    order_num:utils.urlEncode(res.result).order_num,
                    id:utils.urlEncode(res.result).id
                },res=>{
                    App.popToast(res.msg)
                })
            }
          })
    }
})