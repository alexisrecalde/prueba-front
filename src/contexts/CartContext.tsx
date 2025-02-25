import { createContext } from 'react';
import { Product } from '../types';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartContextProps {
    cart: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextProps>({
    cart: [],
    totalItems: 0,
    totalPrice: 0,
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
});

export default CartContext;