import { IMAGES } from "./images";

export const MENU_CATEGORIES = [
  { slug: "breakfast", name: "Breakfast", description: "Start the day right.", displayOrder: 1 },
  { slug: "soups-salads", name: "Soups & Salads", description: "Light beginnings.", displayOrder: 2 },
  { slug: "starters-veg", name: "Starters — Veg", description: "Vegetarian small plates.", displayOrder: 3 },
  { slug: "starters-nonveg", name: "Starters — Non-Veg", description: "From the tandoor and wok.", displayOrder: 4 },
  { slug: "mains-veg", name: "Main Course — Veg", description: "Comfort food, generous plates.", displayOrder: 5 },
  { slug: "mains-nonveg", name: "Main Course — Non-Veg", description: "Chef's specials.", displayOrder: 6 },
  { slug: "breads", name: "Breads & Rice", description: "Breads, pulao and rice.", displayOrder: 7 },
  { slug: "chinese", name: "Chinese", description: "Indo-Chinese favourites.", displayOrder: 8 },
  { slug: "beverages", name: "Beverages", description: "Hot and cold drinks.", displayOrder: 9 },
  { slug: "desserts", name: "Desserts", description: "Sweet endings.", displayOrder: 10 },
];

export type MenuItemSeed = {
  category: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  imageUrl?: string;
};

export const MENU_ITEMS: MenuItemSeed[] = [
  // BREAKFAST
  { category: "breakfast", name: "Puri Bhaji", description: "Fluffy puris served with spiced potato bhaji and pickle.", price: 120, isVeg: true, imageUrl: IMAGES.dining.breakfast },
  { category: "breakfast", name: "Aloo Paratha", description: "Whole-wheat paratha stuffed with seasoned mashed potato, served with curd and pickle.", price: 140, isVeg: true, imageUrl: IMAGES.dining.bread },
  { category: "breakfast", name: "Bread Omelette", description: "Two-egg omelette folded between buttered toast.", price: 110, isVeg: false, imageUrl: IMAGES.dining.breakfast },
  { category: "breakfast", name: "Poha", description: "Maharashtrian-style flattened rice with peanuts, curry leaves and lemon.", price: 90, isVeg: true, imageUrl: IMAGES.dining.breakfast },
  { category: "breakfast", name: "Idli Sambar", description: "Steamed rice cakes with sambar and coconut chutney.", price: 110, isVeg: true, imageUrl: IMAGES.dining.indian },
  { category: "breakfast", name: "Masala Dosa", description: "Crisp dosa filled with spiced potato, served with sambar and chutney.", price: 140, isVeg: true, imageUrl: IMAGES.dining.indian },

  // SOUPS & SALADS
  { category: "soups-salads", name: "Tomato Basil Soup", description: "Velvety tomato with fresh basil and cream.", price: 130, isVeg: true, imageUrl: IMAGES.dining.soups },
  { category: "soups-salads", name: "Sweet Corn Soup", description: "Indo-Chinese style, vegetarian.", price: 130, isVeg: true, imageUrl: IMAGES.dining.soups },
  { category: "soups-salads", name: "Hot & Sour Soup", description: "Spicy, tangy, Indo-Chinese classic.", price: 140, isVeg: true, imageUrl: IMAGES.dining.soups },
  { category: "soups-salads", name: "Chicken Sweet Corn Soup", description: "Creamy chicken stock with sweet corn and shredded chicken.", price: 160, isVeg: false, imageUrl: IMAGES.dining.soups },
  { category: "soups-salads", name: "Caesar Salad", description: "Romaine, parmesan, croutons and house Caesar dressing.", price: 220, isVeg: true },
  { category: "soups-salads", name: "Green Salad", description: "Cucumber, tomato, onion, lemon.", price: 100, isVeg: true },

  // STARTERS VEG
  { category: "starters-veg", name: "Paneer Chilli", description: "Cubes of paneer tossed with peppers, onion and house chilli sauce.", price: 240, isVeg: true, imageUrl: IMAGES.dining.indian },
  { category: "starters-veg", name: "Veg Manchurian", description: "Mixed vegetable dumplings in a glossy Manchurian sauce.", price: 220, isVeg: true, imageUrl: IMAGES.dining.chinese },
  { category: "starters-veg", name: "American Corn Salt & Pepper", description: "Crispy corn kernels tossed with crushed pepper and spring onion.", price: 210, isVeg: true },
  { category: "starters-veg", name: "Veg Hara Bhara Kebab", description: "Spinach, pea and potato cutlets pan-fried golden.", price: 200, isVeg: true, imageUrl: IMAGES.dining.indian },
  { category: "starters-veg", name: "Crispy Baby Corn", description: "Crisp-fried baby corn with honey chilli glaze.", price: 230, isVeg: true },
  { category: "starters-veg", name: "Mushroom Garlic", description: "Button mushrooms tossed in a peppery garlic sauce.", price: 230, isVeg: true },

  // STARTERS NON-VEG
  { category: "starters-nonveg", name: "Chicken Tikka", description: "Yogurt-marinated chicken roasted in the tandoor.", price: 290, isVeg: false, imageUrl: IMAGES.dining.indian },
  { category: "starters-nonveg", name: "Chicken Hariyali Tikka", description: "Mint-and-coriander marinated chicken, tandoor roasted.", price: 300, isVeg: false, imageUrl: IMAGES.dining.indian },
  { category: "starters-nonveg", name: "Chicken Lehsuni Tikka", description: "Garlicky chicken skewers, char-grilled.", price: 300, isVeg: false, imageUrl: IMAGES.dining.indian },
  { category: "starters-nonveg", name: "Tandoori Chicken (Half)", description: "Classic tandoori, served with mint chutney.", price: 320, isVeg: false, imageUrl: IMAGES.dining.indian },
  { category: "starters-nonveg", name: "Chilli Fish", description: "Batter-fried fish tossed in sweet chilli sauce.", price: 340, isVeg: false },
  { category: "starters-nonveg", name: "Egg Pakora", description: "Gram-flour-coated egg fritters.", price: 160, isVeg: false },

  // MAINS VEG
  { category: "mains-veg", name: "Paneer Butter Masala", description: "Cubes of paneer in a rich tomato-camel gravy.", price: 280, isVeg: true, imageUrl: IMAGES.dining.thali },
  { category: "mains-veg", name: "Kadhai Paneer", description: "Paneer with peppers in a roasted-spice kadhai masala.", price: 280, isVeg: true },
  { category: "mains-veg", name: "Dal Makhani", description: "Black lentils slow-cooked overnight with cream and butter.", price: 240, isVeg: true },
  { category: "mains-veg", name: "Dal Tadka", description: "Yellow lentils tempered with garlic and cumin.", price: 210, isVeg: true },
  { category: "mains-veg", name: "Mix Veg", description: "Seasonal vegetables in a spiced tomato gravy.", price: 230, isVeg: true },
  { category: "mains-veg", name: "Aloo Gobi", description: "Potato and cauliflower dry curry.", price: 220, isVeg: true },
  { category: "mains-veg", name: "Palak Paneer", description: "Cottage cheese in a smooth spinach gravy.", price: 270, isVeg: true },

  // MAINS NON-VEG
  { category: "mains-nonveg", name: "Butter Chicken", description: "Tandoori chicken simmered in a creamy tomato gravy.", price: 340, isVeg: false, imageUrl: IMAGES.dining.indian },
  { category: "mains-nonveg", name: "Chicken Biryani", description: "Long-grained basmati layered with chicken and aromatics.", price: 320, isVeg: false, imageUrl: IMAGES.dining.biryani },
  { category: "mains-nonveg", name: "Mutton Biryani", description: "Slow-cooked mutton with saffron-scented rice.", price: 420, isVeg: false, imageUrl: IMAGES.dining.biryani },
  { category: "mains-nonveg", name: "Kadhai Chicken", description: "Chicken with peppers in a roasted-spice kadhai masala.", price: 330, isVeg: false },
  { category: "mains-nonveg", name: "Chicken Curry", description: "Home-style chicken curry with onions, tomato and warm spices.", price: 310, isVeg: false },
  { category: "mains-nonveg", name: "Egg Curry", description: "Two eggs in a spiced onion-tomato gravy.", price: 220, isVeg: false },
  { category: "mains-nonveg", name: "Fish Curry", description: "Rohu fillets in a tangy mustard-coconut curry.", price: 340, isVeg: false },

  // BREADS & RICE
  { category: "breads", name: "Tandoori Roti", description: "Whole-wheat roti from the tandoor.", price: 40, isVeg: true, imageUrl: IMAGES.dining.bread },
  { category: "breads", name: "Butter Naan", description: "Soft naan brushed with butter.", price: 60, isVeg: true, imageUrl: IMAGES.dining.bread },
  { category: "breads", name: "Garlic Naan", description: "Naan topped with garlic and coriander.", price: 80, isVeg: true, imageUrl: IMAGES.dining.bread },
  { category: "breads", name: "Laccha Paratha", description: "Layered whole-wheat paratha.", price: 70, isVeg: true, imageUrl: IMAGES.dining.bread },
  { category: "breads", name: "Plain Rice", description: "Steamed basmati.", price: 130, isVeg: true },
  { category: "breads", name: "Jeera Rice", description: "Cumin-tempered basmati.", price: 160, isVeg: true },
  { category: "breads", name: "Veg Pulao", description: "Basmati cooked with seasonal vegetables and whole spices.", price: 200, isVeg: true },

  // CHINESE
  { category: "chinese", name: "Veg Fried Rice", description: "Wok-tossed rice with shredded vegetables.", price: 200, isVeg: true, imageUrl: IMAGES.dining.chinese },
  { category: "chinese", name: "Chicken Fried Rice", description: "Wok-tossed rice with chicken and egg.", price: 240, isVeg: false, imageUrl: IMAGES.dining.chinese },
  { category: "chinese", name: "Hakka Noodles (Veg)", description: "Wok-tossed noodles with shredded vegetables.", price: 200, isVeg: true, imageUrl: IMAGES.dining.chinese },
  { category: "chinese", name: "Chilli Paneer", description: "Crispy paneer in a glossy chilli-soy glaze.", price: 250, isVeg: true },
  { category: "chinese", name: "Honey Chilli Potato", description: "Crispy potato fingers glazed in honey chilli.", price: 200, isVeg: true },
  { category: "chinese", name: "Dragon Chicken", description: "Crispy chicken tossed in a sweet-spicy dragon sauce.", price: 300, isVeg: false, imageUrl: IMAGES.dining.chinese },

  // BEVERAGES
  { category: "beverages", name: "Masala Chai", description: "Strong Indian tea with milk and spices.", price: 40, isVeg: true, imageUrl: IMAGES.dining.coffee },
  { category: "beverages", name: "Filter Coffee", description: "South Indian filter coffee.", price: 60, isVeg: true, imageUrl: IMAGES.dining.coffee },
  { category: "beverages", name: "Cappuccino", description: "Espresso, steamed milk, foam.", price: 120, isVeg: true, imageUrl: IMAGES.dining.coffee },
  { category: "beverages", name: "Fresh Lime Soda", description: "Sweet, salted or mixed.", price: 80, isVeg: true, imageUrl: IMAGES.dining.drinks },
  { category: "beverages", name: "Mango Lassi", description: "Thick yogurt blended with mango pulp.", price: 110, isVeg: true, imageUrl: IMAGES.dining.drinks },
  { category: "beverages", name: "Cold Coffee", description: "Blended coffee with milk, ice cream and chocolate.", price: 160, isVeg: true, imageUrl: IMAGES.dining.coffee },
  { category: "beverages", name: "Coke / Sprite / Fanta", description: "330ml bottled soft drink.", price: 60, isVeg: true, imageUrl: IMAGES.dining.drinks },
  { category: "beverages", name: "Mineral Water", description: "1 litre bottle.", price: 40, isVeg: true },
  { category: "beverages", name: "Fresh Lime Water", description: "Sweet or salted.", price: 60, isVeg: true, imageUrl: IMAGES.dining.drinks },

  // DESSERTS
  { category: "desserts", name: "Gulab Jamun", description: "Two warm milk-solid dumplings in rose-cardamom syrup.", price: 100, isVeg: true, imageUrl: IMAGES.dining.dessert },
  { category: "desserts", name: "Ice Cream (per scoop)", description: "Vanilla, chocolate, strawberry, butterscotch.", price: 80, isVeg: true, imageUrl: IMAGES.dining.dessert },
  { category: "desserts", name: "Brownie with Ice Cream", description: "Warm chocolate brownie, vanilla ice cream.", price: 180, isVeg: true, imageUrl: IMAGES.dining.dessert },
  { category: "desserts", name: "Rasmalai", description: "Soft paneer discs in saffron-flavoured milk.", price: 140, isVeg: true },
  { category: "desserts", name: "Kulfi", description: "Traditional Indian frozen dessert, pistachio.", price: 100, isVeg: true, imageUrl: IMAGES.dining.dessert },
];