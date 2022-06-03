import { Stage } from "../Stage";

export const createStageBasedId = (stage: Stage, id: string) => {
  return `${stage}${id}`;
}