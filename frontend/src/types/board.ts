export type BoardCreation = Omit<Board, 'id' | 'workspaceId'>;

export type BoardImage = {
  id: string;
  thumbnailUrl: string;
  fullUrl: string;
  description: string;
};

export type Board = {
  id: number;
  title: string;
  workspaceId: number;
} & Pick<BoardImage, 'thumbnailUrl' | 'fullUrl'>;
