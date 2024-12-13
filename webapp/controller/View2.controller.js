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
                    text:"Search For Secret Santa....."
                   
                });
            }

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

                        if ((element.STATUS == 'NOT')&&(element.ID != sId) ) {
                            
                            filtered_array.push(element)
                        }
                        
                    });
                    that.getOwnerComponent().getModel('oEmployess').setData({
                        data:filtered_array
                    })

                    that.byId("page1").setTitle(` ${filtered_array.length} `)
                    
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
        onUpdate_Infomation:function()
        {

            let USER_ID = that.getOwnerComponent().getModel('ID').getData().items;

            let filtered_employee =  that.getOwnerComponent().getModel('oEmployess').getData().data;

            function getRandomRecord(dataArray) {
                const randomIndex = Math.floor(Math.random() * dataArray.length);
                return dataArray[randomIndex];
            }
            const randomRecord = getRandomRecord(filtered_employee);
            randomRecord['STATUS'] = 'YES';

            let edit_obj ={
                GIVER:randomRecord.NAME
            }

            that.getOwnerComponent().getModel().update(`/secret_santa('${USER_ID}')`,edit_obj,{
                success:function(res)
                {
                    that.getOwnerComponent().getModel().update(`/secret_santa('${randomRecord.ID}')`,randomRecord,{
                        success:function(res)
                        {
                            that.busy1.close()
                            that.create.open()
                            sap.ui.getCore().byId("_IDGenTi5tle1").setText(res.NAME)
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
            that.busy1.open()
            that.getOwnerComponent().getModel().read("/secret_santa",{
                success:function(res)
                {
                    let VAILDTOR_ID = that.getOwnerComponent().getModel('ID').getData().items;

                    let filtered = res.results.filter(i=>i.ID == VAILDTOR_ID)

                    if (filtered[0].GIVER==null) {
                        that.onUpdate_Infomation()
                    } else {
                        that.busy1.close()
                          that.create.open()
                        sap.ui.getCore().byId("_IDGenTi5tle1").setText(filtered[0].GIVER)
                    }

                }
            })
        }
    });
});