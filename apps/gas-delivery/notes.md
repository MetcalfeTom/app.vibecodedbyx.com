# Gas Tank Delivery App

## log
- 2026-01-09: Initial creation
  - Mobile-first design
  - Order form with tank selection
  - GPS location tracking
  - Supabase order storage
  - Order history tracking

## features
- 3 tank size options (small/medium/large)
- Quantity selector (1-10)
- GPS location button
- Address input
- Contact info form
- Order summary with pricing
- Order history tab
- Status tracking (pending/confirmed/delivering/delivered)
- Anonymous auth via Supabase

## database
- Table: gas_delivery_orders
- Columns: name, phone, address, latitude, longitude, 
  tank_size, quantity, notes, status, user_id, created_at

## pricing
- Small tank: $25
- Medium tank: $45
- Large tank: $75
- Delivery fee: $5

## design
- Clean mobile-first UI
- Inter font family
- Blue primary color (#2563eb)
- Card-based layout
- Rounded corners
- Status badges with colors

## screens
1. New Order - form with location, tank, contact
2. Order Success - confirmation with order ID
3. My Orders - order history list

## todos
- Add real map integration
- Add estimated delivery time
- Add payment integration
- Add push notifications
- Add driver tracking
- Add order cancellation
