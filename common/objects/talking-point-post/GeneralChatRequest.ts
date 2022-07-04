import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import { DataValidationError, DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ConvoPreference, ParentType } from "../enums";
import { GeneralChatRequestRepository } from '../../respositories/talking-point-post/GeneralChatRequestRepository';
import { IdFactory } from '../../util/IdFactory';

// A Request submitted to auto match with anyone over a Talking Point Post (No viewpoint)
export class GeneralChatRequest {
  @Expose() readonly id: string;
  @Expose() parentId: string;
  @Expose() parentType: ParentType;
  @TransformDate()
  @Expose() readonly createDate: Date;
  @Expose() readonly authorUserName: string;

  @Expose() convoPreference: ConvoPreference;
  @Expose() relaxConvoPreferenceRequirment: boolean;
  @Expose() authorImageUrl?: string;
  @Expose() chatReason?: string;

  constructor(
    id: string | null,
    parentId: string,
    parentType: ParentType,
    createDate: Date,
    authorUserName: string,
    convoPreference: ConvoPreference,
    relaxConvoPreferenceRequirment: boolean,
    authorImageUrl?: string,
    chatReason?: string,
  ) {
    if (id === null) {
      this.id = GeneralChatRequest.createId({ authorUserName, createDate });
    } else {
      this.id = id;
    }
    this.parentId = parentId;
    this.parentType = parentType;
    this.createDate = createDate;
    this.authorUserName = authorUserName;
    this.convoPreference = convoPreference;
    this.relaxConvoPreferenceRequirment = relaxConvoPreferenceRequirment;
    this.authorImageUrl = authorImageUrl;
    this.chatReason = chatReason;
  }

  static createId(params: { authorUserName: string, createDate: Date }) {
    return IdFactory.createId([GeneralChatRequestRepository.objectIdentifier, params.authorUserName, params.createDate]);
  }

  static builder(props: {
    id: string | null,
    parentId: string,
    parentType: ParentType,
    createDate: Date,
    authorUserName: string,
    convoPreference: ConvoPreference,
    relaxConvoPreferenceRequirment: boolean,
    authorImageUrl?: string,
    chatReason?: string,
  }) {
    return new GeneralChatRequest(
      props.id,
      props.parentId,
      props.parentType,
      props.createDate,
      props.authorUserName,
      props.convoPreference,
      props.relaxConvoPreferenceRequirment,
      props.authorImageUrl,
      props.chatReason,
    );
  }

  static validate(chatRequest: GeneralChatRequest) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();
    validator.validate(chatRequest.id, "id").notUndefined().notNull().isString().notEmpty();
    const partitionedId = IdFactory.parseId(chatRequest.id);
    if (partitionedId[0] !== GeneralChatRequestRepository.objectIdentifier) {
      throw new DataValidationError("GeneralChatRequestRepository objectIdentifier is not first value in provided id");
    }
    if (partitionedId[1] !== chatRequest.authorUserName) {
      throw new DataValidationError("authorUserName is not third value in provided id");
    }
    if (partitionedId[2] !== IdFactory.dateToString(chatRequest.createDate)) {
      throw new DataValidationError("createDate is not fourth value in provided id");
    }
    validator.validate(chatRequest.parentId, "parentId").notUndefined().notNull().isString().notEmpty();
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
