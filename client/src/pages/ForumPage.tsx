import { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useForumStore from '../features/forum/forumSlice';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const ForumPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { posts, isLoading, isError, message, getAllPosts, createPost, addPostRealTime } = useForumStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    getAllPosts();

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('newPost', (post) => {
      addPostRealTime(post);
    });

    return () => {
      socket.off('connect');
      socket.off('newPost');
    };
  }, [getAllPosts, addPostRealTime]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to post.');
      return;
    }
    await createPost({ ...newPost, isAnonymous }, user.token);
    setNewPost({ title: '', content: '' });
    setIsAnonymous(false);
    setIsModalOpen(false);
    toast.success('Your post has been shared.');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">Community Forum</h1>
              <p className="mt-1 text-gray-600">A safe space to share and connect.</p>
            </div>
            <button
              onClick={() => user ? setIsModalOpen(true) : navigate('/login')}
              className="rounded-lg bg-pastel-pink px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Create Post
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {isLoading && <p className="text-center">Loading posts...</p>}
            {isError && <p className="text-center text-red-500">{message}</p>}
            {posts.map(post => (
              <Link to={`/forum/${post._id}`} key={post._id} className="block rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-xl ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-brand-charcoal">{post.title}</h2>
                    <span className="text-xs text-gray-500">{post.comments.length} comments</span>
                </div>
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                    <span>by</span>
                    <span className="font-semibold text-pastel-purple">{post.user.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white/80 p-6 text-left align-middle shadow-xl backdrop-blur-xl ring-1 ring-black/5 transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-brand-charcoal">
                    Create a New Post
                  </Dialog.Title>
                  <form onSubmit={handleCreatePost} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="title" className="sr-only">Title</label>
                        <input type="text" name="title" id="title" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} required className="w-full rounded-lg border-gray-300" placeholder="Post Title"/>
                    </div>
                    <div>
                        <label htmlFor="content" className="sr-only">Content</label>
                        <textarea name="content" id="content" value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} required rows={5} className="w-full rounded-lg border-gray-300" placeholder="Share your thoughts..."></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                        <Switch.Group as="div" className="flex items-center">
                            <Switch checked={isAnonymous} onChange={setIsAnonymous} className={`${isAnonymous ? 'bg-pastel-purple' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                                <span className={`${isAnonymous ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </Switch>
                            <Switch.Label className="ml-4 text-sm text-brand-charcoal">Post Anonymously</Switch.Label>
                        </Switch.Group>
                        <div className="space-x-2">
                           <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cancel</button>
                           <button type="submit" className="rounded-lg bg-pastel-pink px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pastel-pink/80">Submit Post</button>
                        </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ForumPage;