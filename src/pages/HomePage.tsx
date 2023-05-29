import React from "react";
import YearInformation from "../components/Dashboad/YearInformation";
import GeneralInformation from "../components/Dashboad/GeneralInformation";
import Numberofgoods from "../components/Dashboad/Numberofgoods";
import Address from "../components/Dashboad/GoogleMap";

const HomePage = () => {
  return (
    <div style={{ height: "auto", width: "auto" }}>
      <YearInformation />
      <GeneralInformation />
      <Numberofgoods />
      <Address />
    </div>
  );
};

export default HomePage;
