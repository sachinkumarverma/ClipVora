const jobs = new Map();

const createJob = (id) => {
  const job = { id, progress: 0, status: 'downloading', proc: null, fileName: null };
  jobs.set(id, job);
  return job;
};

const getJob = (id) => jobs.get(id);
const deleteJob = (id) => jobs.delete(id);

module.exports = { jobs, createJob, getJob, deleteJob };
