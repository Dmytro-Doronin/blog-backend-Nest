import {Injectable} from "@nestjs/common";
import {TestingAllDataRepository} from "../repositories/testing-all-data.repository";

@Injectable()
export class TestingAllDataService {

    constructor(private testingAllDataRepository: TestingAllDataRepository) {}

    async deleteAllDataService () {
        return await this.testingAllDataRepository.deleteAllData()
    }
}