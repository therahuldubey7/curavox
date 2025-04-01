import React from "react";
import "./loader.css";

const Loader = (props) => {
  return (
      <div className="bouncing-loader">
        <div style={{marginTop: '30px'}}></div>
        <div style={{marginTop: '30px'}}></div>
        <div style={{marginTop: '30px'}}></div>
      </div>
  );
};

export default Loader;