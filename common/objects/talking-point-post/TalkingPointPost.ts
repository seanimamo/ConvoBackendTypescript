import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import { DataValidationError, DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ParentType, ViewMode } from "../enums";
import { LinkPreview } from "./LinkPreview";
import { ObjectBanStatus } from '../ObjectBanStatus';

type ConvoSource = {
  id: string;
  participantUsernames: string[];
}

export class TalkingPointPost {
  @Expose() id: string; // uuid
  @Expose() parentId: string; // this is a only district as of now but may change.
  @Expose() parentType: ParentType;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() authorUserName: string; // The person to create the post
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() source?: { // A Talking point can be sourced from an existing Convo OR a link to something else
    type: "Convo" | "LinkPreview";
    data: ConvoSource | LinkPreview;
  };
  @Expose() banStatus: ObjectBanStatus;
  @Expose() viewMode: ViewMode;

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
  @Expose() authorImageUrl?: string;
  @Expose() tags?: string[];

  constructor(
    id: string,
    parentId: string,
    parentType: ParentType,
    title: string,
    description: string,
    authorUserName: string,
    createDate: Date,
    source: {
      type: "Convo" | "LinkPreview";
      data: ConvoSource | LinkPreview;
    },
    banStatus: ObjectBanStatus,
    viewMode: ViewMode,
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
    authorImageUrl?: string,
    tags?: string[],
  ) {
    this.id = id;
    this.parentId = parentId;
    this.parentType = parentType;
    this.title = title;
    this.description = description;
    this.authorUserName = authorUserName;
    this.createDate = createDate;
    this.banStatus = banStatus;
    this.viewMode = viewMode;
    this.source = source;
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }

    this.metrics = metrics;

    // optionals
    this.authorImageUrl = authorImageUrl;
    this.tags = tags;
  }

  static builder(props: {
    id: string,
    parentId: string,
    parentType: ParentType,
    title: string,
    description: string,
    authorUserName: string,
    createDate: Date,
    source: {
      type: "Convo" | "LinkPreview";
      data: ConvoSource | LinkPreview;
    },
    banStatus: ObjectBanStatus,
    viewMode: ViewMode,
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

      props.metrics,

      // optionals
      props.authorImageUrl,
      props.tags
    );
  }

  static validate(post: TalkingPointPost) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    validator.validate(post.id, "id").notUndefined().notNull().isString().notEmpty();
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

    if (post.authorImageUrl !== undefined) {
      // TODO: add complex user thumbnail format contraints validation
      validator.validate(post.authorImageUrl, "authorImageUrl").notUndefined().notNull().isString().notEmpty();
    }
    if (post.source !== undefined) {
      validator.validate(post.source.type, "source.type").notUndefined().notNull().isString();
      validator.validate(post.source.data, "source.data").notUndefined().notNull();
      if (post.source.type === "Convo") {
        const convoSource = post.source.data as ConvoSource;
        validator.validate(convoSource, "convoSource (post.source.data)").notUndefined().notNull();
        validator.validate(convoSource.id, "convoSource (post.source.data.id)").notUndefined().notNull().isString().notEmpty();
        validator.validate(convoSource.participantUsernames, "convoSource (post.source.data.participantUsernames)")
          .notUndefined().notNull().notEmpty();
      } else if (post.source.type === "LinkPreview") {
        LinkPreview.validate(post.source.data as LinkPreview);
      } else {
        throw new DataValidationError("Post source type is not Convo or LinkPreview");
      }
    }
    if (post.tags !== undefined) {
      validator.validate(post.tags, 'tags').notUndefined().notNull();
    }
  };

}

