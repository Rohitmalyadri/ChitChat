import { createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {connect, io} from "socket.io-client"

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authuser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user);
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    //Login function
    const login = async (state, Credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, Credentials);

            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //logout function

    const logout = () => {
        localStoarge.removeItem("token");
        setAuthUser(null);
        setOnlineUsers([]);
            axios.defaults.header.common["token"] = null;
            toast.success("Logged out successfully")
            socket.disconnect();
    }

    //update profile function
    const updateProfile = async (body) =>{
        try {
            const { data } =await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("profile updated successfully")
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //connect socket function to handle socket connection and online users updates
    const connectSocket = () => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendURL, {
            query: {
                userId: userData._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (usersIds)=>{
            setOnlineUsers(usersIds);
        })
    }

    useEffect(()=>{

        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }

    },[])

    const value = {
        axios,
        authuser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}