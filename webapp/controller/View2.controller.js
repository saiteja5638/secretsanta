sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("secretsanta.controller.View2", {
        onInit() {
            that = this;

            if (!that.create) {

                that.create = sap.ui.xmlfragment("secretsanta.view.display2", that);
            }
            if (!that.busy1) {

                that.busy1 = new sap.m.BusyDialog({
                    text:"Loading..."
                   
                });
            }

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
          
            var oArgs = oEvent.getParameter("arguments");
            var sId = oArgs.id;
            
            that.onBindings(sId)

            that.getOwnerComponent().getModel('ID').setData({
                items:sId
            })
        },
        onClose:function()
        {
            that.create.close()
        },
        onBindings:function(sId)
        {
            that.busy1.open()
            that.getOwnerComponent().getModel().read('/secret_santa',{
                success:function(res)
                {
                    var filtered_array = [];

                    res.results.forEach(element => {

                        if ((element.STATUS == 'NOT')&&(element.PASSKEY != sId) ) {
                            
                            filtered_array.push(element)
                        }
                        
                    });

                    let oModel = new sap.ui.model.json.JSONModel({
                        items:filtered_array
                    })

                    that.byId("gridList").setModel(oModel)
                    that.busy1.close()

                },
                error:function(err)
                {
                    console.log(err)
                }
            })
        },
        vaildtor:function()
        {
            that.busy1.open()
            that.getOwnerComponent().getModel().read("/secret_santa",{
                success:function(res)
                {
                    let VAILDTOR_ID = that.getOwnerComponent().getModel('ID').getData().items;

                    let filtered = res.results.filter(i=>i.PASSKEY == VAILDTOR_ID)

                    if (filtered[0].GIVER==null) {
                        that.onFindSecretSanta(filtered[0].ID)
                    } else {
                        that.busy1.close()
                          that.create.open()
                        sap.ui.getCore().byId("_IDGenTi5tle1").setText(filtered[0].GIVER)
                    }

                }
            })
        },
        sendEmail:function(UserID)
        {
            that.getOwnerComponent().getModel().callFunction('/SendEmail',{
                method: "GET",
                urlParameters: {
                    ID: UserID,
                },
                success:function(res)
                {
                    console.log(res)
                   
                },
                err:function(er)
                {
                    console.log(er)
                }
            })
        },
        onFindSecretSanta:function(User_ID)
        {
            that.getOwnerComponent().getModel().callFunction('/GetGiver',{
                method:'GET',
                urlParameters:{
                    ID:User_ID
                },
                success:function(res)
                {
                    that.busy1.close()
                    that.create.open()
                    sap.ui.getCore().byId("_IDGenTi5tle1").setText(res.GetGiver.NAME)
                    that.sendEmail(User_ID)
                },
                error:function(err)
                {
                    alert("Please Retry After Sometiime ")
                }
            })
        }
    });
});