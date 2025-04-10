import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Gift } from "@/types/gift";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to create a consistent hash from a string
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Helper function to get a consistent color based on category
export function getCategoryColor(category: string): string {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-gray-100 text-gray-800",
  ];

  const hash = stringToHash(category);
  return colors[hash % colors.length];
}

// Helper function to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// Helper function to get a short description for a gift
export function getGiftDescription(gift: Gift): string {
  const descriptions: Record<string, string[]> = {
    Electronics: [
      "A cutting-edge tech gadget that combines innovation with practicality",
      "A modern electronic device designed to enhance your daily life",
      "A smart device that brings convenience and efficiency to your routine",
    ],
    Books: [
      "A captivating read that will transport you to another world",
      "An insightful book that will expand your knowledge and perspective",
      "A literary masterpiece that will stay with you long after the last page",
    ],
    Clothing: [
      "A stylish piece that combines comfort with fashion",
      "A versatile garment that can be dressed up or down",
      "A trendy item that will elevate your wardrobe",
    ],
    Jewelry: [
      "A beautiful piece that adds elegance to any outfit",
      "A timeless accessory that will be cherished for years",
      "A stunning jewelry item that makes a perfect statement piece",
    ],
    "Home & Kitchen": [
      "A practical addition to your home that combines style and function",
      "A kitchen essential that will make cooking more enjoyable",
      "A home decor item that will transform your living space",
    ],
    "Toys & Games": [
      "An engaging toy that will provide hours of entertainment",
      "A fun game that brings people together",
      "An educational toy that makes learning enjoyable",
    ],
    "Sports & Outdoors": [
      "A sports equipment that will help you stay active and healthy",
      "An outdoor gear that will enhance your adventures",
      "A fitness accessory that will support your workout routine",
    ],
    "Beauty & Personal Care": [
      "A beauty product that will enhance your natural features",
      "A personal care item that will make you feel pampered",
      "A skincare product that will help you maintain a healthy glow",
    ],
    "Food & Beverages": [
      "A delicious treat that will satisfy your taste buds",
      "A gourmet item that will elevate your dining experience",
      "A beverage that will refresh and delight",
    ],
    "Art & Crafts": [
      "A creative tool that will inspire your artistic side",
      "A craft supply that will help you bring your ideas to life",
      "An art piece that will add character to your space",
    ],
    Music: [
      "A musical instrument that will help you express your creativity",
      "A music accessory that will enhance your listening experience",
      "A sound equipment that will bring your music to life",
    ],
    "Movies & TV": [
      "A cinematic experience that will entertain and inspire",
      "A TV show that will keep you engaged for hours",
      "A movie that will take you on an unforgettable journey",
    ],
    Garden: [
      "A gardening tool that will help you create a beautiful outdoor space",
      "A plant that will add life and color to your garden",
      "A garden accessory that will make your outdoor area more enjoyable",
    ],
    "Pet Supplies": [
      "A pet accessory that will keep your furry friend happy",
      "A pet care product that will help you take better care of your pet",
      "A pet toy that will provide hours of entertainment",
    ],
    "Office Supplies": [
      "An office tool that will help you stay organized and productive",
      "A stationery item that will make your work more enjoyable",
      "An office accessory that will enhance your workspace",
    ],
    Automotive: [
      "A car accessory that will enhance your driving experience",
      "An automotive tool that will help you maintain your vehicle",
      "A car care product that will keep your vehicle looking its best",
    ],
    "Health & Wellness": [
      "A wellness product that will help you maintain a healthy lifestyle",
      "A health accessory that will support your well-being",
      "A fitness tool that will help you achieve your health goals",
    ],
    Travel: [
      "A travel accessory that will make your journey more comfortable",
      "A luggage item that will help you stay organized on the go",
      "A travel gadget that will enhance your travel experience",
    ],
    Fitness: [
      "A fitness equipment that will help you stay in shape",
      "A workout accessory that will enhance your exercise routine",
      "A sports gear that will support your fitness goals",
    ],
    Gaming: [
      "A gaming accessory that will enhance your gaming experience",
      "A video game that will provide hours of entertainment",
      "A gaming equipment that will take your gameplay to the next level",
    ],
  };

  const categoryDescriptions = descriptions[gift.category] || [
    "A thoughtful gift that will be appreciated",
    "A unique present that will make someone special",
    "A perfect gift for any occasion",
  ];

  const hash = stringToHash(gift.name);
  return categoryDescriptions[hash % categoryDescriptions.length];
}

// Helper function to get a gift image URL
export async function getGiftImageUrl(gift: Gift): Promise<string> {
  // Use the gift's image if available
  if (gift.image) {
    return gift.image;
  }

  try {
    // First try to get a specific image from Pexels
    const pexelsSearch = `${gift.name} ${gift.category}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, " ");

    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      pexelsSearch
    )}&per_page=1`;

    const pexelsResponse = await fetch(pexelsUrl, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY || "",
      },
    });

    if (pexelsResponse.ok) {
      const data = await pexelsResponse.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.medium;
      }
    }

    // If Pexels fails, try Unsplash
    const unsplashSearch = `${gift.name} ${gift.category}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, " ");

    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      unsplashSearch
    )}&per_page=1`;

    const unsplashResponse = await fetch(unsplashUrl, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || ""}`,
      },
    });

    if (unsplashResponse.ok) {
      const data = await unsplashResponse.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    }

    // If both APIs fail, use a curated set of high-quality images based on category
    const categoryMap: Record<string, string[]> = {
      Electronics: [
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
      ],
      Books: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800",
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800",
      ],
      Clothing: [
        "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800",
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800",
      ],
      Jewelry: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800",
      ],
      "Home & Kitchen": [
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=800",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
      ],
      "Toys & Games": [
        "https://images.unsplash.com/photo-1558877385-8f5f6286bbee?q=80&w=800",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800",
      ],
      "Sports & Outdoors": [
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800",
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
        "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800",
      ],
      "Beauty & Personal Care": [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
      ],
      "Food & Beverages": [
        "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=800",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800",
      ],
      "Art & Crafts": [
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800",
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800",
      ],
      Music: [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800",
      ],
      "Movies & TV": [
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800",
        "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=800",
      ],
      Garden: [
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1b735?q=80&w=800",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800",
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800",
      ],
      "Pet Supplies": [
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800",
        "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=800",
      ],
      "Office Supplies": [
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800",
        "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800",
        "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?q=80&w=800",
      ],
      Automotive: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800",
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800",
      ],
      "Health & Wellness": [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
      ],
      Travel: [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
      ],
      Fitness: [
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800",
      ],
      Gaming: [
        "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=800",
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800",
        "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800",
      ],
    };

    const categoryImages = categoryMap[gift.category] || [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
    ];

    // Use the gift name to consistently select an image
    const hash = stringToHash(gift.name);
    return categoryImages[hash % categoryImages.length];
  } catch (error) {
    console.error("Error fetching image:", error);
    // Return a generic gift image as last resort
    return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800";
  }
}
