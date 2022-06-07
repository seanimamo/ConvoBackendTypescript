import { Stage } from "./Stage";

export const createStageBasedId = (stage: Stage, id: string, withSeparater: boolean = true) => {
  if (withSeparater) {
    return `${stage}-${id}`;
  }

  return `${stage}${id}`;
}