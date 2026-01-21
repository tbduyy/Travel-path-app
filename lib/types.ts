export interface Place {
  id: string
  name: string
  description: string
  type: string
  rating: number
  address: string | null
  image: string | null
  priceLevel: number
  lat: number | null
  lng: number | null
}

export interface Trip {
  id: string
  destination: string
  startDate: Date
  endDate: Date
  budget: string | null
  style: string | null
}
