

export interface IUpdateUserProfile {
    location ?: string
    secondaryEmail ?: string
}

export interface IUploadPhoto {
    fieldname : string
    originalname : string
    encoding : string
    mimetype : string
    destination : string
    path : string
    size : number
}