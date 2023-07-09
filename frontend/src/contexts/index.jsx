import { createContext } from "react";

export const PageContext = createContext({
    page: "home",
    setPage: () => {},
});

export const UserContext = createContext({
    token: "",
    setToken: () => {},
});

// export function useAPIContext() {
//     const [page, setPage] = useState("home");
//     const [token, setToken] = useState();
//     const [user, setUser] = useState(null);

//     return {
//         page, setPage,
//         token, setToken,
//         user, setUser,
//     }
// }