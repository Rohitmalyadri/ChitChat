import supabase from "../lib/db.js";
import { formatRequest, formatUser } from "../lib/formatHelpers.js";
import { io, userSocketMap } from "../server.js";

/**
 * Send or re-send a chat request to another user
 */
export const sendChatRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    if (!receiverId || receiverId === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid receiver user ID" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ success: false, message: "Cannot send a chat request to yourself" });
    }

    // Check if target user exists in database
    const { data: targetUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", receiverId)
      .maybeSingle();

    if (userError) {
      console.error("Supabase user search error:", userError.message);
      return res.status(400).json({ success: false, message: "Invalid user ID or database error" });
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "Target user not found in database" });
    }

    // Check if request already exists in either direction
    const { data: existingRequest, error: checkError } = await supabase
      .from("chat_requests")
      .select("*")
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .maybeSingle();

    if (checkError) throw checkError;

    let savedRequest;

    if (existingRequest) {
      if (existingRequest.status === "accepted") {
        return res.json({ success: false, message: "Chat request is already accepted" });
      }
      if (existingRequest.status === "pending") {
        if (existingRequest.sender_id === senderId) {
          return res.json({ success: false, message: "Chat request already sent and pending" });
        } else {
          // If the other user already sent a pending request, auto-accept it!
          const { data: acceptedReq, error: acceptErr } = await supabase
            .from("chat_requests")
            .update({ status: "accepted" })
            .eq("id", existingRequest.id)
            .select()
            .single();

          if (acceptErr) throw acceptErr;
          savedRequest = acceptedReq;
        }
      } else if (existingRequest.status === "rejected") {
        // Re-send request: reset to pending with current sender/receiver
        const { data: updatedReq, error: updateErr } = await supabase
          .from("chat_requests")
          .update({
            sender_id: senderId,
            receiver_id: receiverId,
            status: "pending",
          })
          .eq("id", existingRequest.id)
          .select()
          .single();

        if (updateErr) throw updateErr;
        savedRequest = updatedReq;
      }
    } else {
      // Create new request
      const { data: newReq, error: createErr } = await supabase
        .from("chat_requests")
        .insert([{
          sender_id: senderId,
          receiver_id: receiverId,
          status: "pending",
        }])
        .select()
        .single();

      if (createErr) throw createErr;
      savedRequest = newReq;
    }

    const formatted = formatRequest(savedRequest);

    // Notify receiver in real-time via Socket.io
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newChatRequest", {
        ...formatted,
        sender: req.user,
      });
    }

    res.json({
      success: true,
      request: formatted,
      message: savedRequest.status === "accepted" ? "Chat request accepted" : "Chat request sent successfully",
    });
  } catch (error) {
    console.error("Error in sendChatRequest:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Accept an incoming pending chat request
 */
export const acceptChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const { data: existing, error: findError } = await supabase
      .from("chat_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (findError || !existing) {
      return res.status(404).json({ success: false, message: "Chat request not found" });
    }

    if (existing.receiver_id !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to accept this request" });
    }

    const { data: updated, error: updateError } = await supabase
      .from("chat_requests")
      .update({ status: "accepted" })
      .eq("id", requestId)
      .select()
      .single();

    if (updateError) throw updateError;

    const formatted = formatRequest(updated);

    // Notify original sender via Socket.io
    const senderSocketId = userSocketMap[existing.sender_id];
    if (senderSocketId) {
      io.to(senderSocketId).emit("chatRequestAccepted", {
        requestId,
        acceptedBy: req.user,
      });
    }

    res.json({ success: true, request: formatted, message: "Chat request accepted" });
  } catch (error) {
    console.error("Error in acceptChatRequest:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Reject an incoming pending chat request
 */
export const rejectChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const { data: existing, error: findError } = await supabase
      .from("chat_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (findError || !existing) {
      return res.status(404).json({ success: false, message: "Chat request not found" });
    }

    if (existing.receiver_id !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to reject this request" });
    }

    const { data: updated, error: updateError } = await supabase
      .from("chat_requests")
      .update({ status: "rejected" })
      .eq("id", requestId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Notify sender via Socket.io
    const senderSocketId = userSocketMap[existing.sender_id];
    if (senderSocketId) {
      io.to(senderSocketId).emit("chatRequestRejected", {
        requestId,
        rejectedBy: req.user,
      });
    }

    res.json({ success: true, message: "Chat request rejected" });
  } catch (error) {
    console.error("Error in rejectChatRequest:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all incoming pending chat requests for logged-in user
 */
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const { data: requests, error } = await supabase
      .from("chat_requests")
      .select("*, sender:users!sender_id(id, email, full_name, profile_pic, bio)")
      .eq("receiver_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedRequests = (requests || []).map((r) => formatRequest(r));

    res.json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error("Error in getPendingRequests:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Check status of chat request between logged-in user and another user
 */
export const getRequestStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    if (!otherUserId || otherUserId === "undefined") {
      return res.json({ success: true, status: "none" });
    }

    const { data: reqObj, error } = await supabase
      .from("chat_requests")
      .select("*")
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .maybeSingle();

    if (error) {
      console.error("Error in getRequestStatus query:", error.message);
      return res.json({ success: true, status: "none" });
    }

    if (!reqObj) {
      return res.json({ success: true, status: "none" });
    }

    if (reqObj.status === "accepted") {
      return res.json({ success: true, status: "accepted", requestId: reqObj.id });
    }

    if (reqObj.status === "rejected") {
      return res.json({
        success: true,
        status: "rejected",
        requestId: reqObj.id,
        isSender: reqObj.sender_id === userId,
      });
    }

    if (reqObj.status === "pending") {
      return res.json({
        success: true,
        status: reqObj.sender_id === userId ? "pending_sent" : "pending_received",
        requestId: reqObj.id,
      });
    }

    res.json({ success: true, status: "none" });
  } catch (error) {
    console.error("Error in getRequestStatus:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
