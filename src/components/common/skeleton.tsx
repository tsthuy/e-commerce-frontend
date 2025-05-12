import { memo } from 'react';

import type { SkeletonProps } from 'react-loading-skeleton';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

export const CustomSkeleton = memo((props: SkeletonProps) => <Skeleton {...props} />);
