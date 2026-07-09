/**
 * main.ts — application entry point.
 *
 * Boots the NestJS HTTP server (which also hosts the Socket.IO gateway for
 * real-time chat). Railway injects the PORT environment variable, so we
 * always read the port from the environment with a sensible local default.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // The Expo app runs on a different origin (device / simulator), so CORS
  // must be open. In production you can tighten this to your app's domains.
  app.enableCors({ origin: true });

  // Global validation: every DTO decorated with class-validator rules is
  // automatically validated. `whitelist` strips unknown properties so a
  // client can never write fields we did not explicitly allow.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  // All REST routes live under /api (e.g. POST /api/auth/send-otp).
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`InStars backend listening on port ${port}`);
}

bootstrap();
