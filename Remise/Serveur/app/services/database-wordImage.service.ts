import { injectable } from "inversify";
import { Collection, FilterQuery, MongoClient, MongoClientOptions } from "mongodb";
import { IResponse, Status } from "../interfaces/IResponse";


// tslint:disable-next-line: typedef
const DATABASE_NAME = "PROJET3";
// tslint:disable-next-line: typedef
const DATABASE_COLLECTION = "WORD-IMAGE";

@injectable()
export class DatabaseWordImageService {

  public collection: Collection<String>;

  // tslint:disable-next-line: typedef 2 tslint type def et string inferred si DATABASE_URL : string = X;
  public DATABASE_URL =
    "mongodb+srv://admin:lesDINDONS@cluster0.xvsij.mongodb.net/test?retryWrites=true&w=majority";

  private options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  public constructor() {
    this.startConnection();
  }

  public startConnection(): void {
    MongoClient.connect(this.DATABASE_URL, this.options)
      .then((client: MongoClient) => {
        this.collection = client
          .db(DATABASE_NAME)
          .collection(DATABASE_COLLECTION);
      })
      .catch(() => {
        console.error("CONNECTION ERROR. EXITING PROCESS");
        process.exit(1);
      });
  }

  public async addWordImage(wordImage: any): Promise<IResponse> {
    const imageToAdd = await this.getWordImage(wordImage);
    if (imageToAdd == null) { 
      return this.collection.insertOne(JSON.parse(wordImage)).then(() => {
        const response: IResponse = { status: Status.HTTP_CREATED, message: "Word-image added"};
        return response;
      })
      .catch((error: Error) => {
        throw error;
      });
    }
    const res: IResponse = { status: Status.USER_EXISTS, message: "Word already exists"};
    console.log('already exists');
    return res;
  }

  public async getWordImage(wordImage : any) : Promise<any> {
    return this.collection.findOne({word : JSON.parse(wordImage).word } as unknown as FilterQuery<string>) 
    .then((wordImage: any) => {
      return wordImage;
    })
    .catch((error: Error) => {
      throw error;
    });
  }

  public async getAllWordImages() : Promise<any> {
    return this.collection.find({}).toArray()  // filter pour username
    .then((wordImages: any) => {
      return wordImages;
    })
    .catch((error: Error) => {
      throw error;
    });
  }

  public async getAllWords() : Promise<any> {
    return this.collection.find({}, {projection: {_id: 0, word: 1}}).toArray()  // filter pour username
    .then((wordImages: any) => {
      let array: any[] = [];
      for (let element of wordImages) {
        array.push(element.word);
      }
      return array;
    })
    .catch((error: Error) => {
      throw error;
    });
  }
}
