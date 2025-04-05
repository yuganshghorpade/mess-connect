import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import BookTrade from "./booktrade";

function ShowTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await axios.get("/api/trade/fetch-trades", {
          withCredentials: true,
        });
       
        setTrades(res.data.trades.filter(trade => trade.status === "Pending"));
      } catch (err) {
        setError("Failed to fetch trades");
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-green-500 w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="ml-5 text-3xl font-semibold">All Trades</h1>

        <Button asChild className="mr-6 flex items-center gap-2 bg-orange-500 hover:bg-orange-400">
          <Link href="/user/trades/create-trade">
            <PlusCircle className="w-5 h-5" /> Create Trade
          </Link>
        </Button>
      </div>

      {trades.length === 0 ? (
        <p className="text-center text-gray-500">No Trade Available currently.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trades.map((trade) => (
            <Card key={trade._id} className="shadow-lg border border-gray-200 bg-gray-50 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Mess: {trade.mess?.name || "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700"><span className="font-medium">Status:</span> {trade.status}</p>
                <p className="text-gray-700"><span className="font-medium">Created At:</span> {new Date(trade.createdAt).toLocaleString()}</p>
                <p className="text-gray-700"><span className="font-medium">Owner:</span> {trade.owner?.username || "N/A"}</p>
                <p className="text-gray-700"><span className="font-medium">Amount:</span> {trade.amount || "N/A"}</p>

                {/* Add BookTrade button below the Owner */}
                <div className="mt-4">
                  <BookTrade tradeId={trade._id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowTrades;
