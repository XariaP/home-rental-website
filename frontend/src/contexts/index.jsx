import { createContext, useState } from "react";

// Store current page being viewed
export const PageContext = createContext({
    page: "home",
    setPage: () => {},
});

// Store the token of the currently logged in user's session
export const UserContext = createContext({
    token: "",
    setToken: () => {},
});

// Store the criteria to be matched when searching for a rental
export const SearchContext = createContext({
    value: "",
    setValue: () => {}
})

// Store values to be matched during search
export function useSearchContext() {
    const [ beds, setBeds ] = useState(0);
    const [ baths, setBaths ] = useState(0);
    const [ guests, setGuests ] = useState(0);
    const [ search, setSearch ] = useState("");

    return {
        beds, setBeds,
        baths, setBaths,
        guests, setGuests,
        search, setSearch
    }
}
