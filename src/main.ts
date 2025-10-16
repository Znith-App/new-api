import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: ['http://localhost:8081'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Zenith API')
      .setDescription('API do Zenith.')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Erro ao inicializar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap();
