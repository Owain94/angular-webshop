declare module messagesInterface {
  export interface RootObject {
    _id: string;
    to: string;
    firstname: string;
    surname_prefix: string;
    surname: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
  }
}
