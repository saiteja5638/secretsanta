sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("secretsanta.controller.View2", {
        onInit() {
            that = this;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
          
            var oArgs = oEvent.getParameter("arguments");
            var sId = oArgs.id;
            var sName = oArgs.name;
            console.log(sId+" "+sName)
            that.onBindings(sId)

            that.getOwnerComponent().getModel('ID').setData({
                items:sId
            })
        },
        onBindings:function(sId)
        {
            that.getOwnerComponent().getModel().read('/secret_santa',{
                success:function(res)
                {
                    var filtered_array = [];

                    res.results.forEach(element => {

                        if ((element.STATUS == 'NOT')&&(element.ID != sId) ) {
                            
                            filtered_array.push(element)
                        }
                        
                    });


                    that.getOwnerComponent().getModel('oEmployess').setData({
                        data:filtered_array
                    })

                    let oModel = new sap.ui.model.json.JSONModel({
                        items:filtered_array
                    })

                    that.byId("gridList").setModel(oModel)


                },
                error:function(err)
                {
                    console.log(err)
                }
            })
        },
        onUpdate_Infomation:function()
        {

            let filtered_employee =  that.getOwnerComponent().getModel('oEmployess').getData().data;

            function getRandomRecord(dataArray) {
                const randomIndex = Math.floor(Math.random() * dataArray.length);
                return dataArray[randomIndex];
            }
            const randomRecord = getRandomRecord(filtered_employee);
            randomRecord['STATUS'] = 'YES';

            let ID = that.getOwnerComponent().getModel('ID').getData().items;

            let edit_obj ={
                GIVER:randomRecord.NAME
            }

            that.getOwnerComponent().getModel().update(`/secret_santa('${ID}')`,edit_obj,{
                success:function(res)
                {
                    console.log(res)
                    sap.m.MessageToast.show("updated")
                    
                    that.getOwnerComponent().getModel().update(`/secret_santa('${randomRecord.ID}')`,randomRecord,{
                        success:function(res)
                        {
                            console.log(res)
                
                            that.getOwnerComponent().getRouter().navTo("View3", {
                                id: randomRecord.ID
                                
                            });
                        },
                        err:function(err)
                        {
                            console.log(err)
                        }
                    })

                },
                err:function(err)
                {
                    console.log(err)
                    sap.m.MessageToast.show(" Not  updated")
                }
            })

        },
        vaildtor:function()
        {
            that.getOwnerComponent().getModel().read("/secret_santa",{
                success:function(res)
                {
                    let ID = that.getOwnerComponent().getModel('ID').getData().items;

                    let filtered = res.results.filter(i=>i.ID == ID)

                    if (filtered[0].GIVER==null) {
                        
                    } else {
                        that.getOwnerComponent().getRouter().navTo("View3", {
                            id: iltered[0].GIVER
                            
                        });
                    }

                }
            })
        }
    });
});