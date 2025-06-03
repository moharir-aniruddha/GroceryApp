import mongoose from 'mongoose'

// Base user schema 

const userSchema = new mongoose.Schema({

    name: { type: String },
    role: {
        type: String,
        enum: ["Customer", "Admin", "DeliveryPartner"],
        required: true,
    },
    isActivated: { type: Boolean, default: false }
})

// customer schema 

const customerSchema = new mongoose.Schema({
    ...userSchema.obj, // copies the user schema as it is for further use 
    phone: { type: Number, required: true, unique: true },
    role: { type: String, enum: ["Customer"], defualt: "Customer" },
    liveLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    address: { type: String },
})

// delivery partner schema 
const deliveryPartnerSchema = new mongoose.Schema({
    ...userSchema.obj, // copies the user schema as it is for further use 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    role: { type: String, enum: ["DeliveryPartner"], defualt: "DeliveryPartner" },
    liveLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    address: { type: String },
    branch: {
        type: mongoose.Schema.Types.ObjectId, // each model has a unique id , instead of storing the complete document , only the id is stored .
        ref: "Branch", // it indicates that it is referring to another model named branch 
    },
});

// Admin schema 
const adminSchema = new mongoose.Schema({
    ...userSchema.obj, // copies the user schema as it is for further use 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin"], defualt: "Admin" },
    isActivated: { type: Boolean, default: false },
});

export const Customer = mongoose.model("Customer", customerSchema);
export const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
export const Admin = mongoose.model("Admin", adminSchema);