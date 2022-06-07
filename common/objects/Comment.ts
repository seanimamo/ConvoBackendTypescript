import { Expose } from 'class-transformer';

export class Comment {
    @Expose() id: string;
    @Expose() parentId: string;
    @Expose() authorUsername: string;
    @Expose() createDate: string;
    @Expose() body: string;
    @Expose() upVotes: number;
    @Expose() downVotes: number;
    @Expose() isEdited: boolean;
    @Expose() isBanned: boolean;
    @Expose() score: number;


    constructor(id: string,
        parentId: string,
        authorUsername: string,
        createDate: string,
        body: string,
        upVotes: number,
        downVotes: number,
        isEdited: boolean,
        isBanned: boolean,
        score: number) {
        this.id = id;
        this.parentId = parentId;
        this.authorUsername = authorUsername;
        this.createDate = createDate;
        this.body = body;
        this.upVotes = upVotes;
        this.downVotes = downVotes;
        this.isEdited = isEdited;
        this.isBanned = isBanned;
        this.score = score;
    }

    static builder (
        props: {
            id: string,
            parentId: string,
            authorUsername: string,
            createDate: string,
            body: string,
            upVotes: number,
            downVotes: number,
            isEdited: boolean,
            isBanned: boolean,
            score: number
        }
    ) {
        return new Comment(
            props.id,
            props.parentId,
            props.authorUsername,
            props.createDate,
            props.body,
            props.upVotes,
            props.downVotes,
            props.isEdited,
            props.isBanned,
            props.score
        )
    }

}


