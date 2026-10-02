/**
 * Helper to map PostgreSQL user records to the MongoDB structure expected by the frontend and controller code.
 */
export const formatUser = (user) => {
  if (!user) return null;
  return {
    _id: user.id,
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    password: user.password,
    profilePic: user.profile_pic || "",
    bio: user.bio || "",
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

/**
 * Helper to map PostgreSQL message records to the MongoDB structure.
 */
export const formatMessage = (msg) => {
  if (!msg) return null;
  return {
    _id: msg.id,
    id: msg.id,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id,
    text: msg.text || "",
    image: msg.image || "",
    seen: msg.seen ?? false,
    createdAt: msg.created_at,
    updatedAt: msg.updated_at,
  };
};

/**
 * Helper to map PostgreSQL chat_request records to JavaScript camelCase object structure.
 */
export const formatRequest = (reqObj) => {
  if (!reqObj) return null;
  return {
    _id: reqObj.id,
    id: reqObj.id,
    senderId: reqObj.sender_id,
    receiverId: reqObj.receiver_id,
    sender: reqObj.sender ? formatUser(reqObj.sender) : undefined,
    receiver: reqObj.receiver ? formatUser(reqObj.receiver) : undefined,
    status: reqObj.status,
    createdAt: reqObj.created_at,
    updatedAt: reqObj.updated_at,
  };
};
