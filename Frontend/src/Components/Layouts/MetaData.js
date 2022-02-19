import React from "react";
import { Helmet } from "react-helmet";

// Used To Render Meta Data ( Different Titles In Different Components )
const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} - Big Bazzar`}</title>
    </Helmet>
  );
};

export default MetaData;
