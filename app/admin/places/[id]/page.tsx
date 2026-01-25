
import prisma from '@/lib/prisma'
import PlaceForm from '../form'
import { notFound } from 'next/navigation'

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const place = await prisma.place.findUnique({
        where: { id }
    })

    if (!place) return notFound()

    return <PlaceForm place={place} />
}
