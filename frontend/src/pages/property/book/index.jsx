import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts";
import { useParams } from "react-router-dom";
import BackButton from "../../../components/backbutton";
import "./styles.css"

export default function Book(props) {
    const { token } = useContext(UserContext);
    const { propertyID } = useParams();
    const [children, setChild] = useState();
    const [adults, setAdults] = useState();
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");


    function handlePopup(event) { 
        event.preventDefault();
        // const guests = event.target.name.children + event.target.name.adults;
        // const checkIn = event.target.name.checkIn;
        // const checkOut = event.target.name.checkOut;
        var guests = null;
        if (adults && children)
            guests = parseInt(adults) + parseInt(children);
        else if (adults)
            guests = adults;
        else if (children)
            guests = children;
        // const checkIn = event.target.value.checkIn;
        // const checkOut = event.target.value.checkOut;
        
        // console.log(JSON.stringify({
        //     property_id: parseInt(propertyID),
        //     num_guests: parseInt(guests),
        //     start_date: checkIn,
        //     end_date: checkOut
        // }));
        
        console.log(propertyID);
        console.log(guests);
        fetch('http://localhost:8000/reservations/create/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : `Bearer ${token}`,
            },
            body: JSON.stringify({
                property_id: parseInt(propertyID),
                num_guests: parseInt(guests),
                start_date: checkIn,
                end_date: checkOut
            })
        })
        .then((response) => {
            console.log("here");
            return response.json();
        }).then((data) => {
            document.getElementById('booking-errors').innerHTML = "";
            console.log(data);
            if (data.error)
                document.getElementById('booking-errors').innerHTML = data.error;
            if (data.message)
                document.getElementById('booking-errors').innerHTML = data.message;
          }).catch((error) => {
            console.error('Error:', error);
          });


        // window.open(`reserve/property/${propertyID}/popup`, "a", "width=600, height=800, left=0, top=0"); 
    }
    return <>
        <BackButton />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossOrigin="anonymous"></script>
        <main className="content ">      
        <div className="container">
            <div className="card p-4 mt-5">
                <form className="row g-3">
                    <div className="col-12 mb-2">
                        <h4>Room Reservation</h4>
                        <span className="text-muted">Please select the date to start enjoying all the features of our premium room rental service.</span>
                    </div>
                    <div className="col-12">
                        <span className="error" id="booking-errors"></span>
                        {/* <span className="text-muted">Please click <a href={`/properties/${propertyID}/details`}>here</a> to return to the previous property details page.</span> */}
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-floating">
                            <input name="checkIn" onChange={(e) => setCheckIn(e.target.value)} type="date" className="form-control" placeholder="DEPARTING"/>
                            <label>CHECK-IN</label>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-floating">
                            <input name="checkOut" onChange={(e) => setCheckOut(e.target.value)} type="date" className="form-control" placeholder="RETURNING"/>
                            <label>CHECK-OUT</label>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-floating">
                            <input onChange={(e) => setAdults(e.target.value)} name="adults" type="number" className="form-control" placeholder="0" min="0"/>
                            <label>ADULTS(18+)</label>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="form-floating">
                            <input onChange={(e) => setChild(e.target.value)} type="number" className="form-control" placeholder="0" min="0"/>
                            <label>CHILDREN(0-17)</label>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <button className="btn btn-primary text-uppercase" type="submit" onClick={handlePopup}>BOOK NOW</button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    
    </>
}

