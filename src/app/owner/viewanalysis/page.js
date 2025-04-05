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

const SalesAnalysisDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/sales/fetch-analysis');
        
        if (response.data.success) {
          setSalesData(response.data.data);
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

  // Data processing functions
  const processMonthlyRevenue = () => {
    if (!salesData.length) return [];
    
    const monthlyData = {};
    
    salesData.forEach(sale => {
      const date = new Date(sale.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthYear,
          revenue: 0,
          transactions: 0,
        };
      }
      
      monthlyData[monthYear].revenue += sale.totalAmount;
      monthlyData[monthYear].transactions += 1;
    });
    
    return Object.values(monthlyData);
  };

  const processCategoryDistribution = () => {
    if (!Array.isArray(salesData) || salesData.length === 0) return [];

    const categoryData = {};

    salesData.forEach(entry => {
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
    if (!salesData.length) return [];
  
    const itemsData = {};
  
    salesData.forEach(sale => {
      
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
    if (!salesData.length) return 0;
    
    let totalRevenue = 0;
    
    salesData.forEach(sale => {
      
      if (typeof sale.totalAmount === 'number') {
        totalRevenue += sale.totalAmount;
      } else if (Array.isArray(sale.items)) {
        totalRevenue += sale.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      } else if (Array.isArray(sale.sales)) {
        totalRevenue += sale.sales.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      }
    });
    
    return (totalRevenue / salesData.length).toFixed(2);
  };

  const getTotalRevenue = () => {
    if (!salesData.length) return 0;
    
    let totalRevenue = 0;
    
    salesData.forEach(sale => {
      
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
    if (!salesData.length) return 0;
    
    const uniqueCustomers = new Set();
    salesData.forEach(sale => {
      if (sale.customerId) {
        uniqueCustomers.add(sale.customerId);
      } else if (sale.userId) {
       
        uniqueCustomers.add(sale.userId);
      } else if (sale.customer && sale.customer.id) {
        
        uniqueCustomers.add(sale.customer.id);
      }
    });
    
   
    return uniqueCustomers.size > 0 ? uniqueCustomers.size : salesData.length;
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

  const monthlyRevenueData = processMonthlyRevenue();
  const categoryDistributionData = processCategoryDistribution();
  const topSellingItemsData = processTopSellingItems();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mess Sales Analysis Dashboard</h1>
      
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
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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