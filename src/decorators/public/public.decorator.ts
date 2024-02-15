import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from 'src/common/constants/public.constant';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
