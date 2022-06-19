import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from 'class-transformer';
import { ViewMode } from '../objects/enums';
import { ObjectBanStatus } from './ObjectBanStatus';
import { GeneralChatRequest } from './talking-point-post/GeneralChatRequest';
import { ViewPointChatRequest } from './talking-point-post/ViewPointChatRequest';
import { LogLevel } from 'aws-cdk-lib/aws-stepfunctions';
import { DataValidationError, DataValidator } from '../util/DataValidator';


export class Convo {
  @Expose() id: string;
  @Expose() status: ConvoStatus;
  @Expose() createDate: Date;
  @Expose() title: string;
  @Expose() participantUsernames: string[];
  @Expose() videoUrl: string;
  @Expose() viewMode: ViewMode;
  @Expose() banStatus: ObjectBanStatus;
  @Expose() ageRating: ConvoAgeRating;
  @Expose() metrics: {
    viewCount: number;
    absoluteScore: number;
    timeBasedScore: number;
    commentCount: number;
  }

  // Optionals
  @Expose() sourceChatRequests?: GeneralChatRequest[] | ViewPointChatRequest[];
  @Expose() thumbnail?: string;
  @Expose() scheduledStartDate?: Date;
  @Expose() tags?: string[];

  static createId(convo: Convo) {
    return convo.participantUsernames.join('#')
      + convo.createDate.toISOString().replace(/\s/g, '_');
  }

  static validate(convo: Convo) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    // --------------- Id validation ---------------
    validator.validate(convo.id, "id").notUndefined().notNull().isString().notEmpty();
    const partitionedId = convo.id.split('#');
    for (let i = 0; i < partitionedId.length - 1; i++) {
      if (!convo.participantUsernames.includes(partitionedId[i])) {
        throw new DataValidationError("parentId is not first value in provided id");
      }
    }

    try {
      const createDate = new Date(partitionedId[partitionedId.length - 1]);
      if (createDate != convo.createDate) {
        throw new DataValidationError("createDate in Id is not equal to object create createDate.")
      }
    } catch (error) {
      throw new DataValidationError("createDate in id was unable to be parsed: " + JSON.stringify(error));
    }
    // --------------------------------------------- 

  }



}

export enum ConvoStatus {
  NOT_ACCEPTED = "Not_Accepted",
  PARTIALLY_ACCEPTED = "Partially_Accepted",
  ACCEPTED = "Accepted",
  IN_PROGRESS = "In_Progress",
  COMPLETED = "Completed",
  PAUSED = "Paused",
  Canceled = "Canceled"
}

export enum ConvoAgeRating {
  EVERYONE = "Everyone",
  TEEN = "Teen",
  MATURE = "Mature",
  ADULT = "Adult (+18)"
}