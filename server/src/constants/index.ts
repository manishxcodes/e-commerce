export const constants = {
    USER_TYPES: {
        ADMIN: 1,
        USER: 0
    },

    PRODUCT_SIZES: {
        S: "s",
        M: "m",
        L: "l",
        XL: "xl",
    },

    PAYMENT_MODE: {
        COD: "cod",
        ONLINE: "online"
    },

    ORDER_STATUS: {
        PENDING: "pending",
        PROCESSING: "processing",
        SHIPPED: "shipped",
        DELIVERED: "delivered",
        RECEIVED: "received",
        CANCELLED: "cancelled"
    },

    IMAGE_DELETION_REASON: {
        PRODUCT_DELETE: "product_delete",
        PRODUCT_UPDATE: "product_update"
    },

    IMAGE_DELETION_STATUS: {
        PENDING: "pending",
        DELETED: "deleted",
        FAILED: "failed"
    },

    PAYMENT_STATUS: {
        PENDING: "pending",
        COMPLETED: "completed",
        FAILED: "failed",
        REFUNDED: "refunded"
    }
}
