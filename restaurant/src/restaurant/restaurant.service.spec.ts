import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { Res } from '@nestjs/common';

import { RestaurantList } from './interface/restaurant.interface';
const fs = require('fs');
const path = require('path');

// 전체 Service 코드가 잘 작동되는지 테스트
describe('RestaurantService', () => {
  let service: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// 1. Service - 'getAllRestaurants()' 테스트
describe('RestaurantService - getAllRestaurants() 유닛 테스트', () => {
  let service: RestaurantService;

  // 1-1. test용 JSON 파일 경로 받기
  const testFilePath = path.join(__dirname, 'test-data', 'restaurants.test.json');

  // 1-2. RestaurantService가 기존에 사용하는 filePath 경로를 test 경로로 바꾸기
  beforeEach(() => {
    service = new RestaurantService(); // RestaurantService 인스턴스 생성 -> 'service'에 할당

    (service as any).filePath = testFilePath; // RestaurantService가 기존에 사용하는 'filePath' = private 임
                                              // : private을 임시 해제 -> 테스트에서도 'filePath'를 사용할 수 있게 설정!
                                              //   -> 'filePath'의 경로를, 우리가 지금 지정한 'testFilePath'로 잠깐 변경
                                              // ∴ RestaurantService에서 test용 JSON 파일 경로로 들어가도록 잠깐 변경
  });

  // 1-3. '실제 readFile한 결과 == getAllRestaurants 결과' 인지 확인
  it('Test용 JSON 파일에서 모든 restaurant 데이터 가져오는지 확인 (Service)', async () => {

    // 실제로 readFile을 한 결과
    const expectedData = JSON.parse(await fs.promises.readFile(testFilePath, 'utf-8'));

    // getAllRestaurants()를 사용한 결과
    const result = await service.getAllRestaurants();

    // 2개 결과가 같은지 비교
    expect(result).toEqual(expectedData);
  });
});

// 2. Service - 'getRestaurantByName()' 테스트
describe('RestaurantService - getRestaurantByName() 유닛 테스트', () => {
  let service: RestaurantService;

  const testFilePath = path.join(__dirname, 'test-data', 'restaurants.test.json');

  let testJsonData: RestaurantList; // 전체 JSON 데이터 저장하는 전역 변수 선언

  // 2-1. 먼저 test용 JSON 데이터 전체 가져오기
  beforeAll(async () => {
    const raw = await fs.promises.readFile(testFilePath, 'utf-8'); // test용 JSON 데이터 읽기
    testJsonData = JSON.parse(raw); // jsonData 변수에, JSON 데이터 저장
  });

  beforeEach(() => {
    service = new RestaurantService();

    (service as any).filePath = testFilePath; // test용 JSON 파일 경로로 수정
  });

  it('Test용 JSON 파일에서 특정 name에 해당하는 데이터 가져오는지 확인 (Service)', async() => {
    // 2-2. test용 name 하나 생성
    const targetName: string = '먹거리 고을';

    // 2-3. 전체 test용 JSON 데이터에서, name이랑 같은 데이터 찾기
    const expected = testJsonData.restaurants.find(r => r.name === targetName);
    
    // 2-4. 실제 getRestaurantByName 메서드 실행
    const result = await service.getRestaurantByName(targetName);

    // 2-4. 예상값 == 실제값 비교
    expect(result).toEqual(expected);
  });
});