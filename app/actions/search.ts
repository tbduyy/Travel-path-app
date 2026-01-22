'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type SearchParams = {
    destination?: string
    dates?: string
    people?: string
    budget?: string
    style?: string
}

export async function searchPlaces(params: SearchParams) {
    try {
        const filters: any = {}

        if (params.destination && params.destination.trim() !== '') {
            // Simple case-insensitive contains search for now
            filters.OR = [
                { name: { contains: params.destination, mode: 'insensitive' } },
                { description: { contains: params.destination, mode: 'insensitive' } },
                { address: { contains: params.destination, mode: 'insensitive' } },
            ]
        }

        // Note: Other filters (dates, people, budget) are complex to implement strictly without structured data.
        // For this MVP step, we rely mainly on keyword search or simple mocks for the other fields 
        // if the user types something specific.

        const places = await prisma.place.findMany({
            where: filters,
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                rating: true,
                priceLevel: true
            },
            take: 10
        })

        return { success: true, data: places }
    } catch (error) {
        console.error('Search error:', error)
        return { success: false, error: 'Internal server error' }
    }
}
