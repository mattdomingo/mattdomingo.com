# 🐕 Secret "Puppy Dog of the Day" Page

A hidden page that displays a different dog image and breed information each day, built with a minecraft-themed design consistent with the portfolio site.

## 🚀 Features

- **Daily Dog Content**: Fetches new dog data every 24 hours using ISR (Incremental Static Regeneration)
- **Breed Information**: Displays detailed facts about the dog breed when available
- **Graceful Fallbacks**: Shows "Unknown mystery pup" when breed data is missing
- **Direct URL Access**: Anyone who knows the URL can access it
- **Responsive Design**: Minecraft-themed styling that works on all devices
- **Error Handling**: Friendly error messages with retry logic
- **Performance Optimized**: Uses Next.js caching and static generation

## 📍 Access

- **Route**: `/secret`
- **Access**: Direct URL access for anyone who knows the route
- **Security**: Through obscurity - not linked from navigation

## 🔧 Setup

### 1. Environment Variables

Create a `.env.local` file with:

```env
# Required: Get your API key from https://thedogapi.com/
DOG_API_KEY=your_dog_api_key_here
```

### 2. API Key Setup

1. Visit [The Dog API](https://thedogapi.com/)
2. Sign up for a free account
3. Copy your API key to the `DOG_API_KEY` environment variable
4. Test your API key:
   ```bash
   curl -H "x-api-key: YOUR_API_KEY" "https://api.thedogapi.com/v1/images/search?include_breeds=true&size=med&limit=1"
   ```

### 3. Verify Integration

The implementation follows [The Dog API documentation](https://docs.thedogapi.com/docs/examples/breeds) for breed data:

- **Endpoint**: `https://api.thedogapi.com/v1/images/search?include_breeds=true&size=med&limit=1`
- **Headers**: `x-api-key` for authentication
- **Breed Matching**: Images are matched with their corresponding breed facts
- **Retry Logic**: Automatically retries up to 3 times for better breed data

## 🎨 Design

The page follows the site's minecraft theme with:
- **Planks texture background** for consistency
- **Minecraft-style frames** for content containers
- **Pixelated fonts** and text shadows
- **Hover effects** on images with smooth scaling
- **Gold accents** for highlighting important information
- **Responsive layout** that adapts to mobile devices

## 🧪 Testing

### Unit Tests
```bash
npm test
```

Tests the `formatDogFacts` utility function with various data scenarios:
- Complete breed information
- Missing fields
- No breed data
- Weight/height formatting

### E2E Tests
```bash
npm run cypress:open
```

Tests the full page functionality:
- Page loads and displays content
- API integration works correctly
- Loading states appear
- Error handling works
- Hover effects function
- Responsive design

## 🏗️ Architecture

### Components
- **`app/secret/page.tsx`**: Main page component with direct URL access
- **`lib/fetchDog.ts`**: Enhanced API utilities and data transformation
- **Minecraft styling**: Integrated into `globals.css`

### API Integration
- **Endpoint**: `https://api.thedogapi.com/v1/images/search?include_breeds=true&size=med&limit=1`
- **Caching**: 24-hour ISR for daily content updates
- **Retry Logic**: Progressive backoff with up to 3 retry attempts
- **Fallbacks**: Handles missing breed data gracefully
- **Validation**: Ensures image URLs and breed data are valid

### Access Control
```typescript
// Accessible to anyone who knows the direct URL
// Security through obscurity - no navigation links to this page
function checkAccess() {
  return true // Direct URL access allowed
}
```

## 🐕 Breed Data Quality

The implementation ensures high-quality breed information by:

1. **Enhanced Retry Logic**: Up to 3 attempts to get breed-rich images
2. **Progressive Backoff**: Delays between retries to avoid rate limiting  
3. **Data Validation**: Verifies image URLs and breed information
4. **Breed Matching**: Ensures displayed facts match the actual dog image
5. **Debug Information**: Shows breed ID in development mode for verification

## 🚀 Deployment

The page is production-ready with:
- ✅ TypeScript type safety
- ✅ Next.js 15 compatibility 
- ✅ ISR caching optimization
- ✅ Responsive design
- ✅ Error boundaries
- ✅ Accessibility features
- ✅ SEO optimization

## 🎯 Usage Examples

### Direct URL Access
```
http://localhost:3000/secret        # Development
https://yourdomain.com/secret       # Production
```

Anyone who knows this URL can access the page, but it's not discoverable through site navigation.

## 🔧 Troubleshooting

### Common Issues

1. **"DOG_API_KEY is not configured"**
   - Ensure `.env.local` exists in project root
   - Verify API key is set: `DOG_API_KEY=your_actual_key`
   - Test API key manually with curl command above

2. **Images without breed data**
   - Normal behavior - some images don't have breed information
   - Retry logic will attempt to find breed-rich images
   - Falls back to "Unknown mystery pup" gracefully

3. **API Rate Limiting**
   - Free tier has rate limits
   - Progressive backoff helps avoid limits
   - Consider upgrading API plan for high traffic

## 🐾 Fun Facts

The page displays various dog breed information including:
- Breed name and group
- What they were bred for
- Temperament traits
- Life span
- Physical dimensions (height/weight)

Each day brings a new surprise puppy to discover! 🐕✨ 