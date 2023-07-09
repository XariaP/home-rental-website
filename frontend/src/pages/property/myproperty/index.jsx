import React, { useContext, useEffect, useState } from "react";
// import LargeCard from "../../components/largeCard";
import { PageContext, UserContext } from "../../../contexts";
import PropertyCard from "../../property/card";
import { Link } from "react-router-dom";
// import "./style.css";


export default function MyProperty(props) {
    const { token } = useContext(UserContext);
    const { setPage } = useContext(PageContext);
    const [ properties, setProperties ] = useState([]);

    async function viewInfo(){
        var is_valid;
        fetch('http://localhost:8000/properties/manage/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            // console.log(data, "k");
            setProperties(data.results);
            //console.log(properties);
        })
    }

    useEffect(() => {
        viewInfo();
        setPage("rentals");
    }, []);
    
    const contents = () => {
        if (properties)
            return <>
                {properties.map(rental => {
                    //console.log(rental);
                        return <PropertyCard key={rental.id} rental={rental} />;
                    })}
            </>;
    }

    return <div>
        <main className="search content">

            <section className="py-5 text-center container">
            <div className="row">
                <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">My Properties</h1>
                <p>
                    <Link to="/properties/add" className="btn btn-primary my-2">Add New Property</Link>
                </p>
                </div>
            </div>
            </section>

            <div className="album py-5 bg-light">
                <div className="container mb-3">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {contents()}
                    </div>
                </div>
            </div>
        </main>
    </div>;
}