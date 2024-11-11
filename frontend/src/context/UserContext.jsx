import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    

    //check if the user is logged in whenn the component is mounted

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    //function to handle user login   
    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); //save user data to local storage
        localStorage.setItem('token', userData.token);
    };

    //function to handle user logout
    const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem('token');
    };

    return(
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
        {children}
    </UserContext.Provider>
    )
    }
    export default UserProvider;







