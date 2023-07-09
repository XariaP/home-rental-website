import React, {useContext, useEffect, useState} from "react";
import "./style.css";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"

import { Outlet } from "react-router-dom";
import icons from '../../components/icons';
import Notifications from "../notifications";
import { getNotificationCount } from '../notifications/utils';
import NavBarButton from "./button";
import NavBarPopUp from "./popup";
import NavBarDropDown from "./dropdown";
import SiteLogo from "./sitelogo";
import { PageContext, UserContext } from "../../contexts";

function NavBar(props) {
  // const [page, setPage] = useState("search");
  const { page, setPage } = useContext(PageContext);
  const { token } = useContext(UserContext);
  // const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState();
  
  const getIcon = (dest, iconName) => {
    var name = iconName;

    if (isSelected(dest)){
      name = name + "Selected";
    }

    return icons[name];
  }

  const isSelected = (dest) => {
    return dest === page;
  }

  const changePage = (dest) => {
    setPage(dest);
    // console.log(page);
  }

  function isLoggedIn(){
    if (token){
      return "Profile";
    }
    return "Guest";
  }
  
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
      console.log(data, data.count);
      // setNotifCount(data.count);
    })
  }

  // useEffect(() => {
  //   if (notifications != "" && notifications != null) {
  //     setNotifCount(notifications.length);
  //   }
  // }, [notifications]);
  
  useEffect(() => {
    get_notifications();
  }, []);


  const actions = () => {
    if(token){
      return <>
        <NavBarButton link="/home" icon={getIcon("search", "search")} name="Find Rental" selected={isSelected("search")} onClick={() => changePage("search")} />
        <NavBarButton link="/properties/manage" icon={getIcon("rentals", "houses")} name="My Properties" selected={isSelected("rentals")} onClick={() => changePage("rentals")} />

        {/* <NavBarButton link="/reservations" icon={getIcon("reservations", "calendar")} name="Reservations" selected={isSelected("reservations")} onClick={() => changePage("reservations")} /> */}
        
        <NavBarButton link="/reservations" icon={getIcon("reservations", "calendar")} name="Reservations" selected={isSelected("reservations")} onClick={() => changePage("reservations")} />
        <NavBarButton link="/requests" icon={getIcon("requests", "booking")} name="Requests" selected={isSelected("requests")} onClick={() => changePage("requests")} />

        <NavBarPopUp icon={icons["mail"]} name="Notifications" num_notices={notifCount} selected={false} />

        <NavBarDropDown icon={getIcon("profile", "person")} name={isLoggedIn()} selected={isSelected("profile")} onClick={() => changePage("profile")} />
      </>;
    }
    else{
      return <>
        <NavBarButton link="/home" icon={getIcon("search", "search")} name="Find Rental" selected={isSelected("search")} onClick={() => changePage("search")} />
        
        <NavBarDropDown icon={getIcon("profile", "person")} name={isLoggedIn()} selected={isSelected("profile")} onClick={() => changePage("profile")} />
      </>;
    }
  }

  const getNotificationList = () => {
    if (token)
      return <Notifications />
    return <></>;
  }

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


// function NavBar(props) {
//     return <>    
//     <header className="bar sticky-top">
//         <div className="px-3 py-2">
//           <div className="container">
//             <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
//               <a href="home" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
//                 <img src={icons["logo"]} width="100px" />
//                 <p className="logo"> Restify </p>
//               </a>

//               <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
//                 <li>
//                   <a href="home" className="nav-link selected">
//                     <img className="bi d-block mx-auto mb-1" src={icons["searchSelected"]} />
//                     Find Rental
//                   </a>
//                 </li>

//                 <li>
//                   <a href="reservations" className="nav-link">
//                     <img className="bi d-block mx-auto mb-1" src={icons["booking"]} />
//                     Reservations
//                   </a>
//                 </li>

//                 <li>
//                   <a href="#" className="nav-link btn position-relative" type="button" data-bs-toggle="modal" data-bs-target="#notiModal">
//                     <img className="bi d-block mx-auto mb-1" src={icons["mail"]} />
//                     Notifications
//                     <span className="position-absolute corner-badge translate-middle badge rounded-pill bg-danger">
//                       2
//                     </span>
//                   </a>
//                 </li>

//                 <li className="nav-item dropdown">
//                   <a type="button" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
//                     <img className="bi d-block mx-auto mb-1" src={icons["person"]} />
//                     Renter Profile
//                   </a>
//                   <ul className="dropdown-menu dropdown-menu-dark">
//                     <li><a className="dropdown-item" href="myprofile.html">Visit Profile</a></li>
//                     <li><a className="dropdown-item" href="index-host.html">Switch to Host</a></li>
//                     <li><a className="dropdown-item" href="edit-profile.html">Settings</a></li>
//                     <li><a className="dropdown-item" href="index-nouser.html">Log Out</a></li>
//                   </ul>
//                 </li>

//               </ul>
//             </div>
//           </div>
//         </div>
//     </header>

//     <Notifications />
    
//     <Outlet />
    
//     <footer id="footer" className="bar"> &copy; 2023 </footer>
//     </>;
// }

// export default NavBar;