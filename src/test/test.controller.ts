import { Request, Response } from 'express';
import {pool} from '../config/db'
import { asyncHandler } from '../core/http';
import { BadRequest, INTERNAL } from '../core/errors';
import axios from 'axios';
import z from 'zod';
import { parentPort } from 'node:worker_threads';

export const getuser = asyncHandler(async (req: Request, res: Response) => {
  console.log("testing");
  const query = "SELECT * FROM users";
  const data= await pool.query(query);
  console.log(data);

}
)

  


