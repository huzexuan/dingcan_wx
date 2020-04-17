Component({
    properties: {
        list:{
            type:Array
        }
    },
    data: {
    },
    methods: {
        refund(e){
            this.triggerEvent('refund_change',e);
        }
    }
})