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
