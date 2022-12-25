const mongoose = require('mongoose')
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
    },
    position: {
      type: String,
      required: [true, 'please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['Pending', 'Interview', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide User'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', jobSchema)
