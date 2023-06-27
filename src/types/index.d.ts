type DatabaseResponse<Document> = Promise<
  (FlattenMaps<Document> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
>;

export type { DatabaseResponse };
