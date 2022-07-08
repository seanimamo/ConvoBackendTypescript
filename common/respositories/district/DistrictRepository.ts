import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Repository } from "../Repository";
import { District, DistrictId } from "../../objects/District";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";

/**
 * (Get District by id/title *the title of a district is also its title.) 
 * PKEY: id
 * SKEY: DISTRICT
 * 
 *
 * (Get all districts)
 * GSI1: DISTRICT
 * SKEY: id
 * 
 * 
 * (Get posts by author username, sorted by create date)
 * GSI2: authorUserName
 * SKEY: CONVO#<createDate>
 * 
 * 
 */
export class DistrictRepository extends Repository<District> {

    createPartitionKey = (district: District) => {
        return district.id.getValue();
    }

    createSortKey = (district: District) => {
        return [
            DistrictId.IDENTIFIER,
            district.postCount
        ].join(Repository.compositeKeyDelimeter);
    }

    constructor(client: DynamoDBClient) {
        super(client, District);
    }

    async save(district: District) {
        District.validate(district);

        const items: Record<string, AttributeValue> = {};
        items[`${DYNAMODB_INDEXES.GSI1.partitionKeyName}`] = { S: DistrictId.IDENTIFIER };
        items[`${DYNAMODB_INDEXES.GSI1.sortKeyName}`] = { S: district.title };
        items[`${DYNAMODB_INDEXES.GSI2.partitionKeyName}`] = { S: district.authorUsername };
        items[`${DYNAMODB_INDEXES.GSI2.sortKeyName}`] = { S: this.createSortKey(district) };

        return await super.saveItem({ object: district, checkForExistingKey: "PRIMARY", extraItemAttributes: items });
    }

    async getByTitle(title: string) {
        return await super.getUniqueItemByCompositeKey({
            primaryKey: new DistrictId({title}).getValue(),
            sortKey: {
                value: DistrictId.IDENTIFIER,
                conditionExpressionType: "BEGINS_WITH",
            },
        });
    }

    /**
     * Retrieve multiple districts created by a specific user.
     */
    async listDistricts(params?: {
        paginationToken?: Record<string, AttributeValue>,
        queryLimit?: number;
    }) {
        return await super.getItemsByCompositeKey({
            primaryKey: DistrictId.IDENTIFIER,
            index: DYNAMODB_INDEXES.GSI1,
            paginationToken: params?.paginationToken,
            queryLimit: params?.queryLimit,
            sortDirection: "DESCENDING"
        });
    }

    /*
    * Retrieve multiple districts created by a specific user.
    */
    async getByAuthorUsername(params: {
        username: string,
        paginationToken?: Record<string, AttributeValue>,
        queryLimit?: number;
    }) {
        return await super.getItemsByCompositeKey({
            primaryKey: params.username,
            sortKey: {
                value: DistrictId.IDENTIFIER,
                conditionExpressionType: "BEGINS_WITH"
            },
            index: DYNAMODB_INDEXES.GSI2,
            paginationToken: params.paginationToken,
            queryLimit: params.queryLimit
        });
    }




}