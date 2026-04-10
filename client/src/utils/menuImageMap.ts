import americanoImg from "../assets/images/americano.jpg";
import blackTeaImg from "../assets/images/black-tea.jpg";
import cappuccinoImg from "../assets/images/cappuccino.jpg";
import chaiTeaImg from "../assets/images/chai-tea.jpg";
import espressoImg from "../assets/images/espresso.jpg";
import greenTeaImg from "../assets/images/green-tea.jpg";
import herbalTeaImg from "../assets/images/herbal-tea.jpg";
import latteImg from "../assets/images/latte.jpg";
import matchaImg from "../assets/images/matcha.jpg";

type MenuCategory = "coffee" | "tea";

type MenuLikeItem = {
  itemName?: string | null;
  categoryId?: MenuCategory | string | null;
  previewImage?: string | null;
};

const imageByKeyword: Array<{ keywords: string[]; image: string }> = [
  { keywords: ["americano"], image: americanoImg },
  { keywords: ["cappuccino"], image: cappuccinoImg },
  { keywords: ["espresso"], image: espressoImg },
  { keywords: ["latte"], image: latteImg },
  { keywords: ["black tea"], image: blackTeaImg },
  { keywords: ["chai", "chai tea"], image: chaiTeaImg },
  { keywords: ["green tea"], image: greenTeaImg },
  { keywords: ["herbal tea", "herbal"], image: herbalTeaImg },
  { keywords: ["matcha"], image: matchaImg },
];

const fallbackImageByCategory: Record<MenuCategory, string> = {
  coffee: latteImg,
  tea: greenTeaImg,
};

export function getMenuItemImage(itemName: string, categoryId: MenuCategory) {
  const normalizedName = itemName.trim().toLowerCase();

  const keywordMatch = imageByKeyword.find(({ keywords }) =>
    keywords.some((keyword) => normalizedName.includes(keyword)),
  );

  if (keywordMatch) {
    return keywordMatch.image;
  }

  return fallbackImageByCategory[categoryId];
}

export function withMenuItemImage<T extends MenuLikeItem>(
  item: T,
): T & { previewImage: string | null } {
  if (item.previewImage) {
    return {
      ...item,
      previewImage: item.previewImage,
    };
  }

  if (
    !item.itemName ||
    (item.categoryId !== "coffee" && item.categoryId !== "tea")
  ) {
    return {
      ...item,
      previewImage: null,
    };
  }

  return {
    ...item,
    previewImage: getMenuItemImage(item.itemName, item.categoryId),
  };
}