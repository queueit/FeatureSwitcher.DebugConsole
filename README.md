# FeatureSwitcher.DebugConsole

A Feature Switcher debug console for web applications that allows you to easily turn on and off features in MVC applications.

![Eaxample screenshot](https://raw.githubusercontent.com/queueit/FeatureSwitcher.DebugConsole/master/docs/img/screen-shot.PNG "Eaxample screenshot")

The console will appear only on debug builds. In release builds functionality is disabled.

# Setup

## Install nuget package
Install-Package FeatureSwitcher.DebugConsole

## Configure behaviour
```c#
Features.Are.ConfiguredBy.Custom(
    DebugConsoleBehaviour.IsEnabled
    // Your behaviours here);
```

## Include the javascript
Locate the javascript from the package installation 'packages\FeatureSwitcher.DebugConsole.x.x.x.x\scripts\featureswitcher.debugconsole.min.js' and copy it into your application. Then include it in views where you want the debug console.

```c#
@if (HttpContext.Current.IsDebuggingEnabled)
{
    <script id="feature-debug-console-script" type='text/javascript' src='/Script/featureswitcher.debugconsole.min.js'></script>
}
```
Note: Do not change the id attribute
