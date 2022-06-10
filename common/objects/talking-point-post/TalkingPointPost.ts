import { Expose } from "class-transformer";
import { DataValidationError, DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ParentType, ViewMode } from "../enums";
import { LinkPreview } from "../LinkPreview";

export class TalkingPointPost {
  @Expose() id: string; // uuid
  @Expose() parentId: string; // this is a only district as of now but may change.
  @Expose() parentType: ParentType;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() authorUserName: string;

  @TransformDate()
  @Expose() createDate: Date;
  @Expose() isBanned: boolean;
  @Expose() viewMode: ViewMode;
  // chatRequests: {
  //   viewPoint: ViewPointRequest[];
  //   general: GeneralChatRequest[];
  // }

  // metrics
  @Expose() absoluteScore: number;
  @Expose() timeBasedScore: number;
  @Expose() viewCount: number;
  @Expose() commentCount: number;

  // optionals
  @Expose() authorImageUrl?: string;
  @Expose() linkPreview?: LinkPreview;
  @Expose() customImageUrl?: string; // overrides link preview image for non video link's
  @Expose() tags?: string[];

  constructor(
    id: string,
    parentId: string,
    parentType: ParentType,
    title: string,
    description: string,
    authorUserName: string,
    createDate: Date,
    isBanned: boolean,
    viewMode: ViewMode,
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }

    // metrics
    absoluteScore: number,
    timeBasedScore: number,
    viewCount: number,
    commentCount: number,

    // optionals
    authorImageUrl?: string,
    linkPreview?: LinkPreview,
    customImageUrl?: string,
    tags?: string[],
  ) {
    this.id = id;
    this.parentId = parentId;
    this.parentType = parentType;
    this.title = title;
    this.description = description;
    this.authorUserName = authorUserName;
    this.createDate = createDate;
    this.isBanned = isBanned;
    this.viewMode = viewMode;
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }

    // metrics
    this.absoluteScore = absoluteScore;
    this.timeBasedScore = timeBasedScore;
    this.viewCount = viewCount;
    this.commentCount = commentCount;

    // optionals
    this.authorImageUrl = authorImageUrl;
    this.linkPreview = linkPreview;
    this.customImageUrl = customImageUrl;
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
    isBanned: boolean,
    viewMode: ViewMode,
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }

    // metrics
    absoluteScore: number,
    timeBasedScore: number,
    viewCount: number,
    commentCount: number,

    // optionals
    authorImageUrl?: string,
    linkPreview?: LinkPreview,
    customImageUrl?: string,
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
      props.isBanned,
      props.viewMode,
      // chatRequests: {
      //   viewPoint: ViewPointRequest[];
      //   general: GeneralChatRequest[];
      // }

      // metrics
      props.absoluteScore,
      props.timeBasedScore,
      props.viewCount,
      props.commentCount,

      // optionals
      props.authorImageUrl,
      props.linkPreview,
      props.customImageUrl,
      props.tags
    );
  }

  static validate(post: TalkingPointPost) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    validator.validate(post.id, "id").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.parentId, "parentId").notUndefined().notNull().isString().notEmpty();
    if (ParentType[post.parentType] === undefined) {
      throw new DataValidationError("parentType value is not defined in ParentType enum");
    }
    validator.validate(post.title, "title").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.description, "description").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.authorUserName, "authorUserName").notUndefined().notNull().isString().notEmpty();
    validator.validate(post.createDate, "createDate").notUndefined().notNull().isDate().dateIsNotInFuture();
    validator.validate(post.isBanned, "isBanned").notUndefined().notNull().isBoolean();
    if (ViewMode[post.viewMode] === undefined) {
      throw new DataValidationError("viewMode value is not defined in ViewMode enum");
    }
    validator.validate(post.absoluteScore, 'absoluteScore').notUndefined().notNull().isNumber().notNegative();
    validator.validate(post.timeBasedScore, 'timeBasedScore').notUndefined().notNull().isNumber().notNegative();
    validator.validate(post.viewCount, 'viewCount').notUndefined().notNull().isNumber().notNegative();
    validator.validate(post.commentCount, 'commentCount').notUndefined().notNull().isNumber().notNegative();

    if (post.authorImageUrl !== undefined) {
      // TODO: add complex user thumbnail format contraints validation
      validator.validate(post.authorImageUrl, "authorImageUrl").notUndefined().notNull().isString().notEmpty();
    }
    if (post.linkPreview !== undefined) {
      
    }
    if (post.customImageUrl !== undefined) {
      // TODO: add thumbnail url format contraints validation
      validator.validate(post.customImageUrl, "customImageUrl").notUndefined().notNull().isString().notEmpty();
    }
    if (post.tags !== undefined) {
      validator.validate(post.tags, 'tags').notUndefined().notNull();
    }
  };

}

