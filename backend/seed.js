/**
 * Seed script – inserts 20 products into MongoDB.
 *
 * Place at: backend/seed.js
 * Run:      node seed.js            (wipes existing products, then seeds)
 *           node seed.js --keep     (keeps existing products, only adds)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./Models/ProductModel");

// "mongo" in .env only resolves inside Docker. Outside Docker, set
// SEED_MONGO_URL=mongodb://localhost:27017/grocery-db
const MONGO_URL =
  process.env.SEED_MONGO_URL ||
  process.env.MONGO_URL ||
  "mongodb://localhost:27017/grocery-db";

const products = [
  { name: "Colgate Strong Teeth Toothpaste", category: "Personal Care", brand: "Colgate", price: 99,  mrp: 115, unit: "200 g", badge: "Best Seller", image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Colgate+Strong+Teeth+Toothpaste" },
  { name: "Closeup Red Hot Gel Toothpaste",  category: "Personal Care", brand: "Closeup", price: 85,  mrp: 95,  unit: "150 g", badge: "",            image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Closeup+Red+Hot+Gel+Toothpaste" },
  { name: "Godrej No.1 Soap (Pack of 4)",    category: "Personal Care", brand: "Godrej",  price: 120, mrp: 140, unit: "4 x 100 g", badge: "Offer",   image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Godrej+No.1+Soap" },
  { name: "Margo Neem Soap (Pack of 3)",     category: "Personal Care", brand: "Margo",   price: 110, mrp: 125, unit: "3 x 100 g", badge: "",        image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Margo+Neem+Soap" },
  { name: "Dettol Original Handwash",        category: "Personal Care", brand: "Dettol",  price: 79,  mrp: 99,  unit: "200 ml", badge: "Offer",      image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Dettol+Original+Handwash" },
  { name: "Harpic Power Plus Toilet Cleaner",category: "Household",     brand: "Harpic",  price: 189, mrp: 210, unit: "1 L",   badge: "",            image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Harpic+Power+Plus+Toilet+Cleaner" },
  { name: "Good Knight Gold Flash Refill",   category: "Household",     brand: "Good Knight", price: 75, mrp: 85, unit: "45 ml", badge: "Best Seller", image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Good+Knight+Gold+Flash+Refill" },
  { name: "Vim Dishwash Liquid",             category: "Household",     brand: "Vim",     price: 105, mrp: 120, unit: "500 ml", badge: "",           image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Vim+Dishwash+Liquid" },
  { name: "Surf Excel Easy Wash",            category: "Household",     brand: "Surf Excel", price: 130, mrp: 150, unit: "1 kg", badge: "Offer",    image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Surf+Excel+Easy+Wash" },
  { name: "Lay's Spanish Tomato Tango",      category: "Snacks",        brand: "Lay's",   price: 40,  mrp: 40,  unit: "90 g",  badge: "New",         image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Lay%27s+Spanish+Tomato+Tango" },
  { name: "Parle-G Biscuits",                category: "Snacks",        brand: "Parle",   price: 70,  mrp: 80,  unit: "800 g", badge: "Best Seller", image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Parle-G+Biscuits" },
  { name: "Haldiram's Aloo Bhujia",          category: "Snacks",        brand: "Haldiram's", price: 120, mrp: 135, unit: "400 g", badge: "",        image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Haldiram%27s+Aloo+Bhujia" },
  { name: "Aashirvaad Whole Wheat Atta",     category: "Staples",       brand: "Aashirvaad", price: 285, mrp: 310, unit: "5 kg", badge: "Best Seller", image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Aashirvaad+Whole+Wheat+Atta" },
  { name: "Tata Salt",                       category: "Staples",       brand: "Tata",    price: 28,  mrp: 30,  unit: "1 kg",  badge: "",            image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Tata+Salt" },
  { name: "Fortune Sunflower Oil",           category: "Staples",       brand: "Fortune", price: 165, mrp: 185, unit: "1 L",   badge: "Offer",       image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Fortune+Sunflower+Oil" },
  { name: "India Gate Basmati Rice",         category: "Staples",       brand: "India Gate", price: 640, mrp: 720, unit: "5 kg", badge: "Offer",     image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=India+Gate+Basmati+Rice" },
  { name: "Tata Sampann Toor Dal",           category: "Staples",       brand: "Tata",    price: 175, mrp: 195, unit: "1 kg",  badge: "",            image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Tata+Sampann+Toor+Dal" },
  { name: "Everest Garam Masala",            category: "Spices",        brand: "Everest", price: 85,  mrp: 95,  unit: "100 g", badge: "",            image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Everest+Garam+Masala" },
  { name: "Tata Tea Gold",                   category: "Beverages",     brand: "Tata",    price: 310, mrp: 340, unit: "500 g", badge: "New",         image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Tata+Tea+Gold" },
  { name: "Amul Butter",                     category: "Dairy",         brand: "Amul",    price: 285, mrp: 295, unit: "500 g", badge: "",            image: "https://placehold.co/400x400/e8f5e9/2e7d32/png?text=Amul+Butter" },
];

(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to ${MONGO_URL}`);

    if (!process.argv.includes("--keep")) {
      const { deletedCount } = await Product.deleteMany({});
      console.log(`Removed ${deletedCount} existing products`);
    }

    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
