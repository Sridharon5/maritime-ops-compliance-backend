type DocumentJson = {
  _id?: { toString: () => string };
  id?: string;
};

export function normalizeDocumentJson(ret: DocumentJson) {
  ret.id = ret._id?.toString();
  delete ret._id;
}
