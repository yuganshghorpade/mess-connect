import dbConnect from "@/lib/dbConnect";
import Mess from "../../models/Mess";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        await dbConnect();
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        // Search for messes matching the query (case-insensitive)
        const messes = await Mess.find({ name: { $regex: query, $options: "i" } }).limit(5);

        res.status(200).json(messes);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
