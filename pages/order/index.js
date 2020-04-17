const App = getApp()
Page({
    data:{
        selects:1,
    },
     // tab切换
  changeSelect(e) {
    let _this = this
    e.detail == 1 ?_this.orderList(0) :e.detail == 2 ?_this.orderList(2) :e.detail == 3 ?_this.orderList(4):''
  },
  onShow(){
    let _this = this
    _this.orderList(0)
  },
  refund(e){
    let _this = this
    App._get('v1_0_0.Orderlist/retreat_food',{
      order_num:e.detail.currentTarget.dataset.order_num
    },res=>{
      _this.orderList(0)
    })
  },
  orderList(status){
    let _this = this
    App._get('v1_0_0.Orderlist/index',{
      status
    },res=>{
      _this.setData(res.data)
    })
  },
})