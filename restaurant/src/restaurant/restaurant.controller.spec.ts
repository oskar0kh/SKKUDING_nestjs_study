import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';

import { RestaurantService } from './restaurant.service'; // RestaurantService 모듈 가져오기
import { RestaurantList } from './interface/restaurant.interface'; // RestaurantList 타입 가져오기
import { REPLCommand } from 'repl';
const fs = require('fs');
const path = require('path');

// 1. 전체 Controller 코드가 잘 작동되는지 테스트
describe('RestaurantController', () => { // 1-1. 현재 테스트 그룹명 = 'RestaurantController'로 지정
  let controller: RestaurantController;  // 나중에 controller 변수에 RestaurantController 객체를 할당할 예정

  beforeEach(async () => {               // 1-2. it() 테스트케이스 실행 전, 초기 환경설정용
    const module: TestingModule = await Test.createTestingModule({       // 1) Test용 모듈 생성
      controllers: [RestaurantController],                               //   -> 현재 테스트에서만 사용할 객체 종류 지정
      providers : [RestaurantService]                                    //   -> Controller가 생성자에서 Service 사용함
    }).compile();                                                        // 모듈 컴파일 (실제로 실행할 수 있게 됨)

    controller = module.get<RestaurantController>(RestaurantController); // 2) Test용 모듈에서 RestaurantController
  });                                                                    //      객체 까내서, 현재 테스트 그룹에서 사용하는
                                                                         //      controller 변수에 할당
  it('should be defined', () => {        // 1-3. 개별 테스트 케이스 (RestaurantController가 잘 생성되는지 확인하는 테스트)
    expect(controller).toBeDefined();    //   -> controller가 undefined인지 확인
  });
});

// 2. Controller의 'getAllRestaurants()' 메서드 테스트
describe('RestaurantController - getAllRestaurants() 통합 테스트', () => {
  let controller: RestaurantController;
  let service: RestaurantService;

  // 2-1. test용 경로 선언
  const testFilePath = path.join(__dirname, 'test-data', 'restaurants.test.json');

  // 2-2. parsing한 test용 JSON 데이터를 저장하는 변수 (메서드 실행 결과랑 비교하기 위함)
  let testData: RestaurantList;

  // 2-3. test용 JSON 데이터 먼저 읽기 (메서드 실행 결과랑 비교하기 위함)
  beforeAll(async () => {
    const raw = await fs.promises.readFile(testFilePath, 'utf-8'); // test용 JSON 데이터 읽기
    testData = JSON.parse(raw); // testData 변수에, JSON 데이터 저장
  });

  // 2-4. test용 모듈 생성, 초기 환경 설정
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],    // TestingModule에 어떤 Controller 넣을지 지정
      providers: [RestaurantService],         // TestingModule에 어떤 Service 넣을지 지정
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController); // controller 모듈 생성
    service = module.get<RestaurantService>(RestaurantService);          // service 모듈 생성

    (service as any).filePath = testFilePath; // 테스트용 JSON 파일을 사용하도록, service의 filePath 수정
  });

  // 2-5. 실제 테스트 케이스 로직 작성
  it('Test용 JSON 파일에서 모든 restaurant 데이터 가져오는지 확인 (Controller)', async () => {
    const mockRes = { // mockRes : Express의 Response 객체를 Mocking
      status: jest.fn().mockReturnThis(), // res.status().json() 같은 체이닝 구조 구현
      json: jest.fn(), // json(data) 역할 : 자기가 가지고 있는 데이터 그대로 출력
    };

    await controller.getAllRestaurants(mockRes as any); // 실제 Controller의 'getAllRestaurants()' 메서드 실행

    // 반환된 status 코드 비교하기 (ex: 데이터 직접 읽었을 때의 200 코드 == getAllRestaurants의 200 코드)
    expect(mockRes.status).toHaveBeenCalledWith(200);

    // 직접 읽었을 때의 JSON 데이터 == getAllRestaurants() 메서드의 JSON 데이터 결과값 비교
    expect(mockRes.json).toHaveBeenCalledWith(testData);
  });
});