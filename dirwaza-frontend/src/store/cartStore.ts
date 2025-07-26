import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  quantity: number;
  isOnSale?: boolean;
  originalPrice?: number;
}

export interface RecipientPerson {
  recipientName: string;
  phoneNumber: string;
  message: string;
  deliveryDate: string;
}

interface CartStore {
  items: CartItem[];
  isHydrated: boolean;
  recipientPerson: RecipientPerson | null;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  addOneItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setRecipientPerson: (recipientPerson: RecipientPerson) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hydrate: (data: { items: CartItem[]; recipientPerson: RecipientPerson | null }) => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  recipientPerson: null,
  isHydrated: false,
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  addOneItem: (item) =>set({ items: [{ ...item, quantity: 1 }] }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ items: [] ,recipientPerson: null}),
  setRecipientPerson: (recipientPerson: RecipientPerson) => set({ recipientPerson }),
  getTotalItems: () => {
    const { items } = get();
    return items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  },
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  hydrate: (data) => set({ items: data.items, recipientPerson: data.recipientPerson, isHydrated: true }),
}));
