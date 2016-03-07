/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/js-cookie/js-cookie.d.ts" />

module Queueit.Model {
    
    export class DebugConsole {
        model: any;

        constructor() {
            this.model = null;

            var orgOnLoad = window.onload;
            window.onload = (ev) => {
                this.initialize();
                if (orgOnLoad)
                    orgOnLoad(ev);
            };
        }

        public initialize() {

            if (!document.getElementById('feature-switcher-debug-console-iframe')){ // main frame code
                var scriptElement = document.getElementById('feature-debug-console-script');
                var iframe = document.createElement('iframe');
                iframe.style.cssText = "margin:0px;border:0px none;height:100px;width:100%";
                document.body.appendChild(iframe);
                var src = "javascript:(function() { document.open(); document.write('<!DOCTYPE html><html lang=\"en\"><head><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\"><script type=\"text/javascript\" src=\"https://code.jquery.com/jquery-2.1.3.min.js\"></script><script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.0/js.cookie.min.js\"></script><script type=\"text/javascript\" src= \"https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js\"></script>" + scriptElement.outerHTML + "</head><body id=\"feature-switcher-debug-console-iframe\"></body></html>'); document.close();})()";
                iframe.src = src;
            }
            else { // iframe code
                this.model = ko.observable(null);

                $.ajax({
                    type: "POST",
                    url: "/featureswitcher/debugconsole/states",
                    success: (data) => {
                        this.loadSuccess(data);
                    }
                });
            }
        }

        protected loadSuccess(loadedData: any) {

            if (!loadedData.Enabled)
                return;

            var featureBindingElement: HTMLDivElement = <HTMLDivElement>document.createElement('div');
            featureBindingElement.setAttribute("data-bind", "component: { name: 'feature-component', params: { states: states }}");
            document.body.appendChild(featureBindingElement);

            ko.components.register('feature-component', {
                viewModel: function (params) {
                    this.states = params.states;
                },
                template: '<div id="feature-iframe" class="row" style="margin-left: 30px;margin-right: 30px;"><div class="col-xs-12"><table class="table table-hover"><tbody data-bind="foreach: states"><tr data-bind="css: { success: enabled }"><td class="col-xs-3 form-group"><span data-bind="text: shortFeatureName"></span></td><td class="col-xs-7 form-group"><span data-bind="text: featureName"></span></td><td class="col-xs-2 text-right"><div class="text-right" style="white-space: nowrap;"><span data-bind="if: enabled"><button id="onBtn" type="button" class="btn btn-success" data-bind="click: toggleFeature">ON</button></span><span data-bind="if: enabled() === false"><button id="offBtn" type="button" class="btn btn-danger" data-bind="click: toggleFeature">OFF</button></span><span data-bind="if: enabled() === null"><button id="defaultBtn" type="button" class="btn btn-default" data-bind="click: toggleFeature">Default</button></span></div> </td></tr></tbody></table></div></div>'
            });

            this.model = {
                states: ko.observableArray<FeatureState>()
            };

            for (var i = 0; i < loadedData.States.length; i++) {
                this.model.states.push(new FeatureState(loadedData.States[i]));
            }       
            
            ko.applyBindings(this.model);      
        }
    }

    var debugConsole = new Queueit.Model.DebugConsole();
}

