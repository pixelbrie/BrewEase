import React, { useEffect, useState } from "react";

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

    useEffect(() => {
        const fetchTodaysOrders = async() => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch("http://localhost:8080/api/orders/view", {
                    method: "GET",
                    credentials: "include",
                });

                const text = await response.text();
                const data = text ? JSON.parse(text) : []; // If no text, default to an empty array

                if (!response.ok){
                    throw new Error(data?.error || "Failed to load orders.");
                }
                
                setOrders(data);
            } catch (err: any) {
                console.error("Failed to fetch orders:", err);
                setError(err.message || "Failed to load today's orders.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchTodaysOrders();
    }, []);

    const getCardStyles = (status: string) => {
        switch(status) {
            case "preparing": // Yellow
                return "bg-white border-2 border-yellow-400 shadow-md";
            case "ready": // Green
                return "bg-white border-2 border-green-500 shadow-md";
            case "completed":
            case "refunded": // Grayed out bg
                return "bg-gray-100 text-gray-500 opacity-60 border border-gray-300";
            default: //'sent' or 'open', standard white card
                return "bg-white border border-gray-200 shadow";
        }
    }

    const handleUpdateStatus = async(orderId: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id == orderId ? { ...order, status: newStatus } : order
            )
        );

        await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
            credentials: "include"
        });
    }

    const statusPriority: Record<string, number> = {
        ready: 1,
        preparing: 2,
        sent: 3,
        completed: 4,
        refunded: 4
    };

    const sortedOrders = [...orders].sort((a, b) => {
        // If somehow, an order's status is missing or misspelled, give it the lowest ranking
        const priorityA = statusPriority[a.status] || 99;
        const priorityB = statusPriority[b.status] || 99;

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
                
                {sortedOrders.map((order) => {
                    const cardStyle = getCardStyles(order.status);
                    
                    return (
                        <div key={order.orderNumber} className={`p-4 rounded-lg flex flex-col gap-3 transition-colors duration-300 ${cardStyle}`}>
                            
                            <div className="flex justify-between items-center border-b pb-2 border-gray-200">
                                <h2 className="text-xl font-bold">Order #{order.orderNumber}</h2>
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold">{order.customerName}</span>
                                    <span className="text-xs uppercase tracking-wide font-bold opacity-70">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex-1 mt-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex flex-col text-sm py-1.5 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <span className="font-bold mr-2">{item.quantity}x</span> 
                                            {item.itemName}
                                        </div>
                                        
                                        {item.modifiers && (
                                            <div className="text-xs text-gray-500 ml-6 flex flex-col mt-0.5">
                                                <div className="flex gap-3">
                                                    {item.modifiers.size && <span className="capitalize">Size: {item.modifiers.size}</span>}
                                                    {item.modifiers.milk && <span className="capitalize">Milk: {item.modifiers.milk}</span>}
                                                </div>
                                                {item.modifiers.note && (
                                                    <span className="italic mt-0.5 text-gray-400">Note: "{item.modifiers.note}"</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {order.status !== "completed" && order.status !== "refunded" && (
                                <div className="mt-2 pt-3 border-t border-gray-200 flex gap-2">
                                    
                                    {order.status === "sent" && (
                                        <button 
                                            onClick={() => handleUpdateStatus(order.id!, "preparing")}
                                            className="w-full bg-yellow-400 text-yellow-900 font-bold py-2 rounded hover:bg-yellow-500 transition"
                                        >
                                            Start Preparing
                                        </button>
                                    )}

                                    {order.status === "preparing" && (
                                        <button 
                                            onClick={() => handleUpdateStatus(order.id!, "ready")}
                                            className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition"
                                        >
                                            Mark Ready
                                        </button>
                                    )}

                                    {order.status === "ready" && (
                                        <button 
                                            onClick={() => handleUpdateStatus(order.id!, "completed")}
                                            className="w-full bg-coffee-800 text-white font-bold py-2 rounded hover:bg-coffee-900 transition"
                                        >
                                            Complete Order
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OrderQueue;