import mongoose from 'mongoose'
import Counter from "./counter.js"

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    items: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                require: true,
            },
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                require: true,
            },
            count: { type: Number, required: true },
        },
    ],
    deliveryLocation: {
        lalitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    pickupLocation: {
        lalitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String },
    },
    deliveryPersonLocation: {
        lalitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
    },
    status: {
        type: String,
        enum: ["available", "confirmed", "arriving", "delivered", "cancelled"],
        default: "available",
    },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

// to increment the counter so that the number of orders are tracked . to generate new order ids
async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.sequence_value;
}

orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const sequenceValue = await getNextSequenceValue("orderId");
        this.orderId = `ORDR${sequenceValue.toString().padStart(5, '0')}`
    }
    next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;