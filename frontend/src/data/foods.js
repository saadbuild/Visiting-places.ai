import { seededFloat, img } from "./_helpers";

const RAW = {
  paris: [
    ["Croissant", "Traditional", 2.5, "Buttery, laminated pastry — best eaten within an hour of baking."],
    ["Coq au vin", "Traditional", 22, "Chicken braised slowly in red wine with mushrooms and lardons."],
    ["Crêpe Suzette", "Dessert", 8, "Thin pancake flambéed in orange butter sauce."],
    ["Café crème", "Drink", 4, "Espresso with steamed milk, the default order at any terrace table."],
  ],
  tokyo: [
    ["Ramen", "Traditional", 9, "Wheat noodles in a rich pork or soy broth, endless regional variations."],
    ["Takoyaki", "Street Food", 5, "Octopus-filled batter balls, grilled and topped with sauce and bonito flakes."],
    ["Mochi", "Dessert", 3, "Pounded rice cake, often filled with sweet red bean paste."],
    ["Matcha latte", "Drink", 5, "Whisked green tea with steamed milk."],
  ],
  bali: [
    ["Nasi goreng", "Traditional", 4, "Indonesian fried rice with egg, vegetables, and a fried shallot garnish."],
    ["Babi guling", "Traditional", 6, "Balinese spit-roasted pig, deeply spiced, served on special occasions."],
    ["Pisang goreng", "Street Food", 2, "Fried banana fritters, sold from roadside carts island-wide."],
    ["Es kelapa muda", "Drink", 3, "Young coconut water served straight from the shell."],
  ],
  dubai: [
    ["Al machboos", "Traditional", 11, "Spiced rice with meat or fish, the Emirati answer to biryani."],
    ["Shawarma", "Street Food", 4, "Layered spit-roasted meat wrapped in flatbread with garlic sauce."],
    ["Luqaimat", "Dessert", 5, "Deep-fried dumplings drizzled with date syrup."],
    ["Karak chai", "Drink", 2, "Strong, sweet, cardamom-spiced tea."],
  ],
  "new-york": [
    ["NY-style pizza", "Traditional", 3, "Foldable, thin-crust slices sold by weight of cheese and nostalgia."],
    ["Bagel with lox", "Traditional", 9, "Boiled-then-baked bagel, cream cheese, smoked salmon."],
    ["Halal cart chicken over rice", "Street Food", 8, "Griddled chicken and rice with white and hot sauce, a lunch institution."],
    ["Cheesecake", "Dessert", 7, "Dense, tangy, usually the size of a small hubcap."],
  ],
  istanbul: [
    ["Iskender kebab", "Traditional", 10, "Sliced döner over pide bread, tomato sauce, and browned butter."],
    ["Simit", "Street Food", 1.5, "Sesame-crusted bread ring, sold from carts since sunrise."],
    ["Baklava", "Dessert", 4, "Layered filo pastry with pistachio and syrup."],
    ["Turkish tea (çay)", "Drink", 1, "Served in tulip-shaped glasses everywhere, all day."],
  ],
  rome: [
    ["Carbonara", "Traditional", 13, "Egg, pecorino, guanciale, black pepper — no cream, despite the rumors."],
    ["Supplì", "Street Food", 3, "Fried rice croquette with a molten mozzarella center."],
    ["Gelato", "Dessert", 4, "Denser and less airy than ice cream, best from a shop with covered tins."],
    ["Espresso", "Drink", 1.5, "Drunk standing at the counter, in about ninety seconds."],
  ],
  "cape-town": [
    ["Bobotie", "Traditional", 10, "Spiced minced meat bake with an egg custard topping."],
    ["Gatsby sandwich", "Street Food", 7, "Footlong roll stuffed with fries and your choice of filling."],
    ["Malva pudding", "Dessert", 5, "Sticky sponge pudding with apricot jam, served warm with custard."],
    ["Rooibos tea", "Drink", 2, "Caffeine-free red-bush tea, native to the Western Cape."],
  ],
};

function buildFoods(destId, entries) {
  return entries.map(([name, type, priceUSD, description], i) => {
    const seed = `${destId}-food-${i}-${name}`;
    return {
      id: `${destId}-food-${i}`,
      destinationId: destId,
      name,
      type,
      avgPriceUSD: priceUSD,
      description,
      rating: Math.round(seededFloat(seed, 4.0, 5.0) * 10) / 10,
      image: img(seed, 800, 600),
    };
  });
}

export const foods = Object.entries(RAW).flatMap(([destId, entries]) =>
  buildFoods(destId, entries)
);

export function foodsFor(destId) {
  return foods.filter((f) => f.destinationId === destId);
}
