export const saveNotificationsToLocalStorage = (notifications) => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };
  
  export const getNotificationsFromLocalStorage = () => {
    const notifications = localStorage.getItem("notifications");
    return notifications ? JSON.parse(notifications) : [];
  };
  
  // Các hàm khác để cập nhật, xóa thông báo...
  