# Database Migration Guide

## Situation
If you have existing users/tasks in your database from before the project/team feature was added, you need to migrate them.

## Migration Steps

### Option 1: Fresh Start (Recommended for Development)
If you're in development and have test data, the easiest approach is:
1. Delete the database
2. Start fresh - all new registrations will include projectName

### Option 2: Add Default Project Names (Production)
For existing users/data that needs to continue working:

#### 1. Add projectName Field to Existing Users
```javascript
// Using MongoDB Compass or mongosh
use taskflow_db;

db.users.updateMany(
  { projectName: { $exists: false } },
  { $set: { projectName: "Default Project" } }
);
```

#### 2. Add projectName Field to Existing Tasks
```javascript
use taskflow_db;

// Get all users first
const users = db.users.find().toArray();

// For each user, set projectName on their tasks
users.forEach(user => {
  db.tasks.updateMany(
    { user: user._id, projectName: { $exists: false } },
    { $set: { projectName: user.projectName } }
  );
});
```

#### 3. Add Indexes for Performance
```javascript
use taskflow_db;

// Index for User projectName
db.users.createIndex({ projectName: 1 });

// Index for Task projectName
db.tasks.createIndex({ projectName: 1 });

// Index for Task projectName + user combo
db.tasks.createIndex({ projectName: 1, user: 1 });
```

### Option 3: Assign Projects by User
If you want each existing user to have their own isolated project:

```javascript
use taskflow_db;

const users = db.users.find().toArray();

users.forEach(user => {
  const projectName = `${user.name}'s Project`;
  
  // Update user
  db.users.updateOne(
    { _id: user._id },
    { $set: { projectName: projectName } }
  );
  
  // Update their tasks
  db.tasks.updateMany(
    { user: user._id },
    { $set: { projectName: projectName } }
  );
});
```

### Option 4: Group Users by Email Domain (Team-Based)
If you want to group users by company domain:

```javascript
use taskflow_db;

const users = db.users.find().toArray();

users.forEach(user => {
  const domain = user.email.split('@')[1];
  const projectName = `${domain} Team`;
  
  // Update user
  db.users.updateOne(
    { _id: user._id },
    { $set: { projectName: projectName } }
  );
  
  // Update their tasks
  db.tasks.updateMany(
    { user: user._id },
    { $set: { projectName: projectName } }
  );
});
```

## Verification

After migration, verify the data:

```javascript
use taskflow_db;

// Check all users have projectName
db.users.find({ projectName: { $exists: false } }).count(); // Should be 0

// Check all tasks have projectName
db.tasks.find({ projectName: { $exists: false } }).count(); // Should be 0

// Check indexes exist
db.users.getIndexes();
db.tasks.getIndexes();

// View sample data
db.users.findOne();
db.tasks.findOne();
```

## Automation Script (Node.js)

If you want to automate this in your codebase:

```javascript
// migration.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Get all users without projectName
    const usersToUpdate = await User.find({ projectName: { $exists: false } });
    
    if (usersToUpdate.length === 0) {
      console.log('No users need migration');
      return;
    }
    
    // Update each user and their tasks
    for (const user of usersToUpdate) {
      const projectName = `${user.name}'s Project`;
      
      // Update user
      await User.updateOne(
        { _id: user._id },
        { $set: { projectName } }
      );
      
      // Update user's tasks
      await Task.updateMany(
        { user: user._id },
        { $set: { projectName } }
      );
      
      console.log(`✓ Migrated user: ${user.email} → project: ${projectName}`);
    }
    
    // Create indexes
    await User.collection.createIndex({ projectName: 1 });
    await Task.collection.createIndex({ projectName: 1 });
    await Task.collection.createIndex({ projectName: 1, user: 1 });
    
    console.log('✓ Migration complete!');
    console.log(`✓ ${usersToUpdate.length} users migrated`);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

Run it with:
```bash
node migration.js
```

## Rollback Plan

If something goes wrong, you can rollback:

```javascript
use taskflow_db;

// Remove projectName field from all users
db.users.updateMany({}, { $unset: { projectName: "" } });

// Remove projectName field from all tasks
db.tasks.updateMany({}, { $unset: { projectName: "" } });

// Drop indexes if needed
db.users.dropIndex('projectName_1');
db.tasks.dropIndex('projectName_1');
```

## Important Notes

⚠️ **Before Running Any Migration:**
1. **Backup your database** - Always backup before running migrations!
   ```bash
   mongodump --uri="mongodb://..." --out=./backup
   ```

2. **Test in development** - Never run directly on production
3. **Run during maintenance window** - Avoid peak usage times
4. **Verify after migration** - Check that data looks correct

## Post-Migration

After migration completes:
1. Verify all users can log in
2. Check that tasks appear correctly
3. Test WebSocket connections
4. Verify real-time updates work
5. Monitor server logs for errors

---

**Need Help?**
- Check the `PROJECT_TEAM_FEATURE.md` file for feature details
- Monitor server logs: `npm start` shows connection details
- Verify MongoDB connection with `mongosh`
