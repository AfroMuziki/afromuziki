const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
const winston = require('winston');
const NodeCache = require('node-cache');

dotenv.config();

// ============ CONFIGURATION ============
const app = express();
const PORT = process.env.PORT || 5000;
const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure Cloudinary storage for uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const resourceType = file.mimetype.startsWith('audio/') ? 'video' : 
                        file.mimetype.startsWith('video/') ? 'video' : 'image';
    return {
      folder: `afromuziki/${req.userId || 'public'}`,
      resource_type: resourceType,
      format: resourceType === 'video' ? 'mp4' : resourceType === 'image' ? 'webp' : 'mp3',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    };
  }
});

const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// ============ MIDDLEWARE ============
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://res.cloudinary.com"],
      mediaSrc: ["'self'", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(compression());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests' }
});
app.use('/api/', limiter);

// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      status: 'operational', 
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    } 
  });
});

// ============ CONTENT ENDPOINTS ============

// Get all published content with pagination and filtering
app.get('/api/content', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const genre = req.query.genre;
    const type = req.query.type;
    const sort = req.query.sort || 'trending';

    let query = supabase
      .from('content')
      .select(`
        *,
        artist:profiles!artist_id(id, username, full_name, avatar_url),
        likes_count,
        comments_count,
        downloads_count
      `, { count: 'exact' })
      .eq('status', 'published')
      .range(offset, offset + limit - 1);

    if (genre && genre !== 'all') query = query.eq('genre', genre);
    if (type && type !== 'all') query = query.eq('type', type);

    switch (sort) {
      case 'trending': query = query.order('views', { ascending: false }); break;
      case 'popular': query = query.order('likes_count', { ascending: false }); break;
      case 'newest': query = query.order('published_at', { ascending: false }); break;
      default: query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    logger.error('Content fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch content' });
  }
});

// Get single content with streaming URL
app.get('/api/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `content_${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      await supabase.rpc('increment_views', { content_id: id });
      return res.json({ success: true, data: cached });
    }

    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        artist:profiles!artist_id(id, username, full_name, avatar_url, bio, followers_count),
        comments:comments(
          *,
          user:profiles!user_id(id, username, full_name, avatar_url),
          replies:comments(parent_id)
        ),
        likes:likes(user_id)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Generate optimized streaming URL
    let streamUrl = data.url;
    if (data.type === 'video') {
      streamUrl = cloudinary.url(data.cloudinary_public_id, {
        resource_type: 'video',
        transformation: [
          { quality: 'auto' },
          { streaming_profile: 'hd' }
        ],
        flags: 'streaming_attachment'
      });
    }

    const enrichedData = {
      ...data,
      stream_url: streamUrl,
      download_url: cloudinary.utils.sign_url(
        cloudinary.url(data.cloudinary_public_id, { resource_type: 'video' }),
        { expires_at: Math.floor(Date.now() / 1000) + 3600 }
      )
    };

    cache.set(cacheKey, enrichedData, 300);
    await supabase.rpc('increment_views', { content_id: id });
    
    res.json({ success: true, data: enrichedData });
  } catch (error) {
    logger.error('Content detail error:', error);
    res.status(500).json({ success: false, error: 'Content not found' });
  }
});

// Upload content (artist only)
app.post('/api/content/upload', authenticate, upload.fields([
  { name: 'content', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, type, genre, tags, isPremium } = req.body;
    const files = req.files;

    if (!files?.content || !files?.thumbnail) {
      return res.status(400).json({ success: false, error: 'Content and thumbnail required' });
    }

    const contentFile = files.content[0];
    const thumbnailFile = files.thumbnail[0];

    const { data: content, error } = await supabase
      .from('content')
      .insert({
        artist_id: req.userId,
        title,
        description,
        type,
        genre,
        tags: tags ? tags.split(',') : [],
        url: contentFile.path,
        thumbnail_url: thumbnailFile.path,
        cloudinary_public_id: contentFile.filename,
        is_premium: isPremium === 'true',
        status: 'published',
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    logger.info(`Content uploaded: ${title} by ${req.userId}`);
    res.json({ success: true, data: content });
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// Like/unlike content
app.post('/api/content/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: existing } = await supabase
      .from('likes')
      .select()
      .eq('user_id', req.userId)
      .eq('content_id', id)
      .single();

    if (existing) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', req.userId)
        .eq('content_id', id);
      return res.json({ success: true, data: { liked: false } });
    } else {
      await supabase
        .from('likes')
        .insert({ user_id: req.userId, content_id: id });
      return res.json({ success: true, data: { liked: true } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process like' });
  }
});

// Add comment
app.post('/api/content/:id/comments', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { body, parentId } = req.body;

    if (!body || body.length < 1 || body.length > 1000) {
      return res.status(400).json({ success: false, error: 'Comment must be 1-1000 characters' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: req.userId,
        content_id: id,
        parent_id: parentId || null,
        body
      })
      .select('*, user:profiles!user_id(id, username, full_name, avatar_url)')
      .single();

    if (error) throw error;

    // Create notification for content owner
    const { data: content } = await supabase
      .from('content')
      .select('artist_id')
      .eq('id', id)
      .single();

    if (content && content.artist_id !== req.userId) {
      await supabase
        .from('notifications')
        .insert({
          user_id: content.artist_id,
          type: 'comment',
          actor_id: req.userId,
          content_id: id,
          metadata: { comment_preview: body.substring(0, 100) }
        });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to post comment' });
  }
});

// ============ USER ENDPOINTS ============

// Get user profile with stats
app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        followers:follows!following_id(count),
        following:follows!follower_id(count),
        content:content( id, title, type, thumbnail_url, views, likes_count, created_at ),
        stats:content(count, views:views(sum))
      `)
      .eq('username', username)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'User not found' });
  }
});

// Follow/unfollow artist
app.post('/api/users/:id/follow', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
    }

    const { data: existing } = await supabase
      .from('follows')
      .select()
      .eq('follower_id', req.userId)
      .eq('following_id', id)
      .single();

    if (existing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', req.userId)
        .eq('following_id', id);
      return res.json({ success: true, data: { following: false } });
    } else {
      await supabase
        .from('follows')
        .insert({ follower_id: req.userId, following_id: id });
      
      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: id,
          type: 'follow',
          actor_id: req.userId
        });
      
      return res.json({ success: true, data: { following: true } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process follow' });
  }
});

// ============ PLAYLIST ENDPOINTS ============

// Get user playlists
app.get('/api/playlists', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        items:playlist_items(
          content:content(*, artist:profiles!artist_id(*))
        ),
        item_count:playlist_items(count)
      `)
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch playlists' });
  }
});

// Create playlist
app.post('/api/playlists', authenticate, async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;

    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: req.userId,
        title,
        description,
        is_public: isPublic !== false
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create playlist' });
  }
});

// Add to playlist
app.post('/api/playlists/:id/items', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { contentId } = req.body;

    const { data: playlist } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!playlist || playlist.user_id !== req.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('playlist_items')
      .insert({
        playlist_id: id,
        content_id: contentId,
        position: 0
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add to playlist' });
  }
});

// ============ ADMIN ENDPOINTS ============

// Admin: Get pending content (admin only)
app.get('/api/admin/content/pending', authenticate, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', req.userId)
      .single();

    if (!user?.is_admin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { data, error } = await supabase
      .from('content')
      .select('*, artist:profiles!artist_id(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pending content' });
  }
});

// Admin: Moderate content
app.put('/api/admin/content/:id/moderate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const { data: user } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', req.userId)
      .single();

    if (!user?.is_admin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { data, error } = await supabase
      .from('content')
      .update({
        status,
        rejection_reason: rejectionReason,
        moderated_at: new Date().toISOString(),
        moderated_by: req.userId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Notify artist
    await supabase
      .from('notifications')
      .insert({
        user_id: data.artist_id,
        type: status === 'published' ? 'approval' : 'rejection',
        content_id: id,
        metadata: { reason: rejectionReason }
      });

    logger.info(`Content ${id} moderated: ${status} by admin ${req.userId}`);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to moderate content' });
  }
});

// Admin: Platform analytics
app.get('/api/admin/analytics', authenticate, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', req.userId)
      .single();

    if (!user?.is_admin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const [totalUsers, totalContent, totalViews, totalLikes, recentActivity] = await Promise.all([
      supabase.from('profiles').select('count', { count: 'exact', head: true }),
      supabase.from('content').select('count', { count: 'exact', head: true }),
      supabase.from('content').select('views').then(r => r.data?.reduce((sum, c) => sum + (c.views || 0), 0) || 0),
      supabase.from('likes').select('count', { count: 'exact', head: true }),
      supabase.from('content').select('*').order('created_at', { ascending: false }).limit(10)
    ]);

    res.json({
      success: true,
      data: {
        total_users: totalUsers.count,
        total_content: totalContent.count,
        total_views: totalViews,
        total_likes: totalLikes.count,
        recent_uploads: recentActivity.data
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

// ============ NOTIFICATION ENDPOINTS ============

// Get user notifications
app.get('/api/notifications', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles!actor_id(id, username, full_name, avatar_url),
        content:content(id, title, type)
      `)
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

// Mark notifications as read
app.put('/api/notifications/read', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', req.userId)
      .eq('read', false);

    if (error) throw error;
    res.json({ success: true, data: { message: 'Notifications marked as read' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update notifications' });
  }
});

// ============ SEARCH ENDPOINT ============

app.get('/api/search', async (req, res) => {
  try {
    const { q, type, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res.json({ success: true, data: { content: [], artists: [] } });
    }

    const [contentResults, artistResults] = await Promise.all([
      supabase
        .from('content')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`)
        .limit(limit),
      supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
        .limit(limit)
    ]);

    res.json({
      success: true,
      data: {
        content: contentResults.data || [],
        artists: artistResults.data || [],
        query: q
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  logger.info(`AfroMuziki backend running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;