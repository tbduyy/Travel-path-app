import { extraDaLatPlaces, extraDaLatHotels } from "../app/data/daLatData";

const debugAllPlaces = () => {
    // Mimic the load script perfectly
    let activeExtraPlaces = [...extraDaLatPlaces, ...extraDaLatHotels];
    let fetchedPlaces = [...activeExtraPlaces];

    // Deduplicate
    const uniqueMap = new Map();
    fetchedPlaces.forEach((p) => uniqueMap.set(p.id, p));
    const allPlaces = Array.from(uniqueMap.values());

    // Config Extraction
    let activeExtraPlacesConfig = [...extraDaLatPlaces, ...extraDaLatHotels];
    const extraPlaceIds = activeExtraPlacesConfig.map((e) => e.id);

    // The filter
    const availablePlaces = allPlaces; // assume placeIds is empty
    const availableAttractions = availablePlaces.filter(
        (p) => p.type?.toUpperCase() === "ATTRACTION" && extraPlaceIds.includes(p.id),
    );

    console.log("AllPlaces length:", allPlaces.length);
    console.log("ExtraPlaceIds length:", extraPlaceIds.length);
    console.log("AvailableAttractions length:", availableAttractions.length);

    // Why is availableAttractions 0? Let's look at the first attraction
    const firstAttraction = allPlaces.find(p => p.id === "dl-langhoavanthanh");
    console.log("First attraction found:", !!firstAttraction);
    if (firstAttraction) {
        console.log(" - id in extraPlaceIds:", extraPlaceIds.includes(firstAttraction.id));
        console.log(" - type:", firstAttraction.type);
        console.log(" - type check:", firstAttraction.type?.toUpperCase() === "ATTRACTION");
    }
}

debugAllPlaces();
