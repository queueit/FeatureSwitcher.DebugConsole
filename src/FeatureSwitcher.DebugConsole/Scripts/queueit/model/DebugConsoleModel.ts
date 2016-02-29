/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/js-cookie/js-cookie.d.ts" />

module Queueit.Model {
    
    export class DebugConsoleModel {
        model: any;

        constructor() {
            this.model = ko.observable(null);

            window.onload = () => {
                this.initialize();                  
            };
            var featureBindingElement = document.createElement('div');
            featureBindingElement.setAttribute("data-bind", "component: { name: 'feature-component', params: { states: states }}");
            document.body.appendChild(featureBindingElement);

            ko.components.register('feature-component', {
                viewModel: function (params) {
                    this.states = params.states;
                },
                template: '<div style="margin-left: 390px; margin-top: 50px;" data-bind="foreach: states"><span data-bind="text: featureName"></span><span style="margin-left: 20px;" data-bind="text: shortFeatureName"></span><span style="margin-left: 20px;" data-bind="if: enabled"><button id="onBtn" type="button" data-bind="click: toggleFeature">ON</button></span><span data-bind="ifnot: enabled"><button id="offBtn" type="button" data-bind="click: toggleFeature">OFF</button></span><span data-bind="if: enabled === null"><button id="defaultBtn" type="button" data-bind="click: toggleFeature">Default</button></span><br></div>'
            });
        }

        public initialize() {
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
            this.enabled(!this.enabled());

            if (this.enabled()) {
                Cookies.set(this.featureName(), true, {expires: 7, path: '/'});
            }

            if (this.enabled() === false) {
                Cookies.set(this.featureName(), false, { expires: 7, path: '/' });
            }

            if (this.enabled() === null) {
                Cookies.remove(this.featureName(), { path: '/' }); // removed!   
            }
        };
    }
}

var debugConsole = new Queueit.Model.DebugConsoleModel();
