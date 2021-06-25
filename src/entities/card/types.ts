export interface Card {
  id: number;
  title: string;
  updatedAt: string;
  author: {
    username: string;
  };
  content: string;
}
