import createError from "http-errors";

export const notFoundHandler = (_req, _res, next) => {
  next(createError.NotFound());
};

