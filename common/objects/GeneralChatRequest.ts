import { Expose } from "class-transformer";
import { DataValidator } from "../util/DataValidator";
import TransformDate from "../util/TransformDate";
import { ConvoPreference, ParentType } from "./enums";

// A Request submitted to auto match with anyone over a Talking Point Post (No viewpoint)
// export type GeneralChatRequest = {
//   id: string;
//   parentId: string;
//   postTitle: string;
//   authorUsername: string;
//   authorProfileImage: string;
//   convoPreference: ConvoPreference;
//   relaxConvoPreferenceRequirment: boolean;
// }

export class GeneralChatRequest {
  @Expose() id: string;
  @Expose() parentId: string;
  @Expose() parentType: ParentType;
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() postTitle: string;
  @Expose() authorUsername: string;
  @Expose() convoPreference: ConvoPreference;
  @Expose() relaxConvoPreferenceRequirment: boolean;
  @Expose() authorImageUrl?: string;
  @Expose() chatReason?: string;

  constructor(
    id: string,
    parentId: string,
    parentType: ParentType,
    postTitle: string,
    authorUsername: string,
    convoPreference: ConvoPreference,
    relaxConvoPreferenceRequirment: boolean,
    authorImageUrl?: string,
    chatReason?: string,
  ) {
    this.id = id;
    this.parentId = parentId;
    this.parentType = parentType,
    this.postTitle = postTitle;
    this.authorUsername = authorUsername;
    this.convoPreference = convoPreference;
    this.relaxConvoPreferenceRequirment = relaxConvoPreferenceRequirment;
    this.authorImageUrl = authorImageUrl;
    this.chatReason = chatReason;
  }

  static validate(chatRequest: GeneralChatRequest) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();
    validator.validate(chatRequest.id, "id").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.parentId, "parentId").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.postTitle, "postTitle").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.authorUsername, "authorUsername").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.convoPreference, "convoPreference").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.relaxConvoPreferenceRequirment, "relaxConvoPreferenceRequirment")
    .notUndefined().notNull().isBoolean();

    if (chatRequest.authorImageUrl !== undefined) {
      validator.validate(chatRequest.authorImageUrl, "authorImageUrl").notNull().isString().notEmpty();
    }

    if (chatRequest.chatReason !== undefined) {
      validator.validate(chatRequest.chatReason, "chatReason").notNull().isString().notEmpty();
    }
  }

}


// A Request submitted to auto match over a specific viewpoint from a Talking Point Post.
// export type ConvoTPVPAutoRequest = {
//   id: string;
//   postId: string;
//   postTitle: string;
//   authorUsername: string;
//   authorProfileImage: string;
//   viewpoint: string;
//   convoPreference: ConvoPreference;
//   relaxConvoPreferenceRequirment: boolean;
//   stance: ConvoStance;
//   lookingForStance: ConvoStance;
//   relaxLookingForRequirment: boolean;
// }

