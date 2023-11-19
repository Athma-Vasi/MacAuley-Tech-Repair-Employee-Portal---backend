import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewCpuBulkRequest,
  CreateNewCpuRequest,
  DeleteACpuRequest,
  DeleteAllCpusRequest,
  GetCpuByIdRequest,
  GetQueriedCpusRequest,
  UpdateCpuByIdRequest,
} from './cpu.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { CpuDocument, CpuSchema } from './cpu.model';

import {
  createNewCpuService,
  deleteACpuService,
  deleteAllCpusService,
  getCpuByIdService,
  getQueriedCpusService,
  getQueriedTotalCpusService,
  returnAllCpusUploadedFileIdsService,
  updateCpuByIdService,
} from './cpu.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../types';

// @desc   Create new cpu
// @route  POST /api/v1/actions/dashboard/product-category/cpu
// @access Private/Admin/Manager
const createNewCpuHandler = expressAsyncHandler(
  async (
    request: CreateNewCpuRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      cpuSchema,
    } = request.body;

    const newCpuObject: CpuSchema = {
      userId,
      username,
      ...cpuSchema,
    };

    const newCpu = await createNewCpuService(newCpuObject);

    if (!newCpu) {
      response.status(400).json({
        message: 'Could not create new cpu',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newCpu.model} cpu`,
      resourceData: [newCpu],
    });
  }
);

// DEV ROUTE
// @desc   Create new cpus bulk
// @route  POST /api/v1/actions/dashboard/product-category/cpu/dev
// @access Private/Admin/Manager
const createNewCpuBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewCpuBulkRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>
  ) => {
    const { cpuSchemas } = request.body;

    const newCpus = await Promise.all(
      cpuSchemas.map(async (cpuSchema) => {
        const newCpu = await createNewCpuService(cpuSchema);
        return newCpu;
      })
    );

    // filter out any cpus that were not created
    const successfullyCreatedCpus = newCpus.filter((cpu) => cpu);

    // check if any cpus were created
    if (successfullyCreatedCpus.length === cpuSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedCpus.length} cpus`,
        resourceData: successfullyCreatedCpus,
      });
      return;
    } else if (successfullyCreatedCpus.length === 0) {
      response.status(400).json({
        message: 'Could not create any cpus',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${cpuSchemas.length - successfullyCreatedCpus.length} cpus`,
        resourceData: successfullyCreatedCpus,
      });
      return;
    }
  }
);

// @desc   Get all cpus
// @route  GET /api/v1/actions/dashboard/product-category/cpu
// @access Private/Admin/Manager
const getQueriedCpusHandler = expressAsyncHandler(
  async (
    request: GetQueriedCpusRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CpuDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCpusService({
        filter: filter as FilterQuery<CpuDocument> | undefined,
      });
    }

    // get all cpus
    const cpus = await getQueriedCpusService({
      filter: filter as FilterQuery<CpuDocument> | undefined,
      projection: projection as QueryOptions<CpuDocument>,
      options: options as QueryOptions<CpuDocument>,
    });
    if (cpus.length === 0) {
      response.status(200).json({
        message: 'No cpus that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the cpus (in parallel)
    const fileUploadsArrArr = await Promise.all(
      cpus.map(async (cpu) => {
        const fileUploadPromises = cpu.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create cpuServerResponse array
    const cpuServerResponseArray = cpus
      .map((cpu, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...cpu,
          fileUploads,
        };
      })
      .filter((cpu) => cpu);

    response.status(200).json({
      message: 'Successfully retrieved cpus',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: cpuServerResponseArray as CpuDocument[],
    });
  }
);

// @desc   Get cpu by id
// @route  GET /api/v1/actions/dashboard/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const getCpuByIdHandler = expressAsyncHandler(
  async (
    request: GetCpuByIdRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>
  ) => {
    const cpuId = request.params.cpuId;

    // get cpu by id
    const cpu = await getCpuByIdService(cpuId);
    if (!cpu) {
      response.status(404).json({ message: 'Cpu not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the cpu
    const fileUploadsArr = await Promise.all(
      cpu.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create cpuServerResponse
    const cpuServerResponse: ProductServerResponse<CpuDocument> = {
      ...cpu,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved cpu',
      resourceData: [cpuServerResponse],
    });
  }
);

// @desc   Update a cpu by id
// @route  PUT /api/v1/actions/dashboard/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const updateCpuByIdHandler = expressAsyncHandler(
  async (
    request: UpdateCpuByIdRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>
  ) => {
    const { cpuId } = request.params;
    const { cpuFields } = request.body;

    // check if cpu exists
    const cpuExists = await getCpuByIdService(cpuId);
    if (!cpuExists) {
      response.status(404).json({ message: 'Cpu does not exist', resourceData: [] });
      return;
    }

    const newCpu = {
      ...cpuExists,
      ...cpuFields,
    };

    // update cpu
    const updatedCpu = await updateCpuByIdService({
      cpuId,
      fieldsToUpdate: newCpu,
    });

    if (!updatedCpu) {
      response.status(400).json({
        message: 'Cpu could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Cpu updated successfully',
      resourceData: [updatedCpu],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/cpu/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForCpusHandler = expressAsyncHandler(
  async (
    _request: GetCpuByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllCpusUploadedFileIdsService();

    if (fileUploadsIds.length === 0) {
      response.status(404).json({ message: 'No file uploads found', resourceData: [] });
      return;
    }

    const fileUploads = (await Promise.all(
      fileUploadsIds.map(async (fileUploadId) => {
        const fileUpload = await getFileUploadByIdService(fileUploadId);

        return fileUpload;
      })
    )) as FileUploadDocument[];

    // filter out any undefined values (in case fileUpload was not found)
    const filteredFileUploads = fileUploads.filter((fileUpload) => fileUpload);

    if (filteredFileUploads.length !== fileUploadsIds.length) {
      response.status(404).json({
        message: 'Some file uploads could not be found.',
        resourceData: filteredFileUploads,
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully retrieved file uploads',
      resourceData: filteredFileUploads,
    });
  }
);

// @desc   Delete all cpus
// @route  DELETE /api/v1/actions/dashboard/product-category/cpu
// @access Private/Admin/Manager
const deleteAllCpusHandler = expressAsyncHandler(
  async (
    _request: DeleteAllCpusRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>
  ) => {
    // grab all cpus file upload ids
    const fileUploadsIds = await returnAllCpusUploadedFileIdsService();

    // delete all file uploads associated with all cpus
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      fileUploadsIds.map(async (fileUploadId) => deleteFileUploadByIdService(fileUploadId))
    );
    if (!deleteFileUploadsResult.every((result) => result.deletedCount !== 0)) {
      response.status(400).json({
        message: 'Some file uploads could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete all cpus
    const deleteCpusResult: DeleteResult = await deleteAllCpusService();

    if (deleteCpusResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All cpus could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All cpus deleted', resourceData: [] });
  }
);

// @desc   Delete a cpu by id
// @route  DELETE /api/v1/actions/dashboard/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const deleteACpuHandler = expressAsyncHandler(
  async (
    request: DeleteACpuRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>
  ) => {
    const cpuId = request.params.cpuId;

    // check if cpu exists
    const cpuExists = await getCpuByIdService(cpuId);
    if (!cpuExists) {
      response.status(404).json({ message: 'Cpu does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this cpu
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...cpuExists.uploadedFilesIds];

    // delete all file uploads associated with this cpu
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this cpu could not be deleted. Cpu not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete cpu by id
    const deleteCpuResult: DeleteResult = await deleteACpuService(cpuId);

    if (deleteCpuResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Cpu could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Cpu deleted', resourceData: [] });
  }
);

export {
  createNewCpuBulkHandler,
  createNewCpuHandler,
  deleteACpuHandler,
  deleteAllCpusHandler,
  getCpuByIdHandler,
  getQueriedCpusHandler,
  returnAllFileUploadsForCpusHandler,
  updateCpuByIdHandler,
};
