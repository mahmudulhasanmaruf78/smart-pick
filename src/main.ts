import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Use NestExpressApplication type to gain access to express-specific features (like static assets)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS so a frontend (e.g. Next.js/React) can communicate with this API
  app.enableCors();

  // Setup Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strips out any properties not in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true,          // Automatically converts types (e.g., string to number)
    }),
  );

  // Serve static files from the 'uploads' folder for NID images and profile pics
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
