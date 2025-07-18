import express from 'express';
import { Document, Model, Schema } from 'mongoose';

// Express types
type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;
type Router = express.Router;

// Types
export interface RestfulOptions {
  prefix?: string;
  version?: string;
  lean?: boolean;
  findOneAndUpdate?: boolean;
  findOneAndRemove?: boolean;
  listProjection?: string;
  detailProjection?: string;
  allowed?: string[];
  protected?: string[];
  populate?: string | string[];
}

export interface RestfulMethods {
  get?: boolean;
  post?: boolean;
  put?: boolean;
  delete?: boolean;
  patch?: boolean;
}

export interface QueryParams {
  limit?: number;
  skip?: number;
  sort?: string;
  select?: string;
  populate?: string;
  [key: string]: any;
}

export interface RestfulMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

export interface RestfulResource<T extends Document = Document> {
  model: Model<T>;
  options: RestfulOptions;
  methods: RestfulMethods;
  
  // Middleware methods
  before(method: string | string[], middleware: RestfulMiddleware | RestfulMiddleware[]): RestfulResource<T>;
  after(method: string | string[], middleware: RestfulMiddleware | RestfulMiddleware[]): RestfulResource<T>;
  
  // HTTP method handlers
  index(req: Request, res: Response, next: NextFunction): Promise<void>;
  show(req: Request, res: Response, next: NextFunction): Promise<void>;
  store(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  destroy(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Route setup
  serve(path: string, app: any, methods?: RestfulMethods): Router;
}

// Main RestfulResource Class
export class RestfulResource<T extends Document = Document> implements RestfulResource<T> {
  public model: Model<T>;
  public options: RestfulOptions;
  public methods: RestfulMethods;
  private beforeMiddleware: Map<string, RestfulMiddleware[]> = new Map();
  private afterMiddleware: Map<string, RestfulMiddleware[]> = new Map();

  constructor(model: Model<T>, options: RestfulOptions = {}) {
    this.model = model;
    this.options = {
      lean: true,
      findOneAndUpdate: true,
      findOneAndRemove: true,
      listProjection: '',
      detailProjection: '',
      allowed: [],
      protected: [],
      populate: '',
      ...options
    };
    this.methods = {
      get: true,
      post: true,
      put: true,
      delete: true,
      patch: true
    };
  }

  // Middleware registration
  before(method: string | string[], middleware: RestfulMiddleware | RestfulMiddleware[]): RestfulResource<T> {
    const methods = Array.isArray(method) ? method : [method];
    const middlewares = Array.isArray(middleware) ? middleware : [middleware];
    
    methods.forEach(m => {
      if (!this.beforeMiddleware.has(m)) {
        this.beforeMiddleware.set(m, []);
      }
      this.beforeMiddleware.get(m)!.push(...middlewares);
    });
    
    return this;
  }

  after(method: string | string[], middleware: RestfulMiddleware | RestfulMiddleware[]): RestfulResource<T> {
    const methods = Array.isArray(method) ? method : [method];
    const middlewares = Array.isArray(middleware) ? middleware : [middleware];
    
    methods.forEach(m => {
      if (!this.afterMiddleware.has(m)) {
        this.afterMiddleware.set(m, []);
      }
      this.afterMiddleware.get(m)!.push(...middlewares);
    });
    
    return this;
  }

  // HTTP Method Handlers
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = this.buildQuery(req.query as QueryParams);
      const options = this.buildQueryOptions(req.query as QueryParams);
      
      let mongoQuery: any = this.model.find(query, this.options.listProjection);
      
      if (options.sort) mongoQuery = mongoQuery.sort(options.sort);
      if (options.limit) mongoQuery = mongoQuery.limit(options.limit);
      if (options.skip) mongoQuery = mongoQuery.skip(options.skip);
      if (options.select) mongoQuery = mongoQuery.select(options.select);
      if (options.populate) mongoQuery = mongoQuery.populate(options.populate);
      if (this.options.lean) mongoQuery = mongoQuery.lean();

      const results = await mongoQuery.exec();
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = this.buildQuery({ _id: req.params.id });
      let mongoQuery: any = this.model.findOne(query, this.options.detailProjection);
      
      if (this.options.populate) mongoQuery = mongoQuery.populate(this.options.populate);
      if (this.options.lean) mongoQuery = mongoQuery.lean();

      const result = await mongoQuery.exec();
      
      if (!result) {
        res.status(404).json({ message: 'Resource not found' });
      }
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = this.filterData(req.body);
      const document = new this.model(data);
      const result = await document.save();
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = this.buildQuery({ _id: req.params.id });
      const data = this.filterData(req.body);
      
      const options = {
        new: true,
        runValidators: true,
        lean: this.options.lean
      };

      const result = this.options.findOneAndUpdate
        ? await this.model.findOneAndUpdate(query, data, options)
        : await this.model.findByIdAndUpdate(req.params.id, data, options);
      
      if (!result) {
        res.status(404).json({ message: 'Resource not found' });
      }
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = this.buildQuery({ _id: req.params.id });
      
      const result = this.options.findOneAndRemove
        ? await this.model.findOneAndDelete(query)
        : await this.model.findByIdAndDelete(req.params.id);
      
      if (!result) {
        res.status(404).json({ message: 'Resource not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Route setup
  serve(app: any, path: string, methods: RestfulMethods = this.methods): express.Router {
    const router = express.Router();
    
    // List - GET /resource
    if (methods.get) {
      router.get('/', 
        ...this.getMiddleware('index', 'before'),
        this.index.bind(this),
        ...this.getMiddleware('index', 'after')
      );
    }
    
    // Show - GET /resource/:id
    if (methods.get) {
      router.get('/:id', 
        ...this.getMiddleware('show', 'before'),
        this.show.bind(this),
        ...this.getMiddleware('show', 'after')
      );
    }
    
    // Create - POST /resource
    if (methods.post) {
      router.post('/', 
        ...this.getMiddleware('store', 'before'),
        this.store.bind(this),
        ...this.getMiddleware('store', 'after')
      );
    }
    
    // Update - PUT /resource/:id
    if (methods.put) {
      router.put('/:id', 
        ...this.getMiddleware('update', 'before'),
        this.update.bind(this),
        ...this.getMiddleware('update', 'after')
      );
    }
    
    // Patch - PATCH /resource/:id
    if (methods.patch) {
      router.patch('/:id', 
        ...this.getMiddleware('update', 'before'),
        this.update.bind(this),
        ...this.getMiddleware('update', 'after')
      );
    }
    
    // Delete - DELETE /resource/:id
    if (methods.delete) {
      router.delete('/:id', 
        ...this.getMiddleware('destroy', 'before'),
        this.destroy.bind(this),
        ...this.getMiddleware('destroy', 'after')
      );
    }
    
    // Mount the router
    app.use(path, router);
    
    return router;
  }

  // Helper methods
  private buildQuery(params: QueryParams): any {
    const query: any = {};
    
    Object.keys(params).forEach(key => {
      if (!['limit', 'skip', 'sort', 'select', 'populate'].includes(key)) {
        query[key] = params[key];
      }
    });
    
    return query;
  }

  private buildQueryOptions(params: QueryParams): any {
    return {
      limit: params.limit ? parseInt(params.limit.toString()) : undefined,
      skip: params.skip ? parseInt(params.skip.toString()) : undefined,
      sort: params.sort,
      select: params.select,
      populate: params.populate || this.options.populate
    };
  }

  private filterData(data: any): any {
    if (!this.options.allowed && !this.options.protected) {
      return data;
    }
    
    const filtered: any = {};
    
    if (this.options.allowed && this.options.allowed.length > 0) {
      this.options.allowed.forEach(field => {
        if (data[field] !== undefined) {
          filtered[field] = data[field];
        }
      });
    } else {
      Object.keys(data).forEach(key => {
        if (!this.options.protected?.includes(key)) {
          filtered[key] = data[key];
        }
      });
    }
    
    return filtered;
  }

  private getMiddleware(method: string, type: 'before' | 'after'): RestfulMiddleware[] {
    const middlewareMap = type === 'before' ? this.beforeMiddleware : this.afterMiddleware;
    return middlewareMap.get(method) || [];
  }
}

// Factory function
export function resource<T extends Document = Document>(
  model: Model<T>, 
  options: RestfulOptions = {}
): RestfulResource<T> {
  return new RestfulResource<T>(model, options);
}

// Default export
export default resource;

// Usage example types
export interface ExampleUser extends Document {
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

// Example usage:
/*
import express from 'express';
import mongoose from 'mongoose';
import resource from './node-restful';

const app = express();
app.use(express.json());

// Define a Mongoose model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 }
}, { timestamps: true });

const User = mongoose.model<ExampleUser>('User', UserSchema);

// Create a RESTful resource
const userResource = resource(User, {
  allowed: ['name', 'email', 'age'],
  populate: 'posts'
});

// Add middleware
userResource.before('store', (req, res, next) => {
  console.log('Before creating user:', req.body);
  next();
});

userResource.after('index', (req, res, next) => {
  console.log('After listing users');
  next();
});

// Serve the resource
userResource.serve('/api/users', app);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
*/