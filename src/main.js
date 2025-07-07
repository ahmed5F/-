import { 
  signUp, 
  signIn, 
  logout, 
  onAuthStateChangedListener 
} from './auth.js';
import { 
  addPost, 
  getPosts, 
  addComment, 
  likePost 
} from './database.js';
import { 
  uploadImage, 
  uploadVideo, 
  uploadAudio 
} from './storage.js';
import { 
  initCall, 
  startCall, 
  endCall 
} from './webrtc.js';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
  // مراقبة حالة المصادقة
  onAuthStateChangedListener((user) => {
    if (user) {
      setupAuthenticatedUI(user);
      loadPosts();
    } else {
      setupUnauthenticatedUI();
    }
  });
  
  // معالجة النمط الداكن
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', toggleTheme);
  
  // تهيئة Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

// تحميل المنشورات
function loadPosts() {
  getPosts((posts) => {
    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
  });
}

// إنشاء عنصر منشور
function createPostElement(post) {
  const postElement = document.createElement('div');
  postElement.className = 'post';
  postElement.innerHTML = `
    <div class="post-header">
      <img src="${post.userAvatar || 'https://via.placeholder.com/40'}" class="user-avatar">
      <div class="user-info">
        <h4>${post.username}</h4>
        <span class="post-time">${formatDate(post.createdAt)}</span>
      </div>
    </div>
    <div class="post-content">
      <p>${post.content}</p>
      ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image">` : ''}
    </div>
    <div class="post-actions">
      <button class="like-btn" data-post-id="${post.id}">
        <i class="fas fa-thumbs-up"></i> ${post.likes.length}
      </button>
      <button class="comment-btn">
        <i class="fas fa-comment"></i> ${post.comments.length}
      </button>
      <button class="share-btn">
        <i class="fas fa-share"></i> مشاركة
      </button>
    </div>
  `;
  
  return postElement;
}

// تبديل النمط الداكن
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  
  if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}
