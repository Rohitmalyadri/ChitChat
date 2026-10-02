import { createContext, useContext, useEffect,useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    const [pendingRequests, setPendingRequests] = useState([])
    const [requestStatus, setRequestStatus] = useState("none") // 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected'
    const [currentRequestId, setCurrentRequestId] = useState(null)

    const { socket, axios } = useContext(AuthContext)
    
    // function to get all users for sidebar

    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users")

            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }


        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get pending chat requests
    const getPendingRequests = async () => {
        try {
            const { data } = await axios.get("/api/requests/pending")
            if (data.success) {
                setPendingRequests(data.requests)
            }
        } catch (error) {
            console.error("Error fetching pending requests:", error.message)
        }
    }

    // function to check request status for selected user
    const checkRequestStatus = async (userId) => {
        if (!userId) return;
        try {
            const { data } = await axios.get(`/api/requests/status/${userId}`)
            if (data.success) {
                setRequestStatus(data.status)
                setCurrentRequestId(data.requestId || null)
            }
        } catch (error) {
            console.error("Error checking request status:", error.message)
        }
    }

    // function to send chat request
    const sendChatRequest = async (receiverId) => {
        try {
            const { data } = await axios.post(`/api/requests/send/${receiverId}`)
            if (data.success) {
                toast.success(data.message)
                if (selectedUser && selectedUser._id === receiverId) {
                    if (data.request?.status === "accepted") {
                        setRequestStatus("accepted")
                    } else {
                        setRequestStatus("pending_sent")
                    }
                    setCurrentRequestId(data.request?._id || null)
                }
                getPendingRequests()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // function to accept chat request
    const acceptChatRequest = async (requestId) => {
        try {
            const { data } = await axios.put(`/api/requests/accept/${requestId}`)
            if (data.success) {
                toast.success(data.message)
                setPendingRequests((prev) => prev.filter((r) => r._id !== requestId))
                if (selectedUser) {
                    checkRequestStatus(selectedUser._id)
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // function to reject chat request
    const rejectChatRequest = async (requestId) => {
        try {
            const { data } = await axios.put(`/api/requests/reject/${requestId}`)
            if (data.success) {
                toast.success(data.message)
                setPendingRequests((prev) => prev.filter((r) => r._id !== requestId))
                if (selectedUser) {
                    checkRequestStatus(selectedUser._id)
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            
            if (data.success) {
                setMessages(data.messages)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)

            if (data.success) {
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // function to subscribe to real-time socket events
    const subscribeToSocketEvents = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true
                setMessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,[newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })

        socket.on("newChatRequest", (reqObj) => {
            toast.success(`New chat request from ${reqObj.sender?.fullName || 'a user'}`)
            setPendingRequests((prev) => [reqObj, ...prev.filter(r => r._id !== reqObj._id)])
            if (selectedUser && (selectedUser._id === reqObj.senderId || selectedUser._id === reqObj.sender?._id)) {
                checkRequestStatus(selectedUser._id)
            }
        })

        socket.on("chatRequestAccepted", ({ requestId, acceptedBy }) => {
            toast.success(`${acceptedBy?.fullName || 'User'} accepted your chat request!`)
            if (selectedUser && selectedUser._id === acceptedBy?._id) {
                setRequestStatus("accepted")
            }
        })

        socket.on("chatRequestRejected", ({ requestId, rejectedBy }) => {
            toast.error(`${rejectedBy?.fullName || 'User'} declined your chat request.`)
            if (selectedUser && selectedUser._id === rejectedBy?._id) {
                setRequestStatus("rejected")
            }
        })
    }

    // function to unsubscribe from socket events
    const unsubscribeFromSocketEvents = () => {
        if (socket) {
            socket.off("newMessage")
            socket.off("newChatRequest")
            socket.off("chatRequestAccepted")
            socket.off("chatRequestRejected")
        }
    }

    useEffect(() => {
      subscribeToSocketEvents()
      getPendingRequests()
    
      return () => {
        unsubscribeFromSocketEvents()
      }
    }, [socket, selectedUser])

    useEffect(() => {
        if (selectedUser) {
            checkRequestStatus(selectedUser._id)
        } else {
            setRequestStatus("none")
            setCurrentRequestId(null)
        }
    }, [selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages,
        pendingRequests,
        requestStatus,
        currentRequestId,
        getPendingRequests,
        checkRequestStatus,
        sendChatRequest,
        acceptChatRequest,
        rejectChatRequest,
    }

    return (<ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>)
}