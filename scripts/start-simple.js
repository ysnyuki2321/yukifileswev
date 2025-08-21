#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('🚀 YukiFiles - Simple Startup')
console.log('📁 Working directory:', process.cwd())

// Check if we need to install dependencies
function needsInstall() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules')
  const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml')
  
  return !fs.existsSync(nodeModulesPath) || !fs.existsSync(pnpmLockPath)
}

// Install dependencies if needed
async function installIfNeeded() {
  if (needsInstall()) {
    console.log('📦 Installing dependencies...')
    
    return new Promise((resolve, reject) => {
      const install = spawn('pnpm', ['install'], {
        stdio: 'inherit',
        cwd: process.cwd()
      })
      
      install.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dependencies installed!')
          resolve()
        } else {
          reject(new Error(`Install failed: ${code}`))
        }
      })
    })
  }
  return Promise.resolve()
}

// Check if build exists
function needsBuild() {
  const buildPath = path.join(process.cwd(), '.next')
  return !fs.existsSync(buildPath)
}

// Build if needed
async function buildIfNeeded() {
  if (needsBuild()) {
    console.log('🔨 Building application...')
    
    return new Promise((resolve, reject) => {
      const build = spawn('pnpm', ['run', 'build'], {
        stdio: 'inherit',
        cwd: process.cwd()
      })
      
      build.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Build completed!')
          resolve()
        } else {
          reject(new Error(`Build failed: ${code}`))
        }
      })
    })
  }
  return Promise.resolve()
}

// Start the application
async function startApp() {
  try {
    // Install dependencies if needed
    await installIfNeeded()
    
    // Build if needed
    await buildIfNeeded()
    
    console.log('🚀 Starting Next.js server...')
    
    // Start Next.js
    const nextStart = spawn('pnpm', ['next', 'start'], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORT: process.env.PORT || '3000'
      }
    })
    
    nextStart.on('error', (error) => {
      console.error('❌ Server error:', error.message)
      process.exit(1)
    })
    
    nextStart.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Server exited: ${code}`)
        process.exit(code)
      }
    })
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...')
      nextStart.kill('SIGINT')
    })
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down...')
      nextStart.kill('SIGTERM')
    })
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message)
    process.exit(1)
  }
}

startApp()