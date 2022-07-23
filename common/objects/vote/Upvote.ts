import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import TransformDate from "../../util/TransformDate";
import TransformObjectId from "../../util/TransformObjectId";
import { ObjectId } from "../ObjectId";
import { DataValidationError, DataValidator } from '../../util/DataValidator';

/**
 * An Upvote in Convo is equivalent to liking on other platforms. However the trait assigned to the upvote modifies 
 * how the parent object's scoring is calculated. 
 * 
 * Note that object has a lastUpdated field because if a user changes an upvoted trait we can update this object and change the trait
 * rather than deleting the old object and creating a new one. This leads to higher database efficiency.
 */
export enum PositiveTrait {
    FUNNY = "Funny",
    KNOWLEDGEABLE = 'Knowledgeable',
    UPBEAT = 'Upbeat',
    HIGH_QUALITY = 'High Quality',
    IMPACTFUL = 'Impactful'
}

export class UpvoteId extends ObjectId {
    public static readonly IDENTIFIER = "UPVOTE";

    constructor(params: { authorUserName: string, trait: PositiveTrait, parentId: ObjectId } | string) {
        typeof (params) === 'string'
            ? super(params)
            : super([params.authorUserName, params.trait, params.parentId]);
    }

    public getIdentifier(): string {
        return UpvoteId.IDENTIFIER;
    }
}

export class Upvote {
    @TransformObjectId()
    @Expose() readonly id: UpvoteId // Leaving the id as null will let be automatically created as expected
    @TransformObjectId()
    @Expose() readonly parentId: ObjectId;
    @Expose() readonly authorUserName: string;
    @TransformDate()
    @Expose() readonly createDate: Date;
    @Expose() readonly trait: PositiveTrait;
    @TransformDate()
    @Expose() lastUpdated?: Date;

    constructor(
        id: UpvoteId | null,
        parentId: ObjectId,
        authorUserName: string,
        createDate: Date,
        trait: PositiveTrait,
        lastUpdated?: Date,
    ) {
        if (id === null) {
            this.id = new UpvoteId({ authorUserName, trait, parentId });
        } else {
            this.id = id;
        }
        this.parentId = parentId;
        this.authorUserName = authorUserName;
        this.createDate = createDate;
        this.trait = trait;
        this.lastUpdated = lastUpdated;
    }

    static builder(params: {
        id: UpvoteId | null,
        parentId: ObjectId,
        authorUserName: string,
        createDate: Date,
        trait: PositiveTrait,
        lastUpdated?: Date,
    }) {
        return new Upvote(
            params.id,
            params.parentId,
            params.authorUserName,
            params.createDate,
            params.trait,
            params.lastUpdated
        );
    }

    static validate(vote: Upvote) {
        // TODO: Grab validator from singleton source
        const validator: DataValidator = new DataValidator();

        validator.validate(vote.id, "id").notUndefined().notNull();
        const partitionedId = UpvoteId.parseId(vote.id.getValue());
        if (partitionedId[0] !== UpvoteId.IDENTIFIER) {
            throw new DataValidationError("Upvote Identifier is not first value in provided id");
        }
        if (partitionedId[1] !== vote.authorUserName) {
            throw new DataValidationError("authorUserName is not second value in provided id");
        }
        if (partitionedId[2] !== vote.trait) {
            throw new DataValidationError("trait is not third value in provided id");
        }
        if (partitionedId[3] !== vote.parentId.getValue()) {
            throw new DataValidationError("parentId is not fourth value in provided id");
        }

        validator.validate(vote.parentId, "parentId").notUndefined().notNull().notEmpty();
        validator.validate(vote.authorUserName, "authorUserName").notUndefined().notNull().isString().notEmpty();
        validator.validate(vote.createDate, "createDate").notUndefined().notNull().isDate().dateIsNotInFuture();
        validator.validate(vote.trait, "trait").notUndefined().notNull().isStringInEnum(PositiveTrait);
        if (vote.lastUpdated !== undefined) {
            validator.validate(vote.lastUpdated, "lastUpdated").notUndefined().notNull().isDate().dateIsNotInFuture();
        }
    }
}
