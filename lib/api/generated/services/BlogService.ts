/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCommentDto } from '../models/CreateCommentDto';
import type { CreatePostDto } from '../models/CreatePostDto';
import type { UpdatePostDto } from '../models/UpdatePostDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BlogService {
    /**
     * Obtenir tous les articles publiés
     * @param page
     * @param limit
     * @param category
     * @param tag
     * @returns any
     * @throws ApiError
     */
    public static blogControllerGetAllPosts(
        page?: number,
        limit?: number,
        category?: string,
        tag?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/blog/posts',
            query: {
                'page': page,
                'limit': limit,
                'category': category,
                'tag': tag,
            },
        });
    }
    /**
     * Créer un article
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static blogControllerCreatePost(
        requestBody: CreatePostDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/blog/posts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir les articles populaires
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static blogControllerGetPopularPosts(
        limit: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/blog/posts/popular',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Rechercher des articles
     * @param q
     * @returns any
     * @throws ApiError
     */
    public static blogControllerSearchPosts(
        q: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/blog/posts/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Obtenir les articles par catégorie
     * @param category
     * @returns any
     * @throws ApiError
     */
    public static blogControllerGetPostsByCategory(
        category: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/blog/posts/category/{category}',
            path: {
                'category': category,
            },
        });
    }
    /**
     * Obtenir un article par slug
     * @param slug
     * @param userId
     * @returns any
     * @throws ApiError
     */
    public static blogControllerGetPostBySlug(
        slug: string,
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/blog/posts/{slug}',
            path: {
                'slug': slug,
            },
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * Obtenir mes articles
     * @returns any
     * @throws ApiError
     */
    public static blogControllerGetMyPosts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/blog/my/posts',
        });
    }
    /**
     * Mettre à jour un article
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static blogControllerUpdatePost(
        id: number,
        requestBody: UpdatePostDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/blog/posts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un article
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static blogControllerDeletePost(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/blog/posts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Publier un article
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static blogControllerPublishPost(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/blog/posts/{id}/publish',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Ajouter un commentaire
     * @param postId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static blogControllerAddComment(
        postId: number,
        requestBody: CreateCommentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/blog/posts/{postId}/comments',
            path: {
                'postId': postId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Modifier un commentaire
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static blogControllerUpdateComment(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/blog/comments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Supprimer un commentaire
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static blogControllerDeleteComment(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/blog/comments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Liker/Unliker un article
     * @param postId
     * @returns any
     * @throws ApiError
     */
    public static blogControllerToggleLike(
        postId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/blog/posts/{postId}/like',
            path: {
                'postId': postId,
            },
        });
    }
}
