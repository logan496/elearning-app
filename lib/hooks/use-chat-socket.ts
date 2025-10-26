// lib/hooks/use-chat-socket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/contexts/auth-context';

interface GeneralMessage {
    id: number;
    content: string;
    createdAt: string;
    sender: {
        id: number;
        username: string;
        avatar: string;
    };
}

interface DirectMessage {
    id: number;
    content: string;
    createdAt: string;
    sender: {
        id: number;
        username: string;
        avatar: string;
    };
    recipient: {
        id: number;
        username: string;
    };
}

// ✅ Map pour tracer les messages en attente
const pendingMessages = new Map<string, number>();

// ✅ Récupérer l'URL depuis les variables d'environnement
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useChatSocket() {
    const { token } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

        // ✅ Utiliser l'URL configurée + le namespace /chat
        const socket = io(`${SOCKET_URL}/chat`, {
            auth: { token },
            transports: ['websocket', 'polling'], // ✅ Fallback sur polling
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Socket connected to', SOCKET_URL);
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error);
            setIsConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [token]);

    // ✅ Envoyer message général avec tracking
    const sendGeneralMessage = (content: string, tempId: string) => {
        if (socketRef.current) {
            console.log('📤 Sending general message with tempId:', tempId)
            pendingMessages.set(tempId, Date.now());
            socketRef.current.emit('message:general', { content, tempId });
        }
    };

    // ✅ Envoyer message direct avec tracking
    const sendDirectMessage = (recipientId: number, content: string, tempId: string) => {
        if (socketRef.current) {
            console.log('📤 Sending direct message to user', recipientId, 'with tempId:', tempId)
            pendingMessages.set(tempId, Date.now());
            socketRef.current.emit('message:direct', { recipientId, content, tempId });
        }
    };

    const startTyping = (conversationId?: number, isGeneral?: boolean) => {
        if (socketRef.current) {
            socketRef.current.emit('typing:start', { conversationId, isGeneral });
        }
    };

    const stopTyping = (conversationId?: number, isGeneral?: boolean) => {
        if (socketRef.current) {
            socketRef.current.emit('typing:stop', { conversationId, isGeneral });
        }
    };

    const onGeneralMessage = (callback: (message: GeneralMessage & { tempId?: string }) => void) => {
        if (socketRef.current) {
            socketRef.current.on('message:general:new', (message) => {
                if (message.tempId) {
                    pendingMessages.delete(message.tempId);
                }
                callback(message);
            });
        }
    };

    const onDirectMessage = (callback: (message: DirectMessage & { tempId?: string }) => void) => {
        if (socketRef.current) {
            socketRef.current.on('message:direct:new', (message) => {
                if (message.tempId) {
                    pendingMessages.delete(message.tempId);
                }
                callback(message);
            });
            socketRef.current.on('message:direct:sent', (message) => {
                if (message.tempId) {
                    pendingMessages.delete(message.tempId);
                }
                callback(message);
            });
        }
    };

    const onTyping = (callback: (data: { userId: number; isTyping: boolean }) => void) => {
        if (socketRef.current) {
            socketRef.current.on('typing:general', callback);
            socketRef.current.on('typing:direct', callback);
        }
    };

    const offGeneralMessage = () => {
        if (socketRef.current) {
            socketRef.current.off('message:general:new');
        }
    };

    const offDirectMessage = () => {
        if (socketRef.current) {
            socketRef.current.off('message:direct:new');
            socketRef.current.off('message:direct:sent');
        }
    };

    const offTyping = () => {
        if (socketRef.current) {
            socketRef.current.off('typing:general');
            socketRef.current.off('typing:direct');
        }
    };

    return {
        isConnected,
        sendGeneralMessage,
        sendDirectMessage,
        startTyping,
        stopTyping,
        onGeneralMessage,
        onDirectMessage,
        onTyping,
        offGeneralMessage,
        offDirectMessage,
        offTyping,
    };
}