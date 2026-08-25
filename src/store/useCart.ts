import { useState, useEffect } from 'react'
import type { Item } from '../types'

export interface CartItem {
  item: Item
  quantity: number
}

const CART_KEY = 'abhie_cart'

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

let cartState: CartItem[] = loadCart()
let listeners: Array<() => void> = []

function notify() {
  listeners.forEach((l) => l())
}

export function useCart() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick((t) => t + 1)
    listeners.push(listener)
    return () => { listeners = listeners.filter((l) => l !== listener) }
  }, [])

  const addItem = (item: Item, quantity = 1) => {
    const existing = cartState.find((c) => c.item.id === item.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      cartState = [...cartState, { item, quantity }]
    }
    saveCart(cartState)
    notify()
  }

  const removeItem = (itemId: string) => {
    cartState = cartState.filter((c) => c.item.id !== itemId)
    saveCart(cartState)
    notify()
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    const existing = cartState.find((c) => c.item.id === itemId)
    if (existing) {
      existing.quantity = quantity
      saveCart(cartState)
      notify()
    }
  }

  const clearCart = () => {
    cartState = []
    saveCart(cartState)
    notify()
  }

  const total = cartState.reduce((sum, c) => sum + c.item.price * c.quantity, 0)
  const totalMrp = cartState.reduce((sum, c) => sum + c.item.mrp * c.quantity, 0)

  return {
    items: cartState,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    totalMrp,
    savings: totalMrp - total,
  }
}
