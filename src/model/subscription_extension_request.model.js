import mongoose from "mongoose";
import User from "./user.model.js";
import Mess from "./mess.model.js";
import Subscription from "./subscription.model.js";

const subscriptionExtensionRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        },
        mess: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Mess,
        },
        fromDate: {
            type: Date,
            required: true,
        },
        toDate: {
            type: Date,
            required: true,
        },
        subscription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Subscription,
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

const Subscription_Extension_Request =
    mongoose.models.Subscription_Extension_Request ||
    mongoose.model("Subscription_Extension_Request", subscriptionExtensionRequestSchema);

export default Subscription_Extension_Request;
