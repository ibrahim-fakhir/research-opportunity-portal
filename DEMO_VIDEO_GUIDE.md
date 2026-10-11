# One-Minute Demonstration Video Guide

> **Assignment Reference**: Section 7 - *One-Minute Demonstration Video*  
> **Target Duration**: Exactly 60 seconds (must not exceed 1 minute)  
> **Course**: Computer Networks (Fall-2026, BS CS 5B, FAST-NUCES Peshawar)

---

## 🎬 Quick Setup Before Recording

1. **Start the Server**:
   ```bash
   npm start
   ```
   Keep the terminal window visible on the left side of your screen.
2. **Open Browser**:
   Navigate to `http://localhost:5000` on the right side of your screen.
3. **Open Postman or Bruno**:
   Have Postman open in a background tab or floating window ready to show requests.
4. **Tool Recommendation**:
   Use **OBS Studio**, **Windows Game Bar** (`Win + Alt + R`), or **Loom**.

---

## ⏱️ Second-by-Second Video Timeline (0:00 – 1:00)

| Timestamp | Screen Focus | Action / Spoken Commentary | Grading Requirement Covered |
|---|---|---|---|
| **0:00 – 0:08** | Terminal & Browser | Show terminal with `npm start` running and `http://localhost:5000` loaded in browser. Point out the dashboard KPIs. | • Backend server running<br>• Frontend application running |
| **0:08 – 0:18** | Browser UI | Click **"+ Post Opportunity"**. Fill in a new research opportunity (e.g. *"Autonomous Drone Swarms"*), click **Save**. Show the new card appear in the grid and success toast. | • Creating a research opportunity<br>• Retrieving & displaying stored opportunities |
| **0:18 – 0:26** | Browser UI | Click **"Details"** on the card to inspect full details modal, then close or click **"Edit"**. Modify positions from 2 to 4 and click **Save**. | • Updating an opportunity |
| **0:26 – 0:34** | Browser UI | Click the **"Close Opening"** button on the card. Point out that the badge changes from green **"Open"** to gray **"Closed"**. | • Closing an opportunity (Status change) |
| **0:34 – 0:42** | Browser UI | Click the **Delete** icon on a card. Confirm deletion in the modal. Card disappears and count updates. | • Deleting an opportunity |
| **0:42 – 0:50** | Browser UI | Click **"+ Post Opportunity"** and immediately click **Save** with empty fields. Show the red validation errors and toast alert. | • Displaying validation error |
| **0:50 – 1:00** | Postman / Bruno | Switch to Postman/Bruno. Run `GET /api/opportunities/999` to show **404 Not Found**, and run `GET /api/opportunities` to show **200 OK** JSON response. | • 404 Not Found error<br>• API requests & responses in Postman/Bruno |

---

## 📋 Demonstration Checklist

- [ ] Backend server terminal visible (`http://localhost:5000`)
- [ ] Frontend responsive dashboard displayed
- [ ] Opportunity created through web form
- [ ] List displaying dynamic cards from REST API
- [ ] Opportunity updated
- [ ] Status changed from Open to Closed
- [ ] Opportunity deleted
- [ ] Form validation error displayed
- [ ] Postman / Bruno request showing 404 Not Found & 200 OK
- [ ] Video length is $\le 60$ seconds
