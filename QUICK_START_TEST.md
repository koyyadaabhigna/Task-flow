# Quick Start: Test the Multi-Project/Team Feature

## Prerequisites
- Node.js running on backend (port 5000)
- React running on frontend (port 3000)
- MongoDB running and connected
- Two browser tabs or windows ready

---

## 5-Minute Test

### Step 1: Register First User (Alice)
1. Go to `http://localhost:3000/register` in **Browser Tab 1**
2. Fill the form:
   ```
   Full Name:    Alice Johnson
   Email:        alice@test.com
   Project Name: Design Team
   Password:     password123
   ```
3. Click "Create Account"
4. You should see Dashboard (success!)

### Step 2: Register Second User (Bob) - Same Project
1. Go to `http://localhost:3000/register` in **Browser Tab 2**
2. Fill the form:
   ```
   Full Name:    Bob Smith
   Email:        bob@test.com
   Project Name: Design Team  ← SAME project as Alice
   Password:     password123
   ```
3. Click "Create Account"
4. You should see Dashboard

### Step 3: Create Task in Tab 1 (Alice)
1. In **Tab 1** (Alice), click "Add New Task"
2. Fill in:
   ```
   Title:       Create Homepage Mockup
   Priority:    High
   Due Date:    2024-12-31
   ```
3. Click "Save Task"
4. Task appears in Tab 1

### Step 4: Verify Real-Time Sync (Bob's Tab 2)
1. **Don't refresh Tab 2**
2. Look at the task list in **Tab 2** (Bob)
3. ✅ New task should appear instantly!
4. Both users should see the same task

### Step 5: Edit Task to Verify Updates
1. In **Tab 1**, click the task to edit it
2. Change status to "In Progress"
3. Click "Update"
4. **In Tab 2**, task status updates instantly (without refresh!)

### Step 6: Test Project Isolation
1. In **Tab 1**, open DevTools (F12) → Console
2. Go to register (`/register`)
3. Register new user (Charlie):
   ```
   Full Name:    Charlie Brown
   Email:        charlie@test.com
   Project Name: Sales Team  ← DIFFERENT project
   Password:     password123
   ```
4. Create a task "Call Client"
5. Switch to **Tab 2** (Bob) - Task does NOT appear ✅ (correct isolation!)

---

## Detailed Testing Checklist

### ✅ Registration Tests
- [ ] Register with empty projectName → Error message appears
- [ ] Register with 1 character projectName → Error (must be 2+)
- [ ] Register with valid projectName → Success
- [ ] projectName appears in user menu after login
- [ ] Two users with same projectName get same data

### ✅ Real-Time Sync Tests
- [ ] Create task in Tab 1 → Appears in Tab 2 instantly
- [ ] Update task in Tab 1 → Updates in Tab 2 instantly
- [ ] Delete task in Tab 1 → Removed from Tab 2 instantly
- [ ] Toggle task status in Tab 1 → Updates in Tab 2 instantly
- [ ] Different projects don't see each other's tasks

### ✅ WebSocket Tests
1. Open Tab 1 and Tab 2 with same user (cross-tab sync):
   - [ ] Create task in Tab 1
   - [ ] Appears in Tab 2 (same user, different tab)
   - [ ] Update in Tab 2
   - [ ] Updates in Tab 1

2. Open DevTools Console on both tabs:
   - [ ] Look for "Connected to WebSocket" message
   - [ ] Should show Socket ID in each tab
   - [ ] Create task → Look for emit logs

### ✅ Server Console Tests
Run backend with: `npm start` (from backend folder)

Look for these logs when users connect:
```
🔌 Socket connected: socket_abc123 | User: Alice Johnson (alice@test.com) | Project: Design Team
📍 User Alice Johnson joined project room: project_Design Team
```

When creating a task:
```
📡 Emitted "taskCreated" to project room: project_Design Team
```

### ✅ Database Verification
Open MongoDB and run:
```javascript
// Should see projectName in all documents
db.users.findOne();  // Has projectName: "Design Team"
db.tasks.findOne();  // Has projectName: "Design Team"
```

---

## Debugging Commands

### Check Browser Console
Press `F12` to open DevTools, click Console tab

**Look for:**
- Connection messages: `⚡ Connected to WebSocket`
- No errors: `❌` should not appear
- Task updates: `taskCreated`, `taskUpdated`, `taskDeleted`

### Check Server Console
In terminal where you ran `npm start` for backend

**Look for:**
- Socket connections: `🔌 Socket connected`
- Project rooms: `📍 User joined project room`
- Emit logs: `📡 Emitted to project room`
- No errors: `❌` should not appear

### MongoDB Check
```bash
mongosh
use taskflow_db
db.users.find().pretty()  # All have projectName
db.tasks.find().pretty()  # All have projectName
```

---

## Troubleshooting

### Issue: "projectName is required" error on register
**Cause:** projectName field is empty
**Fix:** Fill in the "Project Name" field before registering

### Issue: Tasks don't appear in second user's tab
**Cause:** Different projectName values
**Check:**
- User 1 projectName: "Design Team"
- User 2 projectName: "Design Team" (exact match, case-sensitive)

### Issue: WebSocket not connecting
**Steps:**
1. Open Browser DevTools (F12)
2. Check Console tab for errors
3. Check if error says "Authentication error"
4. Make sure backend is running on port 5000
5. Check MongoDB is connected

### Issue: Task updates not syncing
**Check:**
- Backend logs show `📡 Emitted` message
- Browser Console shows task events
- Both users have same projectName
- Socket is connected (look for green indicator or log)

### Issue: Same user, different tabs - tasks not syncing
**This should work** - let me know if it doesn't!
**Check:**
- Both tabs showing "Connected" status
- No errors in console
- Refresh if needed

---

## Performance Check

### Load Test (Optional)
1. Create 20+ tasks in Tab 1
2. Verify all appear in Tab 2 instantly
3. Update several tasks quickly
4. Check that all updates sync without lag
5. Monitor browser performance (should be smooth)

---

## Success Criteria

✅ You'll know it's working when:

1. **Registration:**
   - Can register with projectName
   - User object includes projectName

2. **Real-Time Sync:**
   - Create task in one tab
   - Instantly appears in other tab (same project)
   - No page refresh needed
   - All team members see updates

3. **Project Isolation:**
   - Users in different projects
   - Don't see each other's tasks
   - Data completely isolated

4. **WebSocket:**
   - Connection successful logs appear
   - Task events broadcast correctly
   - No console errors

5. **Database:**
   - All users have projectName field
   - All tasks have projectName field
   - Data matches user's project

---

## Need Help?

📖 **See these files for details:**
- `PROJECT_TEAM_FEATURE.md` - Full feature documentation
- `IMPLEMENTATION_SUMMARY.md` - What was changed
- `MIGRATION_GUIDE.md` - For existing data

💬 **Common questions:**
- Q: Why do I need projectName?
  - A: It groups users into teams and isolates their data

- Q: Can one user be in multiple projects?
  - A: Current version: No. Future enhancement planned.

- Q: Is my data secure?
  - A: Yes! All queries include projectName filter. See IMPLEMENTATION_SUMMARY.md

---

**Test Time:** ~5 minutes
**Status:** Ready to test! 🚀
