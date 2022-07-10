import 'reflect-metadata'; //required for class transformer to work;
import { Expose, Type } from "class-transformer";
import { DataValidationError, DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ParentType, ViewMode } from "../enums";
import { LinkPreview } from "./LinkPreview";
import { ObjectBanStatus } from '../ObjectBanStatus';
import { ObjectId } from '../ObjectId';
import TransformObjectId from '../../util/TransformObjectId';

export type TalkingPointPostConvoSource = {
  id: string;
  participantUsernames: string[];
}

export enum TalkingPointPostSourceType {
  CONVO = "Convo",
  CLASSIC = "Classic" // A classic source type is either a link preview or nothing
}

export enum AgeRating {
  EVERYONE = "Everyone",
  TEEN = "Teen",
  MATURE = "Mature",
  ADULT = "Adult (+18)"
}


export class TalkingPointPostId extends ObjectId {
  public static readonly IDENTIFIER = "POST_TALKING_POINT";

  constructor(params: { authorUserName: string, createDate: Date } | string) {
      typeof (params) === 'string'
          ? super(params)
          : super([params.authorUserName, params.createDate]);
  }

  protected getIdentifier(): string {
    return TalkingPointPostId.IDENTIFIER;
  }
}

export class TalkingPointPost {
  @TransformObjectId()
  @Expose() readonly id: TalkingPointPostId; // uuid
  @TransformObjectId()
  @Expose() readonly parentId: ObjectId; // this is a only district as of now but may change.
  @Expose() title: string;
  @Expose() readonly authorUserName: string; // The person to create the post
  @Expose() description: string;
  @TransformDate()
  @Expose() readonly createDate: Date;
  @Expose() source: { // A Talking point can be sourced from an existing Convo OR a link to something else
    type: TalkingPointPostSourceType;
    data?: TalkingPointPostConvoSource | LinkPreview;
  };
  @Type(() => ObjectBanStatus)
  @Expose() banStatus: ObjectBanStatus;
  @Expose() viewMode: ViewMode;
  @Expose() ageRating: AgeRating;
  @Expose()
  metrics: {
    absoluteScore: number;
    timeBasedScore: number;
    viewCount: number;
    commentCount: number;
  }
  @Expose() replyToPostId?: string; // A Talking point post can be created as a reply to another 
  @Expose() authorImageUrl?: string;
  @Expose() tags?: string[];

  constructor(
    id: TalkingPointPostId | null, // Leaving the id as null will let be automatically created as expected
    parentId: ObjectId,
    title: string,
    description: string,
    authorUserName: string,
    createDate: Date,
    source: {
      type: TalkingPointPostSourceType;
      data?: TalkingPointPostConvoSource | LinkPreview;
    },
    banStatus: ObjectBanStatus,
    viewMode: ViewMode,
    ageRating: AgeRating,
    metrics: {
      absoluteScore: number,
      timeBasedScore: number,
      viewCount: number,
      commentCount: number,
    },

    // optionals
    replyToPostId?: string,
    authorImageUrl?: string,
    tags?: string[],
  ) {
    if (id === null) {
      this.id = new TalkingPointPostId({authorUserName, createDate});
    } else {
      this.id = id;
    }
    this.parentId = parentId;
    this.title = title;
    this.description = description;
    this.authorUserName = authorUserName;
    this.createDate = createDate;
    this.source = source;
    this.banStatus = banStatus;
    this.viewMode = viewMode;
    this.ageRating = ageRating;
    this.metrics = metrics;
    // optionals
    this.replyToPostId = replyToPostId;
    this.authorImageUrl = authorImageUrl;
    this.tags = tags;
  }

  static builder(props: {
    id: TalkingPointPostId | null, // Leaving the id as null will let be automatically created as expected
    parentId: ObjectId,
    title: string,
    description: string,
    authorUserName: string,
    createDate: Date,
    source: {
      type: TalkingPointPostSourceType;
      data?: TalkingPointPostConvoSource | LinkPreview;
    },
    banStatus: ObjectBanStatus,
    viewMode: ViewMode,
    ageRating: AgeRating,
    metrics: {
      absoluteScore: number,
      timeBasedScore: number,
      viewCount: number,
      commentCount: number,
    },

    // optionals
    replyToPostId?: string,
    authorImageUrl?: string,
    tags?: string[],
  }
  ) {
    return new TalkingPointPost(
      props.id,
      props.parentId,
      props.title,
      props.description,
      props.authorUserName,
      props.createDate,
      props.source,
      props.banStatus,
      props.viewMode,
      props.ageRating,
      props.metrics,

      // optionals
      props.replyToPostId,
      props.authorImageUrl,
      props.tags
    );
  }

  static validate(post: TalkingPointPost) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    validator.validate(post.id, "id").notUndefined().notNull();
    const partitionedId = TalkingPointPostId.parseId(post.id.getValue());
    if (partitionedId[0] !== TalkingPointPostId.IDENTIFIER) {
      throw new DataValidationError("TalkingPointPostId Identifier is not first value in provided id");
    }
    if (partitionedId[1] !== post.authorUserName) {
      throw new DataValidationError("authorUserName is not third value in provided id");
    }
    if (partitionedId[2] !== TalkingPointPostId.dateToString(post.createDate)) {
      throw new DataValidationError("createDate is not fourth value in provided id");
    }

    validator.validate(post.parentId, "parentId").notUndefined().notNull().notEmpty();
    validator.validate(post.title, "title").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.description, "description").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.authorUserName, "authorUserName").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.createDate, "createDate").notUndefined().notNull().isDate().dateIsNotInFuture();
    ObjectBanStatus.validate(post.banStatus);
    validator.validate(post.viewMode, "viewMode").notUndefined().notNull().isStringInEnum(ViewMode);

    validator.validate(post.metrics, 'metrics').notUndefined().notNull();
    validator.validate(post.metrics.absoluteScore, 'metrics.absoluteScore').notUndefined().notNull().isNumber().notNegative();
    validator.validate(post.metrics.timeBasedScore, 'metrics.timeBasedScore').notUndefined().notNull().isNumber().notNegative();
    validator.validate(post.metrics.viewCount, 'metrics.viewCount').notUndefined().notNull().isNumber().notNegative();
    validator.validate(post.metrics.commentCount, 'metrics.commentCount').notUndefined().notNull().isNumber().notNegative();

    if (post.source !== undefined) {
      validator.validate(post.source.type, "source.type").notUndefined().notNull().isStringInEnum(TalkingPointPostSourceType);
      switch (post.source.type) {
        case TalkingPointPostSourceType.CONVO:
          validator.validate(post.source.data, "source.data").notUndefined().notNull();
          const convoSource = post.source.data as TalkingPointPostConvoSource;
          validator.validate(convoSource, "convoSource (source.data)").notUndefined().notNull();
          validator.validate(convoSource.id, "convoSource (source.data.id)").notUndefined().notNull().isString().notEmpty();
          validator.validate(convoSource.participantUsernames, "convoSource (source.data.participantUsernames)")
            .notUndefined().notNull().notEmpty();
          break;
        case TalkingPointPostSourceType.CLASSIC:
          // A classic source type is either a link preview or undefined
          if (post.source.data !== undefined) {
            LinkPreview.validate(post.source.data as LinkPreview);
          }
          break;
        default:
          throw new DataValidationError("Unexpected Post source type.");
      }
    }

    if (post.replyToPostId !== undefined) {
      validator.validate(post.replyToPostId, "replyToPostId").notUndefined().notNull().isString().notEmpty();
    }
    if (post.authorImageUrl !== undefined) {
      // TODO: add complex user thumbnail format contraints validation
      validator.validate(post.authorImageUrl, "authorImageUrl").notUndefined().notNull().isString().notEmpty();
    }
    if (post.tags !== undefined) {
      validator.validate(post.tags, 'tags').notUndefined().notNull();
    }
  };

}
