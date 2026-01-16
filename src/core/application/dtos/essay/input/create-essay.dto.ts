export type EssayContent = {
  authorId?: string;
  theme: string;
  competency1: number;
  competency2: number;
  competency3: number;
  competency4: number;
  competency5: number;
}

export type CreateEssayDto = {
  requesterId: string;
  requesterRole: string;
  essayData: EssayContent;
}