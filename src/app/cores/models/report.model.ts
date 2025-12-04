export interface OverallStats {
  totalOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
}

export interface OrderStatusStat {
  _id: string; 
  count: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
  imgURL:string;
  price:number
}

export interface TopUser {
  _id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
}

export interface OrderReport {
  overallStats: OverallStats[];
  orderStatusStats: OrderStatusStat[];
  topProducts: TopProduct[];
  topUsers: TopUser[];
}
export interface OrderReportRes{
    message:string,
    data:OrderReport[];
}