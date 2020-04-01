import { CustomDropDown } from '../model/CustomDropDown';
export class OverallDashboardChart {
    TopFiveRevenueByLocation: CustomDropDown[] = [];
    ModeOfPaymentChart: CustomDropDown[] = [];
    ModeOfBookingChart: CustomDropDown[] = [];
    RevenueByWeekChart: CustomDropDown[] = [];
    revenuepercentage: number
    totalrevenuesum: number
    clientlocationid: number
    description: string
    paymentmode: string
    totalpayment: number
    bookingduration: string
    totalbookingticketingapp: number
    totalbookingcitizenapp: number
    id: number
    totalcar: number
    totalbike: number
    weeknumber: number

}