import { Category, District } from "../../common/objects/District";
import { ParentType, ViewMode } from "../../common/objects/enums";
import { GeneralChatRequest } from "../../common/objects/talking-point-post/GeneralChatRequest";
import { TalkingPointPost } from "../../common/objects/talking-point-post/TalkingPointPost";
import { User } from "../../common/objects/user/User";
import { UserPassword } from "../../common/objects/user/UserPassword";
import { ConvoPreference } from "../../common/objects/enums";

// Note that ban status was left off, an unbanned user wont have a value.
export const getDummyUser = () => {
  return User.builder({
    userName: "testusername",
    password: UserPassword.fromPlainTextPassword('test'),
    email: "test@gmail.com",
    isEmailValidated: true,
    firstName: "string",
    lastName: "string",
    joinDate: new Date('2011-04-11T10:20:30Z'),
    birthDate: new Date('2000-04-11T10:20:30Z'),
    thumbnail: "string",
    bio: "string",
    occupation: "string",
    convoScore: 0,
    followerCount: 0,
    followingCount: 0,
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
    isBanned: false,
    viewMode: ViewMode.PRIVATE,
    primaryCategory: Category.ENTERTAINMENT
  });
}

export const getDummyTalkingPointPost = () => {
  const dummyUser = getDummyUser();
  const dummyDistrict = getDummyDistrict()
  return TalkingPointPost.builder({
    id: '12345talkingPointPost',
    parentId: dummyDistrict.title,
    parentType: ParentType.DISTRICT,
    title: "Dummy Talking Point Post",
    description: "Dummy Talking Point Post Description",
    authorUserName:dummyUser.userName,
    authorImageUrl: dummyUser.thumbnail,
    createDate: new Date(),
    isBanned: false,
    viewMode: ViewMode.PUBLIC,
    // chatRequests: {
    //   viewPoint: ViewPointRequest[];
    //   general: GeneralChatRequest[];
    // }

    // metrics
    absoluteScore: 0,
    timeBasedScore: 0,
    viewCount: 0,
    commentCount: 0,

    // optional
    linkPreview: {
      url: "www.anonexistanturllll.com",
      type: "video.other",
      domain: "anonexistanturllll",
      title: "dummy title",
      description: "dummy link preview description",
      videoUrl: "www.anonexistanturllll.com/video/1234"
    },
    customImageUrl: "www.anonexistanturllll.com/image/1234",
    tags: ["testTag1", "testTag2"],
  });
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
