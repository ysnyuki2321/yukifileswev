// Mock Supabase server for demo mode
export function createServerClient() {
  // Return mock client for demo purposes
  return {
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: null
      }),
      getSession: async () => ({
        data: { session: null },
        error: null
      })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: null,
            error: null
          })
        })
      })
    })
  }
}

export function createClient() {
  return createServerClient()
}
