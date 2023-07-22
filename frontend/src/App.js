import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, {useEffect, useState} from "react";
import Home from './pages/home';
import NavBar from './pages/navbar';
import ViewProfile from './pages/account/profile/view/other';
import Login from './pages/account/login';
import Signup from './pages/account/signup';
import Logout from './pages/account/logout';
import { PageContext, UserContext, useSearchContext, SearchContext } from './contexts';
import EditProfile from './pages/account/profile/edit';
import ViewMyProfile from './pages/account/profile/view/mine';
import PropertyComment from './pages/comments/property';
import UserComment from './pages/comments/user';
import Reservations from './pages/reservations';
import Property from './pages/property/details';
import MyProperty from './pages/property/myproperty';
import EditProperty from './pages/property/update';
import Request from './pages/requests';
import Book from './pages/property/book';
import BookingPopup from './pages/property/bookingPop';

function App() {
  const [token, setToken] = useState(localStorage.getItem("tokenStore"));
  const [page, setPage] = useState("search");

  useEffect(() => {
    localStorage.setItem("tokenStore", token);
    console.log(token);
  }, [token]);


  return (
    <PageContext.Provider value={{page, setPage}}>
    <UserContext.Provider value={{token, setToken}}>
    <SearchContext.Provider value={useSearchContext()}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />

          
            <Route path="home" element={<Home />} />
          
          <Route path="reserve/property/" >
            <Route path=":propertyID" element={<Book />}/>
            <Route path=":propertyID/popup" element={<BookingPopup />}/>
          </Route>

          <Route path="reservations/" element={<Reservations />}>
            <Route path="create" />
            <Route path=":reservationID/cancel" />
          </Route>
          
          <Route path="requests/" element={<Request />}>
            <Route path=":reservationID/approve" />
            <Route path=":reservationID/deny" />
            <Route path=":reservationID/approve_cancel" />
            <Route path=":reservationID/deny_cancel" />
            <Route path=":reservationID/terminate" />
          </Route> 

          <Route path="notifications/">
            <Route path=":pk/read" />
          </Route>
          
          <Route path="accounts/">
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="myprofile/view" element={<ViewMyProfile />} />
            <Route path="myprofile/edit"  element={<EditProfile />} />
            <Route path="profile/:userID/view/:userType" element={<ViewProfile />} />
          </Route>

          <Route path="comments/">
          <Route path="user/:userID/view" element={<UserComment />} />
          <Route path="user/:userID/view/page/:pageNum" element={<UserComment />} />
            <Route path="property/:propertyID/view" element={<PropertyComment />} />
            <Route path="property/:propertyID/view/page/:pageNum" element={<PropertyComment />} />
          </Route>
          
          <Route path="properties/">
            <Route path="add" element={<EditProperty />}/>
            <Route path=":propertyID/update" element={<EditProperty />}/>
            <Route path=":propertyID/details" element={<Property />}/>
            <Route path="manage" element={<MyProperty />}/>
            <Route path="search" element={<Home />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
    </SearchContext.Provider>
    </UserContext.Provider>
    </PageContext.Provider>
  );
}

export default App;
