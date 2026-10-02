import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getPendingRequests,
  getRequestStatus,
} from "../Controllers/requestController.js";

const requestRouter = express.Router();

requestRouter.post("/send/:receiverId", protectRoute, sendChatRequest);
requestRouter.put("/accept/:requestId", protectRoute, acceptChatRequest);
requestRouter.put("/reject/:requestId", protectRoute, rejectChatRequest);
requestRouter.get("/pending", protectRoute, getPendingRequests);
requestRouter.get("/status/:otherUserId", protectRoute, getRequestStatus);

export default requestRouter;
