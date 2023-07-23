import React, { useContext, useEffect, useState } from "react";
import PropertyCard from "../property/card";
import "./style.css";
import SearchBar from "../../components/searchbar";
import { SearchContext } from "../../contexts";

// Displays home page for website
function Home(props) {
    const [ properties, setProperties ] = useState([]);     // List of properties available for rent
    const [ count, setCount ] = useState(0);                // Number of properties that show up in the results
    const [nextPage, setNextPage] = useState(null);         // Link to the next result page
    const [isLoading, setIsLoading] = useState(false);      // Tracks whether page has loaded completely
    const {beds, baths, guests, search, setBeds, setBaths, setGuests, setSearch} = useContext(SearchContext);   // Filter values for search results

    // Retrieve property information for properties that match the search criteria
    async function viewInfo(search){
        var is_valid;
        var link = 'http://localhost:8000/properties/search/';
        link += search;
        setIsLoading(true);

        fetch(link,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
        .then((request) => {
            is_valid = request.ok;
            return request.json();
        })
        .then((data) => {
            setProperties(data.results);
            console.log(properties);
            setCount(data.count);
            setNextPage(data.next);
        });
        setIsLoading(false);
    }

    // Display information when page loads
    useEffect(() => {
        viewInfo("");
    }, []);

    // Display new search results when filters updated
    useEffect(() => {
        viewInfo(search);
    }, [search]);

    // Load more search results
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
        //     }
        //   });
          setIsLoading(false);
        })
    }
    
    // Displays a card for each property in the list
    const contents = () => {
        if (properties)
            return <>
                {properties.map(rental => {
                    return <PropertyCard key={rental.id} rental={rental}/>;
                })}
            </>;
        else
            return <></>;
    } 

    // Displays the filters to narrow down the results
    const searchbar = () => {
        return <SearchBar numresults={count}/>;
    }

    // Display home page layout
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