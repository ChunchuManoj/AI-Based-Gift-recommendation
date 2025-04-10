import type { Gift } from "@/types/gift";

// Direct API implementation for Gemini 2.0-flash
export async function generateGiftRecommendations(
  surveyData: any
): Promise<Gift[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are a gift recommendation expert. Based on the following information about a gift recipient,
generate 8 personalized gift recommendations. Provide simple text recommendations without any introductory text.

Recipient details:
- Age: ${surveyData.age}
- Gender: ${surveyData.gender}
- Relationship: ${surveyData.relationship}
- Occasion: ${surveyData.occasion}
- Interests: ${surveyData.interests.join(", ")}
- Personality traits: ${surveyData.personality.join(", ")}
- Budget: $${surveyData.budget[0]}
- Additional Info: ${surveyData.additionalInfo || "None"}

For each gift, provide:
1. Gift name (short and concise)
2. Brief description (1-2 sentences)
3. Approximate price (within budget)
4. Category (one of: Books, Technology, Sports, Art, Music, Travel, Cooking, Fashion, Home Decor, Gaming, Experiences)
5. Why it's a good match for this person (1 sentence)

Format each gift as a simple list item without numbering or introductory text.
`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(
        `Gemini API error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();

    // Extract the text from the response
    let text = "";
    if (data.candidates && data.candidates[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.text) {
          text += part.text;
        }
      }
    }

    if (!text) {
      throw new Error("No text generated from Gemini API");
    }

    // Parse the text response into structured gift objects
    const gifts = parseTextToGifts(text, surveyData);
    return gifts;
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw error;
  }
}

// Helper function to parse text response into gift objects
function parseTextToGifts(text: string, surveyData: any): Gift[] {
  const gifts: Gift[] = [];

  // Remove any introductory text and split by double newlines or other patterns
  const cleanedText = text
    .replace(/^(here are|here's|these are).+?:/i, "")
    .trim();

  // Split by gift items - look for patterns that might separate gifts
  const giftTexts = cleanedText
    .split(/\n\s*\n|\*\*|\d+\./)
    .filter((item) => item.trim().length > 0);

  giftTexts.forEach((giftText, index) => {
    const lines = giftText.split("\n").filter((line) => line.trim().length > 0);

    if (lines.length > 0) {
      // Extract gift information from text
      const name = lines[0].replace(/^\s*[-*•]\s*/, "").trim();
      const description =
        lines.length > 1 ? lines[1].trim() : "A thoughtful gift option.";

      // Try to extract price from the text
      let price = 0;
      const priceMatch = giftText.match(/\$(\d+(\.\d+)?)/);
      if (priceMatch) {
        price = Number.parseFloat(priceMatch[1]);
      } else {
        // Default price based on budget
        price =
          Math.floor(Math.random() * (surveyData.budget[0] * 0.8)) +
          surveyData.budget[0] * 0.2;
      }

      // Extract or assign category
      let category = "Gift";
      const categoryPatterns = [
        /category:\s*([A-Za-z\s&]+)/i,
        /type:\s*([A-Za-z\s&]+)/i,
        /\b(Books|Technology|Sports|Art|Music|Travel|Cooking|Fashion|Home Decor|Gaming|Experiences)\b/i,
      ];

      for (const pattern of categoryPatterns) {
        const match = giftText.match(pattern);
        if (match) {
          category = match[1].trim();
          break;
        }
      }

      if (
        category === "Gift" &&
        surveyData.interests &&
        surveyData.interests.length > 0
      ) {
        category =
          surveyData.interests[
            Math.floor(Math.random() * surveyData.interests.length)
          ];
      }

      // Extract reason from the text or create a default one
      let reason =
        "This gift matches the recipient's interests and preferences.";
      if (
        giftText.toLowerCase().includes("because") ||
        giftText.toLowerCase().includes("perfect for") ||
        giftText.toLowerCase().includes("great for") ||
        giftText.toLowerCase().includes("ideal for") ||
        giftText.toLowerCase().includes("reason:")
      ) {
        const reasonPatterns = [
          /because\s+(.+?)(?=\n|$)/i,
          /perfect for\s+(.+?)(?=\n|$)/i,
          /great for\s+(.+?)(?=\n|$)/i,
          /ideal for\s+(.+?)(?=\n|$)/i,
          /reason:\s+(.+?)(?=\n|$)/i,
        ];

        for (const pattern of reasonPatterns) {
          const match = giftText.match(pattern);
          if (match) {
            reason = match[1].trim();
            break;
          }
        }
      }

      // Generate image URL based on gift name and category
      const imageUrl = getGiftImageUrl(name, category);

      // Create a gift object
      const gift: Gift = {
        id: `gift-${index + 1}`,
        name,
        description,
        price,
        image: imageUrl,
        category,
        tags: extractTags(giftText, surveyData),
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 100) + 20,
        url: `/gift/gift-${index + 1}`,
        reason,
      };

      gifts.push(gift);
    }
  });

  // If parsing failed or returned no gifts, return an empty array
  return gifts.length > 0 ? gifts : [];
}

// Function to extract tags from gift text and survey data
function extractTags(giftText: string, surveyData: any): string[] {
  const tags: string[] = [];

  // Add interests as tags
  if (surveyData.interests && Array.isArray(surveyData.interests)) {
    tags.push(...surveyData.interests.slice(0, 3));
  }

  // Add personality traits as tags
  if (surveyData.personality && Array.isArray(surveyData.personality)) {
    tags.push(...surveyData.personality.slice(0, 2));
  }

  // Add occasion as a tag
  if (surveyData.occasion) {
    tags.push(surveyData.occasion);
  }

  // Add additional keywords from the gift text
  const keywords = [
    "Premium",
    "Luxury",
    "Handmade",
    "Personalized",
    "Custom",
    "Unique",
    "Bestselling",
    "Popular",
    "Trending",
    "Classic",
    "Modern",
    "Vintage",
    "Eco-friendly",
    "Sustainable",
    "Practical",
    "Fun",
    "Educational",
    "Traditional",
    "Elegant",
    "Stylish",
    "Innovative",
    "Authentic",
    "Artisanal",
    "Exclusive",
    "Limited Edition",
    "Handcrafted",
    "Organic",
    "Smart",
    "Portable",
    "Durable",
  ];

  for (const keyword of keywords) {
    if (giftText.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(keyword);
    }
  }

  // Remove duplicates and limit to 5 tags
  return [...new Set(tags)].slice(0, 5);
}

// Function to get gift image URL based on name and category
function getGiftImageUrl(name: string, category: string): string {
  // Map of categories to image URLs
  const categoryImages: Record<string, string[]> = {
    Books: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800",
    ],
    Technology: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
    ],
    Sports: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800",
    ],
    Art: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800",
    ],
    Music: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800",
    ],
    Travel: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
    ],
    Cooking: [
      "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=800",
      "https://images.unsplash.com/photo-1607877361964-d5c3c2e0ff8a?q=80&w=800",
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800",
    ],
    Fashion: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800",
    ],
    "Home Decor": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
    ],
    Gaming: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800",
      "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?q=80&w=800",
    ],
    Experiences: [
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800",
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?q=80&w=800",
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=800",
    ],
  };

  // Normalize category name
  const normalizedCategory = category.trim().toLowerCase();

  // Find the matching category
  const matchingCategory = Object.keys(categoryImages).find(
    (cat) => cat.toLowerCase() === normalizedCategory
  );

  // Get the images for the matched category or use a default set
  const images = matchingCategory
    ? categoryImages[matchingCategory]
    : [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
      ];

  // Create a more unique hash using name and category
  let hash = 0;
  const combinedString = `${name}-${category}-${Date.now()}`;
  for (let i = 0; i < combinedString.length; i++) {
    hash = (hash << 5) - hash + combinedString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the absolute value of the hash to get a positive index
  const index = Math.abs(hash) % images.length;
  return images[index];
}
