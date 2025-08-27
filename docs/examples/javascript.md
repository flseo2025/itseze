# JavaScript/Node.js SDK Examples

Complete examples for using the itseze API with JavaScript and Node.js.

## Installation

```bash
npm install itseze
```

## Basic Setup

### ES Modules (Recommended)
```javascript
import { ItsezeAPI } from 'itseze';
import dotenv from 'dotenv';

dotenv.config();

const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY,
  baseURL: process.env.ITSEZE_BASE_URL || 'https://api.itseze.com',
  version: 'v1'
});
```

### CommonJS
```javascript
const { ItsezeAPI } = require('itseze');
require('dotenv').config();

const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY
});
```

## Authentication Examples

### JWT Authentication
```javascript
async function authenticateUser() {
  try {
    // Login with credentials
    const authResult = await client.auth.login({
      email: 'user@example.com',
      password: 'securepassword'
    });
    
    console.log('Authentication successful:', authResult);
    
    // The client will automatically use the returned token
    // for subsequent requests
    
    return authResult;
  } catch (error) {
    console.error('Authentication failed:', error.message);
    throw error;
  }
}

// Usage
authenticateUser()
  .then(result => console.log('User authenticated:', result.user.email))
  .catch(console.error);
```

### API Key Authentication
```javascript
const apiClient = new ItsezeAPI({
  apiKey: 'your-api-key-here',
  authType: 'api-key'
});

async function serverToServerCall() {
  try {
    const data = await apiClient.data.list({
      limit: 50,
      filters: { type: 'system' }
    });
    
    console.log(`Retrieved ${data.items.length} items`);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

## CRUD Operations

### Create Data
```javascript
async function createDataEntry() {
  try {
    const newEntry = await client.data.create({
      title: 'My New Entry',
      category: 'documentation',
      content: {
        description: 'Detailed description here',
        tags: ['api', 'example', 'javascript'],
        metadata: {
          source: 'api-example',
          priority: 'medium',
          created_by: 'system'
        }
      },
      visibility: 'public'
    });
    
    console.log('Created entry with ID:', newEntry.id);
    return newEntry;
  } catch (error) {
    if (error.status === 422) {
      console.error('Validation errors:', error.details);
    } else {
      console.error('Creation failed:', error.message);
    }
    throw error;
  }
}
```

### Read Data
```javascript
async function fetchDataEntries() {
  try {
    // Get all entries with pagination
    const allEntries = await client.data.list({
      page: 1,
      limit: 20,
      sort: 'created_at:desc'
    });
    
    console.log(`Found ${allEntries.total} total entries`);
    
    // Get specific entry by ID
    const specificEntry = await client.data.getById('entry-id-123');
    console.log('Entry details:', specificEntry);
    
    // Search entries
    const searchResults = await client.data.search({
      query: 'javascript examples',
      filters: {
        category: 'documentation',
        created_after: '2024-01-01'
      },
      fields: ['title', 'content', 'tags']
    });
    
    console.log(`Search returned ${searchResults.hits} results`);
    
    return { allEntries, specificEntry, searchResults };
  } catch (error) {
    console.error('Data retrieval failed:', error);
    throw error;
  }
}
```

### Update Data
```javascript
async function updateDataEntry(entryId, updates) {
  try {
    // Partial update
    const updatedEntry = await client.data.update(entryId, {
      title: 'Updated Title',
      content: {
        ...updates.content,
        last_modified: new Date().toISOString()
      }
    });
    
    console.log('Entry updated:', updatedEntry.id);
    
    // Full replacement
    const replacedEntry = await client.data.replace(entryId, {
      title: 'Completely New Entry',
      category: 'updated',
      content: updates.fullContent
    });
    
    return { updatedEntry, replacedEntry };
  } catch (error) {
    if (error.status === 404) {
      console.error('Entry not found:', entryId);
    } else if (error.status === 409) {
      console.error('Conflict detected:', error.message);
    } else {
      console.error('Update failed:', error);
    }
    throw error;
  }
}
```

### Delete Data
```javascript
async function deleteDataEntry(entryId) {
  try {
    // Soft delete (if supported)
    await client.data.delete(entryId, { soft: true });
    console.log('Entry soft deleted:', entryId);
    
    // Hard delete
    await client.data.delete(entryId, { permanent: true });
    console.log('Entry permanently deleted:', entryId);
    
    // Batch delete
    const deleteResult = await client.data.batchDelete([
      'entry-1',
      'entry-2',
      'entry-3'
    ]);
    
    console.log(`Deleted ${deleteResult.success.length} entries`);
    if (deleteResult.errors.length > 0) {
      console.warn('Some deletions failed:', deleteResult.errors);
    }
    
    return deleteResult;
  } catch (error) {
    console.error('Deletion failed:', error);
    throw error;
  }
}
```

## File Operations

### Upload Files
```javascript
import fs from 'fs';
import FormData from 'form-data';

async function uploadFile() {
  try {
    // Single file upload
    const fileBuffer = fs.readFileSync('./example-file.pdf');
    
    const uploadResult = await client.files.upload({
      file: fileBuffer,
      filename: 'example-file.pdf',
      mimeType: 'application/pdf',
      metadata: {
        category: 'documents',
        description: 'Example PDF file',
        tags: ['pdf', 'document']
      }
    });
    
    console.log('File uploaded:', uploadResult.id);
    
    // Multiple file upload
    const files = [
      { path: './file1.txt', category: 'text' },
      { path: './file2.jpg', category: 'images' },
      { path: './file3.json', category: 'data' }
    ];
    
    const multiUploadResults = await Promise.all(
      files.map(async (file) => {
        const buffer = fs.readFileSync(file.path);
        return client.files.upload({
          file: buffer,
          filename: file.path.split('/').pop(),
          metadata: { category: file.category }
        });
      })
    );
    
    console.log(`Uploaded ${multiUploadResults.length} files`);
    
    return { single: uploadResult, multiple: multiUploadResults };
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}
```

### Download Files
```javascript
async function downloadFile(fileId) {
  try {
    // Get file metadata
    const fileInfo = await client.files.getInfo(fileId);
    console.log('File info:', fileInfo);
    
    // Download file content
    const fileData = await client.files.download(fileId);
    
    // Save to local filesystem
    fs.writeFileSync(`./downloads/${fileInfo.filename}`, fileData);
    console.log(`File saved: ./downloads/${fileInfo.filename}`);
    
    // Get temporary download URL
    const downloadUrl = await client.files.getDownloadUrl(fileId, {
      expiresIn: 3600 // 1 hour
    });
    
    console.log('Temporary download URL:', downloadUrl);
    
    return { fileInfo, downloadUrl };
  } catch (error) {
    console.error('File download failed:', error);
    throw error;
  }
}
```

## Advanced Features

### Error Handling with Retry
```javascript
class ItsezeClientWithRetry {
  constructor(config) {
    this.client = new ItsezeAPI(config);
    this.maxRetries = 3;
    this.retryDelay = 1000; // Start with 1 second
  }
  
  async makeRequestWithRetry(operation, ...args) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation.call(this.client, ...args);
      } catch (error) {
        lastError = error;
        
        // Don't retry client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === this.maxRetries) {
          break;
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const retryClient = new ItsezeClientWithRetry({
  apiKey: process.env.ITSEZE_API_KEY
});

async function robustApiCall() {
  try {
    const result = await retryClient.makeRequestWithRetry(
      retryClient.client.data.list,
      { limit: 10 }
    );
    return result;
  } catch (error) {
    console.error('All retry attempts failed:', error);
    throw error;
  }
}
```

### Request Interceptors
```javascript
const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY,
  interceptors: {
    request: (config) => {
      // Add custom headers
      config.headers['X-Client-Version'] = '1.0.0';
      config.headers['X-Request-ID'] = generateRequestId();
      
      // Log outgoing requests
      console.log(`Making request to: ${config.url}`);
      console.log('Request headers:', config.headers);
      
      return config;
    },
    response: (response) => {
      // Log response details
      console.log(`Response status: ${response.status}`);
      console.log('Response headers:', response.headers);
      
      // Transform response data if needed
      if (response.data && typeof response.data === 'object') {
        response.data.timestamp = new Date().toISOString();
      }
      
      return response;
    }
  }
});

function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

### Real-time Subscriptions
```javascript
import { EventSource } from 'eventsource';

class ItsezeRealTime {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.subscriptions = new Map();
  }
  
  subscribe(channel, callback) {
    const eventSource = new EventSource(
      `https://api.itseze.com/stream/${channel}?api_key=${this.apiKey}`
    );
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Failed to parse SSE data:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };
    
    this.subscriptions.set(channel, eventSource);
    return eventSource;
  }
  
  unsubscribe(channel) {
    const eventSource = this.subscriptions.get(channel);
    if (eventSource) {
      eventSource.close();
      this.subscriptions.delete(channel);
    }
  }
  
  unsubscribeAll() {
    this.subscriptions.forEach((eventSource, channel) => {
      eventSource.close();
    });
    this.subscriptions.clear();
  }
}

// Usage
const realTime = new ItsezeRealTime(process.env.ITSEZE_API_KEY);

realTime.subscribe('data-updates', (data) => {
  console.log('Data updated:', data);
});

realTime.subscribe('user-activity', (activity) => {
  console.log('User activity:', activity);
});
```

## Complete Application Example

```javascript
import { ItsezeAPI } from 'itseze';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize API client
const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY
});

// Middleware for API key validation
app.use('/api', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }
    
    // Validate API key with itseze
    const validation = await client.auth.validateApiKey(apiKey);
    if (!validation.valid) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    req.user = validation.user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication service unavailable' });
  }
});

// Routes
app.get('/api/data', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    
    let result;
    if (search) {
      result = await client.data.search({
        query: search,
        filters,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } else {
      result = await client.data.list({
        filters,
        page: parseInt(page),
        limit: parseInt(limit),
        sort: 'created_at:desc'
      });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newEntry = await client.data.create({
      ...req.body,
      created_by: req.user.id
    });
    
    res.status(201).json(newEntry);
  } catch (error) {
    if (error.status === 422) {
      res.status(422).json({ error: 'Validation failed', details: error.details });
    } else {
      console.error('Failed to create entry:', error);
      res.status(500).json({ error: 'Failed to create entry' });
    }
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing Examples

```javascript
import { describe, test, expect, beforeEach } from '@jest/globals';
import { ItsezeAPI } from 'itseze';

describe('itseze API Integration', () => {
  let client;
  
  beforeEach(() => {
    client = new ItsezeAPI({
      apiKey: process.env.ITSEZE_TEST_API_KEY,
      baseURL: 'https://api-test.itseze.com'
    });
  });
  
  test('should authenticate successfully', async () => {
    const result = await client.auth.login({
      email: 'test@example.com',
      password: 'testpass'
    });
    
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe('test@example.com');
  });
  
  test('should create and retrieve data entry', async () => {
    const entry = await client.data.create({
      title: 'Test Entry',
      category: 'test',
      content: { message: 'Hello Test' }
    });
    
    expect(entry).toHaveProperty('id');
    expect(entry.title).toBe('Test Entry');
    
    const retrieved = await client.data.getById(entry.id);
    expect(retrieved.id).toBe(entry.id);
  });
  
  test('should handle errors gracefully', async () => {
    await expect(
      client.data.getById('non-existent-id')
    ).rejects.toMatchObject({
      status: 404,
      message: expect.stringContaining('not found')
    });
  });
});
```

---

For more examples and detailed API reference, see:
- [API Reference](../api/README.md)
- [Python Examples](python.md)
- [cURL Examples](curl.md)