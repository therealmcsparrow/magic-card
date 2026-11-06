import type { CardStatusModule } from '../contracts/card-status';
import { onDemandChunks } from '../utils/lazy-chunks';

/** The `status` chunk when it has installed, else undefined; never starts a load (the card does). */
export const statusIfLoaded = (): CardStatusModule | undefined => onDemandChunks.status.module() as CardStatusModule | undefined;
