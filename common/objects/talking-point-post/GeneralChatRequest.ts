import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import { DataValidationError, DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ConvoPreference } from "../enums";
import { ObjectId } from '../ObjectId';
import TransformObjectId from '../../util/TransformObjectId';

export class GeneralChatRequestId extends ObjectId {
  public static readonly IDENTIFIER = "CHAT_REQ_GENERAL";

  constructor(params: { authorUserName: string, createDate: Date } | string) {
      typeof (params) === 'string'
          ? super(params)
          : super([params.authorUserName, params.createDate]);
  }

  public getIdentifier(): string {
    return GeneralChatRequestId.IDENTIFIER;
  }
}

// A Request submitted to auto match with anyone over a Talking Point Post (No viewpoint)
export class GeneralChatRequest {
  @TransformObjectId()
  @Expose() readonly id: GeneralChatRequestId;
  @TransformObjectId()
  @Expose() parentId: ObjectId;
  @TransformDate()
  @Expose() readonly createDate: Date;
  @Expose() readonly authorUserName: string;

  @Expose() convoPreference: ConvoPreference;
  @Expose() relaxConvoPreferenceRequirment: boolean;
  @Expose() authorImageUrl?: string;
  @Expose() chatReason?: string;

  constructor(
    id: GeneralChatRequestId | null,
    parentId: ObjectId,
    createDate: Date,
    authorUserName: string,
    convoPreference: ConvoPreference,
    relaxConvoPreferenceRequirment: boolean,
    authorImageUrl?: string,
    chatReason?: string,
  ) {
    if (id === null) {
      this.id = new GeneralChatRequestId({ authorUserName, createDate });
    } else {
      this.id = id;
    }
    this.parentId = parentId;
    this.createDate = createDate;
    this.authorUserName = authorUserName;
    this.convoPreference = convoPreference;
    this.relaxConvoPreferenceRequirment = relaxConvoPreferenceRequirment;
    this.authorImageUrl = authorImageUrl;
    this.chatReason = chatReason;
  }

  static builder(props: {
    id: GeneralChatRequestId | null,
    parentId: ObjectId,
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
    validator.validate(chatRequest.id, "id").notUndefined().notNull().notEmpty();
    const partitionedId = ObjectId.parseId(chatRequest.id);
    if (partitionedId[0] !== GeneralChatRequestId.IDENTIFIER) {
      throw new DataValidationError("GeneralChatRequestRepository objectIdentifier is not first value in provided id");
    }
    if (partitionedId[1] !== chatRequest.authorUserName) {
      throw new DataValidationError("authorUserName is not third value in provided id");
    }
    if (partitionedId[2] !== ObjectId.dateToString(chatRequest.createDate)) {
      throw new DataValidationError("createDate is not fourth value in provided id");
    }
    validator.validate(chatRequest.parentId, "parentId").notUndefined().notNull().notEmpty();
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
