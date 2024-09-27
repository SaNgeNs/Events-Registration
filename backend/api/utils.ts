import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const prisma = new PrismaClient();

export const getPagination = (req: Request) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const setPaginationHeaders = (res: Response, totalItems: number, page: number, limit: number) => {
  res.set('X-Total-Count', String(totalItems));
  res.set('X-Total-Pages', String(Math.ceil(totalItems / limit)));
  res.set('X-Current-Page', String(page));
  res.set('X-Page-Limit', String(limit));
  res.set('Access-Control-Expose-Headers', 'X-Total-Count, X-Total-Pages, X-Current-Page, X-Page-Limit');
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => void) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      details: error.message,
    });
  });
};