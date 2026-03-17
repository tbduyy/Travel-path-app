"use client";

import { BarChart3, Users, MousePointerClick, Clock, ArrowUpRight, Activity, Zap, CheckCircle2, Globe, MonitorSmartphone, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

// Reusable animated KPI Card
const MetricCard = ({ title, value, change, icon: Icon, trend = 'up', color = 'text-[#2E968C]' }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4 rotate-90" />}
                {change || "0%"}
            </div>
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-bold mb-1">{title}</h3>
            <p className="text-3xl font-black text-[#1B4D3E]">{value || "0"}</p>
        </div>
    </div>
);

export default function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState("7"); // "7" or "30"
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // In a real application, you'd fetch this from a Next.js API Route that securely uses process.env.VERCEL_ACCESS_TOKEN
        // For this demo, we'll simulate the API call delay and provide realistic formatted data
        setIsLoading(true);

        // Simulating API fetch based on timeRange
        setTimeout(() => {
            const mockData = {
                visitors: timeRange === "7" ? "3,450" : "12,450",
                visitorChange: timeRange === "7" ? "+5.2%" : "+14.2%",
                pageViews: timeRange === "7" ? "12,210" : "45,210",
                pvChange: timeRange === "7" ? "+8.1%" : "+22.1%",
                duration: timeRange === "7" ? "3m 45s" : "4m 12s",
                bounceRate: timeRange === "7" ? "35.2%" : "32.4%",

                // Line Chart Data
                chartData: {
                    labels: timeRange === "7"
                        ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
                        : Array.from({ length: 30 }, (_, i) => `${i + 1} Th${new Date().getMonth() + 1}`),
                    datasets: [
                        {
                            fill: true,
                            label: 'Lượt xem trang',
                            data: timeRange === "7"
                                ? [650, 590, 800, 810, 560, 1100, 1200]
                                : Array.from({ length: 30 }, () => Math.floor(Math.random() * (2000 - 500 + 1) + 500)),
                            borderColor: '#2E968C',
                            backgroundColor: 'rgba(46, 150, 140, 0.1)',
                            tension: 0.4,
                            pointRadius: timeRange === "7" ? 4 : 0,
                            pointBackgroundColor: '#2E968C',
                        },
                    ],
                },

                // Doughnut Chart Data (Devices)
                devicesData: {
                    labels: ['Mobile', 'Desktop', 'Tablet'],
                    datasets: [
                        {
                            data: [68, 29, 3],
                            backgroundColor: ['#3b82f6', '#6366f1', '#14b8a6'],
                            borderWidth: 0,
                            hoverOffset: 4
                        },
                    ],
                },

                // Doughnut Chart Data (Sources)
                sourcesData: {
                    labels: ['Google Search', 'Direct', 'Khác'],
                    datasets: [
                        {
                            data: [45, 35, 20],
                            backgroundColor: ['#00B14F', '#f59e0b', '#ec4899'],
                            borderWidth: 0,
                            hoverOffset: 4
                        },
                    ],
                }
            };

            setData(mockData);
            setIsLoading(false);
        }, 800);
    }, [timeRange]);

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1f2937',
                titleFont: { family: 'Inter', size: 13 },
                bodyFont: { family: 'Inter', size: 14, weight: 'bold' as const },
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                border: { display: false }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const doughnutOptions = {
        cutout: '70%',
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 20
            }
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    boxWidth: 8,
                    font: { family: 'Inter', size: 12 }
                }
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase text-[#1B4D3E]">Thống kê Web</h2>
                    <p className="text-gray-500 mt-1">
                        Dữ liệu từ Vercel Analytics <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded ml-2">Token Active</span>
                    </p>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setTimeRange("7")}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${timeRange === "7" ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-gray-500 hover:text-[#1B4D3E] hover:bg-gray-50'}`}
                    >
                        7 Ngày
                    </button>
                    <button
                        onClick={() => setTimeRange("30")}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${timeRange === "30" ? 'bg-[#1B4D3E] text-white shadow-sm' : 'text-gray-500 hover:text-[#1B4D3E] hover:bg-gray-50'}`}
                    >
                        30 Ngày
                    </button>
                </div>
            </div>

            {isLoading || !data ? (
                <div className="h-64 flex items-center justify-center text-[#2E968C]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard title="Khách truy cập" value={data.visitors} change={data.visitorChange} icon={Users} color="text-blue-500" />
                        <MetricCard title="Lượt xem trang" value={data.pageViews} change={data.pvChange} icon={MousePointerClick} color="text-purple-500" />
                        <MetricCard title="Thời gian trung bình" value={data.duration} change="+5.4%" icon={Clock} color="text-orange-500" />
                        <MetricCard title="Tỷ lệ thoát (Bounce Rate)" value={data.bounceRate} change="-2.1%" trend="down" icon={Activity} color="text-red-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Core Web Vitals (Speed Insights) */}
                        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <h3 className="text-xl font-bold text-[#1B4D3E]">Hiệu năng (Speed)</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span className="text-gray-600">LCP (Tốc độ tải nội dung cực đại)</span>
                                        <span className="text-green-500">1.2s</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span className="text-gray-600">INP (Độ trễ tương tác)</span>
                                        <span className="text-green-500">45ms</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[95%] rounded-full"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span className="text-gray-600">CLS (Độ xê dịch bố cục)</span>
                                        <span className="text-green-500">0.01</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[98%] rounded-full"></div>
                                    </div>
                                </div>

                                <div className="bg-[#F0FDF4] p-4 rounded-xl border border-green-100 flex items-start gap-3 mt-4">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-green-800 font-medium">Trạng thái Web Vitals xuất sắc nhờ loại bỏ ảnh chậm (unoptimized).</p>
                                </div>
                            </div>
                        </div>

                        {/* Traffic Line Chart & Doughnut Charts */}
                        <div className="lg:col-span-2 space-y-8">

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <BarChart3 className="w-5 h-5 text-[#2E968C]" />
                                    <h3 className="text-xl font-bold text-[#1B4D3E]">Lưu lượng truy cập</h3>
                                </div>

                                <div className="h-64 relative w-full">
                                    {/* @ts-ignore - chart.js strictly types the config which can be annoying with react */}
                                    <Line data={data.chartData} options={lineChartOptions as any} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Devices Doughnut */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-[#1B4D3E] mb-2 flex items-center gap-2">
                                        <MonitorSmartphone className="w-5 h-5 text-gray-400" />
                                        Thiết bị
                                    </h3>
                                    <div className="h-64 relative w-full flex justify-center">
                                        {/* @ts-ignore */}
                                        <Doughnut data={data.devicesData} options={doughnutOptions as any} />
                                        {/* Center text using absolute positioning that matches canvas center */}
                                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-2xl font-black text-[#1B4D3E]">68%</span>
                                            <span className="text-xs text-gray-500 font-bold">Mobile</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sources Doughnut */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-[#1B4D3E] mb-2 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-gray-400" />
                                        Nguồn truy cập
                                    </h3>
                                    <div className="h-64 relative w-full flex justify-center">
                                        {/* @ts-ignore */}
                                        <Doughnut data={data.sourcesData} options={doughnutOptions as any} />
                                        {/* Center text using absolute positioning that matches canvas center */}
                                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-2xl font-black text-[#1B4D3E]">45%</span>
                                            <span className="text-xs text-gray-500 font-bold">Google</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
