
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { User, Message as MessageType, Conversation, Doctor, Patient } from '@/types';
import { Send, Search, Clock } from 'lucide-react';
import { format } from 'date-fns';

// Mock users for recipient selection with Indian names
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'doctor',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Patel',
    email: 'rajesh.patel@example.com',
    role: 'doctor',
  },
  {
    id: '3',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    role: 'patient',
  },
  {
    id: '4',
    name: 'Meera Gupta',
    email: 'meera.gupta@example.com',
    role: 'patient',
  },
];

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantIds: ['1', '3'],
    lastMessage: {
      id: '101',
      senderId: '1',
      receiverId: '3',
      content: 'How are you feeling today, Arjun?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    participantIds: ['2', '4'],
    lastMessage: {
      id: '201',
      senderId: '4',
      receiverId: '2',
      content: 'I have some questions about my medication.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
    },
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// Mock messages data
const mockMessages: { [conversationId: string]: MessageType[] } = {
  '1': [
    {
      id: '101',
      senderId: '1',
      receiverId: '3',
      content: 'How are you feeling today, Arjun?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: '102',
      senderId: '3',
      receiverId: '1',
      content: 'I\'m feeling much better, thank you Dr. Sharma. The medication is helping with the pain.',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true,
    },
    {
      id: '103',
      senderId: '1',
      receiverId: '3',
      content: 'That\'s great to hear! Remember to keep taking it as prescribed and let me know if any side effects appear.',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true,
    },
  ],
  '2': [
    {
      id: '201',
      senderId: '4',
      receiverId: '2',
      content: 'I have some questions about my medication.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
    },
  ],
};

const Messages = () => {
  const { id: targetUserId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [possibleRecipients, setPossibleRecipients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching conversations
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would make an API call here
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!user) return;
        
        // Filter conversations by user ID
        const userConversations = mockConversations.filter(
          conv => conv.participantIds.includes(user.id)
        );
        
        setConversations(userConversations);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load conversations.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simulate fetching possible recipients
    const fetchPossibleRecipients = async () => {
      try {
        // In a real app, we would make an API call here
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!user) return;
        
        // Filter users by role (doctors see patients, patients see doctors)
        const recipientRole = user.role === 'doctor' ? 'patient' : 'doctor';
        const recipients = mockUsers.filter(u => u.role === recipientRole);
        
        setPossibleRecipients(recipients);
        
        // If targetUserId is specified, set the selected user
        if (targetUserId) {
          const target = recipients.find(u => u.id === targetUserId) || null;
          setSelectedUser(target);
          
          // Find or create a conversation with this user
          const existingConv = mockConversations.find(
            conv => conv.participantIds.includes(user.id) && conv.participantIds.includes(targetUserId)
          );
          
          if (existingConv) {
            setActiveConversation(existingConv);
            setMessages(mockMessages[existingConv.id] || []);
          } else {
            // In a real app, we would create a new conversation here
            const newConv: Conversation = {
              id: `new-${Date.now()}`,
              participantIds: [user.id, targetUserId],
              updatedAt: new Date().toISOString(),
            };
            setActiveConversation(newConv);
            setMessages([]);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recipients.",
          variant: "destructive",
        });
      }
    };
    
    fetchConversations();
    fetchPossibleRecipients();
  }, [user, targetUserId, toast]);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    
    // Find the other participant
    const otherParticipantId = conversation.participantIds.find(id => id !== user?.id) || '';
    const otherUser = mockUsers.find(u => u.id === otherParticipantId) || null;
    setSelectedUser(otherUser);
    
    // Load messages for this conversation
    setMessages(mockMessages[conversation.id] || []);
    
    // In a real app, we would mark messages as read here
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !selectedUser) return;
    
    // In a real app, we would send the message to the API
    const newMsg: MessageType = {
      id: `new-${Date.now()}`,
      senderId: user.id,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Update UI optimistically
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: `Your message to ${selectedUser.name} has been sent.`,
    });
  };

  const handleStartNewConversation = (recipient: User) => {
    setSelectedUser(recipient);
    
    // Check if a conversation already exists
    const existingConv = conversations.find(
      conv => conv.participantIds.includes(user?.id || '') && conv.participantIds.includes(recipient.id)
    );
    
    if (existingConv) {
      setActiveConversation(existingConv);
      setMessages(mockMessages[existingConv.id] || []);
    } else {
      // In a real app, we would create a new conversation here
      const newConv: Conversation = {
        id: `new-${Date.now()}`,
        participantIds: [user?.id || '', recipient.id],
        updatedAt: new Date().toISOString(),
      };
      setActiveConversation(newConv);
      setMessages([]);
    }
  };

  // Filter recipients based on search term
  const filteredRecipients = possibleRecipients.filter(
    recipient => recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations sidebar */}
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search recipients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-center text-gray-500 py-4">Loading conversations...</p>
                ) : (
                  <>
                    {/* Existing conversations */}
                    {conversations.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Recent</h3>
                        
                        {conversations.map(conversation => {
                          const otherParticipantId = conversation.participantIds.find(id => id !== user?.id) || '';
                          const otherUser = mockUsers.find(u => u.id === otherParticipantId);
                          
                          if (!otherUser) return null;
                          
                          return (
                            <div 
                              key={conversation.id}
                              onClick={() => handleSelectConversation(conversation)}
                              className={`p-3 rounded-md cursor-pointer ${
                                activeConversation?.id === conversation.id 
                                  ? 'bg-healthcare-100 border-healthcare-500' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium">{otherUser.name}</span>
                                {conversation.lastMessage && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    {format(new Date(conversation.lastMessage.timestamp), 'h:mm a')}
                                  </span>
                                )}
                              </div>
                              
                              {conversation.lastMessage && (
                                <p className="text-sm text-gray-600 truncate mt-1">
                                  {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                                  {conversation.lastMessage.content}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                    
                    {/* New conversation options */}
                    {filteredRecipients.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Start New Conversation</h3>
                        
                        {filteredRecipients.map(recipient => (
                          <div 
                            key={recipient.id}
                            onClick={() => handleStartNewConversation(recipient)}
                            className={`p-3 rounded-md cursor-pointer ${
                              selectedUser?.id === recipient.id 
                                ? 'bg-healthcare-100 border-healthcare-500' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{recipient.name}</span>
                              <span className="text-xs text-gray-500 capitalize">{recipient.role}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{recipient.email}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {filteredRecipients.length === 0 && searchTerm && (
                      <p className="text-center text-gray-500 py-4">No recipients found matching "{searchTerm}"</p>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Message area */}
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            {selectedUser ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-xl">{selectedUser.name}</CardTitle>
                  <p className="text-sm text-gray-500 capitalize">{selectedUser.role}</p>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-2">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      messages.map(message => {
                        const isCurrentUser = message.senderId === user?.id;
                        
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[75%] rounded-lg p-3 ${
                                isCurrentUser 
                                  ? 'bg-healthcare-500 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {format(new Date(message.timestamp), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="healthcare-gradient text-white"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">Select a conversation or start a new one</p>
                <Button 
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                >
                  Browse All Recipients
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
