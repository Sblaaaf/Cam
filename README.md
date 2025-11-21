# ESportBet - Esport Betting Platform POC

A mobile-first proof-of-concept for an online Esport betting platform built with Next.js, Node.js, HTML/CSS, and PocketBase API.

![Dark Mode Gaming UI](https://img.shields.io/badge/Theme-Dark%20Mode-000000?style=for-the-badge)
![Mobile First](https://img.shields.io/badge/Design-Mobile%20First-00ff88?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎮 User Roles & Permissions

- **Visitors** - Browse matches and rankings without login
- **Users** - Place bets, track stats with charts, manage wallet, purchase goodies
- **Moderators** - Manage teams and matches
- **Admins** - Full system control including user management

### 🎯 Core Functionality

#### For All Users
- Browse live, upcoming, and finished matches
- View team rankings with win rates
- Minimalist gaming UI with dark mode and flashy accents

#### For Logged-in Users
- **Betting System** - Place bets on matches with real-time odds
- **My Bets** - Track betting history and results
- **Statistics** - Visual charts showing betting performance
- **Wallet** - Top up credits and simulate withdrawals
- **Goodies Store** - Spend credits on exclusive merchandise
- Starting bonus: 1000 credits on registration

#### For Moderators & Admins
- Create and manage teams
- Schedule and manage matches
- Update match statuses and winners
- Manage user accounts (admins only)
- Set betting odds

## 🎨 Design Features

- **Minimalist Gaming Universe** - Clean, focused interface
- **Dark Mode** - Eye-friendly dark theme with #00ff88 (green) and #ff0066 (pink) accents
- **Bento Layout** - Modern card-based grid system
- **Lateral Menu** - Responsive sidebar navigation
- **Glassmorphism** - Frosted glass effect on UI elements
- **Blur Gradients** - Atmospheric background effects
- **Mobile-First** - Optimized for mobile devices, scales to desktop

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom dark theme
- **Backend**: PocketBase (SQLite-based BaaS)
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PocketBase (download from [pocketbase.io](https://pocketbase.io))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sblaaaf/Cam.git
   cd Cam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PocketBase**
   - Download PocketBase from https://pocketbase.io/docs/
   - Extract and run: `./pocketbase serve`
   - Access admin UI at http://127.0.0.1:8090/_/
   - Follow the setup guide in `POCKETBASE_SETUP.md`

4. **Configure environment**
   ```bash
   # .env.local is already created, update if needed
   NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### First-Time Setup

1. Start PocketBase server
2. Create collections using the schema in `POCKETBASE_SETUP.md`
3. Add sample data (teams, matches, goodies)
4. Create an admin user in PocketBase admin UI
5. Register a regular user through the app

### User Journey

1. **Register** - Get 1000 free credits
2. **Browse Matches** - View upcoming, live, and finished matches
3. **Place Bets** - Select team and amount, see potential winnings
4. **Track Progress** - View betting history and stats with charts
5. **Manage Wallet** - Add credits or simulate withdrawals
6. **Shop Goodies** - Spend winnings on exclusive items

### Admin/Moderator Tasks

1. **Manage Teams** - Add new teams with stats
2. **Schedule Matches** - Create matches with odds
3. **Update Results** - Mark matches as live/finished, set winners
4. **Manage Users** - Update roles and credits (admins only)

## 📁 Project Structure

```
Cam/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin pages (teams, matches, users)
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── matches/           # Browse and bet on matches
│   │   ├── rankings/          # Team rankings
│   │   ├── my-bets/           # User's betting history
│   │   ├── stats/             # User statistics with charts
│   │   ├── goodies/           # Merchandise store
│   │   ├── wallet/            # Credits management
│   │   ├── layout.tsx         # Root layout with sidebar
│   │   ├── page.tsx           # Homepage with bento layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── Sidebar.tsx        # Lateral navigation menu
│   ├── lib/
│   │   ├── auth-context.tsx   # Authentication context
│   │   ├── pocketbase.ts      # PocketBase client & types
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                     # Static assets
├── POCKETBASE_SETUP.md        # Database setup guide
└── package.json
```

## 🎨 UI Components

### Color Palette
- Background: `#0a0a0a` (near black)
- Foreground: `#ededed` (light gray)
- Accent Primary: `#00ff88` (neon green)
- Accent Secondary: `#ff0066` (hot pink)

### Design Patterns
- **Glass Effect**: `glass` and `glass-dark` classes
- **Blur Gradients**: `blur-gradient-green` and `blur-gradient-pink`
- **Bento Grid**: Responsive card-based layouts
- **Mobile Menu**: Hamburger menu with slide-in sidebar

## 📊 Features in Detail

### Betting System
- Real-time odds display
- Potential win calculation
- Automatic credit deduction
- Bet status tracking (pending, won, lost)

### Statistics Dashboard
- Pie chart for bet distribution
- Bar chart for monthly performance
- Win rate calculation
- Profit/loss tracking

### Wallet Management
- Deposit simulation
- Withdrawal simulation
- Transaction history
- Real-time balance updates

### Admin Controls
- CRUD operations for teams
- Match scheduling and management
- User role management
- Credit adjustment

## 🔒 Security Notes

⚠️ **This is a POC for demonstration purposes**
- No real money transactions
- Passwords should use proper hashing (PocketBase handles this)
- API rules configured in PocketBase for access control
- Client-side authentication using PocketBase SDK

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 API Collections

See `POCKETBASE_SETUP.md` for:
- Complete collection schemas
- Field definitions
- Access control rules
- Sample data suggestions

## 🤝 Contributing

This is a POC project. Feel free to fork and expand upon it!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🎯 Future Enhancements

- Real-time match updates using WebSocket
- Live chat for matches
- Team profiles with detailed stats
- Tournament brackets
- Achievement system
- Leaderboards
- Mobile native app
- Push notifications
- Social features (friends, sharing)

## 🐛 Known Limitations

- This is a proof-of-concept, not production-ready
- No real payment gateway integration
- Limited error handling
- No unit tests included
- PocketBase runs locally (not deployed)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for the gaming community**
