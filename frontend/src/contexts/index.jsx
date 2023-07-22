import { createContext, useState } from "react";

export const PageContext = createContext({
    page: "home",
    setPage: () => {},
});

export const UserContext = createContext({
    token: "",
    setToken: () => {},
});

export const SearchContext = createContext({
    value: "",
    setValue: () => {}
})

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