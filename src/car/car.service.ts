import { Injectable, HttpException } from '@nestjs/common';
import { CARS } from './cars.mock';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ICar } from "./interfaces/car.interface";
import { CarDto } from "./car.dto";

// Filter output of json
const carProjection = {
    __v: false,
    _id: false,
}

@Injectable()
export class CarService {
    // Inject Car Model into the service
    constructor(@InjectModel('Car') private readonly carModel: Model<ICar>) { }

    // Mongoose Business Logic - async await
    public async getCars(): Promise<CarDto[]> {     // Array of CarDto because multiple cars
        // find()
        const cars = await this.carModel.find({}, carProjection).exec();
        if (!cars || !cars[0]) {
            throw new HttpException('Not found!', 404);
        }
        return cars;
    }
    public async postCar(newCar: CarDto) {
        // Creates the new car object
        const car = await new this.carModel(newCar);
        return car.save();
    }
    public async getCarById(id: number): Promise<CarDto> {
        // findOne()
        const car = await this.carModel.findOne({}, carProjection).exec();
        if (!car) {
            throw new HttpException('Not found!', 404);
        }
        return car;
    }
    public async deleteCarById(id: number): Promise<CarDto> {
        // remove()
        const car = await this.carModel.remove({ id }).exec();
        if (car.deletedCount === 0) {
            throw new HttpException('Not found!', 404);
        }
        return car;
    }
    public async putCarById(
        id: number,
        propertyName: string,
        propertyValue: string
    ): Promise<CarDto> {
        const car = await this.carModel
            .findOneAndUpdate({ id }, {
                [propertyName]: propertyValue
            })
            .exec();
        if (!car || !car[0]) {
            throw new HttpException('Not found!', 404);
        }
        return car;
    }

    // // Old Business Logic
    // // Variables
    // private cars = CARS;
    // public getCars() {
    //     return this.cars;
    // }
    // public postCar(car) {
    //     return new Promise((resolve) => {
    //         return resolve(this.cars.push(car));
    //     })
    // }
    // public getCarById(id: number): Promise<any> {
    //     const carId = Number(id);
    //     return new Promise((resolve) => {
    //         const car = this.cars.find((car) => car.id === carId);
    //         console.log(car);
    //         if (!car) {
    //             // Throw an http response...
    //             throw new HttpException("Not Found!", 404);
    //         }
    //         return resolve(car);
    //     })
    // }
    // public deleteCarById(id: number): Promise<any> {
    //     const carId = Number(id)
    //     // Finds the car
    //     const index = this.cars.findIndex((car) => car.id === carId);
    //     // Returns the promise
    //     return new Promise((resolve) => {
    //         if (index === -1) {
    //             // Throw an http response...
    //             throw new HttpException("Not Found!", 404);
    //         }
    //         this.cars.splice(index, 1);
    //         // Returns the index of the car deleted
    //         return resolve(this.cars[index]);
    //     })
    // }
    // public putCarById(
    //     id: number,
    //     propertyName: string,
    //     propertyValue: string
    // ): Promise<any> {
    //     const carId = Number(id);
    //     // Finds the car 
    //     const index = this.cars.findIndex((car) => car.id === carId);
    //     // Returns the promise
    //     return new Promise((resolve) => {
    //         // Throw an http response...
    //         if (index === -1) {
    //             throw new HttpException('Not Found', 404);
    //         }

    //         this.cars[index][propertyName] = propertyValue;

    //         // Returns the cars
    //         // return resolve(this.cars);

    //         // Returns the index of the cars modified
    //         return resolve(this.cars[index]);
    //     })
    // }
}
