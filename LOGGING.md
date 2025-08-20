# YukiFiles Custom Logging System

This document explains the custom logging system implemented for YukiFiles with professional startup sequences and structured logging.

## 🎯 Features

- **Animated Spinners**: Beautiful spinner animations during startup
- **Structured Logging**: Consistent log format with metadata
- **Color-Coded Output**: Different colors for different log levels
- **Service Categorization**: Logs organized by service (build, runtime, db, etc.)
- **Professional Startup**: Production-like startup sequence
- **Health Monitoring**: Built-in health check endpoint

## 📋 Available Commands

### Production Commands
```bash
# Start with full professional startup sequence
npm run start

# Start Next.js directly (no fancy logging)
npm run start:next
```

### Development Commands
```bash
# Development with quick start (recommended for daily dev)
npm run dev

# Development with full startup sequence
npm run dev:fancy

# Original Next.js dev (fastest)
npm run dev:quick
```

### Utility Commands
```bash
# Demo the logging system
npm run demo:logger

# Check application health
npm run health
```

## 🎨 Log Format

The logging system uses a structured format with the following components:

```
┌─ level: info │ time: 2025-08-20T09:12:01.032Z │ pid: 412 │ hostname: yuki-dev │ service: build │ step: installDependencies │ manager: pnpm │ platform: linux │ arch: x64 └─ message: Installing node modules (pnpm install)
```

### Log Components

- **level**: `info` | `warn` | `error` | `success`
- **time**: ISO timestamp
- **pid**: Process ID
- **hostname**: System hostname
- **service**: Service category (`build`, `runtime`, `db`, `health`, `git`, `assets`)
- **step**: Specific operation within the service
- **message**: Human-readable description

### Optional Components

- **cmd**: Command being executed
- **port**: Port number for network operations
- **file**: File being processed
- **manager**: Package manager (pnpm, npm, yarn)
- **platform**: Operating system
- **arch**: System architecture

## 🔧 Using the Logger in Your Code

### Import the Logger

```typescript
import { logInfo, logSuccess, logError, logWarn } from '@/lib/logger'
```

### Basic Usage

```typescript
// Log an info message
logInfo('api', 'fileUpload', 'Processing file upload', { 
  file: 'document.pdf',
  size: '2.5MB' 
})

// Log success
logSuccess('api', 'fileUpload', 'File uploaded successfully')

// Log error
logError('api', 'fileUpload', 'Upload failed: file too large', {
  maxSize: '10MB'
})

// Log warning
logWarn('api', 'fileUpload', 'File size approaching limit', {
  currentSize: '8MB',
  limit: '10MB'
})
```

### Advanced Usage with Custom Logger Instance

```typescript
import { StartupLogger } from '@/lib/logger'

const customLogger = new StartupLogger()

// Run full startup sequence
await customLogger.startupSequence()

// Custom logging
customLogger.logInfo('myService', 'myStep', 'Custom message', {
  customField: 'value',
  port: 3000,
  cmd: 'custom-command'
})
```

## 🌈 Spinner Frames

The logger uses rotating Unicode spinner characters for visual appeal:

```
⣾ ⣽ ⣻ ⢿ ⡿ ⣟ ⣯ ⣷
```

## 📊 Health Check Endpoint

The system includes a comprehensive health check at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

Response includes:
- System status
- Database connectivity
- Memory usage
- Uptime
- Environment info

## 🎭 Demo Mode

Run the logger demo to see the full startup sequence:

```bash
npm run demo:logger
```

This shows exactly what you'll see during production startup.

## 🔧 Environment Variables

Control logger behavior with environment variables:

```bash
# Show fancy startup in development
YUKIFILES_FANCY_DEV=true npm run dev

# Disable colors (for CI/CD)
NO_COLOR=1 npm run start
```

## 🎨 Color Scheme

- **Info**: Blue (`\x1b[34m`)
- **Success**: Green (`\x1b[32m`)
- **Warning**: Yellow (`\x1b[33m`)
- **Error**: Red (`\x1b[31m`)
- **Metadata**: Gray (`\x1b[90m`)
- **Values**: Cyan, Magenta, White (context-dependent)

## 📝 Example Startup Output

```
⣾ Allocating resources for YukiFiles web app...
All required packages are already installed. Skipping installation.
[Exit] Success (code: 0)

Detected environment: Node.js 20.14.0
 Setting package manager: pnpm
 Final environment: linux x64

Checking project structure...
project-root/
  ├─ app/
  ├─ components/
  ├─ public/
  ├─ package.json
  ├─ pnpm-lock.yaml
  └─ tsconfig.json
[OK] Project structure valid.

┌─ level: info │ time: 2025-08-20T09:12:01.032Z │ pid: 412 │ hostname: yuki-dev │ service: build │ step: installDependencies │ manager: pnpm │ platform: linux │ arch: x64 └─ message: Installing node modules (pnpm install)

⣽ ┌─ level: info │ time: 2025-08-20T09:12:10.210Z │ pid: 412 │ service: build │ step: nextBuild │ cmd: pnpm build └─ message: Starting Next.js build

Startup completed [Status] Running (code: 0)
[Status] Web app running at https://yukifiles.vercel.app
```

## 🚀 Integration with Deployment

The logging system is designed to work seamlessly with:
- Docker containers
- Vercel deployments
- PM2 process management
- Systemd services
- CI/CD pipelines

The structured format makes it easy to parse logs with tools like:
- `jq` for JSON parsing
- `grep` for filtering
- Log aggregation services (ELK, Splunk, etc.)

## 📈 Performance Impact

The logging system is optimized for minimal performance impact:
- Async operations where possible
- Efficient string formatting
- Minimal memory allocation
- Optional features can be disabled

## 🔍 Troubleshooting

### Common Issues

1. **Scripts not executable**: Run `chmod +x scripts/*.js`
2. **Module import errors**: Ensure you're using Node.js 18+
3. **Colors not showing**: Check if `NO_COLOR` environment variable is set
4. **Health check fails**: Ensure the server is running on the expected port

### Debug Mode

Enable verbose logging:

```bash
DEBUG=yukifiles:* npm run start
```

This provides additional debug information for troubleshooting.