import mongoose from "mongoose";
import User from "./user.model.js";
import Mess from "./mess.model.js";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        },
        mess: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Mess,
        },
        startDate: {
            type: Number,
        },
        expiry: {
            type: Number,
        },
        mealType: {
            type: String,
            enum: ["Breakfast", "Lunch", "Dinner"],
        },
        status: {
            type: String,
            enum: ["Active", "Expired", "Queued"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

subscriptionSchema.statics.updateExpiredSubscriptions = async function (
    id,
    type
) {
    try {
        const now = Date.now();
        const query =
            type === "user"
                ? { user: id, expiry: { $lt: now }, status: "Active" }
                : { mess: id, expiry: { $lt: now }, status: "Active" };

        
        const result = await this.updateMany(query, {
            $set: { status: "Expired" },
        });
        console.log(`Updated ${result.nModified} subscriptions to 'Expired'.`);
    } catch (error) {
        console.error("Error updating expired subscriptions:", error);
    }
};

const Subscription =
    mongoose.models.Subscription ||
    mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
