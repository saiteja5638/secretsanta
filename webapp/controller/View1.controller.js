sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("secretsanta.controller.View1", {
        onInit() {
            that = this;
        },
        onVerify:function()
        {
            let ID = that.byId("_IDGenInput").getValue();
            let NAME = that.byId("_IDGenInput1").getValue();

            that.getOwnerComponent().getRouter().navTo("View2", {
                id: ID,
                name: NAME
            });
        },
        onVaildation:function()
        {
            that.getOwnerComponent().getModel().read('/secret_santa',{
                success:function(res)
                {

                    let id =  that.byId("_IDGenInput").getValue();
                    let name =  that.byId("_IDGenInput1").getValue();
                    let dob =  that.byId("_IDGenInput2").getValue();
                    let doj =  that.byId("_IDGenInput3").getValue();
                    let contact =  that.byId("_IDGenInput4").getValue();
                    let results = res.results.filter(i=> i.ID == id && i.NAME == name && i.DOB == dob && i.DOJ == doj && i.CONTACT == contact );

                    if (results[0].GIVER == null) {
                        that.onVerify()
                    } else {
                        alert(results[0].GIVER)
                    }
                },
                err:function(err)
                {
                    console.log(err)
                }
            })
        }
    });
});