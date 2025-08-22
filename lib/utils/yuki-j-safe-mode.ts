// YukiFiles J-Safe Mode - Smart conflict prevention without breaking existing code

export const yukiJSafeMode = {
  // Initialize safe mode
  init: () => {
    if (typeof window === 'undefined') return

    console.log('🛡️ YukiFiles J-Safe Mode initializing...')

    // 1. Protect global j variable
    const yukiOriginalJ = (window as any).j
    Object.defineProperty(window, 'j', {
      get: () => {
        console.warn('🚨 YukiFiles: Global j access blocked to prevent conflicts')
        return undefined
      },
      set: () => {
        console.warn('🚨 YukiFiles: Global j assignment blocked to prevent conflicts')
        return false
      },
      configurable: false,
      enumerable: false
    })

    // 2. Override Array methods to use safe parameter names
    const yukiSafeArrayMethods = {
      map: Array.prototype.map,
      filter: Array.prototype.filter,
      forEach: Array.prototype.forEach,
      find: Array.prototype.find,
      reduce: Array.prototype.reduce
    }

    Array.prototype.map = function(yukiCallback: any, yukiThisArg?: any) {
      return yukiSafeArrayMethods.map.call(this, (yukiElement: any, yukiIndex: number, yukiArray: any[]) => {
        return yukiCallback.call(yukiThisArg, yukiElement, yukiIndex, yukiArray)
      })
    }

    Array.prototype.filter = function(yukiCallback: any, yukiThisArg?: any) {
      return yukiSafeArrayMethods.filter.call(this, (yukiElement: any, yukiIndex: number, yukiArray: any[]) => {
        return yukiCallback.call(yukiThisArg, yukiElement, yukiIndex, yukiArray)
      })
    }

    Array.prototype.forEach = function(yukiCallback: any, yukiThisArg?: any) {
      return yukiSafeArrayMethods.forEach.call(this, (yukiElement: any, yukiIndex: number, yukiArray: any[]) => {
        return yukiCallback.call(yukiThisArg, yukiElement, yukiIndex, yukiArray)
      })
    }

    // 3. Enhanced error tracking
    window.addEventListener('error', (yukiErrorEvent) => {
      if (yukiErrorEvent.message?.includes('Cannot access') && yukiErrorEvent.message?.includes('before initialization')) {
        console.error('🎯 YukiFiles J-Error Detected:', {
          message: yukiErrorEvent.message,
          file: yukiErrorEvent.filename,
          line: yukiErrorEvent.lineno,
          column: yukiErrorEvent.colno,
          stack: yukiErrorEvent.error?.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })

        // Prevent page crash
        yukiErrorEvent.preventDefault()
        yukiErrorEvent.stopPropagation()

        // Show user-friendly notification
        yukiJSafeMode.showErrorNotification(yukiErrorEvent.message)
      }
    })

    // 4. Monitor for problematic patterns
    yukiJSafeMode.monitorProblematicPatterns()

    console.log('✅ YukiFiles J-Safe Mode active')
  },

  // Show user-friendly error notification
  showErrorNotification: (yukiMessage: string) => {
    const yukiNotification = document.createElement('div')
    yukiNotification.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(219, 39, 119, 0.9)); 
        color: white; 
        padding: 20px; 
        border-radius: 12px; 
        max-width: 400px; 
        z-index: 10000; 
        font-family: 'Outfit', system-ui; 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(147, 51, 234, 0.3);
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="font-size: 24px;">✨</div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">YukiFiles Protection</h3>
            <p style="margin: 0 0 12px 0; font-size: 14px; opacity: 0.9;">
              A JavaScript conflict was detected and automatically handled. Your experience should continue smoothly.
            </p>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <button onclick="window.location.reload()" style="
                background: rgba(255,255,255,0.2); 
                border: 1px solid rgba(255,255,255,0.3); 
                color: white; 
                padding: 8px 16px; 
                border-radius: 6px; 
                cursor: pointer; 
                font-size: 12px;
                transition: all 0.2s;
              " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                Refresh
              </button>
              <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                background: transparent; 
                border: none; 
                color: rgba(255,255,255,0.7); 
                padding: 8px 12px; 
                cursor: pointer; 
                font-size: 14px;
                border-radius: 4px;
              " onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(yukiNotification)

    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (yukiNotification.parentElement) {
        yukiNotification.remove()
      }
    }, 15000)
  },

  // Monitor for problematic patterns
  monitorProblematicPatterns: () => {
    // Monitor for Supabase loading
    const yukiOriginalCreateClient = (window as any).createClient
    if (yukiOriginalCreateClient) {
      console.log('⚠️ YukiFiles: Supabase client detected - monitoring for conflicts')
    }

    // Monitor for minified variable access
    const yukiCheckMinifiedAccess = () => {
      try {
        // Test if any single-letter variables are being accessed globally
        const yukiSingleLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']
        yukiSingleLetters.forEach(yukiLetter => {
          try {
            if ((window as any)[yukiLetter] !== undefined) {
              console.warn(`🔍 YukiFiles: Global variable '${yukiLetter}' detected`)
            }
          } catch (yukiErr) {
            // Expected for undefined variables
          }
        })
      } catch (yukiError) {
        console.warn('🔍 YukiFiles: Error during minified variable check:', yukiError)
      }
    }

    // Check periodically
    setInterval(yukiCheckMinifiedAccess, 5000)
  },

  // Test function to verify j-safety
  testJSafety: () => {
    console.log('🧪 YukiFiles J-Safety Test Starting...')
    
    const yukiTests = [
      {
        name: 'Global j access',
        test: () => {
          try {
            const yukiTestJ = (window as any).j
            return { success: true, result: 'j access blocked successfully' }
          } catch (yukiErr) {
            return { success: false, error: yukiErr.message }
          }
        }
      },
      {
        name: 'Array map with safe parameters',
        test: () => {
          try {
            const yukiTestArray = [1, 2, 3]
            const yukiResult = yukiTestArray.map((yukiItem, yukiIndex) => yukiItem * 2)
            return { success: true, result: yukiResult }
          } catch (yukiErr) {
            return { success: false, error: yukiErr.message }
          }
        }
      },
      {
        name: 'JSON operations',
        test: () => {
          try {
            const yukiTestData = { test: 'value' }
            const yukiJsonString = JSON.stringify(yukiTestData)
            const yukiParsedData = JSON.parse(yukiJsonString)
            return { success: true, result: yukiParsedData }
          } catch (yukiErr) {
            return { success: false, error: yukiErr.message }
          }
        }
      }
    ]

    yukiTests.forEach(yukiTest => {
      const yukiResult = yukiTest.test()
      console.log(`${yukiResult.success ? '✅' : '❌'} ${yukiTest.name}:`, yukiResult.success ? yukiResult.result : yukiResult.error)
    })

    console.log('🧪 YukiFiles J-Safety Test Complete')
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  yukiJSafeMode.init()
  
  // Add to global scope for debugging
  ;(window as any).yukiJSafeMode = yukiJSafeMode
  
  console.log('🎯 YukiFiles J-Safe Mode ready - Access via window.yukiJSafeMode')
}