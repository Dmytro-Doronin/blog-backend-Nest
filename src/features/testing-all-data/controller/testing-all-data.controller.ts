import {Controller, Delete, HttpCode} from "@nestjs/common";
import {TestingAllDataService} from "../service/testing-all-data.service";


@Controller('/testing/all-data')
export class TestingAllDataController {
    testingAllDataService: TestingAllDataService

    constructor(testingAllDataService: TestingAllDataService) {
        this.testingAllDataService = testingAllDataService
    }

    @HttpCode(204)
    @Delete()
    async deleteAll() {
        const result =  await this.testingAllDataService.deleteAllDataService()
    }

}