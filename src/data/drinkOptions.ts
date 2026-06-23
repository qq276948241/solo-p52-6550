export type OptionRenderMode = "grid" | "chips";

export interface DrinkOptionItem {
  value: string;
  label: string;
  priceDelta?: number;
}

export interface DrinkOptionGroup {
  key: string;
  title: string;
  subtitle?: string;
  default: string;
  mode: OptionRenderMode;
  options: DrinkOptionItem[];
}

export const DRINK_OPTION_GROUPS: DrinkOptionGroup[] = [
  {
    key: "cupSize",
    title: "杯型",
    subtitle: "选大杯更划算",
    default: "medium",
    mode: "grid",
    options: [
      { value: "medium", label: "中杯", priceDelta: 0 },
      { value: "large", label: "大杯", priceDelta: 3 },
      { value: "xlarge", label: "超大杯", priceDelta: 6 },
    ],
  },
  {
    key: "sugarLevel",
    title: "糖度",
    default: "normal",
    mode: "chips",
    options: [
      { value: "none", label: "无糖" },
      { value: "less", label: "少糖" },
      { value: "half", label: "半糖" },
      { value: "normal", label: "标准糖" },
      { value: "extra", label: "多糖" },
    ],
  },
  {
    key: "iceLevel",
    title: "冰度",
    default: "regular",
    mode: "chips",
    options: [
      { value: "hot", label: "热饮" },
      { value: "none", label: "去冰" },
      { value: "less", label: "少冰" },
      { value: "regular", label: "正常冰" },
      { value: "extra", label: "多冰" },
    ],
  },
  {
    key: "topping",
    title: "加料",
    subtitle: "可多选",
    default: "none",
    mode: "grid",
    options: [
      { value: "none", label: "不加料", priceDelta: 0 },
      { value: "pearl", label: "珍珠", priceDelta: 3 },
      { value: "coconut", label: "椰果", priceDelta: 3 },
      { value: "pudding", label: "布丁", priceDelta: 4 },
      { value: "cream", label: "奶盖", priceDelta: 5 },
    ],
  },
];

export type SelectedOptions = Record<string, string>;

export function getOptionLabel(
  groupKey: string,
  value: string
): string {
  const group = DRINK_OPTION_GROUPS.find((g) => g.key === groupKey);
  return group?.options.find((o) => o.value === value)?.label ?? value;
}

export function getTotalPriceDelta(
  selected: SelectedOptions
): number {
  return DRINK_OPTION_GROUPS.reduce((total, group) => {
    const value = selected[group.key];
    const item = group.options.find((o) => o.value === value);
    return total + (item?.priceDelta ?? 0);
  }, 0);
}

export function getDefaultOptions(): SelectedOptions {
  return DRINK_OPTION_GROUPS.reduce<SelectedOptions>((acc, group) => {
    acc[group.key] = group.default;
    return acc;
  }, {});
}

export function getPriceDelta(groupKey: string, value: string): number {
  const group = DRINK_OPTION_GROUPS.find((g) => g.key === groupKey);
  return group?.options.find((o) => o.value === value)?.priceDelta ?? 0;
}
