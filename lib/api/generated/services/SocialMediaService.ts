/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConnectSocialAccountDto } from '../models/ConnectSocialAccountDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SocialMediaService {
    /**
     * Obtenir mes comptes sociaux connectés
     * @returns any
     * @throws ApiError
     */
    public static socialControllerGetUserSocialAccounts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/accounts',
        });
    }
    /**
     * Connecter un compte de réseau social
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static socialControllerConnectSocialAccount(
        requestBody: ConnectSocialAccountDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/social/connect',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Déconnecter un compte de réseau social
     * @param platform facebook, twitter, linkedin
     * @returns any
     * @throws ApiError
     */
    public static socialControllerDisconnectSocialAccount(
        platform: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/social/disconnect/{platform}',
            path: {
                'platform': platform,
            },
        });
    }
    /**
     * Callback OAuth Facebook
     * @param code
     * @returns any
     * @throws ApiError
     */
    public static socialControllerFacebookCallback(
        code: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/auth/facebook/callback',
            query: {
                'code': code,
            },
        });
    }
    /**
     * Callback OAuth Twitter
     * @param oauthToken
     * @param oauthVerifier
     * @returns any
     * @throws ApiError
     */
    public static socialControllerTwitterCallback(
        oauthToken: string,
        oauthVerifier: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/auth/twitter/callback',
            query: {
                'oauth_token': oauthToken,
                'oauth_verifier': oauthVerifier,
            },
        });
    }
    /**
     * Callback OAuth LinkedIn
     * @param code
     * @returns any
     * @throws ApiError
     */
    public static socialControllerLinkedinCallback(
        code: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/auth/linkedin/callback',
            query: {
                'code': code,
            },
        });
    }
}
