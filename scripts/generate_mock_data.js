const fs = require('fs');
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, '..', 'backend_ai', 'Travel-path-api', 'assets');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images', 'destinations');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'mock_destinations.json');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Function to copy file
function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
}

// Function to normalize string for filename/id
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '_');
}

const mockData = [];

// Read Cities
try {
  const cities = fs.readdirSync(ASSETS_DIR).filter(file => fs.statSync(path.join(ASSETS_DIR, file)).isDirectory());

  cities.forEach(city => {
    const cityDir = path.join(ASSETS_DIR, city);
    const cityId = normalize(city);
    const cityPublicDir = path.join(PUBLIC_DIR, cityId);
    
    // Create city directory in public
    if (!fs.existsSync(cityPublicDir)) {
      fs.mkdirSync(cityPublicDir, { recursive: true });
    }

    const cityData = {
      id: cityId,
      name: city,
      attractions: [],
      hotels: []
    };

    // Read City contents (Attractions / Hotels)
    const subDirs = fs.readdirSync(cityDir);
    
    subDirs.forEach(subDir => {
      const subDirPath = path.join(cityDir, subDir);
      if (!fs.statSync(subDirPath).isDirectory()) return;

      const subDirNormalized = normalize(subDir);
      const isHotel = subDirNormalized.includes('khach_san');
      const category = isHotel ? 'hotels' : 'attractions';

      const items = fs.readdirSync(subDirPath); // These might be files or folders depending on structure
      
      // Check if items are images directly or folders (User said: "trong mỗi folder đó sẽ có 2 folder là địa điểm tham quan và khách sạn để làm để cho 2 ảnh tui gửi")
      // Assuming inside "KHÁCH SẠN" there are images directly like "Hotel A.jpg" OR folders "Hotel A/image.jpg"
      // Let's assume images directly based on "đọc tên ảnh rồi thêm thông tin".
      
      items.forEach(item => {
        const itemPath = path.join(subDirPath, item);
        if (fs.statSync(itemPath).isFile()) {
           // It's an image file
           const ext = path.extname(item);
           if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase())) return;

           const itemName = path.basename(item, ext);
           const itemId = normalize(itemName);
           const publicImagePath = path.join(cityPublicDir, category, `${itemId}${ext}`);
           const publicImageDir = path.join(cityPublicDir, category);

            // Create category directory
           if (!fs.existsSync(publicImageDir)) {
             fs.mkdirSync(publicImageDir, { recursive: true });
           }
           
           copyFile(itemPath, publicImagePath);

           const itemData = {
             id: itemId,
             name: itemName,
             image: `/images/destinations/${cityId}/${category}/${itemId}${ext}`,
             description: `Trải nghiệm tuyệt vời tại ${itemName}`,
             price: isHotel ? 1000000 + Math.floor(Math.random() * 2000000) : 50000 + Math.floor(Math.random() * 100000), // Random price
             rating: 4 + Math.random(),
             type: isHotel ? 'Hotel' : 'Attraction'
           };

           cityData[category].push(itemData);
        } else {
            // It's a folder (maybe more complex structure) - handling just in case
            // If it is a folder, look for images inside
            const innerFiles = fs.readdirSync(itemPath);
            const imageFile = innerFiles.find(f => ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase()));
            
            if (imageFile) {
                const itemName = item; // Folder name is item name
                const itemId = normalize(itemName);
                const ext = path.extname(imageFile);
                const publicImagePath = path.join(cityPublicDir, category, `${itemId}${ext}`);
                const publicImageDir = path.join(cityPublicDir, category);
                
                if (!fs.existsSync(publicImageDir)) fs.mkdirSync(publicImageDir, { recursive: true });
                copyFile(path.join(itemPath, imageFile), publicImagePath);

                const itemData = {
                    id: itemId,
                    name: itemName,
                    image: `/images/destinations/${cityId}/${category}/${itemId}${ext}`,
                    description: `Khám phá ${itemName}`,
                    price: isHotel ? 1200000 : 100000,
                    rating: 4.5,
                    type: isHotel ? 'Hotel' : 'Attraction'
                };
                cityData[category].push(itemData);
            }
        }
      });
    });

    if (cityData.attractions.length > 0 || cityData.hotels.length > 0) {
        mockData.push(cityData);
    }
  });

  // Ensure output dir exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mockData, null, 2));
  console.log(`Successfully generated data for ${mockData.length} cities at ${OUTPUT_FILE}`);

} catch (err) {
  console.error("Error generating data:", err);
}
