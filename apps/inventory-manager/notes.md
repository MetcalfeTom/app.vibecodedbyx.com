# Neon Inventory Manager

## log
- 2026-01-10: Initial creation
  - Dashboard with stats
  - Products/SKUs management
  - Vendors management
  - Barcodes management
  - Supabase backend
  - Search and filtering
  - Category tabs
  - CRUD operations

## features
- Dashboard overview with key metrics
- Products/SKUs with full CRUD
- Vendors with contact info
- Barcode tracking (UPC, EAN, QR, etc.)
- Search across all tables
- Category filtering for products
- Low stock alerts
- Inventory value calculation
- Recent activity feed
- Modal forms for data entry
- Responsive design

## database tables
### inventory_products
- sku, name, description, category
- vendor_name, cost_price, sell_price
- quantity, min_stock, unit, location
- expiry_date, user_id, timestamps

### inventory_vendors
- name, contact_name, email, phone
- address, category, notes
- user_id, timestamps

### inventory_barcodes
- barcode, sku, product_name
- barcode_type, notes
- user_id, timestamps

## product categories
- Food
- Beverage
- Retail
- Other

## vendor categories
- Food Supplier
- Beverage Supplier
- Retail Supplier
- Distributor
- Other

## barcode types
- UPC-A, UPC-E
- EAN-13, EAN-8
- Code 128
- QR Code
- Custom

## dashboard stats
- Total Products
- Total Vendors
- Low Stock Items
- Total Inventory Value

## design
- Dark neon theme
- Cyan accent color
- Inter font family
- Sidebar navigation
- Card-based stats
- Table views with actions
- Modal forms
- Badge indicators

## todos
- Add barcode scanner using camera
- Add CSV import/export
- Add purchase order tracking
- Add inventory movements log
- Add expiry date alerts
- Add reporting/analytics
- Add multi-user collaboration
- Add print labels feature
