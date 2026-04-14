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
    isGuest: boolean;
    items: items[];
    notes: string;
    orderDate: string;
    orderNumber: number;
    orderType: string;
    rewards: number;
    status: string;
    tax: number;
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

    if (isLoading) {
        return <div className="p-8 text-xl">Loading today's orders...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-coffee-300 min-h-screen">
            <h1 className="text-3xl font-bold text-coffee-900 mb-6">Today's Orders</h1>
            <pre className="bg-white p-4 rounded shadow">
                {JSON.stringify(orders, null, 2)}
            </pre>
        </div>
    )
}

export default OrderQueue;