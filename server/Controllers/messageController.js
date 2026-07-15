import supabase from "../lib/db.js";
import { formatUser, formatMessage } from "../lib/formatHelpers.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, full_name, profile_pic, bio, created_at, updated_at")
      .neq("id", userId);

    if (usersError) throw usersError;

    const filteredUsers = (users || []).map(formatUser);

    // Count unseen messages in a single query instead of N+1 queries
    const { data: unseenCounts, error: countError } = await supabase
      .from("messages")
      .select("sender_id")
      .eq("receiver_id", userId)
      .eq("seen", false);

    if (countError) throw countError;

    const unseenMessages = {};
    if (unseenCounts) {
      for (const msg of unseenCounts) {
        unseenMessages[msg.sender_id] = (unseenMessages[msg.sender_id] || 0) + 1;
      }
    }

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all message for selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const { data: messages, error: findError } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${myId},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${myId})`)
      .order("created_at", { ascending: true });

    if (findError) throw findError;

    const formattedMessages = (messages || []).map(formatMessage);

    const { error: updateError } = await supabase
      .from("messages")
      .update({ seen: true })
      .eq("sender_id", selectedUserId)
      .eq("receiver_id", myId)
      .eq("seen", false);

    if (updateError) throw updateError;

    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Marking messages as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from("messages")
      .update({ seen: true })
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const { data: newMessage, error: createError } = await supabase
      .from("messages")
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        text,
        image: imageUrl,
      }])
      .select()
      .single();

    if (createError) throw createError;

    const formattedNewMessage = formatMessage(newMessage);

    // Emit new message to receiver socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", formattedNewMessage);
    }

    res.json({ success: true, newMessage: formattedNewMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }

  // Can start messaging after request is accepted from other user
  /* export const requestToChat = async (req, res) => {
    try {
      
    } catch {
      
    }
  }*/

};