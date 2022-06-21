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
import { Convo, ConvoStatus } from "../../common/objects/Convo";

// Note that ban status was left off, an unbanned user wont have a value.
export const getDummyUser = () => {
  return User.builder({
    userName: "seanimam",
    password: UserPassword.fromPlainTextPassword('test'),
    email: "test@gmail.com",
    isEmailValidated: true,
    firstName: "sean",
    lastName: "imam",
    joinDate: new Date('2011-04-11T10:20:30Z'),
    banStatus: {
      type: UserBanType.NONE,
    },
    birthDate: new Date('2000-04-11T10:20:30Z'),
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
  });
}

export const getDummyDistrict = () => {
  return District.builder({
    title: "testDistrict",
    authorUsername: "testusername",
    createDate: new Date(),
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
  });
}

export const getDummyTalkingPointPost = () => {
  const dummyUser = getDummyUser();
  const dummyDistrict = getDummyDistrict()
  return TalkingPointPost.builder({
    id: null,
    parentId: dummyDistrict.title,
    parentType: ParentType.DISTRICT,
    title: "Dummy Talking Point Post",
    description: "Dummy Talking Point Post Description",
    authorUserName: dummyUser.userName,
    authorImageUrl: dummyUser.thumbnail,
    createDate: new Date(),
    source: {
      type: TalkingPointPostSourceType.CLASSIC,
      data: getDummyLinkPreview(),
    },
    banStatus: {
      type: ObjectBanType.NONE,
    },
    viewMode: ViewMode.PUBLIC,
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }
    ageRating: AgeRating.EVERYONE,
    metrics: {
      absoluteScore: 123123,
      timeBasedScore: 414512,
      viewCount: 1231,
      commentCount: 2344,
    },

    // optional
    tags: ["testTag1", "testTag2"],
  });
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

export const getDummyGeneralChatRequest = () => {
  const dummyTalkingPoint = getDummyTalkingPointPost();
  const dummyUser = getDummyUser();
  return new GeneralChatRequest(
    "12345generalChatRequest",
    dummyTalkingPoint.id,
    ParentType.TALKING_POINT_POST,
    new Date(),
    dummyUser.userName,
    ConvoPreference.CASUAL,
    false,
    dummyUser.thumbnail,
    "I am an expert"
  );
}


export const getDummyConvo = () => {
  const dummyTalkingPoint = getDummyTalkingPointPost();
  const dummyUser = getDummyUser();
  return new Convo(
    null,
    ConvoStatus.NOT_ACCEPTED,
    new Date(),
    "dummy Convo Title",
    [dummyUser.userName],
    new ObjectBanStatus(ObjectBanType.NONE),
  );
}

