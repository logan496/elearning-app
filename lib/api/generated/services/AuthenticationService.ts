/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponseDto } from '../models/AuthResponseDto';
import type { LoginDto } from '../models/LoginDto';
import type { SignupDto } from '../models/SignupDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Inscription d'un nouvel utilisateur
     * @param requestBody
     * @returns AuthResponseDto Utilisateur créé avec succès
     * @throws ApiError
     */
    public static authControllerSignup(
        requestBody: SignupDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Email ou username déjà utilisé`,
            },
        });
    }
    /**
     * Connexion d'un utilisateur
     * @param requestBody
     * @returns AuthResponseDto Connexion réussie
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Email ou mot de passe incorrect`,
            },
        });
    }
}
