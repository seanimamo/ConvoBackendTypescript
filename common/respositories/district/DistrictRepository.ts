import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { Repository } from "../Repository";
import { District } from "../../objects/district/District";
import { DistrictAlreadyExists } from "./error";

export class DistrictRepository extends Repository<District> {
    static objectIdentifier = "DISTRICT";

    createPartitionKey = (district: District) => {
        return district.title;
    }

    createSortKey = (district: District) => {
        return [
          DistrictRepository.objectIdentifier,
          district.postCount
        ].join('_');
    }

    constructor(client: DynamoDBClient) {
        super(client, District);
    }

    async save(district: District) {
        District.validate(district);

        const existingDistrict = await this.getByTitle(district.title);
        if (existingDistrict !== null) {
            throw new DistrictAlreadyExists("District already exists");
        }

        return await super.saveItem({object: district, checkForExistingCompositeKey: false});
    }

    async getByTitle(title: string) {
        return await super.getUniqueItemByCompositeKey({
            primaryKey: title,
            sortKey: DistrictRepository.objectIdentifier,
            shouldPartialMatchSortKey: true
        });
    }
}