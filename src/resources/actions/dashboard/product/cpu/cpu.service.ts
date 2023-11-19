import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { CpuDocument, CpuModel, CpuSchema } from './cpu.model';

async function createNewCpuService(cpuSchema: CpuSchema): Promise<CpuDocument> {
  try {
    const newCpu = await CpuModel.create(cpuSchema);
    return newCpu;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewCpuService' });
  }
}

async function getQueriedCpusService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<CpuDocument>): DatabaseResponse<CpuDocument> {
  try {
    const cpus = await CpuModel.find(filter, projection, options).lean().exec();
    return cpus;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedCpuService' });
  }
}

async function getQueriedTotalCpusService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<CpuDocument>): Promise<number> {
  try {
    const totalCpu = await CpuModel.countDocuments(filter).lean().exec();
    return totalCpu;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalCpuService' });
  }
}

async function getCpuByIdService(
  cpuId: Types.ObjectId | string
): DatabaseResponseNullable<CpuDocument> {
  try {
    const cpu = await CpuModel.findById(cpuId).select('-__v').lean().exec();
    return cpu;
  } catch (error: any) {
    throw new Error(error, { cause: 'getCpuByIdService' });
  }
}

async function updateCpuByIdService({
  fieldsToUpdate,
  cpuId,
}: {
  cpuId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof CpuDocument, CpuDocument[keyof CpuDocument]>;
}): DatabaseResponseNullable<CpuDocument> {
  try {
    const cpu = await CpuModel.findByIdAndUpdate(cpuId, { $set: fieldsToUpdate }, { new: true })
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return cpu;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateCpuByIdService' });
  }
}

async function deleteAllCpusService(): Promise<DeleteResult> {
  try {
    const cpus = await CpuModel.deleteMany({}).lean().exec();
    return cpus;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllCpusService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const cpus = await CpuModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = cpus.flatMap((cpu) => cpu.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteACpuService(cpuId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const cpu = await CpuModel.deleteOne({ _id: cpuId }).lean().exec();
    return cpu;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteACpuService' });
  }
}

export {
  createNewCpuService,
  getQueriedCpusService,
  getQueriedTotalCpusService,
  getCpuByIdService,
  updateCpuByIdService,
  deleteAllCpusService,
  returnAllUploadedFileIdsService,
  deleteACpuService,
};
