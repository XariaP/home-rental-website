import React, {useEffect, useContext, useState} from "react";
import "../style.css";
import { UserContext } from "../../../contexts";
import { getDefaultOptions } from "date-fns";
import { useNavigate } from "react-router-dom";

function Inactive({reservation, propertyDetails, userType}) {

    const { token } = useContext(UserContext);
    const navigate = useNavigate();


    function handleProfile() {
        navigate(`/accounts/profile/${reservation.renter}/view/renter`);
        
    }

    function handleComment() {
        navigate(`/comments/property/${reservation.property}/view`);
    }

    function CommentButton(){
        if (reservation.status=="terminated" && userType != "host"){
            return <>
                <button className="btn btn-primary my-2" onClick={handleComment}>Leave Comment</button>
            </>;
        }
    }

    function ProfileButton() {
        if (userType === "host") {
            return <>
                <p>
                <button className="btn btn-primary my-2" onClick={handleProfile}>View Profile</button>
                </p>
            
            </>
        }
    }

    return <>
        <div className="row">
            <div className="col-md">
                {propertyDetails[reservation.id] && propertyDetails[reservation.id].img && (
                    <img 
                    className="resimage" 
                    src={propertyDetails[reservation.id].img} 
                    role="img" 
                    aria-label="Property: Thumbnail" 
                    preserveAspectRatio="xMidYMid slice" 
                    focusable="false" 
                    alt="Picture" 
                    />
                )}
            </div>
            <div className="summaryinfo col-md">
                <h3 className="fw-light padded">Reservation for {propertyDetails[reservation.id] && propertyDetails[reservation.id].name}</h3>
                <div className="icons">
                    <p className="fw-medium padded nonmargin">Status:</p>
                    <div className="icons padded">
        
                        <p className="fw-light nonmargin">{reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}</p>
                    
                    </div>
                </div>
                <div className="icons">
                    <p className="fw-medium padded3">Address:</p>
                    <p className="fw-light padded3">{propertyDetails[reservation.id] && propertyDetails[reservation.id].address}</p>
                </div>
                <div className="icons">
                    <p className="fw-medium padded2">Details:</p>
                    <p className="fw-light padded2">{propertyDetails[reservation.id] && propertyDetails[reservation.id].description}</p>
                </div>

                <div className="icons">
                    <p className="fw-medium padded2">Guests:</p>
                    <p className="fw-light padded2">{reservation.num_guests}</p>
                </div>

                <div className="icons padded2">
    
                    <svg viewBox="0 0 24 24" xmls="http://www.w3.org/2000/svg" focusable="false">
                        <g fill="none" fillRule="evenodd">
                            <path d="M17,5 L19,5 C20.1045695,5 21,5.8954305 21,7 L21,19 C21,20.1045695 20.1045695,21 19,21 L5,21 C3.8954305,21 3,20.1045695 3,19 L3,7 C3,5.8954305 3.8954305,5 5,5 L7,5 L7,4 C7,3.44771525 7.44771525,3 8,3 C8.55228475,3 9,3.44771525 9,4 L9,5 L15,5 L15,4 C15,3.44771525 15.4477153,3 16,3 C16.5522847,3 17,3.44771525 17,4 L17,5 Z M19,9 L19,7 L5,7 L5,9 L19,9 Z M19,11 L5,11 L5,19 L19,19 L19,11 Z" fill="#2D333F"></path>
                        </g>
                    </svg>
                    <p className="fw-medium">Dates booked:</p>
                    <p className="fw-light padded2">{reservation.date_booked_start} - {reservation.date_booked_end}</p>
                </div>
                <CommentButton/>
                
                <ProfileButton/>
            </div>
        </div>
    </>
}

export default Inactive;