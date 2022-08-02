import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import useUser from "./components/useUser";

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./utils/shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

export default () => {
  // basename={process.env.REACT_APP_BASENAME || ""}
  const { user } = useUser();

  return (
  <Router> 
    {

    user ?
    <div>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={withTracker(props => {
              return (
                <route.layout {...props}>
                  <route.component {...props} />
                </route.layout>
              );
            })}
          />
        );
      })}
    </div>
    :
    <div>
    {routes.filter(r => ["/project-overview", "/signin", "/signup", "/errors"].includes(r.path)).map((route, index) => {
      return (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={withTracker(props => {
            return (
              <route.layout {...props}>
                <route.component {...props} />
              </route.layout>
            );
          })}
        />
      );
    })}
  </div>
    }
  </Router>
)};
