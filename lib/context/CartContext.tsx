import React, { createContext, useContext, useReducer } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  canteenId: string;    // Add canteen tracking
  canteenName: string;  // Add canteen name for UI
}

export interface CartState {
  cart: CartItem[];
  currentCanteen: {
    id: string;
    name: string;
  } | null;
}

type CartAction =
  | {
    type: 'ADD_ITEM';
    payload: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
      canteenId: string;
      canteenName: string;
    };
  }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; delta: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: { items: CartItem[], canteenId?: string, canteenName?: string } };

const initialState: CartState = {
  cart: [],
  currentCanteen: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Set current canteen if cart is empty
      if (state.cart.length === 0) {
        state = {
          ...state,
          currentCanteen: {
            id: action.payload.canteenId,
            name: action.payload.canteenName,
          }
        };
      }

      // Validate canteen
      if (state.currentCanteen && state.currentCanteen.id !== action.payload.canteenId) {
        return state; // Reject items from different canteens
      }

      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload }],
      };
    }
    case 'CLEAR_CART':
      return {
        cart: [],
        currentCanteen: null,
      };
    case 'REMOVE_ITEM': {
      const updatedCart = state.cart.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        cart: updatedCart,
        currentCanteen: updatedCart.length === 0 ? null : state.currentCanteen,
      };
    }
    case 'UPDATE_QUANTITY': {
      const updatedCart = state.cart.map(item =>
        item.id === action.payload.id
          ? {
            ...item,
            quantity: Math.max(0, item.quantity + action.payload.delta),
          }
          : item
      ).filter(item => item.quantity > 0);
      // If the current canteen is the one being removed, reset it
      return {
        ...state,
        cart: updatedCart,
        currentCanteen: updatedCart.length === 0 ? null : state.currentCanteen,
      };
    }
    case 'SET_CART': {
      // Check if there are items in the new cart
      if (action.payload.items.length === 0) {
        return {
          cart: [],
          currentCanteen: null,
        };
      }

      // Determine canteen info for the new cart
      let newCurrentCanteen = state.currentCanteen;

      // If explicit canteen info is provided, use that
      if (action.payload.canteenId && action.payload.canteenName) {
        newCurrentCanteen = {
          id: action.payload.canteenId,
          name: action.payload.canteenName,
        };
      }
      // Otherwise, use the canteen info from the first item if available
      else if (action.payload.items.length > 0) {
        const firstItem = action.payload.items[0];
        newCurrentCanteen = {
          id: firstItem.canteenId,
          name: firstItem.canteenName,
        };
      }

      return {
        cart: [...action.payload.items],
        currentCanteen: newCurrentCanteen,
      };
    }
    default:
      return state;
  }
}

const CartContext = createContext<{
  cart: CartItem[];
  currentCanteen: CartState['currentCanteen'];
  dispatch: React.Dispatch<CartAction>;
  setCart: (items: CartItem[], canteenId?: string, canteenName?: string) => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // New function to set the entire cart
  const setCart = (items: CartItem[], canteenId?: string, canteenName?: string) => {
    dispatch({
      type: 'SET_CART',
      payload: {
        items,
        canteenId,
        canteenName
      }
    });
  };

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      currentCanteen: state.currentCanteen,
      dispatch,
      setCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartProvider;