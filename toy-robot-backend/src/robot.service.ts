import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Robot } from './robot.entity';

@Injectable()
export class RobotService {
  constructor(
    @InjectRepository(Robot) private repo: Repository<Robot>,
    private dataSource: DataSource,
  ) {}

  private directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

  async place(x: number, y: number, facing: string) {
    this.validate({ x, y, facing });
    return this.repo.save({ x, y, facing });
  }

  // TODO: Fix race condition
  // If commands are sent too quickly in succession, this can result in stale reads.
  // For example, two commands may read the same initial robot state before either writes a new one.
  // This can cause incorrect moves or rotations. Add a queue/mutex in future.
  async handleCommand(command: string): Promise<Robot> {
    const latest = await this.findLatest();

    if (!latest && command !== 'PLACE') throw new Error('Robot not placed');
    if (!latest) throw new Error('No current robot');

    const { x, y, facing } = latest;

    if (command === 'MOVE') {
      const [nx, ny] = this.nextPosition(x, y, facing);
      if (nx < 0 || nx > 4 || ny < 0 || ny > 4) {
        throw new Error("Can't move off the board");
      }
      return await this.repo.save({ x: nx, y: ny, facing });
    }

    if (command === 'LEFT' || command === 'RIGHT') {
      const idx = this.directions.indexOf(facing);
      const newDir = command === 'LEFT' ? (idx + 3) % 4 : (idx + 1) % 4;
      const newFacing = this.directions[newDir];
      return await this.repo.save({ x, y, facing: newFacing });
    }

    throw new Error('Invalid command');
  }

  nextPosition(x: number, y: number, facing: string): [number, number] {
    if (facing === 'NORTH') return [x, y + 1];
    if (facing === 'EAST') return [x + 1, y];
    if (facing === 'SOUTH') return [x, y - 1];
    if (facing === 'WEST') return [x - 1, y];
    return [x, y];
  }

  validate(robot: { x: number; y: number; facing: string }) {
    const { x, y, facing } = robot;

    if (x < 0 || x > 4 || y < 0 || y > 4) {
      throw new Error('Invalid position');
    }

    if (!this.directions.includes(facing)) {
      throw new Error('Invalid direction');
    }
  }

  async findLatest() {
    const results = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return results[0];
  }

  async getHistory() {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  async clearRobot() {
    return this.repo.save({ x: -1, y: -1, facing: 'NONE' });
  }
}
