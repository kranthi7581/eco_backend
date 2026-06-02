const { products } = require("./models/relations");
const { connectDB } = require("./config/db");

const productsData = [
  // Electronics -> Mobiles (subcategoryId: 3, categoryId: 1)
  {
    name: "iPhone 15 Pro Max",
    description: "Experience the ultimate iPhone with titanium design, A17 Pro chip, customizable Action button, and the most powerful iPhone camera system.",
    price: 139900,
    quantity: 50,
    image: "/uploads/iphone15.jpg",
    status: "active",
    slug: "iphone-15-pro-max",
    categoryId: 1,
    subcategoryId: 3
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
    price: 129999,
    quantity: 45,
    image: "/uploads/s24ultra.jpg",
    status: "active",
    slug: "samsung-galaxy-s24-ultra",
    categoryId: 1,
    subcategoryId: 3
  },
  {
    name: "OnePlus 12",
    description: "Redefined flagship specs featuring Snapdragon 8 Gen 3, 16GB RAM, 4th Gen Hasselblad Camera System, and 100W SUPERVOOC charging.",
    price: 64999,
    quantity: 30,
    image: "/uploads/oneplus12.jpg",
    status: "active",
    slug: "oneplus-12",
    categoryId: 1,
    subcategoryId: 3
  },
  {
    name: "Google Pixel 8 Pro",
    description: "The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera yet, and can even help you filter calls.",
    price: 99999,
    quantity: 25,
    image: "/uploads/pixel8pro.jpg",
    status: "active",
    slug: "google-pixel-8-pro",
    categoryId: 1,
    subcategoryId: 3
  },

  // Electronics -> Laptops (subcategoryId: 4, categoryId: 1)
  {
    name: "MacBook Pro M3",
    description: "The 14-inch MacBook Pro blasts forward with M3, an incredibly advanced chip that brings serious speed and capability for everyday workflows.",
    price: 169900,
    quantity: 20,
    image: "/uploads/macbookm3.jpg",
    status: "active",
    slug: "macbook-pro-m3",
    categoryId: 1,
    subcategoryId: 4
  },
  {
    name: "Dell XPS 15",
    description: "A perfect balance of power and portability, featuring a stunning 15.6-inch InfinityEdge display, Intel Core i7, and NVIDIA GeForce RTX graphics.",
    price: 189990,
    quantity: 15,
    image: "/uploads/dellxps.jpg",
    status: "active",
    slug: "dell-xps-15",
    categoryId: 1,
    subcategoryId: 4
  },
  {
    name: "ASUS ROG Zephyrus G14",
    description: "The world's most powerful 14-inch gaming laptop, featuring AMD Ryzen 9, NVIDIA RTX 4060, and a beautiful 120Hz AniMe Matrix display.",
    price: 149990,
    quantity: 10,
    image: "/uploads/rog14.jpg",
    status: "active",
    slug: "asus-rog-zephyrus-g14",
    categoryId: 1,
    subcategoryId: 4
  },
  {
    name: "HP Spectre x360",
    description: "Premium convertible 2-in-1 laptop with stunning design, Intel Evo Platform, 16GB RAM, OLED touch display, and active stylus pen included.",
    price: 134990,
    quantity: 12,
    image: "/uploads/hpspectre.jpg",
    status: "active",
    slug: "hp-spectre-x360",
    categoryId: 1,
    subcategoryId: 4
  },

  // Fashion -> Men Clothing (subcategoryId: 5, categoryId: 2)
  {
    name: "Slim Fit Denim Jacket",
    description: "A classic denim jacket tailored for a slim fit. Made from durable cotton denim with chest flap pockets and welt side pockets.",
    price: 2999,
    quantity: 100,
    image: "/uploads/denim_jacket.jpg",
    status: "active",
    slug: "slim-fit-denim-jacket",
    categoryId: 2,
    subcategoryId: 5
  },
  {
    name: "Premium Cotton Polo Shirt",
    description: "Woven from extra-soft premium long-staple cotton, this polo shirt features classic collars, rib-knit cuffs, and comfortable breathability.",
    price: 1499,
    quantity: 150,
    image: "/uploads/polo_shirt.jpg",
    status: "active",
    slug: "premium-cotton-polo-shirt",
    categoryId: 2,
    subcategoryId: 5
  },
  {
    name: "Men's Casual Chino Pants",
    description: "Flat-front casual chino pants crafted from stretch cotton twill for all-day comfort. Features side slant pockets and button-through back pockets.",
    price: 1999,
    quantity: 120,
    image: "/uploads/chinos.jpg",
    status: "active",
    slug: "mens-casual-chino-pants",
    categoryId: 2,
    subcategoryId: 5
  },
  {
    name: "Classic Leather Bomber Jacket",
    description: "Made from genuine soft lambskin leather, this classic bomber jacket features a front zip closure, ribbed cuffs/hem, and polyester lining.",
    price: 5999,
    quantity: 60,
    image: "/uploads/bomber_jacket.jpg",
    status: "active",
    slug: "classic-leather-bomber-jacket",
    categoryId: 2,
    subcategoryId: 5
  },

  // Fashion -> Women Clothing (subcategoryId: 6, categoryId: 2)
  {
    name: "Floral Summer Maxi Dress",
    description: "Beautiful floral printed maxi dress with a flattering V-neckline, adjustable spaghetti straps, and flowing tiered skirt. Perfect for beach days.",
    price: 3499,
    quantity: 80,
    image: "/uploads/maxi_dress.jpg",
    status: "active",
    slug: "floral-summer-maxi-dress",
    categoryId: 2,
    subcategoryId: 6
  },
  {
    name: "High-Rise Stretch Skinny Jeans",
    description: "Classic five-pocket skinny jeans with a flattering high-rise waist. Super stretch denim holds its shape all day long.",
    price: 2499,
    quantity: 95,
    image: "/uploads/skinny_jeans.jpg",
    status: "active",
    slug: "high-rise-stretch-skinny-jeans",
    categoryId: 2,
    subcategoryId: 6
  },
  {
    name: "Oversized Knitted Cardigan Sweater",
    description: "Soft, cozy knitted cardigan in an oversized fit. Features dropped shoulders, open-front design, and two patch pockets.",
    price: 1899,
    quantity: 110,
    image: "/uploads/cardigan.jpg",
    status: "active",
    slug: "oversized-knitted-cardigan-sweater",
    categoryId: 2,
    subcategoryId: 6
  },
  {
    name: "Classic Trench Coat",
    description: "Double-breasted classic trench coat featuring adjustable waist belt, buttoned shoulder epaulets, rain guard, and storm flap detailing.",
    price: 4999,
    quantity: 50,
    image: "/uploads/trench_coat.jpg",
    status: "active",
    slug: "classic-trench-coat",
    categoryId: 2,
    subcategoryId: 6
  },

  // Books -> Story Books (subcategoryId: 7, categoryId: 3)
  {
    name: "The Alchemist",
    description: "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    price: 399,
    quantity: 200,
    image: "/uploads/alchemist.jpg",
    status: "active",
    slug: "the-alchemist",
    categoryId: 3,
    subcategoryId: 7
  },
  {
    name: "Atomic Habits",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. James Clear offers a comprehensive framework for improving every day.",
    price: 499,
    quantity: 250,
    image: "/uploads/atomic_habits.jpg",
    status: "active",
    slug: "atomic-habits",
    categoryId: 3,
    subcategoryId: 7
  },
  {
    name: "Harry Potter and the Philosopher's Stone",
    description: "The first novel in the Harry Potter series, introducing Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.",
    price: 599,
    quantity: 150,
    image: "/uploads/harry_potter.jpg",
    status: "active",
    slug: "harry-potter-philosophers-stone",
    categoryId: 3,
    subcategoryId: 7
  },

  // Books -> Competitive Exams (subcategoryId: 8, categoryId: 3)
  {
    name: "Quantitative Aptitude for Competitive Examinations",
    description: "Dr. R.S. Aggarwal's classic guidebook has been a must-have for aspirants preparing for examinations like Bank PO, SSC, MBA, Railways, and more.",
    price: 650,
    quantity: 300,
    image: "/uploads/quant_aptitude.jpg",
    status: "active",
    slug: "quantitative-aptitude-competitive-exams",
    categoryId: 3,
    subcategoryId: 8
  },
  {
    name: "High School English Grammar and Composition",
    description: "Wren & Martin's English Grammar & Composition is one of the most popular and widely used reference books on English Grammar.",
    price: 450,
    quantity: 400,
    image: "/uploads/english_grammar.jpg",
    status: "active",
    slug: "high-school-english-grammar-composition",
    categoryId: 3,
    subcategoryId: 8
  },
  {
    name: "Verbal & Non-Verbal Reasoning",
    description: "A comprehensive guide by R.S. Aggarwal for mastering verbal and non-verbal reasoning skills required in major recruitment examinations.",
    price: 720,
    quantity: 180,
    image: "/uploads/reasoning.jpg",
    status: "active",
    slug: "verbal-non-verbal-reasoning",
    categoryId: 3,
    subcategoryId: 8
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("DB connected for seeding");

    let insertedCount = 0;
    for (const prod of productsData) {
      const [record, created] = await products.findOrCreate({
        where: { name: prod.name },
        defaults: prod
      });

      if (created) {
        insertedCount++;
        console.log(`Created product: ${record.name}`);
      } else {
        console.log(`Product already exists: ${record.name}`);
      }
    }

    console.log(`Seeding complete. Added ${insertedCount} new products.`);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    process.exit();
  }
}

seed();
