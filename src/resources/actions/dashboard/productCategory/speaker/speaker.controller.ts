import expressAsyncHandler from 'express-async-handler';

import type { FilterQuery, QueryOptions } from 'mongoose';
import type { Response } from 'express';
import type { DeleteResult } from 'mongodb';
import type {
  CreateNewSpeakerBulkRequest,
  CreateNewSpeakerRequest,
  DeleteASpeakerRequest,
  DeleteAllSpeakersRequest,
  GetSpeakerByIdRequest,
  GetQueriedSpeakersRequest,
  UpdateSpeakerByIdRequest,
} from './speaker.types';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../../types';
import type { SpeakerDocument, SpeakerSchema } from './speaker.model';

import {
  createNewSpeakerService,
  deleteASpeakerService,
  deleteAllSpeakersService,
  getSpeakerByIdService,
  getQueriedSpeakersService,
  getQueriedTotalSpeakersService,
  returnAllSpeakersUploadedFileIdsService,
  updateSpeakerByIdService,
} from './speaker.service';
import {
  FileUploadDocument,
  deleteAllFileUploadsByAssociatedResourceService,
  deleteFileUploadByIdService,
  getFileUploadByIdService,
} from '../../../../fileUpload';
import { ProductServerResponse } from '../types';

// @desc   Create new speaker
// @route  POST /api/v1/actions/dashboard/product-category/speaker
// @access Private/Admin/Manager
const createNewSpeakerHandler = expressAsyncHandler(
  async (
    request: CreateNewSpeakerRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      speakerSchema,
    } = request.body;

    const newSpeakerObject: SpeakerSchema = {
      userId,
      username,
      ...speakerSchema,
    };

    const newSpeaker = await createNewSpeakerService(newSpeakerObject);

    if (!newSpeaker) {
      response.status(400).json({
        message: 'Could not create new speaker',
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${newSpeaker.model} speaker`,
      resourceData: [newSpeaker],
    });
  }
);

// DEV ROUTE
// @desc   Create new speakers bulk
// @route  POST /api/v1/actions/dashboard/product-category/speaker/dev
// @access Private/Admin/Manager
const createNewSpeakerBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewSpeakerBulkRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    const { speakerSchemas } = request.body;

    const newSpeakers = await Promise.all(
      speakerSchemas.map(async (speakerSchema) => {
        const newSpeaker = await createNewSpeakerService(speakerSchema);
        return newSpeaker;
      })
    );

    // filter out any speakers that were not created
    const successfullyCreatedSpeakers = newSpeakers.filter((speaker) => speaker);

    // check if any speakers were created
    if (successfullyCreatedSpeakers.length === speakerSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedSpeakers.length} speakers`,
        resourceData: successfullyCreatedSpeakers,
      });
      return;
    } else if (successfullyCreatedSpeakers.length === 0) {
      response.status(400).json({
        message: 'Could not create any speakers',
        resourceData: [],
      });
      return;
    } else {
      response.status(201).json({
        message: `Successfully created ${
          speakerSchemas.length - successfullyCreatedSpeakers.length
        } speakers`,
        resourceData: successfullyCreatedSpeakers,
      });
      return;
    }
  }
);

// @desc   Get all speakers
// @route  GET /api/v1/actions/dashboard/product-category/speaker
// @access Private/Admin/Manager
const getQueriedSpeakersHandler = expressAsyncHandler(
  async (
    request: GetQueriedSpeakersRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSpeakersService({
        filter: filter as FilterQuery<SpeakerDocument> | undefined,
      });
    }

    // get all speakers
    const speakers = await getQueriedSpeakersService({
      filter: filter as FilterQuery<SpeakerDocument> | undefined,
      projection: projection as QueryOptions<SpeakerDocument>,
      options: options as QueryOptions<SpeakerDocument>,
    });
    if (speakers.length === 0) {
      response.status(200).json({
        message: 'No speakers that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    // find all fileUploads associated with the speakers (in parallel)
    const fileUploadsArrArr = await Promise.all(
      speakers.map(async (speaker) => {
        const fileUploadPromises = speaker.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter((fileUpload) => fileUpload);
      })
    );

    // create speakerServerResponse array
    const speakerServerResponseArray = speakers
      .map((speaker, index) => {
        const fileUploads = fileUploadsArrArr[index];
        return {
          ...speaker,
          fileUploads,
        };
      })
      .filter((speaker) => speaker);

    response.status(200).json({
      message: 'Successfully retrieved speakers',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: speakerServerResponseArray as SpeakerDocument[],
    });
  }
);

// @desc   Get speaker by id
// @route  GET /api/v1/actions/dashboard/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const getSpeakerByIdHandler = expressAsyncHandler(
  async (
    request: GetSpeakerByIdRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    const speakerId = request.params.speakerId;

    // get speaker by id
    const speaker = await getSpeakerByIdService(speakerId);
    if (!speaker) {
      response.status(404).json({ message: 'Speaker not found', resourceData: [] });
      return;
    }

    // get all fileUploads associated with the speaker
    const fileUploadsArr = await Promise.all(
      speaker.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload as FileUploadDocument;
      })
    );

    // create speakerServerResponse
    const speakerServerResponse: ProductServerResponse<SpeakerDocument> = {
      ...speaker,
      fileUploads: fileUploadsArr.filter((fileUpload) => fileUpload) as FileUploadDocument[],
    };

    response.status(200).json({
      message: 'Successfully retrieved speaker',
      resourceData: [speakerServerResponse],
    });
  }
);

// @desc   Update a speaker by id
// @route  PUT /api/v1/actions/dashboard/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const updateSpeakerByIdHandler = expressAsyncHandler(
  async (
    request: UpdateSpeakerByIdRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    const { speakerId } = request.params;
    const { speakerFields } = request.body;

    // check if speaker exists
    const speakerExists = await getSpeakerByIdService(speakerId);
    if (!speakerExists) {
      response.status(404).json({ message: 'Speaker does not exist', resourceData: [] });
      return;
    }

    const newSpeaker = {
      ...speakerExists,
      ...speakerFields,
    };

    // update speaker
    const updatedSpeaker = await updateSpeakerByIdService({
      speakerId,
      fieldsToUpdate: newSpeaker,
    });

    if (!updatedSpeaker) {
      response.status(400).json({
        message: 'Speaker could not be updated',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Speaker updated successfully',
      resourceData: [updatedSpeaker],
    });
  }
);

// @desc   Return all associated file uploads
// @route  GET /api/v1/actions/dashboard/product-category/speaker/fileUploads
// @access Private/Admin/Manager
const returnAllFileUploadsForSpeakersHandler = expressAsyncHandler(
  async (
    _request: GetSpeakerByIdRequest,
    response: Response<ResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const fileUploadsIds = await returnAllSpeakersUploadedFileIdsService();

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

// @desc   Delete all speakers
// @route  DELETE /api/v1/actions/dashboard/product-category/speaker
// @access Private/Admin/Manager
const deleteAllSpeakersHandler = expressAsyncHandler(
  async (
    _request: DeleteAllSpeakersRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    // grab all speakers file upload ids
    const fileUploadsIds = await returnAllSpeakersUploadedFileIdsService();

    // delete all file uploads associated with all speakers
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

    // delete all speakers
    const deleteSpeakersResult: DeleteResult = await deleteAllSpeakersService();

    if (deleteSpeakersResult.deletedCount === 0) {
      response.status(400).json({
        message: 'All speakers could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'All speakers deleted', resourceData: [] });
  }
);

// @desc   Delete a speaker by id
// @route  DELETE /api/v1/actions/dashboard/product-category/speaker/:speakerId
// @access Private/Admin/Manager
const deleteASpeakerHandler = expressAsyncHandler(
  async (
    request: DeleteASpeakerRequest,
    response: Response<ResourceRequestServerResponse<SpeakerDocument>>
  ) => {
    const speakerId = request.params.speakerId;

    // check if speaker exists
    const speakerExists = await getSpeakerByIdService(speakerId);
    if (!speakerExists) {
      response.status(404).json({ message: 'Speaker does not exist', resourceData: [] });
      return;
    }

    // find all file uploads associated with this speaker
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...speakerExists.uploadedFilesIds];

    // delete all file uploads associated with this speaker
    const deleteFileUploadsResult: DeleteResult[] = await Promise.all(
      uploadedFilesIds.map(async (uploadedFileId) => deleteFileUploadByIdService(uploadedFileId))
    );

    if (deleteFileUploadsResult.some((result) => result.deletedCount === 0)) {
      response.status(400).json({
        message:
          'Some file uploads associated with this speaker could not be deleted. Speaker not deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    // delete speaker by id
    const deleteSpeakerResult: DeleteResult = await deleteASpeakerService(speakerId);

    if (deleteSpeakerResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Speaker could not be deleted. Please try again.',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: 'Speaker deleted', resourceData: [] });
  }
);

export {
  createNewSpeakerBulkHandler,
  createNewSpeakerHandler,
  deleteASpeakerHandler,
  deleteAllSpeakersHandler,
  getSpeakerByIdHandler,
  getQueriedSpeakersHandler,
  returnAllFileUploadsForSpeakersHandler,
  updateSpeakerByIdHandler,
};
