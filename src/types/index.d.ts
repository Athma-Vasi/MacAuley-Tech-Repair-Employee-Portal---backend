import type { FlattenMaps } from 'mongoose';

/**
 * these types are used in the database service functions for all resources
 */

type DatabaseResponse<Document> = Promise<
  (FlattenMaps<Document> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
>;
/**
 * where generic type parameter Document is a mongoose document type
 */
type DatabaseResponseNullable<Document> = Promise<
  | (FlattenMaps<Document> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
>;

export type { DatabaseResponse, DatabaseResponseNullable };
