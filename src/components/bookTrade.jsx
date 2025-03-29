import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BookTrade = ({ tradeId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBookTrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/api/trade/book-trade?tradeId=${tradeId}`);
      alert(response.data.message);
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
        Book Trade
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Trade</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to accept this trade?</p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end gap-4 mt-4">
            <Button onClick={() => setOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">
              No
            </Button>
            <Button onClick={handleBookTrade} disabled={loading} className="bg-green-500 hover:bg-green-600 text-white">
              {loading ? "Processing..." : "Yes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookTrade;
