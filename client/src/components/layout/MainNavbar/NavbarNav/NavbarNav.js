import React from "react";
import { Nav, NavLink, DropdownItem } from "shards-react";
import { Link } from "react-router-dom";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import useUser from "../../../useUser";

export default () => {

  const { user } = useUser();

  return(
  <>
  {  
  user ? 
    <Nav navbar className="border-left flex-row">
      <Notifications />
      <UserActions />
    </Nav>
    :
    <Nav navbar className="border-left flex-row">
          <DropdownItem tag={Link} to="project-overview">
            <NavLink tag={Link} to="/project-overview">
                <i className="material-icons">task</i> Project Overview
            </NavLink>
          </DropdownItem>
          <DropdownItem tag={Link} to="signin">
            <NavLink tag={Link} to="/signin">
                <i className="material-icons">&#xE7FD;</i> Login
            </NavLink>
          </DropdownItem>
          <DropdownItem tag={Link} to="sign-up">
            <NavLink tag={Link} to="/signup">
                <i className="material-icons">face</i> Sign Up
            </NavLink>
          </DropdownItem>
    </Nav>
  }
  </>
)};
