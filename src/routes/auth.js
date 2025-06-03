import {
    fetchUser,
    loginCustomer,
    loginDeliveryPartner,
    refreshToken
} from "../controllers/auth/auth.js";
import { updateUser } from "../controllers/tracking/user.js"
import { verifyToken } from "../middlewares/auth.js"

export const authRoutes = async (fastify, options) => {
    fastify.post("/customer/login", loginCustomer);
    fastify.post("/delivery/login", loginDeliveryPartner);
    fastify.post("/refresh-token", refreshToken);
    fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
    fastify.patch("/user", { preHandler: [verifyToken] }, updateUser);
};