import React, {useEffect, useContext, useState} from "react";
import "../style.css";
import { UserContext } from "../../../contexts";
import { getDefaultOptions } from "date-fns";
import { useNavigate } from "react-router-dom";

function PendingCancel({reservation, propertyDetails, userType}) {

    const { token } = useContext(UserContext);
    const navigate = useNavigate();


    function handleApprove() {
        // console.log(reservation.status);
        const confirmResult = window.confirm("Are you sure you want to continue?\nThis will cancel the reservation.");
        if (confirmResult) {
            fetch(`http://localhost:8000/reservations/${reservation.id}/approve_cancel/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
            
            window.location.reload(false);
            navigate()
        } else {return;}
    }
    function handleProfile() {
        navigate(`/accounts/profile/${reservation.renter}/view/renter`);
        
    }

    function handleDeny() {
        const confirmResult = window.confirm("Are you sure you want to continue?\nThis will deny the cancel request.");
        if (confirmResult) {
            fetch(`http://localhost:8000/reservations/${reservation.id}/deny_cancel/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
            window.location.reload(false);
        } else {return;}
    }

    function ButtonManagement() {
        if (userType === "host") {
            return <>
            <div>
                <button className="btn btn-primary my-2" onClick={handleProfile}>View Profile</button>
                <button className="btn btn-success my-2" onClick={handleApprove}>Approve Cancel Request</button>
                <button className="btn btn-danger my-2" onClick={handleDeny}>Deny Cancel Request</button>
            </div>
            </>
        }
        else {
            return <>
                {/* <div>
                    <button className="btn btn-danger my-2" onClick={handleCancel}>Cancel</button>
                </div> */}
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
                <h3 className="fw-light padded">Request to cancel {propertyDetails[reservation.id] && propertyDetails[reservation.id].name}</h3>
                <div className="icons">
                    <p className="fw-medium padded nonmargin">Status:</p>
                    <div className="icons padded">
        
                        <p className="fw-light nonmargin">Pending Cancel</p>
                        <div className="slightpad">
                          <svg className="no" viewBox="0 0 502 511.82" clipRule="evenodd" fillRule="evenodd" textRendering="geometricPrecision" imageRendering="optimizeQuality" xmls="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" focusable="false">
                            <g fillRule="nonzero">
                              <path d="M279.75 471.21c14.34-1.9 25.67 12.12 20.81 25.75-2.54 6.91-8.44 11.76-15.76 12.73a260.727 260.727 0 0 1-50.81 1.54c-62.52-4.21-118.77-31.3-160.44-72.97C28.11 392.82 0 330.04 0 260.71 0 191.37 28.11 128.6 73.55 83.16S181.76 9.61 251.1 9.61c24.04 0 47.47 3.46 69.8 9.91a249.124 249.124 0 0 1 52.61 21.97l-4.95-12.96c-4.13-10.86 1.32-23.01 12.17-27.15 10.86-4.13 23.01 1.32 27.15 12.18L428.8 68.3a21.39 21.39 0 0 1 1.36 6.5c1.64 10.2-4.47 20.31-14.63 23.39l-56.03 17.14c-11.09 3.36-22.8-2.9-26.16-13.98-3.36-11.08 2.9-22.8 13.98-26.16l4.61-1.41a210.71 210.71 0 0 0-41.8-17.12c-18.57-5.36-38.37-8.24-59.03-8.24-58.62 0-111.7 23.76-150.11 62.18-38.42 38.41-62.18 91.48-62.18 150.11 0 58.62 23.76 111.69 62.18 150.11 34.81 34.81 81.66 57.59 133.77 61.55 14.9 1.13 30.23.76 44.99-1.16zm-67.09-312.63c0-10.71 8.69-19.4 19.41-19.4 10.71 0 19.4 8.69 19.4 19.4V276.7l80.85 35.54c9.8 4.31 14.24 15.75 9.93 25.55-4.31 9.79-15.75 14.24-25.55 9.93l-91.46-40.2c-7.35-2.77-12.58-9.86-12.58-18.17V158.58zm134.7 291.89c-15.62 7.99-13.54 30.9 3.29 35.93 4.87 1.38 9.72.96 14.26-1.31 12.52-6.29 24.54-13.7 35.81-22.02 5.5-4.1 8.36-10.56 7.77-17.39-1.5-15.09-18.68-22.74-30.89-13.78a208.144 208.144 0 0 1-30.24 18.57zm79.16-69.55c-8.84 13.18 1.09 30.9 16.97 30.2 6.21-.33 11.77-3.37 15.25-8.57 7.86-11.66 14.65-23.87 20.47-36.67 5.61-12.64-3.13-26.8-16.96-27.39-7.93-.26-15.11 4.17-18.41 11.4-4.93 10.85-10.66 21.15-17.32 31.03zm35.66-99.52c-.7 7.62 3 14.76 9.59 18.63 12.36 7.02 27.6-.84 29.05-14.97 1.33-14.02 1.54-27.9.58-41.95-.48-6.75-4.38-12.7-10.38-15.85-13.46-6.98-29.41 3.46-28.34 18.57.82 11.92.63 23.67-.5 35.57zM446.1 177.02c4.35 10.03 16.02 14.54 25.95 9.96 9.57-4.4 13.86-15.61 9.71-25.29-5.5-12.89-12.12-25.28-19.69-37.08-9.51-14.62-31.89-10.36-35.35 6.75-.95 5.03-.05 9.94 2.72 14.27 6.42 10.02 12 20.44 16.66 31.39z" fill="#2D333F"></path>
    
                            </g>
                          </svg>
                        </div>
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
                <ButtonManagement />
            </div>
        </div>
    </>
}

export default PendingCancel;