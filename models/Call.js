import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    // Call participants
    caller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caller_type: { type: String, enum: ["User", "Lawyer"], required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    receiver_type: { type: String, enum: ["User", "Lawyer"], required: true },
    
    // Call details
    channel_name: { type: String, required: true, unique: true },
    call_type: { type: String, enum: ["audio", "video"], default: "audio" },
    
    // Call status
    status: { 
      type: String, 
      enum: ["initiated", "ringing", "accepted", "rejected", "ended", "missed", "cancelled"], 
      default: "initiated" 
    },
    
    // Call timing
    initiated_at: { type: Date, default: Date.now },
    accepted_at: { type: Date },
    ended_at: { type: Date },
    duration: { type: Number, default: 0 }, // in seconds
    
    // Agora details
    agora_uid_caller: { type: Number },
    agora_uid_receiver: { type: Number },
    
    // Additional info
    rejection_reason: { type: String },
    call_quality_rating: { type: Number, min: 1, max: 5 },
    notes: { type: String },
  },
  { timestamps: true }
);

// Index for faster queries
callSchema.index({ caller_id: 1, status: 1 });
callSchema.index({ receiver_id: 1, status: 1 });
callSchema.index({ channel_name: 1 });

export default mongoose.model("Call", callSchema);
