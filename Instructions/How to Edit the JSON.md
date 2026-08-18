# Editing the Checklist JSON

### For Admins Only

The checklists (Full Setup, Partial Setup, Full Breakdown, Partial Breakdown) are stored as JSON files. This guide covers how to add, remove, or edit checklist items safely.

## Where the Files Live

In the backend repo, under `/data`:

- `checklists-full-setup.json`
- `checklists-partial-setup.json`
- `checklists-full-breakdown.json`
- `checklists-partial-breakdown.json`

Each file controls one tab in the app.

## Understanding the JSON Structure

Each file is a set of **sections** (e.g. "Front Table/Benches"). A section looks roughly like this:

```json
{
  "frontTable": {
    "name": "FRONT TABLE/ BENCHES",
    "techName": "(unassigned)",
    "tasks": [
      {
        "id": "table-connection",
        "title": "Table Connection",
        "items": [
          { "id": "tc-1", "label": "Connect table power", "completed": false }
        ]
      }
    ]
  }
}
```

- **section key** (e.g. `frontTable`) — internal ID, don't reuse across sections
- **name** — what's displayed as the section header in the app
- **techName** — who's assigned; leave as `"(unassigned)"` when adding new sections
- **tasks** — the list of task groups shown inside the section
- **items** — the individual checklist checkboxes inside each task

## How to Add a New Checklist Item

1. Find the task you want to add an item to (matched by its `"title"`).
2. Inside its `"items"` array, add a new entry:
```json
   { "id": "unique-id-here", "label": "New task description", "completed": false }
```
3. Every `id` must be unique within the file — don't copy/paste an existing `id` without changing it.
4. Make sure `"completed"` is set to `false` so it starts unchecked.

## How to Add a Whole New Task Group

Inside a section's `"tasks"` array, add a new task block:

```json
{
  "id": "new-task-id",
  "title": "New Task Name",
  "items": [
    { "id": "nt-1", "label": "First item", "completed": false },
    { "id": "nt-2", "label": "Second item", "completed": false }
  ]
}
```

## How to Add a Whole New Section

Add a new top-level key to the JSON file:

```json
"newSectionKey": {
  "name": "NEW SECTION NAME",
  "techName": "(unassigned)",
  "tasks": []
}
```

Then add tasks/items inside it following the steps above.

## How to Remove an Item

Delete its entire `{ ... }` block from the `"items"` array. Make sure you don't leave a trailing comma behind (see below).

## Two Ways to Make the Edit

### Option A — In the App (Admin view)
1. Log in with the Admin password.
2. Click **"Edit Checklist JSON (Admin)"** near the top of the page.
3. Edit the JSON directly in the box that appears.
4. Save. This updates the live checklist immediately for everyone.

### Option B — Directly on GitHub
1. Go to the backend repo → `data` folder.
2. Open the file you need to edit (e.g. `checklists-partial-setup.json`).
3. Click the pencil/edit icon.
4. Make your changes.
5. Commit changes, then redeploy the backend on Render for it to take effect.

> **Note:** Editing on GitHub does NOT update the live app until the backend is redeployed. If you need the change live immediately, use Option A instead.

## Common Mistakes to Avoid

- **Trailing commas** — JSON does not allow a comma after the last item in a list or object. This is the #1 cause of a broken checklist.
- **Missing quotes** — every key and every text value needs double quotes `"like this"`.
- **Duplicate IDs** — every `id` (item, task, and section) must be unique within its file.
- **Leaving `"completed": true`** — if you copy an existing item as a template, make sure you reset `"completed"` back to `false`, or that item will show as already checked when the page loads.

## Before You Save

Paste your edited JSON into a validator (e.g. jsonlint.com) to confirm it's valid before saving or committing. A single missing comma or bracket will break the entire tab and show an error to everyone using the app.
