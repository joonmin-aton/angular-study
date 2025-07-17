import { Router } from 'express';
import { Model } from 'mongoose';


export default class RestfulUtil {
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
        console.log(req);
        const existing = await this.schema.findOne({ email: req.body.email });
        if (existing) {
          return res.status(400).json({ message: `${this.name} already exists` });
        }
        const product = new this.schema(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
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