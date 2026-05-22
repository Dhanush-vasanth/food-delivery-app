# Admin Panel - Add Food Items - Debugging Guide

## Steps to Debug the Issue

### 1. **Clear Browser Cache & Reload**
- Press `F12` to open Developer Tools
- Go to **Network** tab
- Check **"Disable cache"** checkbox
- Press `Ctrl+Shift+R` (hard refresh)
- Close DevTools (`F12`)

### 2. **Check Admin Panel Console for Errors**
- Open admin panel: http://localhost:5174
- Press `F12` → Go to **Console** tab
- Try to add a food item
- Look for any red error messages
- **Take screenshot of any errors**

### 3. **Check Backend Server Logs**
- Look at the terminal where backend is running
- Try to add a food item in admin panel
- Look for error messages in the backend terminal
- **Take screenshot of backend errors**

### 4. **Verify Login Token**
- Press `F12` → Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
- Look for **Local Storage**
- Check if `adminToken` exists
- If it exists, copy the value and verify it looks like a valid JWT token
- **Report: Token exists? (Yes/No)**

### 5. **Test in Backend Terminal**
- Open a new terminal and go to backend folder:
  ```bash
  cd C:\projects\food-del\backend
  npm start
  ```
- Should see: `DB Connected` and `Server is running on http://localhost:4000`
- **Report: Backend starts successfully? (Yes/No)**

### 6. **Test API Directly (if you know curl)**
- In a terminal, test the login endpoint:
  ```bash
  curl -X POST http://localhost:4000/api/user/admin/login ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"vasanthmuthukumar7@gmail.com\",\"password\":\"742612\"}"
  ```
- You should get back a token
- **Report: Get token response? (Yes/No)**

### 7. **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| "Not Authorized Login Again" | Token expired or not sent. Try logging out and back in. |
| "Image is required" | Select an image file in the upload area before clicking ADD |
| "Product name is required" | Fill in all fields before submitting |
| No error, but nothing happens | Check backend logs. Might be database connection issue. |
| 404 error in console | Backend might not be running. Check http://localhost:4000 |

### 8. **Fresh Start (Nuclear Option)**
If nothing works, try this:

1. **Stop all running services** (close all terminals)
2. **Delete node_modules and reinstall:**
   ```bash
   cd C:\projects\food-del\backend
   rm -r node_modules package-lock.json
   npm install
   npm start
   ```
3. **In another terminal, restart admin panel:**
   ```bash
   cd C:\projects\food-del\admin
   rm -r node_modules package-lock.json  
   npm install
   npm run dev
   ```

## What to Report

When you see the error, please provide:
1. **Screenshot of the error in browser console** (F12 → Console tab)
2. **Screenshot of backend terminal output**
3. **Whether token exists in Local Storage** (F12 → Application/Storage)
4. **Exact error message shown in toast notification**

This will help identify the exact issue!
