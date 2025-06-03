import { Customer, DeliveryPartner } from "../../models/user.js";
import jwt from 'jsonwebtoken'


const generateTokens = (user) => {
    const accessToken = jwt.sign(  // sign method is used to create  a new jwt
        { userId: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
}

// customer login function

export const loginCustomer = async (req, reply) => {
    try {
        const { phone } = req.body; // destructuring is used to extract phone from the body
        let customer = await Customer.findOne({ phone }); // findOne function takes a object for searching in the database . hence {}
        if (!customer) {
            customer = new Customer({
                phone,
                role: "Customer",
                isActivated: true,
            })

            await customer.save();
        }

        const { accessToken, refreshToken } = generateTokens(customer);
        return reply.send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            customer,
        });
    } catch (error) {
        return reply.status(500).send({ message: "An error occured", error });
    }
}

// Delivery Partner login 
export const loginDeliveryPartner = async (req, reply) => {
    try {
        const { email, password } = req.body;
        const deliveryPartner = await DeliveryPartner.findOne({ email });
        if (!deliveryPartner) {
            return reply.status(404).send({ message: "Delivery Partner not found" });
        }
        isMatch = password === deliveryPartner.password;
        if (!isMatch) {
            return reply.status(400).send({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = generateTokens(deliveryPartner);

        return reply.send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            deliveryPartner,
        })

    } catch (error) {
        return reply.status(500).send({ message: "An error occured", error });
    }
};

// Verify Refresh Token
export const refreshToken = async (req, reply) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return reply.status(401).send({ message: "Refresh Token required", error });
    }

    try {

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let user;
        if (decoded.role === "Customer") {
            user = await Customer.findById(decoded.userId);
        }
        else if (decoded.role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(decoded.userId);
        }
        else {
            return reply.status(403).send({ message: "Invalid role" });
        }

        if (!user) {
            return reply.status(404).send({ message: "User not found" });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user); // giving new name to refresh token

        return reply.send({
            message: "token refreshed",
            accessToken,
            refreshToken: newRefreshToken,
        });

    } catch (error) {
        return reply.status(403).send({ message: "Invalid refresh  token", error });
    }
}

//fetch user 
export const fetchUser = async (req, reply) => {
    try {
        const { userId, role } = req.body;
        let user;
        if (role === "Customer") {
            user = await Customer.findById(userId);
        }
        else if (role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(userId);
        }
        else {
            return reply.status(403).send({ message: "Invalid role" });
        }

        if (!user) {
            return reply.status(404).send({ message: "User not found", error });
        }

        return reply.send({
            message: "User fetched",
            user,
        })
    } catch (error) {
        return reply.status(500).send({ message: "An error occured", error });
    }
}