import 'reflect-metadata'; //required for class transformer to work;
import { Expose, Type } from 'class-transformer';
import { ObjectBanStatus } from './ObjectBanStatus';
import { GeneralChatRequest } from './talking-point-post/GeneralChatRequest';
import { ViewPointChatRequest } from './talking-point-post/ViewPointChatRequest';
import { DataValidationError, DataValidator } from '../util/DataValidator';
import TransformDate from '../util/TransformDate';
import { ObjectId } from './ObjectId';
import TransformObjectId from '../util/TransformObjectId';

export class ConvoId extends ObjectId {
  public static readonly IDENTIFIER = "CONVO";

  constructor(params: { participantUsernames: string[], createDate: Date } | string) {
    typeof (params) === 'string'
      ? super(params)
      : super([...params.participantUsernames, params.createDate]);
  }

  public getIdentifier(): string {
    return ConvoId.IDENTIFIER;
  }
}

export class Convo {
  @TransformObjectId()
  @Expose() readonly id: ConvoId;
  @Expose() status: ConvoStatus;
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() title: string;
  @Expose() participantUsernames: string[];
  @Type(() => ObjectBanStatus)
  @Expose() banStatus: ObjectBanStatus;
  // Optionals
  @Expose() videoUrl?: string; // will only be defined for completed convos

  @Expose() sourcedFrom?: ConvoSource;
  @Type(() => GeneralChatRequest)
  @Expose() generalChatRequests?: GeneralChatRequest[];
  @Type(() => ViewPointChatRequest)
  @Expose() viewPointChatRequests?: ViewPointChatRequest[];

  @Expose() acceptedUserNames?: string[];
  @Expose() rejectedUserNames?: string[];
  @Expose() thumbnail?: string;
  @TransformDate()
  @Expose() scheduledStartDate?: Date;
  @Expose() tags?: string[];

  constructor(id: ConvoId | null,
    status: ConvoStatus,
    createDate: Date,
    title: string,
    participantUsernames: string[],
    banStatus: ObjectBanStatus,
    sourcedFrom: ConvoSource,
    videoUrl?: string,
    generalChatRequests?: GeneralChatRequest[],
    viewPointChatRequests?: ViewPointChatRequest[],
    acceptedUserNames?: string[],
    rejectedUserNames?: string[],
    thumbnail?: string,
    scheduledStartDate?: Date,
    tags?: string[]) {

    if (id === null) {
      this.id = new ConvoId({ createDate, participantUsernames });
    } else {
      this.id = id;
    }
    this.status = status;
    this.createDate = createDate;
    this.title = title;
    this.participantUsernames = participantUsernames;
    this.banStatus = banStatus;
    this.sourcedFrom = sourcedFrom;
    this.videoUrl = videoUrl;
    this.generalChatRequests = generalChatRequests;
    this.viewPointChatRequests = viewPointChatRequests;
    this.acceptedUserNames = acceptedUserNames;
    this.rejectedUserNames = rejectedUserNames;
    this.thumbnail = thumbnail;
    this.scheduledStartDate = scheduledStartDate;
    this.tags = tags;
  }

  static builder(params: {
    id: ConvoId | null,
    status: ConvoStatus,
    createDate: Date,
    title: string,
    participantUsernames: string[],
    banStatus: ObjectBanStatus,
    sourcedFrom: ConvoSource,
    videoUrl?: string,
    generalChatRequests?: GeneralChatRequest[],
    viewPointChatRequests?: ViewPointChatRequest[],
    acceptedUserNames?: string[],
    rejectedUserNames?: string[],
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
      params.sourcedFrom,
      params.videoUrl,
      params.generalChatRequests,
      params.viewPointChatRequests,
      params.acceptedUserNames,
      params.rejectedUserNames,
      params.thumbnail,
      params.scheduledStartDate,
      params.tags
    )
  }

  static validate(convo: Convo) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    // START -------- Id Validation --------
    validator.validate(convo.id, "id").notUndefined().notNull();
    validator.validate(convo.participantUsernames, "participantUsernames").notUndefined().notNull().notEmpty();
    const partitionedId = ObjectId.parseId(convo.id);
    if (partitionedId[0] !== ConvoId.IDENTIFIER) {
      throw new DataValidationError("objectIdentifier is not first value in provided id");
    }
    let currIndex = 1;
    convo.participantUsernames.forEach(participant => {
      if (partitionedId[currIndex] !== participant) {
        throw new DataValidationError("participantUsername's are not present in id");
      }
      currIndex++;
    })
    validator.validate(convo.createDate, "createDate").notUndefined().notNull().isDate().dateIsNotInFuture();
    if (partitionedId[currIndex] !== ObjectId.dateToString(convo.createDate)) {
      throw new DataValidationError("createDate in Id is not equal to object create createDate.")
    }
    // END -------- Id Validation --------


    validator.validate(convo.status, "status").notUndefined().notNull().isStringInEnum(ConvoStatus);
    validator.validate(convo.title, "title").notUndefined().notNull().isString().notEmpty();
    ObjectBanStatus.validate(convo.banStatus);
    validator.validate(convo.sourcedFrom, "sourcedFrom").notUndefined().notNull().isStringInEnum(ConvoSource);

    if (convo.acceptedUserNames !== undefined) {
      validator.validate(convo.acceptedUserNames, "acceptedUserNames").notNull().notEmpty();
      // Todo: validate accepted usernames against source chat requests / participants if possible.
    }

    if (convo.rejectedUserNames !== undefined) {
      validator.validate(convo.rejectedUserNames, "rejectedUserNames").notNull().notEmpty();
      // Todo: validate rejected usernames against source chat requests if possible.
    }

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

    if (convo.status === ConvoStatus.NOT_ACCEPTED) {
      if (convo.acceptedUserNames !== undefined) {
        throw new DataValidationError("acceptedUsernames should NOT be defined when convo status is NOT_ACCEPTED")
      }
    }
    if (convo.status === ConvoStatus.ACCEPTED) {
      if (convo.acceptedUserNames === undefined) {
        throw new DataValidationError("acceptedUsernames should be defined when convo status is ACCEPTED")
      }
      if (convo.acceptedUserNames.length !== convo.participantUsernames.length) {
        throw new DataValidationError("not all users accepted convo yet status is ACCEPTED")
      }
      convo.acceptedUserNames.forEach(userName => {
        if (!convo.participantUsernames.includes(userName)) {
          throw new DataValidationError("acceptedUsernames does not include all participants")
        }
      })
    }
  }

}

export enum ConvoSource {
  GENERAL_CHAT_REQUEST = "General_Chat_Request",
  VIEWPOINT_CHAT_REQUEST = "Viewpoint_Chat_Request"
}

export enum ConvoStatus {
  NOT_ACCEPTED = "Not_Accepted", // Occurs when a Convo is created by the system (e.g. live matching) and all users are prompted to respond
  PARTIALLY_ACCEPTED = "Partially_Accepted", // Occurs when a recommendation provided to a user is accepted by only 1 of the users in the given recommendation
  ACCEPTED = "Accepted",
  IN_PROGRESS = "In_Progress",
  COMPLETED = "Completed",
  PAUSED = "Paused", // Occurs when a Convo that was in progress is paused
  REJECTED = "Rejected", // Occurs when a Convo that is either not accepted or partially accepted is rejected.
  CANCELED = "Canceled" // Occurs when a Convo that is in an accepted status is becomes canceled.
}