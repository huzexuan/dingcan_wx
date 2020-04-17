Component({
  properties: {
    background: {
      type: String,
      value: '#f00'
    },
    tabs: {
      type: Array
    },
    fixed: {
      type: Boolean,
      value: false
    },
    offsetTop: {
      type: Number,
      value: 0
    },
    fontColor: {
      type: String,
      value: 'black'
    },
    select: {
      type: Number,
      value: 1
    },
    defaultColor: {
      type: String,
      value: 'black'
    }
  },
  data: {
    scroll_left: 0,
    line_width: 0,
    line_translateX: 0
  },
  attached: function() {
    this.setData({
      screen_width: wx.getSystemInfoSync().windowWidth
    });
  },
  ready: function() {
    this.getWidth();
  },
  methods: {
    getWidth: function() {
      var _this = this;
      var query = this.createSelectorQuery().selectAll('.x-tab');
      var width = [],
        offset = [],
        coordinate = [];
      query.boundingClientRect(function(tabs) {
        tabs.forEach(function(tab, idx) {
          width.push(tab.width);
          if (!offset.length) {
            offset.push(Math.round(tab.left));
          } else {
            offset.push(Math.round(tab.left - coordinate[idx - 1] - offset[idx - 1]));
          }
          coordinate.push(tab.right);
        });
      }).exec(function() {
        _this.setData({
          width: width,
          offset: offset
        });
        _this.setLineWidth();
        _this.setLineTranslateX();
        _this.setScrollLeft();
      });
    },
    setScrollLeft: function() {
      var _a = this.data,
        select = _a.select,
        width = _a.width,
        line_translateX = _a.line_translateX,
        screen_width = _a.screen_width;
      this.setData({
        scroll_left: line_translateX - screen_width / 2 + width[select - 1] / 2
      });
    },
    setLineWidth: function() {
      var _a = this.data,
        select = _a.select,
        width = _a.width;
      this.setData({
        line_width: width[select - 1]
      });
    },
    setLineTranslateX: function() {
      var _a = this.data,
        select = _a.select,
        width = _a.width,
        offset = _a.offset;
      var select_length = select - 1 <= 0 ? 0 : select - 1;
      var line_translate = select_length === 0 ? select_length : width.slice(0, select - 1).reduce(function(a, b) {
        return a + b;
      });
      var offset_distance = select_length === 0 ? offset[0] : (offset.slice(0, select - 1).reduce(function(a, b) {
        return a + b;
      })) * 2 + offset[select - 1];
      this.setData({
        line_translateX: line_translate + offset_distance
      });
    },
    changeChoose: function(e) {
      var select = e.target.dataset.idx;
      this.setData({
        select: select
      });
      this.setLineWidth();
      this.setLineTranslateX();
      this.setScrollLeft();
      this.triggerEvent('change', select);
    }
  }
});