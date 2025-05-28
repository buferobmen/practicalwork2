export type Poll = {
  id: number;
  title: string;
  options: string[];
  created_at: string;
  votes: {
    id: number;
    option: string;
    poll_id: number;
  }[];
};
export type Vote = {
  id: number;
  poll_id: number;
  option: string;
};
