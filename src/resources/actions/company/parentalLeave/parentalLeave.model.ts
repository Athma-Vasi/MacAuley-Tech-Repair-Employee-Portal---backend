import { Schema, Types, model } from 'mongoose';

import type { Country, Department, JobPosition, PhoneNumber, PostalCode } from '../../../user';

type ParentalLeaveSchema = {
  userId: Types.ObjectId;
  username: string;
  email: string;
  contactNumber: PhoneNumber;
  department: Department;
  jobPosition: JobPosition;
};
