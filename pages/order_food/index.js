const App = getApp()
Page({
    data: {
        food_money: 0,
        tab:[{
            title:"员工餐",
            icon:'/img/order_img.png',
            id:1
        },{
            title:"回族餐",
            icon:'/img/muslim.png',
            id:2
        }],
        muslim:[{
            id:1,
            title:'用餐'
        },{
            id:2,
            title:'领物品'
        }],
        select_tabid:1,
        select_muslimId:1
    },
    onLoad(options) {
        this.setData(options)
    },
    onShow() {
        let _this = this
        App.up_courierPage()
        _this.orderList()
        App._get('v1_0_0.user/index', {}, res => {
            _this.setData(res.data)
        })

    },
    orderList(){
        let _this = this
        App._get('v1_0_0.food/index', {
            user_id: wx.getStorageSync('user_id'),
            nation: _this.data.select_tabid || 1
        }, res => {
            _this.setData(res.data)
            for (let i = 0; i < res.data.list.length; i++) {
                if (res.data.list[i].is_selected == 1) {
                    _this.setData({
                        food_id: res.data.list[i].food_id
                    })
                }
            }
        })
    },
    overtime() {
        this.setData({ overtime_pop_show: true })
    },
    submit_order() {
        this.setData({ pop_show: true })
    },
    lunch_areas(e) {
        this.setData({ lunch_remark: e.detail.detail.value })
    },
    dinner_areas(e) {
        this.setData({ dinner_remark: e.detail.detail.value })
    },
    // 申请加班餐
    purchase(e) {
        let _this = this
        const { lunch_remark, dinner_remark, food_id } = _this.data
        let callback = result => {
            App.wxPayment({
                payment: result.data,
                success: res => {
                    App.popToast(res.msg)
                    _this.setData({
                        overtime_pop_show: false,
                        pop_show: false
                    })
                },
                fail: res => {
                    App.popToast("订单支付失败")
                },
            });
        };
        App._get('v1_0_0.order/suborder', {
            user_id: wx.getStorageSync('user_id'),
            order_type: e.currentTarget.dataset.type,
            food_id,
            remark: e.currentTarget.dataset.type == 1 ? lunch_remark || '' : dinner_remark || ''
        }, res => {
            if (res.data.user_auth == 3) {
                App.popToast(res.msg)
                _this.setData({
                    pop_show: false
                })
                wx.switchTab({
                    url: '/pages/order/index'
                })
            } else if (res.data.user_auth == 1) {
                App._post_form('v1_0_0.wxpay/unifiedorder', { order_num: res.data.order_num }, res => {
                    callback(res);
                })
            } else if (res.code == 201) {
                App.popToast(res.msg)
            }
        })
    },
    tab_btn(e){
        let _this = this
        _this.setData({
            select_tabid:e.currentTarget.dataset.id
        },res=>{
            _this.orderList()
        })
    },
    muslim_tab(e){
        let _this = this
        _this.setData({
            select_muslimId:e.currentTarget.dataset.id
        },res=>{
            
        })
    }
})