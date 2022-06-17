import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from 'class-transformer';
import { ViewMode } from '../objects/enums';


export class Convo {
  @Expose() id: string;
  @Expose() status: ConvoStatus;
  @Expose() createDate: Date;
  @Expose() title: string;
  @Expose() participantUsernames: string[];
  @Expose() videoUrl: string;
  @Expose() viewMode: ViewMode;
  @Expose() isBanned: boolean;
  @Expose() isAgeRestricted: boolean;

  // Metrics
  @Expose() viewCount: number;
  @Expose() absoluteScore: number;
  @Expose() timeBasedScore: number;
  @Expose() commentCount: number;

  // Optionals
  @Expose() sourceChatRequests?: {
    // viewPoint?: ViewPointRequest[];
    // general?: GeneralChatRequest[];
  };
  @Expose() thumbnail?: string;
  @Expose() scheduledStartDate?: Date;
  @Expose() tags?: string[];        
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