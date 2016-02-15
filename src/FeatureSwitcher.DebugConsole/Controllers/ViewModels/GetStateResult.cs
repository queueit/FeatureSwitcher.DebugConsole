namespace FeatureSwitcher.DebugConsole.Controllers.ViewModels
{
    public class GetStateResult
    {
        public FeatureState[] States { get; set; }
        public bool Enabled { get; set; }
    }
}