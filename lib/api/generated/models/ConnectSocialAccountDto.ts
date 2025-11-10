/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ConnectSocialAccountDto = {
    platform: ConnectSocialAccountDto.platform;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    platformUserId?: string;
    platformUsername?: string;
};
export namespace ConnectSocialAccountDto {
    export enum platform {
        FACEBOOK = 'facebook',
        TWITTER = 'twitter',
        LINKEDIN = 'linkedin',
        INSTAGRAM = 'instagram',
    }
}

