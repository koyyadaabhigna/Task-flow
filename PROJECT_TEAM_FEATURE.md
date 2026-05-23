# TaskFlow Multi-Project/Team Feature

## Overview
This implementation adds project/team collaboration to TaskFlow. Multiple users can work on the same project, and all task changes sync in real-time only to users in that project.

## How It Works

### User Registration & Project Assignment
1. **Registration**: When a user creates an account, they specify a `projectName`
   ```
   Name: John Doe
   Email: john@company.com
   Password: secure123
   Project Name: "Marketing Team"  ← All team members use the same project name
   ```

2. **Multiple Users, Same Project**: Any user entering the same project name joins that project
   ```
   User A: projectName = "Marketing Team"
   User B: projectName = "Marketing Team"
   User C: projectName = "Marketing Team"
   → All three users form one team
   ```

### Real-Time Synchronization

#### WebSocket Rooms Architecture
- **Project Room**: `project_{projectName}` - Primary collaboration space
  - All users in the project receive task updates here
  - Task creation, updates, deletions broadcast to this room
  - Typing indicators show to all project members
  
- **User Room**: `user_{userId}` - Individual user sync
  - Cross-tab/device synchronization for the same user
  - Account updates, preferences, etc.
  
- **Task Room**: `task_{taskId}` - Specific task collaboration
  - Real-time editing on specific tasks (for future features)

#### Event Broadcasting Flow
```
User A Creates Task
    ↓
Server creates task with projectName: "Marketing Team"
    ↓
Server broadcasts to: project_Marketing Team
    ↓
User B receives taskCreated event ✓
User C receives taskCreated event ✓
User D (different project) doesn't receive ✗
```

### Database Schema Changes

#### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  projectName: String,  // ← NEW: Team identifier
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref to User),
  title: String,
  description: String,
  priority: String,
  status: String,
  dueDate: Date,
  completedAt: Date,
  projectName: String,  // ← NEW: Which project this task belongs to
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "secure123",
  "projectName": "Marketing Team"  ← NEW
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@company.com",
    "projectName": "Marketing Team"  ← NEW
  }
}
```

#### Login
```
POST /api/auth/login
{
  "email": "john@company.com",
  "password": "secure123"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@company.com",
    "projectName": "Marketing Team"  ← NEW
  }
}
```

### Tasks

#### Get All Tasks
```
GET /api/tasks
Query Filters: status, priority, search, sort

Now automatically filtered by:
- user: current user ID
- projectName: current user's project
```

#### Create Task
```
POST /api/tasks
{
  "title": "Design homepage",
  "description": "Create new homepage design",
  "priority": "high",
  "dueDate": "2024-12-31",
  "status": "pending"
}

Task is automatically created with:
- user: current user ID
- projectName: current user's projectName
```

#### Update/Delete/Toggle
All operations now:
- Filter by projectName to prevent cross-project access
- Broadcast events to `project_{projectName}` room only

## WebSocket Events

### Events Emitted (Server → Client)

#### Task Events
```javascript
socket.on('taskCreated', (task) => {
  // New task created by someone in your project
  console.log('New task:', task.title);
});

socket.on('taskUpdated', (task) => {
  // Task updated by someone in your project
  console.log('Task updated:', task.title);
});

socket.on('taskDeleted', ({ taskId, title }) => {
  // Task deleted from your project
  console.log('Task deleted:', title);
});

socket.on('taskToggled', (task) => {
  // Task completed/reopened in your project
  console.log('Task toggled:', task.status);
});
```

#### User Activity Events
```javascript
socket.on('userTyping', ({ userId, name, isTyping, taskId }) => {
  // Shows which team members are editing tasks
  if (isTyping) {
    console.log(`${name} is typing on task ${taskId}`);
  }
});
```

## Testing Scenarios

### Scenario 1: Team Collaboration
1. Open browser Tab 1 → Register as "Alice" with project "Design Team"
2. Open browser Tab 2 → Register as "Bob" with project "Design Team"
3. In Tab 1: Create a task "Design Logo"
4. In Tab 2: Task appears instantly ✓
5. In Tab 2: Update task status to "in-progress"
6. In Tab 1: Status updates instantly ✓

### Scenario 2: Project Isolation
1. Open browser Tab 1 → Register as "Charlie" with project "Sales Team"
2. Open browser Tab 2 → Register as "David" with project "Marketing Team"
3. In Tab 1: Create task "Call Client"
4. In Tab 2: Task does NOT appear (different project) ✓

### Scenario 3: Cross-Tab Sync
1. Register as "Emma"
2. Open same account in Tab 1 and Tab 2
3. In Tab 1: Create a task
4. In Tab 2: Task appears (same user, different tab) ✓

## Console Logs for Debugging

### Server Console
```
🔌 Socket connected: socket_123 | User: John Doe (john@company.com) | Project: Marketing Team
📍 User John Doe joined project room: project_Marketing Team
📡 Emitted "taskCreated" to project room: project_Marketing Team
🔌 Socket disconnected: socket_123 | Reason: client namespace disconnect
```

### Client Console
```
🔌 Initializing WebSocket connection to: http://localhost:5000
⚡ Connected to WebSocket. Socket ID: socket_456
📡 Emitted "taskCreated" to project room: project_Marketing Team
```

## Performance Considerations

1. **Indexed Fields**: Both `projectName` fields are indexed for fast queries
   - User.projectName: Users can quickly find all members in a project
   - Task.projectName: Tasks are quickly filtered by project

2. **Room Efficiency**: WebSocket rooms are namespace-based, not query-based
   - Broadcasts use O(1) room lookup time
   - No database queries needed for event broadcasting

3. **Scalability**: 
   - Projects scale independently
   - One project's traffic doesn't affect another's
   - Horizontal scaling possible with Socket.IO adapters

## Future Enhancements

1. **User Invitations**: Add endpoint to invite users to project
2. **Role-Based Access**: Admin, Editor, Viewer roles per project
3. **Project Settings**: Allow project name changes, custom properties
4. **Activity Logs**: Track who created/modified tasks
5. **Notifications**: Notify users about task changes
6. **Project Switching**: Allow users to belong to multiple projects
7. **Audit Trail**: Maintain history of changes for compliance

## Troubleshooting

### Issue: Existing users getting errors
**Solution**: Need database migration to add projectName to existing users

### Issue: Tasks not syncing between users
**Cause**: Users registered with different projectName values
**Solution**: Ensure all team members use exact same projectName (case-sensitive)

### Issue: WebSocket not connecting
**Check**: 
- Token is being sent in socket auth
- Server logs show "Socket connected" message
- Check browser console for "Connection error"

### Issue: Cross-project data leakage
**Prevention**: All queries include projectName filter
- Task queries: `{ user: userId, projectName: userProjectName }`
- WebSocket broadcasts: `io.to('project_' + projectName).emit()`
