import { Injectable, Res } from '@nestjs/common';

import { Restaurant, RestaurantList } from './interfaces/restaurant.interface';

const fs = require('fs');
const path = require('path');

const { fileURLToPath } = require('url');
const { dirname } = require('path');

@Injectable()
export class RestaurantService {

    // 디렉토리를 한번만 선언 (process.cwd() : 루트 디렉토리)
    private readonly filePath = path.join(process.cwd(), 'src', 'restaurant', 'data', 'restaurants.json');

    // 1. 모든 restaurant 데이터 가져오기 (Service)
    async getAllRestaurants(): Promise<RestaurantList> {
        try {

            // 1-1. fs 모듈의 promise 기능 사용 -> await 붙여서, fs 모듈의 결과 기다림
            const data: string = await fs.promises.readFile(this.filePath, 'utf-8');

            // 1-2. 가져온 JSON 데이터 반환
            return JSON.parse(data);

        } catch(err) {
            throw new Error(`JSON 파일 읽기 실패: ${err.message}`);
        }
    }

    // 2. 특정 name의 restaurant 가져오기 (Service)
    async getRestaurantByName(name: string): Promise<Restaurant | undefined> {
        try {
            
            // 2-1. 먼저 전체 JSON 데이터 다 불러오기 : getAllRestaurants 사용 -> data 배열에 저장
            const data: RestaurantList = await this.getAllRestaurants();

            // 2-2. name 똑같은 1개 Restaurant만 반환
            return data.restaurants.find(r => r.name === name);

        } catch(err) {
            throw new Error(`JSON 파일 읽기 실패: ${err.message}`);
        }
    }

}