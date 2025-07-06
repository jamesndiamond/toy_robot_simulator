import React from 'react';

const commonProps = {
  width: 70,
  height: 70,
  viewBox: '0 0 100 100',
};

const RobotBody = () => (
  <>
    {/* Head */}
    <ellipse cx="50" cy="40" rx="18" ry="12" fill="#00BCD4" />
    <circle cx="44" cy="40" r="3" fill="#263238" />
    <circle cx="56" cy="40" r="3" fill="#263238" />
    
    {/* Body */}
    <rect x="42" y="55" width="16" height="16" rx="3" fill="#00ACC1" />
  </>
);

const ArrowUp = () => <polygon points="50,10 43,20 57,20" fill="#00E5FF" />;
const ArrowDown = () => <polygon points="50,90 43,80 57,80" fill="#00E5FF" />;
const ArrowLeft = () => <polygon points="10,50 20,43 20,57" fill="#00E5FF" />;
const ArrowRight = () => <polygon points="90,50 80,43 80,57" fill="#00E5FF" />;

export const RobotNorth = () => (
  <svg {...commonProps}>
    <ArrowUp />
    <RobotBody />
  </svg>
);

export const RobotSouth = () => (
  <svg {...commonProps}>
    <ArrowDown />
    <RobotBody />
  </svg>
);

export const RobotWest = () => (
  <svg {...commonProps}>
    <ArrowLeft />
    <RobotBody />
  </svg>
);

export const RobotEast = () => (
  <svg {...commonProps}>
    <ArrowRight />
    <RobotBody />
  </svg>
);
