import { createContext, useEffect , useState} from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    //check if the user is logged in when the component is mounted

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if(loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, [])

    //function to handle user login
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    }

    //function to handle user logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <UserContext.Provider value={{user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}
