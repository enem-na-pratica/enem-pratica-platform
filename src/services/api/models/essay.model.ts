export type EssayModel = {
  id: string;
  authorId: string;
  theme: string;
  grades: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
    total: number;
  };
  createdAt: string;
};