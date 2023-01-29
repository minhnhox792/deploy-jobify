import res from "express/lib/response.js";
import { StatusCodes } from "http-status-codes";
import Job from "../models/Job.js";

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.BAD_REQUEST;
  }
}
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.BAD_REQUEST;
  }
}
class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.NOT_FOUND;
  }
}
class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.UNAUTHORIZED;
  }
}

const courseController = {
  createJob: async (req, res) => {
    const position = req.body.position[0];
    const company = req.body.company[0];
    console.log(req.body);
    if (!position || !company) {
      throw new BadRequestError("Please provide all info");
    }

    let jobType, status;

    if (typeof req.body.jobType === "object") {
      jobType = req.body.jobType[0];
    } else {
      jobType = req.body.jobType;
    }

    if (typeof req.body.status === "object") {
      status = req.body.status[0];
    } else {
      status = req.body.status;
    }
    const createBy = req.user.userId;
    const job = new Job({
      position: position,
      company: company,
      createdBy: createBy,
      jobType: jobType,
      status: status,
    });
    await job.save();
    res.status(StatusCodes.CREATED).json({
      job,
    });
  },
  getAllJobs: async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    const totalJob = (await Job.find({ createdBy: req.user.userId })).length;
    const jobs = await Job.find({ createdBy: req.user.userId })
      .skip(skip)
      .limit(limit);

    const numOfPages = Math.ceil(totalJob / limit);

    res.status(StatusCodes.OK).json({
      jobs,
      totalJobs: jobs.length,
      numOfPages: numOfPages,
    });
  },
  updateJob: async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    let jobType;
    if (typeof req.body.jobType === "object") {
      jobType = req.body.jobType[0];
    } else {
      jobType = req.body.jobType;
    }

    let status;
    if (typeof req.body.status === "object") {
      status = req.body.status[0];
    } else {
      status = req.body.status;
    }

    let position;
    if (typeof req.body.position === "object") {
      position = req.body.position[0];
    } else {
      position = req.body.position;
    }

    let company;
    if (typeof req.body.company === "object") {
      company = req.body.company[0];
    } else {
      company = req.body.company;
    }

    let jobLocation;
    if (typeof req.body.jobLocation === "object") {
      jobLocation = req.body.jobLocation[0];
    } else {
      jobLocation = req.body.jobLocation;
    }
    const updated = await Job.updateOne(
      { _id: id },
      {
        $set: {
          position: position,
          company: company,
          jobLocation: jobLocation,
          jobType: jobType,
          status: status,
        },
      }
    );
    const job = {
      position,
      company,
      jobLocation,
      jobType,
      status,
    };
    res.status(StatusCodes.OK).json({
      job,
    });
  },
  deleteJob: async (req, res) => {
    const id = req.params.id;
    const deleted = await Job.deleteOne({ _id: id });
    const jobs = await Job.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({
      jobs: jobs,
      totalJobs: jobs.length,
      numOfPages: 1,
    });
  },
  showStats: (req, res) => {
    const userId = req.user.userId;
    Job.aggregate([
      {
        $group: {
          _id: {createdBy:"$createdBy",status:"$status"},

          count: {
            $sum: 1,
          },
        },
      },
    ])
    .then(result => {
      const data = result.filter(item => {
        return item._id.createdBy.toString() === userId
      })
      return data
    })
    .then(data => {
      return res.status(StatusCodes.OK).json({
        jobs: data,
      });
    })
   
  },
  searchJob: async (req, res) => {
    let { searchTypeStyle, searchStatusStyle, numOfPages } = req.body;
    let searchContent;
    if (typeof req.body.searchContent === "object") {
      searchContent = req.body.searchContent[0];
    } else {
      searchContent = req.body.searchContent;
    }
    let sortTypeStyle;
    if (typeof req.body.sortTypeStyle === "object") {
      sortTypeStyle = req.body.sortTypeStyle[0];
    } else {
      sortTypeStyle = req.body.sortTypeStyle;
    }
    if (searchTypeStyle == "all") {
      searchTypeStyle = "";
    }
    if (searchStatusStyle == "all") {
      searchStatusStyle = "";
    }
    let data = await Job.find({ $text: { $search: searchContent } });
    data = data.filter((item) => {
      if (searchTypeStyle != "") {
        return item.jobType == searchTypeStyle;
      }
      if (searchStatusStyle != "") {
        return item.status == searchStatusStyle;
      } else {
        return item;
      }
    });

    if (sortTypeStyle == "ascending") {
      data = data.reverse();
    }

    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 2;
    // const skip  = (page - 1) * limit;
    // const totalJob = data.length

    // const new_data = data.slice((page - 1) * limit, page * limit);

    // console.log(222222, totalJob, page)
    // const numOfPages = Math.ceil(totalJob/limit)
    // console.log("Number of page: ", numOfPages)

    res.status(StatusCodes.OK).json({
      jobs: data,
      totalJobs: data.length,
      numOfPages: numOfPages,
    });
  },
};
export default courseController;
