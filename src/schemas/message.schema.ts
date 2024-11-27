export interface IMessage extends Document {
    sender: string;
    receiver: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    type: 'text' | 'image';
  }