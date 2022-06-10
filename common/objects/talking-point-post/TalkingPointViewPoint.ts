import { Expose } from "class-transformer";
import { DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";

export class TalkingPointViewPoint {
  @Expose() id: string;
  @Expose() talkingPointId: string;
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() viewPoint: string;
  @Expose() authorUsername: string;
  @Expose() authorImageUrl?: string;
  // requesters: ConvoTPVPAutoRequest[];

  constructor(
    id: string,
    talkingPointId: string,
    viewPoint: string,
    authorUsername: string,
    authorImageUrl?: string,
  ) {
    this.id = id;
    this.talkingPointId = talkingPointId;
    this.viewPoint = viewPoint;
    this.authorUsername = authorUsername;
    this.authorImageUrl = authorImageUrl;
  }

  static validate(viewPoint: TalkingPointViewPoint) {
    // TODO: Grab validator from singleton source
    const validator = new DataValidator();
    validator.validate(viewPoint.id, "id").notUndefined().notNull().isString().notEmpty();
    validator.validate(viewPoint.talkingPointId, "talkingPointId").notUndefined().notNull().isString().notEmpty();
    validator.validate(viewPoint.createDate, 'createDate').notUndefined().notNull().isDate().dateIsNotInFuture();
    validator.validate(viewPoint.viewPoint, "viewPoint").notUndefined().notNull().isString().notEmpty();
    validator.validate(viewPoint.authorUsername, "authorUsername").notUndefined().notNull().isString().notEmpty();
    if (viewPoint.authorImageUrl !== undefined) {
      validator.validate(viewPoint.authorImageUrl, "authorImageUrl").notUndefined().notNull().isString().notEmpty();
    }
  }
}


