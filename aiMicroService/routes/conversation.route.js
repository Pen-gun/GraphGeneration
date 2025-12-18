import {
    createConversation,
    getConversations,
    getConversationById,
    updateConversationTitle,
    deleteConversation,
} from "../controllers/conversation.controller.js";
import { addQueryToConversation } from "../controllers/query.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(createConversation)
    .get(getConversations);

router.route("/:id")
    .get(getConversationById)
    .patch(updateConversationTitle)
    .delete(deleteConversation);

router.route("/:id/messages")
    .post(addQueryToConversation);

export default router;
