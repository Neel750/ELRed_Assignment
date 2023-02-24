/** @format */

const taskModel = require("../models/taskModel");
const httpStatusCodes = require("../utilities/status-codes");

//TODO: Add new Task
//request parameters: Date,Task,Status,Priority
//POST: task/
exports.createTask = async (request, response) => {
  let date = request.body.date
    ? request.body.date
    : new Date().toLocaleString();
  let task = request.body.task;
  let status = request.body.status ? request.body.status : "pending";
  let priority = request.body.priority ? request.body.priority : 0;

  try {
    let result = taskModel.create({
      userId: request.id,
      date: date,
      task: task,
      status: status,
      priority: priority,
    });
    if (result) {
      response.status(httpStatusCodes.OK).json({
        success: true,
        reason: "Task added Successfully!",
        data: result,
      });
    } else {
      response.status(httpStatusCodes.OK).json({
        success: false,
        reason: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: "Internal server error",
    });
  }
};

//TODO: List all task
//request parameters:
//GET: task/
exports.getAllTask = async (request, response) => {
  try {
    let page = request.query.page || "1";
    let offset = 10 * page - 10;
    let result = await taskModel.aggregate([
      { $match: { userId: request.id } },
      {
        $addFields: {
          sortrank: {
            $ifNull: ["$order", 999],
          },
        },
      },
      {
        $sort: {
          sortrank: 1,
        },
      },
      {
        $project: {
          sortrank: false,
          order: false,
          __v: false,
          createdAt: false,
          updatedAt: false,
        },
      },
      { $skip: offset },
      { $limit: 10 },
    ]);
    if (result) {
      response.status(httpStatusCodes.OK).json({
        success: true,
        data: result,
      });
    } else {
      response.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        reason: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: "Internal server error",
    });
  }
};

//TODO: List task by id
//request parameters: id
//GET: task/
exports.getTaskById = async (request, response) => {
  try {
    let page = request.query.page || "1";
    let offset = 10 * page - 10;
    let id = request.params.id || 0;
    let result = await taskModel
      .find({ _id: id, userId: request.id })
      .skip(offset)
      .limit(10);
    if (result) {
      if (result.length > 0) {
        response.status(httpStatusCodes.OK).json({
          success: true,
          data: result,
        });
      } else {
        response.status(httpStatusCodes.OK).json({
          success: true,
          reason: "No record found with this taskid",
          data: result,
        });
      }
    } else {
      response.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        reason: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: "Internal server error",
    });
  }
};

//TODO: Update task by id
//request parameters: id,status, task
//PATCH: task/
exports.updateTaskById = async (request, response) => {
  try {
    let id = request.params.id || 0;
    if (id == 0) {
      response.status(httpStatusCodes.NOT_FOUND).json({
        success: true,
        message: "No data found",
      });
    } else {
      let date = request.body.date;
      let newTaskDetail = request.body.task;
      let newStatus = request.body.status;
      let obj = {};
      if (date) {
        obj["date"] = date;
      }
      if (newTaskDetail) {
        obj["task"] = newTaskDetail;
      }
      if (newStatus) {
        obj["status"] = newStatus;
      }
      let result = await taskModel.findByIdAndUpdate(id, obj, {
        useFindAndModify: false,
      });
      if (result) {
        response.status(httpStatusCodes.OK).json({
          success: true,
          reason: "Update Successfully!",
        });
      } else {
        response.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          reason: "Something went wrong",
        });
      }
    }
  } catch (error) {
    console.log(error);
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: "Internal server error",
    });
  }
};

//TODO: Delete task by id
//request parameters: id
//DELETE: task/
exports.deleteTaskById = async (request, response) => {
  try {
    let id = request.params.id || 0;
    if (id == 0) {
      response.status(httpStatusCodes.NOT_FOUND).json({
        success: true,
        message: "No data found",
      });
    } else {
      let result = await taskModel.findByIdAndRemove(id);
      if (result) {
        response.status(httpStatusCodes.OK).json({
          success: true,
          reason: "Task Deleted Successfully!",
        });
      } else {
        response.status(httpStatusCodes.BAD_REQUEST).json({
          success: false,
          reason: "Something went wrong",
        });
      }
    }
  } catch (error) {
    console.log(error);
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: "Internal server error",
    });
  }
};

//TODO: Order change of task
//request parameters:
//POST: task/order
exports.changeOrderOfTask = async (request, response) => {
  try {
    let count = 0;
    let orderIds = request.body.orderIds;
    let result = await taskModel.updateMany(
      { userId: request.id },
      { order: null },
      { useFindAndModify: false }
    );
    for (let i = 0; i < orderIds.length; i++) {
      let id = orderIds[i];
      let result = await taskModel.findByIdAndUpdate(
        id,
        { order: i + 1 },
        { useFindAndModify: false }
      );
      if (result) {
        count++;
      }
    }
    if (count == orderIds.length) {
      response.status(httpStatusCodes.OK).json({
        success: true,
        reason: "Task Order Changed Successfully!",
      });
    } else {
      response.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        reason: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      reason: "Internal server error",
    });
  }
};
