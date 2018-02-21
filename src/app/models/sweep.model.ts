import { SocialMedia } from './social-media.enum';

export interface ISweep {
    id: number;
    name: string;
    url: string;
    endDate: Date;
    recurring: {
        needed: boolean;
        daysBetweenEntries: number;
    };
    share: {
        needed: boolean;
        daysBetweenShares: number;
        shareUrl: string;
        postMessage: string;
        mediaOutlets: SocialMedia[];
    };
}
