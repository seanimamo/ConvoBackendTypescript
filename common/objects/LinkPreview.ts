// Metadata used to generate link previews

import { Expose } from "class-transformer";

export class LinkPreview {
  @Expose() url: string;
  @Expose() type: string;
  @Expose() domain: string;
  @Expose() title?: string;
  @Expose() description?: string;
  @Expose() imageUrl?: string;
  @Expose() imageAlt?: string;
  @Expose() videoUrl?: string;

  constructor(
    url: string,
    type: string,
    domain: string,
    title?: string,
    description?: string,
    imageUrl?: string,
    imageAlt?: string,
    videoUrl?: string,
  ) {
    this.url = url;
    this.type = type;
    this.domain = domain;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.imageAlt = imageAlt;
    this.videoUrl = videoUrl;
  }
}