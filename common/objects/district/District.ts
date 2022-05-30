import { Expose } from 'class-transformer';

export class District {
    @Expose() title: string;
    @Expose() authorUsername: string;
    @Expose() createDate: string;
    @Expose() subscriberCount: number;
    @Expose() viewCount: number;
    @Expose() postCount: number;
    @Expose() convoCount: number;
    @Expose() talkingPointCount: number;
    @Expose() isBanned: boolean;
    @Expose() viewMode: ViewMode;
    @Expose() categories: Array<Category>; //Is there a way to store category tags? Should be able to sort districts by categories.
    @Expose() description?: string;
    @Expose() thumbnail?: string;

    constructor(title: string, 
        authorUsername: string, 
        createDate: string,
        subscriberCount: number,
        viewCount: number,
        postCount: number,
        convoCount: number,
        talkingPointCount: number,
        isBanned: boolean,
        viewMode: ViewMode,
        categories: Array<Category>,
        description?: string,
        thumbnail?: string) {
        this.title = title;
        this.authorUsername = authorUsername;
        this.createDate = createDate;
        this.subscriberCount = subscriberCount; //Maybe should just be set to 0 in the constructor rather than taking an argument?
        this.viewCount = viewCount;
        this.postCount = postCount;
        this.convoCount = convoCount;
        this.talkingPointCount = talkingPointCount;
        this.isBanned = isBanned;
        this.viewMode = viewMode;
        this.categories = categories;
        this.description = description;
        this.thumbnail = thumbnail;
    }

    static builder(
        props: {
            title: string, 
            authorUsername: string, 
            createDate: string,
            subscriberCount: number,
            viewCount: number,
            postCount: number,
            convoCount: number,
            talkingPointCount: number,
            isBanned: boolean,
            viewMode: ViewMode,
            categories: Array<Category>,
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
            props.categories,
            props.description,
            props.thumbnail,
        )
    }
    

}

export enum ViewMode {
    PRIVATE,
    PUBLIC
}

export enum Category {
    WORLDNEWS = "World News",
    BUSINESS = "Business",
    CRYPTOCURRENCY = "Crypto Currency",
    HEALTH = "Health",
    TECHNOLOGY = "Technology",
    SPORTS = "Sports",
    ENTERTAINMENT = "Entertainment",
    SOFTWARE = "Software",
    VEHICLES = "Vehicles"
}