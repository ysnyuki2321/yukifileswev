#!/usr/bin/env node

// Demo script to show the custom logger in action
async function demoLogger() {
  console.log('🎭 YukiFiles Logger Demo\n')
  
  // Dynamic import for ES modules
  const { default: StartupLogger } = await import('../lib/logger/startup-logger.js')
  
  const logger = new StartupLogger()
  
  console.log('Running full startup sequence...\n')
  
  // Run the full startup sequence
  await logger.startupSequence()
  
  console.log('\n✨ Demo completed! This is what you\'ll see when running:')
  console.log('  • npm run start (production with full startup)')
  console.log('  • npm run dev:fancy (development with full startup)')
  console.log('  • npm run dev (development with quick start)')
  console.log('  • npm run health (check application health)')
}

demoLogger().catch((error) => {
  console.error('Demo failed:', error)
  process.exit(1)
})