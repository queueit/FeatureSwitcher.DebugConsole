#define DEBUG

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using FeatureSwitcher.DebugConsole.Controllers.ViewModels;

namespace FeatureSwitcher.DebugConsole.Controllers
{
    public class DebugConsoleController : Controller
    {
        private bool _isEnabled = false;

        [HttpPost]
        [Route("featureswitcher/debugconsole/states")]
        public ActionResult GetStates()
        {
            if (Debugger.IsAttached ||this._isEnabled)
            {
                var features = this.FindAllFeatures();

                var featureStates = features.Select(featureType =>
                {
                    var feature = Activator.CreateInstance(featureType) as IFeature;

                    return new FeatureState() {FeatureName = featureType.FullName, Enabled = feature.Is().Enabled};
                });

                return Json(new GetStateResult() {Enabled = true, States = featureStates.ToArray()});
            }

            return Json(new GetStateResult() { Enabled = false });
        }

        internal void SetEnabled()
        {
            this._isEnabled = true;
        }

        private Type[] FindAllFeatures()
        {
            return AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(domain => domain.GetTypes())
                .Where(type => !type.IsInterface && !type.IsAbstract && typeof(IFeature).IsAssignableFrom(type))
                .ToArray();
        }
    }
}
