# 🍽️ FoodHub - Online Food Delivery Website

A modern, responsive web application for ordering food online.

## Features

- 🍕 **13 Pre-loaded Menu Items** - Pizza, burgers, salads, desserts, and drinks
- 🛒 **Full Shopping Cart** - Add/remove items, manage quantities
- 🏷️ **Category Filtering** - Filter by food type
- 📦 **Order Management** - Complete checkout with delivery details
- 💾 **Persistent Storage** - Orders saved in browser
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean, professional interface with smooth animations

## Pages

- **index.html** - Home page with hero section, featured products, and menu
- **cart.html** - Shopping cart with order summary and checkout
- **styles.css** - All styling and responsive design
- **script.js** - Menu and product functionality
- **cart.js** - Cart management and checkout

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Or run a local server:
   ```bash
   python -m http.server 8000
   ```
4. Visit `http://localhost:8000`

## How to Order

1. Browse the menu or use category filters
2. Click on products to view details
3. Add items to your cart
4. Go to cart and adjust quantities
5. Proceed to checkout
6. Fill in delivery details and payment method
7. Place order (saves locally)

## Menu Categories

- **Pizza** - Classic and specialty pizzas
- **Burgers** - Beef burgers with various toppings
- **Salads** - Fresh salads
- **Desserts** - Cakes, cheesecake, ice cream
- **Drinks** - Soft drinks, juices, coffee

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: LocalStorage API
- **Responsive**: CSS Grid and Flexbox

## Project Structure

```
├── index.html       # Main page
├── cart.html        # Cart page
├── styles.css       # All styling
├── script.js        # Product and menu logic
├── cart.js          # Cart management
└── README.md        # This file
```

## Features Explained

### Shopping Cart
- Items persist in browser using LocalStorage
- Cart count badge on navbar
- Quantity controls for each item
- Real-time total calculation

### Checkout Process
- Complete customer information form
- Delivery address input
- Special instructions field
- Multiple payment methods
- Order confirmation with ID

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly buttons
- Optimized images and emojis

## Customization

### Add New Products
Edit `script.js` and add to the `products` array:
```javascript
{
    id: 14,
    name: "Your Dish",
    category: "category-name",
    price: 9.99,
    emoji: "🍲",
    description: "Description here",
    rating: "⭐⭐⭐⭐⭐"
}
```

### Change Colors
Edit `styles.css` and modify the color variables:
- Primary: `#ff6b35` (Orange)
- Secondary: `#004e89` (Blue)
- Background: `#f9f9f9`

## Browser Support

- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

## Future Enhancements

- Backend API integration
- User accounts and login
- Real payment processing
- Order tracking
- Admin dashboard
- Restaurant management
- Multiple restaurant support

## License

Free to use and modify

## Author

Created by muddywa3

---

**Enjoy your FoodHub ordering experience! 🍽️**
