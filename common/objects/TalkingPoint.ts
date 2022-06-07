import { LinkPreview } from "./LinkPreview";

export type TalkingPointPost = {
  id: string;
  customImageUrl?: string; // overrides link preview image for non video link's
  title: string;
  district: string;
  description: string;
  link?: string;
  linkPreview?: LinkPreview;
  createdAt: Date | string | number;
  view: number;
  comment: number;
  share: number;
  favorite: number;
  authorName: {
    name: string;
    avatarUrl: string;
  };
  tags: string[];
  body: string;
  // comments: PostComment[];
};