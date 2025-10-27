# Seller Dashboard Feature

## Overview
The Seller Dashboard is a comprehensive management interface for shop owners to manage their E-Bazar presence, built with your website's exact theme and design language.

## Features

### 1. **Dashboard Analytics**
- **Total Visitors**: Track how many customers have visited your shop page
- **Rating**: View your current shop rating
- **Reviews**: See the number of reviews you've received
- **Products**: Monitor your product count

### 2. **Shop Information Management**
- Edit shop name, contact, address, and description
- View your current plan (Free, Standard, or Premium)
- Real-time updates with save/cancel functionality

### 3. **Image Upload & Management**
- Upload multiple shop images
- Preview uploaded images in a professional grid layout
- Delete images with one click
- Images stored securely in localStorage

### 4. **Visitor Analytics**
- Automatic visitor tracking when customers view your shop page
- Visitor count increments with each shop page visit
- Persistent tracking across sessions

### 5. **Delete Shop**
- Safe deletion with confirmation modal
- Complete data removal including images and analytics
- Warning message to prevent accidental deletion

## User Flow

### Registration Flow
1. User selects a package at `/register`
2. User fills shop details at `/register/details`
3. Upon successful registration, user is redirected to `/dashboard`

### Dashboard Access
- Access dashboard at `/dashboard`
- If no shop is registered, automatically redirected to `/register`
- Most recent shop data is loaded automatically

## Design Theme

The dashboard uses the exact same design system as your main website:

### Color Palette
- **Sand**: `#f6f0e4` - Warm background
- **Warm Gray**: `#e6e2db` - Secondary background
- **Deep Gray**: `#2f2f2f` - Primary text and buttons
- **Accent**: `#b68c57` - Highlights and interactive elements

### Design Elements
- Gradient backgrounds matching homepage
- Glassmorphism with backdrop blur
- Clean card-based layouts with subtle borders
- Consistent border-radius (8px, 12px, 16px)
- Smooth hover transitions with translateY effects
- Typography matching main site (Poppins font)
- Responsive design for all screen sizes

### Styling Features
- White translucent cards with backdrop blur
- Sand-to-warm-gray gradient backgrounds
- Deep gray buttons with sand-colored text
- Accent color for save actions and highlights
- Consistent spacing and padding throughout

## Technical Implementation

### Data Storage
All data is stored in localStorage (no backend required):
- **Shop Data**: `eBazarShops`
- **Shop Images**: `eBazarShops_images_{shopId}`
- **Visitor Count**: `eBazarShops_visitors_{shopId}`

### Routes
- `/register` - Package selection
- `/register/details` - Shop registration form
- `/dashboard` - Seller dashboard (protected)

### Files
- **Dashboard Page**: `/src/app/dashboard/page.js`
- **Dashboard Styles**: `/src/app/dashboard/page.module.css`
- **Error Boundary**: `/src/app/dashboard/error.js`

### CSS Variables Used
```css
--color-sand: #f6f0e4
--color-warm-gray: #e6e2db
--color-deep-gray: #2f2f2f
--color-accent: #b68c57
```

## Styling Consistency

The dashboard maintains perfect visual consistency with your website:
- Same navbar design with glassmorphism
- Identical button styles and hover effects
- Matching card layouts and shadows
- Consistent typography and spacing
- Same responsive breakpoints
- Unified color scheme throughout

## Future Enhancements
- Multi-shop support for sellers
- Advanced analytics (views by date, popular products)
- Product management (add/edit/delete products)
- Order management
- Customer reviews management
- Image optimization and CDN support
- Real-time notifications
