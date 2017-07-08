declare module totalStats {

  export interface RootObject {
    error: string;
    usercount: number;
    pageviews: number;
    productviews: number;
  }

  export interface ReturnObject {
    usercount: number;
    pageviews: number;
    productviews: number;
  }

}
