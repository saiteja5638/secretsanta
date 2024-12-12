sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    var that;
    return Controller.extend("secretsanta.controller.View3", {
        onInit() {
            that = this;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("View3").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
          
            var oArgs = oEvent.getParameter("arguments");
            var sId = oArgs.id;
            console.log(sId)

            that.byId("_IDGenText").setText(sId)
      

        }
    });
});