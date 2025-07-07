import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Express } from 'express';

describe('Robot API (e2e)', () => {
  let app: INestApplication<Express>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/robot/place (POST)', () => {
    it('should place robot successfully', () => {
      return request(app.getHttpServer())
        .post('/robot/place')
        .send({ x: 0, y: 0, facing: 'NORTH' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('x');
          expect(res.body).toHaveProperty('y');
          expect(res.body).toHaveProperty('facing');
        });
    });
  });

  describe('/robot/command (POST)', () => {
    it('should execute command successfully', async () => {
      // Place robot first
      await request(app.getHttpServer()).post('/robot/place').send({ x: 1, y: 1, facing: 'NORTH' });

      return request(app.getHttpServer())
        .post('/robot/command')
        .send({ command: 'MOVE' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('x');
          expect(res.body).toHaveProperty('y');
          expect(res.body).toHaveProperty('facing');
        });
    });
  });

  describe('/robot/latest (GET)', () => {
    it('should return latest robot state', () => {
      return request(app.getHttpServer()).get('/robot/latest').expect(200);
    });
  });

  describe('/robot/history (GET)', () => {
    it('should return robot history', () => {
      return request(app.getHttpServer())
        .get('/robot/history')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/robot/clear (POST)', () => {
    it('should clear robot successfully', () => {
      return request(app.getHttpServer()).post('/robot/clear').expect(201);
    });
  });
});
