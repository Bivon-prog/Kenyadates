import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Performance Response-Time Middleware
  app.use((req: any, res: any, next: () => void) => {
    const start = Date.now();
    const send = res.send;
    res.send = function (body: any) {
      if (!res.headersSent) {
        res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
      }
      return send.call(this, body);
    };
    next();
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('KenyaDates API')
    .setDescription('KenyaDates Modular Monolith Backend API Documentation - High Performance Cache Enabled')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 KenyaDates High-Performance API running on port ${port}`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();

