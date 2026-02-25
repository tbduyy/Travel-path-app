import { extraDaLatPlaces } from "../app/data/daLatData";

const destination = "Đà Lạt";

// Simulate loadData
let activeExtraPlaces: any[] = [];
const normDest = (destination || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
if (normDest.includes("nha trang") || normDest.includes("nhatrang")) {
    activeExtraPlaces = []; // pretend empty extraPlaces
} else if (normDest.includes("da lat") || normDest.includes("dalat")) {
    activeExtraPlaces = extraDaLatPlaces;
}

const fetchedPlaces = [...activeExtraPlaces]; // plus db places, omitting for test

const uniqueMap = new Map();
fetchedPlaces.forEach((p) => uniqueMap.set(p.id, p));
const allPlaces = Array.from(uniqueMap.values());

// Simulate render
const availablePlaces = allPlaces;

let activeExtraPlacesConfig: any[] = [];
const normDest2 = (destination || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
if (normDest2.includes("nha trang") || normDest2.includes("nhatrang")) {
    activeExtraPlacesConfig = [];
} else if (normDest2.includes("da lat") || normDest2.includes("dalat")) {
    activeExtraPlacesConfig = extraDaLatPlaces;
}

const extraPlaceIds = activeExtraPlacesConfig.map((e) => e.id);

const availableAttractions = availablePlaces.filter(
    (p) => p.type === "ATTRACTION" && extraPlaceIds.includes(p.id),
);
const availableRestaurants = availablePlaces.filter(
    (p) => p.type === "RESTAURANT" && extraPlaceIds.includes(p.id),
);

console.log("Attractions:", availableAttractions.length);
console.log("Restaurants:", availableRestaurants.length);
console.log("NormDest:", normDest);
