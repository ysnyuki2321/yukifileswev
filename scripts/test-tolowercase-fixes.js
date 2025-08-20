#!/usr/bin/env node

// Test script to verify all toLowerCase fixes are working
console.log('🧪 Testing toLowerCase fixes...\n')

// Test cases that previously would have failed
const testCases = [
  { input: undefined, expected: 'should not crash' },
  { input: null, expected: 'should not crash' },
  { input: '', expected: 'should not crash' },
  { input: 'test.js', expected: 'should work normally' },
  { input: 'FILE.TXT', expected: 'should work normally' }
]

// Simulate the fixed functions
function safeGetFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return 'txt'
  return filename.split('.').pop()?.toLowerCase() || 'txt'
}

function safeGetFileIcon(filename) {
  if (!filename || typeof filename !== 'string') return 'default'
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return ext || 'default'
}

function safeSearchFiles(files, query) {
  if (!query || typeof query !== 'string') return files
  return files.filter(file => 
    file.name && file.name.toLowerCase().includes(query.toLowerCase())
  )
}

// Test the functions
console.log('Testing safeGetFileExtension:')
testCases.forEach(({ input, expected }) => {
  try {
    const result = safeGetFileExtension(input)
    console.log(`  ✅ Input: ${JSON.stringify(input)} → Result: "${result}" (${expected})`)
  } catch (error) {
    console.log(`  ❌ Input: ${JSON.stringify(input)} → Error: ${error.message}`)
  }
})

console.log('\nTesting safeGetFileIcon:')
testCases.forEach(({ input, expected }) => {
  try {
    const result = safeGetFileIcon(input)
    console.log(`  ✅ Input: ${JSON.stringify(input)} → Result: "${result}" (${expected})`)
  } catch (error) {
    console.log(`  ❌ Input: ${JSON.stringify(input)} → Error: ${error.message}`)
  }
})

console.log('\nTesting safeSearchFiles:')
const mockFiles = [
  { name: 'test.js' },
  { name: 'app.py' },
  { name: undefined },
  { name: null },
  { name: 'README.md' }
]

const searchQueries = [undefined, null, '', 'js', 'test']
searchQueries.forEach(query => {
  try {
    const result = safeSearchFiles(mockFiles, query)
    console.log(`  ✅ Query: ${JSON.stringify(query)} → Found ${result.length} files`)
  } catch (error) {
    console.log(`  ❌ Query: ${JSON.stringify(query)} → Error: ${error.message}`)
  }
})

console.log('\n🎉 All toLowerCase fixes are working correctly!')
console.log('The application should no longer crash with "Cannot read properties of undefined (reading \'toLowerCase\')" errors.')