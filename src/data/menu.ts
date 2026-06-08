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
}

export const dishes: Dish[] = [
  {
    slug: "oxtails",
    name: "Oxtail",
    description: "Slow-cooked, fall-off-the-bone tender. Our most popular dish.",
    longDescription: "Our signature oxtails are slow-braised for hours until they reach fall-off-the-bone tenderness. Seasoned with our proprietary blend of herbs and spices, then simmered in a rich, savory gravy. Served with your choice of two classic Southern sides. This is the dish that put Lonell's on the map — don't visit without trying it.",
    price: "$32",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Oxtails — Best Soul Food Oxtails in South Los Angeles | Lonell's",
    seoDescription: "Try Lonell's award-winning oxtails in South LA. Slow-braised, fall-off-the-bone tender, served with two Southern sides. Our most popular dish. Dine-in, takeout, or delivery.",
    image: "/media/images/oxtails.webp",
  },
  {
    slug: "fried-chicken",
    name: "Fried Chicken",
    description: "Golden-brown, seasoned to perfection. A classic done right.",
    longDescription: "Our fried chicken is a labor of love — marinated overnight in buttermilk and seasonings, then hand-dredged and fried to golden-brown perfection. Every piece comes out crispy on the outside, impossibly juicy on the inside. Served with your choice of two sides and cornbread. Soul food doesn't get more classic than this.",
    price: "$24",
    category: "Dinner Plates",
    dietaryTags: [],
    seoTitle: "Fried Chicken — Best Soul Food Fried Chicken in South LA | Lonell's",
    seoDescription: "Crispy, juicy fried chicken at Lonell's Soul Food in South Los Angeles. Buttermilk-marinated, hand-dredged, and fried to order. Served with two sides. Dine-in or takeout.",
    image: "/media/images/fried-chicken.webp",
  },
  {
    slug: "catfish",
    name: "Catfish",
    description: "Crispy, Louisiana-style seasoned catfish.",
    longDescription: "Our catfish is a taste of the Bayou right in South LA. Fresh fillets are seasoned with a Louisiana-inspired blend of spices, cornmeal-dusted, and fried until golden and crispy. The outside shatters with each bite, revealing tender, flaky fish inside. Served with your choice of two sides and a slice of lemon.",
    price: "$26",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Catfish — Louisiana-Style Fried Catfish in South LA | Lonell's",
    seoDescription: "Crispy Louisiana-style fried catfish at Lonell's Soul Food in South Los Angeles. Cornmeal-dusted, perfectly seasoned, served with two sides. Dine-in, takeout, or delivery.",
    image: "/media/images/catfish.webp",
  },
  {
    slug: "short-ribs",
    name: "Short Ribs",
    description: "Rich, braised short ribs. Available Friday & Saturday only.",
    longDescription: "Our short ribs are a weekend-only specialty worth planning around. Beef short ribs are slow-braised until the meat is butter-tender and practically falling off the bone, in a deeply savory sauce that's been reduced to perfection. Available Friday and Saturday only — once they're gone, they're gone. Served with your choice of two sides.",
    price: "$28",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Short Ribs — Weekend Special Braised Short Ribs South LA | Lonell's",
    seoDescription: "Weekend-only slow-braised short ribs at Lonell's Soul Food in South Los Angeles. Butter-tender, rich sauce, served with two sides. Available Friday & Saturday. Dine-in or takeout.",
    image: "/media/images/short-ribs.webp",
  },
  {
    slug: "pork-chops",
    name: "Pork Chops",
    description: "Cooked to order, thick-cut and well-seasoned.",
    longDescription: "Our thick-cut pork chops are cooked to order — each chop is seasoned generously with our signature soul food blend, then pan-seared to lock in the juices. Served with your choice of two sides, these chops are consistently praised by our regulars for their tenderness and flavor.",
    price: "$24",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Pork Chops — Thick-Cut Soul Food Pork Chops in South LA | Lonell's",
    seoDescription: "Thick-cut, seasoned-to-order pork chops at Lonell's Soul Food in South Los Angeles. Pan-seared and juicy, served with two Southern sides. Dine-in, takeout, or delivery.",
    image: "/media/images/pork-chops.webp",
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
  },
  {
    slug: "turkey-chop",
    name: "Turkey Chop",
    description: "Cooked to order — a lean, flavorful alternative.",
    longDescription: "Our turkey chop is the go-to choice for anyone looking for a leaner option without sacrificing flavor. Cooked to order and seasoned with our signature blend, each turkey chop is juicy, tender, and satisfying. Served with your choice of two sides, it's a lighter take on a soul food classic.",
    price: "$27",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option", "Lean"],
    seoTitle: "Turkey Chop — Lean Soul Food Turkey Chop in South LA | Lonell's",
    seoDescription: "Lean, flavorful turkey chop at Lonell's Soul Food in South Los Angeles. Cooked to order, served with two Southern sides. A lighter soul food option. Dine-in or takeout.",
    image: "/media/images/turkey-chop.webp",
  },
  {
    slug: "brisket",
    name: "Brisket",
    description: "Tender, slow-smoked brisket, sliced and sauced.",
    longDescription: "Our brisket is slow-smoked to perfection — tender, smoky, and packed with deep beef flavor. Each slice is cut against the grain and lightly sauced to complement, not overpower, the meat. Served with your choice of two sides. A true barbecue-soul food hybrid that keeps our guests coming back.",
    price: "$21",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Brisket — Slow-Smoked Soul Food Brisket in South LA | Lonell's",
    seoDescription: "Slow-smoked brisket at Lonell's Soul Food in South Los Angeles. Tender, sliced and sauced, served with two Southern sides. Dine-in, takeout, or delivery.",
    image: "/media/images/brisket.webp",
  },
  {
    slug: "baked-chicken",
    name: "Baked Chicken",
    description: "Golden-brown, seasoned to perfection.",
    longDescription: "Our baked chicken is the comfort food you've been craving. Seasoned with a soulful blend of herbs and spices, then oven-roasted until the skin is golden and the meat is fall-apart tender. A lighter alternative to fried, but every bit as flavorful. Served with your choice of two sides.",
    price: "$24",
    category: "Dinner Plates",
    dietaryTags: ["Gluten-Free option"],
    seoTitle: "Baked Chicken — Oven-Roasted Soul Food Chicken in South LA | Lonell's",
    seoDescription: "Oven-roasted baked chicken at Lonell's Soul Food in South Los Angeles. Golden-brown, perfectly seasoned, served with two sides. A lighter soul food option. Dine-in or takeout.",
    image: "/media/images/baked-chicken.webp",
  },
  {
    slug: "peach-cobbler",
    name: "Peach Cobbler",
    description: "Southern-style, warm and spiced.",
    longDescription: "End your meal the right way with our Southern-style peach cobbler. Juicy, spiced peaches topped with a buttery, golden crust — baked until bubbling and served warm. Each spoonful is a perfect balance of sweet fruit and tender pastry. Made fresh in-house.",
    price: "",
    category: "Desserts",
    dietaryTags: ["Vegetarian"],
    seoTitle: "Peach Cobbler — Southern-Style Peach Cobbler in South LA | Lonell's",
    seoDescription: "Warm Southern-style peach cobbler at Lonell's Soul Food in South Los Angeles. Spiced peaches, buttery golden crust, made in-house. The perfect soul food dessert.",
    image: "/media/images/peach-cobbler.webp",
  },
];

export function getDishBySlug(slug: string): Dish | undefined {
  return dishes.find((d) => d.slug === slug);
}
