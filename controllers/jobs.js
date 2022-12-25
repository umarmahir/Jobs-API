const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async (req, res) => {
  const userId = req.user.userId
  const jobs = await Job.find({ createdBy: userId })

  res.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({ _id: jobId, createdBy: userId })
  if (!job) {
    const newError = new Error(`No such job with id: ${jobId}`)
    newError.status = 404
    throw newError
  }

  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true }
  )
  if (!job) {
    const newError = new Error(`No such job with id: ${jobId}`)
    newError.status = 404
    throw newError
  }

  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId })
  if (!job) {
    const newError = new Error(`No such job with id: ${jobId}`)
    newError.status = 404
    throw newError
  }

  res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}
