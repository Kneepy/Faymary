import { SetMetadata } from '@nestjs/common';
import { USE_AUTH_METADATA } from './app.constants';

export const DisableAuth = () => SetMetadata(USE_AUTH_METADATA, false)