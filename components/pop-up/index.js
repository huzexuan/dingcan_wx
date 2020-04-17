Component({
    properties: {
        title:{
            type:String,
            value:"注册"
        },
        btn_text:{
            type:String,
            value:"保存信息"
        },
        show:{
            type:Boolean,
            value:false
        }
    },
    data: {
    },
    methods: {
        close(){
            let _this = this
            _this.setData({
                show:false
            })
        },
        btn(){
            this.triggerEvent('change');
        }
    }
})