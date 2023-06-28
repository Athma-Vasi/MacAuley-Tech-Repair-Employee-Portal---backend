import { Schema, Types, model } from 'mongoose';

import type { Country, Department, JobPosition, PhoneNumber, PostalCode } from '../../../user';

type ParentalLeaveSchema = {
  userId: Types.ObjectId;
  username: string;
  startDate: NativeDate;
  endDate: NativeDate;
  reasonForLeave: string;
  delegatedToEmployee: string;
  responsibilitesHandedOver: string;
  acknowledgement: boolean;
};
