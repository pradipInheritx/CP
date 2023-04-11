import React, {useContext, useEffect, useState} from "react";
import ContentContext from "../Contexts/ContentContext";
import {Navigate, useLocation} from "react-router-dom";
import GeneralPage from "../GeneralPage";

const Content = () => {
  const {pages} = useContext(ContentContext);
  const [mounted, setMounted] = useState(false);
  let location = useLocation();
  const pathname = location.pathname.replace("/", "");
  const page = pages?.find((p) => p.slug === pathname && p.title !== "x");

  useEffect(() => {
    if (pages) {
      setMounted(true);
    }
  }, [pages]);
  if (mounted) {
    return page ? (
      <GeneralPage>
        {page.content.split("\n\n").map((c ,i) => (
          <p className="mb-2" key={i}>{c}</p>
        ))}
      </GeneralPage>
    ) : (
      <Navigate
        to="/"
        state={{
          from: location,
        }}
      />
    );
  } else {
    return (
      <div
        className="d-flex justify-content-center align-items-stretch"
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        />
      </div>
    );
  }
};

export default Content;
