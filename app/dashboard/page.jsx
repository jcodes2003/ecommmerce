'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/component/card";
import { Menu, Bell, Sun, ChevronDown, Mail, Search, X } from 'lucide-react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { useRouter } from 'next/navigation';



const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [statisticsData, setStatisticsData] = useState([]);
    const [randomValue, setRandomValue] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [monthlyData, setMonthlyData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Generate sample data for statistics only on the client
        const data = Array.from({ length: 100 }, (_, i) => ({
            time: i,
            sales: Math.random() * 400 + 600,
            revenue: Math.random() * 300 + 400,
        }));
        setStatisticsData(data);
    }, []);

    useEffect(() => {
        setRandomValue(Math.random());
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchSales = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("operation", "getSalesData");
    
            const response = await axios.post(
                "http://localhost/ebook/app/api/sales.php",
                formData,
                { headers: { Accept: "application/json" } }
            );

            console.log("API Response:", response.data); // Log the response data

            if (Array.isArray(response.data)) {
                setStatisticsData(response.data.map(sale => ({
                    time: new Date(sale.date_sold).getTime(),
                    sales: parseFloat(sale.totalamount) || 0,
                    user_count: parseInt(sale.user_count) || 0 // Ensure user_count is an integer
                })));

                const monthlySalesData = response.data.reduce((acc, sale) => {
                    const month = new Date(sale.date_sold).getMonth();
                    acc[month] = (acc[month] || 0) + parseFloat(sale.totalamount);
                    return acc;
                }, new Array(12).fill(0));

                setMonthlyData(monthlySalesData.map((value, index) => ({
                    id: index,
                    value,
                    month: new Date(0, index).toLocaleString('default', { month: 'short' })
                })));
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchSales();
    }, []);

    const logout = () => {
        sessionStorage.clear(); // Clear session storage
        router.push('/app'); // Navigate to /app
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden`}>
                <div className="p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                        <span className="text-xl font-bold">TailAdmin</span>
                    </div>
                </div>

                <nav className="p-4">
                    <div className="text-xs text-gray-400 mb-2">MENU</div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <span>Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <span>E-commerce</span>
                        </div>
                        {/* Add more menu items */}
                        <button onClick={logout} className="flex items-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <button onClick={toggleSidebar} className="p-1 hover:bg-gray-100 rounded-lg">
                                {isSidebarOpen ? <X className="w-6 h-6 text-gray-500" /> : <Menu className="w-6 h-6 text-gray-500" />}
                            </button>
                            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                                <Search className="w-4 h-4 text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search or type command..."
                                    className="bg-transparent border-none focus:outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Sun className="w-6 h-6 text-gray-500" />
                            <Bell className="w-6 h-6 text-gray-500" />
                            <Mail className="w-6 h-6 text-gray-500" />
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Customers</p>
                                        <h3 className="text-2xl font-bold">{statisticsData.reduce((acc, sale) => acc + (sale.user_count || 0), 0)}</h3>
                                    </div>
                                    <span className="text-green-500 text-sm">+11.01%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Orders</p>
                                        <h3 className="text-2xl font-bold">5,359</h3>
                                    </div>
                                    <span className="text-red-500 text-sm">-9.03%</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarChart
                                    width={500}
                                    height={300}
                                    series={[{ data: monthlyData.map(d => d.value), label: 'Sales' }]}
                                    xAxis={[{
                                        data: monthlyData.map(d => d.month),
                                        scaleType: 'band',
                                    }]}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Target</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-3xl font-bold">75.55%</span>
                                        <span className="text-green-500 text-sm">+10%</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 text-center mt-4">
                                    You earn $3,287 today, its higher than last month.
                                    Keep up your good work!
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistics Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                width={1000}
                                height={300}
                                series={[
                                    {
                                        data: statisticsData.map(d => d.sales),
                                        label: 'Sales',
                                        color: '#4F46E5'
                                    },
                                    {
                                        data: statisticsData.map(d => d.revenue),
                                        label: 'Revenue',
                                        color: '#9333EA'
                                    }
                                ]}
                                xAxis={[{
                                    data: statisticsData.map(d => d.time),
                                    scaleType: 'linear'
                                }]}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;