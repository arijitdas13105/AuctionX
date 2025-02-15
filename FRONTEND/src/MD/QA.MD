#  **📍📍Redux State Assignment & Payload Handling in `authSlice`**  

#### **Incorrect Assignment (Bug)**
```javascript
state.token = action.payload;
state.userId = action.payload;
```
🔴 **What gets stored?**  
- `state.token` → `{ token, userId }` (entire object instead of just the token)  
- `state.userId` → `{ token, userId }` (same object, not just `userId`)  

#### **Correct Assignment (Fix)**
```javascript
state.token = action.payload.token;
state.userId = action.payload.userId;
```
✅ **What gets stored?**  
- `state.token` → `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` (only the token string)  
- `state.userId` → `21` (only the user ID)  

#### **Why This Matters?**  
If you assign `state.userId = action.payload;`, it stores `{ token, userId }`, so `console.log(userId)` prints an **object** instead of just `21`. Always extract values correctly from `action.payload`!


# 📍📍Preventing Click Propagation in React

## **Issue:**
Clicking inside a parent `<div>` triggers its `onClick`, even when clicking child elements like buttons.

## **Solution:**
Use `event.stopPropagation()` inside child elements' `onClick` handlers to prevent event bubbling.

## **Example:**
- Parent `<div>` has `onClick={() => navigate(...)}`.
- Child buttons (`Edit` & `Delete`) use `onClick={(e) => { e.stopPropagation(); handleClick(); }}`.

## **Key Takeaways:**
✅ Stops unwanted navigation when clicking buttons inside a card.
✅ Ensures only intended actions are triggered.
✅ Useful for modals, dropdowns, and nested click handlers.

Use `stopPropagation()` whenever child elements should not trigger parent click events. 🚀

