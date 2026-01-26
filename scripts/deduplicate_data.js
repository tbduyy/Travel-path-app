const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'mock_destinations.json');

function cleanData() {
    if (!fs.existsSync(DATA_PATH)) {
        console.error("Data file not found at:", DATA_PATH);
        return;
    }

    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    let cities = JSON.parse(rawData);

    cities = cities.map(city => {
        // Clean attractions
        city.attractions = deduplicateList(city.attractions);
        // Clean hotels
        city.hotels = deduplicateList(city.hotels);
        return city;
    });

    fs.writeFileSync(DATA_PATH, JSON.stringify(cities, null, 2), 'utf-8');
    console.log("Successfully cleaned mock data!");
}

function deduplicateList(items) {
    if (!items) return [];

    // Sort by ID length ascending, so "shorter" (cleaner) IDs come first found
    // This helps if we just want to look at "base" names.
    // However, simplest way effectively is to check if a "cleaner" version exists.
    
    // We keep an item IF:
    // It does NOT have a "cleaner" version in the list.
    
    return items.filter(item => {
        const id = item.id;
        
        // Potential "clean" parents
        // Try stripping (1), (2), _1, _2, etc.
        const patterns = [
            /\(\d+\)$/, // matches (1)
            /_\d+$/,    // matches _1
            / \d+$/,    // matches 1
            /-\d+$/,    // matches -1
            /^\d+\.\d+(\.|_)?/, // matches prefix like "1.1." or "1.1_"
        ];
        
        let cleanedId = id;
        for (let pattern of patterns) {
            cleanedId = cleanedId.replace(pattern, '').trim();
        }
        // Also remove possible trailing underscores or dots left over
        cleanedId = cleanedId.replace(/[._]+$/, '');

        // If this item IS the clean version, we keep it (unless we already have it).
        // If this item is a variant (id != cleanedId), we check if the clean version exists.
        
        if (id !== cleanedId) {
             const parentExists = items.some(other => other.id === cleanedId);
             if (parentExists) return false;
             
             // If parent doesn't exist, we might want to RENAME this one to be the clean one?
             // Or maybe another variant exists like "name_" vs "name_1".
             // Let's check if any OTHER item essentially maps to the same cleanedId and is "shorter" or "better"?
             // For safety, let's just keep strict parent check for now.
             
             // EXCEPT: The user specifically pointed out cases like "name." vs "name". 
            // If "name." exists, and "name" exists, remove "name."
        }
        
        // Check for trailing punctuation duplicates explicitly
        // If I am "foo_" and "foo" exists, drop me.
        if (/[._]$/.test(id)) {
            const base = id.replace(/[._]+$/, '');
            if (items.some(other => other.id === base)) return false;
        }

        return true;
    });
}

cleanData();
