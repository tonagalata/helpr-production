import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import ProjectOverview from "./views/ProjectOverview";
import SingleProjects from "./views/SingleProjects";
import UserProfile from "./views/UserProfile";
import CreateProject from "./views/CreateProject";
import Errors from "./views/Errors";
// import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import MyProjects from "./views/MyProjects";
import Signin from "./views/Signin/SigninForm"
import SignUp from "./views/Signup/SignupForm"
import ProfileViewer from './views/ProfileViewer'

const getUser = () => {

  const username = sessionStorage.getItem('username');
  const userToken = JSON.parse(username);
  return userToken
};

const user = getUser()

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => !user ? <Redirect to="/signin" /> : <Redirect to="/project-overview" />
  },
  {
    path: "/project-overview/:project",
    layout: DefaultLayout,
    component: SingleProjects
  },
  {
    path: "/project-overview",
    exact: true,
    layout: DefaultLayout,
    component: ProjectOverview
  },
  {
    path: "/user-profile/:username",
    layout: DefaultLayout,
    component: ProfileViewer
  },
  {
    path: "/user-profile",
    exact: true,
    layout: DefaultLayout,
    component: UserProfile
  },
  {
    path: "/create-project",
    exact: true,
    layout: DefaultLayout,
    component: CreateProject
  },
  // {
  //   path: "/components-overview",
  //   layout: DefaultLayout,
  //   component: ComponentsOverview
  // },
  {
    path: "/transactions",
    exact: true,
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/my-projects",
    exact: true,
    layout: DefaultLayout,
    component: MyProjects
  },
  {
    path: "/signin",
    exact: true,
    layout: DefaultLayout,
    component: () => user ? <Redirect to="/project-overview" /> : <Signin />
  },
  {
    path: "/signup",
    exact: true,
    layout: DefaultLayout,
    component: () => user ? <Redirect to="/project-overview" /> : <SignUp/>
  },
  // {
  //   path: "/errors",
  //   exact: true,
  //   layout: DefaultLayout,
  //   component: Errors
  // },
  {
    path: "*",
    exact: true,
    layout: DefaultLayout,
    component: Errors
  },
];
