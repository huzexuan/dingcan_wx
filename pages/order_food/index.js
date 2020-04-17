
const App = getApp()
Page({
    data:{
    },
    onLoad(options){
        this.setData(options)
    },
    onShow(){
        let _this = this
        App._get('v1_0_0.food/index',{
            user_id:wx.getStorageSync('user_id'),
            nation:_this.data.type
        },res=>{
            _this.setData(res.data)
            for(let i =0;i<res.data.list.length;i++){
                if(res.data.list[i].is_selected == 1){
                    _this.setData({
                        food_id:res.data.list[i].food_id
                    })
                }
            }
        })
    },
    overtime(){
        this.setData({overtime_pop_show:true})
    },
    submit_order(){
        this.setData({pop_show:true})
    },
    lunch_areas(e){
        this.setData({lunch_remark:e.detail.value})
    },
    dinner_areas(e){
        this.setData({dinner_remark:e.detail.value})
    },
    // 申请加班餐
    purchase(e){
        let _this =this
        const{lunch_remark,dinner_remark,food_id}=_this.data
        App._get('v1_0_0.order/suborder',{
            user_id:wx.getStorageSync('user_id'),
            order_type:e.currentTarget.dataset.type,
            food_id,
            remark:e.currentTarget.dataset.type == 1?lunch_remark || '':dinner_remark || ''
        },res=>{
            // if(res.data.user_auth == 1){
            // }else if(res.data.user_auth == 3){

            // }
        })
    }
})