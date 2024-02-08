import { NextFunction, Request, Response } from "express";

class FilesController {
  public async upload(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(201).json("Uploaded");
    } catch (e) {
      console.log(e.message);
    }
  }
}

export const filesController = new FilesController();
