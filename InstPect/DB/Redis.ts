import * as Redis from 'handy-redis';
import { DB } from '../Config';

export = Redis.createHandyClient(DB.Redis);