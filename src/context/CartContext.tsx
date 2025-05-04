import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    ReactNode,
} from 'react';

interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const sessionId = 'temporary-session-id';

    const addToCart = (item: CartItem) => {
        setCart(prevCart => {
            const existing = prevCart.find(i => i.productId === item.productId);
            if (existing) {
                return prevCart.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                return [...prevCart, item];
            }
        });

        fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId,
            },
            body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
            }),
        });
    };

    const value = useMemo(() => ({ cart, addToCart }), [cart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
