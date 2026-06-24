# 购物车数据流说明

本文档梳理从用户在弹窗中选择规格 → 点击「加入购物车」→ Store 状态变更 → 页面响应式渲染的完整数据链路，方便新人快速上手。

---

## 目录

1. [整体链路总览](#1-整体链路总览)
2. [第 1 层：选项配置层（数据源）](#2-第-1-层选项配置层数据源)
3. [第 2 层：UI 交互层（BookingModal）](#3-第-2-层ui-交互层bookingmodal)
4. [第 3 层：状态管理层（useBookingStore）](#4-第-3-层状态管理层usebookingstore)
5. [第 4 层：持久化层（zustand persist）](#5-第-4-层持久化层zustand-persist)
6. [第 5 层：页面响应式渲染](#6-第-5-层页面响应式渲染)
7. [关键数据结构速查](#7-关键数据结构速查)
8. [新增一个选项组的完整步骤](#8-新增一个选项组的完整步骤)

---

## 1. 整体链路总览

```
┌─────────────────────────┐
│  drinkOptions.ts        │  ← 选项配置（杯型/糖度/冰度/加料...）
│  DRINK_OPTION_GROUPS    │     所有可选项集中在这里管理
└────────────┬────────────┘
             │ 读取配置
             ▼
┌─────────────────────────┐
│  BookingModal.tsx       │  ← 用户选择规格
│  selected: {            │    useState 存选中值
│    cupSize: "large",    │
│    sugarLevel: "less"   │
│  }                      │
└────────────┬────────────┘
             │ 点击「加入购物车」
             │ 调用 store.addToCart()
             ▼
┌─────────────────────────┐
│  useBookingStore.ts     │  ← Zustand 全局状态
│  addToCart(item) {      │
│    • 同规格合并(+1)      │
│    • 或追加新条目        │
│  }                      │
│  cart: CartItem[]       │     cart 数组在这里
└────────────┬────────────┘
             │ persist middleware 自动
             ▼
┌─────────────────────────┐
│  localStorage           │  ← 持久化存储
│  key: "pet-grooming-    │    刷新页面数据不丢
│        bookings"        │
└────────────┬────────────┘
             │ 订阅变化（useBookingStore）
             ▼
┌─────────────────────────┐
│  任意消费 cart 的组件    │  ← 响应式渲染
│  const { cart } =       │    组件自动 re-render
│    useBookingStore(...) │
│  cart.map(item => ...)  │
└─────────────────────────┘
```

---

## 2. 第 1 层：选项配置层（数据源）

**文件**：[`src/data/drinkOptions.ts`](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/data/drinkOptions.ts)

### 核心配置：`DRINK_OPTION_GROUPS`

所有自定义选项**唯一真实来源**。要加新的选项类型（比如温度、甜度），只需要在这里补一条，不用改任何组件代码。

```typescript
// 第 17 行起
export const DRINK_OPTION_GROUPS: DrinkOptionGroup[] = [
  {
    key: "cupSize",          // 存进 CartItem 的字段名
    title: "杯型",           // 弹窗上的中文标题
    subtitle: "选大杯更划算",  // 右上角小字说明（可选）
    default: "medium",       // 默认选中值
    mode: "grid",            // 渲染模式：grid 网格 / chips 横向胶囊
    options: [
      { value: "medium", label: "中杯", priceDelta: 0 },
      { value: "large",  label: "大杯", priceDelta: 3 },  // priceDelta 是加价
      { value: "xlarge", label: "超大杯", priceDelta: 6 },
    ],
  },
  {
    key: "sugarLevel",
    title: "糖度",
    default: "normal",
    mode: "chips",           // chips 模式：一行横向滚动的胶囊按钮
    options: [
      { value: "none", label: "无糖" },
      { value: "less", label: "少糖" },
      // ...
    ],
  },
  // 冰度、加料同理...
];
```

### 配套工具函数

| 函数 | 位置 | 用途 |
|------|------|------|
| `getDefaultOptions()` | [第 93-98 行](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/data/drinkOptions.ts#L93-L98) | 遍历所有 group，构造 `{ cupSize: "medium", sugarLevel: "normal", ... }` 初始值对象 |
| `getTotalPriceDelta(selected)` | [第 83-91 行](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/data/drinkOptions.ts#L83-L91) | 计算当前选择下所有 `priceDelta` 之和（比如大杯+3 + 珍珠+3 = 6） |
| `getOptionLabel(groupKey, value)` | [第 75-81 行](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/data/drinkOptions.ts#L75-L81) | 根据 key 和 value 反查中文 label（购物车展示用） |

---

## 3. 第 2 层：UI 交互层（BookingModal）

**文件**：[`src/components/BookingModal.tsx`](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/components/BookingModal.tsx)

### 3.1 状态初始化 & 重置

```typescript
// 第 20-31 行
const [selected, setSelected] = useState<SelectedOptions>(() =>
  getDefaultOptions()      // 初始值从配置读
);
const [quantity, setQuantity] = useState(1);

// ⚠️ 关键修复：每次 service 变化（弹窗打开）时重置状态
// 因为 BookingModal 是常驻挂载的（用 service=null 控制显隐），
// 如果不加这个 effect，第二次打开弹窗会保留上次用户选的值
useEffect(() => {
  if (service) {
    setSelected(getDefaultOptions());
    setQuantity(1);
  }
}, [service]);
```

### 3.2 动态渲染选项组

```typescript
// 第 107-184 行
{DRINK_OPTION_GROUPS.map((group) => (
  <div key={group.key}>
    <h3>{group.title}</h3>

    {group.mode === "grid" ? (
      // 网格布局：列数 = min(选项数, 3)
      <div style={{ gridTemplateColumns: `repeat(${Math.min(group.options.length, 3)}, ...)` }}>
        {group.options.map((opt) => (
          <button
            onClick={() => handleChange(group.key, opt.value)}
            className={selected[group.key] === opt.value ? "选中样式" : "默认样式"}
          >
            {opt.label}
            {opt.priceDelta > 0 && `+¥${opt.priceDelta}`}
          </button>
        ))}
      </div>
    ) : (
      // chips 布局：横向滚动胶囊
      <div className="flex gap-2 overflow-x-auto">
        {group.options.map((opt) => (
          <button ...>{opt.label}</button>
        ))}
      </div>
    )}
  </div>
))}
```

### 3.3 实时价格计算

```typescript
// 第 33-39 行
const finalPrice = useMemo(() => {
  if (!service) return 0;
  const delta = getTotalPriceDelta(selected);  // 所有加价项之和
  return (service.price + delta) * quantity;
}, [service, selected, quantity]);
```

### 3.4 提交：调用 addToCart

```typescript
// 第 44-60 行
function handleAddToCart() {
  if (!service) return;
  const basePrice = service.price + getTotalPriceDelta(selected);
  addToCart({
    serviceId: service.id,
    serviceName: service.name,
    serviceIcon: service.icon,
    price: basePrice,           // 存最终单价（已含加价）
    options: { ...selected },   // 存完整的选项对象快照
    quantity,
  });
  // ...Toast + 关闭弹窗
}
```

---

## 4. 第 3 层：状态管理层（useBookingStore）

**文件**：[`src/store/useBookingStore.ts`](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/store/useBookingStore.ts)

使用 **Zustand** + **persist middleware** 实现。

### 4.1 核心数据：`CartItem`

```typescript
// 第 19-28 行
export interface CartItem {
  id: string;              // 购物车条目唯一 ID（CT + 时间戳 + 随机数）
  serviceId: string;       // 商品 ID（bath/grooming/spa）
  serviceName: string;     // 商品名称快照
  serviceIcon: string;     // emoji 图标快照
  price: number;           // 含加价的最终单价
  options: SelectedOptions; // 完整选项快照：{ cupSize, sugarLevel, iceLevel, topping }
  quantity: number;        // 数量
  addedAt: number;         // 加入时间戳
}
```

### 4.2 关键方法：`addToCart`

```typescript
// 第 80-103 行
addToCart: (item) => {
  const { cart } = get();

  // ① 查找是否有「同商品 + 完全相同选项」的条目
  const existingIdx = cart.findIndex(
    (c) =>
      c.serviceId === item.serviceId &&
      optionsEqual(c.options, item.options)  // 深对比 options 所有字段
  );

  if (existingIdx >= 0) {
    // ② 已存在：数量 +1（或 + 传入的 quantity）
    const newCart = [...cart];
    newCart[existingIdx] = {
      ...newCart[existingIdx],
      quantity: newCart[existingIdx].quantity + (item.quantity ?? 1),
    };
    set({ cart: newCart });
  } else {
    // ③ 不存在：追加新条目
    const newItem: CartItem = {
      ...item,
      id: generateCartId(),       // 生成 CTxxxxxx 唯一 ID
      quantity: item.quantity ?? 1,
      addedAt: Date.now(),
    };
    set({ cart: [...cart, newItem] });
  }
}
```

### 4.3 选项对比辅助函数

```typescript
// 第 48-52 行
function optionsEqual(a: SelectedOptions, b: SelectedOptions): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => a[k] === b[k]);
}
```

> 💡 **设计要点**：这里故意遍历所有 key 对比，而不是硬编码对比 cupSize/sugarLevel，是为了以后加新的选项组（温度/甜度/其他）时，不需要修改这段逻辑。

### 4.4 其他方法

| 方法 | 位置 | 用途 |
|------|------|------|
| `removeFromCart(id)` | [第 104-106 行](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/store/useBookingStore.ts#L104-L106) | 根据 ID 删除购物车条目 |
| `clearCart()` | [第 107-109 行](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo52/project52/src/store/useBookingStore.ts#L107-L109) | 清空购物车（下单后调用） |

---

## 5. 第 4 层：持久化层（zustand persist）

```typescript
// 第 58-115 行
export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({ /* ...状态与方法... */ }),
    {
      name: "pet-grooming-bookings",  // localStorage 的 key 名
    }
  )
);
```

**自动行为**：
- ✅ 每次调用 `set(...)`，Zustand 自动把整个 state 序列化写进 `localStorage`
- ✅ 页面刷新后，zustand 自动从 localStorage 读出并还原 state
- ✅ `cart` 和 `bookings` 两个数组都持久化（因为它们在同一个 state 里）

---

## 6. 第 5 层：页面响应式渲染

### 6.1 在任意组件中消费

```tsx
import { useBookingStore, getOptionLabel, DRINK_OPTION_GROUPS } from "@/store/useBookingStore";

function CartList() {
  // 只订阅 cart 数组，cart 变化时组件才会 re-render
  const cart = useBookingStore((state) => state.cart);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>
          <div>
            {item.serviceIcon} {item.serviceName} × {item.quantity}
          </div>
          <div className="text-sm text-gray-500">
            {/* 把 options 对象转成人类可读文字 */}
            {DRINK_OPTION_GROUPS.map((g) => (
              <span key={g.key}>
                {getOptionLabel(g.key, item.options[g.key])} / 
              </span>
            ))}
          </div>
          <div>¥{item.price * item.quantity}</div>
        </div>
      ))}
      <div>合计：¥{total}</div>
    </div>
  );
}
```

### 6.2 为什么会自动 re-render？

Zustand 的工作原理：

```
用户点击加入购物车
        ↓
store.addToCart(...) 内部调用 set()
        ↓
zustand 检测到 cart 数组引用变化
        ↓
所有 useBookingStore(s => s.cart) 的订阅者收到通知
        ↓
对应组件执行 re-render
```

> 💡 **最佳实践**：尽量细粒度订阅（只选需要的字段），避免 `const state = useBookingStore()` 订阅整个 state 导致无谓 re-render。

---

## 7. 关键数据结构速查

### SelectedOptions（选项值对象）
```typescript
type SelectedOptions = Record<string, string>;
// 实际示例：
{
  cupSize: "large",
  sugarLevel: "less",
  iceLevel: "regular",
  topping: "pearl",
}
```

### CartItem（购物车条目）
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | CT + 时间戳 + 随机数，唯一 |
| `serviceId` | `string` | 关联 SERVICES 里的商品 |
| `serviceName` | `string` | 商品名称**快照**（改名也不影响历史记录） |
| `price` | `number` | **含加价**的最终单价（不是基础价） |
| `options` | `SelectedOptions` | 所有选项的完整快照 |
| `quantity` | `number` | 数量（同规格合并时会 >1） |
| `addedAt` | `number` | 加入时间戳（排序用） |

---

## 8. 新增一个选项组的完整步骤

假设要加一个「**温度**」选项组（热饮 / 常温 / 少冰 / 正常冰），只需要 **3 步**，零组件代码修改：

### Step 1：在配置文件加一条
```typescript
// src/data/drinkOptions.ts → DRINK_OPTION_GROUPS
{
  key: "temperature",
  title: "温度",
  default: "normal",
  mode: "chips",
  options: [
    { value: "hot", label: "热饮" },
    { value: "normal", label: "常温" },
    { value: "less", label: "少冰" },
    { value: "ice", label: "正常冰" },
  ],
},
```

### Step 2：完成 ✅

对，就这一步。BookingModal 会：
- 自动多一个「温度」选项组
- 默认选中「常温」（`default` 字段）
- `getDefaultOptions()` 自动包含 `{ temperature: "normal" }`
- `optionsEqual()` 自动对比 temperature 字段
- `CartItem.options` 自动存 `{ ..., temperature: "hot" }`
- 购物车展示时 `getOptionLabel("temperature", "hot")` 自动返回「热饮」

### Step 3（可选）：如果想让某个选项加价

```typescript
{ value: "hot", label: "热饮（保温杯）", priceDelta: 2 },
```

- 弹窗按钮上自动显示 `+¥2`
- `getTotalPriceDelta()` 会算上这笔
- `CartItem.price` 会包含这个加价

---

> 🎯 **设计哲学**：配置驱动 UI，数据结构通用化。新增选项是「数据层面的添加」，而不是「代码层面的修改」。
