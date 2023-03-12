import { SetMetadata } from '@nestjs/common';
import { USE_AUTH_METADATA } from './constants/app.constants';

export const DisableAuth = () => SetMetadata(USE_AUTH_METADATA, false)