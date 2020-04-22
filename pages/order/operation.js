const App =getApp()
Page({
    data:{
      page:1
    },
    onLoad(options){
        let _this = this
        _this.setData(options,()=>{
            wx.setNavigationBarTitle({
                title: _this.data.type == 1?'取餐':_this.data.type == 2?'审批':'核销记录'
            })
        })
        _this.orderList()
    },
    onShow(){
      App.up_courierPage()
    },
    //取餐
    take(e){
      let _this = this
        this.setData({
            pop_show:true
        })
      App._get('v1_0_0.Classrecord/code',{
        order_num:e.detail.currentTarget.dataset.id,
        id:e.detail.currentTarget.dataset.section_id
        },res=>{
          _this.setData({
            img_src:res.data.list
          })
      })
    },
    takeFood(){
      this.setData({
        pop_show:false
      })
    },
    //审核
    examine(e){
      let _this = this
      App._get('v1_0_0.approval/approval',{status:2,order_num:e.detail.currentTarget.dataset.id},res=>{
        _this.orderList()
        App.popToast(res.msg)
      })
    },
    no_examine(e){
      let _this = this
      App._get('v1_0_0.approval/approval',{status:3,order_num:e.detail.currentTarget.dataset.id},res=>{
        _this.orderList()
        App.popToast(res.msg)
      })
    },
    orderList(){
        let _this = this
        if(_this.data.type == 3){
          // 核销记录
          if(_this.data.auth == 1){
            App._get('v1_0_0.user/ps_cancelled',{
              page:_this.data.page
            },res=>{
              _this.setData({
                total:res.data.count
              })
              if(res.data.hasOwnProperty('list')){
                let resList = res.data.list,
                    dataList = _this.data.list;
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
          }else{
            App._get('v1_0_0.user/cancelled',{
              page:_this.data.page
            },res=>{
              _this.setData({
                total:res.data.count
              })
              if(res.data.hasOwnProperty('list')){
                let resList = res.data.list,
                    dataList = _this.data.list;
                  
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
          }
        }else if(_this.data.type == 1){
          // 取餐
          App._get('v1_0_0.Classrecord/index',{
            page:_this.data.page
          },res=>{
            _this.setData({
              total:res.data.sum_page
            })
            if(res.data.hasOwnProperty('list')){
            let resList = res.data.list,
                dataList = _this.data.list;
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
        }else{
          // 审批
          App._get('v1_0_0.Approval/index',{
            page:_this.data.page
          },res=>{
            _this.setData({
              total:res.data.sum_page
            })
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
        }
       
      },
      onReachBottom: function () {
        this.setData({
          page: ++this.data.page,
          ispage: true
        }, () => {
          //已经是最后一页
          if (this.data.page  > this.data.total) {
            this.setData({
              no_more: true,
              ispage: false
            });
            return false;
          } else {
            this.orderList()
          }
        })
      },
})