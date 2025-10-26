/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponseDto } from '../models/MessageResponseDto';
import type { SendDirectMessageDto } from '../models/SendDirectMessageDto';
import type { SendGeneralMessageDto } from '../models/SendGeneralMessageDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * Envoyer un message dans le chat général
     * @param requestBody
     * @returns MessageResponseDto Message envoyé
     * @throws ApiError
     */
    public static chatControllerSendGeneralMessage(
        requestBody: SendGeneralMessageDto,
    ): CancelablePromise<MessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/general',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Récupérer les messages du chat général
     * @returns MessageResponseDto Liste des messages
     * @throws ApiError
     */
    public static chatControllerGetGeneralMessages(): CancelablePromise<Array<MessageResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/general',
        });
    }
    /**
     * Envoyer un message direct
     * @param requestBody
     * @returns MessageResponseDto Message envoyé
     * @throws ApiError
     */
    public static chatControllerSendDirectMessage(
        requestBody: SendDirectMessageDto,
    ): CancelablePromise<MessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/direct',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Récupérer une conversation avec un utilisateur
     * @param otherUserId ID de l'autre utilisateur
     * @returns MessageResponseDto Messages de la conversation
     * @throws ApiError
     */
    public static chatControllerGetConversation(
        otherUserId: number,
    ): CancelablePromise<Array<MessageResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/conversation/{otherUserId}',
            path: {
                'otherUserId': otherUserId,
            },
        });
    }
    /**
     * Récupérer toutes les conversations de l'utilisateur
     * @returns any Liste des conversations
     * @throws ApiError
     */
    public static chatControllerGetConversations(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/conversations',
        });
    }
    /**
     * Marquer un message comme lu
     * @param messageId ID du message
     * @returns any Message marqué comme lu
     * @throws ApiError
     */
    public static chatControllerMarkAsRead(
        messageId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/mark-read/{messageId}',
            path: {
                'messageId': messageId,
            },
        });
    }
}
