const App = getApp()
Page({
    data: {
        food_money: 0,
        tab: [{
            title: "员工餐",
            icon: '/img/order_img.png',
            id: 1
        }, {
            title: "回族餐",
            icon: '/img/muslim.png',
            id: 2
        }],
        muslim: [{
            id: 1,
            title: '用餐'
        }, {
            id: 2,
            title: '领物品'
        }],
        select_tabid: 1,
    },
    onLoad(options) {
        this.setData(options)
    },
    onShow() {
        let _this = this
        App.up_courierPage()
        _this.orderList()
        _this.setData({
            select_muslimId: wx.getStorageSync('is_checked'),
            is_checked: wx.getStorageSync('is_checked'),
            nation: wx.getStorageSync('nation')
        })
        App._get('v1_0_0.user/index', {}, res => {
            _this.setData(res.data)
        })

    },
    orderList() {
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
    submit() {
        let _this = this
        wx.showModal({
            title: '温馨提示',
            confirmText: '确定',
            cancelText: '取消',
            content: '请先选择用餐或领物品',
            success: function(res) {

            }
        })
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
    tab_btn(e) {
        let _this = this
        _this.setData({
            select_tabid: e.currentTarget.dataset.id,
            select_muslimId: wx.getStorageSync('is_checked'),
            overtime_pop_show: false
        }, res => {
            _this.orderList()
        })
    },
    muslim_tab(e) {
        let _this = this
        _this.setData({
            select_muslimId: e.currentTarget.dataset.id
        }, res => {
            wx.showModal({
                title: `当前选择${_this.data.select_muslimId == 1?'用餐':'领物品'}`,
                confirmText: '确定',
                cancelText: '取消',
                content: '此选项一个月只能选择一次，是否确定？',
                success: function(res) {
                    if (res.confirm) {
                        App._get('v1_0_0.food/save_user_subsidy', {
                            user_id: wx.getStorageSync('user_id'),
                            type: _this.data.select_muslimId
                        }, res => {
                            wx.setStorageSync('is_checked', _this.data.select_muslimId) //1 用餐 2领物品
                            _this.onShow()
                        })
                    }
                    if (res.cancel) {
                        _this.setData({
                            select_muslimId: 0
                        })
                    }
                }
            })
        })
    },
    as_muslim() {
        App.popToast('已经选择，不可更换')
    }
})