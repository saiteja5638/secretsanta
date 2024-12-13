sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("secretsanta.controller.View1", {
        onInit() {
            that = this;

            if (!that.create) {

                that.create = sap.ui.xmlfragment("secretsanta.view.display", that);
            }

            if (!that.busy) {

                that.busy = new sap.m.BusyDialog({
                    text:"Search For Secret Santa....."
                   
                });
            }
        },
        onViewFrag:function()
        {
            that.create.open()
        },
        onClose:function()
        {
            that.create.close()
        },
        onVerify:function(ID,NAME)
        {
            that.busy.close()
            that.getOwnerComponent().getRouter().navTo("View2", {
                id: ID,
                name: NAME
            });
        },
        onVaildation:function()
        {
            that.busy.open()
            that.getOwnerComponent().getModel().read('/secret_santa',{
                success:function(res)
                {

                    let EMAIL1 =  that.byId("_IDGenInput").getValue();
                    let PASSKEY1 =  that.byId("_IDGenInput1").getValue();

 

                    let results = res.results.filter(i=> i.EMAIL == EMAIL1 && i.PASSKEY == PASSKEY1);
                  

                    if (results.length == 0) {
                        that.busy.close()
                        alert("Please provide vaild details ")
                    } else {
                        if (find_detail) {
                            if (results[0].GIVER==null) {
     
                             let id =  results[0].ID;
                             let name =  results[0].NAME;
                             
                             that.onVerify(id,name)
                            } else {
                             that.busy.close()
                             that.create.open()
                             sap.ui.getCore().byId("_IDGenTitle1").setText(results[0].GIVER)
                            }
                         }
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