import { Category } from "../../../../common/objects/District"
import { ViewMode } from "../../../../common/objects/enums"

export type CreateDistrictRequest = {
  title: string,
  authorUsername: string;
  viewMode: ViewMode;
  primaryCategory: Category;
  secondaryCategory?: Category;
  tertiaryCategory?: Category;
  description?: string;
  thumbnail?: string;
}