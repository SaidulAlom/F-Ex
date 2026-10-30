/* eslint-disable @typescript-eslint/no-explicit-any */
export function serializeDocument<T>(document: any): T {
  const plain =
    typeof document?.toObject === 'function'
      ? document.toObject({ getters: false, virtuals: false })
      : document;
  const json = JSON.parse(JSON.stringify(plain)) as Record<string, any>;
  const { _id, ...withoutId } = json;
  delete withoutId.__v;
  return {
    ...withoutId,
    id: withoutId.id || (typeof _id === 'string' ? _id : _id?.toString?.()) || '',
  } as T;
}

export function serializeDocuments<T>(documents: unknown[]): T[] {
  return documents.map((document) => serializeDocument<T>(document));
}
