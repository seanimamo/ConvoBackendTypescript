import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import { DataValidationError, DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ParentType, ViewMode } from "../enums";
import { LinkPreview } from "./LinkPreview";
import { ObjectBanStatus } from '../ObjectBanStatus';

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

export class TalkingPointPost {
  @Expose() id: string; // uuid
  @Expose() private _parentId: string; // this is a only district as of now but may change.
  @Expose() parentType: ParentType;
  @Expose() private _title: string;

  @Expose() description: string;
  @Expose() private _authorUserName: string; // The person to create the post
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() source: { // A Talking point can be sourced from an existing Convo OR a link to something else
    type: TalkingPointPostSourceType;
    data?: TalkingPointPostConvoSource | LinkPreview;
  };
  @Expose() banStatus: ObjectBanStatus;
  @Expose() viewMode: ViewMode;
  @Expose() ageRating: AgeRating;

  // chatRequests: {
  //   viewPoint: ViewPointRequest[];
  //   general: GeneralChatRequest[];
  // }

  // metrics
  @Expose()
  metrics: {
    absoluteScore: number;
    timeBasedScore: number;
    viewCount: number;
    commentCount: number;
  }

  // optionals
  @Expose() replyToPostId?: string; // A Talking point post can be created as a reply to another 
  @Expose() authorImageUrl?: string;
  @Expose() tags?: string[];

  static createId(params: { parentId: string, title: string, authorUserName: string } | TalkingPointPost) {
    if (params instanceof TalkingPointPost) {
      return [params.parentId, params.title.replace(/\s/g, '_'), params.authorUserName].join('#');
    }
    return [params.parentId, params.title.replace(/\s/g, '_'), params.authorUserName].join('#');
  }

  get title() { return this._title; }
  get authorUserName() { return this._authorUserName; }
  get parentId() { return this._parentId; }

  set title(title: string) {
    this._title = title;
    this.id = TalkingPointPost.createId(this);
  }
  set authorUserName(authorUserName: string) {
    this._authorUserName = authorUserName;
    this.id = TalkingPointPost.createId(this);
  }
  set parentId(parentId: string) {
    this._parentId = parentId;
    this.id = TalkingPointPost.createId(this);
    // this.id = TalkingPointPost.createId({parentId: this._parentId, title: this._authorUserName, authorUserName: this._authorUserName});
  }

  constructor(
    id: string | null, // Leaving the id as null will let be automatically created as expected
    parentId: string,
    parentType: ParentType,
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
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }

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
      id = TalkingPointPost.createId({parentId, title, authorUserName});
    } else {
      this.id = id;
    }
    this._parentId = parentId;
    this.parentType = parentType;
    this._title = title;
    this.description = description;
    this._authorUserName = authorUserName;
    this.createDate = createDate;
    this.source = source;
    this.banStatus = banStatus;
    this.viewMode = viewMode;
    this.ageRating = ageRating;
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }

    this.metrics = metrics;

    // optionals
    this.replyToPostId = replyToPostId;
    this.authorImageUrl = authorImageUrl;
    this.tags = tags;
  }

  static builder(props: {
    id: string | null, // Leaving the id as null will let be automatically created as expected
    parentId: string,
    parentType: ParentType,
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
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }
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
      props.parentType,
      props.title,
      props.description,
      props.authorUserName,
      props.createDate,
      props.source,
      props.banStatus,
      props.viewMode,
      // chatRequests: {
      //   viewPoint: ViewPointRequest[];
      //   general: GeneralChatRequest[];
      // }
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

    validator.validate(post.id, "id").notUndefined().notNull().isString().notEmpty();
    const partitionedId = post.id.split('#');
    if (partitionedId[0] !== post.parentId) {
      throw new DataValidationError("parentId is not first value in provided id");
    }
    if (partitionedId[1] !== post.title.replace(/\s/g, '_')) {
      throw new DataValidationError("title is not second value in provided id");
    }
    if (partitionedId[2] !== post.authorUserName) {
      throw new DataValidationError("authorUserName is not third value in provided id");
    }

    validator.validate(post.parentId, "parentId").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.parentType, "parentType").notUndefined().notNull().isStringInEnum(ParentType);
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

