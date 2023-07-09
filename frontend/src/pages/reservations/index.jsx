import React, {useEffect, useContext, useState} from "react";
import "./style.css";
import { PageContext, UserContext } from "../../contexts";
import Approved from "./approved";
import Completed from "./completed";
import Pending from "./pending";
import Inactive from "./inactive";
import PendingCancel from "./pendingCancel";


function Reservations(props) {

    const [reservations, setReservations] = useState([]);
    const { token } = useContext(UserContext);
    const [propertyDetails, setPropertyDetails] = useState({});
    const { setPage } = useContext(PageContext);
    const [nextPage, setNextPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function get_reservations() {
        setIsLoading(true);
        fetch('http://localhost:8000/reservations/?user_type=guest',
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
          //console.log(data);
          setNextPage(data.next);
          setReservations(data.results);
          data.results.forEach(reservation => {
            if (!propertyDetails[reservation.property]) {
                getPropertyDetails(reservation.property).then(property => {
                  setPropertyDetails(prevState => ({
                    ...prevState,
                    [reservation.id]: property
                  }));
                });
                //console.log(propertyDetails);
            }
          });
          setIsLoading(false);
        })
    }
    useEffect(() => {
        get_reservations();
        setPage("reservations");
      }, [])

      const handleLoadMore = async () => {
        if (!nextPage || isLoading) {
          return;
        }
        setIsLoading(true);
        fetch(nextPage,
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
          //console.log(data);
          setNextPage(data.next);
          setReservations((prevReservations) => [
            ...prevReservations,
            ...data.results,
          ]);
          data.results.forEach(reservation => {
            if (!propertyDetails[reservation.property]) {
                getPropertyDetails(reservation.property).then(property => {
                  setPropertyDetails(prevState => ({
                    ...prevState,
                    [reservation.id]: property
                  }));
                });
                //console.log(propertyDetails);
            }
          });
          setIsLoading(false);
        })
    }

    function handleFilterSubmit(event) {
        event.preventDefault();
        // const userType = event.target.elements.usertype.value;
        var status = event.target.value;
        let url = `http://localhost:8000/reservations/`;
        if (status){
            url += `?user_type=guest&status=${status}`;
        }
        else {
            url += `?user_type=guest`;
        }
        
        fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => setReservations(data.results));
    }

    async function fetchPropertyDetails(propertyId) {
        const response = await fetch(`http://localhost:8000/properties/${propertyId}/details/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const property = await response.json();
        return property;
    }
    async function getPropertyDetails(propertyId) {
        try {
          const property = await fetchPropertyDetails(propertyId);
          //console.log(property);
          return property;
        } catch (error) {
          console.error('Error getting property details:', error);
          return null;
        }
    }
    
    function AssignStatus({reservation, propertyDetails}) {
        if (reservation.status === "approved") {
            return <>
                <Approved reservation={reservation} propertyDetails={propertyDetails} userType="guest"/>
            </>
        }
        else if (reservation.status === "completed") {
            return <>
                <Completed reservation={reservation} propertyDetails={propertyDetails} userType="guest"/>
            </>
        
        }
        else if (reservation.status === "pending") {
            return <>
                <Pending reservation={reservation} propertyDetails={propertyDetails} userType="guest"/>
            </>
        
        }
        else if (reservation.status === "pending cancel") {
            return <>
                <PendingCancel reservation={reservation} propertyDetails={propertyDetails} userType="guest"/>
            </>
        
        }
        else {
            return <>
                <Inactive reservation={reservation} propertyDetails={propertyDetails} userType="guest"/>
            </>
        }

    }

    return <>
        <main className="res content">
            <div className="rescard">
                
                <div className="tab-content reservation-tabs" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-all" role="tabpanel" aria-labelledby="nav-all-tab">
                        <h1 className="fw-light">Reservations</h1>

                        <header>

                            <nav className="requests-nav">
                                <div className="nav nav-pills" id="nav-tab" role="tablist">
                                    <button onClick={handleFilterSubmit} className="nav-link active" id="nav-all-tab" data-bs-toggle="tab" value="" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-appproved-tab" data-bs-toggle="tab" value="approved" type="button" role="tab" aria-controls="nav-present" aria-selected="true">Approved</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-pending-tab" data-bs-toggle="tab" value="pending" type="button" role="tab" aria-controls="nav-pending" aria-selected="false">Pending</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-completed-tab" data-bs-toggle="tab" value="completed" type="button" role="tab" aria-controls="nav-past" aria-selected="false">Completed</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-cancel-tab" data-bs-toggle="tab" value="canceled" type="button" role="tab" aria-controls="nav-cancel" aria-selected="false">Canceled</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-denied-tab" data-bs-toggle="tab" value="denied" type="button" role="tab" aria-controls="nav-deny" aria-selected="false">Denied</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-expired-tab" data-bs-toggle="tab" value="expired" type="button" role="tab" aria-controls="nav-expire" aria-selected="false">Expired</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-expired-tab" data-bs-toggle="tab" value="terminated" type="button" role="tab" aria-controls="nav-terminate" aria-selected="false">Terminated</button>
                                    {/* <button onClick={handleFilterSubmit} className="nav-link" id="nav-expired-tab" data-bs-toggle="tab" value="pending cancel" type="button" role="tab" aria-controls="nav-terminate" aria-selected="false">Terminated</button> */}
                                </div>
                            </nav>
                        </header>
                        {Array.isArray(reservations) && reservations.map(reservation => (
                        <div key={reservation.id} className="card shadow-sm undoflex padded1">
                            <AssignStatus reservation={reservation} propertyDetails={propertyDetails}/>
                        </div>
                        ))}
                    </div>
                    
                </div>
            </div>
        </main>
        <footer>
            {isLoading && <p>Loading...</p>}
            {nextPage && (
                <button type="button" className="btn btn-secondary" onClick={handleLoadMore} disabled={isLoading}>
                Load More
                </button>
            )}
        </footer>
    </>
}

export default Reservations;




{/* <div className="row">
    <div className="col-md">
        {propertyDetails[reservation.id]?.img_urls?.length > 0 && (
            <img 
            className="resimage" 
            src={propertyDetails[reservation.id].img_urls[0]} 
            role="img" 
            aria-label="Property: Thumbnail" 
            preserveAspectRatio="xMidYMid slice" 
            focusable="false" 
            alt="Picture" 
            />
        )}
    </div>
    <div className="summaryinfo col-md">
        <h3 className="fw-light padded">{propertyDetails[reservation.id] && propertyDetails[reservation.id].name}</h3>
        <div className="icons">
            <p className="fw-medium padded nonmargin">Status:</p>
            <div className="icons padded">

                <p className="fw-light nonmargin">{reservation.status}</p>
                <svg viewBox="0 0 24 24" xmls="http://www.w3.org/2000/svg" focusable="false">
                    <g fill="none" fillRule="evenodd">
                        <path d="M11.0355339,12.863961 L9.62132034,11.4497475 C9.23079605,11.0592232 8.59763107,11.0592232 8.20710678,11.4497475 C7.81658249,11.8402718 7.81658249,12.4734367 8.20710678,12.863961 L10.3284271,14.9852814 C10.5236893,15.1805435 10.7796116,15.2781746 11.0355339,15.2781746 C11.2914562,15.2781746 11.5473785,15.1805435 11.7426407,14.9852814 L15.9852814,10.7426407 C16.3758057,10.3521164 16.3758057,9.71895142 15.9852814,9.32842712 C15.5947571,8.93790283 14.9615921,8.93790283 14.5710678,9.32842712 L11.0355339,12.863961 Z M12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 Z" fill="#2D333F"></path>
                    </g>
                </svg>
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
        <p>
        <a href="reservations-cancel1.html" className="btn btn-danger my-2">Request Cancellation</a>
        </p>
    </div>
</div> */}