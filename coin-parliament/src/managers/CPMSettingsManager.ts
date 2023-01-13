import { AdminManager } from "../common/models/AdminManager";
import { CPMSettings } from "../Contexts/AppContext";

class CPMSettingsManager extends AdminManager<CPMSettings> {
  constructor(
    CPMSettings: CPMSettings,
    setCPMSettings: (obj: CPMSettings) => void
  ) {
    super(CPMSettings, setCPMSettings);

    this.decorator = (settings: CPMSettings) => {
      settings = {
        pctReferralActivity: settings.pctReferralActivity || 0,
        signupReferral: settings.signupReferral || 0,
        orderBookWeight: settings.orderBookWeight || 0,
      } as CPMSettings;
      setCPMSettings(settings);
      return settings;
    };
  }
}

export default CPMSettingsManager;
