export type NoteDurationType = '32nd' | '16th' | '8th' | 'quarter' | 'half' | 'whole'

export function getDuration(type: NoteDurationType) {
    switch (type) {
        case '32nd': return 1/32;
        case '16th': return 1/16;
        case '8th': return 1/8;
        case 'quarter': return 1/4;
        case 'half': return 1/2;
        case 'whole': return 1;
    }
}