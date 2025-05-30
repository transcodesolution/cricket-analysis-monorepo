import { FormInputElement } from "@cricket-analysis-monorepo/constants";

export interface IFormInput {
    label: string;
    key: string;
    elementType: FormInputElement;
    options: string[];
}

export interface ICachedInput {
    referenceKey: string;
    referenceValue: string;
    collectionName: string;
    [keyname: string]: string | IFormInput[] | Record<string, string>;
}