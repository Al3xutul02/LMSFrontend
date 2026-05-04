import { Injectable } from "@angular/core";
import { ImageCategory, env } from "../../../environment";

@Injectable({ providedIn: 'root'})
export class AssetService {
    public getImagePath(path: ImageCategory, imageName: string): string {
        return `${env.imagePaths[path]}/${imageName}`;
    }
}