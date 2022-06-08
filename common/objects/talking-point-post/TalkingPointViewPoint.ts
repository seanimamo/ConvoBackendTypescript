import { Expose } from "class-transformer";
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
}


