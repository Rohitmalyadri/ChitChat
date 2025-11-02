import express from "express";
import { getMessages, getusersForSidebar, markMessageAsSeen } from "../Controllers/messageController";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getusersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;