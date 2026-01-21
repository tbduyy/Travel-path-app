"use client";

import { Plus, Check } from "lucide-react";
import { addToTrip } from "@/lib/actions";
import { useState } from "react";

export default function AddToTripButton({ placeId }: { placeId: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleAdd = async () => {
        setStatus("loading");
        const result = await addToTrip(placeId);
        if (result.success) {
            setStatus("success");
            // Reset after 2 seconds
            setTimeout(() => setStatus("idle"), 2000);
        } else {
            setStatus("idle");
            alert(result.message);
        }
    };

    if (status === "success") {
        return (
            <button className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full transition-colors cursor-default">
                <Check className="w-3 h-3" /> Added
            </button>
        );
    }

    return (
        <button
            onClick={handleAdd}
            disabled={status === "loading"}
            className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-2 rounded-full hover:bg-primary-light transition-colors disabled:opacity-70"
        >
            <Plus className="w-3 h-3" /> {status === "loading" ? "..." : "Add to Trip"}
        </button>
    );
}
