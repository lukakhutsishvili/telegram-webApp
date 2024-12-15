declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

type createContextType = {
  userInfo: {
    id?: string;
    name?: string;
  };
  setUserInfo: any;
};
