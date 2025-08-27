# Authentication Guide

The itseze API supports multiple authentication methods to secure your applications and data.

## Authentication Methods

### 1. JWT Bearer Tokens (Recommended)

JWT (JSON Web Tokens) are the primary authentication method for user sessions.

#### Getting a JWT Token

```javascript
const response = await fetch('https://api.itseze.com/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'your-password'
  })
});

const { token, refreshToken } = await response.json();
```

#### Using JWT Tokens

```javascript
const response = await fetch('https://api.itseze.com/api/v1/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

#### Token Refresh

```javascript
async function refreshJWTToken(refreshToken) {
  const response = await fetch('https://api.itseze.com/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    })
  });
  
  if (response.ok) {
    const { token, refreshToken: newRefreshToken } = await response.json();
    return { token, refreshToken: newRefreshToken };
  } else {
    throw new Error('Token refresh failed');
  }
}
```

### 2. API Keys

API Keys are ideal for server-to-server communication and automated systems.

#### Creating an API Key

1. Log in to your itseze dashboard
2. Navigate to Settings > API Keys
3. Click "Create New API Key"
4. Set permissions and expiration
5. Copy the generated key (shown only once)

#### Using API Keys

```javascript
const response = await fetch('https://api.itseze.com/api/v1/data', {
  headers: {
    'X-API-Key': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
});
```

### 3. OAuth 2.0

OAuth 2.0 is perfect for third-party integrations and allowing users to grant access to their data.

#### Authorization Flow

```javascript
// Step 1: Redirect user to authorization URL
const authURL = `https://api.itseze.com/oauth/authorize?` +
  `client_id=your-client-id&` +
  `redirect_uri=${encodeURIComponent('https://yourapp.com/callback')}&` +
  `response_type=code&` +
  `scope=read write&` +
  `state=random-state-string`;

window.location.href = authURL;
```

```javascript
// Step 2: Exchange authorization code for access token
async function exchangeCodeForToken(code) {
  const response = await fetch('https://api.itseze.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'your-client-id',
      client_secret: 'your-client-secret',
      code: code,
      redirect_uri: 'https://yourapp.com/callback'
    })
  });
  
  const { access_token, refresh_token } = await response.json();
  return { access_token, refresh_token };
}
```

```javascript
// Step 3: Use access token
const response = await fetch('https://api.itseze.com/api/v1/users/profile', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  }
});
```

## Security Best Practices

### Token Storage

**DO:**
- Store tokens in secure, httpOnly cookies
- Use environment variables for API keys
- Implement token rotation
- Set appropriate expiration times

**DON'T:**
- Store tokens in localStorage in production
- Commit tokens to version control
- Use tokens in URL parameters
- Share tokens between environments

### Implementation Example

```javascript
class ItsezeAuth {
  constructor(config) {
    this.config = config;
    this.token = null;
    this.refreshToken = null;
    this.apiKey = config.apiKey;
  }
  
  async authenticate(credentials) {
    try {
      const response = await fetch(`${this.config.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      const data = await response.json();
      this.token = data.token;
      this.refreshToken = data.refreshToken;
      
      return data;
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }
  
  async makeAuthenticatedRequest(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add authentication header
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    } else if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    
    let response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle token expiration
    if (response.status === 401 && this.refreshToken) {
      await this.refreshAccessToken();
      headers.Authorization = `Bearer ${this.token}`;
      response = await fetch(url, { ...options, headers });
    }
    
    return response;
  }
  
  async refreshAccessToken() {
    const response = await fetch(`${this.config.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      this.token = data.token;
      this.refreshToken = data.refreshToken;
    } else {
      throw new Error('Token refresh failed');
    }
  }
  
  logout() {
    this.token = null;
    this.refreshToken = null;
  }
}
```

## Error Handling

### Common Authentication Errors

| Status Code | Error | Description | Solution |
|-------------|-------|-------------|----------|
| 401 | Unauthorized | Invalid or expired token | Refresh token or re-authenticate |
| 403 | Forbidden | Valid token but insufficient permissions | Check API key permissions |
| 429 | Too Many Requests | Rate limit exceeded | Implement exponential backoff |

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided token is invalid or expired",
    "details": {
      "expired_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Rate Limiting

Authentication affects rate limiting:

- **Unauthenticated**: 100 requests/hour
- **JWT Token**: 1,000 requests/hour  
- **API Key**: 10,000 requests/hour
- **OAuth**: Based on granted scopes

## Testing Authentication

### Unit Test Example

```javascript
const { ItsezeAuth } = require('./auth');

describe('itseze Authentication', () => {
  let auth;
  
  beforeEach(() => {
    auth = new ItsezeAuth({
      baseURL: 'https://api-test.itseze.com',
      apiKey: 'test-api-key'
    });
  });
  
  test('should authenticate with valid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    const result = await auth.authenticate(credentials);
    
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refreshToken');
  });
  
  test('should refresh expired tokens', async () => {
    // Mock expired token scenario
    auth.token = 'expired-token';
    auth.refreshToken = 'valid-refresh-token';
    
    await expect(auth.refreshAccessToken()).resolves.not.toThrow();
    expect(auth.token).toBeTruthy();
  });
});
```

## Environment Configuration

```env
# Authentication Configuration
ITSEZE_API_KEY=your_api_key_here
ITSEZE_JWT_SECRET=your_jwt_secret
ITSEZE_JWT_EXPIRES_IN=1h
ITSEZE_REFRESH_TOKEN_EXPIRES_IN=7d

# OAuth Configuration  
ITSEZE_OAUTH_CLIENT_ID=your_client_id
ITSEZE_OAUTH_CLIENT_SECRET=your_client_secret
ITSEZE_OAUTH_REDIRECT_URI=https://yourapp.com/callback

# Security Settings
ITSEZE_RATE_LIMIT_WINDOW=3600000
ITSEZE_RATE_LIMIT_MAX=1000
ITSEZE_TOKEN_ISSUER=itseze-api
```

---

For more information:
- [API Reference](api/README.md)
- [Getting Started](getting-started.md)
- [Security Guidelines](security.md)