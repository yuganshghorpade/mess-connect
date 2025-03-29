import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreateTrade() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ type: "", amount: "" });
    const [response, setResponse] = useState(null);
    const [userTrades, setUserTrades] = useState([]);

    
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get("/api/user/fetching-user-details", { withCredentials: true });
                if (res.data.success) {
                    setUserData(res.data.response);
                    fetchUserTrades(res.data.response._id);
                } else {
                    setError(res.data.message || "Failed to load user data.");
                }
            } catch (err) {
                setError("Failed to load user data. Error: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const fetchUserTrades = async (userId) => {
        try {
            const res = await axios.get(`/api/trade/fetch-trades?userid=${userId}`, { withCredentials: true });
            setUserTrades(res.data.trades || []);
        } catch (err) {
            setError("Failed to fetch user trades.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "/api/trade/create-trade",
                {
                    userid: userData._id,
                    messid: userData.messid,
                    type: formData.type,
                    amount: parseFloat(formData.amount)
                },
                { withCredentials: true }
            );
            setResponse(res.data);
            if (res.data.success) {
                fetchUserTrades(userData._id);
            }
        } catch (error) {
            setResponse({ success: false, message: error.response?.data?.message || "Something went wrong" });
        }
    };

    if (loading) return <p className="text-center text-gray-600">Loading user data...</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full max-w-none mx-auto">
            {/* Create Trade Section */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create Trade</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
    <label className="block text-sm font-medium">Meal Type</label>
    <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
    >
        <option value="" disabled>Select a meal type</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
    </select>
</div>

                        <div>
                            <label className="block text-sm font-medium">Amount</label>
                            <Input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                        </div>
                        <Button type="submit" className="w-full">Create Trade</Button>
                    </form>
                    {response && (
                        <p className={`mt-2 text-sm ${response.success ? "text-green-600" : "text-red-600"}`}>
                            {response.message}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Trade History Section */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>My Trades</CardTitle>
                </CardHeader>
                <CardContent>
                    {userTrades.length === 0 ? (
                        <p className="text-gray-500">No trades found.</p>
                    ) : (
                        <div className="space-y-4">
                            {userTrades.map((trade) => (
                                <Card key={trade._id} className="bg-gray-50 border border-gray-200 shadow-sm">
                                    <CardContent className="p-4">
                                        <p className="text-sm font-medium">Meal Type: <span className="font-normal">{trade.type}</span></p>
                                        <p className="text-sm font-medium">Amount: <span className="font-normal">{trade.amount}</span></p>
                                        <p className="text-sm font-medium">Status: <span className="font-normal">{trade.status}</span></p>
                                        <p className="text-sm font-medium">Created At: <span className="font-normal">{new Date(trade.createdAt).toLocaleString()}</span></p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateTrade;