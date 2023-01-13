import { AdminManager } from "../common/models/AdminManager";
import { TimeFrame } from "../common/models/Vote";

class TimeframesManager extends AdminManager<TimeFrame[]> {
  constructor(
    timeframes: TimeFrame[],
    setTimeframes: (obj: TimeFrame[]) => void
  ) {
    super(timeframes, setTimeframes);

    this.decorator = (t) => {
      if (!t.length) {
        t = [
          {
            index: 0,
            name: "",
            seconds: 0,
          },
        ];
      }

      t = t.sort((a, b) => a.index - b.index);

      return t;
    };
  }
}

export default TimeframesManager;
