import { Expose } from "class-transformer";
import { DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";
import { ConvoPreference, ConvoStance, ParentType } from "../enums";

export class ViewPointChatRequest {
  @Expose() id: string;
  @Expose() parentId: string;
  @Expose() parentType: ParentType = ParentType.TALKING_POINT_VIEW_POINT;
  @TransformDate()
  @Expose() createDate: Date;
  @Expose() authorUserName: string;

  @Expose() viewpoint: string;
  @Expose() stance: ConvoStance;
  @Expose() lookingForStance: ConvoStance;
  @Expose() relaxLookingForRequirment: boolean;
  @Expose() convoPreference: ConvoPreference;
  @Expose() relaxConvoPreferenceRequirment: boolean;
  @Expose() authorImageUrl?: string;
  @Expose() chatReason?: string;

  constructor(
    id: string,
    parentId: string,
    // parentType: ParentType,
    authorUserName: string,
    viewpoint: string,
    stance: ConvoStance,
    lookingForStance: ConvoStance,
    relaxLookingForRequirment: boolean,
    convoPreference: ConvoPreference,
    relaxConvoPreferenceRequirment: boolean,
    authorImageUrl?: string,
    chatReason?: string,
  ) {
    this.id = id;
    this.parentId = parentId;
    // this.parentType = parentType;
    this.authorUserName = authorUserName;
    this.viewpoint = viewpoint;
    this.stance = stance;
    this.lookingForStance = lookingForStance;
    this.relaxLookingForRequirment = relaxLookingForRequirment;
    this.convoPreference = convoPreference;
    this.relaxConvoPreferenceRequirment = relaxConvoPreferenceRequirment;
    this.authorImageUrl = authorImageUrl;
    this.chatReason = chatReason;
  }

  static validate(chatRequest: ViewPointChatRequest) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();
    validator.validate(chatRequest.id, "id").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.parentId, "parentId").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.authorUserName, "authorUserName").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.viewpoint, "viewpoint").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.stance, "stance").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.lookingForStance, "lookingForStance").notUndefined().notNull().isString().notEmpty();
    validator.validate(chatRequest.relaxLookingForRequirment, "relaxLookingForRequirment").notUndefined().notNull().isBoolean();
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