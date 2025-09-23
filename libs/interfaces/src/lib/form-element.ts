import { EntityType, FormInputElement } from "@cricket-analysis-monorepo/constants";

export interface IFormInput {
    label: string;
    key: string;
    elementType: FormInputElement;
    isShowCreateOption: boolean;
    options: string[];
    id: string;
}

export interface ICachedInput {
    referenceKey: string;
    referenceValue: string;
    collectionName: string;
    entityType: EntityType;
    inputs?: IFormInput[];
    fileId: string;
    [keyname: string]: string | boolean | IFormInput[] | Record<string, string> | undefined;
}