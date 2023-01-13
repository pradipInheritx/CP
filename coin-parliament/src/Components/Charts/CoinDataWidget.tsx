import React, { useContext, useEffect, useRef } from "react";
import { polygonAdapterClient } from "../../common/models/Socket";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import AppContext from "../../Contexts/AppContext";
import { getFullLocale, getLang } from "../../common/consts/languages";

const CoinDataWidget = () => {
  const chartRef = useRef(null);
  let params = useParams();
  const { lang } = useContext(AppContext);
  const locale = getLang(lang);

  useEffect(() => {
    const width = (chartRef.current as HTMLElement | null)?.offsetWidth;
    //@ts-ignore
    new TradingView.widget({
      width,
      height: 400,
      symbol: `${params?.id}USD`,
      timezone: moment.tz.guess(),
      theme: "light",
      style: "2",
      locale: getFullLocale(locale.locale),
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_legend: true,
      withdateranges: true,
      range: "1D",
      hide_side_toolbar: true,
      save_image: true,
      show_popup_button: false,
      popup_width: "1000",
      popup_height: "650",
      container_id: "tradingview_8df8e",
      datafeed: polygonAdapterClient,
    });
  }, [params?.id, lang, locale.locale]);
  return (
    <div className="tradingview-widget-container" ref={chartRef}>
      <div id="tradingview_8df8e" />
    </div>
  );
};

export default CoinDataWidget;
