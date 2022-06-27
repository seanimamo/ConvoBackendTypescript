import 'reflect-metadata'; //required for class transformer to work;
import { Expose, Type } from 'class-transformer';
import { ObjectBanStatus } from './ObjectBanStatus';
import { GeneralChatRequest } from './talking-point-post/GeneralChatRequest';
import { ViewPointChatRequest } from './talking-point-post/ViewPointChatRequest';
import { DataValidationError, DataValidator } from '../util/DataValidator';
import TransformDate from '../util/TransformDate';


export class Convo {
  @Expose() id: string;
  @Expose() status: ConvoStatus;
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() title: string;
  @Expose() participantUsernames: string[];
  @Type(() => ObjectBanStatus)
  @Expose() banStatus: ObjectBanStatus;

  // Optionals
  @Expose() videoUrl?: string; // will only be defined for completed convos
  @Expose() sourceChatRequests?: GeneralChatRequest[] | ViewPointChatRequest[];
  @Expose() thumbnail?: string;
  @Expose() scheduledStartDate?: Date;
  @Expose() tags?: string[];

  static createId(params: Convo | {createDate: Date, participantUsernames: string[]}) {
    return [...params.participantUsernames, params.createDate.toISOString()].join('#')
  }

  constructor(id: string | null,
    status: ConvoStatus,
    createDate: Date,
    title: string,
    participantUsernames: string[],
    banStatus: ObjectBanStatus,
    videoUrl?: string,
    sourceChatRequests?: GeneralChatRequest[] | ViewPointChatRequest[],
    thumbnail?: string,
    scheduledStartDate?: Date,
    tags?: string[]) {

    if (id === null) {
      this.id = Convo.createId({createDate, participantUsernames});
    } else {
      this.id = id;
    }
    this.status = status;
    this.createDate = createDate;
    this.title = title;
    this.participantUsernames = participantUsernames;
    this.banStatus = banStatus;

    this.videoUrl = videoUrl;
    this.sourceChatRequests = sourceChatRequests;
    this.thumbnail = thumbnail;
    this.scheduledStartDate = scheduledStartDate;
    this.tags = tags;
  }

  static builder(params: {
    id: string | null,
    status: ConvoStatus,
    createDate: Date,
    title: string,
    participantUsernames: string[],
    banStatus: ObjectBanStatus,
    videoUrl?: string,
    sourceChatRequests?: GeneralChatRequest[] | ViewPointChatRequest[],
    thumbnail?: string,
    scheduledStartDate?: Date,
    tags?: string[]
  }) {
    return new Convo(
      params.id,
      params.status,
      params.createDate,
      params.title,
      params.participantUsernames,
      params.banStatus,
      params.videoUrl,
      params.sourceChatRequests,
      params.thumbnail,
      params.scheduledStartDate,
      params.tags
    )
  }

  static validate(convo: Convo) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    // ------------------------------ Id validation ------------------------------
    validator.validate(convo.id, "id").notUndefined().notNull().isString().notEmpty();
    validator.validate(convo.participantUsernames, "participantUsernames").notUndefined().notNull().notEmpty();
    const partitionedId = convo.id.split('#');
    for (let i = 0; i < partitionedId.length - 1; i++) {
      if (!convo.participantUsernames.includes(partitionedId[i])) {
        throw new DataValidationError("parentId is not first value in provided id");
      }
    }

    validator.validate(convo.createDate, "createDate").notUndefined().notNull().isDate().dateIsNotInFuture();
    try {
      const createDate = new Date(partitionedId[partitionedId.length - 1]);
      // equality operators (===, ==) don't work with date objects so we use getTime()
      if (createDate.getTime() !== convo.createDate.getTime()) {
        throw new DataValidationError("createDate in Id is not equal to object create createDate.")
      }
    } catch (error) {
      throw new DataValidationError("createDate in id was unable to be parsed: " + JSON.stringify(error));
    }
    // ---------------------------------------------------------------------------

    validator.validate(convo.status, "status").notUndefined().notNull().isStringInEnum(ConvoStatus);
    validator.validate(convo.title, "title").notUndefined().notNull().isString().notEmpty();
    ObjectBanStatus.validate(convo.banStatus);

    if (convo.videoUrl !== undefined) {
      validator.validate(convo.videoUrl, "videoUrl").notNull().isString().notEmpty();
    }
    if (convo.thumbnail !== undefined) {
      validator.validate(convo.thumbnail, "thumbnail").notNull().isString().notEmpty();
    }
    if (convo.scheduledStartDate !== undefined) {
      validator.validate(convo.scheduledStartDate, "scheduledStartDate").notNull().isDate();
    }
    if (convo.videoUrl !== undefined) {
      validator.validate(convo.videoUrl, "videoUrl").notNull().isString().notEmpty();
    }
    if (convo.tags !== undefined) {
      validator.validate(convo.tags, "tags").notNull();
    }
  }

}

export enum ConvoStatus {
  NOT_ACCEPTED = "Not_Accepted",
  PARTIALLY_ACCEPTED = "Partially_Accepted",
  ACCEPTED = "Accepted",
  IN_PROGRESS = "In_Progress",
  COMPLETED = "Completed",
  PAUSED = "Paused",
  CANCELED = "Canceled"
}