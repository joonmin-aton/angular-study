import Express, { Router } from 'express';
import Mongoose, { Model } from 'mongoose';


export interface RestfulModel<T extends Mongoose.Document> extends Mongoose.Model<T> {
  methods(any: any): RestfulModel<T>;
  includeSchema(bool: boolean): RestfulModel<T>;
  preprocess(req: Request, res: Response, next?: Express.NextFunction) : any;
  detailRoute(req: Request, res: Response, next?: Express.NextFunction) : any;
  // filter(id: null|string, filters: Object, fromWeb: undefined|boolean, mongooseQuery?: Mongoose.Query<T>);
  filter(id: null | string, filters: Object, options: undefined | null | any) : any;
  register(app: Express.Application, path: string, aclPath?: string) : any;
  route(
    path: string,
    method: string | Function,
    fn?: Function | any
  ): RestfulModel<T>;
  routes: Object;
}


export class RestfulUtil {
  name: string;
  schema: Model<any>;

  constructor(name: string, schema: Model<any>) {
    this.name = name;
    this.schema = schema;
  }

  register = (router: Router, url: string) => {
    // 리스트 조회
    router.get(`${url}`, async (req, res) => {
      try {
        const list = await this.schema.find();
        res.json(list);
      } catch (err) {
        res.status(500).json({ message: err });
      }
    });

    // 상세 조회
    router.get(`${url}/:id`, async (req, res) => {
      try {
        const findOne = await this.schema.findById(req.params.id);
        if (findOne) res.json(findOne);
        else res.status(400).json({ message: `${this.name} not found` });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    });

    // INSERT
    router.post(`${url}`, async (req, res) => {
      try {
        const exist = await this.schema.findOne({ email: req.body.email });
        if (exist) {
          return res.status(400).json({ message: `${this.name} already exists` });
        }
        const newOne = new this.schema(req.body);
        const saved = await newOne.save();
        res.status(200).json(saved);
      } catch (err) {
        res.status(400).json({ message: err });
      }
    });

    // UPDATE
    router.put(`${url}/:id`, async (req, res) => {
      try {
        const updated = await this.schema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updated) res.json(updated);
        else res.status(400).json({ message: `${this.name} not found` });
      } catch (err) {
        res.status(400).json({ message: err });
      }
    });

    // DELETE
    router.delete(`${url}/:id`, async (req, res) => {
      try {
        const deleted = await this.schema.findByIdAndDelete(req.params.id);
        if (deleted) res.json({ message: 'Deleted successfully' });
        else res.status(400).json({ message: `${this.name} not found` });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    });
  }
}