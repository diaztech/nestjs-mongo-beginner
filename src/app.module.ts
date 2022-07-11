import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { MongooseModule } from "@nestjs/mongoose";
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    CarModule,
    MongooseModule.forRoot('mongodb://localhost/car_manager')
  ]
})
export class AppModule {}
