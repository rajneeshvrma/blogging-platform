import Post from '../models/Post.js';

// @desc    Create a new post
export const createPost = async (req, res) => {
  const { title, content, category, image } = req.body;

  try {
    const post = new Post({
      title,
      content,
      category,
      image,
      user: req.user._id, // From the 'protect' middleware
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate('user', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name');

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user deleting the post is the one who created it
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};
// ... (inside postController.js)

// @desc    Update a post
export const updatePost = async (req, res) => {
    const { title, content, category, image } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user updating the post is the one who created it
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.image = image || post.image;

        const updatedPost = await post.save();
        res.json(updatedPost);

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Like/Unlike a post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post has already been liked by this user
        if (post.likes.includes(req.user._id)) {
            // If yes, unlike it
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            // If no, like it
            post.likes.push(req.user._id);
        }

        const updatedPost = await post.save();
        res.json(updatedPost);

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};