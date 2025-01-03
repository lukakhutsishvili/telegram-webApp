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
  setReasons: React.Dispatch<React.SetStateAction<string[]>>;
  recieptTasks: any[];
  setRecieptTasks: React.Dispatch<React.SetStateAction<any[]>>;
  sendingTasks: any[];
  setSendingTasks: React.Dispatch<React.SetStateAction<any[]>>;
  tabButtons: string;
  setTabButtons: React.Dispatch<React.SetStateAction<string>>;
  navbarButtons: string;
  setNavbarButtons: React.Dispatch<React.SetStateAction<string>>;
  amount: {
    cash: number;
    bank: number;
    sum: number;
}[];
  setAmount: any;
  
};
