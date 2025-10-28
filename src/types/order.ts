export interface Order {
  tracking_code: string;
  client_name: string;
  client_address: string;
  client_phone: string;
  Status: string;
  sum: number;
  sumcash: number;
  parcel_with_return: boolean;
  parcel_with_return_barcode?: string; 
  HeavyWeight?: boolean; 
  with_places?: boolean; 
  places?: any[]; 
}