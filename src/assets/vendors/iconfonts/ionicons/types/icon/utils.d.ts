export declare function getIconMap(): Map<string, string>;
export declare function addIcons(icons: {
    [name: string]: string;
}): void;
export declare function getName(name: string | undefined, mode: string | undefined, ios: string | undefined, md: string | undefined): string | null;
export declare function getSrc(src: string | undefined): string | null;
export declare function isSrc(str: string): boolean;
export declare function isValid(elm: HTMLElement): boolean;
