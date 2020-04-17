const util = require('./utils/util.js');
App({

  /**S
   * 全局变量
   */
  globalData: {
    user_id: null,
    userInfo: null,
    path: '',
  },

  // api地址
  api_root: '',
  siteInfo: require('siteinfo.js'),

  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function (e) {
    // 设置api地址
    this.setApiRoot();
    // 小程序主动更新
    this.updateManager();
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    var isimpobj = {
      type: true,
      num: 0
    }
    wx.setStorageSync('isimp', isimpobj)
  },
  onHide: function () {
    let _this = this
    if (_this.globalData.detail) {
      _this.globalData.rebateStatus = true;
    }
  },
  /**
   * 发起微信支付
   */
  wxPayment(option) {
    let options = Object.assign({
      payment: {},
      success: () => { },
      fail: () => { },
      complete: () => { },
    }, option);
    wx.requestPayment({
      timeStamp: options.payment.timeStamp,
      nonceStr: options.payment.nonceStr,
      package: options.payment.package ? options.payment.package : 'prepay_id=' + options.payment.prepay_id,
      signType: options.payment.signType ? options.payment.signType : "MD5",
      paySign: options.payment.paySign,
      success(res) {
        options.success(res);
      },
      fail(res) {
        options.fail(res);
      },
      complete(res) {
        options.complete(res);
      }
    });
  },
  /**
   * 设置api地址
   */
  setApiRoot: function () {
    this.api_root = this.siteInfo.siteroot + '/api/';
  },
  /**
   * 显示成功提示框
   */
  showSuccess: function (msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      mask: true,
      duration: 1500,
      success: function () {
        callback && (setTimeout(function () {
          callback();
        }, 1500));
      }
    });
  },
  // 文字弹窗
  popToast(msg) {
    wx.showToast({
      title: msg,
      duration: 2000,
      icon:'none'
    });
  },
  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },
  /**
   * get请求
   */
  _get: function (url, data, success) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let App = this;
    // 构造请求参数
    data = data || {};
    data.user_token=wx.getStorageSync('user_token')
    data.user_id=wx.getStorageSync('user_id')
    // 构造get请求
      wx.request({
        url: App.api_root + url,
        header: {
          'content-type': 'application/json'
        },
        data: data,
        success: function (res) {
          success && success(res.data);
        },
        fail: function () {
          App.showError('网络繁忙，请重试');
        },
        complete: function () {
          wx.hideLoading();
        },
      });
  },
  /**
   * post提交
   */
  _post_form: function (url, data, success, fail, complete) {
    let App = this;
    data.wxapp_id = App.siteInfo.uniacid;
    data.applets = App.siteInfo.applets;

    data.token = wx.getStorageSync('token');
    data.applets = App.siteInfo.applets;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: App.api_root + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          App.showError('网络请求出错');
          return false;
        }
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          wx.hideLoading();
          return false;
        } else if (res.data.code === 0) {
          App.showError(res.data.msg, function () {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail: function (res) {
        App.showError('网络繁忙，请重试', () => {
          fail && fail(res)
        });
      },
      complete: function (res) {
        wx.hideLoading();
        complete && complete(res);
      }
    });
  },

  /**
   * 对象转URL
   */
  urlEncode: function (data) {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (Array.isArray(value)) {
        value.forEach(function (_value) {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  },

  /**
   * 小程序主动更新
   */
  updateManager: function () {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将重启应用',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  }
});