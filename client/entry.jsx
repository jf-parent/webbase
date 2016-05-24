"use strict";

import React from "react"
import { render } from "react-dom"
import { Router, browserHistory } from "react-router"
import Auth from "Auth"

window.iapp = {};
window.iapp.Auth = new Auth();

require("ladda/dist/ladda-themeless.min.css");
require("bootstrap-webpack!./bootstrap.config.js");
require("font-awesome-webpack");
require("jquery");

const rootRoute = {
  component: "div",
  childRoutes: [ {
    path: "/",
    component: require("./components/App"),
    childRoutes: [
      require("./routes/Login"),
      require("./routes/Profile"),
      require("./routes/Settings"),
      require("./routes/Register"),
      require("./routes/Logout"),
      require("./routes/ErrorPage")
    ]
  } ]
}
render(
  <Router history={browserHistory} routes={rootRoute} />,
  document.getElementById("root")
)
