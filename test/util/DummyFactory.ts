import { Category, District } from "../../common/objects/District";
import { ParentType } from "../../common/objects/enums";
import { TalkingPointPost } from "../../common/objects/talking-point-post/TalkingPointPost";
import { User } from "../../common/objects/user/User";
import { UserPassword } from "../../common/objects/user/UserPassword";
import { ViewMode } from "../../common/objects/ViewMode";

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
    subscriberCount: 0,
    viewCount: 0,
    postCount: 0,
    convoCount: 0,
    talkingPointCount: 0,
    isBanned: false,
    viewMode: ViewMode.PRIVATE,
    primaryCategory: Category.BUSINESS
  });
}

export const getDummyTalkingPointPost = () => {
  return TalkingPointPost.builder({
    id: '12345talkingPointPost',
    parentId: '12345District',
    parentType: ParentType.DISTRICT,
    title: "Dummy Talking Point Post",
    description: "Dummy Talking Point Post Description",
    authorUserName: "testusername",
    authorImageUrl: "testurl.com/image/123",
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
    tags: ["testTag1","testTag2"],
  });
}
