export const MENU_EFFECTIVE_DATE = "July 1, 2026";

export interface MenuSectionItem {
  name: string;
  price?: string;
  description?: string;
  /** Availability constraint shown as a badge, e.g. "Sundays only" */
  note?: string;
}

export interface MenuSection {
  id: string;
  name: string;
  subtitle?: string;
  items: MenuSectionItem[];
}

/**
 * The full in-store / order-in menu. This is the single place to edit when
 * the menu changes seasonally — the menu page and its schema.org markup are
 * both generated from this data.
 */
export const menuSections: MenuSection[] = [
  {
    id: "lunch-plates",
    name: "Lunch Plates",
    subtitle: "11am – 3pm · 2 sides & cornbread included",
    items: [
      { name: "Baked or Fried Chicken", description: "Golden oven-roasted, or crispy buttermilk-marinated and fried", price: "$25" },
      { name: "Pork Chops", description: "Thick-cut and well-seasoned", price: "$23" },
      { name: "Turkey Chops", description: "A lean, flavorful alternative", price: "$25" },
      { name: "Brisket", description: "Tender, slow-smoked, sliced and sauced", price: "$25" },
      { name: "Catfish", description: "Crispy, Louisiana-style seasoned catfish", price: "$23" },
      { name: "Meatloaf", description: "Homestyle, rich and savory, served with gravy", price: "$20" },
      { name: "Salmon", description: "Perfectly seasoned salmon fillet", price: "$25" },
    ],
  },
  {
    id: "dinner-plates",
    name: "Dinner Plates",
    subtitle: "2 sides & cornbread included",
    items: [
      { name: "Baked or Fried Chicken", description: "Golden oven-roasted, or crispy buttermilk-marinated and fried", price: "$26" },
      { name: "Meatloaf", description: "Homestyle, rich and savory, served with gravy", price: "$23" },
      { name: "Oxtails", description: "Slow-braised, fall-off-the-bone tender", price: "$35", note: "Sundays only" },
      { name: "Pork Chops", description: "Cooked to order, thick-cut and well-seasoned", price: "$26" },
      { name: "Turkey Chops", description: "Cooked to order. A lean, flavorful alternative.", price: "$30" },
      { name: "Catfish", description: "Crispy, Louisiana-style seasoned catfish", price: "$27" },
      { name: "Brisket", description: "Tender, slow-smoked, sliced and sauced", price: "$26" },
      { name: "Short Ribs", description: "Rich, braised short ribs", price: "$30", note: "Fridays only" },
      { name: "Salmon", description: "Perfectly seasoned salmon fillet", price: "$27" },
    ],
  },
  {
    id: "a-la-carte",
    name: "A La Carte",
    subtitle: "Protein only — no sides",
    items: [
      { name: "Baked or Fried Chicken", price: "$15" },
      { name: "Meatloaf", price: "$12" },
      { name: "Oxtails", price: "$24", note: "Sundays only" },
      { name: "Pork Chop", price: "$14" },
      { name: "Turkey Chop", price: "$16" },
      { name: "Catfish", price: "$17" },
      { name: "Short Ribs", price: "$20", note: "Fridays only" },
      { name: "Brisket", price: "$18" },
    ],
  },
  {
    id: "sides",
    name: "Our Sides",
    items: [
      { name: "String Beans", description: "Fresh green beans, Southern-style", price: "$6" },
      { name: "Collard Greens", description: "Slow-cooked with smoked turkey", price: "$8" },
      { name: "Red Beans & Rice", description: "Cajun-style with smoked turkey meat", price: "$9" },
      { name: "Mac and Cheese", description: "Five-cheese blend, baked golden", price: "$9" },
      { name: "Cabbage", description: "Seasoned Southern-style cabbage", price: "$8" },
      { name: "Yams", description: "Candied yams, sweet and tender", price: "$9" },
      { name: "Mashed Potatoes", description: "Creamy, buttery mashed potatoes", price: "$6" },
      { name: "Side Salad", description: "Crisp garden salad", price: "$4" },
      { name: "Cornbread", description: "Two golden cornbread muffins", price: "$3" },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    subtitle: "By the slice",
    items: [
      { name: "Pound Cake", description: "Classic buttery pound cake", price: "$5" },
      { name: "Peach Cobbler", description: "Southern-style, warm and spiced", price: "$7" },
      { name: "Banana Pudding", description: "Layers of vanilla wafers, fresh bananas, and homemade custard", price: "$6" },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    items: [
      { name: "Soda", description: "Coke products", price: "$3" },
      { name: "Lemonade", description: "Fresh-squeezed", price: "$3.50" },
      { name: "Muddy Water", description: "House specialty beverage", price: "$4" },
      { name: "Bottled Water", description: "Acqua Panna" },
    ],
  },
];

export interface SpecialsGroup {
  name: string;
  subtitle?: string;
  items: MenuSectionItem[];
}

/**
 * Seasonal express specials — swap this block out when the season changes.
 * Revised July 2, 2026.
 */
export const seasonalSpecials = {
  title: "Express Summer Specials",
  schedule: "Wednesday – Friday · 11am – 3pm",
  season: "June – August 2026",
  note: "All specials come with one side and a canned soda.",
  groups: [
    {
      name: "Daily Plates",
      subtitle: "Available Wednesday – Friday",
      items: [
        { name: "Turkey Chop", description: "Fried or smothered", price: "$20" },
        { name: "Pork Chop", description: "Fried or smothered", price: "$20" },
        { name: "Fried Fish", price: "$20" },
      ],
    },
    {
      name: "Wednesdays",
      items: [
        { name: "Tuna Sandwich", description: "With fries & drink", price: "$15" },
        { name: "Fettuccine Alfredo or Spaghetti with Meat Sauce", price: "$16" },
        { name: "Party Wings (6)", description: "Tossed in sauce, with fries or coleslaw", price: "$12" },
        { name: "Party Wings (12)", description: "Tossed in sauce, with fries or coleslaw", price: "$16" },
        { name: "Shrimp Po'boy", description: "With fries", price: "$18" },
      ],
    },
    {
      name: "Thursdays",
      items: [
        { name: "Catfish Po'boy", price: "$18" },
        { name: "Meatloaf Lunch", price: "$15" },
        { name: "Fried or Baked Chicken", description: "Dark meat only", price: "$16" },
        { name: "Shrimp Po'boy", description: "With fries", price: "$18" },
      ],
    },
    {
      name: "Fridays",
      items: [
        { name: "Chicken Po'boy", price: "$15" },
        { name: "Catfish Po'boy", price: "$18" },
        { name: "Shrimp Po'boy", price: "$18" },
      ],
    },
  ] satisfies SpecialsGroup[],
};

export interface Dish {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  category: string;
  dietaryTags: string[];
  seoTitle: string;
  seoDescription: string;
  image?: string;
  imageAlt?: string;
}

export interface FoodPhoto {
  slug: string;
  name: string;
  webp: string;
  webp2x: string;
  jpg: string;
  full: string;
  width: number;
  height: number;
  alt: string;
}

const FOOD_PHOTO_SIZE = { width: 1024, height: 808 } as const;

export const dishes: Dish[] = [
  {
    slug: "fried-chicken",
    name: "Fried Chicken",
    description: "Golden-brown, seasoned to perfection. A classic done right.",
    longDescription: "Our fried chicken is a labor of love, marinated overnight in buttermilk and seasonings, then hand-dredged and fried to golden-brown perfection. Every piece comes out crispy on the outside, impossibly juicy on the inside. Served with your choice of two sides and cornbread. Soul food doesn't get more classic than this.",
    price: "$26",
    category: "Dinner Plates",
    dietaryTags: [],
    seoTitle: "Fried Chicken — Best Soul Food Fried Chicken in South LA | Lonell's",
    seoDescription: "Crispy, juicy fried chicken at Lonell's Soul Food in South Los Angeles. Buttermilk-marinated, hand-dredged, and fried to order. Served with two sides. Dine-in or takeout.",
    image: "/media/images/fried-chicken.webp",
    imageAlt: "Crispy fried chicken dinner with string beans, red beans and rice, and candied yams at Lonell's Soul Food",
  },
  {
    slug: "meatloaf",
    name: "Meatloaf",
    description: "Homestyle meatloaf, rich and savory, served with gravy.",
    longDescription: "Our homestyle meatloaf tastes just like Sunday dinner at grandma's house. Made from a blend of ground beef and seasonings, topped with a rich tomato-based glaze and served with savory gravy. Each slice is hearty, moist, and packed with flavor. Served with your choice of two classic Southern sides.",
    price: "$23",
    category: "Dinner Plates",
    dietaryTags: [],
    seoTitle: "Meatloaf — Homestyle Soul Food Meatloaf in South LA | Lonell's",
    seoDescription: "Homestyle meatloaf at Lonell's Soul Food in South Los Angeles. Rich, savory, served with gravy and two Southern sides. Dine-in, takeout, or delivery.",
    image: "/media/images/meatloaf.webp",
    imageAlt: "Homestyle meatloaf with savory gravy, green beans, mac and cheese, and rice at Lonell's Soul Food",
  },
  {
    slug: "pork-chops",
    name: "Pork Chop",
    description: "Cooked to order, thick-cut and well-seasoned.",
    longDescription: "Our thick-cut pork chop is cooked to order. Each chop is seasoned generously with our signature soul food blend, then pan-seared to lock in the juices. Served with your choice of two sides, these chops are consistently praised by our regulars for their tenderness and flavor.",
    price: "$26",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Pork Chop — Thick-Cut Soul Food Pork Chop in South LA | Lonell's",
    seoDescription: "Thick-cut, seasoned-to-order pork chop at Lonell's Soul Food in South Los Angeles. Pan-seared and juicy, served with two Southern sides. Dine-in, takeout, or delivery.",
    image: "/media/images/pork-chops.webp",
    imageAlt: "Golden fried pork chop dinner with collard greens, candied yams, and red beans at Lonell's Soul Food",
  },
  {
    slug: "oxtails",
    name: "Oxtail",
    description: "Slow-cooked, fall-off-the-bone tender. Available Sundays only.",
    longDescription: "Our signature oxtails are slow-braised for hours until they reach fall-off-the-bone tenderness. Seasoned with our proprietary blend of herbs and spices, then simmered in a rich, savory gravy. Available Sundays only. Don't miss them. Served with your choice of two classic Southern sides. This is the dish that put Lonell's on the map, don't visit without trying it.",
    price: "$35",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Oxtails — Best Soul Food Oxtails in South Los Angeles | Lonell's",
    seoDescription: "Try Lonell's award-winning oxtails in South LA. Slow-braised, fall-off-the-bone tender, served with two Southern sides. Available Sundays. Dine-in, takeout, or delivery.",
    image: "/media/images/oxtails.webp",
    imageAlt: "Slow-braised oxtail dinner with collard greens, candied yams, and red beans at Lonell's Soul Food",
  },
  {
    slug: "salmon",
    name: "Salmon",
    description: "Perfectly seasoned, tender salmon fillet.",
    longDescription: "Our salmon fillet is seasoned with a soulful blend of herbs and spices, then pan-seared to flaky perfection. A lighter yet satisfying option that doesn't skimp on flavor. Served with your choice of two classic Southern sides.",
    price: "$27",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Salmon — Seasoned Salmon Fillet in South LA | Lonell's",
    seoDescription: "Pan-seared salmon fillet at Lonell's Soul Food in South Los Angeles. Perfectly seasoned, flaky, served with two Southern sides. Dine-in, takeout, or delivery.",
    image: "/media/images/salmon.webp",
    imageAlt: "Seasoned salmon fillet with mashed potatoes and red beans at Lonell's Soul Food",
  },
  {
    slug: "catfish",
    name: "Catfish",
    description: "Crispy, Louisiana-style seasoned catfish.",
    longDescription: "Our catfish is a taste of the Bayou right in South LA. Fresh fillets are seasoned with a Louisiana-inspired blend of spices, cornmeal-dusted, and fried until golden and crispy. The outside shatters with each bite, revealing tender, flaky fish inside. Served with your choice of two sides and a slice of lemon.",
    price: "$27",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Catfish — Louisiana-Style Fried Catfish in South LA | Lonell's",
    seoDescription: "Crispy Louisiana-style fried catfish at Lonell's Soul Food in South Los Angeles. Cornmeal-dusted, perfectly seasoned, served with two sides. Dine-in, takeout, or delivery.",
  },
  {
    slug: "short-ribs",
    name: "Short Ribs",
    description: "Rich, braised short ribs. Available Fridays only.",
    longDescription: "Our short ribs are a Friday-only specialty worth planning around. Beef short ribs are slow-braised until the meat is butter-tender and practically falling off the bone, in a deeply savory sauce that's been reduced to perfection. Available Fridays only. Once they're gone, they're gone. Served with your choice of two sides.",
    price: "$30",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Short Ribs — Friday Special Braised Short Ribs South LA | Lonell's",
    seoDescription: "Friday-only slow-braised short ribs at Lonell's Soul Food in South Los Angeles. Butter-tender, rich sauce, served with two sides. Available Fridays. Dine-in or takeout.",
  },
  {
    slug: "turkey-chop",
    name: "Turkey Chop",
    description: "Cooked to order. A lean, flavorful alternative.",
    longDescription: "Our turkey chop is the go-to choice for anyone looking for a leaner option without sacrificing flavor. Cooked to order and seasoned with our signature blend, each turkey chop is juicy, tender, and satisfying. Served with your choice of two sides, it's a lighter take on a soul food classic.",
    price: "$30",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option", "Lean"],
    seoTitle: "Turkey Chop — Lean Soul Food Turkey Chop in South LA | Lonell's",
    seoDescription: "Lean, flavorful turkey chop at Lonell's Soul Food in South Los Angeles. Cooked to order, served with two Southern sides. A lighter soul food option. Dine-in or takeout.",
  },
  {
    slug: "brisket",
    name: "Brisket",
    description: "Tender, slow-smoked brisket, sliced and sauced.",
    longDescription: "Our brisket is slow-smoked to perfection, tender, smoky, and packed with deep beef flavor. Each slice is cut against the grain and lightly sauced to complement, not overpower, the meat. Served with your choice of two sides. A true barbecue-soul food hybrid that keeps our guests coming back.",
    price: "$26",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Brisket — Slow-Smoked Soul Food Brisket in South LA | Lonell's",
    seoDescription: "Slow-smoked brisket at Lonell's Soul Food in South Los Angeles. Tender, sliced and sauced, served with two Southern sides. Dine-in, takeout, or delivery.",
  },
  {
    slug: "baked-chicken",
    name: "Baked Chicken",
    description: "Golden-brown, seasoned to perfection.",
    longDescription: "Our baked chicken is the comfort food you've been craving. Seasoned with a soulful blend of herbs and spices, then oven-roasted until the skin is golden and the meat is fall-apart tender. A lighter alternative to fried, but every bit as flavorful. Served with your choice of two sides.",
    price: "$26",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Baked Chicken — Oven-Roasted Soul Food Chicken in South LA | Lonell's",
    seoDescription: "Oven-roasted baked chicken at Lonell's Soul Food in South Los Angeles. Golden-brown, perfectly seasoned, served with two sides. A lighter soul food option. Dine-in or takeout.",
  },
  {
    slug: "peach-cobbler",
    name: "Peach Cobbler",
    description: "Southern-style, warm and spiced.",
    longDescription: "End your meal the right way with our Southern-style peach cobbler. Juicy, spiced peaches topped with a buttery, golden crust, baked until bubbling and served warm. Each spoonful is a perfect balance of sweet fruit and tender pastry. Made fresh in-house.",
    price: "$7",
    category: "Desserts",
    dietaryTags: ["Vegetarian"],
    seoTitle: "Peach Cobbler — Southern-Style Peach Cobbler in South LA | Lonell's",
    seoDescription: "Warm Southern-style peach cobbler at Lonell's Soul Food in South Los Angeles. Spiced peaches, buttery golden crust, made in-house. The perfect soul food dessert.",
  },
];

export const foodPhotos: FoodPhoto[] = dishes
  .filter((dish): dish is Dish & { image: string; imageAlt: string } => Boolean(dish.image && dish.imageAlt))
  .map((dish) => {
    const base = dish.image.replace(/\.webp$/, "");
    return {
      slug: dish.slug,
      name: dish.name,
      alt: dish.imageAlt,
      webp: dish.image,
      webp2x: `${base}@2x.webp`,
      jpg: `${base}.jpg`,
      full: `${base}@2x.webp`,
      ...FOOD_PHOTO_SIZE,
    };
  });

export const featuredDishSlugs = ["oxtails", "fried-chicken", "pork-chops"] as const;

export function getDishBySlug(slug: string): Dish | undefined {
  return dishes.find((d) => d.slug === slug);
}

export function getFeaturedDishes(): Dish[] {
  return featuredDishSlugs
    .map((slug) => getDishBySlug(slug))
    .filter((dish): dish is Dish => Boolean(dish));
}
