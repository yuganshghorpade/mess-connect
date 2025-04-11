'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const SalesAnalysisDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), 
    to: new Date()
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/sales/fetch-analysis');
        
        if (response.data.success) {
          setSalesData(response.data.data);
          filterDataByDateRange(response.data.data, dateRange);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Filter data when date range changes
  useEffect(() => {
    filterDataByDateRange(salesData, dateRange);
  }, [dateRange, salesData]);

  // Function to filter data by date range
  const filterDataByDateRange = (data, range) => {
    if (!data.length) return;
    
    const { from, to } = range;
    const filteredData = data.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= from && saleDate <= to;
    });
    
    setFilteredData(filteredData);
  };

  // Data processing functions for daily data
  const processDailyRevenue = () => {
    if (!filteredData.length) return [];
    
    const dailyData = {};
    
    filteredData.forEach(sale => {
      const date = new Date(sale.createdAt);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          date: dateStr,
          displayDate: format(date, 'dd MMM'),
          revenue: 0,
          transactions: 0,
        };
      }
      
      dailyData[dateStr].revenue += sale.totalAmount;
      dailyData[dateStr].transactions += 1;
    });
    
    // Sort by date
    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const processCategoryDistribution = () => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) return [];

    const categoryData = {};

    filteredData.forEach(entry => {
      const itemsArray = Array.isArray(entry.items) ? entry.items : 
                        (Array.isArray(entry.sales) ? entry.sales : []);
                        
      itemsArray.forEach(item => {
        const categoryName = item.menu || item.category || item.name;
        if (!categoryName) return;
        
        if (!categoryData[categoryName]) {
          categoryData[categoryName] = {
            name: categoryName,
            value: 0,
            count: 0,
          };
        }

        const price = item.price || 0;
        const quantity = item.quantity || 1;
        categoryData[categoryName].value += price * quantity;
        categoryData[categoryName].count += quantity;
      });
    });

    return Object.values(categoryData);
  };

  const processTopSellingItems = () => {
    if (!filteredData.length) return [];
  
    const itemsData = {};
  
    filteredData.forEach(sale => {
      
      const itemsArray = Array.isArray(sale.items) ? sale.items : 
                         (Array.isArray(sale.sales) ? sale.sales : []);
      
      itemsArray.forEach(item => {
        const itemName = item.name || item.menu || 'Unknown';
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 1;
        
        if (!itemsData[itemName]) {
          itemsData[itemName] = {
            name: itemName,
            quantity: 0,
            revenue: 0,
          };
        }
  
        itemsData[itemName].quantity += itemQuantity;
        itemsData[itemName].revenue += itemPrice * itemQuantity;
      });
    });
  
    return Object.values(itemsData)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };
  
  const getAverageOrderValue = () => {
    if (!filteredData.length) return 0;
    
    let totalRevenue = 0;
    
    filteredData.forEach(sale => {
      
      if (typeof sale.totalAmount === 'number') {
        totalRevenue += sale.totalAmount;
      } else if (Array.isArray(sale.items)) {
        totalRevenue += sale.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      } else if (Array.isArray(sale.sales)) {
        totalRevenue += sale.sales.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      }
    });
    
    return (totalRevenue / filteredData.length).toFixed(2);
  };

  const getTotalRevenue = () => {
    if (!filteredData.length) return 0;
    
    let totalRevenue = 0;
    
    filteredData.forEach(sale => {
      
      if (typeof sale.totalAmount === 'number') {
        totalRevenue += sale.totalAmount;
      } else if (Array.isArray(sale.items)) {
        totalRevenue += sale.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      } else if (Array.isArray(sale.sales)) {
        totalRevenue += sale.sales.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      }
    });
    
    return totalRevenue.toFixed(2);
  };

  const getCustomerCount = () => {
    if (!filteredData.length) return 0;
    
    const uniqueCustomers = new Set();
    filteredData.forEach(sale => {
      if (sale.customerId) {
        uniqueCustomers.add(sale.customerId);
      } else if (sale.userId) {
        uniqueCustomers.add(sale.userId);
      } else if (sale.customer && sale.customer.id) {
        uniqueCustomers.add(sale.customer.id);
      }
    });
    
    return uniqueCustomers.size > 0 ? uniqueCustomers.size : filteredData.length;
  };

  // Custom date range picker component
  const DateRangeSelector = () => {
    const [fromDate, setFromDate] = useState(dateRange.from);
    const [toDate, setToDate] = useState(dateRange.to);

    const handleApply = () => {
      setDateRange({ from: fromDate, to: toDate });
    };

    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-muted rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">From Date</label>
            <input 
              type="date" 
              className="border rounded p-2"
              value={format(fromDate, 'yyyy-MM-dd')}
              onChange={(e) => setFromDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">To Date</label>
            <input 
              type="date" 
              className="border rounded p-2"
              value={format(toDate, 'yyyy-MM-dd')}
              onChange={(e) => setToDate(new Date(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-end">
          <Button onClick={handleApply} className="bg-primary text-white">
            Apply Filter
          </Button>
        </div>
        <div className="flex items-end">
          <Button variant="outline" onClick={() => {
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            setFromDate(thirtyDaysAgo);
            setToDate(today);
            setDateRange({ from: thirtyDaysAgo, to: today });
          }}>
            Last 30 Days
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading sales analysis data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const dailyRevenueData = processDailyRevenue();
  const categoryDistributionData = processCategoryDistribution();
  const topSellingItemsData = processTopSellingItems();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mess Sales Analysis Dashboard</h1>
      
      {/* Date Range Selector */}
      <DateRangeSelector />
      
      {/* Date range display */}
      <div className="mb-6">
        <p className="text-lg font-medium">
          Analyzing data from {format(dateRange.from, 'dd MMM yyyy')} to {format(dateRange.to, 'dd MMM yyyy')}
        </p>
      </div>
      
      {/* Key metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{getTotalRevenue()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{getAverageOrderValue()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{getCustomerCount()}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different analysis views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="items">Menu Items Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
                  <Line type="monotone" dataKey="transactions" stroke="#82ca9d" name="Transactions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSellingItemsData.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue (₹)" />
                  <Bar yAxisId="right" dataKey="transactions" fill="#82ca9d" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Best Selling Items</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingItemsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Items Sold by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Items Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAnalysisDashboard;