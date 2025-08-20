import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Check database connection
    const supabase = await createServerClient()
    
    let dbStatus = 'disconnected'
    let dbLatency = 0
    
    if (supabase) {
      const start = Date.now()
      try {
        const { data, error } = await supabase.from('admin_settings').select('count').limit(1)
        dbLatency = Date.now() - start
        dbStatus = error ? 'error' : 'connected'
      } catch (err) {
        dbStatus = 'error'
      }
    }
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        latency: dbLatency
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      }
    }
    
    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}