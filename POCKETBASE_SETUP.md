# ESportBet - PocketBase Setup Guide

## Installation

1. Download PocketBase from https://pocketbase.io/docs/
2. Extract and run: `./pocketbase serve`
3. Access admin UI at http://127.0.0.1:8090/_/

## Collections Schema

### users (auth collection)
- email (email, required)
- username (text, required, unique)
- role (select: admin, moderator, user) - default: user
- credits (number) - default: 1000
- avatar (file, optional)

### teams
- name (text, required)
- logo (file, optional)
- description (text, optional)
- wins (number) - default: 0
- losses (number) - default: 0

### matches
- team1 (relation to teams, required)
- team2 (relation to teams, required)
- team1_odds (number, required) - default: 1.5
- team2_odds (number, required) - default: 2.5
- status (select: upcoming, live, finished) - default: upcoming
- winner (relation to teams, optional)
- scheduled_at (date, required)
- finished_at (date, optional)
- game_title (text, required)

### bets
- user (relation to users, required)
- match (relation to matches, required)
- team (relation to teams, required)
- amount (number, required)
- potential_win (number, required)
- status (select: pending, won, lost) - default: pending

### goodies
- name (text, required)
- description (text, required)
- image (file, optional)
- price (number, required)
- stock (number, required) - default: 0

### purchases
- user (relation to users, required)
- goodie (relation to goodies, required)
- quantity (number, required) - default: 1
- total_price (number, required)

### transactions
- user (relation to users, required)
- type (select: deposit, withdrawal, bet, win, purchase)
- amount (number, required)
- status (select: pending, completed, failed) - default: pending

## Sample Data

After creating collections, add sample data:

### Teams:
1. Team Liquid - wins: 45, losses: 20
2. G2 Esports - wins: 40, losses: 25
3. Cloud9 - wins: 35, losses: 30
4. Fnatic - wins: 38, losses: 27

### Matches:
Create a few matches with different statuses (upcoming, live, finished)

### Goodies:
1. Gaming Mouse - $50, stock: 10
2. Mechanical Keyboard - $100, stock: 5
3. Gaming Headset - $75, stock: 8
4. Team Jersey - $30, stock: 20

## API Rules (Important!)

Set collection rules for proper access control:

### users:
- List: anyone
- View: anyone
- Create: anyone (for registration)
- Update: @request.auth.id = id || @request.auth.role = "admin"
- Delete: @request.auth.role = "admin"

### teams:
- List: anyone
- View: anyone
- Create: @request.auth.role = "admin" || @request.auth.role = "moderator"
- Update: @request.auth.role = "admin" || @request.auth.role = "moderator"
- Delete: @request.auth.role = "admin"

### matches:
- List: anyone
- View: anyone
- Create: @request.auth.role = "admin" || @request.auth.role = "moderator"
- Update: @request.auth.role = "admin" || @request.auth.role = "moderator"
- Delete: @request.auth.role = "admin"

### bets:
- List: @request.auth.id != ""
- View: @request.auth.id = user || @request.auth.role = "admin"
- Create: @request.auth.id != ""
- Update: @request.auth.role = "admin"
- Delete: @request.auth.role = "admin"

### goodies:
- List: anyone
- View: anyone
- Create: @request.auth.role = "admin" || @request.auth.role = "moderator"
- Update: @request.auth.role = "admin" || @request.auth.role = "moderator"
- Delete: @request.auth.role = "admin"

### purchases:
- List: @request.auth.id = user || @request.auth.role = "admin"
- View: @request.auth.id = user || @request.auth.role = "admin"
- Create: @request.auth.id != ""
- Update: @request.auth.role = "admin"
- Delete: @request.auth.role = "admin"

### transactions:
- List: @request.auth.id = user || @request.auth.role = "admin"
- View: @request.auth.id = user || @request.auth.role = "admin"
- Create: @request.auth.id != ""
- Update: @request.auth.role = "admin"
- Delete: @request.auth.role = "admin"
