import dbConnect from "@/lib/dbConnect";
import Mess from "@/model/mess.model";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();
    
    try {
        // Get the request body
        const { latitude, longitude, searchTerm } = await request.json();

        let nearbyMesses;

        if (latitude && longitude) {
            // If geolocation is provided, perform geolocation-based search
            const radiusInKm = 5; // Define radius in kilometers
            const radiusInRadians = radiusInKm / 6378.1; // Convert to radians

            const userCoordinates = [latitude, longitude];
            console.log('Geolocation-based search with coordinates:', userCoordinates);

            // Find messes within the radius of user location
            nearbyMesses = await Mess.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [userCoordinates, radiusInRadians]
                    }
                }
            });

        } else if (searchTerm) {
            // If searchTerm is provided, perform text-based search
            console.log('Text-based search with term:', searchTerm);

            // Perform case-insensitive text search using regex on mess names
            nearbyMesses = await Mess.find({
                name: { $regex: searchTerm, $options: "i" } // 'i' flag makes the search case-insensitive
            });
        } else {
            // If neither geolocation nor search term is provided, return an error
            return NextResponse.json({
                success: false,
                message: "Please provide either geolocation (latitude and longitude) or a search term."
            }, { status: 400 });
        }

        // Check if messes were found
        if (nearbyMesses.length > 0) {
            console.log('Found messes:', nearbyMesses);
            return NextResponse.json({
                success: true,
                message: "Messes fetched successfully",
                messes: nearbyMesses
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: "No messes found with the provided search criteria."
            }, { status: 404 });
        }

    } catch (error) {
        // Handle any errors during the search process
        console.error("Error occurred during search:", error);
        return NextResponse.json({
            success: false,
            message: `Error occurred while fetching messes. Error: ${error.message}`
        }, { status: 500 });
    }
}
