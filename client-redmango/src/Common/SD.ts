export const baseUrl = 'https://localhost:44305';

export const baseUrlAPI = baseUrl + '/api/';

export enum SD_Roles {
    ADMIN = "admin",
    CUTOMER = "customer",
}

export enum SD_Status {
    PENDING = "Pending",
    CONFIRMED = "Confirmed",
    BEING_COOKED = "Being Cooked",
    READY_FOR_PICKUP = "Ready for Pickup",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled",
  }