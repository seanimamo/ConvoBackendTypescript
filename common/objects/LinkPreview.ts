// Metadata used to generate link previews

import { Expose } from "class-transformer";
import { DataValidator } from "../util/DataValidator";

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

  static validate(linkPreview: LinkPreview) {
    // TODO: Grab validator from singleton source
    const validator = new DataValidator();
    validator.validate(linkPreview.url, "url").notUndefined().notNull().isString().notEmpty();
    validator.validate(linkPreview.type, "type").notUndefined().notNull().isString().notEmpty();
    validator.validate(linkPreview.domain, "domain").notUndefined().notNull().isString().notEmpty();
    if (linkPreview.title !== undefined) {
      validator.validate(linkPreview.title, "title").notUndefined().notNull().isString();
    }
    if (linkPreview.description !== undefined) {
      validator.validate(linkPreview.description, "description").notUndefined().notNull().isString();
    }
    if (linkPreview.imageUrl !== undefined) {
      validator.validate(linkPreview.imageUrl, "imageUrl").notUndefined().notNull().isString();
    }
    if (linkPreview.imageAlt !== undefined) {
      validator.validate(linkPreview.imageAlt, "imageAlt").notUndefined().notNull().isString();
    }
    if (linkPreview.videoUrl !== undefined) {
      validator.validate(linkPreview.videoUrl, "videoUrl").notUndefined().notNull().isString();
    }
  }
}