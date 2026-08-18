# Rockets Game Day Checklist App
### How-To Guide — Tech & Manager

## Getting Started

- Go to: game-day-checklist-app.onrender.com
- Use Google Chrome (not Safari). Safari has known issues saving progress.
- Do not use Private/Incognito browsing — it will not save your progress.
- Log in with the password you were given. There are two passwords:
  - Tech password — for setup/breakdown crew
  - Admin password — for managers

> **Note:** The app may take 20–30 seconds to load the first time you open it each day. This is normal — the server is "waking up."

## The Four Tabs

At the top of the app are four tabs. Each one has its own separate checklist and its own separate progress:

- Full Setup — full pre-game setup checklist
- Partial Setup — abbreviated pre-game setup checklist
- Full Breakdown — full post-game teardown checklist
- Partial Breakdown — abbreviated post-game teardown checklist

> **Note:** Stay on one tab for the entire task you're working on. Switching tabs mid-task can cause your in-progress checkboxes to reload from what was last saved.

---

## Tech View

### What you'll see

When you log in with the Tech password, you'll see all sections (e.g. Front Table/Benches, D-VOM Media Checklist, East Club Checklist). Each section shows:

- The section name and who is assigned to it (set by the Manager)
- A completion count, like "0/10 completed"
- A list of tasks inside the section, each with its own checkboxes
- A status line at the bottom: "Awaiting manager verification" or "Verified by manager at: [time]"

### How to complete your work

1. Open the correct tab for what you're doing (e.g. Partial Setup).
2. Find the section(s) assigned to you — check the "Assigned:" label at the top of each section.
3. Tap into a task (e.g. "Table Connection") to expand it and see the checklist items.
4. Check off each item as you complete it.
5. Once everything in a section is checked, wait for your Manager to verify it. You'll see the status change to "Verified by manager" once they do.

> **Note:** Take a screenshot of your completed section(s) when you're done and send it to your Manager. This is your backup record in case anything doesn't save properly.

---

## Manager / Admin View

### Logging in

Log in with the Admin password. Use the "VIEW AS" dropdown in the top right to switch between Admin, Manager, and Tech views to see what techs see.

### Assigning techs to sections

1. Open the correct tab (Full Setup, Partial Setup, Full Breakdown, or Partial Breakdown).
2. Find the section you want to assign (e.g. "Front Table/Benches").
3. Use the "Assigned Tech" dropdown near the top of the section to pick who's responsible.
4. The assignment saves automatically and syncs to everyone's device within a few seconds.

### Verifying completed work

1. A section's manager verification checkbox only becomes clickable once every item in that section is checked off.
2. Once all items are complete, check the "Manager verification for entire section" box.
3. This timestamps the verification, which techs can then see on their own screens.

> **Note:** If the verification checkbox is greyed out, it means not everything in that section has been checked off yet — scroll through the section to find what's still outstanding.

### Editing checklists (Admin only)

From the Admin view, you can use "Edit Checklist JSON (Admin)" to make changes to the underlying checklist content if a task needs to be added, removed, or corrected. This should only be done by someone comfortable editing structured text — contact your developer/IT contact if unsure.

---

## Troubleshooting

- **Progress not saving?** Make sure you're using Chrome, in a normal (not private) window.
- **Page shows old/stale data?** Do a hard refresh, or close and reopen the browser tab.
- **Assignment or verification not showing on another device?** Give it a few seconds — assignments sync automatically but aren't instant.
- **Still stuck?** Take a screenshot of the issue and send it to your IT/developer contact.
