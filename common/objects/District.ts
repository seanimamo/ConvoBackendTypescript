import { Expose } from 'class-transformer';
import TransformDate from '../util/TransformDate';
import { ViewMode } from './ViewMode';

export class District {
    @Expose() title: string; // This is also the UUID for a district.
    @Expose() authorUsername: string;
    @TransformDate()
    @Expose() createDate: Date;
    @Expose() isBanned: boolean;
    @Expose() viewMode: ViewMode;
    @Expose() primaryCategory: Category;
    @Expose() secondaryCategory?: Category;
    @Expose() tertiaryCategory?: Category;
    @Expose() description?: string;
    @Expose() thumbnail?: string;
    // Metrics
    @Expose() subscriberCount: number;
    @Expose() viewCount: number;
    @Expose() postCount: number;
    @Expose() convoCount: number;
    @Expose() talkingPointCount: number;

    constructor(title: string, 
        authorUsername: string, 
        createDate: Date,
        subscriberCount: number,
        viewCount: number,
        postCount: number,
        convoCount: number,
        talkingPointCount: number,
        isBanned: boolean,
        viewMode: ViewMode,
        primaryCategory: Category,
        secondaryCategory?: Category,
        tertiaryCategory?: Category,
        description?: string,
        thumbnail?: string) {
        this.title = title;
        this.authorUsername = authorUsername;
        this.createDate = createDate;
        this.subscriberCount = subscriberCount; 
        this.viewCount = viewCount;
        this.postCount = postCount;
        this.convoCount = convoCount;
        this.talkingPointCount = talkingPointCount;
        this.isBanned = isBanned;
        this.viewMode = viewMode;
        this.primaryCategory = primaryCategory
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
            subscriberCount: number,
            viewCount: number,
            postCount: number,
            convoCount: number,
            talkingPointCount: number,
            isBanned: boolean,
            viewMode: ViewMode,
            primaryCategory: Category,
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
            props.subscriberCount,
            props.viewCount,
            props.postCount,
            props.convoCount,
            props.talkingPointCount,
            props.isBanned,
            props.viewMode,
            props.primaryCategory,
            props.secondaryCategory,
            props.tertiaryCategory,
            props.description,
            props.thumbnail,
        )
    }

    static validate(district: District) {
        // TODO: Add validation
    }
    

}

export enum Category {
    BUSINESS = "Business",
    ENTERTAINMENT = "Entertainment",
    FINANCE = "Finance",
    HEALTH = "Health",
    NEWS = "News",
    POLITICS = "Politics",
    SPORTS = "Sports",
    TECHNOLOGY = "Technology"
}