import { MenuDatabase, MenuItem, UserProfile, UIStrings } from "./types";

export const DEFAULT_USER_PROFILE: UserProfile = {
  age: 28,
  gender: "female",
  weight_kg: 60,
  height_cm: 165,
  goal: "maintain",
  has_diabetes: false,
  has_hypertension: false,
  sensitive_to_caffeine: true,
};

export const DEFAULT_UI_STRINGS: UIStrings = {
  buttons: {
    spin_now: "สุ่มเลย!",
    spin_all: "สุ่มทั้งหมด",
    save_meal: "บันทึกมื้อนี้",
    see_stats: "ดูสถิติ",
  },
  messages: {
    daily_success: ["สุดยอด! วันนี้ทำได้ดีมาก"],
    low_sugar_reward: ["เก่งมาก ลดหวานได้ดีเลย!"],
    high_caffeine_warning: ["ระวังใจสั่นนะ พักคาเฟอีนบ้าง"],
  },
};

const createItem = (
  id: string,
  th: string,
  en: string,
  cal: number,
  score: number,
  tag: any,
  sugar: number = 2,
  caffeine: any = "none"
): MenuItem => ({
  id,
  name_th: th,
  name_en: en,
  description_th: "เมนูยอดนิยม รสชาติกลมกล่อม",
  calories_kcal: cal,
  protein_g: 10,
  fat_g: 10,
  carb_g: 20,
  sugar_g: sugar,
  fiber_g: 2,
  caffeine_level: caffeine,
  health_score: score,
  type_tag: tag,
});

export const INITIAL_DATABASE: MenuDatabase = {
  version: "1.0-default",
  categories: {
    main_dish: [
      createItem("m1", "ข้าวมันไก่ (อก)", "Hainanese Chicken Rice (Breast)", 550, 6, "normal"),
      createItem("m2", "ส้มตำไทย + ไก่ย่าง", "Papaya Salad + Grilled Chicken", 350, 9, "healthy", 8),
      createItem("m3", "ผัดกะเพราหมูสับไข่ดาว", "Basil Pork with Fried Egg", 650, 4, "high_calorie", 3),
      createItem("m4", "สุกี้น้ำไก่", "Chicken Suki Soup", 300, 9, "low_carb", 2),
      createItem("m5", "ข้าวไข่เจียวหมูสับ", "Omelet with Rice", 600, 5, "high_calorie", 1),
      createItem("m6", "สลัดอกไก่", "Chicken Breast Salad", 250, 10, "healthy", 2),
      createItem("m7", "ต้มยำกุ้งน้ำใส", "Tom Yum Kung (Clear Soup)", 150, 9, "low_carb", 1),
      createItem("m8", "ข้าวขาหมู", "Stewed Pork Leg Rice", 700, 3, "high_calorie", 4),
    ],
    snack: [
      createItem("s1", "ผลไม้รวม", "Mixed Fruits", 80, 10, "healthy", 12),
      createItem("s2", "ขนมปังโฮลวีต 1 แผ่น", "Whole Wheat Bread", 80, 9, "healthy", 1),
      createItem("s3", "มันฝรั่งทอด", "Potato Chips", 300, 2, "high_calorie", 1),
      createItem("s4", "ลูกชิ้นปิ้ง 3 ไม้", "Grilled Meatballs", 250, 4, "normal", 2),
      createItem("s5", "ถั่วอัลมอนด์", "Almonds", 160, 9, "healthy", 1),
    ],
    drink: [
      createItem("d1", "น้ำเปล่า", "Water", 0, 10, "healthy", 0, "none"),
      createItem("d2", "ชาเขียวไม่หวาน", "Unsweetened Green Tea", 0, 9, "healthy", 0, "medium"),
      createItem("d3", "ชานมไข่มุก", "Bubble Milk Tea", 450, 2, "high_calorie", 35, "medium"),
      createItem("d4", "กาแฟดำ / อเมริกาโน่", "Black Coffee", 10, 9, "healthy", 0, "high"),
      createItem("d5", "น้ำอัดลม", "Soda", 140, 1, "high_calorie", 32, "low"),
      createItem("d6", "ลาเต้เย็น", "Iced Latte", 220, 5, "normal", 15, "medium"),
    ],
  },
};