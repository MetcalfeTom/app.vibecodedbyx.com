# Stock Manager

## log
- 2026-01-10: Simplified to focus on stock levels and transfers
  - Removed vendors, barcodes, complex categories
  - Added Transfer Log section
  - Added On Order amounts
  - Added detailed descriptions
  - Stock level bars with visual indicators
  - Quick transfer button per item
- 2026-01-10: Initial creation

## features
- Stock Levels view with visual bars
- Transfer Log for all movements
- On Order tracking
- Low stock alerts
- Detailed product descriptions
- Quick transfer from stock list
- Search and filtering
- Transfer types: In, Out, Transfer, Adjustment

## database tables
### inventory_products
- sku, name, description
- quantity, min_stock, location
- sell_price (used as on_order)
- user_id, timestamps

### inventory_transfers
- sku, product_name, quantity
- transfer_type (in/out/transfer/adjustment)
- from_location, to_location
- notes, user_id, timestamps

## stats
- Total Items
- Low Stock count
- On Order count
- Total Units

## transfer types
- Stock In: Receiving inventory
- Stock Out: Shipping/using
- Internal Transfer: Between locations
- Adjustment: Corrections

## design
- Simplified 2-tab layout
- Stock Levels + Transfer Log
- Neon cyan theme
- Visual stock level bars
- Badge indicators (Low/OK/On Order)
- Clean transfer log with icons

## todos
- Auto-update stock on transfer
- Add receiving PO numbers
- Add export to CSV
- Add low stock notifications
- Add reorder suggestions
