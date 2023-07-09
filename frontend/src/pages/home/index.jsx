import React, { useContext, useEffect, useState } from "react";
// import LargeCard from "../../components/largeCard";
// import { UserContext } from "../../contexts";
import PropertyCard from "../property/card";
import "./style.css";
import SearchBar from "../../components/searchbar";


function Home(props) {
    // const { token } = useContext(UserContext);
    const [ properties, setProperties ] = useState([]);
    const [ count, setCount ] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function viewInfo(){
        var is_valid;
        setIsLoading(true);
        fetch('http://localhost:8000/properties/search/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'Authorization' : `Bearer ${token}`,
                },
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            setProperties(data.results);
            setCount(data.count);
            setNextPage(data.next);
        });
        setIsLoading(false);
    }

    useEffect(() => {
        viewInfo();
    }, []);

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
            },
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setNextPage(data.next);
          setProperties((prevP) => [
            ...prevP,
            ...data.results,
          ]);
        //   data.results.forEach(reservation => {
        //     if (!propertyDetails[reservation.property]) {
        //         getPropertyDetails(reservation.property).then(property => {
        //           setPropertyDetails(prevState => ({
        //             ...prevState,
        //             [reservation.id]: property
        //           }));
        //         });
        //         //console.log(propertyDetails);
        //     }
        //   });
          setIsLoading(false);
        })
    }
    
    const contents = () => {
        if (properties)
            return <>
                {properties.map(rental => {
                    //console.log(rental);
                    return <PropertyCard key={rental.id} rental={rental}/>;
                    })}
                
            </>;
        else
        return <></>;
    } 

    const searchbar = () => {
        // if (token)
            return <SearchBar numresults={count}/>;
        // else
            // return <></>;
    }


    return <div>
        <main className="search content">

            {searchbar()}

            <div className="album py-5 bg-light">
                <div className="container mb-3">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {contents()}
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
    </div>;
}

export default Home;