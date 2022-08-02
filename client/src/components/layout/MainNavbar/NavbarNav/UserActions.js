import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

import useUser from "../../../useUser";

const UserActions = () => {

  const [ visible, setVisible ] = useState(false);
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);

  const toggleUserActions = (e) => {
    console.log(e.target.checked)
    setVisible(!visible);
  }


    useEffect(() => {
    if (userProfile === null){
      fetch(`http://localhost:8000/user/${user}/info`)
      .then(response => response.json())
      .then(data =>{
        setUserProfile(data)
      })
      .then()
    }
  },[userProfile]);


    const removeToken = () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('session_date');
      window.location.reload();
    };

    return (
      <NavItem tag={Dropdown} caret toggle={toggleUserActions} style={{ cursor: 'pointer' }}>
        {
          userProfile &&
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
          className="user-avatar rounded-circle mr-2"
          src={userProfile.image_path}
          alt="User Avatar"
          />{" "}
          <span className="d-none d-md-inline-block">{`${userProfile.first_name} ${userProfile.last_name}`}</span>
        </DropdownToggle>
        }
        <Collapse tag={DropdownMenu} right small open={visible}>
          <DropdownItem tag={Link} to="/user-profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="/my-projects">
            <i className="material-icons">contacts</i> My Projects
          </DropdownItem>
          <DropdownItem tag={Link} to="/transactions">
            <i className="material-icons">&#xE896;</i> Transactions
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem 
          tag={Link} to="/" 
          className="text-danger"
          onClick={removeToken}
          >
            <i className="material-icons text-danger"
            >&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }

  export default UserActions;
