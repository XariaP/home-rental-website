import React, {useContext, useEffect, useState} from "react";
import "./style.css";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"

import { Outlet } from "react-router-dom";
import icons from '../../components/icons';
import Notifications from "../notifications";
import NavBarButton from "./button";
import NavBarPopUp from "./popup";
import NavBarDropDown from "./dropdown";
import SiteLogo from "./sitelogo";
import { PageContext, UserContext } from "../../contexts";

function NavBar(props) {
  const { token } = useContext(UserContext);          // Token for current logged-in user session
  const { page, setPage } = useContext(PageContext);  // Current webpage being displayed
  const [notifCount, setNotifCount] = useState();     // Number of unread notifications
  
  // Return icon for navigation buttons
  const getIcon = (dest, iconName) => {
    var name = iconName;
    
    // Highlight current button selected
    if (isSelected(dest)){
      name = name + "Selected";
    }

    return icons[name];
  }

  // Mark a button as selected if it redirects to the current page
  const isSelected = (dest) => {
    return dest === page;
  }

  // Change the url being viewed
  const changePage = (dest) => {
    setPage(dest);
  }

  // Check if user is logged in and authenticated
  function isLoggedIn(){
    if (token){
      return "Profile";
    }
    return "Guest";
  }
  
  // Retrieve notifications for user
  async function get_notifications() {
    fetch('http://localhost:8000/notifications/',
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : `Bearer ${token}`,
        },
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.count >= 1) { setNotifCount(data.count); }
    })
  }
  
  // Get notifications once page loads
  useEffect(() => {
    get_notifications();
  }, []);

  // Display buttons on navigation bar
  const actions = () => {
    if(token){  // User logged in
      return <>
        <NavBarButton link="/home" icon={getIcon("search", "search")} name="Find Rental" selected={isSelected("search")} onClick={() => changePage("search")} />
        <NavBarButton link="/properties/manage" icon={getIcon("rentals", "houses")} name="My Properties" selected={isSelected("rentals")} onClick={() => changePage("rentals")} />
        
        <NavBarButton link="/reservations" icon={getIcon("reservations", "calendar")} name="Reservations" selected={isSelected("reservations")} onClick={() => changePage("reservations")} />
        <NavBarButton link="/requests" icon={getIcon("requests", "booking")} name="Requests" selected={isSelected("requests")} onClick={() => changePage("requests")} />

        <NavBarPopUp icon={icons["mail"]} name="Notifications" num_notices={notifCount} selected={false} />

        <NavBarDropDown icon={getIcon("profile", "person")} name={isLoggedIn()} selected={isSelected("profile")} onClick={() => changePage("profile")} />
      </>;
    }
    else{   // User not logged in
      return <>
        <NavBarButton link="/home" icon={getIcon("search", "search")} name="Find Rental" selected={isSelected("search")} onClick={() => changePage("search")} />
        
        <NavBarDropDown icon={getIcon("profile", "person")} name={isLoggedIn()} selected={isSelected("profile")} onClick={() => changePage("profile")} />
      </>;
    }
  }

  // Return list of notifications for popup
  const getNotificationList = () => {
    if (token)
      return <Notifications />
    return <></>;
  }

  // Display navigation bar layout and components
  return <div id="page-container"> 
    <div id="content-wrap">
      <header className="bar sticky-top">
          <div className="px-3 py-2">
            <div className="container">
              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                
                <SiteLogo homeLink={"/home"} icon={icons["logo"]} sitename={"Restify"} onClick={() => changePage("search")} />

                <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                  {actions()}
                </ul>

              </div>
            </div>
          </div>
      </header>

      {getNotificationList()}
      
      <Outlet />
    </div>
    
    <footer id="footer" className="bar"> &copy; 2023 </footer>
  </div>;
}

export default NavBar;