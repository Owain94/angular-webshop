declare module profileInterface {
  export interface Data {
    _id: string;
    firstname: string;
    surname_prefix: string;
    surname: string;
    streetname: string;
    house_number: string;
    postal_code: string;
    city: string;
    country: string;
    email: string;
    password: string;
    tfatoken: string;
    admin: boolean;
  }

  export interface RootObject {
    error: string;
    data: Data;
  }
}
