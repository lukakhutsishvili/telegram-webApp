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
    telegram_id?: string;
    name?: string;
    device_id?: string;
  };
  setUserInfo: any;
  reasons: undefined | string[];
  setReasons: any;
  recieptTasks: Array;
  setRecieptTasks: any;
  sendingTasks: Array;
  setSendingTasks: any;
  tabButtons: string,
  setTabButtons: any,
};


