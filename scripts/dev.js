#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

// Simplified dev startup
async function runDev() {
  console.log('🚀 YukiFiles Development Server\n')
  
  // Check if we should show the fancy startup
  const showFancyStartup = process.argv.includes('--fancy') || process.env.YUKIFILES_FANCY_DEV === 'true'
  
  if (showFancyStartup) {
    // Dynamic import for ES modules
    const { default: StartupLogger } = await import('../lib/logger/startup-logger.js')
    const logger = new StartupLogger()
    await logger.startupSequence()
    console.log('\n🚀 Starting Next.js development server...\n')
  } else {
    console.log('⚡ Quick development start (use --fancy for full startup sequence)\n')
  }
  
  // Start the actual Next.js dev server
  const nextDev = spawn('pnpm', ['next', 'dev'], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  nextDev.on('error', (error) => {
    console.error(`❌ Failed to start dev server: ${error.message}`)
    process.exit(1)
  })
  
  nextDev.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Dev server exited with code ${code}`)
      process.exit(code)
    }
  })
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...')
    nextDev.kill('SIGINT')
  })
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development server...')
    nextDev.kill('SIGTERM')
  })
}

runDev().catch((error) => {
  console.error('Failed to start development server:', error)
  process.exit(1)
})