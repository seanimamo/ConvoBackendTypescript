import { Expose } from 'class-transformer';
import { DataValidationError, DataValidator } from '../util/DataValidator';
import TransformDate from '../util/TransformDate';
import { ViewMode } from './enums';



export class District {
    @Expose() title: string; // This is also the UUID for a district.
    @Expose() authorUsername: string;
    @TransformDate()
    @Expose() createDate: Date;
    @Expose() isBanned: boolean;
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

    constructor(title: string,
        authorUsername: string,
        createDate: Date,
        isBanned: boolean,
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

        this.title = title;
        this.authorUsername = authorUsername;
        this.createDate = createDate;
        this.isBanned = isBanned;
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
            title: string,
            authorUsername: string,
            createDate: Date,
            isBanned: boolean,
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
            props.title,
            props.authorUsername,
            props.createDate,
            props.isBanned,
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
        // TODO: Add validation
        const validator = new DataValidator();
        validator.validate(district.title, "title").notUndefined().notNull().isString().notEmpty();
        validator.validate(district.authorUsername, "authorUsername").notUndefined().notNull().isString().notEmpty();
        validator.validate(district.createDate, 'createDate').notUndefined().notNull().isDate().dateIsNotInFuture();
        validator.validate(district.isBanned, 'isBanned').notUndefined().notNull().isBoolean();
        if (ViewMode[district.viewMode] === undefined) {
            throw new DataValidationError("viewMode value is not defined in ViewMode enum");
        }
        if (Category[district.primaryCategory] === undefined) {
            throw new DataValidationError("primaryCategory value is not defined in Category enum");
        }
        validator.validate(district.subscriberCount, 'subscriberCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.viewCount, 'viewCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.postCount, 'postCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.convoCount, 'convoCount').notUndefined().notNull().isNumber().notNegative();
        validator.validate(district.talkingPointCount, 'talkingPointCount').notUndefined().notNull().isNumber().notNegative();

        if (district.secondaryCategory !== undefined) {
            if (Category[district.secondaryCategory] === undefined) {
                throw new DataValidationError("secondaryCategory value is not defined in Category enum");
            }
        }
        if (district.tertiaryCategory !== undefined) {
            if (Category[district.tertiaryCategory] === undefined) {
                throw new DataValidationError("tertiaryCategory value is not defined in Category enum");
            }
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

