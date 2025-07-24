import { Controller, Get, HttpStatus, Res, Query } from '@nestjs/common';
import { Response } from 'express'; // nestjs의 'Res'랑, express의 'Response'랑 연결해야함

import { RestaurantService } from './restaurant.service'; // Service 로직 가져오기
import { Restaurant, RestaurantList } from './interfaces/restaurant.interface'; // 인터페이스 가져오기

@Controller('restaurant')
export class RestaurantController {
    
    // constructor로 Service 로직 DI 주입
    constructor(private readonly restaurantService : RestaurantService) {};

    // 1. 모든 restaurant 데이터 불러오기 (Controller)
    // http://localhost:3000/restaurant

    @Get('/')
    async getAllRestaurants(@Res() res: Response): Promise<void> {
        try {

            // 1-1. service(getAllRestaurants) 사용 -> JSON 데이터 가져오기
            const data: RestaurantList = await this.restaurantService.getAllRestaurants();

            // 1-2. '200 성공 Response & JSON 데이터' 전송
            res.status(HttpStatus.OK).json(data);

        } catch(err){

            console.error('[파일 읽기 오류]', err);

            // 1-3. JSON 데이터 못 가져왔을 때 : 500 실패 Response 전송
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "파일 읽기 실패"});
        }
    }


    // 2. 특정 name의 restaurant 가져오기 (Controller)
    // http://localhost:3000/restaurant/find?name=생각나는 순대

    @Get('/:find')
    async getRestaurantByName(@Res() res: Response, @Query('name') name: string): Promise<void> {
        try {

            // 1. Service 사용 -> name 같은 1개 Restaurant 데이터만 가져오기 (getRestaurantByName)
            const data: Restaurant | undefined = await this.restaurantService.getRestaurantByName(name);

            // 2. '200 성공 Response & JSON 데이터' 전송
            res.status(HttpStatus.OK).json(data);

        } catch(err) {
            console.error('[파일 읽기 오류]', err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "파일 읽기 실패"});
        }
    }

}
