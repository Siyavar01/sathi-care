import { useEffect, useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useForumStore from '../features/forum/forumSlice';
import { Switch } from '@headlessui/react';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activePost, isLoading, isError, message, getPostById, createComment, addCommentRealTime, reset } = useForumStore();

  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (id) {
      getPostById(id);
    }

    socket.on('newComment', (comment) => {
      if (comment.post === id) {
        addCommentRealTime(comment);
      }
    });

    return () => {
      reset();
      socket.off('newComment');
    };
  }, [id, getPostById, addCommentRealTime, reset]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to comment.');
      return;
    }
    if (!newComment.trim()) {
        toast.error('Comment cannot be empty.');
        return;
    }
    if(id) {
        await createComment(id, { content: newComment, isAnonymous }, user.token);
        setNewComment('');
        setIsAnonymous(false);
    }
  };

  if (isLoading || !activePost) {
    return <div className="flex h-screen items-center justify-center bg-brand-cream">Loading post...</div>;
  }

  if (isError) {
      return <div className="flex h-screen items-center justify-center bg-brand-cream"><p className="text-red-500">{message}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">{activePost.title}</h1>
            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                <span>by</span>
                <span className="font-semibold text-pastel-purple">{activePost.user.name}</span>
                <span>•</span>
                <span>{format(new Date(activePost.createdAt), 'MMMM do, yyyy')}</span>
            </div>
            <p className="mt-6 whitespace-pre-wrap text-gray-800">{activePost.content}</p>
        </div>

        <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <h2 className="text-xl font-semibold text-brand-charcoal">Comments ({activePost.comments.length})</h2>
            <div className="mt-4 space-y-4">
                {activePost.comments.map(comment => (
                    <div key={comment._id} className="rounded-lg bg-gray-50/50 p-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="font-semibold text-pastel-purple">{comment.user.name}</span>
                            <span>•</span>
                            <span>{format(new Date(comment.createdAt), 'h:mm a')}</span>
                        </div>
                        <p className="mt-2 text-gray-800">{comment.content}</p>
                    </div>
                ))}
            </div>

            {user && (
                 <form onSubmit={handleCreateComment} className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-brand-charcoal">Add Your Comment</h3>
                     <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} required rows={4} className="mt-2 w-full rounded-lg border-gray-300" placeholder="Share your thoughts..."></textarea>
                     <div className="mt-4 flex items-center justify-between">
                        <Switch.Group as="div" className="flex items-center">
                            <Switch checked={isAnonymous} onChange={setIsAnonymous} className={`${isAnonymous ? 'bg-pastel-purple' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                                <span className={`${isAnonymous ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                            <Switch.Label className="ml-4 text-sm text-brand-charcoal">Comment Anonymously</Switch.Label>
                        </Switch.Group>
                        <button type="submit" className="rounded-lg bg-pastel-pink px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pastel-pink/80">Submit Comment</button>
                    </div>
                 </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;