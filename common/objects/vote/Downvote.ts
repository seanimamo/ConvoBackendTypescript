import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import TransformDate from "../../util/TransformDate";
import TransformObjectId from "../../util/TransformObjectId";
import { ObjectId } from "../ObjectId";
import { DataValidationError, DataValidator } from '../../util/DataValidator';

export enum NegativeTrait {
    OFFENSIVE = "Offensive",
    DISTURBING = 'Disturbing',
    LOW_QUALITY = 'Low Quality',
}

export class DownvoteId extends ObjectId {
    public static readonly IDENTIFIER = "DOWNVOTE";

    constructor(params: { authorUserName: string, trait: NegativeTrait, parentId: ObjectId } | string) {
        typeof (params) === 'string'
            ? super(params)
            : super([params.authorUserName, params.trait, params.parentId]);
    }

    public getIdentifier(): string {
        return DownvoteId.IDENTIFIER;
    }
}

/**
 * An Downvote in Convo is equivalent to disliking on other platforms. However the trait assigned to the upvote modifies 
 * how the parent object's scoring is calculated. 
 * 
 * Note that object has a lastUpdated field because if a user changes an upvoted trait we can update this object and change the trait
 * rather than deleting the old object and creating a new one. This leads to higher database efficiency.
 */
export class Downvote {
    @TransformObjectId()
    @Expose() readonly id: DownvoteId // Leaving the id as null will let be automatically created as expected
    @TransformObjectId()
    @Expose() readonly parentId: ObjectId;
    @Expose() readonly authorUserName: string;
    @TransformDate()
    @Expose() readonly createDate: Date;
    @Expose() readonly trait: NegativeTrait;
    @TransformDate()
    @Expose() lastUpdated?: Date;

    constructor(
        id: DownvoteId | null,
        parentId: ObjectId,
        authorUserName: string,
        createDate: Date,
        trait: NegativeTrait,
        lastUpdated?: Date,
    ) {
        if (id === null) {
            this.id = new DownvoteId({ authorUserName, trait, parentId });
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
        id: DownvoteId | null,
        parentId: ObjectId,
        authorUserName: string,
        createDate: Date,
        trait: NegativeTrait,
        lastUpdated?: Date,
    }) {
        return new Downvote(
            params.id,
            params.parentId,
            params.authorUserName,
            params.createDate,
            params.trait,
            params.lastUpdated
        );
    }

    static validate(vote: Downvote) {
        // TODO: Grab validator from singleton source
        const validator: DataValidator = new DataValidator();

        validator.validate(vote.id, "id").notUndefined().notNull();
        const partitionedId = DownvoteId.parseId(vote.id.getValue());
        if (partitionedId[0] !== DownvoteId.IDENTIFIER) {
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
        validator.validate(vote.trait, "trait").notUndefined().notNull().isStringInEnum(NegativeTrait);
        if (vote.lastUpdated !== undefined) {
            validator.validate(vote.lastUpdated, "lastUpdated").notUndefined().notNull().isDate().dateIsNotInFuture();
        }
    }
}
