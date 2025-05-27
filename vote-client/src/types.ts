export type Poll = {
  id: number;
  title: string;
    options: string[];       // ← додано
  created_at: string;  
  votes: Vote[];
};

export type Vote = {
  id: number;
  poll_id: number;
  option: string;
};
