import { Collection, MongoClient, ObjectId } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.url);
    return this.client.db().collection(name);
  },

  map<T>(mongoId: ObjectId, collectionData: T): { id: string } & T {
    return {
      id: String(mongoId),
      ...collectionData,
    };
  },

  mapCollection(collectionsData: any[]): any[] {
    return collectionsData.map(collection => {
      const { _id: mongoId, ...collectionData } = collection;
      return MongoHelper.map(mongoId, collectionData);
    });
  },
};
