import { getRepository } from 'typeorm';
import { createHash } from 'crypto';
import { IgApiClient, IgCheckpointError, AccountFollowersFeed } from 'instagram-private-api';

//import * as InstagramModel from '../Models/InstagramModel';

import { APIStatus } from '../Middleware/APIMiddleware';