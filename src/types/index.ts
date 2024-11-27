import { NextFunction,Request,Response } from "express";

export type funcType = (req:Request,res:Response,next:NextFunction)=>Promise<any>

import 'express';

declare module 'express' {
  interface Request {
    user?: {
      userId: string;
    };
  }
}