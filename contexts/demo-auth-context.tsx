"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DemoUser } from '@/lib/demo/demo-architecture'
import { demoBackend } from '@/lib/demo/demo-backend'

interface DemoAuthContextType {
  user: DemoUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
  updateUser: (updates: Partial<DemoUser>) => Promise<void>
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined)

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider')
  }
  return context
}

interface DemoAuthProviderProps {
  children: ReactNode
}

export function DemoAuthProvider({ children }: DemoAuthProviderProps) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Only check localStorage in browser environment
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('yukifiles_demo_user_id')
          if (storedUserId) {
            const user = await demoBackend.getUser(storedUserId)
            if (user) {
              setUser(user)
            }
          }
        }
      } catch (error) {
        console.warn('Failed to restore demo user session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const user = await demoBackend.authenticateUser(email, password)
      
      if (user) {
        setUser(user)
        // Only save to localStorage in browser environment
        if (typeof window !== 'undefined') {
          localStorage.setItem('yukifiles_demo_user_id', user.id)
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Demo login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const user = await demoBackend.createUser(email, password, name)
      
      if (user) {
        setUser(user)
        // Only save to localStorage in browser environment
        if (typeof window !== 'undefined') {
          localStorage.setItem('yukifiles_demo_user_id', user.id)
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Demo registration failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    // Only remove from localStorage in browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yukifiles_demo_user_id')
    }
  }

  const updateUser = async (updates: Partial<DemoUser>) => {
    if (!user) return
    
    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      
      // Update in backend
      // Note: In real app, this would call an API
      console.log('User updated:', updatedUser)
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const value: DemoAuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateUser
  }

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  )
}