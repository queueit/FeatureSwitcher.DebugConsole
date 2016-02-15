using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using FeatureSwitcher.DebugConsole.Behaviours;
using FeatureSwitcher.DebugConsole.Tests.Features;
using Xunit;

namespace FeatureSwitcher.DebugConsole.Tests.Behaviours
{
    public class DebugConsoleBehaviourTest
    {
        [Fact]
        private void DebugConsoleBehaviour_Enabled_Test()
        {
            SetContext(typeof(TestFeature1).FullName, true);

            Assert.True(DebugConsoleBehaviour.AlwaysEnabled(new Feature.Name(typeof(TestFeature1), typeof(TestFeature1).FullName)));
        }

        [Fact]
        private void DebugConsoleBehaviour_Disabled_Test()
        {
            SetContext(typeof(TestFeature1).FullName, true);

            Assert.True(DebugConsoleBehaviour.AlwaysEnabled(new Feature.Name(typeof(TestFeature1), typeof(TestFeature1).FullName)));
        }

        [Fact]
        private void DebugConsoleBehaviour_Default_Test()
        {
            SetContext(typeof(TestFeature1).FullName, null);

            Assert.Null(DebugConsoleBehaviour.AlwaysEnabled(new Feature.Name(typeof(TestFeature1), typeof(TestFeature1).FullName)));
        }

        private static void SetContext(string cookieName, bool? enabled)
        {
            HttpRequest orgRequest = new HttpRequest(
                null,
                "http://q.queue-it.net/Inqueue.aspx",
                "");

            HttpContext context = new HttpContext(orgRequest, new HttpResponse(new StringWriter()));
            if (enabled.HasValue)
            {
                HttpCookie cookie = new HttpCookie(cookieName);
                cookie.Value = enabled.ToString().ToLower();
                context.Request.Cookies.Add(cookie);
            }
            HttpContext.Current = context;
        }
    }
}
