module Queueit.Model {
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