'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { Minus, Plus, Store, FileText, Clipboard, CheckCircle2, PlusCircle } from "lucide-react";
import Header from "../header/page";

export default function SalesForm() {
    const [plates, setPlates] = useState([]);
    const [menuModels, setMenuModels] = useState([]);
    const [note, setNote] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMenuModels, setLoadingMenuModels] = useState(true);
    const [newPlate, setNewPlate] = useState({ menu: "", price: 0 });
    const [notification, setNotification] = useState({ show: false, message: "", isError: false });

    useEffect(() => {
        const fetchMenuModels = async () => {
            try {
                setLoadingMenuModels(true);
              
                const response = await axios.get("/api/mess/fetching-messes-locations");
                if (response.data.success) {
                    setMenuModels(response.data.data);
                }
            } catch (error) {
                showNotification("Failed to load menu models", true);
                console.error("Error fetching menu models:", error);
            } finally {
                setLoadingMenuModels(false);
            }
        };

        fetchMenuModels();
    }, []);

    const addNewPlate = async () => {
        if (!newPlate.menu.trim() || newPlate.price <= 0) {
            showNotification("Please enter valid plate name and price", true);
            return;
        }

        setPlates([...plates, { ...newPlate, quantity: 1 }]);

        try {
            if (!menuModels.some(model => model.menu === newPlate.menu)) {
                await axios.post("/api/mess/fetching-messes-locations", {
                    menu: newPlate.menu,
                    price: Number(newPlate.price)
                });
          
                setMenuModels([...menuModels, { menu: newPlate.menu, price: Number(newPlate.price) }]);
            }
        } catch (error) {
            console.error("Error saving menu model:", error);
        }

        setNewPlate({ menu: "", price: 0 }); 
    };

    const addMenuModelPlate = (menuModel) => {
        const existingIndex = plates.findIndex(p => p.menu === menuModel.menu);
        
        if (existingIndex >= 0) {
            adjustQuantity(existingIndex, 1);
        } else {
            setPlates([...plates, { menu: menuModel.menu, price: menuModel.price, quantity: 1 }]);
        }
    };

    const updatePlate = (index, field, value) => {
        const newPlates = [...plates];
        newPlates[index][field] = field === "price" || field === "quantity" ? Number(value) : value;
        setPlates(newPlates);
    };

    const adjustQuantity = (index, change) => {
        const newPlates = [...plates];
        newPlates[index].quantity = Math.max(1, newPlates[index].quantity + change);
        setPlates(newPlates);
    };

    const removePlate = (index) => {
        const newPlates = [...plates];
        newPlates.splice(index, 1);
        setPlates(newPlates);
    };

    const calculateTotal = () => {
        return plates.reduce((total, plate) => total + (plate.price * plate.quantity), 0);
    };

    const showNotification = (message, isError = false) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => setNotification({ show: false, message: "", isError: false }), 3000);
    };

    const handleSubmit = async () => {
        if (plates.length === 0) {
            showNotification("Please add at least one menu item", true);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/sales/insert-data", { 
                sales: plates, 
                note, 
                name 
            });
            
            showNotification("Sales data submitted successfully");
            
            for (const plate of plates) {
                if (!menuModels.some(model => model.menu === plate.menu)) {
                    try {
                        await axios.post("/api/mess/add-menu-model", {
                            menu: plate.menu,
                            price: plate.price
                        });
                        
                        setMenuModels(prev => [...prev, { menu: plate.menu, price: plate.price }]);
                    } catch (error) {
                        console.error("Error saving menu model:", error);
                    }
                }
            }
            
            setPlates([]);
            setNote("");
        } catch (error) {
            showNotification("Error submitting sales data. Please try again.", true);
            console.error("Error submitting sales data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header/>
            <div className="container mx-auto px-4 py-8">
                {/* Notification Toast */}
                {notification.show && (
                    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${notification.isError ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : 'bg-green-100 border-l-4 border-green-500 text-green-700'} z-50 transition-opacity duration-300`}>
                        {notification.message}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-xl border-t-4 border-t-purple-600 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-white">
                        <div className="flex items-center gap-3">
                            <Store className="h-8 w-8" /> 
                            <h2 className="text-3xl font-bold">Daily Sales Entry</h2>
                        </div>
                        <p className="mt-2 opacity-90">
                            Record your daily menu sales and track your business performance
                        </p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Add New Plate Form */}
                                <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100">
                                    <h3 className="text-purple-800 text-xl font-semibold mb-4 flex items-center gap-2">
                                        <PlusCircle className="h-5 w-5" /> Add New Plate
                                    </h3>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-12 md:col-span-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Plate Name</label>
                                            <input 
                                                type="text"
                                                value={newPlate.menu} 
                                                onChange={(e) => setNewPlate({...newPlate, menu: e.target.value})} 
                                                placeholder="Enter plate name" 
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                        <div className="col-span-7 md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input 
                                                    type="number" 
                                                    value={newPlate.price || ""} 
                                                    onChange={(e) => setNewPlate({...newPlate, price: e.target.value})} 
                                                    placeholder="0.00" 
                                                    className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-5 md:col-span-3">
                                            <label className="block text-sm font-medium text-transparent mb-1">Action</label>
                                            <button 
                                                type="button"
                                                onClick={addNewPlate}
                                                className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <Plus size={18} /> Add Item
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Order Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-purple-800 text-xl font-semibold flex items-center gap-2">
                                            <FileText className="h-5 w-5" /> Current Order
                                        </h3>
                                        <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                                            {plates.length} {plates.length === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>

                                    {plates.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-600 mb-2 text-lg">No items in current order</p>
                                            <p className="text-sm text-gray-500">Add plates from saved menu or create a new one</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {plates.map((plate, index) => (
                                                <div key={index} className="p-4 bg-white border border-gray-200 border-l-4 border-l-purple-500 rounded-lg hover:shadow-md transition-shadow">
                                                    <div className="grid grid-cols-12 gap-4 items-center">
                                                        <div className="col-span-12 md:col-span-5">
                                                            <label className="text-xs text-gray-500">Item Name</label>
                                                            <div className="font-medium text-lg mt-1">{plate.menu}</div>
                                                        </div>
                                                        <div className="col-span-4 md:col-span-2">
                                                            <label className="text-xs text-gray-500">Price</label>
                                                            <div className="font-medium text-lg mt-1">₹{plate.price}</div>
                                                        </div>
                                                        <div className="col-span-8 md:col-span-3">
                                                            <label className="text-xs text-gray-500">Quantity</label>
                                                            <div className="flex items-center border border-gray-300 rounded-lg mt-1 h-10">
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => adjustQuantity(index, -1)}
                                                                    className="h-full px-3 text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-l-lg transition-colors"
                                                                >
                                                                    <Minus size={16} />
                                                                </button>
                                                                <span className="flex-1 text-center font-medium">{plate.quantity}</span>
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => adjustQuantity(index, 1)}
                                                                    className="h-full px-3 text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-r-lg transition-colors"
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-12 md:col-span-2">
                                                            <label className="text-xs text-gray-500">Subtotal</label>
                                                            <div className="font-semibold text-lg text-purple-700 mt-1">
                                                                ₹{(plate.price * plate.quantity).toFixed(2)}
                                                            </div>
                                                        </div>
                                                        <div className="col-span-12 border-t pt-2 mt-2 flex justify-end">
                                                            <button 
                                                                type="button"
                                                                onClick={() => removePlate(index)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 text-sm px-3 py-1 rounded-full border border-red-200 transition-colors"
                                                            >
                                                                Remove Item
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Notes Section */}
                                <div>
                                    <label className="text-purple-800 text-xl font-semibold flex items-center gap-2 mb-3">
                                        <Clipboard className="h-5 w-5" /> Additional Notes
                                    </label>
                                    <textarea 
                                        value={note} 
                                        onChange={(e) => setNote(e.target.value)} 
                                        placeholder="Add any special instructions, customer feedback, or notes about today's sales..." 
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-32 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Right Column - Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-8">
                                    <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-100">
                                        <h3 className="text-purple-800 text-xl font-semibold mb-6">Order Summary</h3>
                                        
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Items:</span>
                                                <span className="font-medium">{plates.length}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Total Quantity:</span>
                                                <span className="font-medium">
                                                    {plates.reduce((sum, plate) => sum + plate.quantity, 0)}
                                                </span>
                                            </div>
                                            
                                            <div className="border-t border-purple-200 pt-4 mt-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold text-purple-800">Total Amount:</p>
                                                    <p className="text-2xl font-bold text-purple-800">₹{calculateTotal().toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Submit Button */}
                                        <button 
                                            type="button"
                                            className="w-full py-4 mt-8 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5" /> Submit Order
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}