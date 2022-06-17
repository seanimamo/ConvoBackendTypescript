import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import TransformDate from "../../util/TransformDate";

/**
 * A TentativeMatch is created when non live match recommendations are served to a user and a partial number of users
 * accepts the match recommendation. For that reason, rejected is not a status with these objects since
 * a tentative match is deleted when even one of the involved users rejects the recommendation.
 */
export class TentativeMatch<T> {
  @Expose() id: string;
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() chatRequests: T[];
  @Expose() status: TentativeMatchStatus;
  @Expose() acceptedUserNames: string[];

  constructor(
    id: string,
    createDate: Date,
    chatRequests: T[],
    status: TentativeMatchStatus,
    acceptedUserNames: string[],
  ) { 
    this.id = id;
    this.createDate = createDate;
    this.chatRequests = chatRequests;
    this.status = status;
    this.acceptedUserNames = acceptedUserNames;
  }
}

export enum TentativeMatchStatus {
  NOT_ACCEPTED = "Not_Accepted",
  PARTIALLY_ACCEPTED = "Partially_Accepted",
  ACCEPTED = "Accepted",
}