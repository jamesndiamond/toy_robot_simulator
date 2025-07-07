import { Test, TestingModule } from '@nestjs/testing';
import { RobotService } from './robot.service';
import { Robot } from './robot.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

describe('RobotService', () => {
  let service: RobotService;
  const fakeRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RobotService,
        {
          provide: getRepositoryToken(Robot),
          useValue: fakeRepo,
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RobotService>(RobotService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Invalid Positions
  describe('Reject invalid placement', () => {
    const invalidPositions = [
      [5, 0, 'NORTH'],
      [0, 5, 'EAST'],
      [-1, 2, 'WEST'],
      [2, -2, 'SOUTH'],
      [-1, -1, 'NORTH'],
      [6, 6, 'EAST'],
    ];

    test.each(invalidPositions)(
      'should reject out-of-bounds placement at (%i, %i) facing %s',
      async (x: number, y: number, facing: string) => {
        await expect(service.place(x, y, facing)).rejects.toThrow('Invalid position');
      },
    );
  });

  // Invalid Facing Directions
  describe('Reject invalid direction', () => {
    const invalidFacings = ['UP', 'DOWN', '', null, undefined];

    test.each(invalidFacings)('should reject invalid direction "%s"', async (facing: string) => {
      await expect(service.place(2, 2, facing)).rejects.toThrow('Invalid direction');
    });
  });

  // Valid Placement
  describe('Valid placement', () => {
    const validPlacements = [
      [0, 0, 'NORTH'],
      [4, 4, 'WEST'],
      [2, 3, 'EAST'],
    ];

    test.each(validPlacements)(
      'should allow placement at (%i, %i) facing %s',
      async (x: number, y: number, facing: string) => {
        fakeRepo.save = jest.fn().mockResolvedValue({ x, y, facing });
        const result = await service.place(x, y, facing);
        expect(result).toEqual({ x, y, facing });
      },
    );
  });

  // Rotation LEFT
  describe('Rotate LEFT', () => {
    const leftRotations = [
      ['NORTH', 'WEST'],
      ['WEST', 'SOUTH'],
      ['SOUTH', 'EAST'],
      ['EAST', 'NORTH'],
    ];

    test.each(leftRotations)(
      'should rotate LEFT from %s to %s',
      async (start: string, expected: string) => {
        service.findLatest = jest.fn().mockResolvedValue({ x: 1, y: 1, facing: start });
        fakeRepo.save = jest.fn().mockResolvedValue({ x: 1, y: 1, facing: expected });
        const result = await service.handleCommand('LEFT');
        expect(result.facing).toBe(expected);
      },
    );
  });

  // Prevent moving off the grid
  describe('Block move off grid', () => {
    const offEdge = [
      [0, 0, 'SOUTH'],
      [0, 0, 'WEST'],
      [0, 4, 'NORTH'],
      [4, 0, 'EAST'],
    ];

    test.each(offEdge)(
      'should prevent moving off grid from (%i, %i) facing %s',
      async (x: number, y: number, facing: string) => {
        service.findLatest = jest.fn().mockResolvedValue({ x, y, facing });
        await expect(service.handleCommand('MOVE')).rejects.toThrow("Can't move off the board");
      },
    );
  });

  // Move forward one space
  describe('Valid move forward', () => {
    const moves = [
      [2, 2, 'NORTH', 2, 3],
      [2, 2, 'SOUTH', 2, 1],
      [2, 2, 'EAST', 3, 2],
      [2, 2, 'WEST', 1, 2],
    ];

    test.each(moves)(
      'should move from (%i, %i) %s to (%i, %i)',
      async (x: number, y: number, facing: string, expectedX: number, expectedY: number) => {
        service.findLatest = jest.fn().mockResolvedValue({ x, y, facing });
        fakeRepo.save = jest.fn().mockResolvedValue({ x: expectedX, y: expectedY, facing });
        const result = await service.handleCommand('MOVE');
        expect(result.x).toBe(expectedX);
        expect(result.y).toBe(expectedY);
        expect(result.facing).toBe(facing);
      },
    );
  });
});
