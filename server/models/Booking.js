const bookingSchema = new mongoose.Schema({
  userId: String,
  roomId: String,
  startDate: Date,
  endDate: Date,
});

export default mongoose.model("Booking", bookingSchema);