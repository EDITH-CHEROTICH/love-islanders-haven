
// Find and fix the spread type error on line 158
// Only updating the specific function with the error

const createMessage = async (matchId: string, content: string, contentType: string = 'text', mediaUrl: string = ''): Promise<any> => {
  if (!user?.id) return null;
  
  const newMessage = {
    match_id: matchId,
    sender_id: user.id,
    content,
    content_type: contentType,
    media_url: mediaUrl || null
  };
  
  try {
    // Instead of spreading an unknown type, explicitly set the fields
    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating message:", error);
    return null;
  }
};

