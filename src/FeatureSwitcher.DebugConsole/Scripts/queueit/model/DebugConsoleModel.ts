﻿/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/js-cookie/js-cookie.d.ts" />
/// <reference path="../../typings/bootstrap/bootstrap.d.ts" />

module Queueit.Model {
    
    export class DebugConsoleModel {
        model: any;

        constructor() {
            this.model = null;

            window.onload = () => {
                this.initialize();
            };
        }

        public initialize() {

            if (!document.getElementById('feature-switcher-debug-console-iframe')){ // main frame code
                var scriptElement = document.getElementById('feature-debug-console-script');
                var iframe = document.createElement('iframe');
                iframe.style.cssText = "margin:0px;border:0px none;height:100px;width:100%";
                document.body.appendChild(iframe);
                var src = "javascript:(function() { document.open(); document.write('<!DOCTYPE html><html lang=\"en\"><head><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\"><script type=\"text/javascript\" src=\"http://code.jquery.com/jquery-2.1.3.min.js\"></script><script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.0/js.cookie.min.js\"></script><script type=\"text/javascript\" src= \"https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js\"></script>" + scriptElement.outerHTML + "</head><body id=\"feature-switcher-debug-console-iframe\"></body></html>'); document.close();})()";
                iframe.src = src;
            }
            else { // iframe code
                this.model = ko.observable(null);

                var featureBindingElement: HTMLDivElement = <HTMLDivElement>document.createElement('div');
                featureBindingElement.setAttribute("data-bind", "component: { name: 'feature-component', params: { states: states }}");
                document.body.appendChild(featureBindingElement);

                ko.components.register('feature-component', {
                    viewModel: function (params) {
                        this.states = params.states;
                    },
                    template: '<div id="feature-iframe" class="row" style="width: 1170px; margin-left: 370px;"><div class="col-xs-12" data- bind="visible: states.length > 0" ><table class="table table-hover"><tbody data-bind="foreach: states"><tr data-bind="css: { success: enabled }"><td class="col-xs-3 form-group"><span data-bind="text: shortFeatureName"></span></td><td class="col-xs-7 form-group"><span data-bind="text: featureName"></span></td><td class="col-xs-2 text-right"><div class="text-right" style="white-space: nowrap;"><span data-bind="if: enabled"><button id="onBtn" type="button" class="btn btn-success" data-bind="click: toggleFeature">ON</button></span><span data-bind="if: enabled() === false"><button id="offBtn" type="button" class="btn btn-danger" data-bind="click: toggleFeature">OFF</button></span><span data-bind="if: enabled() === null"><button id="defaultBtn" type="button" class="btn btn-default" data-bind="click: toggleFeature">Default</button></span></div> </td></tr></tbody></table></div></div>'
                });

                $.ajax({
                    type: "POST",
                    url: "/featureswitcher/debugconsole/states",
                    success: (data) => {
                        this.loadSuccess(data);
                        ko.applyBindings(this.model);
                    },
                    error: (errorResponse) => {
                        alert('error loading data');
                    }
                });
            }
        }

        protected loadSuccess(loadedData: any) {
            this.model = {
                states: ko.observableArray<FeatureState>()
            };

            for (var i = 0; i < loadedData.States.length; i++) {
                this.model.states.push(new FeatureState(loadedData.States[i]));
            }              
        }
    }

    export class FeatureState {
        featureName: KnockoutObservable<string>;
        shortFeatureName: KnockoutObservable<string>;
        enabled: KnockoutObservable<boolean>;

        constructor(state: any) {
            this.featureName = ko.observable(state.FeatureName);
            this.shortFeatureName = ko.observable(state.ShortFeatureName);
            this.enabled = ko.observable(state.Enabled);
        }

        toggleFeature = () => {
            if (this.enabled() === null) {
                Cookies.set(this.featureName(), false, { path: '/' });
                this.enabled(false);
                return;
            }

            if (this.enabled() === false) {
                Cookies.set(this.featureName(), true, { path: '/' });
                this.enabled(true);
                return;
            }

            if (this.enabled()) {
                Cookies.remove(this.featureName(), { path: '/' });  
                this.enabled(null);
                return;
            }
        };  
    }
}

var debugConsole = new Queueit.Model.DebugConsoleModel();
