#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

// Check if dependencies are installed
function checkDependencies() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules')
  const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml')
  
  if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(pnpmLockPath)) {
    console.log('📦 Dependencies not found. Installing...')
    return false
  }
  
  return true
}

// Install dependencies
function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Installing dependencies with pnpm...')
    
    const install = spawn('pnpm', ['install'], {
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed successfully!')
        resolve()
      } else {
        console.error('❌ Failed to install dependencies')
        reject(new Error(`Installation failed with code ${code}`))
      }
    })
    
    install.on('error', (error) => {
      console.error('❌ Error during installation:', error.message)
      reject(error)
    })
  })
}

// Simple startup sequence without the complex logger
async function runStartup() {
  try {
    // Check and install dependencies if needed
    if (!checkDependencies()) {
      await installDependencies()
    }
    
    console.log('\n🚀 Starting YukiFiles application...')
    console.log('📁 Working directory:', process.cwd())
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development')
    
    // Check if build exists
    const buildPath = path.join(process.cwd(), '.next')
    if (!fs.existsSync(buildPath)) {
      console.log('🔨 Build not found. Building application...')
      
      const build = spawn('pnpm', ['run', 'build'], {
        stdio: 'inherit',
        cwd: process.cwd()
      })
      
      await new Promise((resolve, reject) => {
        build.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Build completed successfully!')
            resolve()
          } else {
            console.error('❌ Build failed')
            reject(new Error(`Build failed with code ${code}`))
          }
        })
        
        build.on('error', (error) => {
          console.error('❌ Error during build:', error.message)
          reject(error)
        })
      })
    }
    
    console.log('\n🚀 Starting Next.js server...\n')
    
    // Start the actual Next.js server
    const nextStart = spawn('pnpm', ['next', 'start'], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORT: process.env.PORT || '3000'
      }
    })
    
    nextStart.on('error', (error) => {
      console.error('❌ Failed to start server:', error.message)
      process.exit(1)
    })
    
    nextStart.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Server exited with code ${code}`)
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
    
  } catch (error) {
    console.error('❌ Failed to start application:', error.message)
    process.exit(1)
  }
}

// Run the startup sequence
runStartup()