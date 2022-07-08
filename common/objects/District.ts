import 'reflect-metadata'; //required for class transformer to work;
import { Expose, Type } from 'class-transformer';
import { DataValidationError, DataValidator } from '../util/DataValidator';
import TransformDate from '../util/TransformDate';
import { ViewMode } from './enums';
import { ObjectBanStatus } from './ObjectBanStatus';
import { ObjectId } from './ObjectId';
import TransformObjectId from '../util/TransformObjectId';

export class DistrictId extends ObjectId {
    public static readonly IDENTIFIER = "DISTRICT";

    constructor(params: { title: string } | string) {
        typeof (params) === 'string'
            ? super(DistrictId.IDENTIFIER, params)
            : super(DistrictId.IDENTIFIER, [params.title]);
    }
}

export class District {
    @TransformObjectId()
    @Expose() id: DistrictId;
    @Expose() title: string; // This is also the id for a district.
    @Expose() authorUsername: string;
    @TransformDate()
    @Expose() createDate: Date;
    @Type(() => ObjectBanStatus)
    @Expose() banStatus: ObjectBanStatus;
    @Expose() viewMode: ViewMode;
    @Expose() primaryCategory: Category;

    // Metrics
    @Expose() subscriberCount: number;
    @Expose() viewCount: number;
    @Expose() postCount: number;
    @Expose() convoCount: number;
    @Expose() talkingPointCount: number;

    //optional     
    @Expose() secondaryCategory?: Category;
    @Expose() tertiaryCategory?: Category;
    @Expose() description?: string;
    @Expose() thumbnail?: string;

    constructor(
        id: DistrictId | null,
        title: string,
        authorUsername: string,
        createDate: Date,
        banStatus: ObjectBanStatus,
        viewMode: ViewMode,
        primaryCategory: Category,
        subscriberCount: number,
        viewCount: number,
        postCount: number,
        convoCount: number,
        talkingPointCount: number,
        secondaryCategory?: Category,
        tertiaryCategory?: Category,
        description?: string,
        thumbnail?: string) {
        if (id === null) {
            this.id = new DistrictId({ title });
        } else {
            this.id = id;
        }
        this.title = title;
        this.authorUsername = authorUsername;
        this.createDate = createDate;
        this.banStatus = banStatus;
        this.viewMode = viewMode;
        this.primaryCategory = primaryCategory

        this.subscriberCount = subscriberCount;
        this.viewCount = viewCount;
        this.postCount = postCount;
        this.convoCount = convoCount;
        this.talkingPointCount = talkingPointCount;

        this.secondaryCategory = secondaryCategory
        this.tertiaryCategory = tertiaryCategory
        this.description = description;
        this.thumbnail = thumbnail;
    }

    static builder(
        props: {
            id: DistrictId | null,
            title: string,
            authorUsername: string,
            createDate: Date,
            banStatus: ObjectBanStatus,
            viewMode: ViewMode,
            primaryCategory: Category,
            subscriberCount: number,
            viewCount: number,
            postCount: number,
            convoCount: number,
            talkingPointCount: number,
            secondaryCategory?: Category,
            tertiaryCategory?: Category,
            description?: string,
            thumbnail?: string,
        }
    ) {
        return new District(
            props.id,
            props.title,
            props.authorUsername,
            props.createDate,
            props.banStatus,
            props.viewMode,
            props.primaryCategory,
            props.subscriberCount,
            props.viewCount,
            props.postCount,
            props.convoCount,
            props.talkingPointCount,
            props.secondaryCategory,
            props.tertiaryCategory,
            props.description,
            props.thumbnail,
        )
    }

    static validate(district: District) {
        // TODO: Grab validator from singleton source
        const validator = new DataValidator();
        // START -------- Id Validation --------
        validator.validate(district.id, "id").notUndefined().notNull();
        const partitionedId = ObjectId.parseId(district.id.getValue());
        if (partitionedId[0] !== DistrictId.IDENTIFIER) {
            throw new DataValidationError("DistrictRepository objectIdentifier is not first value in provided id");
        }
        if (partitionedId[1] !== district.title) {
            throw new DataValidationError("title is not second value in provided id");
        }
        validator.validate(district.title, "title").notUndefined().notNull().isString().notEmpty();
        // END -------- Id Validation --------
        validator.validate(district.authorUsername, "authorUsername").notUndefined().notNull().isString().notEmpty();
        validator.validate(district.createDate, 'createDate').notUndefined().notNull().isDate().dateIsNotInFuture();
        ObjectBanStatus.validate(district.banStatus);
        validator.validate(district.viewMode, "viewMode").notUndefined().notNull().isStringInEnum(ViewMode);
        validator.validate(district.primaryCategory, "primaryCategory").notUndefined().notNull().isStringInEnum(Category);
        validator.validate(district.subscriberCount, 'subscriberCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.viewCount, 'viewCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.postCount, 'postCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.convoCount, 'convoCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.talkingPointCount, 'talkingPointCount').notUndefined().notNull().isNumber().notNegative();
        if (district.secondaryCategory !== undefined) {
            validator.validate(district.secondaryCategory, "secondaryCategory").notUndefined().notNull().isStringInEnum(Category);
        }
        if (district.tertiaryCategory !== undefined) {
            validator.validate(district.tertiaryCategory, "tertiaryCategory").notUndefined().notNull().isStringInEnum(Category);
        }
        if (district.description !== undefined) {
            validator.validate(district.description, "description").notUndefined().notNull().isString().notEmpty();
        }
        // TODO: add complex user thumbnail format contraints validation
        if (district.thumbnail !== undefined) {
            validator.validate(district.thumbnail, "thumbnail").notUndefined().notNull().isString().notEmpty();
        }
    }
}

export enum Category {
    BUSINESS,
    ENTERTAINMENT,
    FINANCE,
    HEALTH,
    NEWS,
    POLITICS,
    SPORTS,
    TECHNOLOGY,
}

