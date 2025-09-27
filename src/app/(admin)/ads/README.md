# Ads Management System

This module handles the management of 6 advertisement slots across different sections of the application.

## Ad Slots Configuration

The system manages 6 specific ad slots:

1. **Questionnaire Section (3 slots)**
   - Ad #1: Square (200x200px)
   - Ad #2: Square (200x200px) 
   - Ad #3: Square (200x200px)

2. **Loading Section (2 slots)**
   - Ad #4: Poster (260x200px)
   - Ad #5: Banner Medium (520x160px)

3. **Dashboard Section (1 slot)**
   - Ad #6: Banner Wide (920x260px)

## Features

- **Image Upload**: Upload images for each ad slot
- **Target URL**: Set clickable links for each ad
- **Real-time Updates**: Changes are immediately reflected in the UI
- **File Validation**: Only image files up to 5MB are allowed
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

- `GET /api/ads/get` - Fetch all ads
- `PATCH /api/ads/update` - Update specific ad by adNumber
- `POST /api/ads/upload` - Upload image for specific ad

## Database Schema

Ads are stored in MongoDB with the following structure:
- `_id`: MongoDB ObjectId
- `adNumber`: Number (1-6)
- `section`: "questionnaire" | "loading" | "dashboard"
- `shape`: "square" | "banner-wide" | "banner-medium" | "poster"
- `imageUrl`: String (path to uploaded image)
- `targetUrl`: String (clickable link)
- `order`: Number (same as adNumber)
- `createdAt`: Date
- `updatedAt`: Date

## File Storage

Uploaded images are stored in `public/uploads/ads/` with the naming convention:
`ad-{adNumber}-{timestamp}.{extension}`

Example: `ad-1-1695834567890.jpg`
