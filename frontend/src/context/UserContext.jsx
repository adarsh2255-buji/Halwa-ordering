import { createContext, useEffect , useState} from "react";
import api from '../api';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [ username , setUsername] = useState("");

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

    useEffect(() => {
        const fetchUserName = async() => {
          try {
            const response = await api.get('/auth/profile', {withCredentials: true});
            setUsername(response.data.user?.profile.username || "User")
            console.log(setUsername)
          } catch (error) {
            console.error('Error fetching user name:', error); 
          }
        } 
        if(user) {
          fetchUserName()
        }
      }, [user])

    //function to handle user logout
    const logout = () => {
        setUser(null);
        setUsername('')
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <UserContext.Provider value={{user, username, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}
