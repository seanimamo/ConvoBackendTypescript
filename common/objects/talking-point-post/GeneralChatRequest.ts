import { Expose } from "class-transformer";
import { DataValidator, DataValidationError } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ConvoPreference, ParentType } from "../enums";

// A Request submitted to auto match with anyone over a Talking Point Post (No viewpoint)
export class GeneralChatRequest {
  @Expose() id: string;
  @Expose() parentId: string;
  @Expose() parentType: ParentType;
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() authorUserName: string;
  
  @Expose() convoPreference: ConvoPreference;
  @Expose() relaxConvoPreferenceRequirment: boolean;
  @Expose() authorImageUrl?: string;
  @Expose() chatReason?: string;

  constructor(
    id: string,
    parentId: string,
    parentType: ParentType,
    createDate: Date,
    authorUserName: string,
    convoPreference: ConvoPreference,
    relaxConvoPreferenceRequirment: boolean,
    authorImageUrl?: string,
    chatReason?: string,
  ) {
    this.id = id;
    this.parentId = parentId;
    this.parentType = parentType,
    this.createDate = createDate;
    this.authorUserName = authorUserName;
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
    validator.validate(chatRequest.parentType, "parentType").notUndefined().notNull();
    validator.validate(chatRequest.parentType, "parentType").notUndefined().notNull().isStringInEnum(ParentType);
    validator.validate(chatRequest.createDate, "createDate").notUndefined().notNull().isDate().dateIsNotInFuture();
    validator.validate(chatRequest.authorUserName, "authorUserName").notUndefined().notNull().isString().notEmpty();
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
