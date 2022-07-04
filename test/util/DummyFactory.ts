import { Category, District } from "../../common/objects/District";
import { ParentType, ViewMode } from "../../common/objects/enums";
import { GeneralChatRequest } from "../../common/objects/talking-point-post/GeneralChatRequest";
import { AgeRating, TalkingPointPost, TalkingPointPostSourceType } from "../../common/objects/talking-point-post/TalkingPointPost";
import { User } from "../../common/objects/user/User";
import { UserPassword } from "../../common/objects/user/UserPassword";
import { ConvoPreference } from "../../common/objects/enums";
import { LinkPreview } from "../../common/objects/talking-point-post/LinkPreview";
import { UserBanType } from "../../common/objects/user/UserBanStatus";
import { ObjectBanStatus, ObjectBanType } from "../../common/objects/ObjectBanStatus";
import { Convo, ConvoSource, ConvoStatus } from "../../common/objects/Convo";


export const getDummyUserProps = () => {
  return {
    userName: "seanimam",
    password: UserPassword.fromPlainTextPassword('test'),
    email: "test@gmail.com",
    isEmailValidated: true,
    firstName: "sean",
    lastName: "imam",
    joinDate: new Date('2011-04-11'),
    banStatus: {
      type: UserBanType.NONE,
    },
    birthDate: new Date('2000-04-11'),
    thumbnail: "string",
    bio: "string",
    occupation: "string",
    metrics: {
      convoScore: 0,
      followerCount: 0,
      followingCount: 0,
    },
    settings: {
      hideRealName: false
    }
  }
}

export const getDummyUser = () => {
  return User.builder(getDummyUserProps());
}

export const getDummyDistrictProps = () => {
  const dummyUser = getDummyUser();
  return {
    id: null,
    title: "testDistrict",
    authorUsername: dummyUser.userName,
    createDate: new Date('2021-01-01'),
    subscriberCount: 123,
    viewCount: 8300,
    postCount: 1234,
    convoCount: 742,
    talkingPointCount: 1235,
    banStatus: {
      type: ObjectBanType.NONE,
    },
    viewMode: ViewMode.PRIVATE,
    primaryCategory: Category.ENTERTAINMENT
  }
}

export const getDummyDistrict = () => {
  return District.builder(getDummyDistrictProps());
}

export const getDummyTalkingPointPostProps = () => {
  const dummyUser = getDummyUser();
  const dummyDistrict = getDummyDistrict()
  return {
    id: null,
    parentId: dummyDistrict.title,
    parentType: ParentType.DISTRICT,
    title: "Dummy Talking Point Post",
    description: "Dummy Talking Point Post Description",
    authorUserName: dummyUser.userName,
    authorImageUrl: dummyUser.thumbnail,
    createDate: new Date('2021-01-01'),
    source: {
      type: TalkingPointPostSourceType.CLASSIC,
      data: getDummyLinkPreview(),
    },
    banStatus: {
      type: ObjectBanType.NONE,
    },
    viewMode: ViewMode.PUBLIC,
    ageRating: AgeRating.EVERYONE,
    metrics: {
      absoluteScore: 123123,
      timeBasedScore: 414512,
      viewCount: 1231,
      commentCount: 2344,
    },

    // optional
    tags: ["testTag1", "testTag2"],
  }
}
export const getDummyTalkingPointPost = () => {
  return TalkingPointPost.builder(getDummyTalkingPointPostProps());
}

export const getDummyLinkPreview = () => {
  return new LinkPreview(
    "www.anonexistanturllll.com",
    "video.other",
    "anonexistanturllll",
    "dummy title",
    "dummy link preview description",
    "www.anonexistanturllll.com/video/1234",
    "www.customImageUrl.com/image/1234",
  )
}

export const getDummyGeneralChatRequestProps = () => {
  const dummyTalkingPoint = getDummyTalkingPointPost();
  const dummyUser = getDummyUser();
  return {
    id: null,
    parentId: dummyTalkingPoint.id,
    parentType: ParentType.TALKING_POINT_POST,
    createDate: new Date(dummyTalkingPoint.createDate.getDate() + 1),
    authorUserName: dummyUser.userName,
    convoPreference: ConvoPreference.CASUAL,
    relaxConvoPreferenceRequirment: false,
    authorImageUrl: dummyUser.thumbnail,
    chatReason: "I am an expert"
  };
}

export const getDummyGeneralChatRequest = () => {
  return GeneralChatRequest.builder(getDummyGeneralChatRequestProps());
}

export const getDummyConvoProps = () => {
  const dummyUser = getDummyUser();
  return {
    id: null,
    status: ConvoStatus.NOT_ACCEPTED,
    createDate: new Date('2021-01-01'),
    title: "dummy Convo Title",
    participantUsernames: [dummyUser.userName, 'user2'],
    banStatus: new ObjectBanStatus(ObjectBanType.NONE),
    sourcedFrom: ConvoSource.GENERAL_CHAT_REQUEST,
  }
}
export const getDummyConvo = () => {
  return Convo.builder(getDummyConvoProps());
}

