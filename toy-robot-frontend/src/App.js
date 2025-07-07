import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import {
  RobotNorth,
  RobotEast,
  RobotSouth,
  RobotWest,
} from './components/RobotIcons';

/**
 * Returns the appropriate robot icon component based on the robot's facing direction
 * @param {string} direction - The direction the robot is facing (NORTH, EAST, SOUTH, WEST)
 * @returns {JSX.Element|null} The robot icon component or null if direction is invalid
 */
function getRobotComponent(direction) {
  switch (direction) {
    case 'NORTH': return <RobotNorth />;
    case 'EAST': return <RobotEast />;
    case 'SOUTH': return <RobotSouth />;
    case 'WEST': return <RobotWest />;
    default: return null;
  }
}

/**
 * Main Toy Robot Simulator component
 * Handles robot placement, movement, and game state management
 */
function App() {
  const [robot, setRobot] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  /**
   * Checks if the robot is active (placed on the board)
   * Shows a warning toast if robot is not active
   * @returns {boolean} True if robot is active, false otherwise
   */
  const isRobotActive = useCallback(() => {
    if (!robot || robot.facing === 'NONE') {
      toast.warning("Robot is not on the board.");
      return false;
    }
    return true;
  }, [robot]);

  /**
   * Places the robot at the specified coordinates facing north
   * @param {number} x - X coordinate (0-4)
   * @param {number} y - Y coordinate (0-4)
   */
  const placeRobot = useCallback((x, y) => {
    axios.post('http://localhost:3000/robot/place', { x, y, facing: 'NORTH' })
      .then(res => setRobot(res.data))
      .catch(err =>
        toast.warn(err.response?.data?.message || 'Invalid placement')
      );
  }, []);

  /**
   * Sends a command to the robot (MOVE, LEFT, RIGHT)
   * Disables buttons temporarily to prevent rapid clicking
   * @param {string} cmd - The command to send to the robot
   */
  const sendCommand = useCallback(async (cmd) => {
    if (!isRobotActive() || buttonsDisabled) return;

    try {
      setButtonsDisabled(true);
      const res = await axios.post('http://localhost:3000/robot/command', {
        command: cmd,
      });
      setRobot(res.data);
    } catch (err) {
      toast.warn(err?.response?.data?.message || 'Invalid command');
    } finally {
      // Wait 1 second before re-enabling buttons
      setTimeout(() => setButtonsDisabled(false), 1000);
    }
  }, [isRobotActive, buttonsDisabled]);

  /**
   * Displays the robot's current position and direction
   * Shows an info toast with robot coordinates and facing direction
   */
  const handleReport = useCallback(() => {
    if (!isRobotActive()) return;

    toast.info(`Robot at (${robot.x}, ${robot.y}) facing ${robot.facing}`);
  }, [isRobotActive, robot]);

  /**
   * Renders the robot icon at the specified grid position
   * @param {number} x - X coordinate to check
   * @param {number} y - Y coordinate to check
   * @returns {JSX.Element|null} Robot icon if robot is at this position, null otherwise
   */
  const renderRobot = useCallback((x, y) => {
    if (!robot || robot.x !== x || robot.y !== y) return null;
    return (
      <div className="robot-icon-container">
        {getRobotComponent(robot.facing)}
      </div>
    );
  }, [robot]);

  /**
   * Resets the robot state by clearing it from the backend
   * Removes the robot from the board and shows a reset message
   */
  const handleReset = useCallback(async () => {
    try {
      await axios.post(`http://localhost:3000/robot/clear`);
      setRobot(null);
      toast.info("Robot has been reset. Place it again to continue.");
    } catch (err) {
      toast.error("Failed to reset robot.");
    }
  }, []);

  // Load initial robot state from backend on component mount
  useEffect(() => {
    axios.get('http://localhost:3000/robot/latest')
      .then(res => setRobot(res.data))
      .catch(() => {});
  }, []);

  // Set up keyboard event listeners for robot control
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isRobotActive()) return;

      switch (e.key) {
        case 'ArrowUp':
          sendCommand('MOVE');
          break;
        case 'ArrowLeft':
          sendCommand('LEFT');
          break;
        case 'ArrowRight':
          sendCommand('RIGHT');
          break;
        case 'r':
          handleReport();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRobotActive, sendCommand, handleReport]);

  return (
    <div className="App">
      <h2 className="instructions">
        Click to place the robot, use the buttons or arrow keys to move
      </h2>

      <div className="grid">
        {Array.from({ length: 5 }).map((_, row) => (
          <div className="row" key={row}>
            {Array.from({ length: 5 }).map((_, col) => {
              const x = col;
              const y = 4 - row;
              return (
                <div
                  key={`${x}-${y}`}
                  className="cell"
                  onClick={() => placeRobot(x, y)}
                >
                  {renderRobot(x, y)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={() => sendCommand('LEFT')} disabled={buttonsDisabled}>
          {buttonsDisabled ? '...' : 'Left'}
        </button>
        <button onClick={() => sendCommand('MOVE')} disabled={buttonsDisabled}>
          {buttonsDisabled ? '...' : 'Move'}
        </button>
        <button onClick={() => sendCommand('RIGHT')} disabled={buttonsDisabled}>
          {buttonsDisabled ? '...' : 'Right'}
        </button>
      </div>

      <button className="report" onClick={handleReport}>Report</button>
      <button className="reset" onClick={handleReset}>Reset</button>

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
}

export default App;
