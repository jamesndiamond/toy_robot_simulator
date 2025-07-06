import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { RobotService } from './robot.service';

@Controller('robot')
export class RobotController {
  constructor(private service: RobotService) {}

  @Post('place')
  async place(@Body() body: { x: number; y: number; facing: string }) {
    try {
      return await this.service.place(body.x, body.y, body.facing);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      throw new BadRequestException(message);
    }
  }

  @Post('command')
  async command(@Body() body: { command: string }) {
    try {
      return await this.service.handleCommand(body.command);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      throw new BadRequestException(message);
    }
  }

  @Get('latest')
  getLatest() {
    return this.service.findLatest();
  }

  @Get('history')
  getHistory() {
    return this.service.getHistory();
  }

  @Post('clear')
  clear() {
    return this.service.clearRobot();
  }
}
