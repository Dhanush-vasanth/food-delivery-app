# Testing Order Placement

## Backend Fixes Applied ✅

1. **Auth Middleware** - Now safely initializes `req.body` before setting properties
2. **Order Controller** - Now extracts `userId` from the auth token instead of request body
3. **Order Validation** - Added better error messages and validation
4. **Frontend PlaceOrder** - Added comprehensive error handling and logging

## Steps to Test Order

### 1. Login to Frontend
- Go to http://localhost:5173
- Click on Profile icon (top right)
- Sign up or login

### 2. Add Items to Cart
- Browse menu and add items to cart
- Cart should show items

### 3. Go to Cart
- Click cart icon
- Click "Proceed to Checkout"

### 4. Fill Delivery Information
- First Name: Any name
- Last Name: Any name
- Email: Valid email
- Street, City, State, Zip: Any values
- Country: India
- Phone: 10 digits

### 5. Click "PROCEED TO PAYMENT"
- If it works: Razorpay modal should appear
- If error: Browser console will show detailed error (F12 → Console)

### 6. If Error
Check:
- Backend terminal for error logs
- Browser console (F12) for error messages
- Copy the exact error message and share it

## Quick Debug Checklist

- [ ] Backend running? Check http://localhost:4000 shows "API Working"
- [ ] Frontend running? Check http://localhost:5173 loads
- [ ] User logged in? Check profile shows email
- [ ] Items in cart? Check cart shows items with prices
- [ ] Token exists? Open browser DevTools → Application → localStorage → look for "token"
- [ ] Backend console shows "DB Connected"?

## Common Issues

| Issue | Solution |
|-------|----------|
| "Not Authorized" | Log out and log back in to refresh token |
| "Missing required fields" | All fields in delivery form must be filled |
| "Error while placing order" | Check backend terminal for specific error |
| Razorpay not appearing | Check if Razorpay test keys are set in .env |
