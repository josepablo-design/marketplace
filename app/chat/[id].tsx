import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../services/supabase';

export default function ChatRoomScreen() {
    const { id } = useLocalSearchParams();
    const { session } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (id) {
            fetchMessages();
            const subscription = supabase
                .channel(`chat:${id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${id}` }, (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                })
                .subscribe();

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [id]);

    async function fetchMessages() {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function sendMessage() {
        if (!newMessage.trim()) return;

        try {
            const { error } = await supabase.from('messages').insert({
                conversation_id: id,
                sender_id: session?.user.id,
                content: newMessage.trim(),
            });

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {loading ? (
                <ActivityIndicator className="flex-1" />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => {
                        const isMe = item.sender_id === session?.user.id;
                        return (
                            <View className={`mb-3 max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}>
                                <View className={`p-3 rounded-2xl ${isMe ? 'bg-blue-600 rounded-tr-none' : 'bg-white rounded-tl-none shadow-sm'}`}>
                                    <Text className={`${isMe ? 'text-white' : 'text-gray-800'} text-base`}>{item.content}</Text>
                                </View>
                                <Text className="text-xs text-gray-400 mt-1 px-1">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </View>
                        );
                    }}
                />
            )}

            <View className="p-4 bg-white border-t border-gray-100 flex-row items-center safe-area-bottom">
                <TextInput
                    className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3 text-base"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    className="bg-blue-600 h-12 w-12 rounded-full items-center justify-center"
                    disabled={!newMessage.trim()}
                >
                    <FontAwesome name="send" size={20} color="white" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
