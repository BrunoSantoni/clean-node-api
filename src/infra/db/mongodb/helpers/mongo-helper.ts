import { Collection, MongoClient, ObjectId } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map<T>(mongoId: ObjectId, collectionData: T): { id: string } & T {
    return {
      id: String(mongoId),
      ...collectionData,
    };
  },
};
