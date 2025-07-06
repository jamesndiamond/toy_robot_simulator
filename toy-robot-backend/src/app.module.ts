import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Robot } from './robot.entity';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'robot.db',
      synchronize: true,
      entities: [Robot],
    }),
    TypeOrmModule.forFeature([Robot]),
  ],
  controllers: [RobotController],
  providers: [RobotService],
})
export class AppModule {}
