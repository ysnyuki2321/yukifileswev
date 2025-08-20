#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

// Import our custom logger
async function runStartup() {
  // Dynamic import for ES modules
  const { default: StartupLogger } = await import('../lib/logger/startup-logger.js')
  
  const logger = new StartupLogger()
  
  // Run the startup sequence
  await logger.startupSequence()
  
  // After the fancy startup sequence, actually start Next.js
  console.log('\n🚀 Starting Next.js application...\n')
  
  // Start the actual Next.js server
  const nextStart = spawn('pnpm', ['next', 'start'], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  nextStart.on('error', (error) => {
    logger.logError('runtime', 'nextStart', `Failed to start server: ${error.message}`)
    process.exit(1)
  })
  
  nextStart.on('close', (code) => {
    if (code !== 0) {
      logger.logError('runtime', 'nextStart', `Server exited with code ${code}`)
      process.exit(code)
    }
  })
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...')
    nextStart.kill('SIGINT')
  })
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...')
    nextStart.kill('SIGTERM')
  })
}

runStartup().catch((error) => {
  console.error('Failed to start application:', error)
  process.exit(1)
})