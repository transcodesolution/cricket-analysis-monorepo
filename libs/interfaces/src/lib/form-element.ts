import { EntityType, FormInputElement } from "@cricket-analysis-monorepo/constants";

export interface IFormInput {
    label: string;
    key: string;
    elementType: FormInputElement;
    isShowCreateOption: boolean;
    options: string[];
}

export interface ICachedInput {
    referenceKey: string;
    referenceValue: string;
    collectionName: string;
    entityType: EntityType;
    fileId: string;
    [keyname: string]: string | boolean | IFormInput[] | Record<string, string>;
}