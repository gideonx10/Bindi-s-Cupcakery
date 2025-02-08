import mongoose, { Schema, Document } from 'mongoose';

// Define a sub-schema for individual order items.
export interface IOrderItem {
  product: mongoose.Types.ObjectId; // Reference to the Product.
  quantity: number;
  customization?: string;           // Any custom note or option chosen.
}

const OrderItemSchema: Schema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  customization: { type: String },
});

// Define the interface for an Order document.
export interface IOrder extends Document {
  customerName: string;
  customerContact: string;   // Phone number or email.
  orderItems: IOrderItem[];    // An array of items in the order.
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'received' | 'preparing' | 'ready for pickup' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Create the Order schema.
const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerContact: { type: String, required: true },
    orderItems: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['received', 'preparing', 'ready for pickup', 'completed', 'cancelled'],
      default: 'received',
    },
  },
  { timestamps: true }
);

// Export the model.
export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
