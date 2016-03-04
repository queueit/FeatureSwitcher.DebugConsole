using System;
using System.Diagnostics;
using System.Web;

namespace FeatureSwitcher.DebugConsole.Behaviours
{
    public class DebugConsoleBehaviour
    {
        private readonly bool _isForced = false;

        private DebugConsoleBehaviour(bool isForced)
        {
            this._isForced = isForced;
        }

        internal static FeatureSwitcher.Feature.Behavior AlwaysEnabled => new DebugConsoleBehaviour(true).Behaviour;

        public static FeatureSwitcher.Feature.Behavior IsEnabled => new DebugConsoleBehaviour(false).Behaviour;

        private bool? Behaviour(Feature.Name name)
        {
            if (HttpContext.Current.IsDebuggingEnabled || this._isForced)
            {
                var cookie = HttpContext.Current.Request.Cookies[name.Value];

                if (cookie == null)
                    return null;

                return cookie.Value == "true";
            }

            return null;
        }
    }
}
