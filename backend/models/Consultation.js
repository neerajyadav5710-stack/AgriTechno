import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responderName: { type: String, required: true },
  role: { type: String, default: 'expert' },
  message: { type: String, required: true },
  actionSteps: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const consultationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    issueTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['Routine', 'High', 'Critical'],
      default: 'Routine',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Open', 'Under Review', 'Resolved'],
      default: 'Open',
    },
    assignedExpert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    responses: [responseSchema],
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
