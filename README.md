# Rate My Advisor

CodePath WEB103 Final Project

Designed and developed by: Kaylie Chang, Mohtashim Syed, Alex Gong, Justin Wong, Fiyinfoluwa Somorin, Isfahan Juboraj

🔗 Link to deployed app: 

## About

### Description and Purpose

Rate My Advisor is an app where students can find, review, and rate academic advisors based on helpfulness availability, communication, and overall support.

### Inspiration

The inspiration stems from negative personal experience with advisors in the past. I (Fiyin) wish I could have had a system in place to get an idea of the type of advisor I (Fiyin) had available before hand, like rate my professor so this idea is inspired from that. 

## Tech Stack

Frontend:
- React
- CSS
- JS
- HTML

Backend:
- Express
- PostgreSQL (Render)
- JS

## Features

### (1) ✅ Browse list of advisors available to the specific university

List page shows all advisors that were rated on the website. User can filter through tags to find best advisor to fit their needs.

![University advisor list demo](client/src/assets/university-advisor-list.gif)

### (2) ✅ User can click on advisor to see detailed information on the related content

User can click on advisors to view their profiles and current reviews given by students.

![Advisor profile demo](client/src/assets/advisor-profile.gif)

### (3) Allow user to add new advisors

Users can add advisors to the website via a form if they are not already added

[gif goes here]

### (4) User can rate advisor and explain why

User can rate the advisor out of 5 stars and explain why they believe that the advisor deserves that score.

[gif goes here]

### (5) Likes on Comments

Allow users mark reviews as helpful so that the best reviews are appear first

[gif goes here]

### (6) Report Button

Report button for review on foul and abusive language

[gif goes here]

### (7) Average grades are applied on advisors overall ratings for quick student viewing

Students can search for good advisors quickly by viewing the average grade given to each advisor based on their overall ratings (rounded to the nearest tenth place).

[gif goes here]

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions

Requirements:

- Node.js 20 or newer
- A PostgreSQL database

1. Install the frontend and server dependencies:

   ```bash
   cd client && npm ci
   cd ../server && npm ci
   ```

2. Create `server/.env` with your PostgreSQL connection values:

   ```text
   PGUSER=your_user
   PGPASSWORD=your_password
   PGHOST=your_host
   PGPORT=5432
   PGDATABASE=your_database
   NODE_ENV=development
   PORT=3000
   ```

3. Create the database tables:

   ```bash
   cd server
   npm run reset
   ```

4. Start the API and frontend in separate terminals:

   ```bash
   cd server && npm run dev
   cd client && npm run dev
   ```

5. Open the local URL printed by Vite.
