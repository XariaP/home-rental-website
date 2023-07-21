import React, {useEffect, useContext, useState} from "react";
import "../reservations/style.css";
import { PageContext, UserContext } from "../../contexts";
import Approved from "../reservations/approved";
import Completed from "../reservations/completed";
import Pending from "../reservations/pending";
import Inactive from "../reservations/inactive";
import PendingCancel from "../reservations/pendingCancel";

function Request(props) {

    const [reservations, setReservations] = useState([]);
    const { token } = useContext(UserContext);
    const [propertyDetails, setPropertyDetails] = useState({});
    const { setPage } = useContext(PageContext);
    const [nextPage, setNextPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function get_reservations() {

        setIsLoading(true);
        fetch('http://localhost:8000/reservations/?user_type=host',
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
            }
           });
           setIsLoading(false);
    
        })
    }
    useEffect(() => {
        get_reservations();
        setPage("requests");
      }, [])

      function handleFilterSubmit(event) {
        event.preventDefault();
        const status = event.target.value;
        let url = `http://localhost:8000/reservations/`;
        if (status){
            url += `?user_type=host&status=${status}`;
        }
        else {
            url += `?user_type=host`;
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
            }
          });
          setIsLoading(false);
        })
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
          return property;
        } catch (error) {
          console.error('Error getting property details:', error);
          return null;
        }
    }
    
    function AssignStatus({reservation, propertyDetails}) {
        if (reservation.status === "approved") {
            return <>
                <Approved reservation={reservation} propertyDetails={propertyDetails} userType="host"/>
            </>
        }
        else if (reservation.status === "completed") {
            return <>
                <Completed reservation={reservation} propertyDetails={propertyDetails} userType="host"/>
            </>
        
        }
        else if (reservation.status === "pending") {
            return <>
                <Pending reservation={reservation} propertyDetails={propertyDetails} userType="host"/>
            </>
        
        }
        else if (reservation.status === "pending cancel") {
            return <>
                <PendingCancel reservation={reservation} propertyDetails={propertyDetails} userType="host"/>
            </>
        
        }
        else {
            return <>
                <Inactive reservation={reservation} propertyDetails={propertyDetails} userType="host"/>
            </>
        }

    }

    return <>
        <main className="res content">
            <div className="rescard">
                
                <div className="tab-content reservation-tabs" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-all" role="tabpanel" aria-labelledby="nav-all-tab">
                        <h1 className="fw-light">Requests</h1>

                        <header>

                            <nav className="requests-nav">
                                <div className="nav nav-pills" id="nav-tab" role="tablist">
                                    <button onClick={handleFilterSubmit} className="nav-link active" id="nav-all-tab" data-bs-toggle="tab" value="" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-appproved-tab" data-bs-toggle="tab" value="approved" type="button" role="tab" aria-controls="nav-present" aria-selected="false">Approved</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-pending-tab" data-bs-toggle="tab" value="pending" type="button" role="tab" aria-controls="nav-pending" aria-selected="false">Pending</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-completed-tab" data-bs-toggle="tab" value="completed" type="button" role="tab" aria-controls="nav-past" aria-selected="false">Completed</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-cancel-tab" data-bs-toggle="tab" value="canceled" type="button" role="tab" aria-controls="nav-cancel" aria-selected="false">Canceled</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-denied-tab" data-bs-toggle="tab" value="denied" type="button" role="tab" aria-controls="nav-deny" aria-selected="false">Denied</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-expired-tab" data-bs-toggle="tab" value="expired" type="button" role="tab" aria-controls="nav-expire" aria-selected="false">Expired</button>
                                    <button onClick={handleFilterSubmit} className="nav-link" id="nav-expired-tab" data-bs-toggle="tab" value="terminated" type="button" role="tab" aria-controls="nav-terminate" aria-selected="false">Terminated</button>
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

export default Request;


