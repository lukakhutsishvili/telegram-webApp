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

interface Reason {
  reason_code: string;
  reason_description: string;
  reason_text?: string;
}

interface ContextType {
  userInfo: {
    telegram_id?: string;
    name?: string;
    device_id?: string;
  };
  setUserInfo: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  reasons: Reason[];
  setReasons: React.Dispatch<React.SetStateAction<Reason[]>>;
  recieptTasks: any[];
  setRecieptTasks: React.Dispatch<React.SetStateAction<any[]>>;
  sendingTasks: any[];
  setSendingTasks: React.Dispatch<React.SetStateAction<any[]>>;
  tabButtons: string;
  setTabButtons: React.Dispatch<React.SetStateAction<string>>;
  navbarButtons: string;
  setNavbarButtons: React.Dispatch<React.SetStateAction<string>>;
  amount: any;
  setAmount: any;
  activeButton: number;
  setActiveButton: any;
}
