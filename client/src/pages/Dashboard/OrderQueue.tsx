import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuUndo2 } from "react-icons/lu";

type items = {
    itemId: string;
    itemName: string;
    lineTotal: number;
    modifiers: {
        milk: string;
        note: string;
        size: string;
    }
    quantity: number;
    unitPrice: number;
}

export type Order = {
    _id?: string;
    id?: string;
    createdAt: Date;
    customerId: string;
    customerName: string;
    customerPhone: string;
    isGuest?: boolean;
    items: items[];
    notes?: string;
    orderDate: string;
    orderNumber: number;
    orderType?: string;
    rewards?: number;
    status: string; // "sent", "preparing", "ready", "completed", "refunded"
    tax?: number;
    total: number;
    updatedAt: Date;
}

function OrderQueue() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    
    // Tracks the exact millisecond a user clicked a button
    const lastMutationTime = useRef<number>(0);

    const fetchTodaysOrders = useCallback(async(isPolling = false) => {
        try {
            if (!isPolling) setIsLoading(true);
            setError(null);

            const response = await fetch("http://localhost:8080/api/orders/view", {
                method: "GET",
                credentials: "include",
            });

            const text = await response.text();
            const data = text ? JSON.parse(text) : []; 

            if (!response.ok){
                throw new Error(data?.error || "Failed to load orders.");
            }

            // RACE CONDITION FIX: If the user clicked a status button within the last 4 seconds,
            // discard this incoming fetch. This prevents the UI from flashing back to the old state 
            // while the database is still processing the PATCH request.
            if (Date.now() - lastMutationTime.current < 4000) {
                return; 
            }
            
            setOrders(data);
        } catch (err: any) {
            console.error("Failed to fetch orders:", err);
            setError(err.message || "Failed to load today's orders.");
        } finally {
            if (!isPolling) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodaysOrders(false);
    
        const intervalId = setInterval(() => {
            fetchTodaysOrders(true);
        }, 10000); 
        
        return () => clearInterval(intervalId);
    }, [fetchTodaysOrders]);

    // Tied directly into your custom 'coffee' palette from tailwind.config.js
    const getCardStyles = (status: string) => {
        switch(status) {
            case "preparing": 
                return "bg-coffee-100 border border-coffee-400 shadow-md"; 
            case "ready": 
                return "bg-[#f0fdf4] border border-[#bbf7d0] shadow-md"; // Explicit hex to ensure it renders correctly
            case "completed":
            case "refunded": 
                return "bg-gray-100 border border-gray-300 shadow-none"; 
            default: 
                return "bg-white border border-coffee-200 shadow-sm";
        }
    };

    const getBadgeStyles = (status: string) => {
        switch(status) {
            case "preparing": return "bg-coffee-300 text-coffee-900";
            case "ready": return "bg-[#bbf7d0] text-[#166534]";
            case "sent": return "bg-gray-200 text-gray-700";
            default: return "bg-gray-200 text-gray-600";
        }
    };

    const handleUpdateStatus = async(orderId: string, newStatus: string) => {
        // Lock out incoming database polls for 4 seconds
        lastMutationTime.current = Date.now();

        const previousOrders = [...orders]; 
        
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                (order.id === orderId || order._id === orderId) ? { ...order, status: newStatus } : order
            )
        );

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
                credentials: "include"
            });
            
            if (!response.ok) throw new Error("Failed to update status in DB");
            
            // Note: We intentionally do NOT call fetchTodaysOrders here anymore.
            // The optimistic update handles the UI, and the 10s poll will catch up safely.

        } catch(err) {
            setOrders(previousOrders);
            console.error("Connection lost. Status update failed.", err);
        }
    };

    const statusPriority: Record<string, number> = {
        ready: 1,
        preparing: 2,
        sent: 3,
        completed: 4,
        refunded: 4
    };

    const sortedOrders = [...orders].sort((a, b) => {
        const priorityA = statusPriority[a.status] || 99;
        const priorityB = statusPriority[b.status] || 99;

        if (priorityA === priorityB) {
            return a.orderNumber - b.orderNumber; 
        }
        return priorityA - priorityB;
    });

    if (isLoading) {
        return <div className="p-8 text-xl">Loading today's orders...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-coffee-300 min-h-screen">
            <h1 className="text-3xl font-bold text-coffee-900 mb-6">Today's Orders</h1>
            
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
                <AnimatePresence>
                    {sortedOrders.map((order) => {
                        const cardStyle = getCardStyles(order.status);
                        const badgeStyle = getBadgeStyles(order.status);
                        const isInactive = order.status === "completed" || order.status === "refunded";
                        const safeId = order.id || order._id;
                        
                        return (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: isInactive ? 0.55 : 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={order.orderNumber}
                                style={{ filter: isInactive ? "grayscale(100%)" : "none" }}
                                className={`p-4 rounded-xl flex flex-col gap-3 ${cardStyle}`}
                            >
                                <div className="flex justify-between items-center border-b pb-3 border-coffee-200">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">#{order.orderNumber}</h2>
                                        <span className="text-sm font-medium text-gray-600">{order.customerName}</span>
                                    </div>
                                    <span className={`text-xs uppercase tracking-wide font-bold px-2.5 py-1 rounded-full ${badgeStyle}`}>
                                        {order.status}
                                    </span>
                                </div>
                                
                                <div className="flex-1 mt-1">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex flex-col text-sm py-2 border-b border-coffee-100 last:border-b-0">
                                            <div className="text-gray-800 font-medium">
                                                <span className="font-bold mr-2 text-coffee-700">{item.quantity}x</span> 
                                                {item.itemName}
                                            </div>
                                            
                                            {item.modifiers && (
                                                <div className="flex flex-wrap gap-2 mt-1.5 ml-6">
                                                    {item.modifiers.size && (
                                                        <span className="bg-coffee-100 border border-coffee-200 text-coffee-800 text-xs px-2 py-0.5 rounded-md capitalize">
                                                            {item.modifiers.size}
                                                        </span>
                                                    )}
                                                    {item.modifiers.milk && (
                                                        <span className="bg-coffee-100 border border-coffee-200 text-coffee-800 text-xs px-2 py-0.5 rounded-md capitalize">
                                                            {item.modifiers.milk}
                                                        </span>
                                                    )}
                                                    {item.modifiers.note && (
                                                        <span className="w-full text-xs italic text-gray-500 mt-0.5">
                                                            "{item.modifiers.note}"
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {order.status !== "refunded" && (
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-coffee-200">
                                        
                                        {order.status === "sent" && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateStatus(safeId!, "preparing");
                                                }}
                                                className="w-full bg-coffee-600 hover:bg-coffee-700 text-white py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
                                            >
                                                Start Preparing
                                            </button>
                                        )}

                                        {order.status === "preparing" && (
                                            <>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateStatus(safeId!, "sent");
                                                    }}
                                                    className="flex items-center justify-center px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg transition-all shadow-sm active:scale-95"
                                                    title="Undo to Sent"
                                                >
                                                    <LuUndo2 size={18} />
                                                </button>
                                                
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateStatus(safeId!, "ready");
                                                    }}
                                                    className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
                                                >
                                                    Mark Ready
                                                </button>
                                            </>
                                        )}

                                        {order.status === "ready" && (
                                            <>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateStatus(safeId!, "preparing");
                                                    }}
                                                    className="flex items-center justify-center px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg transition-all shadow-sm active:scale-95"
                                                    title="Undo to Preparing"
                                                >
                                                    <LuUndo2 size={18} />
                                                </button>

                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateStatus(safeId!, "completed");
                                                    }}
                                                    className="flex-1 bg-coffee-800 hover:bg-coffee-900 text-white py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
                                                >
                                                    Complete Order
                                                </button>
                                            </>
                                        )}

                                        {order.status === "completed" && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateStatus(safeId!, "ready");
                                                }}
                                                className="flex items-center justify-center px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg transition-all shadow-sm active:scale-95"
                                                title="Undo to Ready"
                                            >
                                                <LuUndo2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default OrderQueue;