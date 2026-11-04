# UsedCars.com™ | Premier Used & Brand New Car E-Commerce Platform

A fully responsive, modern, luxury e-commerce platform built with **React**, **TypeScript**, **Vite**, and custom modern CSS design system. It hosts over **51+ vehicles** across brand new 2026 factory models, certified pre-owned autos, and bank repossessions, along with 9 comprehensive SEO buyer guides, 15 verified customer reviews, and a complete administrative control portal.

---

## 🌟 Key Features

### 1. 51+ Verified Vehicle Inventory
- **Brand New 2026 Factory Models**: Porsche 911 GT3 RS Weissach, Tesla Model S Plaid, Mercedes-AMG G63, Lucid Air Sapphire, BMW M4 Competition, Chevrolet Corvette Z06, Rivian R1S, Toyota Land Cruiser First Edition, and more.
- **Used & Bank Seized Repossessions**: Transferred directly from previous WordPress/WooCommerce site database with full vehicle history, VIN, engine details, transmission, and photos.
- **Faceted Search & Filters**: Filter by Condition (*Brand New*, *Certified Pre-Owned*, *Used*, *Bank Repo / Hot Deals*), Make, Body Style, Price Slider ($0–$300,000), Year, Fuel Type, and Transmission.

### 2. Vehicle Details & Dynamic Financing Calculator
- **High-Resolution Photo Gallery**: Full-screen photo lightbox and multi-angle thumbnail slider.
- **Factory Specs**: Engine, Drivetrain, VIN, Title Status (MSO / Clean Title), Trim, Colors, and 150-Point Inspection certification.
- **Interactive Loan Estimator**: Real-time monthly payment calculation based on customizable down payment %, loan terms (36–72 months), and APR interest rate.

### 3. Complete E-Commerce Reservation & Checkout Flow
- **$500 Refundable Online Hold**: Allows customers to lock down vehicles for 72 hours before delivery or final wire transfer.
- **Delivery Options**: Nationwide Enclosed Carrier Home Delivery or Showroom VIP Pickup.
- **Trade-In Appraisal**: Integrated trade-in credit calculation against purchase.
- **Payment Simulations**: Credit Card (Stripe simulation), Bank Wire Escrow instructions, and Crypto (USDC/USDT).
- **Instant Printable Receipt**: Generated with order tracking number (e.g., `UC-849201`).

### 4. Transferred SEO Blog Posts & Buyer Guides
- 9 in-depth buyer guides transferred from the original platform (*Clean Titles vs. Salvage Titles*, *The Ultimate Guide to Buying Bank Repossessed Cars*, *Avoiding Common Scams*, *How Car Financing Works*, etc.).
- Categorized by Guides, News, and Buying Advice, with reading time metrics and related inventory recommendations.

### 5. Verified Customer Reviews
- 15 authentic buyer reviews transferred from the original database with 5-star ratings and verified buyer locations.

### 6. Protected Administrative Portal
- **Login Credentials**:
  - **Username**: `admin`
  - **Password**: `admin123`
- **Dashboard Features**:
  - Real-time inventory valuation metrics and order counters.
  - Vehicle manager (Add new vehicle, Edit specs, Delete, Mark as Sold/Available).
  - Orders & reservations tracking with status changer (*Deposit Paid*, *Confirmed*, *Delivered*).
  - Blog post editor.
  - **Database Migration Tool**: One-click download of the complete `schema_and_seed.sql` file and JSON dataset exports.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Local Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Local URL: `http://127.0.0.1:5174/`

### Production Build
```bash
npm run build
```

---

## 🗄️ SQL Schema & Database Migration

An executable PostgreSQL / Supabase SQL schema and seed file has been pre-generated at:
```
public/schema_and_seed.sql
```
This contains full `CREATE TABLE` DDL for `vehicles`, `posts`, `reviews`, and `orders`, followed by batch `INSERT INTO` statements for all 51 vehicles, 9 articles, and 15 reviews.
