import { createContext, useContext } from "react";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios } = useContext(AuthContext);

    const getUsers = async () =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getMessages = async (userId) =>{
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const sendMessage = async (messageData) =>{
        try {
            const {data} = await axios.post(`/api/messsages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessage)=>)
            }
        }
    }

    const value = {

    }

    return (
        <ChatContext.Provider value={{}}>
            {children}
        </ChatContext.Provider>
    )
}