import { Metadata } from "next";
import Header from "@/components/layout/Header";
import type { Place } from "@prisma/client";
import PaymentClient from "@/components/payment/PaymentClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Thanh toán",
};

async function getNhaTrangItinerary() {
  // Fetch places for Nha Trang from prisma and group into a simple itinerary
  const places = await prisma.place.findMany({
    where: { city: "Nha Trang" },
    orderBy: { name: "asc" },
    take: 12,
  });

  // Split into three periods roughly
  const chunkSize = Math.ceil(places.length / 3) || 1;
  const chunks: Place[][] = [];
  for (let i = 0; i < places.length; i += chunkSize) {
    chunks.push(places.slice(i, i + chunkSize));
  }

  const periods = ["Buổi sáng", "Buổi trưa", "Buổi tối"];

  return periods.map((p, idx) => ({
    period: p,
    icon: idx === 0 ? "sun" : idx === 1 ? "cloud" : "moon",
    activities: (chunks[idx] || []).map((pl: Place) => {
      const meta = pl.metadata as unknown as { distance?: string } | null;
      return {
        time: undefined,
        title: pl.name,
        description: pl.description,
        image: pl.image || null,
        distance: meta?.distance || null,
        price: pl.price || null,
        type: pl.type || null,
      };
    }),
  }));
}

export default async function Page() {
  const itineraryData = await getNhaTrangItinerary();

  return (
    <>
      <Header />
      <PaymentClient itineraryData={itineraryData} />
    </>
  );
}
