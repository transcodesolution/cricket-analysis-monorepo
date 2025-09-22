import { ReadStream } from "fs";

export interface IMulterFileObject extends Pick<Express.Multer.File, "filename" | "buffer"> {
    readStream: ReadStream;
}