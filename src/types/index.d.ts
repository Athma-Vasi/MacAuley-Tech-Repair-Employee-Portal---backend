type DatabaseResponse<Document> = Promise<
  (FlattenMaps<Document> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
>;

type DatabaseResponseNullable<Document> = Promise<
  | (FlattenMaps<Document> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
>;

export type { DatabaseResponse, DatabaseResponseNullable };
