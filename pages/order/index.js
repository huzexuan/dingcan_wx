const App = getApp()
Page({
    data:{
        selects:1,
        
    },
     // tab切换
  changeSelect(e) {
    let _this = this
    wx.pageScrollTo({
      scrollTop: 0
    })
    _this.setData({
      selects:e.detail,
      page:1
    })
    _this.orderList(e.detail == 1 ? 0:e.detail == 2 ? 2:4) 
  },
  onShow(){
    App.up_courierPage()
    let _this = this
    _this.setData({
      page:1,
      no_more:false
    })
    _this.orderList(_this.data.selects == 1 ? 0:_this.data.selects == 2 ? 2:4) 
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
    App._get('v1_0_0.Orderlist/index',{status,page:_this.data.page},res=>{
      _this.setData({total:res.data.sum_page})
      if(res.data.hasOwnProperty('list')){
      let resList = res.data.list,
          dataList = _this.data.list;
        // 数据的页数
        if (_this.data.ispage == true) {
          _this.setData({
            list: dataList.concat(resList),
          });
        } else {
          _this.setData({
            list: resList,
          });
        }
      }else{
        _this.setData({
          list: [],
        });
      }
    })
  },
  onReachBottom: function () {
    let _this = this
    _this.setData({
      page: ++this.data.page,
      ispage: true
    }, () => {
      //已经是最后一页
      if (_this.data.page  > _this.data.total) {
        _this.setData({
          no_more: true,
          ispage: false
        });
        return false;
      } else {
        _this.orderList(_this.data.selects == 1 ? 0:_this.data.selects == 2 ? 2:4)
      }
    })
  },
})