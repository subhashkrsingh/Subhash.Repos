const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Task', taskSchema);
