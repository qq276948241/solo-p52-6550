export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
}

export const SERVICES: Service[] = [
  {
    id: "bath",
    name: "宠物洗澡",
    description: "专业洗护，包含吹干梳毛",
    price: 88,
    duration: 60,
    icon: "🛁",
  },
  {
    id: "grooming",
    name: "造型剪毛",
    description: "专业美容师修剪造型",
    price: 168,
    duration: 90,
    icon: "✂️",
  },
  {
    id: "spa",
    name: "宠物SPA",
    description: "精油按摩+深层护理",
    price: 238,
    duration: 120,
    icon: "💆",
  },
];

export const TIME_SLOTS: string[] = [
  "09:00-10:00",
  "10:30-11:30",
  "13:00-14:00",
  "14:30-15:30",
  "16:00-17:00",
  "18:00-19:00",
  "19:30-20:30",
];

export type PetType = "cat" | "dog" | "other";

export const PET_TYPES: { value: PetType; label: string; icon: string }[] = [
  { value: "dog", label: "狗狗", icon: "🐶" },
  { value: "cat", label: "猫咪", icon: "🐱" },
  { value: "other", label: "其他", icon: "🐾" },
];

export function getPetTypeLabel(type: PetType): string {
  return PET_TYPES.find((t) => t.value === type)?.label ?? "其他";
}

export function getPetTypeIcon(type: PetType): string {
  return PET_TYPES.find((t) => t.value === type)?.icon ?? "🐾";
}
