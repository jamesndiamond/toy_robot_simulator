# Toy Robot Simulator

A full-stack application that simulates a toy robot moving on a 5x5 square tabletop. Built with React frontend and NestJS backend with SQLite database for persistent state management.

## 🎯 Description

This application simulates a toy robot moving on a 5x5 square tabletop with the following features:

- **Interactive Grid**: Click on any table space to PLACE the robot at that position
- **Movement Commands**: MOVE, LEFT, RIGHT, and REPORT commands
- **Persistent State**: Robot position is saved to database and restored on page refresh
- **Movement History**: Complete history of all robot positions and actions
- **Boundary Validation**: Robot cannot fall off the table during movement or placement
- **Real-time Updates**: UI updates immediately after each command

## 🏗️ Architecture

- **Frontend**: React with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **Testing**: Jest for unit tests

## 📁 Project Structure

```
toy-robot-simulator/
├── toy-robot-frontend/         # React application
│   ├── src/
│   │   ├── App.tsx            # Main application component
│   │   ├── App.css            # Styling for the grid and robot
│   │   └── ...
│   └── package.json
└── toy-robot-backend/          # NestJS API
    ├── src/
    │   ├── robot.entity.ts    # Database entity
    │   ├── robot.service.ts   # Business logic
    │   ├── robot.controller.ts # API endpoints
    │   ├── robot.service.spec.ts # Unit tests
    │   └── ...
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd toy-robot-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000`


### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd toy-robot-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3001`

## 🎮 How to Use

### Basic Operations

1. **Place Robot**: Click on any square in the 5x5 grid to place the robot at that position (facing NORTH)
2. **Move Robot**: Click the "MOVE" button to move the robot one space forward in its current direction
3. **Rotate Robot**: Click "LEFT" or "RIGHT" to rotate the robot 90 degrees
4. **Report Position**: Click "REPORT" to see the current X, Y position and facing direction

### Coordinate System

- **Origin (0,0)**: Bottom-left corner (SOUTH WEST)
- **X-axis**: Increases from left to right (0-4)
- **Y-axis**: Increases from bottom to top (0-4)
- **Directions**: NORTH, EAST, SOUTH, WEST

### Constraints

- Robot cannot be placed outside the 5x5 grid
- Robot cannot move off the table
- Invalid moves are ignored and show error messages
- Robot must be placed before issuing movement commands

### Example Usage

**Basic Movement Example:**
1. Click on position (0,0) to place robot facing NORTH
2. Click "MOVE" button
3. Click "REPORT" button
4. **Expected Output**: 0,1,NORTH

**Rotation Example:**
1. Click on position (0,0) to place robot facing NORTH
2. Click "LEFT" button
3. Click "REPORT" button
4. **Expected Output**: 0,0,WEST

## 🔧 API Endpoints

The backend provides the following REST API endpoints:

- `POST /robot/place` - Place robot at specified coordinates
- `POST /robot/command` - Execute movement command (MOVE, LEFT, RIGHT, REPORT)
- `GET /robot/latest` - Get current robot position
- `GET /robot/history` - Get complete movement history
- `POST /robot/clear` - Clear robot from table

## 🧪 Testing

### Backend Tests

The backend includes comprehensive unit tests covering:

- Valid and invalid robot placement
- Movement validation and boundary checking
- Rotation logic (LEFT/RIGHT commands)
- Error handling for invalid commands
- Database operations

**Run backend tests**:
```bash
cd toy-robot-backend
npm test
```

**End-to-End Tests:**
```bash
cd toy-robot-backend
npm run test:e2e      # Run end-to-end API tests
```

### Frontend Testing

The frontend can be tested manually using the provided test instructions above.

## 🗄️ Database

The application uses SQLite for data persistence:

- **Database File**: `robot.db` (created automatically)
- **Entity**: Robot with fields: id, x, y, facing, createdAt
- **History**: Every position change creates a new record for complete history tracking

## 🚨 Error Handling

The application handles various error scenarios:

- Invalid placement coordinates
- Movement attempts that would cause the robot to fall off the table
- Commands issued when no robot is placed
- Invalid movement commands

All errors are displayed to the user via toast notifications.

## 🔄 State Management

- **Persistence**: Robot state is automatically saved to SQLite database
- **Restoration**: Robot position is restored when the page is refreshed
- **History**: Complete movement history is maintained and accessible
- **Real-time Updates**: UI updates immediately after each command

## 🛠️ Development Notes

### Assumptions Made

1. **Frontend Framework**: Chose React for familiarity and component-based architecture
2. **Database**: SQLite for simplicity and no external dependencies
3. **API Design**: RESTful endpoints following NestJS conventions
4. **Error Handling**: Toast notifications for user feedback
5. **Testing**: Comprehensive unit tests for business logic

### Deviations from Design

- Added a "CLEAR" endpoint to remove robot from table

## 📝 Future Enhancements

- Visual movement history display and jump to previous state
- Undo/Redo functionality
- Multiple robot support
- Enhanced UI animations
- Command queue UI: Stack and batch commands before execution to avoid race conditoin
- Analytics dashboard: Track number of commands, most-used direction, etc.