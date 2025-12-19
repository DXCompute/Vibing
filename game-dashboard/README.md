# 🎮 Ave Forge Game Dashboard

A professional SaaS-style analytics dashboard for the Ave Forge crypto game.

## 📊 What This Shows

- **Total Users** - Number of registered users with trend indicator
- **Missions Completed** - Total missions completed with percentage change
- **Average Level** - Average player level with growth rate
- **Lootboxes Opened** - Total lootboxes opened with trend
- **Activity Chart** - 7-day trend visualization for users, missions, and lootboxes

## 🚀 How to Run

1. Open Terminal in this folder
2. Run: `npm install` (first time only)
3. Run: `npm run dev`
4. Open your browser to: http://localhost:3000

## ✏️ How to Update the Data

**All data is stored in one JSON file for easy editing!**

1. Open the file: `app/data/metrics.json`
2. Update any of the values:

```json
{
  "usersTotal": 42190,
  "missionsCompleted": 128430,
  "avgLevel": 17.4,
  "lootboxesOpened": 98211,
  "deltas": {
    "usersTotalPct": 2.4,
    "missionsCompletedPct": 5.1,
    "avgLevelPct": 0.6,
    "lootboxesOpenedPct": -1.2
  },
  "series": [...]
}
```

3. Save the file
4. The dashboard will automatically update in your browser!

## 🎨 Features

- **Professional SaaS Design** - Clean, modern interface with light theme
- **Trend Indicators** - Green/red badges showing percentage changes
- **Interactive Charts** - Beautiful line charts showing 7-day trends
- **Lucide Icons** - Professional icon set
- **Responsive Layout** - Works perfectly on mobile, tablet, and desktop
- **Real-time Updates** - Changes reflect immediately when you edit the JSON
- **Number Formatting** - Automatic comma formatting for large numbers

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)

## 📝 Need Help?

To customize colors, add more KPIs, or modify the design, just ask!

