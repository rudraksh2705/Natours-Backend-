const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
);
// console.log(tours);

exports.checkId = (req, res, next, val) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid Id",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  console.log(req.params);
  if (id < 0 || id > tours.length - 1)
    res.status(404).json({
      status: "Not Found",
    });
  res.status(200).json({
    status: "success",
    data: {
      data: tours[id],
    },
  });
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "Not enough data",
      message: "can't process",
    });
  }
  next();
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        //new Resources created
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated Tour Here>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
