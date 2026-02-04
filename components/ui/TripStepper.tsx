"use client";

import { useTripStore, type PlanStep } from "@/lib/store/trip-store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StepConfig {
  key: PlanStep;
  label: string;
  path: string;
  icon: string;
}

const STEPS: StepConfig[] = [
  { key: "places", label: "Địa điểm", path: "/plan-trip/places", icon: "📍" },
  { key: "hotels", label: "Khách sạn", path: "/plan-trip/hotels", icon: "🏨" },
  { key: "trips", label: "Lịch trình", path: "/plan-trip/trips", icon: "📅" },
  { key: "demo", label: "Xem trước", path: "/plan-trip/demo", icon: "👀" },
  { key: "payment", label: "Thanh toán", path: "/payment", icon: "💳" },
];

export default function TripStepper() {
  const { currentStep, completedSteps, canAccessStep } = useTripStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-[#1B4D3E]/10 py-3 px-4 mt-4 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((step) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-400">
                  <span className="text-lg">{step.icon}</span>
                  <span className="hidden sm:inline text-sm font-semibold">
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b border-[#1B4D3E]/10 py-3 px-4 mt-4 sticky top-16 z-40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.key);
            const isCurrent = step.key === currentStep;
            const isActive = pathname.includes(
              step.path.replace("/payment", ""),
            );
            const canAccess = canAccessStep(step.key) || isCompleted;

            return (
              <div key={step.key} className="flex items-center flex-1">
                {/* Step Circle */}
                {canAccess ? (
                  <Link
                    href={step.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${isActive || isCurrent
                      ? "bg-[#153a2f] text-white shadow-lg"
                      : isCompleted
                        ? "bg-[#2E968C]/40 text-[#0d2622] hover:bg-[#2E968C]/50"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="hidden sm:inline text-sm font-semibold">
                      {step.label}
                    </span>
                    {isCompleted && !isCurrent && (
                      <span className="text-green-600 text-sm">✓</span>
                    )}
                  </Link>
                ) : (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 text-gray-500 cursor-not-allowed opacity-70 font-medium"
                    title="Hoàn thành bước trước để mở khóa"
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="hidden sm:inline text-sm font-semibold">
                      {step.label}
                    </span>
                  </div>
                )}

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1.5 mx-2 rounded-full transition-colors ${isCompleted ? "bg-[#1B7d73]" : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Text */}
        <div className="text-center mt-2 text-xs font-semibold text-[#1B4D3E]">
          Bước {STEPS.findIndex((s) => s.key === currentStep) + 1} /{" "}
          {STEPS.length}
          {completedSteps.length > 0 && (
            <span className="ml-2 text-[#1B4D3E] font-bold">
              ({completedSteps.length} đã hoàn thành)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
